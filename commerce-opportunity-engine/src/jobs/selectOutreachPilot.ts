/**
 * Milestone 9.2 — Outreach prospect selector + real sales pilot hydration.
 * No outreach mail. No DataForSEO. No Anthropic.
 *
 * npm run concepts:select-outreach-pilot
 */

import { config } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { loadEnv } from "../config/env.js";
import {
  ENGINEERING_FIXTURE_DOMAINS,
  OUTREACH_FIT_WEIGHTS,
  OUTREACH_GATE_THRESHOLDS,
  OUTREACH_PENALTIES,
} from "../config/outreachScoring.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { loadConceptProspectPool } from "../services/concept/loadConceptProspectPool.js";
import { scoreEngineeringPilotRow } from "../services/concept/selectPremiumDtcPilot.js";
import { scoreOutreachConceptFit } from "../services/concept/outreachScoring.js";
import { evaluateOutreachCandidateGate } from "../services/concept/outreachCandidateGate.js";
import { hydrateConceptPilot } from "../services/concept/hydrateConceptPilot.js";
import { logger } from "../utils/logger.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "../../");
config({ path: path.resolve(projectRoot, ".env"), quiet: true });

type RankedProspect = {
  conceptId: string;
  domain: string;
  category: string | null;
  platform: string | null;
  commerceModel: string;
  catalogSize: number | null;
  catalogFocus: number | null;
  heroProduct: string | null;
  productPrice: number | null;
  adsStatus: string;
  currentPdpStrength: number | null;
  transformation: number | null;
  assetReadiness: number | null;
  deepDiveFit: number;
  projectEconomicFit: number;
  outreachConceptFit: number;
  engineeringScore: number;
  engineeringFixture: boolean;
  status: string;
  gateEligible: boolean;
  gateBlocked?: string[];
};

