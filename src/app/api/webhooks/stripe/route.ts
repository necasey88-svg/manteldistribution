import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

// Configure this endpoint (…/api/webhooks/stripe) in the Stripe
// dashboard, listening for `checkout.session.completed`.
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = createServiceClient();
      await supabase.from("orders").insert({
        stripe_checkout_session_id: session.id,
        customer_email: session.customer_details?.email ?? "unknown",
        status: "paid",
        subtotal_cents: session.amount_subtotal ?? 0,
      });
    } catch (err) {
      console.error("failed to record order from webhook", err);
    }
  }

  return NextResponse.json({ received: true });
}
