import { NextResponse } from "next/server";
import { validateQuoteForm, type QuoteFormValues } from "@/lib/validation/quote";

/**
 * Accepts quote-form submissions. No email/CRM credentials were available
 * in this environment (see README "Form configuration"), so this route
 * validates the payload and logs it server-side rather than claiming to
 * have sent an email it cannot send. Wire NOTIFY_WEBHOOK_URL (or swap in a
 * provider such as Resend) to forward submissions in production.
 */
export async function POST(request: Request) {
  let body: Partial<QuoteFormValues>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Invalid request body." } },
      { status: 400 }
    );
  }

  // Honeypot: bots fill every field, including ones hidden from real users.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateQuoteForm(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const submission = {
    name: body.name?.trim(),
    email: body.email?.trim(),
    phone: body.phone?.trim() || null,
    company: body.company?.trim() || null,
    service: body.service,
    budget: body.budget || null,
    message: body.message?.trim(),
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch (error) {
      console.error("Failed to forward quote submission", error);
      return NextResponse.json(
        { ok: false, errors: { form: "Could not send your request. Please try again." } },
        { status: 502 }
      );
    }
  } else {
    // No delivery provider configured — record it so it isn't silently lost.
    console.info("[quote-submission]", submission);
  }

  return NextResponse.json({ ok: true });
}
