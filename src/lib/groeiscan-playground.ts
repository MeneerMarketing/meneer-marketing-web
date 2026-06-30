import { Gauge, Layers, TrendingUp, Zap } from "lucide-react";

export const GROEISCAN_GOALS = [
  {
    id: "leads",
    label: "Meer leads",
    hint: "B2B of B2C pipeline vullen",
    icon: TrendingUp,
    bonus: 6,
  },
  {
    id: "revenue",
    label: "Meer omzet online",
    hint: "Shop of site die harder moet werken",
    icon: Zap,
    bonus: 8,
  },
  {
    id: "speed",
    label: "Sneller & strakker",
    hint: "Performance, tech, CWV",
    icon: Gauge,
    bonus: 5,
  },
  {
    id: "automate",
    label: "Minder handwerk",
    hint: "n8n, koppelingen, rust",
    icon: Layers,
    bonus: 7,
  },
] as const;

export const GROEISCAN_CHANNELS = [
  { id: "seo", label: "SEO" },
  { id: "ads", label: "Ads" },
  { id: "social", label: "Social" },
  { id: "email", label: "E-mail" },
] as const;

export type GroeiscanGoalId = (typeof GROEISCAN_GOALS)[number]["id"];

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatBudgetTier(tier: number): string {
  const labels = [
    "Onderzoek / start",
    "€500 – €2k / mnd",
    "€2k – €5k / mnd",
    "€5k – €15k / mnd",
    "€15k+ / mnd",
  ];
  return labels[tier] ?? labels[0]!;
}

export interface PlaygroundScoreInput {
  goal: GroeiscanGoalId;
  budgetTier: number;
  maturity: number;
  frictionHours: number;
  channelIds: ReadonlySet<string>;
}

export function computePlaygroundScore(input: PlaygroundScoreInput): number {
  const g = GROEISCAN_GOALS.find((x) => x.id === input.goal)!;
  const budgetPts = input.budgetTier * 5;
  const matPts = input.maturity * 3;
  const frictionPts = clamp(Math.round(input.frictionHours / 3), 0, 14);
  const channelPts = Math.min(input.channelIds.size * 3, 10);
  const raw =
    22 + budgetPts + matPts + frictionPts + channelPts + g.bonus;
  return clamp(Math.round(raw), 18, 97);
}

export interface PlaygroundInsight {
  headline: string;
  sub: string;
}

export function computePlaygroundInsight(
  input: PlaygroundScoreInput,
): PlaygroundInsight {
  const g = GROEISCAN_GOALS.find((x) => x.id === input.goal)!;

  if (input.frictionHours >= 20) {
    return {
      headline: "Er zit veel winst in rust & automatisering.",
      sub:
        "Hoge frictie betekent vaak: kansen om processen te koppelen en fouten te halveren.",
    };
  }
  if (input.maturity <= 4) {
    return {
      headline: "Je zit in de opbouwfase. Perfect moment voor fundament.",
      sub:
        "Met de juiste stack en meetplan groei je sneller zonder later alles om te gooien.",
    };
  }
  if (input.channelIds.size >= 3) {
    return {
      headline: "Je speelt al op meerdere kanalen. Tijd om te scherpstellen.",
      sub:
        "Consistente boodschap + techniek die elkaar versterken: daar halen we vaak de grootste sprong.",
    };
  }
  return {
    headline: "Je groeipad is concreet te tekenen.",
    sub: `Met focus op “${g.label.toLowerCase()}” en jouw huidige ambitie kunnen we scherp prioriteren.`,
  };
}

const GROEISCAN_SESSION_KEY = "mm-groeiscan-playground";

export function formatPlaygroundSummary(
  input: PlaygroundScoreInput,
  score: number,
  insight: PlaygroundInsight,
): string {
  const goal = GROEISCAN_GOALS.find((x) => x.id === input.goal)?.label ?? input.goal;
  const channels = GROEISCAN_CHANNELS.filter((c) => input.channelIds.has(c.id))
    .map((c) => c.label)
    .join(", ");

  return [
    "--- Groeiscan playground (website) ---",
    `Score: ${score}/100`,
    `Hoofddoel: ${goal}`,
    `Ambitie: ${formatBudgetTier(input.budgetTier)}`,
    `Digitale volwassenheid: ${input.maturity}/10`,
    `Tijdverspilling per week: ${input.frictionHours} uur`,
    `Kanalen: ${channels || "geen geselecteerd"}`,
    `Inzicht: ${insight.headline}`,
    insight.sub,
  ].join("\n");
}

export function savePlaygroundSummary(summary: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GROEISCAN_SESSION_KEY, summary);
  } catch {
    /* ignore quota / private mode */
  }
}

export function readPlaygroundSummary(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(GROEISCAN_SESSION_KEY);
  } catch {
    return null;
  }
}
