import type { SupabaseClient } from "@supabase/supabase-js";

import { getLgeSupabaseAdmin } from "@/lib/lge/supabase-admin";
import { packageIdToKey } from "@/lib/lge/package-map";
import type { VerticalInterestId } from "@/data/verticals/types";

export type VerticalInboundSource = "pilates-studios" | "huidklinieken";

export type InboundPaymentStatus =
  | "none"
  | "pending"
  | "paid"
  | "failed"
  | "waived";

export interface InboundSubmissionInput {
  source: VerticalInboundSource;
  studioName: string;
  city: string;
  email: string;
  phone?: string;
  interest: VerticalInterestId;
  bookingNeed: string;
  message?: string;
  campaignRef?: string | null;
  launchPromoActive: boolean;
  launchAmountCents: number;
}

export interface InboundSubmissionRow {
  id: string;
  source: VerticalInboundSource;
  studio_name: string;
  city: string | null;
  email: string;
  phone: string | null;
  package_interest: string | null;
  booking_need: string | null;
  message: string | null;
  campaign_ref: string | null;
  campaign_id: string | null;
  business_id: string | null;
  status: string;
  payment_status: InboundPaymentStatus;
  launch_promo_active: boolean;
  launch_amount_cents: number;
  created_at: string;
}

interface CampaignLink {
  campaign_id: string | null;
  business_id: string | null;
}

async function resolveCampaignLink(
  client: SupabaseClient,
  campaignRef: string | null | undefined,
): Promise<CampaignLink> {
  if (!campaignRef) {
    return { campaign_id: null, business_id: null };
  }

  const { data } = await client
    .from("campaigns")
    .select("id, business_id")
    .eq("campaign_ref", campaignRef)
    .maybeSingle();

  if (!data) {
    return { campaign_id: null, business_id: null };
  }

  return {
    campaign_id: String(data.id),
    business_id: data.business_id ? String(data.business_id) : null,
  };
}

