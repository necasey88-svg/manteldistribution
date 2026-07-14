"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartIndicator() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-sm font-medium text-ink-soft hover:text-ink transition-colors"
    >
      Cart
      {itemCount > 0 && (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
