"use client";

import { useState } from "react";
import { useDealerCart } from "@/lib/dealer-cart-context";
import { HEARTH_OPTIONS, type HearthOption, type Product, type ProductColor, type ProductFinish } from "@/lib/data/products";
import {
  getConfiguredMsrp,
  getDealerConfiguredPrice,
} from "@/lib/dealer-pricing";
import { formatCurrency } from "@/lib/utils";

export function DealerAddToCartButton({
  product,
  discountBps,
}: {
  product: Product;
  discountBps: number;
}) {
  const { addLine } = useDealerCart();
  const [qty, setQty] = useState(product.minOrderQty);
  const [finish, setFinish] = useState<ProductFinish>(product.finishes[0]);
  const [color, setColor] = useState<ProductColor>("Not Applicable");
  const [hearth, setHearth] = useState<HearthOption>(HEARTH_OPTIONS[0]);
  const [added, setAdded] = useState(false);
  const lineKey = `${product.slug}--${finish}--${color}--${hearth}`;
  const configuredPrice = getDealerConfiguredPrice(
    product,
    finish,
    hearth,
    discountBps
  );
  const configuredMsrp = getConfiguredMsrp(product, finish, hearth);
  const margin = Math.round((1 - configuredPrice / configuredMsrp) * 100);

  return <div className="space-y-2">
    <div className="grid grid-cols-2 gap-2">
      <select aria-label="Finish" value={finish} onChange={e=>{const next=e.target.value as ProductFinish;setFinish(next);setColor(next==="Paint Grade"?"Not Applicable":product.colors[0]);}} className="rounded-sm border border-line bg-white px-2 py-1.5 text-xs">{product.finishes.map(x=><option key={x}>{x}</option>)}</select>
      <select aria-label="Color" value={color} disabled={finish==="Paint Grade"} onChange={e=>setColor(e.target.value as ProductColor)} className="rounded-sm border border-line bg-white px-2 py-1.5 text-xs disabled:bg-paper-dim disabled:text-ink-soft">{finish==="Paint Grade"?<option>Not Applicable</option>:product.colors.map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <label className="block text-[10px] text-ink-soft">Optional hearth<select aria-label="Hearth option" value={hearth} onChange={e=>setHearth(e.target.value as HearthOption)} className="mt-1 w-full rounded-sm border border-line bg-white px-2 py-1.5 text-xs text-ink">{HEARTH_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label>
    <div className="rounded-sm bg-paper-dim px-3 py-2 text-xs">
      <div className="flex justify-between"><span className="text-ink-soft">Configured dealer net</span><strong className="text-ink">{formatCurrency(configuredPrice)}</strong></div>
      <div className="mt-1 flex justify-between"><span className="text-ink-soft">Suggested retail</span><span className="text-ink">{formatCurrency(configuredMsrp)} · {margin}% margin</span></div>
    </div>
    <div className="flex items-center gap-2">
      <input aria-label="Quantity" type="number" min={product.minOrderQty} value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-16 rounded-sm border border-line px-2 py-1.5 text-sm"/>
      <button type="button" onClick={()=>{addLine({lineKey,slug:product.slug,name:product.name,sku:product.sku,priceCents:configuredPrice,finish,color,hearth},qty);setAdded(true);setTimeout(()=>setAdded(false),1500)}} className="flex-1 inline-flex items-center justify-center rounded-sm bg-steel-dark px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink">{added?"Added to PO":"Add to PO"}</button>
    </div>
  </div>;
}
