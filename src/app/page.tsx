import Link from "next/link";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { CtaSection } from "@/components/cta-section";
import { products } from "@/lib/data/products";

const FEATURED_SLUGS = [
  "somerset-precast-mantel",
  "birchwood-oak-mantel",
  "cambridge-reclaimed-beam-mantel",
];

export default function Home() {
  const featured = products.filter((p) => FEATURED_SLUGS.includes(p.slug));

  return (
    <>
      <section className="bg-steel-dark text-paper">
        <Container className="py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-ember-light">
              Wholesale &middot; Nationwide Freight
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              Precast &amp; wood mantels,
              <br /> shipped to your dock.
            </h1>
            <p className="mt-6 text-lg text-paper/75 max-w-xl leading-relaxed">
              Hearthline Supply Co. is a trade-only distributor supplying
              fireplace dealers, retailers, and home furnishings accounts
              with precast and solid wood mantel product &mdash; palletized
              and freight-ready for delivery across the continental U.S.
              We ship. We don&apos;t install.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/become-a-dealer"
                className="inline-flex items-center rounded-sm bg-ember px-6 py-3 text-sm font-semibold text-white hover:bg-ember-dark transition-colors"
              >
                Apply for a Dealer Account
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-sm border border-paper/30 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10 transition-colors"
              >
                View Full Catalog
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-6 lg:pl-8">
            {[
              ["48", "states served via LTL freight"],
              ["2", "product lines: precast + wood"],
              ["12–28", "day average lead time"],
              ["100%", "distribution — no install crews"],
            ].map(([stat, label]) => (
              <div key={label} className="border-l-2 border-ember pl-4">
                <dt className="text-3xl font-bold">{stat}</dt>
                <dd className="mt-1 text-sm text-paper/70">{label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Featured Product Lines
              </h2>
              <p className="mt-1 text-ink-soft">
                A sample of our precast and wood mantel collections.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-ember-dark hover:text-ember whitespace-nowrap"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white border-y border-line">
        <Container className="py-16 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Trade pricing, not retail",
              body: "Dealer net pricing on every SKU, with volume breaks for standing purchase orders.",
            },
            {
              title: "Freight-optimized packaging",
              body: "Every mantel ships palletized and crated for LTL freight — built to survive dock-to-dock handling nationwide.",
            },
            {
              title: "Distribution only",
              body: "We manufacture and ship product. Installation stays with your crews — we never compete for the install.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
