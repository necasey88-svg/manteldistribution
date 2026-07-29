import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { manufacturingCatalog, manufacturingColor, manufacturingFinish } from "@/lib/data/manufacturing-map";
import {
  getProductBySku,
  type HearthOption,
  type ProductFinish,
} from "@/lib/data/products";
import {
  getDealerConfiguredPrice,
  getTierDiscountBps,
  type DealerPricingTier,
} from "@/lib/dealer-pricing";

// Clients send only sku + configuration + qty; product name and unit
// pricing are resolved server-side so a tampered request can't set its
// own price.
const PurchaseOrderSchema = z.object({
  lines: z
    .array(
      z.object({
        sku: z.string(),
        finish: z.string(),
        color: z.string(),
        hearth: z.enum(["No Hearth", "Ogee Edge Hearth", "Square Edge Hearth"]),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  notes: z.string().optional(),
  dealerPoNumber: z.string().trim().max(80).optional(),
  jobName: z.string().trim().max(120).optional(),
  shipTo: z.string().trim().max(500).optional(),
  requestedShipDate: z.string().trim().max(40).optional(),
});

function generatePoNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `PO-${stamp}`;
}

type PricedLine = {
  sku: string;
  finish: ProductFinish;
  color: string;
  hearth: HearthOption;
  qty: number;
  name: string;
  unitPriceCents: number;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = PurchaseOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid purchase order", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const unmapped = parsed.data.lines.find(
    (line) =>
      !manufacturingCatalog[line.sku] ||
      !manufacturingFinish[line.finish] ||
      (line.finish !== "Paint Grade" && !manufacturingColor[line.color])
  );
  if (unmapped) {
    return NextResponse.json({ error: `Product configuration cannot be sent to manufacturing: ${unmapped.sku}` }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: dealer, error: dealerError } = await supabase
    .from("dealers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (dealerError || !dealer) {
    return NextResponse.json(
      { error: "No dealer account found for this user." },
      { status: 403 }
    );
  }

  if (dealer.status !== "approved") {
    return NextResponse.json(
      { error: "Your dealer account must be approved before submitting orders." },
      { status: 403 }
    );
  }

  const tier = (dealer.pricing_tier ?? "approved") as DealerPricingTier;
  const discountBps = getTierDiscountBps(tier, dealer.discount_bps);
  const pricedLines: PricedLine[] = [];
  for (const line of parsed.data.lines) {
    const product = getProductBySku(line.sku);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product SKU: ${line.sku}` },
        { status: 400 }
      );
    }
    const finish = line.finish as ProductFinish;
    pricedLines.push({
      ...line,
      finish,
      name: product.name,
      unitPriceCents: getDealerConfiguredPrice(
        product,
        finish,
        line.hearth,
        discountBps
      ),
    });
  }

  const subtotalCents = pricedLines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.qty,
    0
  );

  const { data: po, error: poError } = await supabase
    .from("purchase_orders")
    .insert({
      dealer_id: dealer.id,
      po_number: generatePoNumber(),
      subtotal_cents: subtotalCents,
      dealer_po_number: parsed.data.dealerPoNumber || null,
      job_name: parsed.data.jobName || null,
      ship_to: parsed.data.shipTo || dealer.shipping_address || null,
      requested_ship_date: parsed.data.requestedShipDate || null,
      notes: parsed.data.notes ?? null,
    })
    .select()
    .single();

  if (poError || !po) {
    console.error("purchase order insert failed", poError);
    return NextResponse.json(
      { error: "Could not create purchase order." },
      { status: 500 }
    );
  }

  const { data: savedLines, error: lineItemsError } = await supabase
    .from("purchase_order_line_items")
    .insert(
      pricedLines.map((l) => ({
        purchase_order_id: po.id,
        product_sku: l.sku,
        product_name: l.name,
        finish: l.finish,
        color: l.finish === "Paint Grade" ? null : l.color,
        hearth: l.hearth,
        qty: l.qty,
        unit_price_cents: l.unitPriceCents,
      }))
    )
    .select("id, product_sku, finish, color, hearth");

  if (lineItemsError || !savedLines) {
    console.error("po line items insert failed", lineItemsError);
    return NextResponse.json(
      { error: "Purchase order created, but line items failed to save." },
      { status: 500 }
    );
  }

  const service = createServiceClient();
  const { error: manufacturingError } = await service
    .from("manufacturing_order_lines")
    .insert(
      savedLines.map((savedLine) => {
        const finish = savedLine.finish as ProductFinish;
        return {
          purchase_order_line_item_id: savedLine.id,
          manufacturing_model: manufacturingCatalog[savedLine.product_sku].model,
          manufacturing_finish: manufacturingFinish[finish],
          manufacturing_color:
            finish === "Paint Grade"
              ? null
              : manufacturingColor[savedLine.color!],
          manufacturing_hearth: savedLine.hearth!,
        };
      })
    );

  if (manufacturingError) {
    console.error("manufacturing order mapping failed", manufacturingError);
    await service.from("purchase_orders").delete().eq("id", po.id);
    return NextResponse.json(
      { error: "The order could not be prepared for manufacturing." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, poNumber: po.po_number });
}
