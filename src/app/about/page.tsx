import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hearthline Supply Co. is a trade-only nationwide distributor of a focused precast mantel collection.",
};

export default function AboutPage() {
  return (
    <>
      <Container className="py-16 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          A focused mantel line, built for the trade.
        </h1>
        <div className="mt-6 space-y-5 text-ink-soft leading-relaxed">
          <p>
            Hearthline Supply Co. is an independent nationwide distributor of
            precast fireplace mantels. We sell exclusively to
            fireplace and hearth dealers, home furnishings retailers, and
            trade accounts &mdash; we do not sell direct to homeowners, and
            we do not offer installation services.
          </p>
          <p>
            Our business is distribution: we coordinate production across a
            deliberately edited ten-profile assortment, and we ship
            palletized, freight-ready product to your dock anywhere in the
            continental United States.
          </p>
          <p>
            That focus means predictable lead times, freight-optimized
            packaging built to survive LTL handling, and a purchase order
            workflow designed around how trade accounts actually buy:
            standing orders, net payment terms, and volume pricing.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-8 border-t border-line pt-10">
          <div>
            <h3 className="font-semibold text-ink">What we do</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Curate, merchandise, and distribute precast mantels at
              wholesale pricing to trade accounts nationwide.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">What we don&apos;t do</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Installation, in-home consultation, or direct-to-consumer
              retail. We ship product &mdash; your team handles the rest.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">Who we serve</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Independent fireplace shops, regional dealer groups, and
              national home furnishings retail accounts.
            </p>
          </div>
        </div>
      </Container>
      <CtaSection />
    </>
  );
}
