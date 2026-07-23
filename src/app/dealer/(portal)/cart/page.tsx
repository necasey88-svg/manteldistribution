"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { useDealerCart } from "@/lib/dealer-cart-context";
import { formatCurrency } from "@/lib/utils";

export default function DealerCartPage() {
  const { lines, updateQty, removeLine, subtotalCents, clear } = useDealerCart();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmitPO() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            sku: l.sku,
            name: l.name,
            finish: l.finish,
            color: l.color,
            hearth: l.hearth,
            qty: l.qty,
            unitPriceCents: l.priceCents,
          })),
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit purchase order");
      clear();
      router.push("/dealer/purchase-orders?submitted=" + data.poNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit purchase order");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Your PO cart is empty</h1>
        <p className="mt-2 text-ink-soft">
          Add products from the dealer catalog to start a purchase order.
        </p>
        <Link
          href="/dealer/catalog"
          className="mt-6 inline-flex items-center rounded-sm bg-steel-dark px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
        >
          Go to Catalog
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-ink mb-6">Purchase Order Cart</h1>
        <div className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <div key={line.lineKey ?? line.slug} className="py-4 flex items-center gap-4">
              <div className="flex-1">
                <span className="font-medium text-ink">{line.name}</span>
                <p className="text-xs text-ink-soft">SKU {line.sku}</p>
                {line.finish && <p className="text-xs text-ink-soft">{line.finish} · {line.color} · {line.hearth}</p>}
              </div>
              <input
                type="number"
                min={0}
                value={line.qty}
                onChange={(e) => updateQty(line.lineKey ?? line.slug, Number(e.target.value))}
                className="w-16 rounded-sm border border-line px-2 py-1 text-sm"
              />
              <span className="w-24 text-right font-medium text-ink">
                {formatCurrency(line.priceCents * line.qty)}
              </span>
              <button onClick={() => removeLine(line.lineKey ?? line.slug)} className="text-xs text-ink-soft hover:text-warn">
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
          <span>Subtotal (net)</span>
          <span className="font-semibold text-ink">{formatCurrency(subtotalCents)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          Freight, optional hearth pricing, and applicable net terms are confirmed
          on the order acknowledgment after submission.
        </p>

        <label className="mt-5 block text-xs font-medium text-ink-soft uppercase tracking-wide">
          PO notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Job site delivery address, requested ship date, etc."
          className="mt-1 w-full rounded-sm border border-line px-3 py-2 text-sm"
        />

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}

        <button
          onClick={handleSubmitPO}
          disabled={loading}
          className="mt-5 w-full rounded-sm bg-ember px-5 py-3 text-sm font-semibold text-white hover:bg-ember-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit Purchase Order"}
        </button>
      </div>
    </Container>
  );
}
