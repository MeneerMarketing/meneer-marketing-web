/**
 * Milestone 9.5 — regression for preview_case_potential ranking.
 */

import { DESIGN_GAP_FIXTURES, type DesignGapFixtureProfile } from "../../config/designGapFixtures.js";
import { computePreviewCasePotential } from "./previewCasePotential.js";

export interface DesignGapRegressionCase {
  label: string;
  previewCasePotential: number;
  passesPreauditGate: boolean;
  passed: boolean;
  detail: string;
}

export interface DesignGapRegressionResult {
  passed: number;
  total: number;
  cases: DesignGapRegressionCase[];
  rankingOk: boolean;
}

function runFixture(fixture: DesignGapFixtureProfile): DesignGapRegressionCase {
  const result = computePreviewCasePotential({
    highTicketFocusedFit: fixture.highTicketFocusedFit,
    heroPrice: fixture.heroPrice,
    assetReadinessProxy: fixture.assetReadinessProxy,
    contentAvailableScore: fixture.contentAvailableScore,
    contentPresentationQuality: fixture.contentPresentationQuality,
    preauditVisualGap: fixture.preauditVisualGap,
    preauditPurchaseGap: fixture.preauditPurchaseGap,
    mobileGapProxy: fixture.mobileGapProxy,
    estimatedContrastCeiling: fixture.estimatedContrastCeiling,
    businessMaturity: fixture.businessMaturity,
    ownBrandSignal: fixture.ownBrandSignal,
    alreadyPolishedPenalty: fixture.alreadyPolishedPenalty,
  });

  const gateOk = result.passesPreauditGate === fixture.expectPreauditGate;
  const passed = gateOk;

  return {
    label: fixture.label,
    previewCasePotential: result.score,
    passesPreauditGate: result.passesPreauditGate,
    passed,
    detail: passed
      ? `preview ${result.score}`
      : `gate verwacht ${fixture.expectPreauditGate ? "pass" : "fail"}, kreeg ${result.passesPreauditGate ? "pass" : "fail"} (${result.gateFailures.join(", ")})`,
  };
}

export function runDesignGapRegression(): DesignGapRegressionResult {
  const cases = DESIGN_GAP_FIXTURES.map(runFixture);

  const scores = DESIGN_GAP_FIXTURES.map((fixture, index) => ({
    tier: fixture.expectRankTier,
    score: cases[index].previewCasePotential,
  }));

  const topScore = scores.find((entry) => entry.tier === "top")?.score ?? 0;
  const midScore = scores.find((entry) => entry.tier === "mid")?.score ?? 0;
  const bottomScore = scores.find((entry) => entry.tier === "bottom")?.score ?? 0;

  const rankingOk = topScore > midScore && midScore > bottomScore;

  return {
    passed: cases.filter((entry) => entry.passed).length + (rankingOk ? 1 : 0),
    total: cases.length + 1,
    cases,
    rankingOk,
  };
}
