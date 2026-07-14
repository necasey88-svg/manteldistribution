import Link from "next/link";
import { MaterialBadge } from "./material-badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-md border border-line bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <MaterialBadge material={product.material} />
        {!product.inStock && (
          <span className="text-xs font-semibold text-warn">Made to Order</span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-ink group-hover:text-ember-dark transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-ink-soft">{product.collection}</p>

      <p className="mt-3 text-sm text-ink-soft line-clamp-2">
        {product.description}
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-lg font-bold text-ink">
          {formatCurrency(product.priceCents)}
        </span>
        <span className="text-sm text-ink-soft line-through">
          {formatCurrency(product.msrpCents)}
        </span>
        <span className="text-xs text-ink-soft ml-auto">
          Lead time: {product.leadTimeDays}d
        </span>
      </div>
    </Link>
  );
}
