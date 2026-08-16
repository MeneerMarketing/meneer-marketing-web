import { PaymentStatus, SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";

import { isMollieConfigured } from "@/lib/mollie/config";
import { getMollieClient } from "@/lib/mollie/client";
import { ensureLgeSubscriptionAfterFirstPayment } from "@/lib/mollie/subscription";

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

    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);

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

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[mollie/webhook]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
