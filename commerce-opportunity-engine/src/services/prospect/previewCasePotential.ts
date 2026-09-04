/**
 * Milestone 9.5 — preview_case_potential (0-100).
 *
 * Primary pre-audit ranking score. Business strength matters, but visual and
 * purchase gaps weigh heavily so polished pages do not float to the top.
 */

import {
  PREVIEW_CASE_WEIGHTS,
  PREAUDIT_GATE_THRESHOLDS,
} from "../../config/designGapProspect.js";

export type PreviewCaseInput = {
  highTicketFocusedFit: number | null;
  heroPrice: number | null;
  assetReadinessProxy: number | null;
  contentAvailableScore: number | null;
  contentPresentationQuality: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGapProxy: number | null;
  estimatedContrastCeiling: number | null;
  businessMaturity: number | null;
  ownBrandSignal: number | null;
  alreadyPolishedPenalty: number;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function norm(value: number | null, fallback = 45): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return clamp(value);
}

export function computePreviewCasePotential(input: PreviewCaseInput): {
  score: number;
  evidence: string[];
  passesPreauditGate: boolean;
  gateFailures: string[];
} {
  const evidence: string[] = [];
  const businessStrength = clamp(
    (norm(input.businessMaturity, 50) * 0.45 +
      norm(input.ownBrandSignal, 50) * 0.35 +
      norm(input.highTicketFocusedFit, 50) * 0.2)
  );

  let productEconomics = 45;
  if (input.heroPrice != null) {
    if (input.heroPrice >= 500) productEconomics = 100;
    else if (input.heroPrice >= 150) productEconomics = 92;
    else if (input.heroPrice >= 100) productEconomics = 82;
    else if (input.heroPrice >= 60) productEconomics = 62;
    else productEconomics = 38;
    evidence.push(`hero_price_${input.heroPrice}`);
  }

  const assetContent = clamp(
    (norm(input.assetReadinessProxy) * 0.55 + norm(input.contentAvailableScore) * 0.45)
  );

  const presentationDrag =
    input.contentPresentationQuality != null && input.contentPresentationQuality >= 72
      ? 12
      : input.contentPresentationQuality != null && input.contentPresentationQuality >= 60
        ? 6
        : 0;

  const raw =
    businessStrength * PREVIEW_CASE_WEIGHTS.businessStrength +
    productEconomics * PREVIEW_CASE_WEIGHTS.productEconomics +
    assetContent * PREVIEW_CASE_WEIGHTS.assetContent +
    norm(input.contentAvailableScore) * PREVIEW_CASE_WEIGHTS.contentAvailable +
    norm(input.preauditVisualGap) * PREVIEW_CASE_WEIGHTS.visualGap +
    norm(input.preauditPurchaseGap) * PREVIEW_CASE_WEIGHTS.purchaseGap +
    norm(input.mobileGapProxy) * PREVIEW_CASE_WEIGHTS.mobileGap +
    norm(input.estimatedContrastCeiling) * PREVIEW_CASE_WEIGHTS.contrastCeiling -
    presentationDrag -
    input.alreadyPolishedPenalty;

  const score = clamp(raw);
  if (presentationDrag > 0) evidence.push(`presentation_drag_${presentationDrag}`);

  const gateFailures: string[] = [];
  if (norm(input.highTicketFocusedFit) < PREAUDIT_GATE_THRESHOLDS.highTicketFocusedFit) {
    gateFailures.push("high_ticket_fit");
  }
  if (norm(input.contentAvailableScore) < PREAUDIT_GATE_THRESHOLDS.assetContentAvailability) {
    gateFailures.push("content_available");
  }
  if (norm(input.preauditVisualGap) < PREAUDIT_GATE_THRESHOLDS.preauditVisualGap) {
    gateFailures.push("visual_gap");
  }
  if (norm(input.preauditPurchaseGap) < PREAUDIT_GATE_THRESHOLDS.preauditPurchaseGap) {
    gateFailures.push("purchase_gap");
  }
  if (score < PREAUDIT_GATE_THRESHOLDS.previewCasePotential) {
    gateFailures.push("preview_case_potential");
  }

  return {
    score,
    evidence,
    passesPreauditGate: gateFailures.length === 0,
    gateFailures,
  };
}
