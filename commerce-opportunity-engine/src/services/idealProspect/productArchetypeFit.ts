/**
 * Milestone 9.3.1 — product_archetype_fit_score.
 *
 * Answers one question before any keyword expansion happens:
 * is this product type suitable for our personalized deep-dive CRO proposition?
 */

import {
  ARCHETYPE_BY_ID,
  IDEAL_PRODUCT_ARCHETYPES_V1,
  MIN_ARCHETYPE_FIT_FOR_DISCOVERY,
  type ProductArchetype,
  type ProductArchetypeId,
  type ProductFamily,
} from "../../config/idealProductArchetypes.js";

/** Tokens that signal a product needs explanation before purchase. */
const DEEP_DIVE_POSITIVE_TOKENS = [
  "technologie",
  "werking",
  "golflengte",
  "instelbaar",
  "programma",
  "sensor",
  "app",
  "smart",
  "professioneel",
  "clinical",
  "medisch",
  "op maat",
  "ergonomisch",
  "materiaal",
  "specificaties",
  "resultaten",
  "therapie",
  "systeem",
  "automatisch",
  "premium",
];

/** Tokens that mark commodity or price-only competition. */
const COMMODITY_TOKENS = [
  "goedkoop",
  "goedkope",
  "aanbieding",
  "korting",
  "outlet",
  "sale",
  "kopen",
  "prijs",
  "budget",
  "voordelig",
  "tweedehands",
  "set van",
];

/** Very broad category nouns that cannot carry a single deep-dive PDP. */
const BROAD_CATEGORY_TOKENS = [
  "gewichten",
  "fitness spullen",
  "fitness apparatuur",
  "sportartikelen",
  "hondenvoer",
  "kattenvoer",
  "skincare",
  "huidverzorging",
  "meubels",
  "meubelen",
  "verlichting",
  "kleding",
  "schoenen",
  "speelgoed",
  "accessoires",
  "elektronica",
  "gereedschap",
  "dumbbell",
  "dumbbells",
  "halterschijf",
  "halterset",
  "yoga mat",
  "fitness mat",
];

export interface ArchetypeMatch {
  archetypeId: ProductArchetypeId | null;
  archetypeLabel: string | null;
  familyId: string | null;
  familyLabel: string | null;
  matchedToken: string | null;
  enabled: boolean;
}

