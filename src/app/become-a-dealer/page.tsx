import type { Metadata } from "next";
import { Container } from "@/components/container";
import { DealerApplicationForm } from "@/components/dealer-application-form";

export const metadata: Metadata = {
  title: "Become a Dealer",
  description:
    "Apply for a wholesale dealer account with Hearthline Supply Co.",
};

export default function BecomeADealerPage() {
  return (
    <Container className="py-16 grid lg:grid-cols-5 gap-12">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Become a Dealer
        </h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Hearthline Supply Co. sells exclusively to fireplace dealers,
          hearth retailers, and home furnishings trade accounts. Approved
          dealers get:
        </p>
        <ul className="mt-5 space-y-3 text-sm text-ink-soft">
          {[
            "Dealer net pricing on the focused ten-mantel collection",
            "A purchase order portal for standing and one-off orders",
            "Net payment terms based on account volume",
            "Finish samples, line-review support, and nationwide LTL shipping",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-ember-dark">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-soft">
          Applications are typically reviewed within 1&ndash;2 business
          days. Once approved, we&apos;ll email you credentials for the
          dealer portal.
        </p>
      </div>

      <div className="lg:col-span-3 rounded-md border border-line bg-white p-6 sm:p-8">
        <DealerApplicationForm />
      </div>
    </Container>
  );
}
