import {
  Gauge,
  Layers,
  Megaphone,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

export const WIZARD_STEPS = [
  { id: "goal", label: "Doel", hint: "Waar wil je naartoe?" },
  { id: "situation", label: "Nu", hint: "Waar sta je vandaag?" },
  { id: "friction", label: "Tijd", hint: "Wat kost je nu tijd?" },
  { id: "channels", label: "Kanalen", hint: "Waar zit je marketing?" },
  { id: "route", label: "Route", hint: "Jouw groeipad" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

export const GROEISCAN_GOALS = [
  {
    id: "leads",
    label: "Meer klanten",
    hint: "Meer aanvragen, offertes of bestellingen",
    icon: TrendingUp,
    bonus: 6,
    meneerTip: "Leads zonder meetplan is hopen. Wij beginnen met waar ze vandaan komen.",
  },
  {
    id: "revenue",
    label: "Meer omzet online",
    hint: "Je site of shop moet harder verkopen",
    icon: Zap,
    bonus: 8,
    meneerTip: "Omzet groeit als site, vindbaarheid en campagnes samenwerken. Niet los.",
  },
  {
    id: "speed",
    label: "Sneller & strakker",
    hint: "Professioneler, sneller, betrouwbaarder online",
    icon: Gauge,
    bonus: 5,
    meneerTip: "Bezoekers oordelen in 50 ms. Snelheid is geen luxe, het is de eerste indruk.",
  },
  {
    id: "automate",
    label: "Minder handwerk",
    hint: "Minder copy-paste, meer rust in je team",
    icon: Layers,
    bonus: 7,
    meneerTip: "Als jij elke order handmatig verwerkt, schaal je niet. Punt.",
  },
] as const;

export const GROEISCAN_SITUATIONS = [
  {
    id: "start",
    label: "Ik begin net",
    body: "Website of shop bestaat, maar ik meet weinig.",
    maturity: 2,
    floor: 1,
  },
  {
    id: "messy",
    label: "Het loopt, maar rommelig",
    body: "Er gebeurt wat, alleen zonder rode draad.",
    maturity: 4,
    floor: 2,
  },
  {
    id: "solid",
    label: "Redelijk op orde",
    body: "Vaste kanalen en af en toe cijfers bekijken.",
    maturity: 6,
    floor: 3,
  },
  {
    id: "sharp",
    label: "Scherp bezig",
    body: "Team, data en meerdere kanalen lopen.",
    maturity: 8,
    floor: 4,
  },
] as const;

export const GROEISCAN_FRICTION_LEVELS = [
  {
    id: "none",
    label: "Bijna niks",
    body: "Processen lopen redelijk soepel.",
    hours: 1,
  },
  {
    id: "some",
    label: "Af en toe irritant",
    body: "Copy-paste tussen mail, Excel en je shop.",
    hours: 6,
  },
  {
    id: "lots",
    label: "Elke week veel uren",
    body: "Handwerk remt groei merkbaar af.",
    hours: 15,
  },
  {
    id: "crisis",
    label: "Het eet mijn week",
    body: "Automatisering is geen nice-to-have meer.",
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

export const GROEISCAN_CHANNELS = [
  {
    id: "seo",
    label: "Google & SEO",
    hint: "Organisch verkeer en vindbaarheid",
    icon: Search,
    floor: "vindbaarheid",
  },
  {
    id: "google-ads",
    label: "Google Ads",
    hint: "Betaald zoeken in Google",
    icon: Megaphone,
    floor: "campagnes",
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    hint: "Facebook en Instagram campagnes",
    icon: Megaphone,
    floor: "campagnes",
  },
  {
    id: "email",
    label: "E-mail",
    hint: "Nieuwsbrieven en flows",
    icon: Zap,
    floor: "behoud",
  },
  {
    id: "social",
    label: "Social & content",
    hint: "Organisch bereik en posts",
    icon: TrendingUp,
    floor: "campagnes",
  },
] as const;

export const TOWER_FLOORS = [
  { id: "fundament", label: "Fundament", sub: "Site & shop" },
  { id: "strategie", label: "Strategie", sub: "Route & focus" },
  { id: "vindbaarheid", label: "Vindbaarheid", sub: "SEO & content" },
  { id: "campagnes", label: "Campagnes", sub: "Google & Meta Ads" },
  { id: "behoud", label: "Behoud", sub: "E-mail & koppelingen" },
] as const;

export type GroeiscanGoalId = (typeof GROEISCAN_GOALS)[number]["id"];
export type GroeiscanSituationId = (typeof GROEISCAN_SITUATIONS)[number]["id"];
export type GroeiscanFrictionId = (typeof GROEISCAN_FRICTION_LEVELS)[number]["id"];

export interface PlaygroundScoreInput {
  goal: GroeiscanGoalId;
  budgetTier: number;
  maturity: number;
  frictionHours: number;
  channelIds: ReadonlySet<string>;
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

export function computePlaygroundScore(input: PlaygroundScoreInput): number {
  const g = GROEISCAN_GOALS.find((x) => x.id === input.goal)!;
  const budgetPts = input.budgetTier * 5;
  const matPts = input.maturity * 3;
  const frictionPts = clamp(Math.round(input.frictionHours / 3), 0, 14);
  const channelPts = Math.min(input.channelIds.size * 3, 12);
  const raw = 20 + budgetPts + matPts + frictionPts + channelPts + g.bonus;
  return clamp(Math.round(raw), 15, 98);
}

export function computeGrowthTier(score: number): GrowthTier {
  if (score < 35) {
    return {
      id: "seed",
      label: "Zaadje",
      body: "Er zit meer groeipotentieel in dan je nu benut. Goed nieuws: veel winst zit dichtbij.",
      quip: "Elke boom begon klein. Behalve sequoia's. Die zijn gewoon oneerlijk.",
    };
  }
  if (score < 52) {
    return {
      id: "sprout",
      label: "Spruit",
      body: "De basis staat. Nu is het zaak om de juiste volgorde te kiezen, niet alles tegelijk.",
      quip: "Twee kanalen tegelijk zonder plan is multitasken. En dat werkt nergens.",
    };
  }
  if (score < 68) {
    return {
      id: "plant",
      label: "Stevige plant",
      body: "Je bent klaar om gericht te investeren. Wat nu werkt, kun je opschalen.",
      quip: "SkinComplete begon met SEO. Ads kwamen pas toen organisch al verkocht.",
    };
  }
  if (score < 84) {
    return {
      id: "tree",
      label: "Boom",
      body: "Sterk uitgangspunt. Nu gaat het om fine-tunen en budget verschuiven naar winnaars.",
      quip: "Op dit niveau win je op details. Kleur van een knop, letterlijk miljoenen waard.",
    };
  }
  return {
    id: "harvest",
    label: "Oogst",
    body: "Je speelt in de hoogste league. Volgende stap: domineren zonder budget te verbranden.",
    quip: "Gefeliciteerd. Nu mag je ambitieus zijn. Maar nog steeds met een plan.",
  };
}

export function computePlaygroundInsight(input: PlaygroundScoreInput): PlaygroundInsight {
  const g = GROEISCAN_GOALS.find((x) => x.id === input.goal)!;
  const tier = computeGrowthTier(computePlaygroundScore(input));

  if (input.frictionHours >= 15) {
    return {
      headline: "Je grootste winst zit in rust en automatisering",
      sub: "Veel handwerk betekent: koppel systemen, haal copy-paste weg en geef je team lucht. Dan pas schaal je.",
      quip: "Elke uur copy-paste is een uur geen groei. Reken maar na.",
    };
  }

  if (input.maturity <= 4) {
    return {
      headline: "Eerst fundament, dan gas",
      sub: "Site, shop of meetplan eerst op orde. Daarna pas campagnes opschalen. Anders betaal je voor klikken zonder waarde.",
      quip: "Ads op een kale site is geld verbranden met een mooie vlam.",
    };
  }

  if (!input.channelIds.has("seo") && (input.goal === "leads" || input.goal === "revenue")) {
    return {
      headline: "Vindbaarheid is je goedkoopste groeikanaal",
      sub: "Google en AI-zoekmachines leveren verkeer zonder per klik te betalen. Dat is vaak de slimste eerste stap.",
      quip: "15% van alle zoekopdrachten is gloednieuw. Altijd ruimte om te winnen.",
    };
  }

  if (input.channelIds.size >= 4) {
    return {
      headline: "Je doet al veel. Tijd om te scherpstellen",
      sub: "Meer kanalen is niet altijd beter. Eén lijn tussen site, content en campagnes haalt vaak de grootste sprong.",
      quip: "Vijf bureaus voor vijf kanalen? Dan ben jij de projectmanager. Leuk.",
    };
  }

  return {
    headline: `Je groeipad richting ${g.label.toLowerCase()} is te tekenen`,
    sub: `Met jouw ambitie en huidige stand kunnen we maximaal drie focuspunten kiezen. De rest wacht zijn beurt.`,
    quip: tier.quip,
  };
}

export function computePlaygroundRoute(input: PlaygroundScoreInput): RouteStep[] {
  const steps: RouteStep[] = [];
  const hasSeo = input.channelIds.has("seo");
  const hasGoogleAds = input.channelIds.has("google-ads");
  const hasMetaAds = input.channelIds.has("meta-ads");
  const hasAds = hasGoogleAds || hasMetaAds;

  if (input.maturity <= 4) {
    steps.push({
      title: "Fundament op orde",
      body: "Website or shop from scratch, snel en meetbaar. Geen template dat vastloopt als je groeit.",
      href: "/bouwen",
      pillar: "Bouwen",
      accent: "#0F172A",
    });
  }

  if (input.budgetTier <= 1 || input.maturity <= 5) {
    steps.push({
      title: "Route en prioriteit bepalen",
      body: "Groeiscan of strategie: waar zit marge, wat eerst, wat later. Maximaal drie focuspunten.",
      href: "/strategie",
      pillar: "Strategie",
      accent: "#FF5722",
    });
  }

  if (!hasSeo && (input.goal === "leads" || input.goal === "revenue")) {
    steps.push({
      title: "Vindbaar worden in Google",
      body: "SEO, content en techniek. Organisch verkeer voordat je budget op ads zet.",
      href: "/vindbaarheid",
      pillar: "Vindbaarheid",
      accent: "#00BCD4",
    });
  }

  if (input.frictionHours >= 10 || input.goal === "automate") {
    steps.push({
      title: "Handwerk eruit, systemen erin",
      body: "Orders, e-mail en CRM koppelen. Minder tabbladen, meer rust.",
      href: "/behoud",
      pillar: "Behoud",
      accent: "#22C55E",
    });
  }

  if (hasSeo && !hasAds && (input.goal === "leads" || input.goal === "revenue") && input.maturity >= 5) {
    steps.push({
      title: "Google Ads en Meta Ads gericht inzetten",
      body: "Campagnes op een fundament dat al converteert. Niet eerder, niet zonder meetplan.",
      href: "/campagnes",
      pillar: "Campagnes",
      accent: "#E1306C",
    });
  }

  if (input.goal === "speed") {
    steps.push({
      title: "Snelheid en conversie verbeteren",
      body: "Core Web Vitals, UX en CRO. Bezoekers oordelen sneller dan je denkt.",
      href: "/diensten/cro",
      pillar: "Bouwen",
      accent: "#0284c7",
    });
  }

  const fallbacks: RouteStep[] = [
    {
      title: "Vindbaarheid en autoriteit",
      body: "Content en SEO die blijven renderen, ook als adsprijzen stijgen.",
      href: "/vindbaarheid",
      pillar: "Vindbaarheid",
      accent: "#00BCD4",
    },
    {
      title: "Campagnes met meetplan",
      body: "Google Ads en Meta Ads die je kunt uitleggen en bijsturen.",
      href: "/campagnes",
      pillar: "Campagnes",
      accent: "#FF5722",
    },
    {
      title: "Behoud en slimme koppelingen",
      body: "E-mailflows en automatisering die omzet vasthouden.",
      href: "/behoud",
      pillar: "Behoud",
      accent: "#22C55E",
    },
  ];

  for (const fb of fallbacks) {
    if (steps.length >= 3) break;
    if (!steps.some((s) => s.href === fb.href)) steps.push(fb);
  }

  return steps.slice(0, 3);
}

export function computeActiveFloors(input: PlaygroundScoreInput): boolean[] {
  const score = computePlaygroundScore(input);
  const progress = clamp(score / 100, 0.2, 1);

  return TOWER_FLOORS.map((floor, index) => {
    const threshold = (index + 1) / TOWER_FLOORS.length;
    let active = progress >= threshold - 0.15;

    if (floor.id === "vindbaarheid" && input.channelIds.has("seo")) active = true;
    if (floor.id === "campagnes" && (input.channelIds.has("google-ads") || input.channelIds.has("meta-ads") || input.channelIds.has("social"))) {
      active = true;
    }
    if (floor.id === "behoud" && (input.channelIds.has("email") || input.frictionHours >= 10)) {
      active = true;
    }
    if (floor.id === "fundament" && input.maturity >= 3) active = true;
    if (floor.id === "strategie" && input.budgetTier >= 1) active = true;

    return active;
  });
}

export function getMeneerCoachLine(
  step: WizardStepId,
  context?: {
    goal?: GroeiscanGoalId;
    situation?: GroeiscanSituationId;
    friction?: GroeiscanFrictionId;
  },
): string {
  if (step === "goal" && context?.goal) {
    return GROEISCAN_GOALS.find((g) => g.id === context.goal)?.meneerTip ?? "Kies één hoofddoel. Scherp is fijner dan breed.";
  }
  if (step === "situation") {
    return "Wees eerlijk. Niemand begon met een perfecte stack. Behalve Netflix misschien.";
  }
  if (step === "friction" && context?.friction === "crisis") {
    return "Als handwerk je week eet, is automatisering geen project voor 'later'.";
  }
  if (step === "channels") {
    return "Geen enkel kanaal aangevinkt? Dan weet ik al waar we beginnen.";
  }
  if (step === "route") {
    return "Dit is je speel-route. De echte Groeiscan maakt het concreet met jouw cijfers.";
  }
  return "Tik je antwoord aan. De toren groeit mee. Ja, echt.";
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
  const channels = GROEISCAN_CHANNELS.filter((c) => input.channelIds.has(c.id))
    .map((c) => c.label)
    .join(", ");

  return [
    "--- Groeiscan playground (website) ---",
    `Groeikracht: ${score}/100 (${computeGrowthTier(score).label})`,
    `Hoofddoel: ${goal}`,
    `Situatie: ${situationLabel ?? `volwassenheid ${input.maturity}/10`}`,
    `Ambitie: ${formatBudgetTier(input.budgetTier)}`,
    `Tijdverspilling: ${frictionLabel ?? `${input.frictionHours} uur/week`}`,
    `Kanalen: ${channels || "nog weinig ingezet"}`,
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
