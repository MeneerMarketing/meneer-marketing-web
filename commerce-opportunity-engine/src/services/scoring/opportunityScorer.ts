import {
  EXACT_PAID_FUNNEL_WEIGHTS,
  HIGH_CONFIDENCE_PRODUCT_TARGET_WEIGHTS,
  HIGH_CONFIDENCE_SCORE_CAP,
  KEYWORD_INTENT_PENALTY,
  OPPORTUNITY_VERDICT_BANDS,
  RETAILER_SCALE_PENALTY,
  type CroAuditType,
  type KeywordIntent,
  type OpportunityVerdict,
} from "../../config/scoringWeights.js";
import type { CroAuditAiResponse, CroQualityScores } from "../../types/audit.js";
import { applySourceQualityCap, explainOpportunityScore } from "./sourceIntegrity.js";

export interface OpportunityScoreInput {
  auditType: CroAuditType;
  ai: CroAuditAiResponse;
  confirmedPaid: boolean;
  confirmedGoogleAdvertiser?: boolean;
  paidSignalType: string | null;
  businessMaturityScore: number | null;
  retailerScaleScore: number | null;
  platform: string | null;
  platformCandidate: string | null;
  productPrice: number | null;
  reviewCount: number | null;
  hasProductPage: boolean;
  sourceQualityScore?: number | null;
  sourceType?: string | null;
  keywordIntent: KeywordIntent;
  /** Supported findings only should influence gap interpretation; quality scores still primary. */
  supportedLeakCount?: number;
  unsupportedLeakCount?: number;
}

export interface OpportunityScoreResult {
  opportunityScore: number;
  verdict: OpportunityVerdict;
  croGap: number;
  adLandingGap: number | null;
  designTrustGap: number;
  rebuildPotential: number;
  components: Record<string, number>;
  penalty: number;
  keywordIntentPenalty: number;
  formula: string;
  uncappedScore: number;
  sourceQualityCap: number | null;
  formulaLines: Array<{
    label: string;
    value: number;
    weight: number;
    contribution: number;
  }>;
}

export function computeOpportunityScore(input: OpportunityScoreInput): OpportunityScoreResult {
  if (input.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") {
    return scoreHighConfidence(input);
  }
  return scoreExactPaidFunnel(input);
}

function scoreExactPaidFunnel(input: OpportunityScoreInput): OpportunityScoreResult {
  const scores = input.ai.scores;
  const croGap = averageGap(croQualityParts(scores));
  const adLanding =
    scores.ad_landing_match_quality == null ? 50 : scores.ad_landing_match_quality;
  const adLandingGap = 100 - adLanding;
  const designTrustGap = averageGap([
    scores.visual_design_quality,
    scores.trust_quality,
    scores.offer_clarity_quality,
  ]);

  const paidAcquisitionStrength = scorePaid(input);
  const businessMaturity = clamp(input.businessMaturityScore ?? 35);
  const rebuildPotential = clamp(input.ai.custom_shopify_rebuild_potential);
  const platformFit = scorePlatform(input.platform, input.platformCandidate);
  const productCommercialSignal = scoreProductCommercial(
    input.productPrice,
    input.reviewCount,
    input.hasProductPage
  );
  const sourceQuality = clamp(input.sourceQualityScore ?? 70);

  const weights = EXACT_PAID_FUNNEL_WEIGHTS;
  const components: Record<string, number> = {
    paidAcquisitionStrength,
    businessMaturity,
    croGap,
    adLandingGap,
    platformFit,
    rebuildPotential,
    productCommercialSignal,
    designTrustGap,
    sourceQuality,
  };

  const weighted =
    paidAcquisitionStrength * weights.paidAcquisitionStrength +
    businessMaturity * weights.businessMaturity +
    croGap * weights.croGap +
    adLandingGap * weights.adLandingGap +
    platformFit * weights.platformFit +
    rebuildPotential * weights.rebuildPotential +
    productCommercialSignal * weights.productCommercialSignal +
    designTrustGap * weights.designTrustGap +
    sourceQuality * weights.sourceQuality;

  const scalePenalty = retailerScalePenalty(input.retailerScaleScore);
  const intentPenalty = KEYWORD_INTENT_PENALTY[input.keywordIntent] ?? 0;
  const penalty = scalePenalty + intentPenalty;

  const uncapped = Math.round(clamp(weighted - penalty));
  const explained = explainOpportunityScore(components, penalty, {
    ...EXACT_PAID_FUNNEL_WEIGHTS,
  });
  const capped = applySourceQualityCap(
    uncapped,
    input.sourceQualityScore ?? 100,
    input.sourceType
  );

  return {
    opportunityScore: capped.cappedScore,
    verdict: verdictForScore(capped.cappedScore),
    croGap: Math.round(croGap),
    adLandingGap: Math.round(adLandingGap),
    designTrustGap: Math.round(designTrustGap),
    rebuildPotential: Math.round(rebuildPotential),
    components: roundComponents(components),
    penalty: Math.round(penalty),
    keywordIntentPenalty: intentPenalty,
    formula:
      "EXACT_PAID: paid15 + maturity15 + croGap20 + adGap15 + platform10 + rebuild10 + product5 + designTrust5 + source5 − retailerScalePenalty − keywordIntentPenalty, then sourceQualityCap",
    uncappedScore: uncapped,
    sourceQualityCap: capped.capApplied,
    formulaLines: explained.lines,
  };
}

