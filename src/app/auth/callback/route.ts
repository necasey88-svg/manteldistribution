import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Handles both auth link styles:
//  - PKCE / OAuth: ?code=... exchanged for a session
//  - Email links (invite, recovery, magic link, signup confirm):
//    ?token_hash=...&type=... verified via verifyOtp — the flow Supabase's
//    email templates use. Without this branch, invite/reset links fall
//    through and the user never reaches the set-password page.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = searchParams.get("next") ?? "/dealer/dashboard";
  const next = requestedNext.startsWith("/") ? requestedNext : "/dealer/dashboard";

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(
    new URL("/dealer/login?error=invalid-link", request.url)
  );
}
