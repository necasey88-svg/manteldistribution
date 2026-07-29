"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 10) {
      setError("Use at least 10 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords do not match.");
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/dealer/dashboard?activated=1");
    router.refresh();
  }

  return (
    <Container className="max-w-md py-20">
      <p className="eyebrow text-ember">Secure dealer account</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Create your password</h1>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        Use a unique password for your individual Hearthline login.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
          New password
          <input type="password" required value={password} onChange={(event)=>setPassword(event.target.value)} className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal text-ink" />
        </label>
        <label className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
          Confirm password
          <input type="password" required value={confirm} onChange={(event)=>setConfirm(event.target.value)} className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal text-ink" />
        </label>
        {error && <p className="text-sm text-warn">{error}</p>}
        <button className="button-dark w-full">Save password and continue</button>
      </form>
    </Container>
  );
}

