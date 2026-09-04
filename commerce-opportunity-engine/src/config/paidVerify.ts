/**
 * Milestone 7.2.1 — Selective paid verification + cleanup.
 * Central caps/weights. No magic numbers in jobs.
 */

export const PAID_VERIFY_DEFAULTS = {
  maxTransparencyDomains: 15,
  maxTransparencyCost: 0.05,
  transparencyConcurrency: 2,
  maxPaidTargetBrands: 5,
  maxPaidTargetCost: 0.1,
  totalDataForSeoBudget: 0.15,
  /** Successful confirmation cooldown (days). */
  confirmationCooldownDays: 30,
  /** Valid unresolved (non-payment) cooldown before retry (days). */
  unresolvedCooldownDays: 7,
  /** Min category_relevance for PRIMARY discovery candidacy. */
  minRelevanceForPrimary: 45,
  /** Soft floor: below this, discovery_priority is capped. */
  relevancePriorityCapBelow: 40,
  discoveryPriorityCapWhenLowRelevance: 48,
} as const;

/** Verification ranking weights for prequalified → Transparency. */
export const VERIFICATION_RANK_WEIGHTS = {
  preFit: 0.28,
  maturity: 0.18,
  shopifyBonus: 18,
  brandTypeBonus: 12,
  specialistTypeBonus: 8,
  retailerScalePenalty: 0.35,
  sourceKeywordCount: 4,
  avgProspecting: 0.12,
  avgCategoryRelevance: 0.1,
  intelligenceCompleteness: 0.08,
} as const;

/** Confirmed → paid target ranking. */
export const CONFIRMED_TARGET_RANK_WEIGHTS = {
  preFit: 0.3,
  maturity: 0.2,
  shopifyBonus: 22,
  retailerScalePenalty: 0.4,
  sourceKeywordCount: 5,
  nonBrandedBonus: 10,
  avgProspecting: 0.15,
} as const;

/** target_priority_score for future CRO ranking (no CRO inputs). */
export const TARGET_PRIORITY_WEIGHTS = {
  sourceQuality: 0.28,
  brandPreFit: 0.2,
  maturity: 0.14,
  shopifyBonus: 12,
  keywordProspecting: 0.14,
  nonBrandedBonus: 8,
  productSignals: 0.1,
  targetConfidence: 0.14,
} as const;
