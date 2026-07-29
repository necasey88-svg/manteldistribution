import { redirect } from "next/navigation";

export default function LegacyPurchaseOrdersPage() {
  redirect("/dealer/orders");
}
