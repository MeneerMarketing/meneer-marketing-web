/**
 * Milestone 9.3 — TRUE_SALES_CANDIDATE ranking (existing + new audited pool).
 */

import {
  ENGINEERING_FIXTURE_DOMAINS,
} from "../../config/outreachScoring.js";
import {
  STRONG_CONTRAST_GATE,
} from "../../config/idealProspectProfile.js";
import type { ProspectPoolEntry } from "../concept/loadConceptProspectPool.js";
import { scoreEngineeringPilotRow } from "../concept/selectPremiumDtcPilot.js";
import {
  scoreOutreachConceptFit,
  type OutreachScoringResult,
} from "../concept/outreachScoring.js";

export type TrueSalesRankedRow = {
  domain: string;
  conceptId: string;
  category: string | null;
  platform: string | null;
  commerceModel: string;
  catalogFocus: number | null;
  catalogSize: number | null;
  heroProduct: string | null;
  productPrice: number | null;
  adsStatus: string;
  currentPdpQuality: number | null;
  conceptContrast: number;
  contrastBand: string;
  contrastCeiling: string | null;
  transformation: number | null;
  assetReadiness: number | null;
  deepDiveFit: number;
  economicFit: number;
  salesFit: number;
  scoreConfidence: number;
  croDataSource: string;
  engineeringFixture: boolean;
  contrastGatePass: boolean;
  contrastBlocked: string[];
  idealPreScore: number | null;
  source: "EXISTING_POOL" | "M93_NEW";
};

export type TrueSalesWinnerResult = {
  recommended: TrueSalesRankedRow | null;
  runnerUps: TrueSalesRankedRow[];
  why: string[];
  note: string;
};

export function evaluateStrongContrastGate(input: {
  currentPdpQuality: number | null;
  conceptContrast: number;
  contrastBand: string;
  transformation: number | null;
  assetReadiness: number | null;
  deepDiveFit: number;
  salesFit: number;
  auditConfidence: number | null;
  scoreConfidence: number;
  croDataSource: string;
  pageHealthOk: boolean;
  confirmedAdvertiser: boolean;
}): { passes: boolean; blocked: string[] } {
  const t = STRONG_CONTRAST_GATE;
  const blocked: string[] = [];

  if (!input.pageHealthOk) blocked.push("page_health_not_usable");
  if (input.croDataSource !== "AUDITED") blocked.push("cro_not_audited");
  if ((input.auditConfidence ?? 0) < t.minAuditConfidence) {
    blocked.push("insufficient_audit_confidence");
  }
  if ((input.scoreConfidence ?? 0) < t.minSalesConfidence) {
    blocked.push("insufficient_sales_confidence");
  }
  if (input.currentPdpQuality != null && input.currentPdpQuality >= t.maxCurrentPdpQuality) {
    blocked.push("current_pdp_too_strong");
  }
  if (input.conceptContrast < t.minConceptContrast) {
    blocked.push(`insufficient_concept_contrast:${input.conceptContrast}:${input.contrastBand}`);
  }
  if ((input.transformation ?? 0) < t.minTransformation) {
    blocked.push("insufficient_transformation");
  }
  if ((input.assetReadiness ?? 0) < t.minAssetReadiness) {
    blocked.push("insufficient_assets");
  }
  if (input.deepDiveFit < t.minDeepDiveFit) blocked.push("insufficient_deep_dive_fit");
  if (input.salesFit < t.minSalesFit) blocked.push("insufficient_sales_fit");
  if (!input.confirmedAdvertiser) blocked.push("missing_ads_signal");

  return { passes: blocked.length === 0, blocked };
}

