const AMSTERDAM = "Europe/Amsterdam";

const WEEKDAY_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export type DeliveryPromiseMessage = {
  primary: string;
  secondary?: string;
};

type AmsterdamClock = {
  hour: number;
  minute: number;
  weekday: number;
};

function getAmsterdamClock(date = new Date()): AmsterdamClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: AMSTERDAM,
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const weekdayKey = (parts.find((p) => p.type === "weekday")?.value ?? "mon").toLowerCase();

  return { hour, minute, weekday: WEEKDAY_MAP[weekdayKey] ?? 1 };
}

export function formatCutoffLabel(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

export function getDeliveryPromiseMessage(
  cutoffHour = 23,
  cutoffMinute = 0,
  shippingNote?: string | null
): DeliveryPromiseMessage {
  const { hour, minute, weekday } = getAmsterdamClock();
  const cutoffMinutes = cutoffHour * 60 + cutoffMinute;
  const nowMinutes = hour * 60 + minute;
  const beforeCutoff = nowMinutes < cutoffMinutes;
  const cutoffLabel = formatCutoffLabel(cutoffHour, cutoffMinute);
  const secondary = shippingNote?.trim() || undefined;

  if (weekday === 6) {
    return { primary: "Bestel vandaag, maandag in huis", secondary };
  }

  if (weekday === 0) {
    return { primary: "Bestel vandaag, dinsdag in huis", secondary };
  }

  if (weekday === 5 && !beforeCutoff) {
    return { primary: "Bestel nu, maandag in huis", secondary };
  }

  if (beforeCutoff) {
    return { primary: `Voor ${cutoffLabel} besteld, morgen in huis`, secondary };
  }

  return { primary: "Vandaag besteld, overmorgen in huis", secondary };
}

export function getDeliveryPromiseShort(
  cutoffHour = 23,
  cutoffMinute = 0
): string {
  return getDeliveryPromiseMessage(cutoffHour, cutoffMinute).primary;
}
