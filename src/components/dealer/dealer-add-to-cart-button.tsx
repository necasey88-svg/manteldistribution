"use client";

import { useState } from "react";
import { useDealerCart } from "@/lib/dealer-cart-context";
import { HEARTH_OPTIONS, type HearthOption, type Product, type ProductColor, type ProductFinish } from "@/lib/data/products";

export function DealerAddToCartButton({ product }: { product: Product }) {
  const { addLine } = useDealerCart();
  const [qty, setQty] = useState(product.minOrderQty);
  const [finish, setFinish] = useState<ProductFinish>(product.finishes[0]);
  const [color, setColor] = useState<ProductColor>(product.colors[0]);
  const [hearth, setHearth] = useState<HearthOption>(HEARTH_OPTIONS[0]);
  const [added, setAdded] = useState(false);
  const lineKey = `${product.slug}--${finish}--${color}--${hearth}`;

  return <div className="space-y-2">
    <div className="grid grid-cols-2 gap-2">
      <select aria-label="Finish" value={finish} onChange={e=>setFinish(e.target.value as ProductFinish)} className="rounded-sm border border-line bg-white px-2 py-1.5 text-xs">{product.finishes.map(x=><option key={x}>{x}</option>)}</select>
      <select aria-label="Color" value={color} onChange={e=>setColor(e.target.value as ProductColor)} className="rounded-sm border border-line bg-white px-2 py-1.5 text-xs">{product.colors.map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <label className="block text-[10px] text-ink-soft">Optional hearth — priced on order acknowledgment<select aria-label="Hearth option" value={hearth} onChange={e=>setHearth(e.target.value as HearthOption)} className="mt-1 w-full rounded-sm border border-line bg-white px-2 py-1.5 text-xs text-ink">{HEARTH_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label>
    <div className="flex items-center gap-2">
      <input aria-label="Quantity" type="number" min={product.minOrderQty} value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-16 rounded-sm border border-line px-2 py-1.5 text-sm"/>
      <button type="button" onClick={()=>{addLine({lineKey,slug:product.slug,name:product.name,sku:product.sku,priceCents:product.priceCents,finish,color,hearth},qty);setAdded(true);setTimeout(()=>setAdded(false),1500)}} className="flex-1 inline-flex items-center justify-center rounded-sm bg-steel-dark px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink">{added?"Added to PO":"Add to PO"}</button>
    </div>
  </div>;
}
