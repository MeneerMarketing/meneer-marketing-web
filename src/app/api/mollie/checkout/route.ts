import { PaymentMethod, SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isContactMailConfigured } from "@/lib/contact-mail";
import {
  insertCommercePayment,
  markInboundPaymentPending,
  persistInboundSubmission,
} from "@/lib/lge/inbound-store";
import {
  buildInboundNotifyBody,
  sendInboundNotifyMail,
} from "@/lib/lge/inbound-notify-mail";
import { packageIdToKey } from "@/lib/lge/package-map";
import { postCampaignEvent } from "@/lib/lge/campaign";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";
import type { VerticalInterestId } from "@/data/verticals/types";
import {
  getSiteUrl,
  isMollieConfigured,
  mollieCheckoutRedirectUrl,
  mollieWebhookUrl,
} from "@/lib/mollie/config";
import { getMollieClient } from "@/lib/mollie/client";
import {
  buildLgeCheckoutQuote,
  type LgeCheckoutVerticalSlug,
} from "@/lib/mollie/lge-checkout";

const CheckoutRequestSchema = z.object({
  vertical: z.enum(["pilates-studios", "huidklinieken"]),
  packageId: z.enum(["studio-edition", "local-growth", "growth-partner"]),
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(1).max(120),
  businessName: z.string().trim().min(2).max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  bookingNeed: z.string().trim().min(1).max(40).default("unsure"),
  message: z.string().trim().max(5000).optional(),
  campaignRef: z.string().trim().min(4).max(120).optional(),
});

type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

function centsFromMollieValue(value: string): number {
  return Math.round(parseFloat(value) * 100);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isMollieConfigured()) {
    return NextResponse.json(
      {
        error: "Betalingen zijn nog niet geconfigureerd.",
        code: "MOLLIE_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  try {
    const raw = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ongeldige aanvraag.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body: CheckoutRequest = parsed.data;
    const quote = buildLgeCheckoutQuote(
      body.vertical as LgeCheckoutVerticalSlug,
      body.packageId,
    );
    const verticalPath =
      body.vertical === "pilates-studios"
        ? "/pilates-studios"
        : "/huidklinieken";
    const studioName = (body.businessName ?? body.name).trim();

    let submissionId: string | null = null;
    let campaignRef: string | null = body.campaignRef ?? null;
    let campaignId: string | null = null;
    let businessId: string | null = null;

    if (isLgeSupabaseConfigured()) {
      const row = await persistInboundSubmission({
        source: body.vertical,
        studioName,
        city: body.city,
        email: body.email,
        phone: body.phone,
        interest: body.packageId as VerticalInterestId,
        bookingNeed: body.bookingNeed,
        message: body.message,
        campaignRef,
        launchPromoActive: quote.setupWaived,
        launchAmountCents: 0,
      });
      submissionId = row.id;
      campaignRef = row.campaign_ref;
      campaignId = row.campaign_id;
      businessId = row.business_id;
      await markInboundPaymentPending(row.id);
    }

    if (isContactMailConfigured()) {
      const notifyBody = buildInboundNotifyBody({
        source: body.vertical,
        submissionId,
        studioName,
        city: body.city,
        email: body.email,
        phone: body.phone,
        bookingNeed: body.bookingNeed,
        interest: body.packageId,
        launchPromoActive: quote.setupWaived,
        campaignRef,
        message: body.message,
        paymentNote: "Route: iDEAL checkout (eerste maand)",
      });

      await sendInboundNotifyMail({
        source: body.vertical,
        subject: `[${body.vertical.replace(/-/g, " ")}] ${studioName} · ${body.city}`,
        replyToEmail: body.email,
        replyToName: studioName,
        body: notifyBody,
      });
    }

    const mollie = getMollieClient();
    const customer = await mollie.customers.create({
      name: body.name,
      email: body.email,
      metadata: {
        vertical: body.vertical,
        packageId: body.packageId,
        businessName: studioName,
        campaignRef: campaignRef ?? "",
        submission_id: submissionId ?? "",
      },
    });

    const payment = await mollie.payments.create({
      amount: quote.amount,
      description: quote.description,
      redirectUrl: mollieCheckoutRedirectUrl(verticalPath, "pending", {
        submissionId,
        studioName,
        city: body.city,
        packageId: body.packageId,
        campaignRef,
      }),
      webhookUrl: mollieWebhookUrl(),
      sequenceType: SequenceType.first,
      customerId: customer.id,
      method: [PaymentMethod.ideal, PaymentMethod.directdebit],
      metadata: {
        vertical: body.vertical,
        packageId: body.packageId,
        packageName: quote.packageName,
        monthlyAmount: quote.monthlyAmount.value,
        setupWaived: quote.setupWaived ? "1" : "0",
        minTermMonths: String(quote.minTermMonths),
        businessName: studioName,
        campaignRef: campaignRef ?? "",
        customerId: customer.id,
        submission_id: submissionId ?? "",
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      throw new Error("Mollie gaf geen checkout-URL terug.");
    }

    await mollie.payments.update(payment.id, {
      redirectUrl: mollieCheckoutRedirectUrl(verticalPath, payment.id, {
        submissionId,
        studioName,
        city: body.city,
        packageId: body.packageId,
        campaignRef,
      }),
    });

    if (submissionId && isLgeSupabaseConfigured()) {
      await insertCommercePayment({
        inboundSubmissionId: submissionId,
        campaignRef,
        campaignId,
        businessId,
        molliePaymentId: payment.id,
        checkoutUrl,
        amountCents: centsFromMollieValue(quote.amount.value),
        description: quote.description,
        packageKey: packageIdToKey(body.packageId),
        source: body.vertical,
        customerName: studioName,
        customerEmail: body.email.trim().toLowerCase(),
      });
    }

    if (campaignRef) {
      const pkg = packageIdToKey(body.packageId);
      void postCampaignEvent({
        campaignRef,
        eventType: "CONTACT_SUBMITTED",
        metadata: {
          path: verticalPath,
          section: "checkout",
          ...(pkg ? { package: pkg } : {}),
        },
        idempotencyKey: `CONTACT_SUBMITTED:${campaignRef}:${body.email.trim().toLowerCase()}`,
      });
    }

    return NextResponse.json(
      {
        paymentId: payment.id,
        checkoutUrl,
        submissionId,
        amount: quote.amount,
        description: quote.description,
        siteUrl: getSiteUrl(),
      },
      { status: 200 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout kon niet worden gestart.";
    console.error("[mollie/checkout]", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
