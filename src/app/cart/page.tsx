"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { lines, updateQty, removeLine, subtotalCents, clear } = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">
          Browse the catalog to add mantels to your order.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-steel-dark"
        >
          View Catalog
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-16 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-ink mb-6">Your Cart</h1>
        <div className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <div key={line.slug} className="py-4 flex items-center gap-4">
              <div className="flex-1">
                <Link href={`/products/${line.slug}`} className="font-medium text-ink hover:text-ember-dark">
                  {line.name}
                </Link>
                <p className="text-xs text-ink-soft">SKU {line.sku}</p>
              </div>
              <input
                type="number"
                min={0}
                value={line.qty}
                onChange={(e) => updateQty(line.slug, Number(e.target.value))}
                className="w-16 rounded-sm border border-line px-2 py-1 text-sm"
              />
              <span className="w-24 text-right font-medium text-ink">
                {formatCurrency(line.priceCents * line.qty)}
              </span>
              <button
                onClick={() => removeLine(line.slug)}
                className="text-xs text-ink-soft hover:text-warn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button onClick={clear} className="mt-4 text-sm text-ink-soft hover:text-warn">
          Clear cart
        </button>
      </div>

      <div className="rounded-md border border-line bg-white p-6 h-fit">
        <div className="flex justify-between text-sm text-ink-soft">
          <span>Subtotal</span>
          <span className="font-semibold text-ink">{formatCurrency(subtotalCents)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          Freight is calculated and confirmed after checkout, based on destination.
        </p>

        <label className="mt-5 block text-xs font-medium text-ink-soft uppercase tracking-wide">
          Email for order confirmation
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-1 w-full rounded-sm border border-line px-3 py-2 text-sm"
        />

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-5 w-full rounded-sm bg-ember px-5 py-3 text-sm font-semibold text-white hover:bg-ember-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Redirecting to checkout…" : "Checkout with Stripe"}
        </button>

        <p className="mt-4 text-xs text-ink-soft">
          Ordering in volume as a trade account?{" "}
          <Link href="/become-a-dealer" className="underline hover:text-ember-dark">
            Apply for dealer pricing
          </Link>{" "}
          instead.
        </p>
      </div>
    </Container>
  );
}
