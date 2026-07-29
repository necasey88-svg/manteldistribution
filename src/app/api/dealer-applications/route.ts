import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const ApplicationSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(80).optional(),
  businessType: z.string().trim().min(2).max(100),
  website: z.string().trim().max(240).optional(),
  expectedVolume: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  companyFax: z.string().max(0).optional(),
  startedAt: z.number().int().positive(),
});

const businessTypeLabels: Record<string, string> = {
  fireplace_dealer: "Fireplace / Hearth Dealer",
  home_furnishings_retailer: "Home Furnishings Retailer",
  builder_remodeler: "Builder / Remodeler",
  other: "Other",
};

export async function POST(request: NextRequest) {
  const parsed = ApplicationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please review the application fields and try again." },
      { status: 400 }
    );
  }

  const application = parsed.data;
  if (application.companyFax || Date.now() - application.startedAt < 2500) {
    return NextResponse.json({ ok: true });
  }

  let recorded = false;
  let delivered = false;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const service = createServiceClient();
    const { error } = await service.from("dealer_applications").insert({
      company_name: application.companyName,
      contact_name: application.contactName,
      email: application.email.toLowerCase(),
      phone: application.phone || null,
      business_type: application.businessType,
      website: application.website || null,
      expected_volume: application.expectedVolume || null,
      message: application.message || null,
      status: "new",
    });
    recorded = !error;
    if (error) console.error("dealer application record failed", error);
  }

  if (process.env.WEB3FORMS_ACCESS_KEY) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `New Hearthline dealer application — ${application.companyName}`,
        from_name: "Hearthline Supply Website",
        email: application.email,
        replyto: application.email,
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
      }),
    });
    const result = await response.json().catch(() => null);
    delivered = response.ok && result?.success === true;
  }

  if (!recorded && !delivered) {
    return NextResponse.json(
      { error: "We couldn’t send your application. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}

