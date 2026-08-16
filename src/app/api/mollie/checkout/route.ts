import { PaymentMethod, SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
  businessName: z.string().trim().min(2).max(160).optional(),
  campaignRef: z.string().trim().min(4).max(120).optional(),
});

type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

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

    const mollie = getMollieClient();
    const customer = await mollie.customers.create({
      name: body.name,
      email: body.email,
      metadata: {
        vertical: body.vertical,
        packageId: body.packageId,
        businessName: body.businessName ?? "",
        campaignRef: body.campaignRef ?? "",
      },
    });

    const payment = await mollie.payments.create({
      amount: quote.amount,
      description: quote.description,
      redirectUrl: mollieCheckoutRedirectUrl(verticalPath, "pending"),
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
        businessName: body.businessName ?? "",
        campaignRef: body.campaignRef ?? "",
        customerId: customer.id,
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      throw new Error("Mollie gaf geen checkout-URL terug.");
    }

    await mollie.payments.update(payment.id, {
      redirectUrl: mollieCheckoutRedirectUrl(verticalPath, payment.id),
    });

    return NextResponse.json(
      {
        paymentId: payment.id,
        checkoutUrl,
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
