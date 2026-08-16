const MOLLIE_API = "https://api.mollie.com/v2";

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

export interface MolliePayment {
  id: string;
  status: MolliePaymentStatus;
  amount: MollieAmount;
  description: string;
  method: string | null;
  paidAt: string | null;
  checkoutUrl: string | null;
  metadata: Record<string, string> | null;
}

function getMollieApiKey(): string {
  const key = process.env.MOLLIE_API_KEY?.trim();
  if (!key) {
    throw new Error("MOLLIE_API_KEY ontbreekt");
  }
  return key;
}

function centsToMollieValue(cents: number): string {
  return (cents / 100).toFixed(2);
}

function mapPayment(raw: Record<string, unknown>): MolliePayment {
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

export function isMollieConfigured(): boolean {
  return Boolean(process.env.MOLLIE_API_KEY?.trim());
}

export async function createMolliePayment(input: {
  amountCents: number;
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata: Record<string, string>;
}): Promise<MolliePayment> {
  if (input.amountCents < 1) {
    throw new Error("Mollie vereist minimaal €0,01");
  }

  const res = await fetch(`${MOLLIE_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMollieApiKey()}`,
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

  return mapPayment(json);
}

export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  const res = await fetch(
    `${MOLLIE_API}/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: { Authorization: `Bearer ${getMollieApiKey()}` },
      cache: "no-store",
    },
  );

  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok || !json) {
    throw new Error(`Mollie fetch failed (${res.status})`);
  }
  return mapPayment(json);
}
