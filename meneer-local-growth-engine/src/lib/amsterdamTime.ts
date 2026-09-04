const TZ = "Europe/Amsterdam";

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
}

export function getZonedParts(date: Date, timeZone = TZ): ZonedParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: Number(pick("year")),
    month: Number(pick("month")),
    day: Number(pick("day")),
    weekday: WEEKDAY_MAP[pick("weekday")] ?? 0,
    hour: Number(pick("hour")),
    minute: Number(pick("minute")),
  };
}

export function amsterdamDayKey(date: Date): string {
  const p = getZonedParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone = TZ,
): Date {
  const target =
    year * 10_000_000_000 +
    month * 100_000_000 +
    day * 1_000_000 +
    hour * 10_000 +
    minute * 100;

  let low = Date.UTC(year, month - 1, day, hour - 3, minute);
  let high = Date.UTC(year, month - 1, day, hour + 3, minute);

  for (let i = 0; i < 40; i += 1) {
    const mid = Math.floor((low + high) / 2);
    const p = getZonedParts(new Date(mid), timeZone);
    const current =
      p.year * 10_000_000_000 +
      p.month * 100_000_000 +
      p.day * 1_000_000 +
      p.hour * 10_000 +
      p.minute * 100;

    if (current === target) return new Date(mid);
    if (current < target) low = mid + 1;
    else high = mid - 1;
  }

  return new Date(Date.UTC(year, month - 1, day, hour - 1, minute));
}

export function addAmsterdamCalendarDays(date: Date, days: number): Date {
  const p = getZonedParts(date);
  return zonedLocalToUtc(p.year, p.month, p.day + days, 12, 0);
}

export function formatAmsterdamNl(date: Date): string {
  return date.toLocaleString("nl-NL", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const AMSTERDAM_TIMEZONE = TZ;
