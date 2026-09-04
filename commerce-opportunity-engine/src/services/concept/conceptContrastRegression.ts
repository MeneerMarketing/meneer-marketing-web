/**
 * Milestone 9.3.4 — guards the contrast logic against its fixtures.
 *
 * Two failure modes matter. Losing the ceiling would let polished premium
 * brands back into the design pilot. Over-tightening would push good businesses
 * with plain pages out of it. The fixtures check both directions.
 */

import { CONTRAST_FIXTURES, type ContrastFixture } from "../../config/conceptContrastFixtures.js";
import { CONTRAST_GATE_THRESHOLDS } from "../../config/conceptContrast.js";
import { computeConceptContrastPotential } from "./conceptContrastPotential.js";

export interface ContrastRegressionCase {
  label: string;
  score: number;
  band: string;
  confidence: number;
  designTarget: boolean;
  passed: boolean;
  detail: string;
  ceilingApplied: string | null;
}

export interface ContrastRegressionResult {
  passed: number;
  total: number;
  cases: ContrastRegressionCase[];
}

function runFixture(fixture: ContrastFixture): ContrastRegressionCase {
  const result = computeConceptContrastPotential(fixture.input);
  const designTarget =
    result.concept_contrast_potential >= CONTRAST_GATE_THRESHOLDS.minDesignTargetContrast;

  const bandOk = fixture.expectBandOneOf.includes(result.band);
  const targetOk = designTarget === fixture.expectDesignTarget;
  const passed = bandOk && targetOk;

  const problems: string[] = [];
  if (!bandOk) {
    problems.push(`verwacht ${fixture.expectBandOneOf.join(" of ")}, kreeg ${result.band}`);
  }
  if (!targetOk) {
    problems.push(
      fixture.expectDesignTarget
        ? "had design target mogen worden"
        : "mag geen design target worden"
    );
  }

  return {
    label: fixture.label,
    score: result.concept_contrast_potential,
    band: result.band,
    confidence: result.confidence,
    designTarget,
    passed,
    detail: passed ? result.evidence.join(" · ") : problems.join(" en "),
    ceilingApplied: result.ceilingApplied,
  };
}

export function runConceptContrastRegression(): ContrastRegressionResult {
  const cases = CONTRAST_FIXTURES.map(runFixture);
  return {
    passed: cases.filter((entry) => entry.passed).length,
    total: cases.length,
    cases,
  };
}
