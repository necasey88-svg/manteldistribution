import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

export function ProductCard({ product }: { product: Product }) {
  const margin = Math.round((1 - product.priceCents / product.msrpCents) * 100);
  return <Link href={`/products/${product.slug}`} className="product-card group">
    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
      <Image src={product.image} alt={`${product.name} precast fireplace mantel`} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(max-width: 768px) 100vw, 33vw" />
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-ink">{product.style}</span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[.15em] text-ember">{product.collection}</p><h3 className="mt-1 font-serif text-2xl text-ink">{product.name}</h3></div><span className="text-xs text-ink-soft">{product.leadTimeDays} days</span></div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-soft">{product.description}</p>
      <div className="mt-5 flex items-end justify-between border-t border-line pt-4"><div><p className="text-xs text-ink-soft">Dealer / MSRP</p><p className="font-semibold text-ink">{formatCurrency(product.priceCents)} <span className="font-normal text-ink-soft">/ {formatCurrency(product.msrpCents)}</span></p></div><span className="text-xs font-semibold text-ok">{margin}% margin</span></div>
    </div>
  </Link>;
}
