import createMollieClient, { type MollieClient } from "@mollie/api-client";

import { getMollieApiKey, isMollieConfigured as isConfigured } from "./config";

export { isMollieConfigured } from "./config";

let cachedClient: MollieClient | null = null;

export function getMollieClient(): MollieClient {
  const apiKey = getMollieApiKey();
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY is niet geconfigureerd.");
  }

  if (!cachedClient) {
    cachedClient = createMollieClient({ apiKey });
  }

  return cachedClient;
}

export type MolliePaymentStatus =
  | "open"
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "canceled";

export interface MollieAmount {
  currency: string;
  value: string;
}

export interface MolliePaymentRecord {
  id: string;
  status: MolliePaymentStatus;
  amount: MollieAmount;
  description: string;
  method: string | null;
  paidAt: string | null;
  checkoutUrl: string | null;
  metadata: Record<string, string> | null;
}

function centsToMollieValue(cents: number): string {
  return (cents / 100).toFixed(2);
}

function mapPaymentRecord(raw: Record<string, unknown>): MolliePaymentRecord {
  const amount = raw.amount as MollieAmount | undefined;
  return {
    id: String(raw.id ?? ""),
    status: raw.status as MolliePaymentStatus,
    amount: amount ?? { currency: "EUR", value: "0.00" },
    description: String(raw.description ?? ""),
    method: typeof raw.method === "string" ? raw.method : null,
    paidAt: typeof raw.paidAt === "string" ? raw.paidAt : null,
    checkoutUrl:
      typeof raw._links === "object" &&
      raw._links !== null &&
      typeof (raw._links as { checkout?: { href?: string } }).checkout?.href ===
        "string"
        ? (raw._links as { checkout: { href: string } }).checkout.href
        : null,
    metadata:
      raw.metadata && typeof raw.metadata === "object"
        ? (raw.metadata as Record<string, string>)
        : null,
  };
}

/** Launch-fee flow via inbound API (fetch, metadata submission_id). */
export async function createMolliePayment(input: {
  amountCents: number;
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata: Record<string, string>;
}): Promise<MolliePaymentRecord> {
  if (!isConfigured()) {
    throw new Error("MOLLIE_API_KEY ontbreekt");
  }
  if (input.amountCents < 1) {
    throw new Error("Mollie vereist minimaal €0,01");
  }

  const apiKey = getMollieApiKey()!;
  const res = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: {
        currency: "EUR",
        value: centsToMollieValue(input.amountCents),
      },
      description: input.description.slice(0, 255),
      redirectUrl: input.redirectUrl,
      webhookUrl: input.webhookUrl,
      metadata: input.metadata,
    }),
  });

  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok || !json) {
    const detail =
      json && typeof json.detail === "string"
        ? json.detail
        : `Mollie create failed (${res.status})`;
    throw new Error(detail);
  }

  return mapPaymentRecord(json);
}

export async function getMolliePayment(
  paymentId: string,
): Promise<MolliePaymentRecord> {
  if (!isConfigured()) {
    throw new Error("MOLLIE_API_KEY ontbreekt");
  }

  const apiKey = getMollieApiKey()!;
  const res = await fetch(
    `https://api.mollie.com/v2/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    },
  );

  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok || !json) {
    throw new Error(`Mollie fetch failed (${res.status})`);
  }
  return mapPaymentRecord(json);
}
