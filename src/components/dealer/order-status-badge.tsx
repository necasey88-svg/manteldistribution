import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  submitted: "Submitted",
  freight_quoted: "Freight quoted",
  dealer_approved: "Approved",
  in_production: "In production",
  quality_check: "Quality inspection",
  shipped: "Shipped",
  delivered: "Delivered",
  paid: "Paid",
  fulfilled: "Fulfilled",
  pending: "Pending",
  cancelled: "Cancelled",
};

export function orderStatusLabel(status: string) {
  return LABELS[status] ?? status.replaceAll("_", " ");
}

export function OrderStatusBadge({ status }: { status: string }) {
  const isComplete = ["delivered", "fulfilled", "paid"].includes(status);
  const isMoving = ["in_production", "quality_check", "shipped"].includes(status);
  const isAttention = ["freight_quoted", "pending"].includes(status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        isComplete && "bg-ok/10 text-ok",
        isMoving && "bg-steel/10 text-steel-dark",
        isAttention && "bg-warn/10 text-warn",
        !isComplete && !isMoving && !isAttention && "bg-paper-dim text-ink-soft"
      )}
    >
      {orderStatusLabel(status)}
    </span>
  );
}

