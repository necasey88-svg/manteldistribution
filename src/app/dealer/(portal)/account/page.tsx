import { Container } from "@/components/container";
import {
  DEALER_TIER_LABELS,
  type DealerPricingTier,
} from "@/lib/dealer-pricing";
import { createClient } from "@/lib/supabase/server";

export default async function DealerAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dealer } = user
    ? await supabase.from("dealers").select("*").eq("user_id", user.id).single()
    : { data: null };

  if (!dealer) return null;
  const tier = (dealer.pricing_tier ?? "approved") as DealerPricingTier;

  return (
    <Container className="py-12">
      <div className="border-b border-line pb-7">
        <p className="eyebrow text-ember">Dealer profile</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Account</h1>
        <p className="mt-2 text-sm text-ink-soft">Review the company information, pricing program, and terms attached to this login.</p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-2">
        <AccountSection title="Company">
          <AccountRow label="Company" value={dealer.company_name} />
          <AccountRow label="Account number" value={dealer.account_number ?? "Pending assignment"} />
          <AccountRow label="Primary contact" value={dealer.contact_name} />
          <AccountRow label="Email" value={dealer.email} />
          <AccountRow label="Phone" value={dealer.phone ?? "Not provided"} />
        </AccountSection>

        <AccountSection title="Dealer program">
          <AccountRow label="Account status" value="Approved" />
          <AccountRow label="Pricing tier" value={DEALER_TIER_LABELS[tier]} />
          <AccountRow label="Program discount" value={dealer.discount_bps > 0 ? `${dealer.discount_bps / 100}% below standard net` : "Standard dealer net"} />
          <AccountRow label="Payment terms" value={dealer.net_terms_days > 0 ? `Net ${dealer.net_terms_days}` : "Due on delivery"} />
          <AccountRow label="Resale certificate" value={(dealer.resale_certificate_status ?? "needed").replaceAll("_", " ")} />
          <AccountRow label="Sales support" value={dealer.sales_rep ?? "Hearthline trade team"} />
        </AccountSection>

        <AccountSection title="Billing address">
          <p className="whitespace-pre-line text-sm leading-6 text-ink-soft">{dealer.billing_address || "No billing address is on file."}</p>
        </AccountSection>

        <AccountSection title="Default ship-to address">
          <p className="whitespace-pre-line text-sm leading-6 text-ink-soft">{dealer.shipping_address || "Add a ship-to address with your next order."}</p>
        </AccountSection>
      </div>

      <div className="mt-7 rounded-sm bg-cream p-5 text-sm leading-6 text-ink-soft">
        Need to update a company name, address, terms, or resale certificate?{" "}
        <a href="mailto:hearthlinesupply@calmantel.com" className="font-semibold text-ember-dark underline underline-offset-2">Contact the Hearthline trade team.</a>
      </div>
    </Container>
  );
}

function AccountSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-white p-6">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <strong className="text-right text-sm font-semibold capitalize text-ink">{value}</strong>
    </div>
  );
}
