"use client";

import { useState } from "react";
import { useDealerCart } from "@/lib/dealer-cart-context";
import type { Product } from "@/lib/data/products";

export function DealerAddToCartButton({ product }: { product: Product }) {
  const { addLine } = useDealerCart();
  const [qty, setQty] = useState(product.minOrderQty);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={product.minOrderQty}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="w-16 rounded-sm border border-line px-2 py-1.5 text-sm"
      />
      <button
        type="button"
        onClick={() => {
          addLine(
            {
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              priceCents: product.priceCents,
            },
            qty
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex-1 inline-flex items-center justify-center rounded-sm bg-steel-dark px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink transition-colors"
      >
        {added ? "Added to PO ✓" : "Add to PO"}
      </button>
    </div>
  );
}
