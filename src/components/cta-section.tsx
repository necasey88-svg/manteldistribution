import Link from "next/link";
import { Container } from "./container";

export function CtaSection() {
  return (
    <section className="border-t border-line bg-white">
      <Container className="py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Ready to open a dealer account?
          </h2>
          <p className="mt-2 text-ink-soft max-w-xl">
            Get access to dealer net pricing, purchase order tools, and
            freight-optimized nationwide shipping for your showroom or
            install business.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/become-a-dealer"
            className="inline-flex items-center rounded-sm bg-ember px-5 py-3 text-sm font-semibold text-white hover:bg-ember-dark transition-colors"
          >
            Become a Dealer
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center rounded-sm border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-ink transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      </Container>
    </section>
  );
}
