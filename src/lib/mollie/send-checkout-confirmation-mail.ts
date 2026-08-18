import type { Payment } from "@mollie/api-client";

import type { VerticalPackageId } from "@/data/verticals/types";
import { getInboundSubmission } from "@/lib/lge/inbound-store";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";
import { isContactMailConfigured } from "@/lib/contact-mail";
import { getMollieClient } from "@/lib/mollie/client";
import {
  buildLgeCheckoutQuote,
  type LgeCheckoutVerticalSlug,
} from "@/lib/mollie/lge-checkout";
import { sendSubscriptionConfirmationMail } from "@/lib/verticals/lead-confirmation-mail";

function readMetadataString(
  metadata: unknown,
  key: string,
): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isCheckoutVertical(
  value: string | null,
): value is LgeCheckoutVerticalSlug {
  return value === "pilates-studios" || value === "huidklinieken";
}

function isCheckoutPackageId(
  value: string | null,
): value is VerticalPackageId {
  return (
    value === "studio-edition" ||
    value === "local-growth" ||
    value === "growth-partner"
  );
}

async function resolveCustomerEmail(payment: Payment): Promise<string | null> {
  const submissionId = readMetadataString(payment.metadata, "submission_id");

  if (submissionId && isLgeSupabaseConfigured()) {
    const submission = await getInboundSubmission(submissionId);
    if (submission?.email) {
      return submission.email.trim().toLowerCase();
    }
  }

  if (payment.customerId) {
    const mollie = getMollieClient();
    const customer = await mollie.customers.get(payment.customerId);
    if (customer.email) {
      return customer.email.trim().toLowerCase();
    }
  }

  return null;
}

export async function sendCheckoutConfirmationMailForPayment(
  payment: Payment,
): Promise<void> {
  if (!isContactMailConfigured()) {
    return;
  }

  if (readMetadataString(payment.metadata, "confirmationMailSent") === "1") {
    return;
  }

  const verticalRaw = readMetadataString(payment.metadata, "vertical");
  const packageIdRaw = readMetadataString(payment.metadata, "packageId");

  if (!isCheckoutVertical(verticalRaw) || !isCheckoutPackageId(packageIdRaw)) {
    return;
  }

  const email = await resolveCustomerEmail(payment);
  if (!email) {
    console.warn("[mollie/checkout-confirmation] geen klant-e-mail", {
      paymentId: payment.id,
    });
    return;
  }

  const submissionId = readMetadataString(payment.metadata, "submission_id");
  let studioName =
    readMetadataString(payment.metadata, "businessName") ?? "jouw studio";
  let city = "";

  if (submissionId && isLgeSupabaseConfigured()) {
    const submission = await getInboundSubmission(submissionId);
    if (submission) {
      studioName = submission.studio_name.trim() || studioName;
      city = submission.city?.trim() ?? "";
    }
  }

  const quote = buildLgeCheckoutQuote(verticalRaw, packageIdRaw);
  const monthlyExclLabel = `€${quote.monthlyExcl.value.replace(".", ",")}`;

  await sendSubscriptionConfirmationMail({
    toEmail: email,
    studioName,
    city,
    source: verticalRaw,
    packageName: quote.packageName,
    monthlyExclLabel,
    setupWaived: quote.setupWaived,
  });

  const mollie = getMollieClient();
  await mollie.payments.update(payment.id, {
    metadata: {
      ...(payment.metadata ?? {}),
      confirmationMailSent: "1",
    },
  });
}
