/**
 * Milestone 9.3.1 — keyword pre-gate.
 *
 * Runs before any SERP call. Buyer intent alone is never enough:
 * a keyword must also carry prospecting value for Meneer Marketing.
 */

import { MASS_RETAIL_OPERATOR_TOKENS } from "../../config/prospectExclusion.js";
import { scoreProductArchetypeFit, type ArchetypeFitResult } from "./productArchetypeFit.js";

export type KeywordPreGateClass =
  | "NON_BRANDED_SPECIFIC_PRODUCT"
  | "PROBLEM_SOLUTION_PRODUCT"
  | "HIGH_CONSIDERATION_PRODUCT"
  | "RETAILER_BRANDED"
  | "NAVIGATIONAL"
  | "REVIEW_RESEARCH"
  | "GENERIC_CATEGORY"
  | "VERY_BROAD_PRODUCT"
  | "PRODUCT_BRANDED_RESELLER";

const PRIORITY_CLASSES: KeywordPreGateClass[] = [
  "NON_BRANDED_SPECIFIC_PRODUCT",
  "PROBLEM_SOLUTION_PRODUCT",
  "HIGH_CONSIDERATION_PRODUCT",
];

const REJECT_CLASSES: KeywordPreGateClass[] = [
  "RETAILER_BRANDED",
  "NAVIGATIONAL",
  "REVIEW_RESEARCH",
  "GENERIC_CATEGORY",
  "VERY_BROAD_PRODUCT",
  "PRODUCT_BRANDED_RESELLER",
];

const REVIEW_RESEARCH_TOKENS = [
  "beste",
  "besten",
  "review",
  "reviews",
  "test",
  "getest",
  "vergelijken",
  "vergelijking",
  "top 5",
  "top 10",
  "welke",
  "ervaringen",
  "wat is",
];

const NAVIGATIONAL_TOKENS = ["inloggen", "openingstijden", "winkel", "filiaal", "folder", "bezorging"];

const PROBLEM_TOKENS = [
  "nekklachten",
  "rugklachten",
  "rugpijn",
  "nekpijn",
  "hernia",
  "allergie",
  "anti trek",
  "anti-trek",
  "zijslaper",
  "slapeloosheid",
  "herstel",
  "spierpijn",
  "acne",
  "pigmentvlekken",
  "rimpels",
  "haaruitval",
  "gevoelige huid",
];

const HIGH_CONSIDERATION_TOKENS = [
  "professioneel",
  "op maat",
  "premium",
  "clinical",
  "medisch",
  "specialist",
  "systeem",
  "apparaat",
  "device",
];

/** Fallback product-brand tokens; the DB set can be injected for accuracy. */
const DEFAULT_PRODUCT_BRAND_TOKENS = [
  "la roche posay",
  "la roche-posay",
  "cerave",
  "vichy",
  "eucerin",
  "bioderma",
  "avene",
  "nuxe",
  "the ordinary",
  "paulas choice",
  "silvana",
  "tempur",
  "m line",
  "auping",
  "theragun",
  "hunter",
  "foreo",
  "dyson",
  "philips",
  "beurer",
  "medisana",
];

export interface KeywordPreGateInput {
  keyword: string;
  searchVolume?: number | null;
  cpc?: number | null;
  /** Optional richer brand token set (from DB) for reseller detection. */
  productBrandTokens?: Set<string>;
}

