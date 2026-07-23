import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug } from "@/lib/data/products";

// Clients send only slug + qty; unit pricing is resolved server-side
// from the catalog so a tampered request can't set its own price.
const CheckoutSchema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string(),
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

  const lineItems = [];
  for (const line of parsed.data.lines) {
    const product = getProductBySlug(line.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.slug}` },
        { status: 400 }
      );
    }
    if (!product.inStock) {
      return NextResponse.json(
        { error: `${product.name} is made to order — contact us to purchase.` },
        { status: 400 }
      );
    }
    lineItems.push({
      quantity: line.qty,
      price_data: {
        currency: "usd",
        unit_amount: product.msrpCents,
        product_data: {
          name: product.name,
          metadata: { sku: product.sku, slug: product.slug },
        },
      },
    });
  }

  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: lineItems,
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
