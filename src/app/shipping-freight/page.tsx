import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Shipping & Freight",
  description:
    "How Hearthline Supply Co. ships precast and wood mantels nationwide via LTL freight.",
};

const FAQ = [
  {
    q: "Do you install mantels?",
    a: "No. Hearthline Supply Co. is a distributor only — we manufacture and ship product. Installation is handled by your team or a local installer of your choice.",
  },
  {
    q: "How is product packaged for shipping?",
    a: "Precast mantels ship crated and palletized with corner protection and moisture barrier wrap. Wood mantels ship in reinforced cartons on pallets when ordered in volume, or individually cartoned for single-unit orders.",
  },
  {
    q: "What carrier / freight method do you use?",
    a: "Standard orders ship LTL (less-than-truckload) freight to a commercial address with a loading dock or forklift access. Liftgate delivery is available for an additional fee for non-dock addresses.",
  },
  {
    q: "What are typical lead times?",
    a: "12–28 days depending on product line and finish, plus transit time. Precast product generally requires longer cure and finishing time than wood.",
  },
  {
    q: "Can you drop-ship to my customer's job site?",
    a: "Yes — dealers can specify a job-site or end-customer delivery address on any purchase order. Freight is billed to the dealer account per your negotiated terms.",
  },
  {
    q: "Do you ship outside the continental U.S.?",
    a: "Not currently. We ship to the 48 contiguous states. Alaska, Hawaii, and international freight can be arranged on a case-by-case basis — contact us.",
  },
];

export default function ShippingFreightPage() {
  return (
    <Container className="py-16 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Shipping &amp; Freight
      </h1>
      <p className="mt-4 text-ink-soft leading-relaxed">
        Every mantel we distribute is built and packaged to survive
        dock-to-dock freight handling. We ship — we don&apos;t install.
        Below is how our freight process works for dealer accounts.
      </p>

      <dl className="mt-10 space-y-8">
        {FAQ.map((item) => (
          <div key={item.q} className="border-t border-line pt-6">
            <dt className="font-semibold text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm text-ink-soft leading-relaxed">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
