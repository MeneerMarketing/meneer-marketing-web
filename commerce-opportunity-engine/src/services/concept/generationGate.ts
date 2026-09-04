/**
 * Milestone 9 — concept generation safety gate.
 * Preview generation later may only proceed when all gates pass.
 */

import type { ConceptStatus } from "../../config/conceptScoring.js";

export type ConceptGenerationGateInput = {
  concept_status: ConceptStatus | string;
  hero_product_selected: boolean;
  asset_readiness_score: number | null;
  min_asset_readiness?: number;
  is_excluded: boolean;
  is_dnc: boolean;
  brand_eligible: boolean;
  template_id: string | null;
  template_design_available: boolean;
};

export type ConceptGenerationGateResult = {
  allowed: boolean;
  blocked_reasons: string[];
};

export function evaluateConceptGenerationGate(
  input: ConceptGenerationGateInput
): ConceptGenerationGateResult {
  const blocked: string[] = [];
  const minAssets = input.min_asset_readiness ?? 50;

  if (input.concept_status !== "BRIEF_READY") {
    blocked.push(`concept_status_must_be_BRIEF_READY_got_${input.concept_status}`);
  }
  if (!input.hero_product_selected) {
    blocked.push("hero_product_not_selected");
  }
  if (
    input.asset_readiness_score == null ||
    input.asset_readiness_score < minAssets
  ) {
    blocked.push("insufficient_assets");
  }
  if (input.is_excluded) blocked.push("brand_excluded");
  if (input.is_dnc) blocked.push("do_not_contact");
  if (!input.brand_eligible) blocked.push("brand_not_eligible");
  if (!input.template_id) blocked.push("template_not_selected");
  if (!input.template_design_available) {
    blocked.push("template_design_not_available_yet");
  }

  return {
    allowed: blocked.length === 0,
    blocked_reasons: blocked,
  };
}

/** Outreach strategy CONCEPT_FIRST requires preview later. Architecture only. */
export type ConceptFirstOutreachGateInput = {
  outreach_strategy: string;
  concept_status: string;
  preview_url: string | null;
};

export function evaluateConceptFirstOutreachGate(
  input: ConceptFirstOutreachGateInput
): ConceptGenerationGateResult {
  if (input.outreach_strategy !== "CONCEPT_FIRST_OUTREACH") {
    return { allowed: true, blocked_reasons: [] };
  }
  const blocked: string[] = [];
  if (input.concept_status !== "PREVIEW_READY") {
    blocked.push("concept_status_must_be_PREVIEW_READY");
  }
  if (!input.preview_url) {
    blocked.push("preview_url_required");
  }
  return { allowed: blocked.length === 0, blocked_reasons: blocked };
}
