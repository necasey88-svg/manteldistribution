import { Container } from "@/components/container";
import { MaterialBadge } from "@/components/material-badge";
import { DealerAddToCartButton } from "@/components/dealer/dealer-add-to-cart-button";
import { products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export default function DealerCatalogPage() {
  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Dealer Catalog</h1>
      <p className="mt-1 text-ink-soft">Net pricing shown reflects your dealer account.</p>

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
                {formatCurrency(product.priceCents)}
              </span>
              <span className="text-xs text-ink-soft">net / unit</span>
            </div>
            <div className="mt-4">
              <DealerAddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
