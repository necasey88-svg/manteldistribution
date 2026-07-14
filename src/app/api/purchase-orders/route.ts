import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PurchaseOrderSchema = z.object({
  lines: z
    .array(
      z.object({
        sku: z.string(),
        name: z.string(),
        qty: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
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

  const subtotalCents = parsed.data.lines.reduce(
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
      parsed.data.lines.map((l) => ({
        purchase_order_id: po.id,
        product_sku: l.sku,
        product_name: l.name,
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
