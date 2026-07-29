"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next") ?? "/dealer/dashboard";
  const next = requestedNext.startsWith("/") ? requestedNext : "/dealer/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <Container className="py-20 max-w-md">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Dealer Login</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Sign in to place purchase orders, view dealer pricing, and track
        order status.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-line px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-warn">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-sm bg-steel-dark px-5 py-3 text-sm font-semibold text-white hover:bg-ink transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <Link href="/dealer/forgot-password" className="text-ember-dark underline underline-offset-2">
          Forgot password?
        </Link>
        <span className="text-ink-soft">Invitation-only access</span>
      </div>

      <p className="mt-6 border-t border-line pt-6 text-sm text-ink-soft">
        Not a dealer yet?{" "}
        <Link href="/become-a-dealer" className="underline hover:text-ember-dark">
          Apply for an account
        </Link>
      </p>
    </Container>
  );
}

export default function DealerLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
