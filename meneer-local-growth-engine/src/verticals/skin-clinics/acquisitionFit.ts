/**
 * Skin clinics — website transformation eligibility (afgeleid van Pilates M8.3).
 * Clinics: iets meer gewicht op intake/booking en trust, iets minder op reformer-fit.
 */

export type {
  ProspectType,
  VisualTransformationFit,
  TransformationWeights,
  TransformationGates,
  VisualJudgeConfig,
  ScreenshotConfig,
} from "@/verticals/pilates/acquisitionFit";

export {
  VISUAL_COMPONENT_KEYS,
  PROSPECT_TYPE_LABELS,
  assertTransformationWeights,
} from "@/verticals/pilates/acquisitionFit";

import type { SkinClinicsAcquisitionFitConfig } from "@/verticals/skin-clinics/acquisitionFit.types";

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const skinClinicsAcquisitionFitConfig: SkinClinicsAcquisitionFitConfig = {
  version: "skin-clinics-1.0.0",
  weights: {
    website_opportunity: 0.15,
    website_quality_gap: 0.11,
    business_quality: 0.14,
    brand_asset_usability: 0.11,
    booking_opportunity: 0.12,
    seo_opportunity: 0.09,
    service_fit: 0.06,
    local_reputation: 0.07,
    visual_modernity_gap: 0.08,
    business_presentation_gap: 0.09,
    redesign_impact: 0.08,
  },
  gates: {
    minBusinessQuality: num("SKIN_CLINICS_TRANSFORMATION_MIN_BUSINESS_QUALITY", 58),
    minWebsiteOpportunity: num("SKIN_CLINICS_TRANSFORMATION_MIN_WEBSITE_OPPORTUNITY", 42),
    maxWebsiteQuality: num("SKIN_CLINICS_TRANSFORMATION_MAX_WEBSITE_QUALITY", 74),
    minBrandUsability: num("SKIN_CLINICS_TRANSFORMATION_MIN_BRAND_USABILITY", 48),
    minContactability: num("SKIN_CLINICS_TRANSFORMATION_MIN_CONTACTABILITY", 50),
    websiteTooGoodOpportunityCeiling: num(
      "SKIN_CLINICS_TRANSFORMATION_TOO_GOOD_OPPORTUNITY_CEILING",
      42,
    ),
    weakMaxBusinessQuality: num("SKIN_CLINICS_WEAK_BUSINESS_MAX_BUSINESS_QUALITY", 48),
    weakMinLocalReputation: num("SKIN_CLINICS_WEAK_BUSINESS_MIN_LOCAL_REPUTATION", 32),
    weakMinReviewCount: num("SKIN_CLINICS_WEAK_BUSINESS_MIN_REVIEW_COUNT", 3),
    growthMinBusinessQuality: num("SKIN_CLINICS_GROWTH_ONLY_MIN_BUSINESS_QUALITY", 58),
    growthMinOpportunity: num("SKIN_CLINICS_GROWTH_ONLY_MIN_OPPORTUNITY", 42),
    previewMinTransformationScore: num("SKIN_CLINICS_PREVIEW_MIN_TRANSFORMATION_SCORE", 52),
    previewMinBrandUsability: num("SKIN_CLINICS_PREVIEW_MIN_BRAND_USABILITY", 42),
    previewMinVisualConfidence: num("SKIN_CLINICS_PREVIEW_MIN_VISUAL_CONFIDENCE", 32),
    cityRadiusKm: num("SKIN_CLINICS_ACQUISITION_CITY_RADIUS_KM", 10),
    cityExonymRadiusKm: num("SKIN_CLINICS_ACQUISITION_CITY_EXONYM_RADIUS_KM", 3),
  },
  visualJudge: {
    enabled: process.env.VISUAL_JUDGE_ENABLED !== "false",
    model:
      process.env.VISUAL_JUDGE_CLAUDE_MODEL ??
      process.env.CLAUDE_MODEL ??
      "claude-haiku-4-5-20251001",
    minBusinessQuality: num("SKIN_CLINICS_VISUAL_JUDGE_MIN_BUSINESS_QUALITY", 48),
    minWebsiteOpportunity: num("SKIN_CLINICS_VISUAL_JUDGE_MIN_WEBSITE_OPPORTUNITY", 18),
    maxCandidatesPerCity: num("SKIN_CLINICS_VISUAL_JUDGE_MAX_CANDIDATES_PER_CITY", 8),
    maxCostPerRun: num("SKIN_CLINICS_VISUAL_JUDGE_MAX_COST_PER_RUN", 0.3),
    cacheMaxAgeDays: num("SKIN_CLINICS_VISUAL_JUDGE_CACHE_DAYS", 14),
    fallbackConfidence: num("SKIN_CLINICS_VISUAL_JUDGE_FALLBACK_CONFIDENCE", 28),
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
  transformationPrimaryMinMargin: num("SKIN_CLINICS_TRANSFORMATION_PRIMARY_MIN_MARGIN", 3),
  transformationPrimaryMinScore: num("SKIN_CLINICS_TRANSFORMATION_PRIMARY_MIN_SCORE", 56),
};
