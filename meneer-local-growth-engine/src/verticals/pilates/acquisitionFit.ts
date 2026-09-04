/**
 * Pilates vertical — website transformation eligibility config (M8.3)
 *
 * Single place for every threshold and weight used by the acquisition fit
 * layer. Nothing here may be duplicated inside services; everything is
 * env-overridable so it stays calibratable without a code change.
 */

export type ProspectType =
  | "WEBSITE_TRANSFORMATION"
  | "GROWTH_ONLY"
  | "WEAK_BUSINESS"
  | "NOT_ELIGIBLE"
  | "UNKNOWN";

export type VisualTransformationFit = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";

/** Weights must sum to ~1. Visual weights are redistributed when Claude is unavailable. */
export interface TransformationWeights {
  website_opportunity: number;
  website_quality_gap: number;
  business_quality: number;
  brand_asset_usability: number;
  booking_opportunity: number;
  seo_opportunity: number;
  service_fit: number;
  local_reputation: number;
  visual_modernity_gap: number;
  business_presentation_gap: number;
  redesign_impact: number;
}

export const VISUAL_COMPONENT_KEYS = [
  "visual_modernity_gap",
  "business_presentation_gap",
  "redesign_impact",
] as const satisfies readonly (keyof TransformationWeights)[];

export interface TransformationGates {
  /** Hard floors for WEBSITE_TRANSFORMATION */
  minBusinessQuality: number;
  minWebsiteOpportunity: number;
  maxWebsiteQuality: number;
  minBrandUsability: number;
  minContactability: number;
  /** Website-too-good escape hatch: quality above max is only fatal when opportunity is also low */
  websiteTooGoodOpportunityCeiling: number;
  /** Weak business floors */
  weakMaxBusinessQuality: number;
  weakMinLocalReputation: number;
  weakMinReviewCount: number;
  /** Growth-only qualification */
  growthMinBusinessQuality: number;
  growthMinOpportunity: number;
  /** Preview eligibility */
  previewMinTransformationScore: number;
  previewMinBrandUsability: number;
  previewMinVisualConfidence: number;
  /** Max distance from the city centre before a studio belongs to another town */
  cityRadiusKm: number;
  /**
   * Google sometimes returns an exonym (Bruges for Brugge). When the name does
   * not match we accept anything this close to the centre as the same place.
   */
  cityExonymRadiusKm: number;
}

export interface VisualJudgeConfig {
  enabled: boolean;
  model: string;
  /** Cheap pre-gates: only serious candidates reach Claude */
  minBusinessQuality: number;
  minWebsiteOpportunity: number;
  maxCandidatesPerCity: number;
  maxCostPerRun: number;
  /** Re-use a stored assessment when it is younger than this */
  cacheMaxAgeDays: number;
  /** Confidence assigned to the deterministic fallback assessment */
  fallbackConfidence: number;
}

export interface ScreenshotConfig {
  enabled: boolean;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  quality: number;
  timeoutMs: number;
  /** Upload to the public lge-screenshots bucket so the dashboard can show them */
  uploadToStorage: boolean;
  storageBucket: string;
}

