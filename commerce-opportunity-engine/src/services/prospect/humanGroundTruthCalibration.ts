/**
 * Milestone 9.9.7 — offline calibration regression against human ground truth.
 */

import { M997_HUMAN_GROUND_TRUTH_FIXTURES } from "../../config/humanGroundTruthCalibration.js";
import { computeCatalogBreadthMetrics } from "./catalogBreadthScoring.js";
import { assessHumanShowcaseLikelihood } from "./humanShowcaseLikelihood.js";
import { deriveCurrentSiteImpression } from "./showcaseCandidateIntegrity.js";
import type { ShowcaseOwnershipClass } from "./showcaseCandidateIntegrity.js";

export function runHumanGroundTruthCalibration(): {
  fixtures: Array<Record<string, unknown>>;
  passCount: number;
  total: number;
} {
  const fixtures: Array<Record<string, unknown>> = [];
  let passCount = 0;

  for (const fixture of M997_HUMAN_GROUND_TRUTH_FIXTURES) {
    const proxy = fixture.proxySignals ?? {};
    const catalog = computeCatalogBreadthMetrics({
      catalogEstimate: proxy.catalogEstimate ?? null,
      catalogVerified: proxy.catalogVerified ?? false,
      catalogFocusScore: null,
      categoryLinks: proxy.categoryLinks ?? 12,
      productLinks: 20,
      externalBrandBreadth: proxy.externalBrandBreadth ?? 0,
      companyScaleFit: proxy.companyScaleFit ?? 50,
    });

    const impression = deriveCurrentSiteImpression(proxy.currentVisualQualityScore ?? null);
    const likelihood = assessHumanShowcaseLikelihood({
      currentSiteImpression: impression,
      currentVisualQualityScore: proxy.currentVisualQualityScore ?? null,
      templateDriven: true,
      businessBreadthScore: catalog.businessBreadthScore,
      catalogConfidence: catalog.catalogConfidence,
      catalogCompactnessScore: catalog.catalogCompactnessScore,
      materialFeasibility: 85,
      heroCandidateScore: 60,
      refinedBusinessModel: (proxy.refinedBusinessModel ?? "UNKNOWN") as ShowcaseOwnershipClass,
      visionScoreAllowed: true,
    });

    const likelihoodOk =
      likelihood.likelihood === fixture.expectedLikelihood ||
      (fixture.expectedLikelihood === "WEAK" && likelihood.likelihood === "NO") ||
      (fixture.expectedLikelihood === "POSSIBLE" && likelihood.likelihood === "WEAK");

    const impressionOk = impression === fixture.expectedImpression;
    const pass = likelihoodOk && impressionOk;
    if (pass) passCount += 1;

    fixtures.push({
      label: fixture.label,
      domain: fixture.domain,
      expectedLikelihood: fixture.expectedLikelihood,
      actualLikelihood: likelihood.likelihood,
      expectedImpression: fixture.expectedImpression,
      actualImpression: impression,
      businessBreadthScore: catalog.businessBreadthScore,
      catalogCompactnessScore: catalog.catalogCompactnessScore,
      expectedOutcome: fixture.expectedOutcome,
      pass,
      rationale: likelihood.rationale,
    });
  }

  return { fixtures, passCount, total: M997_HUMAN_GROUND_TRUTH_FIXTURES.length };
}
