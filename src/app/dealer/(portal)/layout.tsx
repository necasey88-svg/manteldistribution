import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DealerCartProvider } from "@/lib/dealer-cart-context";
import { DealerNav } from "@/components/dealer/dealer-nav";
import { Container } from "@/components/container";

export default async function DealerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated requests, but this
  // guards direct/edge cases (e.g. stale session) too.
  if (!user) {
    redirect("/dealer/login");
  }

  const { data: dealer } = await supabase
    .from("dealers")
    .select("company_name, status")
    .eq("user_id", user.id)
    .single();

  return (
    <DealerCartProvider>
      <DealerNav companyName={dealer?.company_name ?? undefined} />
      {dealer && dealer.status !== "approved" && (
        <div className="bg-warn/10 text-warn text-sm">
          <Container className="py-2">
            Your dealer account is <strong>{dealer.status}</strong>. You can
            browse dealer pricing, but purchase order submission is disabled
            until your account is approved.
          </Container>
        </div>
      )}
      {children}
    </DealerCartProvider>
  );
}
