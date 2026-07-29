import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { OrderStatusBadge } from "@/components/dealer/order-status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DealerOrdersPage({
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

  const [{ data: purchaseOrders }, { data: checkoutOrders }] = dealer
    ? await Promise.all([
        supabase
          .from("purchase_orders")
          .select("*")
          .eq("dealer_id", dealer.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("*")
          .eq("dealer_id", dealer.id)
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  const orders = [
    ...(purchaseOrders ?? []).map((order) => ({
      id: `po-${order.id}`,
      orderNumber: order.po_number,
      dealerPoNumber: order.dealer_po_number,
      jobName: order.job_name,
      status: order.status,
      createdAt: order.created_at,
      estimatedShipDate: order.estimated_ship_date,
      totalCents: order.subtotal_cents + (order.freight_cents ?? 0),
    })),
    ...(checkoutOrders ?? []).map((order) => ({
      id: `order-${order.id}`,
      orderNumber: `Online ${order.id.slice(0, 8).toUpperCase()}`,
      dealerPoNumber: null,
      jobName: null,
      status: order.status,
      createdAt: order.created_at,
      estimatedShipDate: null,
      totalCents: order.subtotal_cents,
    })),
  ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <Container className="py-12">
      {submitted && (
        <div className="mb-7 rounded-sm border border-ok/25 bg-ok/5 p-4 text-sm text-ok">
          Order <strong>{submitted}</strong> was submitted. The trade team will add freight and confirm the production schedule.
        </div>
      )}
      <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-ember">Your complete history</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Orders</h1>
          <p className="mt-2 text-sm text-ink-soft">Purchase orders and online orders are combined in one view.</p>
        </div>
        <Link href="/dealer/catalog" className="button-dark">
          Start a new order <ArrowRight size={16} />
        </Link>
      </div>

      {!orders.length ? (
        <div className="mt-8 rounded-sm border border-line bg-white p-10 text-center">
          <h2 className="font-serif text-2xl text-ink">No orders yet</h2>
          <p className="mt-2 text-sm text-ink-soft">Configure a mantel in the dealer catalog to create your first order.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-sm border border-line bg-white">
          <div className="hidden grid-cols-[1.2fr_1fr_.8fr_.8fr_.8fr_2rem] gap-4 bg-paper-dim px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft md:grid">
            <span>Order</span><span>Reference</span><span>Status</span><span>Placed</span><span className="text-right">Total</span><span />
          </div>
          <div className="divide-y divide-line">
            {orders.map((order) => (
              <Link key={order.id} href={`/dealer/orders/${order.id}`} className="grid gap-3 px-5 py-5 hover:bg-paper md:grid-cols-[1.2fr_1fr_.8fr_.8fr_.8fr_2rem] md:items-center md:gap-4">
                <div>
                  <strong className="text-ink">{order.orderNumber}</strong>
                  {order.estimatedShipDate && <p className="mt-1 text-xs text-ink-soft">Est. ship {new Date(order.estimatedShipDate).toLocaleDateString()}</p>}
                </div>
                <div className="text-sm text-ink-soft">{order.jobName || order.dealerPoNumber || "—"}</div>
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-ink-soft">{new Date(order.createdAt).toLocaleDateString()}</span>
                <strong className="text-left text-ink md:text-right">{formatCurrency(order.totalCents)}</strong>
                <ArrowRight size={16} className="text-ink-soft" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
