# Hearthline Supply Co.

Wholesale distribution site for precast and wood fireplace mantels —
B2B only, nationwide freight shipping, no installation services.
A separate brand and codebase from any retail/showroom business.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres, Auth, and Row Level Security for the dealer
  portal (accounts, purchase orders, order history)
- **Stripe Checkout** — self-serve card payment for smaller/one-off
  orders, alongside the dealer PO workflow
- Deploys to **Vercel**

## How ordering works

Two paths, both live in this codebase:

1. **Self-serve checkout** (`/products` → `/cart`) — anyone can add
   product at MSRP and pay by card via Stripe Checkout. No account
   required.
2. **Dealer purchase orders** (`/dealer/*`) — approved trade accounts
   sign in, browse the catalog at dealer net pricing, build a PO cart,
   and submit it for approval instead of paying online. This is the
   primary path for large accounts (fireplace dealers, big-box retail
   partners) that work on negotiated terms.

## Getting started locally

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys
npm run dev
```

The site runs and is fully browsable **without** Supabase/Stripe
configured — the dealer portal and checkout/PO submission routes will
show a friendly "not configured yet" message until you add real keys.

## Connecting Supabase (dealer accounts + purchase orders)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` — this creates the
   `dealers`, `dealer_applications`, `products`, `purchase_orders`,
   `purchase_order_line_items`, `orders`, and `order_line_items`
   tables with Row Level Security policies.
3. Copy your Project URL, anon key, and service role key into
   `.env.local` (see `.env.example`).
4. To provision a dealer: create a user in Supabase Auth (Authentication →
   Users → Add user), then insert a matching row into `dealers` with
   `status = 'approved'` and that user's `id` as `user_id`. New "Become
   a Dealer" submissions land in `dealer_applications` for review —
   there's no self-service signup by design, since dealer accounts are
   approved manually.
5. Product data currently comes from `src/lib/data/products.ts` (mock
   catalog). Once you're ready, seed the `products` table and swap
   that module's exports for Supabase queries — it's an isolated data
   layer so the swap doesn't touch any page code.

## Connecting Stripe (self-serve checkout)

1. Grab your API keys from the [Stripe dashboard](https://dashboard.stripe.com/apikeys)
   and add `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   to `.env.local`.
2. For local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   and copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`.
3. In production, add a webhook endpoint in the Stripe dashboard
   pointing at `https://yourdomain.com/api/webhooks/stripe`, listening
   for `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET`
   to that endpoint's signing secret in Vercel's env vars.

## Deploying to Vercel

1. Push this repo to GitHub (see note below if you don't have a
   connector set up).
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Next.js
   is auto-detected, no build config needed.
3. Add the same environment variables from `.env.local` under
   Project Settings → Environment Variables.
4. Deploy. Re-point your domain's DNS at Vercel once you're ready to
   go live on the brand's real domain.

## Project structure

```
src/
  app/
    page.tsx                 Home
    products/                Public catalog + product detail
    cart/                    Self-serve Stripe cart & checkout
    order-confirmation/      Post-checkout confirmation
    about/, contact/,
    shipping-freight/,
    become-a-dealer/         Marketing pages + dealer application form
    dealer/
      login/                 Dealer sign-in
      (portal)/              Authenticated dealer portal (dashboard,
                              catalog, PO cart, purchase orders,
                              order history, account)
    api/
      checkout/               Creates a Stripe Checkout session
      webhooks/stripe/         Records paid orders from Stripe
      purchase-orders/         Creates a PO for the signed-in dealer
      dealer-applications/     Stores "Become a Dealer" submissions
  components/                 Shared UI (header, footer, product cards…)
  lib/
    data/products.ts           Mock product catalog (swap for Supabase)
    supabase/                  Browser/server/middleware Supabase clients
    cart-context.tsx            Public cart (localStorage-backed)
    dealer-cart-context.tsx     Dealer PO cart (localStorage-backed)
  middleware.ts                 Protects /dealer/* routes
supabase/schema.sql             Full Postgres schema + RLS policies
```

## Brand notes

This is an intentionally separate brand, name, visual identity, and
codebase from any existing showroom/retail mantel business — built
for trade/wholesale distribution only. No copy, imagery, or design
system here should reference or resemble that business.
