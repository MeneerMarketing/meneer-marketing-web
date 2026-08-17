import type { VerticalPackageId } from "@/data/verticals/types";

import type { LgeCheckoutVerticalSlug } from "./lge-checkout";

export interface StartLgeCheckoutInput {
  vertical: LgeCheckoutVerticalSlug;
  packageId: VerticalPackageId;
  email: string;
  name: string;
  city: string;
  businessName?: string;
  phone?: string;
  bookingNeed?: string;
  message?: string;
  campaignRef?: string | null;
}

export interface StartLgeCheckoutResult {
  paymentId: string;
  checkoutUrl: string;
}

export async function startLgeCheckout(
  input: StartLgeCheckoutInput,
): Promise<StartLgeCheckoutResult> {
  const response = await fetch("/api/mollie/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vertical: input.vertical,
      packageId: input.packageId,
      email: input.email,
      name: input.name,
      city: input.city,
      businessName: input.businessName,
      phone: input.phone,
      bookingNeed: input.bookingNeed,
      message: input.message,
      campaignRef: input.campaignRef ?? undefined,
    }),
  });

  const payload = (await response.json()) as {
    error?: string;
    checkoutUrl?: string;
    paymentId?: string;
  };

  if (!response.ok || !payload.checkoutUrl || !payload.paymentId) {
    throw new Error(payload.error ?? "Checkout starten mislukt.");
  }

  return {
    paymentId: payload.paymentId,
    checkoutUrl: payload.checkoutUrl,
  };
}
