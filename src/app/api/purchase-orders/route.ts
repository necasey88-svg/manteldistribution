import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { manufacturingCatalog, manufacturingColor, manufacturingFinish } from "@/lib/data/manufacturing-map";
import { getProductBySku } from "@/lib/data/products";

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
});

function generatePoNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `PO-${stamp}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = PurchaseOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid purchase order", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const unmapped = parsed.data.lines.find((line) => !manufacturingCatalog[line.sku] || !manufacturingFinish[line.finish] || !manufacturingColor[line.color]);
  if (unmapped) {
    return NextResponse.json({ error: `Product configuration cannot be sent to manufacturing: ${unmapped.sku}` }, { status: 400 });
  }

  const pricedLines = [];
  for (const line of parsed.data.lines) {
    const product = getProductBySku(line.sku);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product SKU: ${line.sku}` },
        { status: 400 }
      );
    }
    pricedLines.push({ ...line, name: product.name, unitPriceCents: product.priceCents });
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
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (dealerError || !dealer) {
    return NextResponse.json(
      { error: "No dealer account found for this user." },
      { status: 403 }
    );
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

  const { error: lineItemsError } = await supabase
    .from("purchase_order_line_items")
    .insert(
      pricedLines.map((l) => ({
        purchase_order_id: po.id,
        product_sku: l.sku,
        product_name: `${manufacturingCatalog[l.sku].model} | ${manufacturingFinish[l.finish]} | ${manufacturingColor[l.color]} | ${l.hearth} (Hearthline: ${l.name} | ${l.finish} | ${l.color} | ${l.hearth})`,
        qty: l.qty,
        unit_price_cents: l.unitPriceCents,
      }))
    );

  if (lineItemsError) {
    console.error("po line items insert failed", lineItemsError);
    return NextResponse.json(
      { error: "Purchase order created, but line items failed to save." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, poNumber: po.po_number });
}