function scoreHighConfidence(input: OpportunityScoreInput): OpportunityScoreResult {
  const scores = input.ai.scores;
  const productPageCroGap = averageGap(croQualityParts(scores));
  const designTrustGap = averageGap([
    scores.visual_design_quality,
    scores.trust_quality,
    scores.offer_clarity_quality,
  ]);

  const confirmedPaidBrandStrength =
    input.confirmedGoogleAdvertiser || input.confirmedPaid ? 92 : 40;
  const businessMaturity = clamp(input.businessMaturityScore ?? 35);
  const rebuildPotential = clamp(input.ai.custom_shopify_rebuild_potential);
  const platformFit = scorePlatform(input.platform, input.platformCandidate);
  const productCommercialSignal = scoreProductCommercial(
    input.productPrice,
    input.reviewCount,
    input.hasProductPage
  );
  const targetSourceConfidence = clamp(input.sourceQualityScore ?? 70);

  const weights = HIGH_CONFIDENCE_PRODUCT_TARGET_WEIGHTS;
  const components: Record<string, number> = {
    confirmedPaidBrandStrength,
    businessMaturity,
    productPageCroGap,
    platformFit,
    rebuildPotential,
    productCommercialSignal,
    designTrustGap,
    targetSourceConfidence,
  };

  const weighted =
    confirmedPaidBrandStrength * weights.confirmedPaidBrandStrength +
    businessMaturity * weights.businessMaturity +
    productPageCroGap * weights.productPageCroGap +
    platformFit * weights.platformFit +
    rebuildPotential * weights.rebuildPotential +
    productCommercialSignal * weights.productCommercialSignal +
    designTrustGap * weights.designTrustGap +
    targetSourceConfidence * weights.targetSourceConfidence;

  const scalePenalty = retailerScalePenalty(input.retailerScaleScore);
  // No keyword-intent penalty path for unproven paid landing chains.
  const uncappedRaw = Math.round(clamp(weighted - scalePenalty));
  const explained = explainOpportunityScore(components, scalePenalty, {
    ...HIGH_CONFIDENCE_PRODUCT_TARGET_WEIGHTS,
  });

  const capped = applySourceQualityCap(
    uncappedRaw,
    input.sourceQualityScore ?? 100,
    input.sourceType
  );
  const afterSourceCap = capped.cappedScore;
  const opportunityScore = Math.min(afterSourceCap, HIGH_CONFIDENCE_SCORE_CAP);

  return {
    opportunityScore,
    verdict: verdictForScore(opportunityScore),
    croGap: Math.round(productPageCroGap),
    adLandingGap: null,
    designTrustGap: Math.round(designTrustGap),
    rebuildPotential: Math.round(rebuildPotential),
    components: roundComponents(components),
    penalty: Math.round(scalePenalty),
    keywordIntentPenalty: 0,
    formula: `HIGH_CONFIDENCE_PRODUCT_TARGET: paidBrand15 + maturity20 + productCroGap25 + platform15 + rebuild10 + product5 + designTrust5 + targetSource5 − retailerScalePenalty; hard cap ${HIGH_CONFIDENCE_SCORE_CAP}; no adLandingGap`,
    uncappedScore: uncappedRaw,
    sourceQualityCap: capped.capApplied,
    formulaLines: explained.lines,
  };
}