export function rankTrueSalesCandidates(
  entries: ProspectPoolEntry[],
  idealPreScores: Map<string, number>,
  newBrandIds: Set<string>
): TrueSalesRankedRow[] {
  const ranked: TrueSalesRankedRow[] = [];

  for (const entry of entries) {
    const row = entry.pilotRow;
    const engineering = scoreEngineeringPilotRow(row);
    const outreach: OutreachScoringResult = scoreOutreachConceptFit(
      entry.outreachInput,
      engineering
    );

    const contrast = evaluateStrongContrastGate({
      currentPdpQuality: entry.outreachInput.currentPdpQualityScore,
      conceptContrast: outreach.contrast.concept_contrast_potential,
      contrastBand: outreach.contrast.band,
      transformation: row.pdp_transformation_potential,
      assetReadiness: row.concept_asset_readiness_score,
      deepDiveFit: outreach.components.deepDivePdpFit,
      salesFit: outreach.outreachConceptFitScore,
      auditConfidence: entry.outreachInput.auditConfidence,
      scoreConfidence: outreach.outreachScoreConfidence,
      croDataSource: outreach.croDataSource,
      pageHealthOk: entry.pageHealthOk,
      confirmedAdvertiser:
        entry.outreachInput.confirmedGoogleAdvertiser ||
        entry.outreachInput.paidConfirmed,
    });

    const engineeringFixture = ENGINEERING_FIXTURE_DOMAINS.includes(
      row.normalized_domain as never
    );

    ranked.push({
      domain: row.normalized_domain,
      conceptId: row.id,
      category: entry.categoryHint,
      platform: row.platform ?? null,
      commerceModel: String(row.brand_commerce_model),
      catalogFocus: row.catalog_focus_score,
      catalogSize: row.estimated_product_count ?? null,
      heroProduct: row.primary_concept_product_title,
      productPrice: row.primary_concept_product_price,
      adsStatus: entry.adsStatus,
      currentPdpQuality: entry.outreachInput.currentPdpQualityScore,
      conceptContrast: outreach.contrast.concept_contrast_potential,
      contrastBand: outreach.contrast.band,
      contrastCeiling: outreach.contrast.ceilingApplied,
      transformation: row.pdp_transformation_potential,
      assetReadiness: row.concept_asset_readiness_score,
      deepDiveFit: outreach.components.deepDivePdpFit,
      economicFit: outreach.components.projectEconomicFit,
      salesFit: outreach.outreachConceptFitScore,
      scoreConfidence: outreach.outreachScoreConfidence,
      croDataSource: outreach.croDataSource,
      engineeringFixture,
      contrastGatePass: contrast.passes,
      contrastBlocked: contrast.blocked,
      idealPreScore: idealPreScores.get(row.brand_id) ?? null,
      source: newBrandIds.has(row.brand_id) ? "M93_NEW" : "EXISTING_POOL",
    });
  }

  return ranked.sort((a, b) => b.salesFit - a.salesFit);
}

export function selectTrueSalesDesignTarget(
  ranked: TrueSalesRankedRow[]
): TrueSalesWinnerResult {
  const eligible = ranked.filter(
    (r) =>
      r.contrastGatePass &&
      r.croDataSource === "AUDITED" &&
      !r.engineeringFixture
  );

  if (!eligible.length) {
    const bestAuditedNonFixture = ranked.find(
      (r) => r.croDataSource === "AUDITED" && !r.engineeringFixture
    );
    const bestProxy = ranked.find((r) => !r.engineeringFixture);

    return {
      recommended: null,
      runnerUps: ranked.slice(0, 3),
      why: ["no_candidate_passed_strong_contrast_gate"],
      note: bestAuditedNonFixture
        ? `Best audited non-fixture: ${bestAuditedNonFixture.domain} sales=${bestAuditedNonFixture.salesFit} blocked=${bestAuditedNonFixture.contrastBlocked.join(",")}`
        : bestProxy
          ? `Best overall: ${bestProxy.domain} sales=${bestProxy.salesFit}`
          : "empty_pool",
    };
  }

  const winner = eligible[0]!;
  const runnerUps = eligible.slice(1, 3);

  const why = [
    `Highest sales fit (${winner.salesFit}) among contrast-gate eligible non-fixture candidates`,
    `Concept contrast=${winner.conceptContrast} (${winner.contrastBand})`,
    `Current PDP quality=${winner.currentPdpQuality ?? "n/a"}, transformation=${winner.transformation}`,
    `Deep-dive fit=${winner.deepDiveFit}, assets=${winner.assetReadiness}`,
    `CRO source=${winner.croDataSource}, confidence=${winner.scoreConfidence}`,
    `Source=${winner.source}`,
  ];

  if (runnerUps[0]) {
    why.push(
      `Above #2 ${runnerUps[0].domain}: sales +${winner.salesFit - runnerUps[0].salesFit}, transform delta ${(winner.transformation ?? 0) - (runnerUps[0].transformation ?? 0)}`
    );
  }

  return {
    recommended: winner,
    runnerUps,
    why,
    note: "Design target recommendation only. No preview built.",
  };
}
