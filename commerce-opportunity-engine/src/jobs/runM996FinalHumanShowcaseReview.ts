/**
 * Milestone 9.9.6 — final human showcase review for 3 validated prospects.
 */

import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  M996_REVIEW_VERSION,
  M996_REPORT_PATH,
  M996_DASHBOARD_REPORT_PATH,
  M996_INPUT_M994,
  M996_INPUT_M995,
  M996_SHOWCASE_DOMAINS,
  M996_SCREENSHOT_KEYS,
  M996_FULL_PAGE_KEY,
} from "../config/finalHumanShowcaseReview.js";
import { M994_DISCOVERY } from "../config/visualFocusedBrandProduction.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { classifyCaptureHealthFromScreenshot } from "../services/prospect/captureHealthClassifier.js";
import {
  assessBeforeAfterObvious,
  assessBusinessRisk,
  classifyMaterialBreakdown,
  classifyMaterialQuality,
  assignFinalClassification,
  listRedesignChanges,
  synthesizeHomepageReview,
  synthesizePdpReview,
  visualFitScoreForRanking,
  wouldApproachBusiness,
} from "../services/prospect/humanShowcaseReview.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const M994_INPUT = resolve(projectRoot, M996_INPUT_M994);
const M995_INPUT = resolve(projectRoot, M996_INPUT_M995);
const REPORT_PATH = resolve(projectRoot, M996_REPORT_PATH);
const DASHBOARD_REPORT_PATH = resolve(projectRoot, M996_DASHBOARD_REPORT_PATH);
const M994_SCREENSHOT_DIR = resolve(projectRoot, M994_DISCOVERY.screenshotDir);

type Row = Record<string, unknown>;

function asNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function relPath(path: string): string {
  const n = path.replace(/\\/g, "/");
  const i = n.indexOf("m9.9.4-screenshots/");
  if (i >= 0) return n.slice(i);
  const j = n.indexOf("m9.9.6-screenshots/");
  if (j >= 0) return n.slice(j);
  return n;
}

function findM994Row(m994: Row, domain: string): Row | null {
  const pools = [
    (m994.validatedShowcaseProspects as Row[]) ?? [],
    (m994.allScreened as Row[]) ?? [],
    (m994.visuallyWeakShortlist as Row[]) ?? [],
  ];
  for (const pool of pools) {
    const hit = pool.find((r) => String(r.domain) === domain);
    if (hit) return hit;
  }
  return null;
}

function findM995Row(m995: Row, domain: string): Row | null {
  const pool = (m995.validatedShowcasePool as Row[]) ?? [];
  const hit = pool.find((r) => String(r.domain) === domain);
  if (hit) return hit;
  const rescored = (m995.rescoredRows as Row[]) ?? [];
  return rescored.find((r) => String(r.domain) === domain) ?? null;
}

