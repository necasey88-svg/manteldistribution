import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHearthlineAdmin } from "@/lib/admin";
import { DEALER_TIER_DISCOUNT_BPS } from "@/lib/dealer-pricing";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const ApprovalSchema = z.object({
  pricingTier: z.enum(["approved", "stocking", "program", "national"]),
  netTermsDays: z.number().int().min(0).max(90),
  discountBps: z.number().int().min(0).max(1500).nullable().optional(),
});

function accountNumber() {
  return `HS-${Date.now().toString().slice(-7)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user: admin },
  } = await supabase.auth.getUser();

  if (!admin || !isHearthlineAdmin(admin.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const parsed = ApprovalSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid approval settings" }, { status: 400 });
  }

  const { id } = await params;
  const service = createServiceClient();
  const { data: application, error: applicationError } = await service
    .from("dealer_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const email = application.email.toLowerCase();
  const { data: usersPage } = await service.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  let dealerUser = usersPage.users.find(
    (candidate) => candidate.email?.toLowerCase() === email
  );

  if (!dealerUser) {
    const redirectTo = `${request.nextUrl.origin}/auth/callback?next=/dealer/update-password`;
    const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        company_name: application.company_name,
        contact_name: application.contact_name,
      },
    });
    if (error || !data.user) {
      console.error("dealer invitation failed", error);
      return NextResponse.json(
        { error: "The dealer invitation could not be sent." },
        { status: 500 }
      );
    }
    dealerUser = data.user;
  }

  const { error: dealerError } = await service.from("dealers").upsert(
    {
      user_id: dealerUser.id,
      company_name: application.company_name,
      contact_name: application.contact_name,
      email,
      phone: application.phone,
      status: "approved",
      account_number: accountNumber(),
      pricing_tier: parsed.data.pricingTier,
      discount_bps:
        parsed.data.discountBps ??
        DEALER_TIER_DISCOUNT_BPS[parsed.data.pricingTier],
      net_terms_days: parsed.data.netTermsDays,
      approved_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (dealerError) {
    console.error("dealer activation failed", dealerError);
    return NextResponse.json(
      { error: "The dealer record could not be activated." },
      { status: 500 }
    );
  }

  await service
    .from("dealer_applications")
    .update({ status: "approved" })
    .eq("id", application.id);

  return NextResponse.json({ ok: true, email });
}