export async function persistInboundSubmission(
  input: InboundSubmissionInput,
): Promise<InboundSubmissionRow> {
  const client = getLgeSupabaseAdmin();
  const link = await resolveCampaignLink(client, input.campaignRef);
  const packageKey = packageIdToKey(input.interest);
  const paymentStatus: InboundPaymentStatus =
    input.launchAmountCents <= 0 ? "waived" : "none";

  const { data, error } = await client
    .from("inbound_submissions")
    .insert({
      source: input.source,
      studio_name: input.studioName.trim(),
      city: input.city.trim() || null,
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      package_interest: packageKey ?? input.interest,
      booking_need: input.bookingNeed,
      message: input.message?.trim() || null,
      campaign_ref: input.campaignRef?.trim() || null,
      campaign_id: link.campaign_id,
      business_id: link.business_id,
      payment_status: paymentStatus,
      launch_promo_active: input.launchPromoActive,
      launch_amount_cents: input.launchAmountCents,
      metadata: {
        interest_id: input.interest,
      },
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Inbound opslaan mislukt");
  }

  const row = data as InboundSubmissionRow;

  try {
    const { applySmartStopOnInbound } = await import("@/lib/lge/smart-stop-inbound");
    await applySmartStopOnInbound({
      businessId: row.business_id,
      email: row.email,
      campaignRef: row.campaign_ref,
      submissionId: row.id,
      source: row.source,
    });
  } catch (smartStopErr) {
    console.error("[inbound-store] smart stop", smartStopErr);
  }

  return row;
}

export async function getInboundSubmission(
  id: string,
): Promise<InboundSubmissionRow | null> {
  const client = getLgeSupabaseAdmin();
  const { data, error } = await client
    .from("inbound_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as InboundSubmissionRow | null) ?? null;
}

export async function markInboundPaymentPending(
  submissionId: string,
): Promise<void> {
  const client = getLgeSupabaseAdmin();
  const { error } = await client
    .from("inbound_submissions")
    .update({
      payment_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) throw new Error(error.message);
}

export async function markInboundPaymentResult(
  submissionId: string,
  status: "paid" | "failed",
): Promise<void> {
  const client = getLgeSupabaseAdmin();
  const patch: Record<string, string> = {
    payment_status: status,
    updated_at: new Date().toISOString(),
  };
  if (status === "paid") {
    patch.status = "won";
  }

  const { error } = await client
    .from("inbound_submissions")
    .update(patch)
    .eq("id", submissionId);

  if (error) throw new Error(error.message);
}

export async function insertCommercePayment(row: {
  inboundSubmissionId: string;
  campaignRef: string | null;
  campaignId: string | null;
  businessId: string | null;
  molliePaymentId: string;
  checkoutUrl: string | null;
  amountCents: number;
  description: string;
  packageKey: string | null;
  source: VerticalInboundSource;
  customerName: string;
  customerEmail: string;
}): Promise<string> {
  const client = getLgeSupabaseAdmin();
  const { data, error } = await client
    .from("commerce_payments")
    .insert({
      inbound_submission_id: row.inboundSubmissionId,
      campaign_ref: row.campaignRef,
      campaign_id: row.campaignId,
      business_id: row.businessId,
      mollie_payment_id: row.molliePaymentId,
      checkout_url: row.checkoutUrl,
      amount_cents: row.amountCents,
      description: row.description,
      package_key: row.packageKey,
      source: row.source,
      status: "open",
      customer_name: row.customerName,
      customer_email: row.customerEmail,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Betaling opslaan mislukt");
  }
  return String(data.id);
}

export async function updateCommercePaymentFromMollie(input: {
  molliePaymentId: string;
  status: string;
  paidAt: string | null;
  paymentMethod: string | null;
}): Promise<{
  paymentId: string;
  inboundSubmissionId: string | null;
  campaignId: string | null;
  businessId: string | null;
  campaignRef: string | null;
} | null> {
  const client = getLgeSupabaseAdmin();
  const now = new Date().toISOString();

  const { data: existing } = await client
    .from("commerce_payments")
    .select("*")
    .eq("mollie_payment_id", input.molliePaymentId)
    .maybeSingle();

  if (!existing) return null;

  const { error } = await client
    .from("commerce_payments")
    .update({
      status: input.status,
      paid_at: input.paidAt,
      payment_method: input.paymentMethod,
      updated_at: now,
    })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);

  if (input.status === "paid" && existing.inbound_submission_id) {
    await markInboundPaymentResult(String(existing.inbound_submission_id), "paid");
  } else if (
    ["failed", "expired", "canceled"].includes(input.status) &&
    existing.inbound_submission_id
  ) {
    await markInboundPaymentResult(String(existing.inbound_submission_id), "failed");
  }

  if (input.status === "paid" && existing.business_id) {
    await client
      .from("businesses")
      .update({
        lead_status: "CLIENT",
        last_activity_at: now,
        updated_at: now,
      })
      .eq("id", existing.business_id);
  }

  if (input.status === "paid" && existing.campaign_id) {
    await client
      .from("campaigns")
      .update({
        conversion_status: "WON",
        updated_at: now,
        last_activity_at: now,
      })
      .eq("id", existing.campaign_id);
  }

  if (input.status === "paid" && existing.business_id) {
    await client.from("activity_log").insert({
      business_id: existing.business_id,
      activity_type: "CLIENT_WON",
      title: "Launch fee betaald",
      description: existing.description ?? "Mollie betaling ontvangen",
      metadata: {
        mollie_payment_id: input.molliePaymentId,
        inbound_submission_id: existing.inbound_submission_id,
      },
    });
  }

  return {
    paymentId: String(existing.id),
    inboundSubmissionId: existing.inbound_submission_id
      ? String(existing.inbound_submission_id)
      : null,
    campaignId: existing.campaign_id ? String(existing.campaign_id) : null,
    businessId: existing.business_id ? String(existing.business_id) : null,
    campaignRef: existing.campaign_ref ? String(existing.campaign_ref) : null,
  };
}
