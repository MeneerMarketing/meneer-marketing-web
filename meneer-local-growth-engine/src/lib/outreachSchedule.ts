import { nextPreferredSendSlot } from "@/lib/sendTimeRules";

/** Standaard: volgende di/do 09:30 lokale tijd (Amsterdam). */
export function defaultScheduleLocalValue(date = new Date()): string {
  const minLeadMs = 2 * 60 * 1000;
  const notBefore = new Date(Math.max(date.getTime(), Date.now()) + minLeadMs);
  const slot = nextPreferredSendSlot(notBefore);
  return toDatetimeLocalValue(slot);
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function datetimeLocalToIso(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Ongeldige datum of tijd");
  }
  return parsed.toISOString();
}

export function formatScheduledNl(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