export interface KeywordPreGateResult {
  keyword: string;
  preGateClass: KeywordPreGateClass;
  accepted: boolean;
  rejectReason: string | null;
  archetype: ArchetypeFitResult;
  /** 0-100 prospecting value, deliberately independent of commercial intent. */
  prospectingValue: number;
  commercialIntent: number;
  signals: string[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasToken(haystack: string, token: string): boolean {
  const needle = normalize(token);
  if (!needle) return false;
  if (needle.includes(" ") || needle.includes("-")) return haystack.includes(needle);
  return new RegExp(`(?:^|\\s)${needle}(?:\\s|$)`).test(haystack);
}

function findToken(haystack: string, tokens: Iterable<string>): string | null {
  for (const token of tokens) {
    if (hasToken(haystack, token)) return token;
  }
  return null;
}

/** Commercial intent, kept separate so the difference stays visible. */
export function scoreCommercialIntent(input: KeywordPreGateInput): number {
  const volume = input.searchVolume ?? 0;
  const cpc = input.cpc ?? 0;
  const volumeScore = volume >= 2000 ? 100 : volume >= 500 ? 80 : volume >= 100 ? 60 : volume >= 20 ? 40 : 20;
  const cpcScore = cpc >= 1.5 ? 100 : cpc >= 0.8 ? 80 : cpc >= 0.4 ? 60 : cpc > 0 ? 40 : 25;
  return Math.round(volumeScore * 0.5 + cpcScore * 0.5);
}

export function evaluateKeywordPreGate(input: KeywordPreGateInput): KeywordPreGateResult {
  const normalized = normalize(input.keyword);
  const signals: string[] = [];
  const archetype = scoreProductArchetypeFit(input.keyword);
  const commercialIntent = scoreCommercialIntent(input);

  let preGateClass: KeywordPreGateClass = "NON_BRANDED_SPECIFIC_PRODUCT";
  let rejectReason: string | null = null;

  const retailerToken = findToken(normalized, MASS_RETAIL_OPERATOR_TOKENS);
  const navigationalToken = findToken(normalized, NAVIGATIONAL_TOKENS);
  const reviewToken = findToken(normalized, REVIEW_RESEARCH_TOKENS);
  const brandTokens = input.productBrandTokens ?? new Set(DEFAULT_PRODUCT_BRAND_TOKENS);
  const productBrandToken = findToken(normalized, brandTokens);
  const problemToken = findToken(normalized, PROBLEM_TOKENS);
  const considerationToken = findToken(normalized, HIGH_CONSIDERATION_TOKENS);

  if (retailerToken) {
    preGateClass = "RETAILER_BRANDED";
    rejectReason = `retailer in keyword: "${retailerToken}"`;
    signals.push(rejectReason);
  } else if (navigationalToken) {
    preGateClass = "NAVIGATIONAL";
    rejectReason = `navigationeel: "${navigationalToken}"`;
    signals.push(rejectReason);
  } else if (reviewToken) {
    preGateClass = "REVIEW_RESEARCH";
    rejectReason = `research-modifier: "${reviewToken}"`;
    signals.push(rejectReason);
  } else if (productBrandToken) {
    preGateClass = "PRODUCT_BRANDED_RESELLER";
    rejectReason = `merkproduct trekt resellers: "${productBrandToken}"`;
    signals.push(rejectReason);
  } else if (archetype.rejectReason === "TOO_BROAD") {
    preGateClass = "VERY_BROAD_PRODUCT";
    rejectReason = "te brede productcategorie";
    signals.push(rejectReason);
  } else if (archetype.rejectReason === "NO_ARCHETYPE_MATCH") {
    preGateClass = "GENERIC_CATEGORY";
    rejectReason = "past in geen enkele productfamilie";
    signals.push(rejectReason);
  } else if (archetype.rejectReason === "ARCHETYPE_DISABLED") {
    preGateClass = "GENERIC_CATEGORY";
    rejectReason = `branch uit: ${archetype.archetypeLabel}`;
    signals.push(rejectReason);
  } else if (archetype.rejectReason === "LOW_ARCHETYPE_FIT") {
    preGateClass = "VERY_BROAD_PRODUCT";
    rejectReason = `archetype fit ${archetype.productArchetypeFitScore} te laag`;
    signals.push(rejectReason);
  } else if (problemToken) {
    preGateClass = "PROBLEM_SOLUTION_PRODUCT";
    signals.push(`probleemgericht: "${problemToken}"`);
  } else if (considerationToken) {
    preGateClass = "HIGH_CONSIDERATION_PRODUCT";
    signals.push(`high consideration: "${considerationToken}"`);
  }

  const accepted = !REJECT_CLASSES.includes(preGateClass);
  const priorityBonus = PRIORITY_CLASSES.includes(preGateClass) ? 12 : 0;

  const prospectingValue = accepted
    ? Math.max(
        0,
        Math.min(100, Math.round(archetype.productArchetypeFitScore * 0.8 + commercialIntent * 0.2 + priorityBonus))
      )
    : Math.max(0, Math.min(35, Math.round(archetype.productArchetypeFitScore * 0.3)));

  return {
    keyword: input.keyword,
    preGateClass,
    accepted,
    rejectReason,
    archetype,
    prospectingValue,
    commercialIntent,
    signals,
  };
}

export { PRIORITY_CLASSES as KEYWORD_PRIORITY_CLASSES, REJECT_CLASSES as KEYWORD_REJECT_CLASSES };
