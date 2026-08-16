import { NextRequest, NextResponse } from "next/server";

import { isMollieConfigured } from "@/lib/mollie/config";
import { getMollieClient } from "@/lib/mollie/client";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isMollieConfigured()) {
    return NextResponse.json(
      { error: "Betalingen zijn nog niet geconfigureerd." },
      { status: 503 },
    );
  }

  const paymentId = req.nextUrl.searchParams.get("id")?.trim();
  if (!paymentId) {
    return NextResponse.json({ error: "Geen betaling opgegeven." }, { status: 400 });
  }

  try {
    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      description: payment.description,
      packageName:
        typeof (payment.metadata as Record<string, unknown> | null)?.packageName ===
        "string"
          ? ((payment.metadata as Record<string, unknown>).packageName as string)
          : null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Betaling kon niet worden opgehaald.";
    console.error("[mollie/payment]", message, err);
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
