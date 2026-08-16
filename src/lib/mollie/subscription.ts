import type { Payment } from "@mollie/api-client";

import type { VerticalPackageId } from "@/data/verticals/types";

import { getMollieClient } from "./client";
import { mollieWebhookUrl } from "./config";
import {
  buildLgeCheckoutQuote,
  type LgeCheckoutVerticalSlug,
} from "./lge-checkout";

function readMetadataString(
  metadata: unknown,
  key: string,
): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export async function ensureLgeSubscriptionAfterFirstPayment(
  payment: Payment,
): Promise<void> {
  if (readMetadataString(payment.metadata, "subscriptionId")) {
    return;
  }

  const vertical = readMetadataString(
    payment.metadata,
    "vertical",
  ) as LgeCheckoutVerticalSlug | null;
  const packageId = readMetadataString(
    payment.metadata,
    "packageId",
  ) as VerticalPackageId | null;
  const customerId =
    payment.customerId ?? readMetadataString(payment.metadata, "customerId");

  if (!vertical || !packageId || !customerId) {
    console.warn("[mollie/subscription] metadata ontbreekt", {
      paymentId: payment.id,
      vertical,
      packageId,
      customerId,
    });
    return;
  }

  const quote = buildLgeCheckoutQuote(vertical, packageId);
  const mollie = getMollieClient();

  const subscription = await mollie.customerSubscriptions.create({
    customerId,
    amount: quote.monthlyAmount,
    interval: "1 month",
    description: `${quote.packageName} · maandelijks · Meneer Marketing`,
    webhookUrl: mollieWebhookUrl(),
    metadata: {
      vertical,
      packageId,
      packageName: quote.packageName,
      firstPaymentId: payment.id,
    },
  });

  await mollie.payments.update(payment.id, {
    metadata: {
      ...(payment.metadata ?? {}),
      subscriptionId: subscription.id,
    },
  });

  console.info("[mollie/subscription] created", {
    subscriptionId: subscription.id,
    customerId,
    vertical,
    packageId,
    monthlyAmount: quote.monthlyAmount.value,
  });
}
