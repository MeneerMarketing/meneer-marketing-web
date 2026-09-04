/**
 * Milestone 9.3.4 — the final ranking for "which prospect do we design for".
 *
 * Two separate questions, deliberately kept apart:
 *   the gate  — is this prospect allowed to be the design target at all
 *   the score — among the ones that are allowed, which one is strongest
 */

import {
  DESIGN_TARGET_GATE,
  TRUE_SALES_DESIGN_WEIGHTS,
  TRUE_SALES_DESIGN_FORMULA,
} from "../../config/newProspectAudit.js";

export interface DesignTargetGateInput {
  domain: string;
  currentPdpQuality: number | null;
  transformation: number | null;
  conceptContrast: number | null;
  assetReadiness: number | null;
  deepDiveFit: number | null;
  businessMaturity: number | null;
  auditConfidence: number | null;
  businessType: string | null;
  commercialProof: boolean;
  focusedBusiness: boolean;
  /** The audited page actually sells something: price and buy block present. */
  purchasablePage: boolean;
  excluded: boolean;
}

export interface DesignTargetGateResult {
  passed: boolean;
  blockers: string[];
  warnings: string[];
}

export function evaluateDesignTargetGate(
  input: DesignTargetGateInput
): DesignTargetGateResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (input.excluded) {
    blockers.push("uitgesloten als design target (engineering fixture)");
  }

  // Payment links, order corrections and showroom forms live on the same product
  // route as real products. They score near zero on every CRO dimension, which
  // would make the weakest page type look like the biggest opportunity.
  if (!input.purchasablePage) {
    blockers.push("geauditeerde pagina is geen koopbare productpagina");
  }

  const businessType = (input.businessType ?? "").toUpperCase();
  if (DESIGN_TARGET_GATE.blockedBusinessTypes.includes(businessType as never)) {
    blockers.push(`business type ${businessType}`);
  }

  if (input.currentPdpQuality == null) {
    blockers.push("geen gemeten PDP-kwaliteit");
  } else if (input.currentPdpQuality > DESIGN_TARGET_GATE.hardMaxCurrentPdpQuality) {
    blockers.push(
      `huidige PDP te sterk (${input.currentPdpQuality} > ${DESIGN_TARGET_GATE.hardMaxCurrentPdpQuality})`
    );
  } else if (input.currentPdpQuality > DESIGN_TARGET_GATE.preferredMaxCurrentPdpQuality) {
    warnings.push(
      `PDP boven de voorkeursgrens (${input.currentPdpQuality} > ${DESIGN_TARGET_GATE.preferredMaxCurrentPdpQuality})`
    );
  }

  if ((input.transformation ?? 0) < DESIGN_TARGET_GATE.minTransformation) {
    blockers.push(
      `transformatie te laag (${input.transformation ?? 0} < ${DESIGN_TARGET_GATE.minTransformation})`
    );
  }
  if ((input.conceptContrast ?? 0) < DESIGN_TARGET_GATE.minConceptContrast) {
    blockers.push(
      `concept contrast te laag (${input.conceptContrast ?? 0} < ${DESIGN_TARGET_GATE.minConceptContrast})`
    );
  }
  if ((input.assetReadiness ?? 0) < DESIGN_TARGET_GATE.minAssetReadiness) {
    blockers.push(
      `te weinig materiaal (${input.assetReadiness ?? 0} < ${DESIGN_TARGET_GATE.minAssetReadiness})`
    );
  }
  if ((input.deepDiveFit ?? 0) < DESIGN_TARGET_GATE.minDeepDiveFit) {
    blockers.push(
      `deep-dive fit te laag (${input.deepDiveFit ?? 0} < ${DESIGN_TARGET_GATE.minDeepDiveFit})`
    );
  }
  // Never measured is not the same as measured and bad. New prospects come out
  // of discovery without a qualification pass, and blocking them on a score
  // that was never computed would reject the whole pool for a missing field.
  if (input.businessMaturity == null) {
    warnings.push("volwassenheid niet gemeten (nog geen qualification pass)");
  } else if (input.businessMaturity < DESIGN_TARGET_GATE.minBusinessMaturity) {
    blockers.push(
      `business te onvolwassen (${input.businessMaturity} < ${DESIGN_TARGET_GATE.minBusinessMaturity})`
    );
  }
  if ((input.auditConfidence ?? 0) < DESIGN_TARGET_GATE.minAuditConfidence) {
    blockers.push(
      `auditvertrouwen te laag (${input.auditConfidence ?? 0} < ${DESIGN_TARGET_GATE.minAuditConfidence})`
    );
  }
  if (DESIGN_TARGET_GATE.requireCommercialProof && !input.commercialProof) {
    blockers.push("geen commercieel bewijs (Google Ads)");
  }
  if (DESIGN_TARGET_GATE.requireFocusedBusiness && !input.focusedBusiness) {
    blockers.push("geen focused specialist");
  }

  return { passed: blockers.length === 0, blockers, warnings };
}

export interface TrueSalesDesignInput {
  conceptContrast: number | null;
  salesFit: number | null;
  economicFit: number | null;
  auditConfidence: number | null;
  contrastConfidence: number | null;
  outreachScoreConfidence: number | null;
}

export interface TrueSalesDesignResult {
  score: number;
  measurementConfidence: number;
  components: Record<string, number>;
  formula: string;
}

/**
 * Measurement confidence, not quality. A high score built on a half-readable
 * page should not outrank a slightly lower score we actually trust.
 */
function measurementConfidence(input: TrueSalesDesignInput): number {
  const parts = [
    input.auditConfidence,
    input.contrastConfidence,
    input.outreachScoreConfidence,
  ].filter((value): value is number => value != null && Number.isFinite(value));
  if (parts.length === 0) return 40;
  return Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length);
}

export function computeTrueSalesDesignScore(
  input: TrueSalesDesignInput
): TrueSalesDesignResult {
  const confidence = measurementConfidence(input);
  const components: Record<string, number> = {
    conceptContrast: input.conceptContrast ?? 0,
    salesFit: input.salesFit ?? 0,
    economicFit: input.economicFit ?? 0,
    measurementConfidence: confidence,
  };

  let score = 0;
  for (const [key, weight] of Object.entries(TRUE_SALES_DESIGN_WEIGHTS)) {
    score += (components[key] ?? 0) * weight;
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    measurementConfidence: confidence,
    components,
    formula: TRUE_SALES_DESIGN_FORMULA,
  };
}
