/**
 * Milestone 9.3.4 — concept_contrast_potential.
 *
 * Deliberately separate from business classification. A shop may be a textbook
 * prospect (own brand, international, mature, real ad spend) and still score
 * near zero here, because its product page is already premium and our preview
 * would not surprise anyone.
 *
 * Reads as: room on the page, scaled by our ability to build something better.
 */

import {
  CONTRAST_ADJUSTMENTS,
  CONTRAST_BANDS,
  CONTRAST_CAPABILITY_RANGE,
  CONTRAST_CAPABILITY_WEIGHTS,
  CONTRAST_CONFIDENCE,
  CONTRAST_GATE_THRESHOLDS,
  CONTRAST_ROOM_WEIGHTS,
  CURRENT_QUALITY_CEILINGS,
  PREMIUM_DESIGN_CEILINGS,
  contrastBandFor,
} from "../../config/conceptContrast.js";
import { OWN_BRAND_FIT_SCORES } from "../../config/outreachScoring.js";
import type { CroDataSource } from "./outreachScoring.js";

export type ConceptContrastInput = {
  /** Audited composite of the current product page, 0-100. */
  currentPdpQuality: number | null;
  /** Cheaper composite used when no audit exists. */
  croQualityComposite: number | null;
  croDataSource: CroDataSource;
  auditConfidence: number | null;

  /** How premium the page already looks today. */
  visualDesignQuality: number | null;
  productStorytellingQuality: number | null;
  productPresentationQuality: number | null;
  deepDiveQuality: number | null;
  /** Optional: callers without an audit fall back to the overall page quality. */
  buyblockQuality?: number | null;
  mobilePurchaseQuality?: number | null;

  /** What we would have to work with when building the premium version. */
  conceptAssetReadiness: number | null;
  productCommercialSignal: number | null;
  catalogFocus: number | null;
  businessMaturity: number | null;
  brandCommerceModel: string;

  productDescriptionLength: number;
  reviewCount: number | null;
  siteTechnicallyBroken: boolean;
};

export type ConceptContrastResult = {
  concept_contrast_potential: number;
  band: string;
  confidence: number;
  roomScore: number;
  capabilityScore: number;
  capabilityFactor: number;
  ceilingApplied: string | null;
  evidence: string[];
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function num(value: number | null | undefined, fallback: number): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value;
}

/** Room is the inverse of what is already good about the page. */
function computeRoomScore(input: ConceptContrastInput): {
  score: number;
  quality: number | null;
  design: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  const w = CONTRAST_ROOM_WEIGHTS;

  const quality =
    input.croDataSource === "AUDITED" && input.currentPdpQuality != null
      ? input.currentPdpQuality
      : input.croQualityComposite;

  // Without any measurement we assume an average page instead of guessing high.
  const qualityValue = num(quality, 52);
  // Visual polish defaults to the overall quality: a good page is rarely ugly.
  const design = num(input.visualDesignQuality, qualityValue);
  const storytelling = num(input.productStorytellingQuality, qualityValue);
  const media = num(input.productPresentationQuality, qualityValue);
  const deepDive = num(input.deepDiveQuality, storytelling);
  const buyblock = num(input.buyblockQuality, qualityValue);
  const mobile = num(input.mobilePurchaseQuality, qualityValue);

  const score =
    (100 - qualityValue) * w.currentPdpQuality +
    (100 - design) * w.premiumDesignPerception +
    (100 - storytelling) * w.storytellingDepth +
    (100 - media) * w.mediaQuality +
    (100 - deepDive) * w.deepDiveQuality +
    (100 - buyblock) * w.buyblockQuality +
    (100 - mobile) * w.mobileQuality;

  if (design >= 75) evidence.push(`huidige vormgeving al premium (${Math.round(design)})`);
  if (storytelling <= 45) evidence.push(`product wordt nauwelijks uitgelegd (${Math.round(storytelling)})`);
  if (deepDive <= 45) evidence.push(`geen echte verdieping op de pagina (${Math.round(deepDive)})`);
  if (buyblock <= 50) evidence.push(`koopmoment nog onbenut (${Math.round(buyblock)})`);
  if (mobile <= 45) evidence.push(`mobiel kopen schiet tekort (${Math.round(mobile)})`);

  return { score: clamp(score), quality, design, evidence };
}

