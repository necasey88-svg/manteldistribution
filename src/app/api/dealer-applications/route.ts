import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ApplicationSchema = z.object({
  companyName: z.string().trim().min(1).max(120),
  contactName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional(),
  businessType: z.string().trim().min(1).max(80),
  website: z.string().trim().max(240).optional(),
  expectedVolume: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  companyFax: z.string().max(0).optional(),
  startedAt: z.number().int().positive(),
});

const MINIMUM_COMPLETION_TIME_MS = 2500;

const businessTypeLabels: Record<string, string> = {
  fireplace_dealer: "Fireplace / Hearth Dealer",
  home_furnishings_retailer: "Home Furnishings Retailer",
  builder_remodeler: "Builder / Remodeler",
  other: "Other",
};

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const parsed = ApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please review the required information and try again.",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  // Silently accept honeypot and impossibly fast submissions so bots
  // receive no information about how the form is protected.
  if (
    parsed.data.companyFax ||
    Date.now() - parsed.data.startedAt < MINIMUM_COMPLETION_TIME_MS
  ) {
    return NextResponse.json({ ok: true });
  }

  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error("WEB3FORMS_ACCESS_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "We couldn’t send your application. Please try again or email our trade team.",
        },
        { status: 503 }
      );
    }

    const submission = {
      access_key: accessKey,
      subject: `New Hearthline dealer application — ${parsed.data.companyName}`,
      from_name: "Hearthline Supply Website",
      email: parsed.data.email,
      replyto: parsed.data.email,
      botcheck: false,
      "Company Name": parsed.data.companyName,
      "Contact Name": parsed.data.contactName,
      Phone: parsed.data.phone || "Not provided",
      "Business Type":
        businessTypeLabels[parsed.data.businessType] || parsed.data.businessType,
      Website: parsed.data.website || "Not provided",
      "Expected Monthly Volume":
        parsed.data.expectedVolume || "Not provided",
      "Additional Information": parsed.data.message || "None",
      "Submitted At": new Date().toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Los_Angeles",
      }),
    };

    const delivery = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submission),
        cache: "no-store",
      }
    );

    const result = await delivery.json().catch(() => null);

    if (!delivery.ok || result?.success !== true) {
      console.error("Web3Forms dealer application delivery failed", result);
      return NextResponse.json(
        {
          error:
            "We couldn’t send your application. Please try again or email our trade team.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("dealer application delivery error", error);
    return NextResponse.json(
      {
        error:
          "We couldn’t send your application. Please try again or email our trade team.",
      },
      { status: 502 }
    );
  }
}
