"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/data/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={!product.inStock}
      onClick={() => {
        addLine({
          lineKey: product.slug,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          priceCents: product.msrpCents,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-steel-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {!product.inStock ? "Request production slot" : added ? "Added" : "Add sample order (MSRP)"}
    </button>
  );
}