/** Capability is what we can actually build with, given this shop's material. */
function computeCapabilityScore(input: ConceptContrastInput): {
  score: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  const w = CONTRAST_CAPABILITY_WEIGHTS;

  const assets = num(input.conceptAssetReadiness, 45);
  const commercial = num(input.productCommercialSignal, 45);
  const ownBrand =
    OWN_BRAND_FIT_SCORES[String(input.brandCommerceModel)] ?? OWN_BRAND_FIT_SCORES.UNKNOWN;
  const focus = num(input.catalogFocus, 50);
  const maturity = num(input.businessMaturity, 45);

  const score =
    assets * w.assetReadiness +
    commercial * w.commercialSignal +
    ownBrand * w.ownBrandFit +
    focus * w.catalogFocus +
    maturity * w.businessMaturity;

  if (assets < 45) evidence.push(`te weinig materiaal voor een premium versie (${Math.round(assets)})`);
  if (ownBrand >= 88) evidence.push("eigen merk: volledige verhaallijn mogelijk");

  return { score: clamp(score), evidence };
}

/** Maps the capability score onto the multiplier range. */
function capabilityFactor(capabilityScore: number): number {
  const { min, max, fullAt, floorAt } = CONTRAST_CAPABILITY_RANGE;
  if (capabilityScore >= fullAt) return max;
  if (capabilityScore <= floorAt) return min;
  const ratio = (capabilityScore - floorAt) / (fullAt - floorAt);
  return min + ratio * (max - min);
}

/**
 * Caps from what the page already achieves. Whichever ceiling bites hardest
 * wins: a shop that is both visually premium and functionally strong should
 * not escape through the more generous of the two rules.
 */
function applyCeilings(
  score: number,
  quality: number | null,
  design: number
): { score: number; ceiling: string | null } {
  let capped = score;
  let ceiling: string | null = null;

  for (const rule of PREMIUM_DESIGN_CEILINGS) {
    if (design >= rule.minDesignPerception && capped > rule.maxContrast) {
      capped = rule.maxContrast;
      ceiling = rule.label;
      break;
    }
  }

  if (quality != null) {
    for (const rule of CURRENT_QUALITY_CEILINGS) {
      if (quality >= rule.minQuality && capped > rule.maxContrast) {
        capped = rule.maxContrast;
        ceiling = rule.label;
        break;
      }
    }
  }

  return { score: capped, ceiling };
}

function computeConfidence(input: ConceptContrastInput): number {
  if (input.croDataSource === "AUDITED") {
    const bonus = num(input.auditConfidence, 60) * CONTRAST_CONFIDENCE.auditConfidenceWeight;
    return clamp(CONTRAST_CONFIDENCE.audited * 0.85 + bonus);
  }
  if (input.croQualityComposite != null) return CONTRAST_CONFIDENCE.proxy;
  return CONTRAST_CONFIDENCE.missing;
}

export function computeConceptContrastPotential(
  input: ConceptContrastInput
): ConceptContrastResult {
  const room = computeRoomScore(input);
  const capability = computeCapabilityScore(input);
  const factor = capabilityFactor(capability.score);

  let score = room.score * factor;
  const evidence = [...room.evidence, ...capability.evidence];
  const a = CONTRAST_ADJUSTMENTS;

  if (input.siteTechnicallyBroken) {
    score -= a.technicallyBrokenPenalty;
    evidence.push("huidige pagina technisch stuk: before/after wordt ongeloofwaardig");
  }

  const model = String(input.brandCommerceModel);
  if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
    score -= a.resellerPenalty;
    evidence.push("wederverkoper: het product is niet van henzelf");
  }

  if (input.productDescriptionLength < 80) {
    score -= a.thinContentPenalty;
    evidence.push("nauwelijks broncontent om mee te bouwen");
  } else if (input.productDescriptionLength >= 200) {
    score += a.richContentBonus;
    evidence.push("genoeg broncontent voor een echte verdieping");
  }

  if ((input.reviewCount ?? 0) >= 25) {
    score += a.socialProofBonus;
    evidence.push(`${input.reviewCount} reviews om mee te overtuigen`);
  }

  const ceilinged = applyCeilings(clamp(score), room.quality, room.design);
  if (ceilinged.ceiling) {
    evidence.push(`plafond: ${ceilinged.ceiling}`);
  }

  const finalScore = clamp(ceilinged.score);

  return {
    concept_contrast_potential: finalScore,
    band: contrastBandFor(finalScore),
    confidence: computeConfidence(input),
    roomScore: room.score,
    capabilityScore: capability.score,
    capabilityFactor: Math.round(factor * 100) / 100,
    ceilingApplied: ceilinged.ceiling,
    evidence,
  };
}

/** Convenience for gates and reports. */
export function contrastBlocksDesignTarget(score: number | null): boolean {
  return (score ?? 0) < CONTRAST_GATE_THRESHOLDS.minDesignTargetContrast;
}

export const CONTRAST_BAND_ORDER = CONTRAST_BANDS.map((b) => b.band);