function mergeCandidate(domain: string, m994: Row, m995: Row | null): Row {
  const manual = m994.manualRationale as Record<string, string> | null;
  const m995Screens = m995?.screenshots as Record<string, string> | null;
  const m994Screens = m994.screenshots as Record<string, string> | null;
  return {
    domain,
    productUrl: m995?.productUrl ?? m994.productUrl,
    productTitle: m995?.productTitle ?? m994.productTitle,
    homepage: m994.homepage,
    heroPrice: m994.heroPrice,
    priceConfidence: m994.priceConfidence,
    showcasePageEntityType: m995?.showcasePageEntityType ?? m994.showcasePageEntityType,
    captureHealth: m995?.captureHealth ?? "UNKNOWN",
    captureConfidence: m995?.captureConfidence,
    visionScoreAllowed: m995?.visionScoreAllowed ?? true,
    visualScoreSource: m995?.visualScoreSource,
    businessModel: m995?.businessModel ?? m994.businessModel,
    refinedBusinessModel: m995?.refinedBusinessModel ?? m994.refinedBusinessModel ?? m994.businessModel,
    brandOwnershipConfidence: m995?.brandOwnershipConfidence ?? m994.brandOwnershipConfidence,
    brandOwnershipEvidence: m995?.brandOwnershipEvidence ?? m994.brandOwnershipEvidence,
    companyScaleFit: m995?.companyScaleFit ?? m994.companyScaleFit,
    catalogEstimate: m995?.catalogEstimate ?? m994.catalogEstimate,
    catalogFocus: m995?.catalogFocus ?? m994.catalogFocus,
    externalBrandBreadth: m994.externalBrandBreadth,
    businessMaturityScore: m994.businessMaturityScore,
    currentVisualQualityScore: m995?.currentVisualQualityScore ?? m994.currentVisualQualityScore,
    visualGap: m995?.visualGap ?? m994.visualGap,
    purchaseGap: m995?.purchaseGap ?? m994.purchaseGap,
    mobileGap: m995?.mobileGap ?? m994.mobileGap,
    materialFeasibility: m995?.materialFeasibility ?? m994.materialFeasibility,
    assetQuality: m994.assetQuality,
    contentAvailable: m994.contentAvailable,
    currentSiteImpression: m995?.currentSiteImpression ?? m994.currentSiteImpression,
    validatedVisualSalesFit: m995?.validatedVisualSalesFit ?? m994.validatedVisualSalesFit,
    crossDomainProductMatch: m994.crossDomainProductMatch,
    whyGoodProspect: m994.whyGoodProspect,
    manualRationale: manual,
    screenshotsRaw: m995Screens ?? m994Screens,
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureScreenshots(
  candidate: Row,
  screenshotDir: string
): Promise<Record<string, string>> {
  const domain = String(candidate.domain);
  const productUrl = String(candidate.productUrl);
  const homepage = asString(candidate.homepage) ?? `https://${domain}`;
  const slug = domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const paths: Record<string, string> = {};

  const raw = candidate.screenshotsRaw as Record<string, string> | null;
  for (const key of M996_SCREENSHOT_KEYS) {
    const fromReport = raw?.[key];
    const absFromReport =
      fromReport && !fromReport.includes(":")
        ? resolve(projectRoot, fromReport)
        : fromReport ?? null;
    const fallback = resolve(screenshotDir, `${slug}-${key}.png`);
    const abs =
      absFromReport && await fileExists(absFromReport) ? absFromReport : fallback;

    if (await fileExists(abs)) {
      paths[key] = relPath(abs);
    }
  }

  const missing = M996_SCREENSHOT_KEYS.filter((k) => !paths[k]);
  if (missing.length > 0) {
    await mkdir(screenshotDir, { recursive: true });
    const shots = await captureViewportScreenshots({
      outputDir: screenshotDir,
      domain,
      timeoutMs: 14_000,
      shots: [
        {
          key: "homepage-desktop-1440x1000",
          url: homepage,
          viewport: M994_DISCOVERY.desktop,
        },
        {
          key: "pdp-desktop-1440x1000",
          url: productUrl,
          viewport: M994_DISCOVERY.desktop,
        },
        {
          key: "pdp-mobile-390x844",
          url: productUrl,
          viewport: M994_DISCOVERY.mobile,
        },
      ],
    });
    for (const [k, v] of Object.entries(shots)) {
      paths[k] = relPath(v);
    }
  }

  const fullPage = resolve(screenshotDir, `${slug}-${M996_FULL_PAGE_KEY}.png`);
  if (await fileExists(fullPage)) {
    paths[M996_FULL_PAGE_KEY] = relPath(fullPage);
  }

  return paths;
}

function buildHumanReview(candidate: Row, screenshots: Record<string, string>): Record<string, unknown> {
  const input = {
    domain: String(candidate.domain),
    productTitle: asString(candidate.productTitle),
    heroPrice: asNumber(candidate.heroPrice),
    showcasePageEntityType: asString(candidate.showcasePageEntityType) ?? "OTHER",
    captureHealth: asString(candidate.captureHealth) ?? "UNKNOWN",
    visionScoreAllowed: candidate.visionScoreAllowed === true,
    businessModel: asString(candidate.businessModel) ?? "UNKNOWN",
    refinedBusinessModel: asString(candidate.refinedBusinessModel) ?? "UNKNOWN",
    brandOwnershipConfidence: asNumber(candidate.brandOwnershipConfidence),
    brandOwnershipEvidence: (candidate.brandOwnershipEvidence as string[]) ?? [],
    companyScaleFit: asNumber(candidate.companyScaleFit),
    catalogEstimate: asNumber(candidate.catalogEstimate),
    catalogFocus: asNumber(candidate.catalogFocus),
    externalBrandBreadth: asNumber(candidate.externalBrandBreadth),
    businessMaturityScore: asNumber(candidate.businessMaturityScore),
    currentVisualQualityScore: asNumber(candidate.currentVisualQualityScore),
    visualGap: asNumber(candidate.visualGap),
    purchaseGap: asNumber(candidate.purchaseGap),
    mobileGap: asNumber(candidate.mobileGap),
    materialFeasibility: asNumber(candidate.materialFeasibility),
    assetQuality: asNumber(candidate.assetQuality),
    contentAvailable: asNumber(candidate.contentAvailable),
    currentSiteImpression: asString(candidate.currentSiteImpression),
    manualRationale: candidate.manualRationale as {
      currentLook?: string;
      whyVisuallyWeak?: string;
      whyBusinessGood?: string;
      whatWeCouldTransform?: string;
    } | null,
    crossDomainProductMatch: asString(candidate.crossDomainProductMatch),
    whyGoodProspect: asString(candidate.whyGoodProspect),
  };

  const materialClass = classifyMaterialQuality(input);
  const beforeAfter = assessBeforeAfterObvious(input);
  const approach = wouldApproachBusiness(input);
  const pdp = synthesizePdpReview(input);

  return {
    pdpVerification: {
      productUrl: candidate.productUrl,
      productTitle: candidate.productTitle,
      heroPrice: candidate.heroPrice,
      priceConfidence: candidate.priceConfidence,
      pageEntityType: input.showcasePageEntityType,
      captureHealth: input.captureHealth,
      pdpValid:
        input.showcasePageEntityType === "PRODUCT_DETAIL" &&
        input.captureHealth === "VALID_CONTENT" &&
        input.visionScoreAllowed,
    },
    screenshots,
    humanVisualReview: {
      currentHomepage: synthesizeHomepageReview(input),
      currentPdp: pdp.summary,
      pdpDetail: pdp,
      whyCvqScore: input.currentVisualQualityScore != null
        ? `CVQ ${input.currentVisualQualityScore} uit cached vision op geldige capture. Band: ${input.manualRationale?.whyVisuallyWeak ?? "n/a"}. Impression: ${input.currentSiteImpression}.`
        : "Niet gescoord",
    },
    beforeAfterObvious: beforeAfter,
    businessCheck: {
      businessModel: input.refinedBusinessModel,
      ownershipConfidence: input.brandOwnershipConfidence,
      ownershipEvidence: input.brandOwnershipEvidence,
      companyScale: input.companyScaleFit,
      catalogEstimate: input.catalogEstimate,
      catalogFocus: input.catalogFocus,
      externalBrandBreadth: input.externalBrandBreadth,
      businessMaturity: input.businessMaturityScore,
      wouldApproach: approach.answer,
      approachNote: approach.note,
    },
    materialCheck: {
      classification: materialClass,
      breakdown: classifyMaterialBreakdown(input),
      materialFeasibility: input.materialFeasibility,
      assetQuality: input.assetQuality,
      contentAvailable: input.contentAvailable,
    },
    redesignPotential: listRedesignChanges(input),
    businessRisk: assessBusinessRisk(input),
    engineSignals: {
      currentVisualQuality: input.currentVisualQualityScore,
      visualGap: input.visualGap,
      purchaseGap: input.purchaseGap,
      mobileGap: input.mobileGap,
      currentSiteImpression: input.currentSiteImpression,
      validatedVisualSalesFit: candidate.validatedVisualSalesFit,
      note: "Hulpsignalen, geen automatische eindbeslissing.",
    },
    visualFitScore: visualFitScoreForRanking(input),
  };
}

export async function runM996FinalHumanShowcaseReview(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const startedAt = new Date().toISOString();
  const m994ScreenshotDir = M994_SCREENSHOT_DIR;

  const m994 = JSON.parse(await readFile(M994_INPUT, "utf8")) as Row;
  const m995 = JSON.parse(await readFile(M995_INPUT, "utf8")) as Row;

  console.log("\n=== M9.9.6 FINAL HUMAN SHOWCASE REVIEW ===");

  const run = await createRun(supabase, "m996_final_human_showcase_review", {
    milestone: "M9.9.6",
    domains: M996_SHOWCASE_DOMAINS,
  });

  const reviews: Record<string, Record<string, unknown>> = {};
  const rankingInputs: Array<{
    domain: string;
    pdpValid: boolean;
    beforeAfter: ReturnType<typeof assessBeforeAfterObvious>;
    material: ReturnType<typeof classifyMaterialQuality>;
    approach: "YES" | "MAYBE" | "NO";
    visualFitScore: number;
  }> = [];

  for (const domain of M996_SHOWCASE_DOMAINS) {
    const m994Row = findM994Row(m994, domain);
    if (!m994Row) {
      console.warn(`Missing M9.9.4 row for ${domain}`);
      continue;
    }
    const m995Row = findM995Row(m995, domain);
    const candidate = mergeCandidate(domain, m994Row, m995Row);
    const screenshots = await ensureScreenshots(candidate, m994ScreenshotDir);

    const pdpPath = screenshots["pdp-desktop-1440x1000"];
    const capture = await classifyCaptureHealthFromScreenshot({
      screenshotPath: pdpPath ? resolve(projectRoot, pdpPath) : null,
      manualLook: (candidate.manualRationale as { currentLook?: string } | null)?.currentLook,
      liveCapture: false,
    });
    candidate.captureHealth = capture.health;
    candidate.visionScoreAllowed = capture.visionScoreAllowed;

    const review = buildHumanReview(candidate, screenshots);
    reviews[domain] = review;

    const pdpVerification = review.pdpVerification as { pdpValid: boolean };
    rankingInputs.push({
      domain,
      pdpValid: pdpVerification.pdpValid,
      beforeAfter: review.beforeAfterObvious as ReturnType<typeof assessBeforeAfterObvious>,
      material: (review.materialCheck as { classification: ReturnType<typeof classifyMaterialQuality> }).classification,
      approach: (review.businessCheck as { wouldApproach: "YES" | "MAYBE" | "NO" }).wouldApproach,
      visualFitScore: review.visualFitScore as number,
    });

    console.log(`  ${domain} · before/after=${review.beforeAfterObvious} · material=${(review.materialCheck as Row).classification}`);
  }

  const classifications = assignFinalClassification(rankingInputs);
  const auditNext = classifications.find((c) => c.classification === "AUDIT_NEXT");
  const noWinner = !auditNext;

  const sideBySide: Record<string, Record<string, unknown>> = {};
  for (const domain of M996_SHOWCASE_DOMAINS) {
    const r = reviews[domain];
    if (!r) continue;
    const biz = r.businessCheck as Row;
    const mat = r.materialCheck as Row;
    const eng = r.engineSignals as Row;
    sideBySide[domain] = {
      businessModel: biz.businessModel,
      ownershipConfidence: biz.ownershipConfidence,
      companyScale: biz.companyScale,
      catalogFocus: biz.catalogFocus,
      businessMaturity: biz.businessMaturity,
      currentVisualQuality: eng.currentVisualQuality,
      visualGap: eng.visualGap,
      purchaseGap: eng.purchaseGap,
      mobileGap: eng.mobileGap,
      materialQuality: mat.classification,
      currentSiteImpression: eng.currentSiteImpression,
      beforeAfterObvious: r.beforeAfterObvious,
      biggestRisk: r.businessRisk,
      finalClassification:
        classifications.find((c) => c.domain === domain)?.classification ?? "KEEP_AS_BACKUP",
    };
  }

  const report = {
    milestone: "M9.9.6",
    version: M996_REVIEW_VERSION,
    startedAt,
    finishedAt: new Date().toISOString(),
    scope: {
      domains: [...M996_SHOWCASE_DOMAINS],
      excluded: ["trvlmore.nl", "near-misses", "cro-only"],
    },
    cleanmasterReview: reviews["cleanmastershop.nl"],
    nordinahomeReview: reviews["nordinahome.nl"],
    oceancrossReview: reviews["oceancross.nl"],
    sideBySide: {
      columns: ["cleanmastershop.nl", "nordinahome.nl", "oceancross.nl"],
      rows: sideBySide,
    },
    auditNext: auditNext ?? null,
    classifications,
    noCurrentShowcaseWinner: noWinner,
    nextStepAdvice: noWinner
      ? "NO_CURRENT_SHOWCASE_WINNER. Volgende FOCUSED_BRAND_GAP_FIRST production batch zonder threshold tuning."
      : "STOP. Bekijk screenshots handmatig. Geen CRO tot expliciete goedkeuring.",
    screenshotPaths: {
      "cleanmastershop.nl": reviews["cleanmastershop.nl"]?.screenshots,
      "nordinahome.nl": reviews["nordinahome.nl"]?.screenshots,
      "oceancross.nl": reviews["oceancross.nl"]?.screenshots,
    },
    cost: {
      dataForSeo: 0,
      anthropic: 0,
      localScreenshotsOnlyIfMissing: true,
    },
  };

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
  await writeFile(DASHBOARD_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  await completeRun(supabase, run.id, "completed", {
    auditNext: auditNext?.domain ?? null,
    noWinner,
  });

  await closeCrawlerBrowser();

  console.log("\n=== M9.9.6 RESULTS ===");
  console.log(`AUDIT_NEXT: ${auditNext?.domain ?? "NONE"}`);
  console.log(`NO_CURRENT_SHOWCASE_WINNER: ${noWinner}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]).endsWith("runM996FinalHumanShowcaseReview.js");

if (isMain) {
  runM996FinalHumanShowcaseReview().catch(async (err) => {
    console.error(err);
    await closeCrawlerBrowser();
    process.exit(1);
  });
}
