/**
 * Skin clinics vertical — lead scoring & city winner calibration.
 */

export type {
  ScoringWeights,
  WinnerRuleThresholds,
} from "@/verticals/pilates/scoring";

export interface SkinClinicsScoringConfig {
  weights: import("@/verticals/pilates/scoring").ScoringWeights;
  cityWinnerMinScore: number;
  cityWinnerMinMargin: number;
  contactabilityMinForOutreach: number;
  autoGenerateWinnerPreview: boolean;
  preferredServiceTypes: string[];
  serviceBoosts: Record<string, number>;
  winnerRules: import("@/verticals/pilates/scoring").WinnerRuleThresholds;
}

export const skinClinicsScoringConfig: SkinClinicsScoringConfig = {
  weights: {
    business_quality: 0.16,
    website_opportunity: 0.22,
    seo_opportunity: 0.2,
    local_reputation: 0.14,
    service_fit: 0.14,
    brand_fit: 0.1,
    contactability: 0.08,
    competition_fit: 0,
  },
  cityWinnerMinScore: Number(process.env.SKIN_CLINICS_CITY_WINNER_MIN_SCORE ?? 74),
  cityWinnerMinMargin: Number(process.env.SKIN_CLINICS_CITY_WINNER_MIN_MARGIN ?? 6),
  contactabilityMinForOutreach: 55,
  autoGenerateWinnerPreview: process.env.AUTO_GENERATE_WINNER_PREVIEW === "true",
  preferredServiceTypes: [
    "botox",
    "fillers",
    "laser",
    "hydrafacial",
    "microneedling",
    "peeling",
    "huidanalyse",
    "intake",
  ],
  serviceBoosts: {
    botox: 16,
    fillers: 14,
    laser: 18,
    hydrafacial: 12,
    microneedling: 10,
    peeling: 8,
    huidanalyse: 10,
    acne: 8,
    pigment: 8,
    intake: 6,
    medisch_esthetisch: 14,
  },
  winnerRules: {
    absoluteMinLeadScore: Number(process.env.SKIN_CLINICS_CITY_WINNER_MIN_SCORE ?? 74),
    relativeMinLeadScore: Number(process.env.SKIN_CLINICS_CITY_WINNER_RELATIVE_MIN_SCORE ?? 67),
    relativeMinMargin: Number(process.env.SKIN_CLINICS_CITY_WINNER_MIN_MARGIN ?? 6),
    relativeMinSeoOpportunity: Number(
      process.env.SKIN_CLINICS_CITY_WINNER_RELATIVE_MIN_SEO ?? 62,
    ),
    relativeMinBusinessQuality: Number(
      process.env.SKIN_CLINICS_CITY_WINNER_RELATIVE_MIN_BUSINESS_QUALITY ?? 68,
    ),
    exceptionalMinSeoOpportunity: Number(
      process.env.SKIN_CLINICS_CITY_WINNER_EXCEPTIONAL_SEO ?? 82,
    ),
    exceptionalMinLeadScore: Number(
      process.env.SKIN_CLINICS_CITY_WINNER_EXCEPTIONAL_MIN_SCORE ?? 64,
    ),
    hardMinLeadScore: Number(process.env.SKIN_CLINICS_CITY_WINNER_HARD_MIN_SCORE ?? 58),
    hardMinContactability: Number(process.env.SKIN_CLINICS_CITY_WINNER_HARD_MIN_CONTACT ?? 45),
    hardMinMarginWhenTied: Number(process.env.SKIN_CLINICS_CITY_WINNER_TIE_MARGIN ?? 3),
    minWinnerConfidence: Number(process.env.SKIN_CLINICS_WINNER_MIN_CONFIDENCE ?? 70),
    minConfidenceForOutreach: Number(
      process.env.SKIN_CLINICS_WINNER_MIN_CONFIDENCE_OUTREACH ?? 70,
    ),
  },
};
