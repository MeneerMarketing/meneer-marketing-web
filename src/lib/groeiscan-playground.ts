import {
  Heart,
  Megaphone,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";
import { megaMenuColumns, type PillarSlug } from "@/lib/navigation";

export const WIZARD_STEPS = [
  { id: "goal", label: "Doel", hint: "Wat wil je echt bereiken?" },
  { id: "situation", label: "Stand", hint: "Waar zit je nu?" },
  { id: "budget", label: "Budget", hint: "Wat kun je investeren?" },
  { id: "friction", label: "Ritme", hint: "Hoe soepel loopt het?" },
  { id: "diensten", label: "Stack", hint: "Wat heb je al staan?" },
  { id: "route", label: "Score", hint: "Jouw groeikracht" },
] as const;

export function dienstHrefToId(href: string): string {
  return href.replace("/diensten/", "");
}

export interface GroeiscanSubdienst {
  id: string;
  href: string;
  label: string;
  pillarSlug: PillarSlug;
  pillarLabel: string;
}

export const GROEISCAN_SUBDIENSTEN: GroeiscanSubdienst[] = megaMenuColumns.flatMap(
  (col) =>
    col.items.map((item) => ({
      id: dienstHrefToId(item.href),
      href: item.href,
      label: item.menuLabel ?? item.name,
      pillarSlug: col.pillarSlug,
      pillarLabel: col.category,
    })),
);

export const GROEISCAN_SUBDIENST_COUNT = GROEISCAN_SUBDIENSTEN.length;

export const PILLAR_ACCENTS: Record<PillarSlug, string> = {
  strategie: "#FF5722",
  bouwen: "#45382C",
  vindbaarheid: "#0284C7",
  campagnes: "#0081FB",
  behoud: "#0D9488",
};

export interface PillarProgress {
  pillarSlug: PillarSlug;
  label: string;
  active: number;
  total: number;
  fraction: number;
  accent: string;
}

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

/** Doelen in taal van de klant, geen vakjargon. */
export const GROEISCAN_GOALS = [
  {
    id: "customers",
    label: "Meer klanten",
    hint: "Meer aanvragen, offertes of bestellingen",
    emoji: "🎯",
    icon: Users,
    meneerTip:
      "Meer klanten begint niet met harder roepen. Het begint met weten waar ze vandaan komen.",
  },
  {
    id: "revenue",
    label: "Meer omzet online",
    hint: "Je site of shop moet harder verkopen",
    emoji: "💰",
    icon: ShoppingBag,
    meneerTip:
      "Omzet groeit als je site, vindbaarheid en campagnes één team zijn. Niet vijf losse projecten.",
  },
  {
    id: "visibility",
    label: "Gevonden worden",
    hint: "In Google én in antwoorden van ChatGPT en AI",
    emoji: "🔍",
    icon: Search,
    meneerTip:
      "15% van alle zoekopdrachten is gloednieuw. Daar is altijd ruimte om te winnen.",
  },
  {
    id: "ads",
    label: "Ads die renderen",
    hint: "Google Ads en Meta Ads die echt geld opleveren",
    emoji: "📣",
    icon: Megaphone,
    meneerTip:
      "Ads zonder landingspagina die converteert is geld verbranden met een mooie vlam.",
  },
  {
    id: "retention",
    label: "Klanten die terugkomen",
    hint: "Herhalingsorders, mail en loyaliteit",
    emoji: "🔁",
    icon: Heart,
    meneerTip:
      "Een nieuwe klant werven kost vijf keer meer dan een bestaande behouden. Reken maar na.",
  },
] as const;

export const GROEISCAN_SITUATIONS = [
  {
    id: "start",
    label: "Net begonnen",
    body: "Website of shop staat, maar het voelt nog fragiel.",
    maturity: 2,
  },
  {
    id: "messy",
    label: "Het loopt, maar rommelig",
    body: "Er gebeurt wat, alleen zonder duidelijke volgorde.",
    maturity: 4,
  },
  {
    id: "solid",
    label: "Redelijk op orde",
    body: "Vaste kanalen, af en toe cijfers checken.",
    maturity: 6,
  },
  {
    id: "sharp",
    label: "Scherp bezig",
    body: "Team, data en meerdere kanalen lopen al.",
    maturity: 8,
  },
] as const;

export const GROEISCAN_FRICTION_LEVELS = [
  {
    id: "none",
    label: "Lekker soepel",
    body: "Bestellen, mailen en opvolgen gaan vanzelf.",
    hours: 1,
  },
  {
    id: "some",
    label: "Af en toe gedoe",
    body: "Handmatig werk tussen mail, Excel en je shop.",
    hours: 6,
  },
  {
    id: "lots",
    label: "Veel gedoe",
    body: "Elke week uren kwijt aan losse systemen.",
    hours: 15,
  },
  {
    id: "crisis",
    label: "Chaos",
    body: "Het remt groei merkbaar af. Iemand moet ingrijpen.",
    hours: 28,
  },
] as const;

export const GROEISCAN_BUDGET_TIERS = [
  {
    tier: 0,
    label: "Eerst verkennen",
    hint: "Kleine stappen, eerst helderheid",
  },
  {
    tier: 1,
    label: "€500 – €2k per maand",
    hint: "Serieus beginnen met groei",
  },
  {
    tier: 2,
    label: "€2k – €5k per maand",
    hint: "Opschalen wat werkt",
  },
  {
    tier: 3,
    label: "€5k – €15k per maand",
    hint: "Gas op de winnaars",
  },
  {
    tier: 4,
    label: "€15k+ per maand",
    hint: "Dominant worden in je niche",
  },
] as const;

export const GROEISCAN_PILLARS = megaMenuColumns.map((col) => ({
  slug: col.pillarSlug,
  label: col.category,
  subtitle: col.subtitle,
  accent: PILLAR_ACCENTS[col.pillarSlug],
  href: `/${col.pillarSlug}`,
}));

export type GroeiscanGoalId = (typeof GROEISCAN_GOALS)[number]["id"];
export type GroeiscanSituationId = (typeof GROEISCAN_SITUATIONS)[number]["id"];
export type GroeiscanFrictionId = (typeof GROEISCAN_FRICTION_LEVELS)[number]["id"];

export interface PlaygroundScoreInput {
  goal: GroeiscanGoalId;
  budgetTier: number;
  maturity: number;
  friction: GroeiscanFrictionId;
  frictionHours: number;
  dienstIds: ReadonlySet<string>;
}

export interface GroeikrachtBreakdown {
  total: number;
  goal: number;
  stand: number;
  budget: number;
  ritme: number;
  stack: number;
}

export interface GrowthTier {
  id: string;
  label: string;
  body: string;
  quip: string;
}

export interface RouteStep {
  title: string;
  body: string;
  href: string;
  pillar: string;
  accent: string;
}

export interface PlaygroundInsight {
  headline: string;
  sub: string;
  quip: string;
}

const RITME_POINTS: Record<GroeiscanFrictionId, number> = {
  none: 15,
  some: 11,
  lots: 6,
  crisis: 2,
};

export const BREAKDOWN_LABELS: Record<keyof Omit<GroeikrachtBreakdown, "total">, string> = {
  goal: "Doel",
  stand: "Stand",
  budget: "Budget",
  ritme: "Ritme",
  stack: "Stack",
};

export const BREAKDOWN_MAX: Record<keyof Omit<GroeikrachtBreakdown, "total">, number> = {
  goal: 8,
  stand: 18,
  budget: 14,
  ritme: 15,
  stack: 45,
};

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatBudgetTier(tier: number): string {
  return GROEISCAN_BUDGET_TIERS[tier]?.label ?? GROEISCAN_BUDGET_TIERS[0]!.label;
}

export function situationToMaturity(id: GroeiscanSituationId): number {
  return GROEISCAN_SITUATIONS.find((s) => s.id === id)?.maturity ?? 5;
}

export function frictionToHours(id: GroeiscanFrictionId): number {
  return GROEISCAN_FRICTION_LEVELS.find((f) => f.id === id)?.hours ?? 6;
}

/** Groeikracht 0–100: elke stap telt mee. */
export function computeGroeikrachtBreakdown(
  input: PlaygroundScoreInput,
): GroeikrachtBreakdown {
  const goal = BREAKDOWN_MAX.goal;
  const stand = Math.round((input.maturity / 10) * BREAKDOWN_MAX.stand);
  const budget = Math.round((input.budgetTier / 4) * BREAKDOWN_MAX.budget);
  const ritme = RITME_POINTS[input.friction] ?? 6;
  const stack =
    GROEISCAN_SUBDIENST_COUNT === 0
      ? 0
      : Math.round(
          (GROEISCAN_SUBDIENSTEN.filter((d) => input.dienstIds.has(d.id)).length /
            GROEISCAN_SUBDIENST_COUNT) *
            BREAKDOWN_MAX.stack,
        );

  const total = clamp(goal + stand + budget + ritme + stack, 0, 100);
  return { total, goal, stand, budget, ritme, stack };
}

export function computePlaygroundScore(input: PlaygroundScoreInput): number {
  return computeGroeikrachtBreakdown(input).total;
}

export function computePillarProgress(
  dienstIds: ReadonlySet<string>,
): PillarProgress[] {
  return megaMenuColumns.map((col) => {
    const ids = col.items.map((item) => dienstHrefToId(item.href));
    const active = ids.filter((id) => dienstIds.has(id)).length;
    return {
      pillarSlug: col.pillarSlug,
      label: col.category,
      active,
      total: ids.length,
      fraction: ids.length ? active / ids.length : 0,
      accent: PILLAR_ACCENTS[col.pillarSlug],
    };
  });
}

export function computeGrowthTier(score: number): GrowthTier {
  if (score >= 88) {
    return {
      id: "rocket",
      label: "Klaar om te schalen",
      body: "Je fundament is sterk. Nu gaat het om scherpe keuzes en gas geven waar het rendeert.",
      quip: "SkinComplete begon met SEO. Ads kwamen pas toen organisch al verkocht.",
    };
  }
  if (score >= 68) {
    return {
      id: "strong",
      label: "Sterke basis",
      body: "Je staat stevig. Met de juiste volgorde pak je de grootste sprong.",
      quip: "Op dit niveau win je op details. Kleur van een knop, letterlijk miljoenen waard.",
    };
  }
  if (score >= 48) {
    return {
      id: "grow",
      label: "In groei",
      body: "Er zit al veel goeds. Eén heldere route maakt het verschil tussen rommel en resultaat.",
      quip: "Twee kanalen zonder plan is multitasken. En dat werkt nergens.",
    };
  }
  if (score >= 28) {
    return {
      id: "basis",
      label: "Veel ruimte",
      body: "Je zit nog vroeg in de curve. Dat is juist goed nieuws: veel winst zit dichtbij.",
      quip: "Niemand begon met alles tegelijk. Behalve bedrijven met oneindig budget. Die bestaan niet.",
    };
  }
  return {
    id: "start",
    label: "Startpunt",
    body: "Eerst helderheid, dan bouwen. Jouw score laat zien waar je het snelst wint.",
    quip: "Elke grote shop begon met één goede stap. Niet met twintig tegelijk.",
  };
}

export function computePlaygroundInsight(input: PlaygroundScoreInput): PlaygroundInsight {
  const g = GROEISCAN_GOALS.find((x) => x.id === input.goal)!;

  if (input.frictionHours >= 15) {
    return {
      headline: "Eerst rust in je processen, dan gas",
      sub: "Veel losse handjes betekent: koppel je systemen, haal dubbel werk weg. Dan schaal je pas echt.",
      quip: "Copy-paste is geen proces. Het is een alarmbel.",
    };
  }

  if (input.maturity <= 4) {
    return {
      headline: "Eerst fundament, dan budget op ads",
      sub: "Site, shop of meetplan eerst op orde. Daarna pas campagnes opschalen.",
      quip: "Ads op een wankel fundament is geld uitgeven aan stress.",
    };
  }

  if (
    !input.dienstIds.has("seo") &&
    (input.goal === "customers" || input.goal === "revenue" || input.goal === "visibility")
  ) {
    return {
      headline: "Vindbaarheid is je goedkoopste groeikanaal",
      sub: "Google en AI-antwoorden leveren verkeer zonder per klik te betalen. Slimme eerste stap.",
      quip: "Betaald verkeer is seasoning. Organisch verkeer is je basisgerecht.",
    };
  }

  if (input.dienstIds.size >= 12) {
    return {
      headline: "Je doet al veel. Tijd om te scherpstellen",
      sub: "Meer is niet altijd beter. Eén lijn tussen site, content en campagnes haalt de sprong.",
      quip: "Vijf bureaus voor vijf kanalen? Dan ben jij de projectmanager. Leuk.",
    };
  }

  return {
    headline: `Richting ${g.label.toLowerCase()} is te tekenen`,
    sub: "Met jouw antwoorden kies ik maximaal drie focuspunten. De rest wacht zijn beurt.",
    quip: computeGrowthTier(computePlaygroundScore(input)).quip,
  };
}

export function computePlaygroundRoute(input: PlaygroundScoreInput): RouteStep[] {
  const steps: RouteStep[] = [];
  const hasSeo = input.dienstIds.has("seo");
  const hasGoogleAds = input.dienstIds.has("google-ads");
  const hasMetaAds = input.dienstIds.has("meta-ads");
  const hasAds = hasGoogleAds || hasMetaAds;

  if (input.maturity <= 4) {
    steps.push({
      title: "Fundament op orde",
      body: "Website of shop from scratch, snel en meetbaar.",
      href: "/bouwen",
      pillar: "Bouwen",
      accent: "#45382C",
    });
  }

  if (input.budgetTier <= 1 || input.maturity <= 5) {
    steps.push({
      title: "Route en prioriteit bepalen",
      body: "Waar zit marge, wat eerst, wat later. Maximaal drie focuspunten.",
      href: "/strategie",
      pillar: "Strategie",
      accent: "#FF5722",
    });
  }

  if (
    !hasSeo &&
    (input.goal === "customers" ||
      input.goal === "revenue" ||
      input.goal === "visibility")
  ) {
    steps.push({
      title: "Vindbaar worden in Google en AI",
      body: "SEO, content en techniek. Organisch vóór je budget op ads zet.",
      href: "/vindbaarheid",
      pillar: "Vindbaarheid",
      accent: "#0284C7",
    });
  }

  if (input.frictionHours >= 10 || input.goal === "retention") {
    steps.push({
      title: "Klanten vasthouden en systemen koppelen",
      body: "Mail, retentie en minder handwerk in je team.",
      href: "/behoud",
      pillar: "Behoud",
      accent: "#0D9488",
    });
  }

  if (
    (hasSeo || input.goal === "ads") &&
    !hasAds &&
    (input.goal === "customers" ||
      input.goal === "revenue" ||
      input.goal === "ads") &&
    input.maturity >= 5
  ) {
    steps.push({
      title: "Google Ads en Meta Ads gericht inzetten",
      body: "Campagnes op pagina's die al converteren.",
      href: "/campagnes",
      pillar: "Campagnes",
      accent: "#0081FB",
    });
  }

  const fallbacks: RouteStep[] = [
    {
      title: "Vindbaarheid en autoriteit",
      body: "Content die blijft renderen, ook als adsprijzen stijgen.",
      href: "/vindbaarheid",
      pillar: "Vindbaarheid",
      accent: "#0284C7",
    },
    {
      title: "Campagnes met meetplan",
      body: "Google Ads en Meta Ads die je kunt uitleggen.",
      href: "/campagnes",
      pillar: "Campagnes",
      accent: "#FF5722",
    },
    {
      title: "Behoud en slimme koppelingen",
      body: "Mail en automatisering die omzet vasthouden.",
      href: "/behoud",
      pillar: "Behoud",
      accent: "#0D9488",
    },
  ];

  for (const fb of fallbacks) {
    if (steps.length >= 3) break;
    if (!steps.some((s) => s.href === fb.href)) steps.push(fb);
  }

  return steps.slice(0, 3);
}

export function getSubdienstenByPillar(
  pillarSlug: PillarSlug,
): GroeiscanSubdienst[] {
  return GROEISCAN_SUBDIENSTEN.filter((d) => d.pillarSlug === pillarSlug);
}

export function getMeneerCoachLine(
  step: WizardStepId,
  context?: {
    goal?: GroeiscanGoalId;
    situation?: GroeiscanSituationId;
    friction?: GroeiscanFrictionId;
    budgetTier?: number;
  },
): string {
  if (step === "goal" && context?.goal) {
    return (
      GROEISCAN_GOALS.find((g) => g.id === context.goal)?.meneerTip ??
      "Kies één hoofddoel. Scherp is fijner dan alles tegelijk."
    );
  }
  if (step === "situation") {
    return "Wees eerlijk. Niemand begon met perfecte SEO. Behalve Wikipedia. Die cheat.";
  }
  if (step === "budget") {
    return "Budget is geen doel op zich. Het is brandstof. Eerst weten waar je naartoe rijdt.";
  }
  if (step === "friction" && context?.friction === "crisis") {
    return "Als alles handmatig loopt, schaal je niet. Dat fix je vóór je gaat adverteren.";
  }
  if (step === "friction") {
    return "Soepel proces = sneller groeien. Rommelige processen = duurder adverteren.";
  }
  if (step === "diensten") {
    return "Vink aan wat je al doet. Geen vaktaal nodig. Als je het herkent, is het goed.";
  }
  if (step === "route") {
    return "Dit is je scan. De sessie met mij maakt het concreet met jouw cijfers. Geen gokken.";
  }
  return "Elk antwoord telt mee in je groeikracht. Rechts zie je live wat je score doet.";
}

const GROEISCAN_SESSION_KEY = "mm-groeiscan-playground";

export function formatPlaygroundSummary(
  input: PlaygroundScoreInput,
  score: number,
  insight: PlaygroundInsight,
  route: RouteStep[],
  situationLabel?: string,
  frictionLabel?: string,
): string {
  const goal = GROEISCAN_GOALS.find((x) => x.id === input.goal)?.label ?? input.goal;
  const breakdown = computeGroeikrachtBreakdown(input);
  const diensten = GROEISCAN_SUBDIENSTEN.filter((d) => input.dienstIds.has(d.id))
    .map((d) => d.label)
    .join(", ");

  return [
    "--- Groeiscan (website) ---",
    `Groeikracht: ${score}/100 (${computeGrowthTier(score).label})`,
    `Doel +${breakdown.goal} · Stand +${breakdown.stand} · Budget +${breakdown.budget} · Ritme +${breakdown.ritme} · Stack +${breakdown.stack}`,
    `Hoofddoel: ${goal}`,
    `Situatie: ${situationLabel ?? `volwassenheid ${input.maturity}/10`}`,
    `Budget: ${formatBudgetTier(input.budgetTier)}`,
    `Ritme: ${frictionLabel ?? input.friction}`,
    `Stack: ${diensten || "nog niets ingezet"}`,
    `Inzicht: ${insight.headline}`,
    insight.sub,
    "Voorgestelde route:",
    ...route.map((r, i) => `${i + 1}. ${r.pillar}: ${r.title}`),
  ].join("\n");
}

export function savePlaygroundSummary(summary: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GROEISCAN_SESSION_KEY, summary);
  } catch {
    /* ignore */
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
