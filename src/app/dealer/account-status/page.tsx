import { Container } from "@/components/container";

export default async function DealerAccountStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const pending = state === "pending";
  return (
    <Container className="max-w-2xl py-20">
      <p className="eyebrow text-ember">Dealer access</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">
        {pending ? "Your application is being reviewed." : "We need to connect your account."}
      </h1>
      <p className="mt-5 text-base leading-7 text-ink-soft">
        {pending
          ? "Protected dealer pricing and ordering will open as soon as the Hearthline trade team approves your account."
          : "This login is not connected to an active Hearthline dealer record. Our trade team can correct the account association."}
      </p>
      <a href="mailto:hearthlinesupply@calmantel.com" className="button-dark mt-7">
        Contact the Hearthline trade team
      </a>
    </Container>
  );
}
