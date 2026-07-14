import Link from "next/link";
import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/server";

export default async function DealerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dealer } = user
    ? await supabase
        .from("dealers")
        .select("*")
        .eq("user_id", user.id)
        .single()
    : { data: null };

  const { data: recentPOs } = dealer
    ? await supabase
        .from("purchase_orders")
        .select("id, po_number, status, subtotal_cents, created_at")
        .eq("dealer_id", dealer.id)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: [] };

  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Welcome{dealer ? `, ${dealer.company_name}` : ""}
      </h1>
      <p className="mt-1 text-ink-soft">
        Manage purchase orders and browse dealer pricing.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        <Link
          href="/dealer/catalog"
          className="rounded-md border border-line bg-white p-5 hover:border-ink transition-colors"
        >
          <h3 className="font-semibold text-ink">Browse Catalog</h3>
          <p className="mt-1 text-sm text-ink-soft">
            View dealer net pricing on the full precast &amp; wood lineup.
          </p>
        </Link>
        <Link
          href="/dealer/cart"
          className="rounded-md border border-line bg-white p-5 hover:border-ink transition-colors"
        >
          <h3 className="font-semibold text-ink">PO Cart</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Review your in-progress purchase order before submitting.
          </p>
        </Link>
        <Link
          href="/dealer/purchase-orders"
          className="rounded-md border border-line bg-white p-5 hover:border-ink transition-colors"
        >
          <h3 className="font-semibold text-ink">Purchase Orders</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Track status on submitted and past purchase orders.
          </p>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="font-semibold text-ink mb-3">Recent purchase orders</h2>
        {!recentPOs || recentPOs.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No purchase orders yet.{" "}
            <Link href="/dealer/catalog" className="underline hover:text-ember-dark">
              Start one from the catalog
            </Link>
            .
          </p>
        ) : (
          <div className="rounded-md border border-line bg-white divide-y divide-line">
            {recentPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium text-ink">{po.po_number}</span>
                <span className="text-ink-soft capitalize">{po.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