export function computeAuditConfidence(input: {
  auditType: CroAuditType;
  hasProductPage: boolean;
  screenshotOk: boolean;
  hasAdCopy: boolean;
  productResolutionConfidence: number | null;
  representationSparse: boolean;
  blockedHints: boolean;
  exactPaidEvidence: boolean;
}): number {
  let score = 100;
  if (input.auditType === "EXACT_PAID_FUNNEL") {
    if (!input.exactPaidEvidence) score -= 25;
    if (!input.hasAdCopy) score -= 10;
  } else {
    // High confidence: ad copy not required; product page is the unit of analysis.
    if (!input.hasProductPage) score -= 20;
  }
  if (!input.screenshotOk) score -= 25;
  if (
    input.productResolutionConfidence == null ||
    input.productResolutionConfidence < 0.5
  ) {
    score -= input.auditType === "EXACT_PAID_FUNNEL" ? 10 : 8;
  }
  if (input.representationSparse) score -= 15;
  if (input.blockedHints) score -= 30;
  return Math.round(clamp(score));
}

function croQualityParts(scores: CroQualityScores): number[] {
  return [
    scores.mobile_cro_quality,
    scores.desktop_cro_quality,
    scores.above_fold_quality,
    scores.product_presentation_quality,
    scores.cta_quality,
    scores.social_proof_quality,
    scores.objection_handling_quality,
    scores.product_storytelling_quality,
  ];
}

function scorePaid(input: OpportunityScoreInput): number {
  if (input.confirmedPaid) return 95;
  if (input.paidSignalType === "CONFIRMED_PAID") return 90;
  if (input.paidSignalType === "PAID_CANDIDATE") return 55;
  return 20;
}

function scorePlatform(platform: string | null, candidate: string | null): number {
  if (platform === "SHOPIFY") return 100;
  if (candidate === "SHOPIFY") return 75;
  if (platform === "WOOCOMMERCE" || candidate === "WOOCOMMERCE") return 70;
  if (candidate === "MAGENTO" || platform === "MAGENTO") return 48;
  if (platform && platform !== "UNKNOWN") return 45;
  if (candidate && candidate !== "UNKNOWN") return 35;
  return 20;
}

function scoreProductCommercial(
  price: number | null,
  reviews: number | null,
  hasProductPage: boolean
): number {
  if (!hasProductPage) return 15;
  let score = 40;
  if (price != null) {
    if (price >= 100) score += 35;
    else if (price >= 40) score += 25;
    else if (price >= 15) score += 15;
    else score += 5;
  }
  if (reviews != null) {
    if (reviews >= 100) score += 20;
    else if (reviews >= 20) score += 12;
    else if (reviews >= 1) score += 5;
  }
  return clamp(score);
}

function retailerScalePenalty(scale: number | null): number {
  if (scale == null) return 0;
  const { softThreshold, hardThreshold, maxPenalty } = RETAILER_SCALE_PENALTY;
  if (scale <= softThreshold) return 0;
  if (scale <= hardThreshold) {
    const t = (scale - softThreshold) / (hardThreshold - softThreshold);
    return t * 15;
  }
  const over = Math.min(1, (scale - hardThreshold) / 25);
  return 15 + over * (maxPenalty - 15);
}

function averageGap(qualities: number[]): number {
  const avg = qualities.reduce((a, b) => a + b, 0) / Math.max(qualities.length, 1);
  return 100 - avg;
}

function verdictForScore(score: number): OpportunityVerdict {
  for (const band of OPPORTUNITY_VERDICT_BANDS) {
    if (score >= band.min) return band.verdict;
  }
  return "SKIP";
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function roundComponents(components: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(components)) {
    out[k] = Math.round(v);
  }
  return out;
}

/** Expose for tests / reporting */
export function summarizeQuality(scores: CroQualityScores): number {
  const values = Object.values(scores).filter((v): v is number => typeof v === "number");
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
