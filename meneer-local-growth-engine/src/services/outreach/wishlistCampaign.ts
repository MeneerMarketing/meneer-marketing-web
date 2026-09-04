import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { generateOutreachDraft } from "@/services/outreach/outreachGenerator";
import {
  cancelScheduledOutreach,
  scheduleOutreachEmail,
} from "@/services/outreach/sendService";
import {
  buildOptimizedSendSlots,
  describeSendTimeRules,
  validateSendSlot,
  type SendDaySummary,
} from "@/services/outreach/sendTimeOptimization";
import type { OutreachMessage } from "@/types/domain";

export interface WishlistCampaignRow {
  businessId: string;
  studioName: string;
  cityName: string;
  verticalId: string;
  verticalSlug: string;
  verticalName: string;
  messageId: string | null;
  messageStatus: string | null;
  scheduledAt: string | null;
  previewStatus: string | null;
}

export interface WishlistCampaignSummary {
  rows: WishlistCampaignRow[];
  counts: {
    total: number;
    noDraft: number;
    needsReview: number;
    approved: number;
    scheduled: number;
    sent: number;
  };
}

const REVIEW_STATUSES = new Set(["DRAFT", "REVIEW_REQUIRED"]);
const SENT_STATUSES = new Set([
  "SENT",
  "SENDING",
  "DELIVERED",
  "OPENED",
  "CLICKED",
  "REPLIED",
]);

export async function getWishlistCampaignSummary(
  verticalId?: string
): Promise<WishlistCampaignSummary> {
  const client = createAdminClient();

  let businessQuery = client
    .from("businesses")
    .select(
      "id, studio_name, preview_status, city_id, vertical_id, cities:city_id(name), verticals:vertical_id(slug, name)"
    )
    .eq("selected_for_outreach", true)
    .eq("is_demo", false)
    .order("selected_for_outreach_at", { ascending: false });

  if (verticalId) {
    businessQuery = businessQuery.eq("vertical_id", verticalId);
  }

  const { data: businesses } = await businessQuery;

  const { data: messagesRaw } = await client
    .from("outreach_messages")
    .select("id, business_id, status, scheduled_at, created_at")
    .eq("is_test", false)
    .order("created_at", { ascending: false });

  const messages = (messagesRaw ?? []).filter(
    (row) => !["FAILED", "SUPPRESSED"].includes(String(row.status))
  );

  const latestByBusiness = new Map<string, OutreachMessage>();
  for (const row of messages) {
    const businessId = String(row.business_id);
    if (!latestByBusiness.has(businessId)) {
      latestByBusiness.set(businessId, row as OutreachMessage);
    }
  }

  const rows: WishlistCampaignRow[] = (businesses ?? []).map((row) => {
    const businessId = String(row.id);
    const message = latestByBusiness.get(businessId) ?? null;
    const city = row.cities as { name?: string } | null;
    const vertical = row.verticals as { slug?: string; name?: string } | null;
    return {
      businessId,
      studioName: String(row.studio_name),
      cityName: city?.name ?? "—",
      verticalId: String(row.vertical_id),
      verticalSlug: vertical?.slug ?? "—",
      verticalName: vertical?.name ?? "—",
      messageId: message?.id ?? null,
      messageStatus: message?.status ?? null,
      scheduledAt: message?.scheduled_at ?? null,
      previewStatus: (row.preview_status as string | null) ?? null,
    };
  });

  const counts = {
    total: rows.length,
    noDraft: rows.filter((r) => !r.messageId).length,
    needsReview: rows.filter(
      (r) => r.messageStatus && REVIEW_STATUSES.has(r.messageStatus)
    ).length,
    approved: rows.filter((r) => r.messageStatus === "APPROVED").length,
    scheduled: rows.filter((r) => r.messageStatus === "SCHEDULED").length,
    sent: rows.filter(
      (r) => r.messageStatus && SENT_STATUSES.has(r.messageStatus)
    ).length,
  };

  return { rows, counts };
}

export interface WishlistBatchResult {
  scheduled: number;
  skipped: Array<{ businessId: string; studioName: string; reason: string }>;
  firstSendAt: string;
  lastSendAt: string | null;
  mode: "manual" | "optimized";
  sendDays: SendDaySummary[];
  rulesLabel: string;
}

