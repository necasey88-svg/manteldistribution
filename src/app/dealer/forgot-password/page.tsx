"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/dealer/update-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <Container className="max-w-md py-20">
      <p className="eyebrow text-ember">Dealer access</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Reset your password</h1>
      {sent ? (
        <div className="mt-8 rounded-sm border border-ok/25 bg-ok/5 p-5 text-sm leading-6 text-ink-soft">
          Check your email for a secure password-reset link. For security, the
          message will look the same even if the address is not registered.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
            Dealer email
            <input type="email" required value={email} onChange={(event)=>setEmail(event.target.value)} className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal text-ink" />
          </label>
          {error && <p className="mt-3 text-sm text-warn">{error}</p>}
          <button className="button-dark mt-5 w-full">Send reset link</button>
        </form>
      )}
      <Link href="/dealer/login" className="mt-6 inline-block text-sm text-ember-dark underline underline-offset-2">
        Return to dealer login
      </Link>
    </Container>
  );
}

