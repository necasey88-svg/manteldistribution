import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Hearthline Supply Co.'s trade sales team.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Contact</h1>
      <p className="mt-4 text-ink-soft leading-relaxed">
        For trade sales, existing dealer account questions, or freight
        support, reach our team directly.
      </p>

      <dl className="mt-8 space-y-6 text-sm">
        <div>
          <dt className="font-semibold text-ink">Trade Sales</dt>
          <dd className="mt-1 text-ink-soft">sales@hearthlinesupply.com</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Dealer Support</dt>
          <dd className="mt-1 text-ink-soft">support@hearthlinesupply.com</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Phone</dt>
          <dd className="mt-1 text-ink-soft">(800) 555-0142 &mdash; Mon&ndash;Fri, 8am&ndash;6pm ET</dd>
        </div>
      </dl>

      <p className="mt-10 text-xs text-ink-soft border-t border-line pt-6">
        Looking to open a dealer account?{" "}
        <a href="/become-a-dealer" className="underline hover:text-ember-dark">
          Apply here
        </a>{" "}
        instead — it routes directly to our trade sales team.
      </p>
    </Container>
  );
}
