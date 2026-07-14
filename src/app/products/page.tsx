import Link from "next/link";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { products, type MantelMaterial } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse Hearthline Supply Co.'s wholesale precast and wood mantel catalog.",
};

const FILTERS: { label: string; value: MantelMaterial | "all" }[] = [
  { label: "All Products", value: "all" },
  { label: "Precast", value: "precast" },
  { label: "Wood", value: "wood" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string }>;
}) {
  const { material } = await searchParams;
  const active = material === "precast" || material === "wood" ? material : "all";

  const filtered =
    active === "all" ? products : products.filter((p) => p.material === active);

  return (
    <Container className="py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Product Catalog
          </h1>
          <p className="mt-2 text-ink-soft max-w-xl">
            Pricing shown is MSRP for self-serve orders. Sign in to your
            dealer account for net pricing and purchase order tools.
          </p>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "all" ? "/products" : `/products?material=${f.value}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === f.value
                  ? "bg-ink text-white border-ink"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Container>
  );
}