async function captureScreenshots(
  baseUrl: string,
  conceptId: string,
  productUrl: string,
  outDir: string
): Promise<Record<string, string>> {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const paths: Record<string, string> = {};

  async function shot(
    page: import("playwright").Page,
    url: string,
    file: string,
    fullPage: boolean
  ) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(800);
    const filePath = path.join(outDir, file);
    await page.screenshot({ path: filePath, fullPage });
    paths[file] = filePath;
  }

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await shot(
    desktop,
    `${baseUrl}/preview/concept/${conceptId}`,
    "concept-desktop-1440.png",
    false
  );
  await shot(
    desktop,
    `${baseUrl}/preview/concept/${conceptId}`,
    "concept-desktop-full.png",
    true
  );

  try {
    await shot(desktop, productUrl, "current-pdp-desktop-1440.png", false);
    await shot(desktop, productUrl, "current-pdp-desktop-full.png", true);
  } catch (e) {
    logger.warn("Current PDP desktop screenshot failed", { error: String(e) });
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await shot(
    mobile,
    `${baseUrl}/preview/concept/${conceptId}`,
    "concept-mobile-390.png",
    false
  );
  try {
    await shot(mobile, productUrl, "current-pdp-mobile-390.png", false);
  } catch (e) {
    logger.warn("Current PDP mobile screenshot failed", { error: String(e) });
  }

  await browser.close();
  return paths;
}

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const run = await createRun(supabase, "concepts_select_outreach_pilot", {
    milestone: "M9.2",
    apis: { dataforseo: 0, anthropic: 0 },
  });

  try {
    const pool = await loadConceptProspectPool(supabase);
    if (!pool.length) {
      throw new Error("No PREMIUM_DTC prospects in pool");
    }

    const scored = pool.map((entry) => {
      const engineeringScore = scoreEngineeringPilotRow(entry.pilotRow);
      const outreach = scoreOutreachConceptFit(entry.outreachInput, engineeringScore);
      const gate = evaluateOutreachCandidateGate({
        row: entry.pilotRow,
        outreach,
        pageHealthOk: entry.pageHealthOk,
        croQualityComposite: entry.croQualityComposite,
        auditConfidence: entry.outreachInput.auditConfidence,
      });
      return { entry, outreach, engineeringScore, gate };
    });

    const ranked: RankedProspect[] = scored
      .map(({ entry, outreach, engineeringScore, gate }) => ({
        conceptId: entry.pilotRow.id,
        domain: entry.pilotRow.normalized_domain,
        category: entry.categoryHint,
        platform: entry.pilotRow.platform ?? null,
        commerceModel: String(entry.pilotRow.brand_commerce_model),
        catalogSize: entry.pilotRow.estimated_product_count ?? null,
        catalogFocus: entry.pilotRow.catalog_focus_score,
        heroProduct: entry.pilotRow.primary_concept_product_title,
        productPrice: entry.pilotRow.primary_concept_product_price,
        adsStatus: entry.adsStatus,
        currentPdpStrength: entry.croQualityComposite,
        transformation: entry.pilotRow.pdp_transformation_potential,
        assetReadiness: entry.pilotRow.concept_asset_readiness_score,
        deepDiveFit: outreach.components.deepDivePdpFit,
        projectEconomicFit: outreach.components.projectEconomicFit,
        outreachConceptFit: outreach.outreachConceptFitScore,
        engineeringScore,
        engineeringFixture: entry.engineeringFixture,
        status: entry.pilotRow.status,
        gateEligible: gate.eligible,
        gateBlocked: gate.blockedReasons,
      }))
      .sort((a, b) => b.outreachConceptFit - a.outreachConceptFit);

    const top10 = ranked.slice(0, 10);

    const eligibleForPilot = scored
      .filter((s) => s.gate.eligible)
      .sort(
        (a, b) =>
          b.outreach.outreachConceptFitScore - a.outreach.outreachConceptFitScore
      );

    if (!eligibleForPilot.length) {
      throw new Error("No outreach candidates passed gate thresholds");
    }

    const winnerBundle = eligibleForPilot[0]!;
    const winner = winnerBundle.entry.pilotRow;
    const runnerUp = eligibleForPilot.slice(1, 3).map((r) => ({
      domain: r.entry.pilotRow.normalized_domain,
      outreachScore: r.outreach.outreachConceptFitScore,
      engineeringScore: r.engineeringScore,
      transformation: r.entry.pilotRow.pdp_transformation_potential,
      blocked: false,
    }));

    const whyWins = [
      `Highest outreach concept fit (${winnerBundle.outreach.outreachConceptFitScore}) among ${eligibleForPilot.length} gate-eligible briefs`,
      `Engineering score would rank at ${winnerBundle.engineeringScore} (mode=ENGINEERING)`,
      `Transformation=${winner.pdp_transformation_potential}`,
      `Current PDP weakness component=${winnerBundle.outreach.components.currentPdpWeakness}`,
      `Deep-dive fit=${winnerBundle.outreach.components.deepDivePdpFit}`,
      `Project economic fit=${winnerBundle.outreach.components.projectEconomicFit}`,
      `CRO already strong penalty=${winnerBundle.outreach.penalties.croAlreadyStrong}`,
    ];

    if (runnerUp[0]) {
      whyWins.push(
        `Beats #2 ${runnerUp[0].domain} by ${winnerBundle.outreach.outreachConceptFitScore - runnerUp[0].outreachScore} outreach points`
      );
    }

    const hydration = await hydrateConceptPilot(supabase, winner, projectRoot, {
      updateLatest: false,
    });

    const screenshotDir = path.resolve(projectRoot, "m9.2-screenshots");
    const previewBase = process.env.M92_PREVIEW_BASE || "http://localhost:3002";
    let screenshotPaths: Record<string, string> = {};
    try {
      screenshotPaths = await captureScreenshots(
        previewBase,
        winner.id,
        hydration.productUrl,
        screenshotDir
      );
    } catch (e) {
      logger.warn("Screenshot capture failed — preview server may be offline", {
        error: String(e),
      });
    }

    const tensfact = ranked.find((r) => r.domain === "tensfact.com");

    const report = {
      milestone: "M9.2",
      previewLifecycle: "INTERNAL_PREVIEW",
      outreachFormula: {
        weights: OUTREACH_FIT_WEIGHTS,
        penalties: OUTREACH_PENALTIES,
        thresholds: OUTREACH_GATE_THRESHOLDS,
        engineeringFixtureDomains: ENGINEERING_FIXTURE_DOMAINS,
      },
      top10: top10,
      tensfactComparison: tensfact
        ? {
            engineeringScore: tensfact.engineeringScore,
            outreachScore: tensfact.outreachConceptFit,
            outreachRank:
              ranked.findIndex((r) => r.domain === "tensfact.com") + 1,
            totalPool: ranked.length,
            whyDifference:
              "Outreach mode weights transformation + current PDP weakness and penalizes cro_already_strong; engineering mode favors brief quality + assets.",
            currentPdpStrength: tensfact.currentPdpStrength,
            transformation: tensfact.transformation,
            engineeringFixture: true,
          }
        : null,
      winner: {
        conceptId: winner.id,
        domain: winner.normalized_domain,
        brand: winner.brand_name,
        product: winner.primary_concept_product_title,
        productUrl: hydration.productUrl,
        productPrice: winner.primary_concept_product_price,
        whyThisProspect: whyWins,
        currentPdpWeakness: winnerBundle.outreach.components.currentPdpWeakness,
        currentPdpStrength: winnerBundle.entry.croQualityComposite,
        assetReadiness: winner.concept_asset_readiness_score,
        deepDiveFit: winnerBundle.outreach.components.deepDivePdpFit,
        projectEconomicFit: winnerBundle.outreach.components.projectEconomicFit,
        adsEvidence: winnerBundle.entry.adsStatus,
        runnerUp,
        visualContrastNote:
          "Review current vs concept screenshots manually. Mark INSUFFICIENT_TRANSFORMATION_CONTRAST if pitch is weak.",
      },
      hydration: {
        sources: hydration.crawlSummary.pages,
        assets: hydration.crawlSummary,
        snapshotPath: hydration.snapshotPath,
      },
      preview: {
        route: hydration.previewPath,
        status: "INTERNAL_PREVIEW",
        screenshots: screenshotPaths,
        screenshotDir,
      },
      cost: { dataforseo: 0, anthropic: 0 },
    };

    const reportPath = path.resolve(
      projectRoot,
      "dashboard/src/preview/concepts/data/outreach-pilot-report.json"
    );
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  // Also write per-winner report alongside snapshot
    await writeFile(hydration.reportPath, JSON.stringify(report, null, 2), "utf8");

    await completeRun(supabase, run.id, "completed", {
      winner: winner.normalized_domain,
      outreachScore: winnerBundle.outreach.outreachConceptFitScore,
      preview: hydration.previewPath,
    });

    console.log("\n=== M9.2 OUTREACH PILOT ===");
    console.log(JSON.stringify(report.winner, null, 2));
    console.log("\nTop 3 outreach:");
    for (const r of top10.slice(0, 3)) {
      console.log(
        `${r.outreachConceptFit}\teng=${r.engineeringScore}\t${r.domain}\t${r.status}`
      );
    }
    console.log("\nPreview:", hydration.previewPath);
    console.log("Report:", reportPath);
    console.log("Status: INTERNAL_PREVIEW");
  } catch (err) {
    await completeRun(supabase, run.id, "failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
