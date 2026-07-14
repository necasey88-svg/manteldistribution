import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function PurchaseOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dealer } = user
    ? await supabase.from("dealers").select("id").eq("user_id", user.id).single()
    : { data: null };

  const { data: purchaseOrders } = dealer
    ? await supabase
        .from("purchase_orders")
        .select("id, po_number, status, subtotal_cents, notes, created_at")
        .eq("dealer_id", dealer.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Purchase Orders</h1>

      {submitted && (
        <div className="mt-4 rounded-md border border-ok/30 bg-ok/5 p-4 text-sm text-ok">
          Purchase order <strong>{submitted}</strong> submitted successfully.
          Our team will confirm pricing, freight, and lead time by email.
        </div>
      )}

      <div className="mt-8">
        {!purchaseOrders || purchaseOrders.length === 0 ? (
          <p className="text-sm text-ink-soft">No purchase orders submitted yet.</p>
        ) : (
          <table className="w-full text-sm border border-line rounded-md overflow-hidden">
            <thead className="bg-paper-dim text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-2">PO Number</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Submitted</th>
                <th className="text-right px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {purchaseOrders.map((po) => (
                <tr key={po.id}>
                  <td className="px-4 py-3 font-medium text-ink">{po.po_number}</td>
                  <td className="px-4 py-3 capitalize text-ink-soft">{po.status}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(po.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatCurrency(po.subtotal_cents)}
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