export async function scheduleWishlistBatch(input: {
  scheduledAt?: string;
  staggerMinutes?: number;
  verticalId?: string;
  mode?: "manual" | "optimized";
}): Promise<WishlistBatchResult> {
  const summary = await getWishlistCampaignSummary(input.verticalId);
  const mode = input.mode ?? "optimized";
  const staggerMs = Math.max(0, (input.staggerMinutes ?? 2) * 60 * 1000);
  const skipped: WishlistBatchResult["skipped"] = [];
  const cfgRules = describeSendTimeRules();

  const queue = summary.rows.filter((row) => {
    if (!row.messageId) {
      skipped.push({
        businessId: row.businessId,
        studioName: row.studioName,
        reason: "Geen outreach draft",
      });
      return false;
    }
    if (row.messageStatus === "SCHEDULED") {
      skipped.push({
        businessId: row.businessId,
        studioName: row.studioName,
        reason: "Al gepland",
      });
      return false;
    }
    if (row.messageStatus !== "APPROVED") {
      skipped.push({
        businessId: row.businessId,
        studioName: row.studioName,
        reason: row.messageStatus
          ? `Status ${row.messageStatus} (approve eerst)`
          : "Nog geen draft",
      });
      return false;
    }
    return true;
  });

  if (queue.length === 0) {
    return {
      scheduled: 0,
      skipped,
      firstSendAt: new Date().toISOString(),
      lastSendAt: null,
      mode,
      sendDays: [],
      rulesLabel: cfgRules,
    };
  }

  let sendSlots: Date[] = [];
  let sendDays: SendDaySummary[] = [];

  if (mode === "optimized") {
    const notBefore = input.scheduledAt ? new Date(input.scheduledAt) : undefined;
    if (notBefore && Number.isNaN(notBefore.getTime())) {
      throw new Error("Ongeldige datum of tijd");
    }
    const built = await buildOptimizedSendSlots({
      count: queue.length,
      staggerMinutes: input.staggerMinutes,
      notBefore,
    });
    sendSlots = built.slots;
    sendDays = built.days;
  } else {
    if (!input.scheduledAt) {
      throw new Error("Handmatige planning vereist een starttijd");
    }
    const base = new Date(input.scheduledAt);
    if (Number.isNaN(base.getTime())) {
      throw new Error("Ongeldige datum of tijd");
    }
    sendSlots = queue.map((_, index) => new Date(base.getTime() + index * staggerMs));
  }

  let scheduled = 0;
  let firstSendAt = sendSlots[0]?.toISOString() ?? new Date().toISOString();
  let lastSendAt: string | null = null;

  for (let i = 0; i < queue.length; i += 1) {
    const row = queue[i];
    const sendAt = sendSlots[i];
    if (!row.messageId || !sendAt) continue;

    if (mode === "manual") {
      const validation = validateSendSlot(sendAt);
      if (!validation.ok) {
        skipped.push({
          businessId: row.businessId,
          studioName: row.studioName,
          reason: validation.reason ?? "Ongeldig verzendslot",
        });
        continue;
      }
    }

    await scheduleOutreachEmail(row.messageId, sendAt.toISOString());
    if (scheduled === 0) firstSendAt = sendAt.toISOString();
    lastSendAt = sendAt.toISOString();
    scheduled += 1;
  }

  if (scheduled > 0) {
    const client = createAdminClient();
    await writeActivity(client, {
      business_id: null,
      activity_type: "OUTREACH_BATCH_SCHEDULED",
      title: `Batch gepland · ${scheduled} mails`,
      description: new Date(firstSendAt).toLocaleString("nl-NL", {
        timeZone: "Europe/Amsterdam",
      }),
      metadata: {
        scheduled,
        skipped: skipped.length,
        first_send_at: firstSendAt,
        last_send_at: lastSendAt,
        stagger_minutes: input.staggerMinutes ?? 2,
        mode,
        send_days: sendDays,
        rules: cfgRules,
      },
    });
  }

  return {
    scheduled,
    skipped,
    firstSendAt,
    lastSendAt,
    mode,
    sendDays,
    rulesLabel: cfgRules,
  };
}

export async function cancelWishlistScheduled(verticalId?: string): Promise<{ cancelled: number }> {
  const summary = await getWishlistCampaignSummary(verticalId);
  let cancelled = 0;

  for (const row of summary.rows) {
    if (row.messageStatus !== "SCHEDULED" || !row.messageId) continue;
    await cancelScheduledOutreach(row.messageId);
    cancelled += 1;
  }

  return { cancelled };
}

export async function generateWishlistDrafts(input?: {
  limit?: number;
  verticalId?: string;
}): Promise<{
  generated: number;
  skipped: Array<{ businessId: string; studioName: string; reason: string }>;
  errors: Array<{ businessId: string; studioName: string; error: string }>;
}> {
  const summary = await getWishlistCampaignSummary(input?.verticalId);
  const limit = input?.limit ?? 15;
  const skipped: Array<{ businessId: string; studioName: string; reason: string }> =
    [];
  const errors: Array<{ businessId: string; studioName: string; error: string }> =
    [];
  let generated = 0;

  for (const row of summary.rows) {
    if (generated >= limit) break;
    if (row.messageId) {
      skipped.push({
        businessId: row.businessId,
        studioName: row.studioName,
        reason: "Draft bestaat al",
      });
      continue;
    }
    if (row.previewStatus !== "READY") {
      skipped.push({
        businessId: row.businessId,
        studioName: row.studioName,
        reason: `Preview ${row.previewStatus ?? "niet klaar"}`,
      });
      continue;
    }

    try {
      await generateOutreachDraft({
        businessId: row.businessId,
        qualificationMode: "manual",
      });
      generated += 1;
    } catch (err) {
      errors.push({
        businessId: row.businessId,
        studioName: row.studioName,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { generated, skipped, errors };
}
