import type { SupabaseClient } from "@supabase/supabase-js";

import { getLgeSupabaseAdmin } from "@/lib/lge/supabase-admin";

const SKIP_STATUS_UPDATE = new Set(["CLIENT", "DO_NOT_CONTACT", "REJECTED"]);

export interface SmartStopInboundInput {
  businessId?: string | null;
  email: string;
  campaignRef?: string | null;
  submissionId?: string;
  source?: string;
}

export interface SmartStopInboundResult {
  businessId: string | null;
  cancelledScheduled: number;
  cancelledMessageIds: string[];
  leadStatusUpdated: boolean;
  leadStatus: string | null;
}

async function resolveBusinessId(
  client: SupabaseClient,
  input: SmartStopInboundInput,
): Promise<string | null> {
  if (input.businessId) return input.businessId;

  const campaignRef = input.campaignRef?.trim();
  if (campaignRef) {
    const { data: campaign } = await client
      .from("campaigns")
      .select("business_id")
      .eq("campaign_ref", campaignRef)
      .maybeSingle();
    if (campaign?.business_id) return String(campaign.business_id);
  }

  const email = input.email.trim().toLowerCase();
  if (!email) return null;

  const { data: contact } = await client
    .from("contacts")
    .select("business_id")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (contact?.business_id) return String(contact.business_id);

  const { data: business } = await client
    .from("businesses")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return business?.id ? String(business.id) : null;
}

async function cancelScheduledOutreachForBusiness(
  client: SupabaseClient,
  businessId: string,
  reason: string,
): Promise<string[]> {
  const { data: scheduled } = await client
    .from("outreach_messages")
    .select("id, metadata")
    .eq("business_id", businessId)
    .eq("status", "SCHEDULED")
    .eq("is_test", false);

  const cancelled: string[] = [];
  const now = new Date().toISOString();

  for (const row of scheduled ?? []) {
    const meta = (row.metadata as Record<string, unknown> | null) ?? {};
    const { error } = await client
      .from("outreach_messages")
      .update({
        status: "APPROVED",
        scheduled_at: null,
        updated_at: now,
        metadata: {
          ...meta,
          smart_stop_cancelled_at: now,
          smart_stop_reason: reason,
        },
      })
      .eq("id", row.id);

    if (!error) cancelled.push(String(row.id));
  }

  return cancelled;
}

/**
 * Formulier op meneermarketing.nl → geen awkward follow-ups meer.
 * Annuleert geplande outreach/follow-ups en zet lead op INBOUND.
 */
export async function applySmartStopOnInbound(
  input: SmartStopInboundInput,
): Promise<SmartStopInboundResult> {
  const client = getLgeSupabaseAdmin();
  const businessId = await resolveBusinessId(client, input);

  if (!businessId) {
    return {
      businessId: null,
      cancelledScheduled: 0,
      cancelledMessageIds: [],
      leadStatusUpdated: false,
      leadStatus: null,
    };
  }

  const { data: business } = await client
    .from("businesses")
    .select("id, lead_status, studio_name")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) {
    return {
      businessId,
      cancelledScheduled: 0,
      cancelledMessageIds: [],
      leadStatusUpdated: false,
      leadStatus: null,
    };
  }

  const reason = "inbound_form";
  const cancelledMessageIds = await cancelScheduledOutreachForBusiness(
    client,
    businessId,
    reason,
  );

  const now = new Date().toISOString();
  const currentStatus = String(business.lead_status);
  let leadStatusUpdated = false;
  let nextStatus = currentStatus;

  if (!SKIP_STATUS_UPDATE.has(currentStatus)) {
    nextStatus = "INBOUND";
    leadStatusUpdated = currentStatus !== "INBOUND";
  }

  await client
    .from("businesses")
    .update({
      lead_status: nextStatus,
      selected_for_followup: false,
      selected_for_followup_at: null,
      last_activity_at: now,
      updated_at: now,
    })
    .eq("id", businessId);

  if (cancelledMessageIds.length > 0 || leadStatusUpdated) {
    await client.from("activity_log").insert({
      business_id: businessId,
      activity_type: "INBOUND_FORM_RECEIVED",
      title: "Formulier ingevuld · smart stop",
      description:
        cancelledMessageIds.length > 0
          ? `${cancelledMessageIds.length} geplande mail(s) geannuleerd`
          : "Lead gemarkeerd als INBOUND",
      metadata: {
        submission_id: input.submissionId ?? null,
        campaign_ref: input.campaignRef ?? null,
        cancelled_message_ids: cancelledMessageIds,
        previous_lead_status: currentStatus,
        lead_status: nextStatus,
        source: input.source ?? null,
      },
    });
  }

  for (const messageId of cancelledMessageIds) {
    await client.from("activity_log").insert({
      business_id: businessId,
      activity_type: "OUTREACH_SCHEDULE_CANCELLED",
      title: "Geplande mail geannuleerd (inbound)",
      metadata: {
        message_id: messageId,
        smart_stop: true,
        submission_id: input.submissionId ?? null,
      },
    });
  }

  return {
    businessId,
    cancelledScheduled: cancelledMessageIds.length,
    cancelledMessageIds,
    leadStatusUpdated,
    leadStatus: nextStatus,
  };
}
