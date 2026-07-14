import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DealerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dealer } = user
    ? await supabase.from("dealers").select("id").eq("user_id", user.id).single()
    : { data: null };

  const { data: orders } = dealer
    ? await supabase
        .from("orders")
        .select("id, status, subtotal_cents, created_at, customer_email")
        .eq("dealer_id", dealer.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Order History</h1>
      <p className="mt-1 text-ink-soft text-sm">
        Instant checkout orders placed with a card, separate from your
        purchase order queue.
      </p>

      <div className="mt-8">
        {!orders || orders.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No card-checkout orders on file for this account.
          </p>
        ) : (
          <table className="w-full text-sm border border-line rounded-md overflow-hidden">
            <thead className="bg-paper-dim text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-right px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-soft">{order.status}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatCurrency(order.subtotal_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}
