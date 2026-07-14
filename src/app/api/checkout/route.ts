import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";

const CheckoutSchema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string(),
        sku: z.string(),
        priceCents: z.number().int().positive(),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: parsed.data.lines.map((line) => ({
        quantity: line.qty,
        price_data: {
          currency: "usd",
          unit_amount: line.priceCents,
          product_data: {
            name: line.name,
            metadata: { sku: line.sku, slug: line.slug },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout session error", err);
    return NextResponse.json(
      {
        error:
          "Checkout is not configured yet. Add STRIPE_SECRET_KEY to your environment — see .env.example.",
      },
      { status: 503 }
    );
  }
}
