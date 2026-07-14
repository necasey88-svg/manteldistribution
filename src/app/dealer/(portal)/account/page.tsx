import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/server";

export default async function DealerAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dealer } = user
    ? await supabase.from("dealers").select("*").eq("user_id", user.id).single()
    : { data: null };

  return (
    <Container className="py-12 max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Account</h1>

      {!dealer ? (
        <p className="mt-4 text-sm text-ink-soft">
          No dealer profile found for this login. Contact support if this
          seems wrong.
        </p>
      ) : (
        <dl className="mt-8 space-y-4 text-sm border-t border-line pt-6">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Company</dt>
            <dd className="font-medium text-ink">{dealer.company_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Contact</dt>
            <dd className="font-medium text-ink">{dealer.contact_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Email</dt>
            <dd className="font-medium text-ink">{dealer.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Account status</dt>
            <dd className="font-medium text-ink capitalize">{dealer.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Net terms</dt>
            <dd className="font-medium text-ink">
              {dealer.net_terms_days > 0 ? `Net ${dealer.net_terms_days}` : "Due on delivery"}
            </dd>
          </div>
        </dl>
      )}
    </Container>
  );
}
