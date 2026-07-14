import Link from "next/link";
import { Container } from "@/components/container";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <Container className="py-24 text-center max-w-lg">
      <h1 className="text-3xl font-bold text-ink">Order received</h1>
      <p className="mt-3 text-ink-soft">
        Thank you for your order. A confirmation with tracking and freight
        details will be sent to your email once your order ships.
      </p>
      {session_id && (
        <p className="mt-4 text-xs text-ink-soft">
          Reference: <span className="font-mono">{session_id}</span>
        </p>
      )}
      <Link
        href="/products"
        className="mt-8 inline-flex items-center rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-steel-dark"
      >
        Continue Browsing
      </Link>
    </Container>
  );
}
