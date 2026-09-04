/**
 * Dual-mode Opportunity Score weights — Milestone 5.4.
 *
 * EXACT_PAID_FUNNEL may use ad→landing gap.
 * HIGH_CONFIDENCE_PRODUCT_TARGET must NOT invent ad→landing proof; score capped at 84.
 */

export type CroAuditType = "EXACT_PAID_FUNNEL" | "HIGH_CONFIDENCE_PRODUCT_TARGET";

export type KeywordIntent =
  | "NON_BRANDED_COMMERCIAL"
  | "BRANDED"
  | "PRODUCT_BRANDED"
  | "NAVIGATIONAL"
  | "UNKNOWN";

/** A. Exact paid Search funnel (proven keyword → ad → landing). */
export const EXACT_PAID_FUNNEL_WEIGHTS = {
  paidAcquisitionStrength: 0.15,
  businessMaturity: 0.15,
  croGap: 0.2,
  adLandingGap: 0.15,
  platformFit: 0.1,
  rebuildPotential: 0.1,
  productCommercialSignal: 0.05,
  designTrustGap: 0.05,
  sourceQuality: 0.05,
} as const;

/**
 * B. High-confidence product target (confirmed advertiser + exact product URL,
 * specific paid landing relation NOT proven). No adLandingGap factor.
 */
export const HIGH_CONFIDENCE_PRODUCT_TARGET_WEIGHTS = {
  confirmedPaidBrandStrength: 0.15,
  businessMaturity: 0.2,
  productPageCroGap: 0.25,
  platformFit: 0.15,
  rebuildPotential: 0.1,
  productCommercialSignal: 0.05,
  designTrustGap: 0.05,
  targetSourceConfidence: 0.05,
} as const;

/** Absolute ceiling for high-confidence (non-exact-paid) audits. */
export const HIGH_CONFIDENCE_SCORE_CAP = 84;

/**
 * Keyword-intent penalties applied AFTER weighted base (exact paid only).
 *
 * Formula:
 *   score = clamp(0, 100, base - retailerScalePenalty - keywordIntentPenalty)
 *
 * NON_BRANDED_COMMERCIAL → 0
 * PRODUCT_BRANDED        → 6
 * BRANDED                → 14
 * NAVIGATIONAL           → 18
 * UNKNOWN                → 4
 */
export const KEYWORD_INTENT_PENALTY: Record<KeywordIntent, number> = {
  NON_BRANDED_COMMERCIAL: 0,
  PRODUCT_BRANDED: 6,
  BRANDED: 14,
  NAVIGATIONAL: 18,
  UNKNOWN: 4,
};

/** Retailer scale above this starts subtracting from the final score. */
export const RETAILER_SCALE_PENALTY = {
  softThreshold: 55,
  hardThreshold: 75,
  maxPenalty: 25,
} as const;

/**
 * Meneer Marketing Fit (separate from Opportunity Score).
 * How well the brand fits our ideal client profile — NOT commercial CRO gap size.
 *
 * fit =
 *   shopifyFit * 0.20 +
 *   businessTypeFit * 0.20 +
 *   retailerScaleFit * 0.15 +
 *   commercialMaturity * 0.15 +
 *   confirmedPaidActivity * 0.10 +
 *   productSeriousness * 0.10 +
 *   projectSuitability * 0.10
 *
 * Hard floor via exclusions (marketplace / general retailer / manual exclude).
 */
export const MENEER_MARKETING_FIT_WEIGHTS = {
  shopifyFit: 0.2,
  businessTypeFit: 0.2,
  retailerScaleFit: 0.15,
  commercialMaturity: 0.15,
  confirmedPaidActivity: 0.1,
  productSeriousness: 0.1,
  projectSuitability: 0.1,
} as const;

export const OPPORTUNITY_VERDICT_BANDS = [
  { min: 93, verdict: "CONTACT_IMMEDIATELY" as const },
  { min: 85, verdict: "HIGH_PRIORITY" as const },
  { min: 70, verdict: "INTERESTING" as const },
  { min: 50, verdict: "LOW_PRIORITY" as const },
  { min: 0, verdict: "SKIP" as const },
];

export type OpportunityVerdict =
  (typeof OPPORTUNITY_VERDICT_BANDS)[number]["verdict"];

/** Dual-mode CRO audit version. */
export const CRO_AUDIT_VERSION = "2.0";
export const CRO_PROMPT_VERSION = "2.0";

/**
 * Legacy export kept for older callers; prefer EXACT_PAID_FUNNEL_WEIGHTS.
 */
export const OPPORTUNITY_SCORE_WEIGHTS = {
  paidAcquisitionStrength: EXACT_PAID_FUNNEL_WEIGHTS.paidAcquisitionStrength,
  businessMaturity: EXACT_PAID_FUNNEL_WEIGHTS.businessMaturity,
  croGap: EXACT_PAID_FUNNEL_WEIGHTS.croGap,
  adLandingGap: EXACT_PAID_FUNNEL_WEIGHTS.adLandingGap,
  rebuildPotential: EXACT_PAID_FUNNEL_WEIGHTS.rebuildPotential,
  platformFit: EXACT_PAID_FUNNEL_WEIGHTS.platformFit,
  productCommercialSignal: EXACT_PAID_FUNNEL_WEIGHTS.productCommercialSignal,
  designTrustGap: EXACT_PAID_FUNNEL_WEIGHTS.designTrustGap,
} as const;
