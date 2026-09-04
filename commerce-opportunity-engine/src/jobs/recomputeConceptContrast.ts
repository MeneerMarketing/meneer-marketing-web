/**
 * Milestone 9.3.4 — apply concept_contrast_potential to the whole existing pool.
 *
 * Business classification says what a shop is. Contrast says whether a preview
 * of its product page would impress anyone. This job scores every concept
 * candidate on that second question, stores it, and reports which candidates
 * change eligibility because of it.
 *
 * Deterministic. No DataForSEO, no Anthropic, no outreach.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { loadConceptProspectPool } from "../services/concept/loadConceptProspectPool.js";
import { scoreOutreachConceptFit } from "../services/concept/outreachScoring.js";
import { scoreEngineeringPilotRow } from "../services/concept/selectPremiumDtcPilot.js";
import { evaluateOutreachCandidateGate } from "../services/concept/outreachCandidateGate.js";
import {
  runConceptContrastRegression,
  type ContrastRegressionResult,
} from "../services/concept/conceptContrastRegression.js";
import {
  CONTRAST_GATE_THRESHOLDS,
} from "../config/conceptContrast.js";
import { OUTREACH_CONTRAST_GATE } from "../config/outreachScoring.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/concept-contrast-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/concept-contrast-report.json"
);

type ContrastRow = {
  domain: string;
  conceptId: string;
  band: string;
  contrast: number;
  confidence: number;
  ceiling: string | null;
  roomScore: number;
  capabilityScore: number;
  currentPdpQuality: number | null;
  transformation: number | null;
  salesFit: number;
  croDataSource: string;
  designTargetEligible: boolean;
  outreachEligible: boolean;
  blockedOnContrastOnly: boolean;
  blockedReasons: string[];
  evidence: string[];
};

export type ContrastReport = {
  milestone: "M9.3.4";
  finishedAt: string;
  thresholds: {
    designTarget: number;
    outreach: number;
  };
  regression: ContrastRegressionResult;
  scored: number;
  persisted: number;
  bandCounts: Record<string, number>;
  designTargetEligible: number;
  newlyBlocked: ContrastRow[];
  rows: ContrastRow[];
};

export async function recomputeConceptContrast(): Promise<ContrastReport> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const entries = await loadConceptProspectPool(supabase);

  const rows: ContrastRow[] = [];
  const bandCounts: Record<string, number> = {};
  let persisted = 0;

  for (const entry of entries) {
    const engineering = scoreEngineeringPilotRow(entry.pilotRow);
    const outreach = scoreOutreachConceptFit(entry.outreachInput, engineering);
    const contrast = outreach.contrast;

    const gate = evaluateOutreachCandidateGate({
      row: entry.pilotRow,
      outreach,
      pageHealthOk: entry.pageHealthOk,
      croQualityComposite: entry.croQualityComposite,
      auditConfidence: entry.outreachInput.auditConfidence,
    });

    const contrastBlocks = gate.blockedReasons.filter((reason) =>
      reason.startsWith("insufficient_concept_contrast")
    );
    const otherBlocks = gate.blockedReasons.filter(
      (reason) => !reason.startsWith("insufficient_concept_contrast")
    );

    bandCounts[contrast.band] = (bandCounts[contrast.band] ?? 0) + 1;

    const { error } = await supabase
      .from("coe_concept_candidates")
      .update({
        concept_contrast_potential: contrast.concept_contrast_potential,
        concept_contrast_band: contrast.band,
        concept_contrast_confidence: contrast.confidence,
        concept_contrast_ceiling: contrast.ceilingApplied,
        concept_contrast_evidence: contrast.evidence,
        concept_contrast_computed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", entry.pilotRow.id);
    if (!error) persisted += 1;

    rows.push({
      domain: entry.pilotRow.normalized_domain,
      conceptId: entry.pilotRow.id,
      band: contrast.band,
      contrast: contrast.concept_contrast_potential,
      confidence: contrast.confidence,
      ceiling: contrast.ceilingApplied,
      roomScore: contrast.roomScore,
      capabilityScore: contrast.capabilityScore,
      currentPdpQuality: entry.outreachInput.currentPdpQualityScore,
      transformation: entry.pilotRow.pdp_transformation_potential,
      salesFit: outreach.outreachConceptFitScore,
      croDataSource: outreach.croDataSource,
      designTargetEligible:
        contrast.concept_contrast_potential >= CONTRAST_GATE_THRESHOLDS.minDesignTargetContrast,
      outreachEligible: gate.eligible,
      // The interesting group: everything else was fine, only the before/after
      // was not going to be convincing.
      blockedOnContrastOnly: contrastBlocks.length > 0 && otherBlocks.length === 0,
      blockedReasons: gate.blockedReasons,
      evidence: contrast.evidence,
    });
  }

  rows.sort((a, b) => b.contrast - a.contrast);

  const report: ContrastReport = {
    milestone: "M9.3.4",
    finishedAt: new Date().toISOString(),
    thresholds: {
      designTarget: CONTRAST_GATE_THRESHOLDS.minDesignTargetContrast,
      outreach: OUTREACH_CONTRAST_GATE.minConceptContrast,
    },
    regression: runConceptContrastRegression(),
    scored: rows.length,
    persisted,
    bandCounts,
    designTargetEligible: rows.filter((row) => row.designTargetEligible).length,
    newlyBlocked: rows.filter((row) => row.blockedOnContrastOnly),
    rows,
  };

  const serialized = JSON.stringify(report, null, 2);
  await writeFile(REPORT_PATH, serialized, "utf8");
  await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");

  return report;
}

async function main(): Promise<void> {
  console.log("\n=== M9.3.4 CONCEPT CONTRAST ===");
  const report = await recomputeConceptContrast();

  console.log(
    `  regressie ${report.regression.passed}/${report.regression.total} · drempel design target ${report.thresholds.designTarget}, outreach ${report.thresholds.outreach}`
  );
  for (const entry of report.regression.cases) {
    console.log(
      `    ${entry.passed ? "ok  " : "FOUT"} ${entry.label} → ${entry.score} ${entry.band}${entry.ceilingApplied ? ` (plafond: ${entry.ceilingApplied})` : ""}`
    );
  }

  console.log(`\n  ${report.scored} kandidaten gescoord, ${report.persisted} opgeslagen`);
  console.log(
    `  banden: ${Object.entries(report.bandCounts)
      .map(([band, count]) => `${band} ${count}`)
      .join(" · ")}`
  );
  console.log(`  contrast hoog genoeg voor design target: ${report.designTargetEligible}`);

  if (report.newlyBlocked.length > 0) {
    console.log("\n  Alleen op contrast geblokkeerd:");
    for (const row of report.newlyBlocked) {
      console.log(
        `    ${row.domain} · contrast ${row.contrast} (${row.band})${row.ceiling ? ` · plafond: ${row.ceiling}` : ""} · sales fit ${row.salesFit}`
      );
    }
  }

  console.log("\n  Top contrast:");
  for (const row of report.rows.slice(0, 12)) {
    console.log(
      `    ${row.domain} · ${row.contrast} ${row.band} · ruimte ${row.roomScore} · materiaal ${row.capabilityScore} · PDP ${row.currentPdpQuality ?? "?"} · ${row.croDataSource}`
    );
  }

  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("recomputeConceptContrast.js")
  : false;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
