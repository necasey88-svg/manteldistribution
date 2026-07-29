"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplicationApprovalPanel({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [tier, setTier] = useState("approved");
  const [terms, setTerms] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    setLoading(true);
    setError(null);
    const response = await fetch(
      `/api/admin/dealer-applications/${applicationId}/approve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricingTier: tier,
          netTermsDays: terms,
          discountBps: null,
        }),
      }
    );
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Could not approve this application.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Pricing tier
        <select value={tier} onChange={(event)=>setTier(event.target.value)} className="mt-1 block w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink">
          <option value="approved">Approved Dealer</option>
          <option value="stocking">Stocking Dealer · 5%</option>
          <option value="program">Program Dealer · 8%</option>
          <option value="national">National Account</option>
        </select>
      </label>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Payment terms
        <select value={terms} onChange={(event)=>setTerms(Number(event.target.value))} className="mt-1 block w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink">
          <option value={0}>Due on delivery</option>
          <option value={15}>Net 15</option>
          <option value={30}>Net 30</option>
          <option value={45}>Net 45</option>
        </select>
      </label>
      <button type="button" onClick={approve} disabled={loading} className="button-dark disabled:opacity-50">
        {loading ? "Activating…" : "Approve & invite"}
      </button>
      {error && <p className="text-sm text-warn sm:col-span-3">{error}</p>}
    </div>
  );
}

