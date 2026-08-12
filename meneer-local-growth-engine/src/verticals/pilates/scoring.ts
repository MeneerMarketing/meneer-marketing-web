/**
 * Pilates vertical — lead scoring & city winner calibration (M6.1)
 */

export interface ScoringWeights {
  business_quality: number;
  website_opportunity: number;
  seo_opportunity: number;
  local_reputation: number;
  service_fit: number;
  brand_fit: number;
  contactability: number;
  competition_fit: number;
}

/** Hybrid city-winner thresholds (absolute + relative + exceptional) */
export interface WinnerRuleThresholds {
  /** STRONG ABSOLUTE: lead_score alone is enough */
  absoluteMinLeadScore: number;
  /** STRONG RELATIVE path */
  relativeMinLeadScore: number;
  relativeMinMargin: number;
  relativeMinSeoOpportunity: number;
  relativeMinBusinessQuality: number;
  /** EXCEPTIONAL OPPORTUNITY path */
  exceptionalMinSeoOpportunity: number;
  exceptionalMinLeadScore: number;
  /** Hard floors — never select below these even if relative */
  hardMinLeadScore: number;
  hardMinContactability: number;
  hardMinMarginWhenTied: number;
  /** Minimum winner_confidence to become PRIMARY */
  minWinnerConfidence: number;
  /** Minimum confidence for READY_FOR_OUTREACH */
  minConfidenceForOutreach: number;
}

export interface PilatesScoringConfig {
  weights: ScoringWeights;
  /** @deprecated Prefer hybrid winnerRules; kept for dashboards/env compat */
  cityWinnerMinScore: number;
  cityWinnerMinMargin: number;
  contactabilityMinForOutreach: number;
  autoGenerateWinnerPreview: boolean;
  preferredServiceTypes: string[];
  serviceBoosts: Record<string, number>;
  winnerRules: WinnerRuleThresholds;
}

export const pilatesScoringConfig: PilatesScoringConfig = {
  weights: {
    business_quality: 0.15,
    website_opportunity: 0.2,
    seo_opportunity: 0.2,
    local_reputation: 0.12,
    service_fit: 0.12,
    brand_fit: 0.12,
    contactability: 0.09,
    competition_fit: 0,
  },
  cityWinnerMinScore: Number(process.env.CITY_WINNER_MIN_SCORE ?? 75),
  cityWinnerMinMargin: Number(process.env.CITY_WINNER_MIN_MARGIN ?? 6),
  contactabilityMinForOutreach: 55,
  autoGenerateWinnerPreview: process.env.AUTO_GENERATE_WINNER_PREVIEW === "true",
  preferredServiceTypes: ["reformer", "private", "duo", "mat"],
  serviceBoosts: {
    reformer: 18,
    private: 10,
    duo: 6,
    prenatal: 5,
    postnatal: 5,
    mat: 8,
    group: 4,
  },
  winnerRules: {
    absoluteMinLeadScore: Number(process.env.CITY_WINNER_MIN_SCORE ?? 75),
    relativeMinLeadScore: Number(process.env.CITY_WINNER_RELATIVE_MIN_SCORE ?? 68),
    relativeMinMargin: Number(process.env.CITY_WINNER_MIN_MARGIN ?? 6),
    relativeMinSeoOpportunity: Number(process.env.CITY_WINNER_RELATIVE_MIN_SEO ?? 65),
    relativeMinBusinessQuality: Number(
      process.env.CITY_WINNER_RELATIVE_MIN_BUSINESS_QUALITY ?? 70
    ),
    exceptionalMinSeoOpportunity: Number(process.env.CITY_WINNER_EXCEPTIONAL_SEO ?? 85),
    exceptionalMinLeadScore: Number(process.env.CITY_WINNER_EXCEPTIONAL_MIN_SCORE ?? 65),
    hardMinLeadScore: Number(process.env.CITY_WINNER_HARD_MIN_SCORE ?? 60),
    hardMinContactability: Number(process.env.CITY_WINNER_HARD_MIN_CONTACT ?? 45),
    hardMinMarginWhenTied: Number(process.env.CITY_WINNER_TIE_MARGIN ?? 3),
    minWinnerConfidence: Number(process.env.WINNER_MIN_CONFIDENCE ?? 72),
    minConfidenceForOutreach: Number(process.env.WINNER_MIN_CONFIDENCE_OUTREACH ?? 72),
  },
};

export function assertWeightsSum(weights: ScoringWeights): void {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.02) {
    console.warn(`[pilates scoring] weights sum to ${sum}, expected ~1`);
  }
}
