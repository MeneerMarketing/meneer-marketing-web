import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Business,
  FollowupTemplateId,
  OutreachMessage,
  OutreachMessageStatus,
} from "@/types/domain";

const PARENT_SENT = ["SENT", "DELIVERED", "OPENED", "CLICKED"] as const;
const BLOCK_FOLLOWUP = ["REPLIED", "INBOUND", "BOUNCED", "SUPPRESSED", "UNSUBSCRIBED"] as const;

export interface FollowupCandidate {
  business: Business;
  parentMessage: OutreachMessage;
  cityName: string | null;
  verticalName: string | null;
  daysSinceSent: number | null;
  hasFollowupDraft: boolean;
  followupDraftStatus: OutreachMessageStatus | null;
  followupMessageId: string | null;
  selectedForFollowup: boolean;
}

export interface FollowupQueueRow {
  message: OutreachMessage;
  business: Business;
  cityName: string | null;
  parentSentAt: string | null;
}

function daysBetween(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export async function listFollowupCandidates(): Promise<FollowupCandidate[]> {
  const client = createAdminClient();

  const [{ data: parents }, { data: businesses }, { data: cities }, { data: verticals }, { data: followups }] =
    await Promise.all([
      client
        .from("outreach_messages")
        .select("*")
        .eq("message_kind", "initial")
        .eq("is_test", false)
        .in("status", [...PARENT_SENT])
        .order("sent_at", { ascending: false }),
      client.from("businesses").select("*").eq("is_demo", false),
      client.from("cities").select("id, name"),
      client.from("verticals").select("id, name"),
      client
        .from("outreach_messages")
        .select("*")
        .eq("message_kind", "followup")
        .eq("is_test", false),
    ]);

  const businessMap = new Map((businesses ?? []).map((b) => [b.id, b as Business]));
  const cityMap = new Map((cities ?? []).map((c) => [c.id, c.name as string]));
  const verticalMap = new Map((verticals ?? []).map((v) => [v.id, v.name as string]));

  const latestParentByBusiness = new Map<string, OutreachMessage>();
  for (const row of parents ?? []) {
    const msg = row as OutreachMessage;
    if (BLOCK_FOLLOWUP.includes(msg.status as (typeof BLOCK_FOLLOWUP)[number])) continue;
    if (!latestParentByBusiness.has(msg.business_id)) {
      latestParentByBusiness.set(msg.business_id, msg);
    }
  }

  const followupByBusiness = new Map<string, OutreachMessage>();
  for (const row of followups ?? []) {
    const msg = row as OutreachMessage;
    const existing = followupByBusiness.get(msg.business_id);
    if (!existing || msg.created_at > existing.created_at) {
      followupByBusiness.set(msg.business_id, msg);
    }
  }

  const candidates: FollowupCandidate[] = [];

  for (const [businessId, parentMessage] of latestParentByBusiness) {
    const business = businessMap.get(businessId);
    if (!business) continue;
    if (["INBOUND", "CLIENT", "MEETING", "DO_NOT_CONTACT", "REJECTED"].includes(business.lead_status)) {
      continue;
    }

    const followup = followupByBusiness.get(businessId);
    const draftStatuses = ["DRAFT", "REVIEW_REQUIRED", "APPROVED", "SCHEDULED"];
    const hasFollowupDraft = followup
      ? draftStatuses.includes(followup.status)
      : false;

    candidates.push({
      business,
      parentMessage,
      cityName: cityMap.get(business.city_id) ?? null,
      verticalName: verticalMap.get(business.vertical_id) ?? null,
      daysSinceSent: daysBetween(parentMessage.sent_at),
      hasFollowupDraft,
      followupDraftStatus: hasFollowupDraft ? followup!.status : null,
      followupMessageId: followup?.id ?? null,
      selectedForFollowup: Boolean(business.selected_for_followup),
    });
  }

  return candidates.sort((a, b) => {
    if (a.selectedForFollowup !== b.selectedForFollowup) {
      return a.selectedForFollowup ? -1 : 1;
    }
    return (b.daysSinceSent ?? 0) - (a.daysSinceSent ?? 0);
  });
}

export async function listFollowupMessages(
  statusFilter?: OutreachMessageStatus | "all",
): Promise<FollowupQueueRow[]> {
  const client = createAdminClient();

  let query = client
    .from("outreach_messages")
    .select("*")
    .eq("message_kind", "followup")
    .eq("is_test", false)
    .order("updated_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: messages } = await query;
  if (!messages?.length) return [];

  const businessIds = [...new Set(messages.map((m) => m.business_id))];
  const parentIds = messages
    .map((m) => (m as OutreachMessage).parent_message_id)
    .filter(Boolean) as string[];

  const [{ data: businesses }, { data: cities }, { data: parents }] = await Promise.all([
    client.from("businesses").select("*").in("id", businessIds),
    client.from("cities").select("id, name"),
    parentIds.length
      ? client.from("outreach_messages").select("id, sent_at").in("id", parentIds)
      : Promise.resolve({ data: [] }),
  ]);

  const businessMap = new Map((businesses ?? []).map((b) => [b.id, b as Business]));
  const cityMap = new Map((cities ?? []).map((c) => [c.id, c.name as string]));
  const parentSentMap = new Map(
    (parents ?? []).map((p) => [p.id as string, p.sent_at as string | null]),
  );

  return (messages as OutreachMessage[]).map((message) => {
    const business = businessMap.get(message.business_id)!;
    return {
      message,
      business,
      cityName: cityMap.get(business.city_id) ?? null,
      parentSentAt: message.parent_message_id
        ? parentSentMap.get(message.parent_message_id) ?? null
        : null,
    };
  });
}

export function filterCandidatesForList(
  candidates: FollowupCandidate[],
  mode: "candidates" | "followup_list",
): FollowupCandidate[] {
  if (mode === "followup_list") {
    return candidates.filter((c) => c.selectedForFollowup);
  }
  return candidates;
}

export function followupTemplateFromFilter(
  value: string | undefined,
): FollowupTemplateId {
  if (value === "last_ping" || value === "custom") return value;
  return "check_in";
}
