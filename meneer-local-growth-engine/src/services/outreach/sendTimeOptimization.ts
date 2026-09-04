import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildOptimizedSendSlotsSync,
  type SendDaySummary,
} from "@/lib/sendTimeRules";
import { amsterdamDayKey } from "@/lib/amsterdamTime";

export {
  getSendTimeConfig,
  validateSendSlot,
  nextPreferredSendSlot,
  describeSendTimeRules,
  type SendTimeConfig,
  type SendSlotValidation,
  type SendDaySummary,
} from "@/lib/sendTimeRules";

const COUNT_STATUSES = [
  "SCHEDULED",
  "SENT",
  "SENDING",
  "DELIVERED",
  "OPENED",
  "CLICKED",
  "REPLIED",
] as const;

export async function countOutreachMailsByAmsterdamDay(
  excludeMessageId?: string,
): Promise<Map<string, number>> {
  const client = createAdminClient();
  const { data } = await client
    .from("outreach_messages")
    .select("id, status, scheduled_at, sent_at")
    .eq("is_test", false)
    .in("status", [...COUNT_STATUSES]);

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    if (excludeMessageId && row.id === excludeMessageId) continue;
    const status = String(row.status);
    const ts =
      status === "SCHEDULED"
        ? (row.scheduled_at as string | null)
        : ((row.sent_at as string | null) ?? (row.scheduled_at as string | null));
    if (!ts) continue;
    const key = amsterdamDayKey(new Date(ts));
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export async function buildOptimizedSendSlots(input: {
  count: number;
  staggerMinutes?: number;
  notBefore?: Date;
}): Promise<{ slots: Date[]; days: SendDaySummary[] }> {
  const dayCounts = await countOutreachMailsByAmsterdamDay();
  return buildOptimizedSendSlotsSync({ ...input, dayCounts });
}
