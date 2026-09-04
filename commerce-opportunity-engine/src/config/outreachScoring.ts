/**
 * Milestone 9.2 — Outreach prospect selection (vs engineering template QA).
 * Central weights, penalties, thresholds. No magic numbers in scorers.
 */

export type PilotSelectorMode = "ENGINEERING" | "OUTREACH";

/** Domains kept as internal template QA fixtures — ranked naturally, not penalized. */
export const ENGINEERING_FIXTURE_DOMAINS = ["tensfact.com"] as const;

export const OUTREACH_FIT_WEIGHTS = {
  /**
   * M9.3.4: transformation and weakness both measure "how bad is it now".
   * Concept contrast measures how impressive the before/after will look, which
   * is what actually sells the preview, so it takes weight from both.
   */
  pdpTransformation: 0.16,
  currentPdpWeakness: 0.12,
  conceptContrast: 0.12,
  conceptAssetReadiness: 0.12,
  catalogFocus: 0.08,
  catalogSweetSpot: 0.1,
  ownBrandFit: 0.08,
  heroProductQuality: 0.08,
  commercialSignal: 0.06,
  googleAdsConfirmation: 0.08,
  businessMaturity: 0.05,
  platformFit: 0.04,
  projectEconomicFit: 0.09,
} as const;

export const OUTREACH_PENALTIES = {
  croAlreadyStrongMax: 35,
  hugeCatalogMax: 22,
  generalRetailerMax: 40,
  resellerHeavyMax: 18,
  weakAssetsMax: 25,
  tinyBusinessMax: 15,
  technicalFailureMax: 30,
  lowProductValueMax: 12,
  /** When CRO audit missing but assets+catalog suggest polished shop with moderate transformation. */
  decentPdpWithoutAuditMax: 18,
} as const;

export const OUTREACH_GATE_THRESHOLDS = {
  minAssetReadiness: 52,
  minTransformation: 55,
  minDeepDivePdpFit: 58,
  minProjectEconomicFit: 50,
  minBusinessMaturity: 42,
  minOutreachConceptFit: 62,
  minCatalogFocus: 45,
} as const;

/**
 * M9.3.4: a candidate whose page is already premium fails here, not in the
 * business classifier. Being a great shop and being a great design target are
 * different questions.
 */
export const OUTREACH_CONTRAST_GATE = {
  minConceptContrast: 48,
} as const;

/** Catalog size sweet spot for deep-dive PDP propositions (estimated products). */
export const CATALOG_SWEET_SPOT_BANDS = [
  { min: 1, max: 5, score: 58, label: "micro_maturity_check" },
  { min: 6, max: 30, score: 92, label: "very_interesting" },
  { min: 31, max: 75, score: 96, label: "strong" },
  { min: 76, max: 150, score: 78, label: "usable" },
  { min: 151, max: 500, score: 48, label: "lower_fit" },
  { min: 501, max: 999999, score: 18, label: "huge_catalog" },
] as const;

export const OWN_BRAND_FIT_SCORES: Record<string, number> = {
  DTC_OWN_BRAND: 95,
  MOSTLY_OWN_BRAND: 88,
  MIXED: 52,
  SPECIALIST_RESELLER: 62,
  GENERAL_RESELLER: 18,
  MARKETPLACE: 8,
  UNKNOWN: 40,
};

export const PLATFORM_FIT_SCORES: Record<string, number> = {
  SHOPIFY: 92,
  WOOCOMMERCE: 78,
  MAGENTO: 65,
  CUSTOM: 58,
  UNKNOWN: 45,
};

/** CRO composite above this triggers cro_already_strong penalty ramp. */
export const CRO_STRONG_THRESHOLD = 72;
export const CRO_EXCEPTIONAL_THRESHOLD = 82;
