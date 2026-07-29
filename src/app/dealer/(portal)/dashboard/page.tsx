import Link from "next/link";
import { ArrowRight, Download, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { Container } from "@/components/container";
import { OrderStatusBadge } from "@/components/dealer/order-status-badge";
import {
  DEALER_TIER_LABELS,
  type DealerPricingTier,
} from "@/lib/dealer-pricing";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DealerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ activated?: string }>;
}) {
  const { activated } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dealer } = user
    ? await supabase.from("dealers").select("*").eq("user_id", user.id).single()
    : { data: null };

  const { data: recentPOs } = dealer
    ? await supabase
        .from("purchase_orders")
        .select("*")
        .eq("dealer_id", dealer.id)
        .order("created_at", { ascending: false })
        .limit(8)
    : { data: [] };

  const orders = recentPOs ?? [];
  const openOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  );
  const inProduction = orders.filter((order) =>
    ["in_production", "quality_check"].includes(order.status)
  ).length;
  const shipped = orders.filter((order) => order.status === "shipped").length;
  const bookedValue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.subtotal_cents, 0);
  const tier = (dealer?.pricing_tier ?? "approved") as DealerPricingTier;

  return (
    <Container className="py-12">
      {activated && (
        <div className="mb-7 rounded-sm border border-ok/25 bg-ok/5 p-4 text-sm text-ok">
          Your password is set and your Hearthline dealer account is active.
        </div>
      )}

      <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-ember">Dealer workspace</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">
            Welcome back{dealer ? `, ${dealer.contact_name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-2 text-ink-soft">
            {dealer?.company_name} · {dealer?.account_number ?? "Account setup in progress"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dealer/catalog" className="button-dark">
            Start an order <ArrowRight size={16} />
          </Link>
          <Link href="/dealer/orders" className="button-outline">
            Reorder
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat label="Open orders" value={String(openOrders.length)} icon={<ShoppingBag size={18} />} />
        <DashboardStat label="In production" value={String(inProduction)} icon={<PackageCheck size={18} />} />
        <DashboardStat label="Recently shipped" value={String(shipped)} icon={<Truck size={18} />} />
        <DashboardStat label="Recent order value" value={formatCurrency(bookedValue)} icon={<span className="font-serif text-lg">$</span>} />
      </div>

      <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_20rem]">
        <section className="rounded-sm border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="font-serif text-2xl text-ink">Active and recent orders</h2>
              <p className="mt-1 text-xs text-ink-soft">Production, freight, and shipment status in one place.</p>
            </div>
            <Link href="/dealer/orders" className="text-sm font-semibold text-ember-dark">
              View all
            </Link>
          </div>
          {!orders.length ? (
            <div className="p-8 text-sm text-ink-soft">
              No orders yet. <Link href="/dealer/catalog" className="font-semibold text-ember-dark underline">Start from the dealer catalog.</Link>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {orders.slice(0, 5).map((order) => (
                <Link key={order.id} href={`/dealer/orders/po-${order.id}`} className="grid gap-3 px-5 py-4 hover:bg-paper sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="font-semibold text-ink">{order.job_name || order.po_number}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Hearthline {order.po_number}{order.dealer_po_number ? ` · Your PO ${order.dealer_po_number}` : ""}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-ink">{formatCurrency(order.subtotal_cents + (order.freight_cents ?? 0))}</p>
                    <p className="mt-1 text-xs text-ink-soft">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-sm bg-steel-dark p-5 text-white">
            <p className="text-xs uppercase tracking-[.15em] text-clay">Your account</p>
            <h2 className="mt-2 font-serif text-2xl">{DEALER_TIER_LABELS[tier]}</h2>
            <dl className="mt-5 space-y-3 border-t border-white/15 pt-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-white/60">Terms</dt><dd>{dealer && dealer.net_terms_days > 0 ? `Net ${dealer.net_terms_days}` : "Due on delivery"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/60">Program discount</dt><dd>{dealer?.discount_bps ? `${dealer.discount_bps / 100}%` : "Standard net"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/60">Sales support</dt><dd>{dealer?.sales_rep || "Trade team"}</dd></div>
            </dl>
          </div>
          <div className="rounded-sm border border-line bg-white p-5">
            <p className="eyebrow text-ember">Dealer resources</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/brochure" className="flex items-center justify-between font-semibold text-ink hover:text-ember-dark">Trade brochure <Download size={15} /></Link>
              <Link href="/finishes" className="flex items-center justify-between font-semibold text-ink hover:text-ember-dark">Finish and color guide <ArrowRight size={15} /></Link>
              <Link href="/shipping-freight" className="flex items-center justify-between font-semibold text-ink hover:text-ember-dark">Freight and receiving <ArrowRight size={15} /></Link>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function DashboardStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-line bg-white p-5">
      <div className="flex items-center justify-between text-ink-soft">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <strong className="mt-4 block font-serif text-3xl font-normal text-ink">{value}</strong>
    </div>
  );
}
