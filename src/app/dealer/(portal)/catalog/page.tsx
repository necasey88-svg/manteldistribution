import { Container } from "@/components/container";
import { MaterialBadge } from "@/components/material-badge";
import { DealerAddToCartButton } from "@/components/dealer/dealer-add-to-cart-button";
import { products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import {
  DEALER_TIER_LABELS,
  getTierDiscountBps,
  type DealerPricingTier,
} from "@/lib/dealer-pricing";

export default async function DealerCatalogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dealer } = user
    ? await supabase.from("dealers").select("*").eq("user_id", user.id).single()
    : { data: null };
  const tier = (dealer?.pricing_tier ?? "approved") as DealerPricingTier;
  const discountBps = getTierDiscountBps(tier, dealer?.discount_bps);

  return (
    <Container className="py-12">
      <div className="flex flex-col gap-4 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-ember">Protected trade pricing</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Dealer Catalog</h1>
          <p className="mt-2 text-sm text-ink-soft">Configure finish, color, and hearth options with live net pricing.</p>
        </div>
        <div className="rounded-sm bg-cream px-4 py-3 text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink-soft">Your program</span>
          <strong className="text-ink">{DEALER_TIER_LABELS[tier]}</strong>
          {discountBps > 0 && <span className="ml-2 text-ok">{discountBps / 100}% program discount</span>}
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div key={product.slug} className="rounded-md border border-line bg-white p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <MaterialBadge material={product.material} />
              {!product.inStock && (
                <span className="text-xs font-semibold text-warn">Made to Order</span>
              )}
            </div>
            <h3 className="mt-3 font-semibold text-ink">{product.name}</h3>
            <p className="text-xs text-ink-soft">SKU {product.sku} &middot; MOQ {product.minOrderQty}</p>
            <p className="mt-3 text-sm text-ink-soft flex-1">{product.description}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-lg font-bold text-ink">
                {formatCurrency(Math.round(product.priceCents * (10000 - discountBps) / 10000))}
              </span>
              <span className="text-xs text-ink-soft">base net / unit</span>
            </div>
            <div className="mt-4">
              <DealerAddToCartButton product={product} discountBps={discountBps} />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
