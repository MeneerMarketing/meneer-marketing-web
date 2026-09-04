/**
 * Milestone 9.4.1 — CURRENT → PROBLEM → PREMIUM_DTC OPPORTUNITY.
 *
 * Every row must trace to observed audit data. No invented features.
 */

import type { ConversionLeak } from "../../types/audit.js";

export interface InterventionRow {
  current: string;
  problem: string;
  premiumDtcOpportunity: string;
  source: string;
}

export interface InterventionMapInput {
  subScores: {
    buyblock: number | null;
    visual: number | null;
    storytelling: number | null;
    media: number | null;
    deepDive: number | null;
    mobile: number | null;
  };
  leaks: ConversionLeak[];
  strengths: Array<{ title: string }>;
  assetInventory: Record<string, boolean>;
}

const SUB_INTERVENTIONS: Array<{
  key: keyof InterventionMapInput["subScores"];
  current: string;
  problem: string;
  opportunity: string;
  threshold: number;
}> = [
  {
    key: "buyblock",
    current: "huidige buyblock",
    problem: "weinig productcontext of zwakke hiërarchie rond prijs en CTA",
    opportunity: "premium conversion buyblock met duidelijke propositie en trust naast de CTA",
    threshold: 58,
  },
  {
    key: "storytelling",
    current: "losse technische tekst",
    problem: "informatie niet visueel verteld, bezwaren blijven abstract",
    opportunity: "feature- en benefit-verhaal in lagen met echte copy uit de site",
    threshold: 58,
  },
  {
    key: "media",
    current: "gallery-only assets",
    problem: "media stopt bovenaan, beeld ondersteunt claims niet door de pagina",
    opportunity: "visuals door de volledige sales story, bestaande packshots hergebruikt",
    threshold: 58,
  },
  {
    key: "mobile",
    current: "zwakke mobile purchase hierarchy",
    problem: "CTA en productbegrip te laat op mobiel",
    opportunity: "mobile-first conversion sequence met sticky koopmoment",
    threshold: 58,
  },
  {
    key: "deepDive",
    current: "dunne verdieping",
    problem: "specificaties en uitleg niet uitgewerkt als verkoopargument",
    opportunity: "deep-dive blok met specs, FAQ en proof uit bestaande content",
    threshold: 58,
  },
  {
    key: "visual",
    current: "generiek thema-layout",
    problem: "pagina voelt als standaard Shopify-sjabloon, geen merkidentiteit",
    opportunity: "premium visuele taal met bestaande assets en merkkleur",
    threshold: 58,
  },
];

export function buildInterventionMap(input: InterventionMapInput): InterventionRow[] {
  const rows: InterventionRow[] = [];

  for (const item of SUB_INTERVENTIONS) {
    const score = input.subScores[item.key];
    if (score != null && score < item.threshold) {
      rows.push({
        current: item.current,
        problem: `${item.problem} (score ${score})`,
        premiumDtcOpportunity: item.opportunity,
        source: `subscore ${item.key}`,
      });
    }
  }

  for (const leak of input.leaks.slice(0, 4)) {
    rows.push({
      current: "geobserveerde paginafout",
      problem: `${leak.title}: ${leak.evidence}`,
      premiumDtcOpportunity: leak.recommended_fix ?? "concrete UX/CRO fix op basis van audit",
      source: `leak ${leak.severity}`,
    });
  }

  if (input.assetInventory.lifestyle && rows.some((row) => row.source === "subscore media")) {
    rows.push({
      current: "bestaande lifestylebeelden",
      problem: "beelden niet gekoppeld aan claims in de sales flow",
      premiumDtcOpportunity: "lifestyle en proof in hero en tussen secties inzetten",
      source: "asset inventory",
    });
  }

  if (input.strengths.length > 0) {
    rows.push({
      current: "wat al werkt",
      problem: "niet weggooien",
      premiumDtcOpportunity: `behouden en versterken: ${input.strengths
        .slice(0, 3)
        .map((entry) => entry.title)
        .join(", ")}`,
      source: "audit strengths",
    });
  }

  return rows.slice(0, 10);
}
