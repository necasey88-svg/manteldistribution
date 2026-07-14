import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const ApplicationSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  businessType: z.string().min(1),
  website: z.string().optional(),
  expectedVolume: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = ApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("dealer_applications").insert({
      company_name: parsed.data.companyName,
      contact_name: parsed.data.contactName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      business_type: parsed.data.businessType,
      website: parsed.data.website ?? null,
      expected_volume: parsed.data.expectedVolume ?? null,
      message: parsed.data.message ?? null,
    });

    if (error) {
      console.error("dealer_applications insert failed", error);
      return NextResponse.json(
        { error: "Could not save application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("dealer_applications route error", err);
    return NextResponse.json(
      {
        error:
          "Dealer applications are not connected to a database yet. Configure Supabase env vars — see .env.example.",
      },
      { status: 503 }
    );
  }
}
