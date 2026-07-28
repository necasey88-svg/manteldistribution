"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

const businessTypeLabels: Record<string, string> = {
  fireplace_dealer: "Fireplace / Hearth Dealer",
  home_furnishings_retailer: "Home Furnishings Retailer",
  builder_remodeler: "Builder / Remodeler",
  other: "Other",
};

export function DealerApplicationForm({ accessKey }: { accessKey: string }) {
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(event.currentTarget);
    const application = {
      companyName: String(form.get("companyName") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      businessType: String(form.get("businessType") ?? ""),
      website: String(form.get("website") ?? ""),
      expectedVolume: String(form.get("expectedVolume") ?? ""),
      message: String(form.get("message") ?? ""),
      companyFax: String(form.get("companyFax") ?? ""),
    };

    try {
      if (
        application.companyFax ||
        Date.now() - startedAt.current < 2500
      ) {
        setStatus("success");
        return;
      }

      if (!accessKey) {
        throw new Error("The application service is temporarily unavailable.");
      }

      const submission = {
        access_key: accessKey,
        subject: `New Hearthline dealer application — ${application.companyName}`,
        from_name: "Hearthline Supply Website",
        email: application.email,
        replyto: application.email,
        botcheck: application.companyFax,
        "Company Name": application.companyName,
        "Contact Name": application.contactName,
        Phone: application.phone || "Not provided",
        "Business Type":
          businessTypeLabels[application.businessType] ||
          application.businessType,
        Website: application.website || "Not provided",
        "Expected Monthly Volume":
          application.expectedVolume || "Not provided",
        "Additional Information": application.message || "None",
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submission),
      });
      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message ??
            "We couldn’t send your application. Please try again."
        );
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t send your application."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex min-h-[420px] flex-col items-start justify-center rounded-sm border border-ok/25 bg-ok/5 p-8 sm:p-10"
        role="status"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok text-white">
          <CheckCircle2 size={24} />
        </span>
        <p className="eyebrow mt-7 text-ok">Application received</p>
        <h3 className="mt-2 max-w-md font-serif text-3xl text-ink">
          Thank you for your interest in Hearthline.
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-6 text-ink-soft">
          Our trade team will review your company information and respond by
          email within 1–2 business days with next steps.
        </p>
        <Link href="/products" className="button-dark mt-7">
          Explore the collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-5 sm:grid-cols-2">
      <Field label="Company name" name="companyName" required />
      <Field label="Contact name" name="contactName" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />

      <div>
        <label
          htmlFor="businessType"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Business type
        </label>
        <select
          id="businessType"
          name="businessType"
          required
          defaultValue=""
          className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/10"
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="fireplace_dealer">Fireplace / Hearth Dealer</option>
          <option value="home_furnishings_retailer">
            Home Furnishings Retailer
          </option>
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
        <label
          htmlFor="message"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Anything else we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/10"
        />
      </div>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor="companyFax">Company fax</label>
        <input
          id="companyFax"
          name="companyFax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" && (
        <div
          className="rounded-sm border border-warn/25 bg-warn/5 p-4 text-sm leading-6 text-ink-soft sm:col-span-2"
          role="alert"
        >
          {errorMessage}{" "}
          <a
            href="mailto:hearthlinesupply@calmantel.com"
            className="font-semibold text-ember-dark underline underline-offset-2"
          >
            Email Hearthline directly
          </a>
          .
        </div>
      )}

      <div className="border-t border-line pt-5 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-ember px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ember-dark hover:shadow-md disabled:translate-y-0 disabled:cursor-wait disabled:opacity-65 sm:w-auto sm:min-w-64"
        >
          {status === "submitting" ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Sending application…
            </>
          ) : (
            <>
              Submit dealer application <ArrowRight size={17} />
            </>
          )}
        </button>
        <p className="mt-3 flex items-center gap-2 text-xs leading-5 text-ink-soft/75">
          <ShieldCheck size={14} className="shrink-0 text-ok" />
          Your information is sent securely to the Hearthline trade team.
        </p>
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
      <label
        htmlFor={name}
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        maxLength={type === "email" ? 180 : 240}
        className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/10"
      />
    </div>
  );
}