export interface ArchetypeFitResult extends ArchetypeMatch {
  /** 0-100. Suitability of this product type for deep-dive CRO. */
  productArchetypeFitScore: number;
  deepDiveProductPotential: number;
  commodityPenalty: number;
  positiveSignals: string[];
  negativeSignals: string[];
  /** May this keyword continue toward SERP discovery? */
  passesArchetypeGate: boolean;
  rejectReason: string | null;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsToken(haystack: string, token: string): boolean {
  const needle = normalize(token);
  if (!needle) return false;
  if (needle.includes(" ") || needle.includes("-")) return haystack.includes(needle);
  return new RegExp(`(?:^|\\s)${needle}(?:\\s|$)`).test(haystack);
}

/** Resolve which branch and product family a keyword belongs to. */
export function matchArchetype(keyword: string): ArchetypeMatch {
  const normalized = normalize(keyword);
  let best: { archetype: ProductArchetype; family: ProductFamily; token: string } | null = null;
  let bestLength = 0;

  for (const archetype of IDEAL_PRODUCT_ARCHETYPES_V1) {
    for (const family of archetype.families) {
      if (family.rejectTokens.some((token) => containsToken(normalized, token))) continue;
      for (const token of family.matchTokens) {
        if (!containsToken(normalized, token)) continue;
        if (token.length > bestLength) {
          best = { archetype, family, token };
          bestLength = token.length;
        }
      }
    }
  }

  if (!best) {
    return {
      archetypeId: null,
      archetypeLabel: null,
      familyId: null,
      familyLabel: null,
      matchedToken: null,
      enabled: false,
    };
  }

  return {
    archetypeId: best.archetype.id,
    archetypeLabel: best.archetype.label,
    familyId: best.family.id,
    familyLabel: best.family.label,
    matchedToken: best.token,
    enabled: best.archetype.enabled,
  };
}

export function scoreProductArchetypeFit(keyword: string): ArchetypeFitResult {
  const normalized = normalize(keyword);
  const match = matchArchetype(keyword);
  const positiveSignals: string[] = [];
  const negativeSignals: string[] = [];

  const archetype = match.archetypeId ? ARCHETYPE_BY_ID.get(match.archetypeId) ?? null : null;
  const family = archetype?.families.find((f) => f.id === match.familyId) ?? null;

  let deepDive = 40;
  let commodityPenalty = 30;

  if (archetype) {
    const d = archetype.deepDive;
    deepDive =
      d.highConsideration * 0.2 +
      d.visualStorytelling * 0.15 +
      d.featureRich * 0.2 +
      d.heroProductPotential * 0.2 +
      d.premiumPrice * 0.15 +
      d.brandDifferentiation * 0.1;

    const c = archetype.commodity;
    commodityPenalty =
      c.commodity * 0.25 +
      c.priceOnlyCompetition * 0.2 +
      c.massRetailCategory * 0.25 +
      c.marketplaceDominated * 0.15 +
      c.simpleStandardized * 0.15;

    positiveSignals.push(`archetype ${archetype.label}`);
    if (family) positiveSignals.push(`familie ${family.label}`);
  } else {
    negativeSignals.push("geen archetype match");
  }

  for (const token of DEEP_DIVE_POSITIVE_TOKENS) {
    if (containsToken(normalized, token)) {
      positiveSignals.push(`uitleg-signaal "${token}"`);
      deepDive = Math.min(100, deepDive + 3);
    }
  }

  for (const token of COMMODITY_TOKENS) {
    if (containsToken(normalized, token)) {
      negativeSignals.push(`commodity-signaal "${token}"`);
      commodityPenalty = Math.min(100, commodityPenalty + 8);
    }
  }

  let broadHit: string | null = null;
  for (const token of BROAD_CATEGORY_TOKENS) {
    if (containsToken(normalized, token)) {
      broadHit = token;
      negativeSignals.push(`brede categorie "${token}"`);
      commodityPenalty = Math.min(100, commodityPenalty + 25);
      break;
    }
  }

  const wordCount = normalized.split(" ").filter(Boolean).length;
  if (wordCount <= 2 && !family) {
    negativeSignals.push("te generieke query zonder productfamilie");
    commodityPenalty = Math.min(100, commodityPenalty + 15);
  }

  const familyModifier = family?.fitModifier ?? 0;
  const raw = deepDive - commodityPenalty * 0.6 + familyModifier;
  const productArchetypeFitScore = Math.max(0, Math.min(100, Math.round(raw)));

  let rejectReason: string | null = null;
  if (!archetype) rejectReason = "NO_ARCHETYPE_MATCH";
  else if (!archetype.enabled) rejectReason = "ARCHETYPE_DISABLED";
  else if (broadHit) rejectReason = "TOO_BROAD";
  else if (productArchetypeFitScore < MIN_ARCHETYPE_FIT_FOR_DISCOVERY) rejectReason = "LOW_ARCHETYPE_FIT";

  return {
    ...match,
    productArchetypeFitScore,
    deepDiveProductPotential: Math.round(deepDive),
    commodityPenalty: Math.round(commodityPenalty),
    positiveSignals,
    negativeSignals,
    passesArchetypeGate: rejectReason === null,
    rejectReason,
  };
}

/** Full lineage record, so no keyword exists without a traceable origin. */
export interface KeywordLineage {
  keyword: string;
  source: "ARCHETYPE_SEED" | "SEED_EXPANSION" | "LEGACY_IMPORT";
  archetypeId: ProductArchetypeId | null;
  familyId: string | null;
  seed: string | null;
  productArchetypeFitScore: number;
  generatedAt: string;
}

export function buildKeywordLineage(
  keyword: string,
  source: KeywordLineage["source"],
  seed: string | null
): KeywordLineage {
  const fit = scoreProductArchetypeFit(keyword);
  return {
    keyword,
    source,
    archetypeId: fit.archetypeId,
    familyId: fit.familyId,
    seed,
    productArchetypeFitScore: fit.productArchetypeFitScore,
    generatedAt: new Date().toISOString(),
  };
}
