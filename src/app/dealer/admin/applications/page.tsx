import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { ApplicationApprovalPanel } from "@/components/dealer/application-approval-panel";
import { isHearthlineAdmin } from "@/lib/admin";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export default async function DealerApplicationsAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dealer/login?next=/dealer/admin/applications");
  if (!isHearthlineAdmin(user.email)) redirect("/dealer/dashboard");

  const service = createServiceClient();
  const { data: applications } = await service
    .from("dealer_applications")
    .select("*")
    .in("status", ["new", "reviewing"])
    .order("created_at", { ascending: false });

  return (
    <Container className="py-12">
      <p className="eyebrow text-ember">Hearthline administration</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Dealer applications</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Approving an application creates the dealer account and emails a secure password invitation.
      </p>

      <div className="mt-8 space-y-5">
        {!applications?.length ? (
          <div className="rounded-sm border border-line bg-white p-8 text-sm text-ink-soft">
            No applications are waiting for review.
          </div>
        ) : (
          applications.map((application) => (
            <article key={application.id} className="rounded-sm border border-line bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-ink">{application.company_name}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{application.contact_name} · {application.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">{application.business_type} · {application.expected_volume || "Volume not provided"}</p>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold capitalize text-ink">{application.status}</span>
              </div>
              {application.message && <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-soft">{application.message}</p>}
              <ApplicationApprovalPanel applicationId={application.id} />
            </article>
          ))
        )}
      </div>
    </Container>
  );
}

