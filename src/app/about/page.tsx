import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hearthline Supply Co. is a nationwide wholesale distributor of precast and wood fireplace mantels.",
};

export default function AboutPage() {
  return (
    <>
      <Container className="py-16 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Built for the trade, not the showroom floor.
        </h1>
        <div className="mt-6 space-y-5 text-ink-soft leading-relaxed">
          <p>
            Hearthline Supply Co. is a nationwide wholesale distributor of
            precast and solid wood fireplace mantels. We sell exclusively to
            fireplace and hearth dealers, home furnishings retailers, and
            trade accounts &mdash; we do not sell direct to homeowners, and
            we do not offer installation services.
          </p>
          <p>
            Our business is distribution: we hold inventory and production
            capacity across two product lines &mdash; precast cast-stone
            mantels and solid or reclaimed wood mantels &mdash; and we ship
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
              Manufacture and distribute precast and wood mantels at
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
