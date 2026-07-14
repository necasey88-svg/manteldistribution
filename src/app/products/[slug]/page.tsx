import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { MaterialBadge } from "@/components/material-badge";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug, products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <Container className="py-16">
      <Link href="/products" className="text-sm text-ink-soft hover:text-ink">
        &larr; Back to catalog
      </Link>

      <div className="mt-6 grid lg:grid-cols-2 gap-12">
        <div className="aspect-[4/3] rounded-md bg-paper-dim border border-line flex items-center justify-center text-ink-soft text-sm">
          Product photography placeholder
        </div>

        <div>
          <MaterialBadge material={product.material} />
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-1 text-ink-soft">{product.collection} &middot; SKU {product.sku}</p>

          <p className="mt-5 text-ink-soft leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-ink">
              {formatCurrency(product.msrpCents)}
            </span>
            <span className="text-sm text-ink-soft">MSRP</span>
          </div>
          <p className="text-sm text-ok mt-1">
            Dealer net: {formatCurrency(product.priceCents)} &mdash;{" "}
            <Link href="/dealer/login" className="underline hover:text-ember-dark">
              sign in to order at dealer pricing
            </Link>
          </p>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-t border-line pt-6">
            <dt className="text-ink-soft">Dimensions</dt>
            <dd className="text-ink font-medium">{product.dimensions}</dd>
            <dt className="text-ink-soft">Weight</dt>
            <dd className="text-ink font-medium">{product.weightLbs} lbs</dd>
            <dt className="text-ink-soft">Lead time</dt>
            <dd className="text-ink font-medium">{product.leadTimeDays} days</dd>
            <dt className="text-ink-soft">Min. order qty</dt>
            <dd className="text-ink font-medium">{product.minOrderQty} unit(s)</dd>
            <dt className="text-ink-soft">Finish options</dt>
            <dd className="text-ink font-medium">{product.finish.join(", ")}</dd>
            <dt className="text-ink-soft">Availability</dt>
            <dd className="text-ink font-medium">
              {product.inStock ? "In production — standard lead time" : "Made to order"}
            </dd>
          </dl>
        </div>
      </div>
    </Container>
  );
}