export interface PilatesAcquisitionFitConfig {
  version: string;
  weights: TransformationWeights;
  gates: TransformationGates;
  visualJudge: VisualJudgeConfig;
  screenshots: ScreenshotConfig;
  /** Minimum margin on transformation score before a #1 becomes primary candidate */
  transformationPrimaryMinMargin: number;
  transformationPrimaryMinScore: number;
}

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const pilatesAcquisitionFitConfig: PilatesAcquisitionFitConfig = {
  version: "m8.3.0",
  weights: {
    website_opportunity: 0.14,
    website_quality_gap: 0.1,
    business_quality: 0.14,
    brand_asset_usability: 0.1,
    booking_opportunity: 0.08,
    seo_opportunity: 0.08,
    service_fit: 0.04,
    local_reputation: 0.06,
    visual_modernity_gap: 0.08,
    business_presentation_gap: 0.1,
    redesign_impact: 0.08,
  },
  gates: {
    minBusinessQuality: num("WEBSITE_TRANSFORMATION_MIN_BUSINESS_QUALITY", 60),
    minWebsiteOpportunity: num("WEBSITE_TRANSFORMATION_MIN_WEBSITE_OPPORTUNITY", 45),
    maxWebsiteQuality: num("WEBSITE_TRANSFORMATION_MAX_WEBSITE_QUALITY", 72),
    minBrandUsability: num("WEBSITE_TRANSFORMATION_MIN_BRAND_USABILITY", 50),
    minContactability: num("WEBSITE_TRANSFORMATION_MIN_CONTACTABILITY", 50),
    websiteTooGoodOpportunityCeiling: num(
      "WEBSITE_TRANSFORMATION_TOO_GOOD_OPPORTUNITY_CEILING",
      45
    ),
    weakMaxBusinessQuality: num("WEAK_BUSINESS_MAX_BUSINESS_QUALITY", 50),
    weakMinLocalReputation: num("WEAK_BUSINESS_MIN_LOCAL_REPUTATION", 35),
    weakMinReviewCount: num("WEAK_BUSINESS_MIN_REVIEW_COUNT", 3),
    growthMinBusinessQuality: num("GROWTH_ONLY_MIN_BUSINESS_QUALITY", 60),
    growthMinOpportunity: num("GROWTH_ONLY_MIN_OPPORTUNITY", 45),
    previewMinTransformationScore: num("PREVIEW_MIN_TRANSFORMATION_SCORE", 55),
    previewMinBrandUsability: num("PREVIEW_MIN_BRAND_USABILITY", 45),
    previewMinVisualConfidence: num("PREVIEW_MIN_VISUAL_CONFIDENCE", 35),
    cityRadiusKm: num("ACQUISITION_CITY_RADIUS_KM", 10),
    cityExonymRadiusKm: num("ACQUISITION_CITY_EXONYM_RADIUS_KM", 3),
  },
  visualJudge: {
    enabled: process.env.VISUAL_JUDGE_ENABLED !== "false",
    model:
      process.env.VISUAL_JUDGE_CLAUDE_MODEL ??
      process.env.CLAUDE_MODEL ??
      "claude-haiku-4-5-20251001",
    minBusinessQuality: num("VISUAL_JUDGE_MIN_BUSINESS_QUALITY", 50),
    minWebsiteOpportunity: num("VISUAL_JUDGE_MIN_WEBSITE_OPPORTUNITY", 20),
    maxCandidatesPerCity: num("VISUAL_JUDGE_MAX_CANDIDATES_PER_CITY", 8),
    maxCostPerRun: num("VISUAL_JUDGE_MAX_COST_PER_RUN", 0.3),
    cacheMaxAgeDays: num("VISUAL_JUDGE_CACHE_DAYS", 14),
    fallbackConfidence: num("VISUAL_JUDGE_FALLBACK_CONFIDENCE", 30),
  },
  screenshots: {
    enabled: process.env.SCREENSHOT_CAPTURE_ENABLED !== "false",
    desktopWidth: num("SCREENSHOT_DESKTOP_WIDTH", 1440),
    desktopHeight: num("SCREENSHOT_DESKTOP_HEIGHT", 1000),
    mobileWidth: num("SCREENSHOT_MOBILE_WIDTH", 390),
    mobileHeight: num("SCREENSHOT_MOBILE_HEIGHT", 844),
    quality: num("SCREENSHOT_QUALITY", 68),
    timeoutMs: num("SCREENSHOT_TIMEOUT_MS", 25000),
    uploadToStorage: process.env.SCREENSHOT_UPLOAD_TO_STORAGE !== "false",
    storageBucket: process.env.SCREENSHOT_BUCKET ?? "lge-screenshots",
  },
  transformationPrimaryMinMargin: num("TRANSFORMATION_PRIMARY_MIN_MARGIN", 3),
  transformationPrimaryMinScore: num("TRANSFORMATION_PRIMARY_MIN_SCORE", 58),
};

export function assertTransformationWeights(weights: TransformationWeights): void {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.02) {
    console.warn(`[pilates acquisition fit] weights sum to ${sum}, expected ~1`);
  }
}

export const PROSPECT_TYPE_LABELS: Record<ProspectType, string> = {
  WEBSITE_TRANSFORMATION: "Website transformation",
  GROWTH_ONLY: "Growth only",
  WEAK_BUSINESS: "Zwak bedrijf",
  NOT_ELIGIBLE: "Niet geschikt",
  UNKNOWN: "Nog niet beoordeeld",
};
