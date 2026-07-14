"use client";

import { useState, type FormEvent } from "react";

export function DealerApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      companyName: String(form.get("companyName") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      businessType: String(form.get("businessType") ?? ""),
      website: String(form.get("website") ?? ""),
      expectedVolume: String(form.get("expectedVolume") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/dealer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-ok/30 bg-ok/5 p-6">
        <h3 className="font-semibold text-ok">Application received</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Thanks for applying. Our trade sales team reviews new dealer
          applications within 1–2 business days and will follow up by
          email with next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
      <Field label="Company name" name="companyName" required />
      <Field label="Contact name" name="contactName" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />
      <div>
        <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
          Business type
        </label>
        <select
          name="businessType"
          required
          defaultValue=""
          className="w-full rounded-sm border border-line px-3 py-2 text-sm bg-white"
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="fireplace_dealer">Fireplace / Hearth Dealer</option>
          <option value="home_furnishings_retailer">Home Furnishings Retailer</option>
          <option value="builder_remodeler">Builder / Remodeler</option>
          <option value="other">Other</option>
        </select>
      </div>
      <Field label="Website (optional)" name="website" />
      <Field
        label="Expected monthly volume (optional)"
        name="expectedVolume"
        placeholder="e.g. 5–10 units/month"
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
          Anything else we should know?
        </label>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-sm border border-line px-3 py-2 text-sm"
        />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-warn">{errorMessage}</p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center rounded-sm bg-ember px-6 py-3 text-sm font-semibold text-white hover:bg-ember-dark transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-line px-3 py-2 text-sm"
      />
    </div>
  );
}
