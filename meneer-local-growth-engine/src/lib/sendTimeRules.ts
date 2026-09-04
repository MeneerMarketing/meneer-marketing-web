import {
  addAmsterdamCalendarDays,
  amsterdamDayKey,
  formatAmsterdamNl,
  getZonedParts,
  zonedLocalToUtc,
  type ZonedParts,
} from "@/lib/amsterdamTime";

export interface SendTimeConfig {
  timezone: string;
  preferredWeekdays: number[];
  slotHour: number;
  slotMinute: number;
  blockMondayMorningUntilHour: number;
  maxPerDay: number;
  defaultStaggerMinutes: number;
}

export interface SendSlotValidation {
  ok: boolean;
  reason?: string;
}

export interface SendDaySummary {
  dayKey: string;
  label: string;
  count: number;
}

export function getSendTimeConfig(): SendTimeConfig {
  const maxRaw = Number(process.env.OUTREACH_MAX_MAILS_PER_DAY ?? 12);
  return {
    timezone: "Europe/Amsterdam",
    preferredWeekdays: [2, 4],
    slotHour: 9,
    slotMinute: 30,
    blockMondayMorningUntilHour: 12,
    maxPerDay: Number.isFinite(maxRaw) && maxRaw > 0 ? Math.floor(maxRaw) : 12,
    defaultStaggerMinutes: 2,
  };
}

function isMondayMorning(parts: ZonedParts, cfg: SendTimeConfig): boolean {
  return parts.weekday === 1 && parts.hour < cfg.blockMondayMorningUntilHour;
}

export function validateSendSlot(
  when: Date,
  cfg = getSendTimeConfig(),
  dayCounts?: Map<string, number>,
): SendSlotValidation {
  const parts = getZonedParts(when);
  if (isMondayMorning(parts, cfg)) {
    return {
      ok: false,
      reason: "Maandagochtend geblokkeerd (vóór 12:00). Kies dinsdag of donderdag 09:30.",
    };
  }

  if (dayCounts) {
    const key = amsterdamDayKey(when);
    const used = dayCounts.get(key) ?? 0;
    if (used >= cfg.maxPerDay) {
      return {
        ok: false,
        reason: `Daglimiet bereikt (${cfg.maxPerDay} mails per dag). Volgende di/do slot kiezen.`,
      };
    }
  }

  return { ok: true };
}

function isPreferredWeekday(weekday: number, cfg: SendTimeConfig): boolean {
  return cfg.preferredWeekdays.includes(weekday);
}

export function nextPreferredSendSlot(from: Date, cfg = getSendTimeConfig()): Date {
  let cursor = new Date(from.getTime());

  for (let i = 0; i < 90; i += 1) {
    const parts = getZonedParts(cursor);
    if (isPreferredWeekday(parts.weekday, cfg)) {
      const slot = zonedLocalToUtc(
        parts.year,
        parts.month,
        parts.day,
        cfg.slotHour,
        cfg.slotMinute,
      );
      const slotParts = getZonedParts(slot);
      if (
        slot.getTime() >= from.getTime() &&
        !isMondayMorning(slotParts, cfg)
      ) {
        return slot;
      }
    }
    cursor = addAmsterdamCalendarDays(cursor, 1);
  }

  throw new Error("Geen geldig di/do verzendslot gevonden binnen 90 dagen.");
}

export function buildOptimizedSendSlotsSync(input: {
  count: number;
  staggerMinutes?: number;
  notBefore?: Date;
  dayCounts: Map<string, number>;
}): { slots: Date[]; days: SendDaySummary[] } {
  const cfg = getSendTimeConfig();
  if (input.count <= 0) return { slots: [], days: [] };

  const staggerMs = Math.max(0, (input.staggerMinutes ?? cfg.defaultStaggerMinutes) * 60_000);
  const minLeadMs = 2 * 60 * 1000;
  const notBefore = input.notBefore ?? new Date(Date.now() + minLeadMs);
  const dayCounts = new Map(input.dayCounts);

  const slots: Date[] = [];
  let dayStart = nextPreferredSendSlot(notBefore, cfg);
  let offsetInDay = 0;
  const daySummary = new Map<string, number>();

  while (slots.length < input.count) {
    const sendAt = new Date(dayStart.getTime() + offsetInDay * staggerMs);
    const validation = validateSendSlot(sendAt, cfg, dayCounts);

    if (!validation.ok) {
      dayStart = nextPreferredSendSlot(addAmsterdamCalendarDays(dayStart, 1), cfg);
      offsetInDay = 0;
      continue;
    }

    slots.push(sendAt);
    const key = amsterdamDayKey(sendAt);
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
    daySummary.set(key, (daySummary.get(key) ?? 0) + 1);
    offsetInDay += 1;

    if ((dayCounts.get(key) ?? 0) >= cfg.maxPerDay) {
      dayStart = nextPreferredSendSlot(addAmsterdamCalendarDays(dayStart, 1), cfg);
      offsetInDay = 0;
    }
  }

  const days: SendDaySummary[] = [...daySummary.entries()].map(([dayKey, count]) => {
    const [y, m, d] = dayKey.split("-").map(Number);
    const label = formatAmsterdamNl(zonedLocalToUtc(y, m, d, cfg.slotHour, cfg.slotMinute));
    return { dayKey, label, count };
  });

  return { slots, days };
}

export function describeSendTimeRules(cfg = getSendTimeConfig()): string {
  return `Di/do ${String(cfg.slotHour).padStart(2, "0")}:${String(cfg.slotMinute).padStart(2, "0")} · geen maandagochtend · max ${cfg.maxPerDay} mails/dag`;
}
