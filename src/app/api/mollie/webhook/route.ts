import { PaymentStatus, SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";

import { updateCommercePaymentFromMollie } from "@/lib/lge/inbound-store";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";
import { getMolliePayment, isMollieConfigured } from "@/lib/mollie/client";
import { getMollieClient } from "@/lib/mollie/client";
import { ensureLgeSubscriptionAfterFirstPayment } from "@/lib/mollie/subscription";

function mapMollieStatus(status: string): string {
  switch (status) {
    case "open":
    case "pending":
    case "paid":
    case "failed":
    case "expired":
    case "canceled":
      return status;
    default:
      return "failed";
  }
}

function readMetadataString(metadata: unknown, key: string): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isMollieConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const form = await req.formData();
    const paymentId = form.get("id");

    if (typeof paymentId !== "string" || paymentId.trim().length === 0) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const trimmedId = paymentId.trim();
    const mollie = getMollieClient();
    const payment = await mollie.payments.get(trimmedId);

    if (payment.status === PaymentStatus.paid) {
      console.info("[mollie/webhook] paid", {
        id: payment.id,
        amount: payment.amount,
        metadata: payment.metadata,
        customerId: payment.customerId,
        sequenceType: payment.sequenceType,
      });

      if (payment.sequenceType === SequenceType.first) {
        await ensureLgeSubscriptionAfterFirstPayment(payment);
      }
    }

    if (
      payment.status === PaymentStatus.failed ||
      payment.status === PaymentStatus.canceled ||
      payment.status === PaymentStatus.expired
    ) {
      console.warn("[mollie/webhook] terminal", {
        id: payment.id,
        status: payment.status,
        metadata: payment.metadata,
      });
    }

    const submissionId = readMetadataString(payment.metadata, "submission_id");
    if (submissionId && isLgeSupabaseConfigured()) {
      const legacyPayment = await getMolliePayment(trimmedId);
      await updateCommercePaymentFromMollie({
        molliePaymentId: legacyPayment.id,
        status: mapMollieStatus(legacyPayment.status),
        paidAt: legacyPayment.paidAt,
        paymentMethod: legacyPayment.method,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[mollie/webhook]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
