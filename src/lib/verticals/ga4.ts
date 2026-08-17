type GtagFn = (
  command: "event",
  name: string,
  params?: Record<string, unknown>,
) => void;

function gtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
}

/** GA4 + dataLayer voor vertical funnel. */
export function trackConversionEvent(
  eventName: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: eventName, ...params });

  const send = gtag();
  if (send) {
    send("event", eventName, params);
  }
}

export function trackGenerateLead(input: {
  vertical: string;
  campaignRef?: string | null;
  packageId?: string;
  value?: number;
}): void {
  trackConversionEvent("generate_lead", {
    vertical: input.vertical,
    campaign_ref: input.campaignRef ?? undefined,
    package_id: input.packageId,
    value: input.value,
    currency: "EUR",
  });
}

export function trackBeginCheckout(input: {
  vertical: string;
  campaignRef?: string | null;
  valueCents: number;
}): void {
  trackConversionEvent("begin_checkout", {
    vertical: input.vertical,
    campaign_ref: input.campaignRef ?? undefined,
    value: input.valueCents / 100,
    currency: "EUR",
  });
}

export function trackPurchase(input: {
  vertical: string;
  campaignRef?: string | null;
  valueCents: number;
  transactionId?: string;
}): void {
  trackConversionEvent("purchase", {
    vertical: input.vertical,
    campaign_ref: input.campaignRef ?? undefined,
    value: input.valueCents / 100,
    currency: "EUR",
    transaction_id: input.transactionId,
  });
}
