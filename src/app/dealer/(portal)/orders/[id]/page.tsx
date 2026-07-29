import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Container } from "@/components/container";
import {
  OrderStatusBadge,
  orderStatusLabel,
} from "@/components/dealer/order-status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const PO_STAGES = [
  "submitted",
  "freight_quoted",
  "dealer_approved",
  "in_production",
  "quality_check",
  "shipped",
  "delivered",
];

function publicProductName(value: string) {
  const legacy = value.match(/\(Hearthline:\s*([^|)]+)/i);
  if (legacy) return legacy[1].trim();
  return value.includes(" | ") ? "Hearthline mantel" : value;
}

export default async function DealerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isPurchaseOrder = id.startsWith("po-");
  const recordId = id.replace(isPurchaseOrder ? /^po-/ : /^order-/, "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dealer } = user
    ? await supabase.from("dealers").select("id").eq("user_id", user.id).single()
    : { data: null };
  if (!dealer) notFound();

  if (isPurchaseOrder) {
    const { data: order } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", recordId)
      .eq("dealer_id", dealer.id)
      .single();
    if (!order) notFound();

    const { data: lines } = await supabase
      .from("purchase_order_line_items")
      .select("id, product_sku, product_name, finish, color, hearth, qty, unit_price_cents")
      .eq("purchase_order_id", order.id);
    const currentStage = PO_STAGES.indexOf(order.status);
    const total = order.subtotal_cents + (order.freight_cents ?? 0);

    return (
      <Container className="py-12">
        <Link href="/dealer/orders" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft size={15} /> All orders
        </Link>
        <div className="mt-7 flex flex-col gap-5 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl text-ink">{order.job_name || order.po_number}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Hearthline {order.po_number}{order.dealer_po_number ? ` · Your PO ${order.dealer_po_number}` : ""}
            </p>
          </div>
          <Link href="/dealer/catalog" className="button-dark">Reorder these products</Link>
        </div>

        {order.status !== "cancelled" && (
          <div className="mt-7 overflow-x-auto rounded-sm border border-line bg-white p-5">
            <div className="flex min-w-[760px] items-start">
              {PO_STAGES.map((stage, index) => (
                <div key={stage} className="relative flex flex-1 flex-col items-center text-center">
                  {index > 0 && <span className={`absolute right-1/2 top-2 h-px w-full ${index <= currentStage ? "bg-ok" : "bg-line"}`} />}
                  <span className={`relative z-10 h-4 w-4 rounded-full border-2 ${index <= currentStage ? "border-ok bg-ok" : "border-line bg-white"}`} />
                  <span className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${index <= currentStage ? "text-ink" : "text-ink-soft"}`}>{orderStatusLabel(stage)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_22rem]">
          <section className="overflow-hidden rounded-sm border border-line bg-white">
            <div className="border-b border-line px-5 py-4"><h2 className="font-serif text-2xl text-ink">Order contents</h2></div>
            <div className="divide-y divide-line">
              {(lines ?? []).map((line) => (
                <div key={line.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto]">
                  <div>
                    <strong className="text-ink">{publicProductName(line.product_name)}</strong>
                    <p className="mt-1 text-xs text-ink-soft">SKU {line.product_sku}</p>
                    <p className="mt-2 text-sm text-ink-soft">
                      {[line.finish, line.color, line.hearth].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-ink-soft">Qty {line.qty}</p>
                    <strong className="mt-1 block text-ink">{formatCurrency(line.unit_price_cents * line.qty)}</strong>
                    <p className="mt-1 text-xs text-ink-soft">{formatCurrency(line.unit_price_cents)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-sm border border-line bg-white p-5">
              <h2 className="font-serif text-2xl text-ink">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-ink-soft">Product subtotal</dt><dd>{formatCurrency(order.subtotal_cents)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Freight</dt><dd>{order.freight_cents == null ? "Pending quote" : formatCurrency(order.freight_cents)}</dd></div>
                <div className="flex justify-between border-t border-line pt-3 font-semibold"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
              </dl>
            </div>
            <div className="rounded-sm border border-line bg-white p-5 text-sm">
              <h2 className="font-serif text-2xl text-ink">Delivery</h2>
              <dl className="mt-4 space-y-4">
                <div><dt className="text-xs uppercase tracking-wide text-ink-soft">Ship to</dt><dd className="mt-1 whitespace-pre-line leading-6 text-ink">{order.ship_to || "To be confirmed"}</dd></div>
                <div><dt className="text-xs uppercase tracking-wide text-ink-soft">Estimated ship</dt><dd className="mt-1 text-ink">{order.estimated_ship_date ? new Date(order.estimated_ship_date).toLocaleDateString() : "Pending production confirmation"}</dd></div>
                {order.tracking_number && <div><dt className="text-xs uppercase tracking-wide text-ink-soft">Tracking / PRO</dt><dd className="mt-1 text-ink">{order.carrier ? `${order.carrier} · ` : ""}{order.tracking_number}</dd></div>}
              </dl>
            </div>
            {(order.acknowledgment_url || order.invoice_url || order.bol_url) && (
              <div className="rounded-sm border border-line bg-white p-5">
                <h2 className="font-serif text-2xl text-ink">Documents</h2>
                <div className="mt-4 space-y-3 text-sm font-semibold">
                  {order.acknowledgment_url && <a href={order.acknowledgment_url} className="flex items-center justify-between text-ink hover:text-ember-dark">Order acknowledgment <Download size={15} /></a>}
                  {order.invoice_url && <a href={order.invoice_url} className="flex items-center justify-between text-ink hover:text-ember-dark">Invoice <Download size={15} /></a>}
                  {order.bol_url && <a href={order.bol_url} className="flex items-center justify-between text-ink hover:text-ember-dark">Bill of lading <ExternalLink size={15} /></a>}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", recordId)
    .eq("dealer_id", dealer.id)
    .single();
  if (!order) notFound();
  const { data: lines } = await supabase
    .from("order_line_items")
    .select("*")
    .eq("order_id", order.id);

  return (
    <Container className="max-w-4xl py-12">
      <Link href="/dealer/orders" className="inline-flex items-center gap-2 text-sm text-ink-soft"><ArrowLeft size={15} /> All orders</Link>
      <div className="mt-7 flex items-center justify-between border-b border-line pb-6">
        <div><h1 className="font-serif text-4xl text-ink">Online order</h1><p className="mt-2 text-sm text-ink-soft">{new Date(order.created_at).toLocaleDateString()}</p></div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-7 divide-y divide-line rounded-sm border border-line bg-white">
        {(lines ?? []).map((line) => (
          <div key={line.id} className="flex justify-between gap-5 p-5">
            <div><strong>{line.product_name}</strong><p className="mt-1 text-xs text-ink-soft">SKU {line.product_sku} · Qty {line.qty}</p></div>
            <strong>{formatCurrency(line.unit_price_cents * line.qty)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 text-right font-serif text-2xl">Total {formatCurrency(order.subtotal_cents)}</div>
    </Container>
  );
}
