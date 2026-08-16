import { NextRequest, NextResponse } from "next/server";

import { getMolliePayment, isMollieConfigured } from "@/lib/mollie/client";
import { updateCommercePaymentFromMollie } from "@/lib/lge/inbound-store";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";

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

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isMollieConfigured() || !isLgeSupabaseConfigured()) {
    return new NextResponse("Not configured", { status: 503 });
  }

  try {
    const form = await req.formData();
    const paymentId = form.get("id");
    if (typeof paymentId !== "string" || !paymentId.trim()) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const payment = await getMolliePayment(paymentId.trim());
    const status = mapMollieStatus(payment.status);

    await updateCommercePaymentFromMollie({
      molliePaymentId: payment.id,
      status,
      paidAt: payment.paidAt,
      paymentMethod: payment.method,
    });

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[Mollie webhook]", err);
    return new NextResponse("Error", { status: 500 });
  }
}
