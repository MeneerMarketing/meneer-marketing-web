import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  createMolliePayment,
  isMollieConfigured,
} from "@/lib/mollie/client";
import {
  getInboundSubmission,
  insertCommercePayment,
  markInboundPaymentPending,
} from "@/lib/lge/inbound-store";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";

const bodySchema = z.object({
  submissionId: z.string().uuid(),
});

function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://meneermarketing.nl"
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isMollieConfigured() || !isLgeSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Betalingen zijn nog niet geconfigureerd." },
        { status: 503 },
      );
    }

    const raw: unknown = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
    }

    const submission = await getInboundSubmission(parsed.data.submissionId);
    if (!submission) {
      return NextResponse.json({ ok: false, error: "Aanvraag niet gevonden." }, { status: 404 });
    }

    if (submission.payment_status === "paid" || submission.payment_status === "waived") {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        paymentStatus: submission.payment_status,
      });
    }

    const amountCents = submission.launch_amount_cents;
    if (amountCents < 1) {
      return NextResponse.json({
        ok: false,
        error: "Geen launch fee verschuldigd (promo actief).",
      }, { status: 400 });
    }

    const base = siteBaseUrl();
    const returnPath =
      submission.source === "huidklinieken"
        ? "/huidklinieken/bedankt"
        : "/pilates-studios/bedankt";

    const payment = await createMolliePayment({
      amountCents,
      description: `Launch fee · ${submission.studio_name}`.slice(0, 255),
      redirectUrl: `${base}${returnPath}?betaald=1&submission=${submission.id}`,
      webhookUrl: `${base}/api/mollie/webhook`,
      metadata: {
        submission_id: submission.id,
        source: submission.source,
        campaign_ref: submission.campaign_ref ?? "",
      },
    });

    await insertCommercePayment({
      inboundSubmissionId: submission.id,
      campaignRef: submission.campaign_ref,
      campaignId: submission.campaign_id,
      businessId: submission.business_id,
      molliePaymentId: payment.id,
      checkoutUrl: payment.checkoutUrl,
      amountCents,
      description: `Launch fee · ${submission.studio_name}`,
      packageKey: submission.package_interest,
      source: submission.source,
      customerName: submission.studio_name,
      customerEmail: submission.email,
    });

    await markInboundPaymentPending(submission.id);

    if (!payment.checkoutUrl) {
      return NextResponse.json(
        { ok: false, error: "Mollie checkout URL ontbreekt." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: payment.checkoutUrl,
      molliePaymentId: payment.id,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Betaling starten mislukt.";
    console.error("[API mollie create]", message, err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
