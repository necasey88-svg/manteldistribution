import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DealerCartProvider } from "@/lib/dealer-cart-context";
import { DealerNav } from "@/components/dealer/dealer-nav";

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
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!dealer) {
    redirect("/dealer/account-status?state=missing");
  }

  if (dealer.status !== "approved") {
    redirect(`/dealer/account-status?state=${dealer.status}`);
  }

  return (
    <DealerCartProvider>
      <DealerNav companyName={dealer.company_name} />
      {children}
    </DealerCartProvider>
  );
}
