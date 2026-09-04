/**
 * Milestone 9.5.1 — WIDE CHEAP DESIGN-GAP SCREEN on existing M9.5 pool.
 *
 * No new DataForSEO. Re-screens prospect-eligible domains with soft economic
 * ranking and measures design gap before strict economic gates. Prepares
 * brand-first discovery architecture without executing it.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { ARCHETYPE_BY_ID } from "../config/idealProductArchetypes.js";
import {
  M951_DISCOVERY_VERSION,
  M951_WIDE_SCREEN,
  gapScoreBand,
} from "../config/designGapWideScreen.js";
import {
  BRAND_FIRST_DISCOVERY_VERSION,
  BRAND_FIRST_PIPELINE_STAGES,
  BRAND_FIRST_SOURCE_ADAPTERS,
  BRAND_FIRST_PARKED,
  BRAND_FIRST_LEAD_PROFILE,
} from "../config/brandFirstDiscovery.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { computeHighTicketFocusedFit } from "../services/prospect/highTicketFocusedFit.js";
import { computeCompanyScaleFit } from "../services/prospect/companyScaleFit.js";
import { computeDeepDivePdpFitProxy } from "../services/prospect/prospectPreScore.js";
import { estimateContrastCeiling } from "../services/prospect/estimatedContrastCeiling.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import {
  computeCurrentPdpWeaknessProxy,
  pdpWeaknessSignalsFromHtml,
} from "../services/idealProspect/pdpWeaknessProxy.js";
import {
  computePreauditVisualGap,
  countDomSections,
} from "../services/prospect/preauditVisualGap.js";
import {
  computePreauditPurchaseGap,
  extractPurchaseGapSignals,
} from "../services/prospect/preauditPurchaseGap.js";
import {
  computeContentPresentationGap,
  extractContentPresentationSignals,
} from "../services/prospect/contentPresentationGap.js";
import { computeRawDesignGapOpportunity } from "../services/prospect/rawDesignGapOpportunity.js";
import { computePreviewCasePotentialV2 } from "../services/prospect/previewCasePotentialV2.js";
import { screenPdpViewportWithVision } from "../services/prospect/preauditVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { loadDesignGapPoolFromRun } from "../services/prospect/designGapPoolLoader.js";
import { runHeroDataConsistencyCheck } from "../services/prospect/heroDataConsistency.js";
import {
  evaluateHardExclusion,
  passesOldEconomicPrescreen,
  softWideScreenRank,
  type WideScreenPoolEntry,
} from "../services/prospect/wideScreenSelection.js";
import { buildHeroTargetRecord } from "../services/prospect/heroTargetMetadata.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const M95_REPORT_PATH = resolve(projectRoot, "reports/design-gap-discovery-report.json");
const REPORT_PATH = resolve(projectRoot, "reports/design-gap-wide-screen-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/design-gap-wide-screen-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, M951_WIDE_SCREEN.screenshotDir);

type BudgetTracker = { spent: number; cap: number };

function canSpend(budget: BudgetTracker, estimate: number): boolean {
  return budget.spent + estimate <= budget.cap + 1e-9;
}

interface ScreenedCandidate {
  domain: string;
  homepage: string;
  productFamily: string;
  familyId: string;
  branchLabel: string;
  discoveryRoute: string;
  discoverySource: string;
  sourceQuery: string | null;
  platform: string | null;
  commerceModel: string;
  companyScaleFit: number | null;
  catalogEstimate: number | null;
  catalogEstimateConfidence: string;
  catalogFocus: number | null;
  catalogFocusConfidence: string;
  ownBrand: number | null;
  ownBrandConfidence: string;
  maturity: number | null;
  maturityConfidence: string;
  heroTarget: ReturnType<typeof buildHeroTargetRecord>;
  adsShoppingEvidence: { keywords: string[]; landingUrls: string[] };
  contentAvailable: number | null;
  contentPresentation: number | null;
  preauditVisualGap: number | null;
  visualGapBand: string;
  preauditPurchaseGap: number | null;
  purchaseGapBand: string;
  mobileGap: number | null;
  rawDesignGapOpportunity: number | null;
  economicFit: number | null;
  previewCasePotentialV2: number | null;
  overallConfidence: string;
  oldEconomicPrescreenPass: boolean;
  wideScreenSelected: boolean;
  visionScreened: boolean;
  hardExcluded: boolean;
  hardExclusionReason: string | null;
  designGapRank: number | null;
  economicFitRank: number | null;
  combinedRank: number | null;
  screenshots: Record<string, string> | null;
}

export async function runDesignGapWideScreen(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const anthropicBudget: BudgetTracker = { spent: 0, cap: env.M951_MAX_ANTHROPIC_COST };
  const startedAt = new Date().toISOString();

  const m95Raw = await readFile(M95_REPORT_PATH, "utf8");
  const m95Report = JSON.parse(m95Raw) as { runId?: string; funnel?: Record<string, number> };
  const sourceRunId = m95Report.runId;
  if (!sourceRunId) throw new Error("M9.5 report missing runId");

  const consistency = await runHeroDataConsistencyCheck(projectRoot);
  console.log(`\n=== M9.5.1 WIDE CHEAP DESIGN-GAP SCREEN (${M951_DISCOVERY_VERSION}) ===`);
  console.log(`Source run: ${sourceRunId}`);
  console.log(`Hero consistency: ${consistency.vitalwaveNote}\n`);

  const pool = await loadDesignGapPoolFromRun(supabase, sourceRunId);
  const prospectEligible = pool.filter((entry) => entry.gateEligible);

  const run = await createRun(supabase, "design_gap_wide_screen", {
    milestone: M951_WIDE_SCREEN.milestone,
    version: M951_DISCOVERY_VERSION,
    sourceRunId,
    anthropicCap: anthropicBudget.cap,
  });

  const crawlTimeout = Math.min(env.CRAWLER_TIMEOUT_MS, M951_WIDE_SCREEN.crawlTimeoutMs);
  const enriched: ScreenedCandidate[] = [];
  let visionScreens = 0;

  for (const entry of prospectEligible) {
    let platform = entry.platform;
    let businessType = entry.businessType;
    let ownBrand = entry.ownBrandSignal;
    let retailerScale = entry.retailerScaleScore;
    let maturity = entry.businessMaturityScore;
    let homepageProductLinks = 0;
    let homepageCategoryLinks = 0;
    let retailerBreadth: number | null = null;

    if (!platform || !businessType) {
      try {
        const light = await runLightBrandCheck(entry.domain, crawlTimeout);
        platform = light.platform;
        businessType = light.businessType;
        ownBrand = light.ownBrandSignal;
        retailerScale = light.retailerScaleScore;
        retailerBreadth = light.retailerBreadthScore;
        homepageProductLinks = light.productLinks;
        homepageCategoryLinks = light.categoryLinks;
      } catch {
        // keep stored values
      }
    }

    let catalogFocus: number | null = null;
    let catalogVerified = false;
    let catalogSize: number | null = null;
    try {
      const catalog = await runCatalogFocusCheck(
        entry.domain,
        crawlTimeout,
        homepageProductLinks,
        homepageCategoryLinks
      );
      catalogFocus = catalog.catalogFocusScore;
      catalogVerified = catalog.verified;
      catalogSize = catalog.estimatedCatalogSize;
    } catch {
      // unknown catalog stays allowed
    }

    const resolved = await resolveHeroProducts({
      domain: entry.domain,
      landingUrls: entry.landingUrls,
      adProducts: entry.adProducts,
      keyword: entry.keywords[0] ?? null,
      keywords: entry.keywords,
      timeoutMs: crawlTimeout,
      maxHeroes: 3,
    });

    let hero = resolved.heroes[0] ?? null;
    let heroUrl = hero?.url ?? null;
    let heroSource: ReturnType<typeof buildHeroTargetRecord>["heroResolutionSource"] =
      hero?.source ?? "unknown";

    if (!heroUrl || !isUsableHeroUrl(heroUrl, entry.domain)) {
      const flagship = await resolveFlagshipProduct(entry.domain, crawlTimeout, hero?.title ?? null);
      if (flagship) {
        heroUrl = flagship.url;
        hero = {
          title: flagship.title,
          url: flagship.url,
          brand: null,
          price: flagship.price,
          currency: "EUR",
          heroScore: hero?.heroScore ?? 55,
          heroConfidence: hero?.heroConfidence ?? 0.5,
          evidence: ["catalog_flagship_fallback"],
          source: "landing_linked_product",
        };
        heroSource = "landing_linked_product";
      }
    }

    const heroTarget = buildHeroTargetRecord({
      hero,
      keywords: entry.keywords,
      resolutionSource: heroSource,
    });

    const scale = computeCompanyScaleFit({
      businessType,
      isEcommerce: entry.isEcommerce,
      retailerScaleScore: retailerScale,
      retailerBreadthScore: retailerBreadth,
      businessMaturityScore: maturity,
      internationalPresenceScore: null,
      estimatedCatalogSize: catalogSize,
      homepageProductLinks: homepageProductLinks,
      ownBrandSignal: ownBrand,
    });

    const deepDive = computeDeepDivePdpFitProxy({
      archetypeId: entry.archetypeId,
      catalogFocusScore: catalogFocus ?? 50,
      heroScore: hero?.heroScore ?? null,
    });

    const fit = computeHighTicketFocusedFit({
      domain: entry.domain,
      businessType,
      prospectClass: entry.prospectClass,
      estimatedCatalogSize: catalogSize,
      catalogFocusScore: catalogFocus,
      catalogVerified,
      ownBrandSignal: ownBrand,
      companyScaleFitScore: scale.companyScaleFitScore,
      assetReadinessProxy: resolved.assetReadinessProxy,
      deepDivePdpFitProxy: deepDive,
      pdpWeaknessProxy: resolved.pdpWeaknessScore,
      heroScore: hero?.heroScore ?? null,
      heroPrice: hero?.price ?? null,
      adKeywordCount: entry.keywords.length,
      retailerBreadthScore: retailerBreadth,
      businessMaturityScore: maturity,
    });

    const poolEntry: WideScreenPoolEntry = {
      domain: entry.domain,
      businessType,
      isEcommerce: entry.isEcommerce,
      prospectClass: entry.prospectClass,
      retailerScaleScore: retailerScale,
      businessMaturityScore: maturity,
      ownBrandSignal: ownBrand,
      catalogVerified,
      estimatedCatalogSize: catalogSize,
      catalogFocusScore: catalogFocus,
      highTicketFitScore: fit.highTicketFocusedFitScore,
      heroPrice: hero?.price ?? null,
      heroProductUrl: heroUrl,
      adKeywordCount: entry.keywords.length,
      platform,
    };

    const hard = evaluateHardExclusion(poolEntry);
    const oldEconomicPass = passesOldEconomicPrescreen(poolEntry);

    let visualGap: number | null = null;
    let purchaseGap: number | null = null;
    let mobileGap: number | null = null;
    let contentAvailable: number | null = null;
    let contentPresentation: number | null = null;
    let rawGap: number | null = null;
    let visionScreened = false;

    if (!hard.excluded && heroUrl) {
      const crawl = await crawlWebsite(heroUrl, crawlTimeout);
      if (crawl.status === "success" && crawl.html.length > 200) {
        const html = crawl.html;
        const contentSignals = extractContentPresentationSignals(html);
        const contentGap = computeContentPresentationGap(contentSignals);
        contentAvailable = contentGap.contentAvailableScore;
        contentPresentation = contentGap.contentPresentationQuality;

        const purchaseSignals = extractPurchaseGapSignals(html);
        const purchase = computePreauditPurchaseGap({ html, ...purchaseSignals });
        purchaseGap = purchase.score;

        const weakness = computeCurrentPdpWeaknessProxy(
          pdpWeaknessSignalsFromHtml(html, heroUrl, platform)
        );

        const ceiling = estimateContrastCeiling({
          pdpWeaknessProxy: weakness.score,
          assetReadinessProxy: resolved.assetReadinessProxy,
          deepDivePdpFitProxy: deepDive,
          ownBrandSignal: ownBrand,
          heroPrice: hero?.price ?? null,
        });

        const visual = computePreauditVisualGap({
          html,
          url: heroUrl,
          platform,
          bodyTextLength: contentSignals.bodyTextLength,
          imageCount: contentSignals.imageCount,
          sectionCount: countDomSections(html),
          pdpWeaknessProxy: weakness.score,
          estimatedContrastCeiling: ceiling.estimatedContrastCeiling,
        });
        visualGap = visual.score;
        mobileGap = Math.max(
          0,
          Math.min(
            100,
            Math.round(purchaseGap * 0.55 + 18 + (purchaseSignals.mobileAtcSignal ? 0 : 12))
          )
        );

        rawGap = computeRawDesignGapOpportunity({
          preauditVisualGap: visualGap,
          preauditPurchaseGap: purchaseGap,
          mobileGapProxy: mobileGap,
          contentPresentationQuality: contentPresentation,
        }).score;
      }
    }

    const v2 = computePreviewCasePotentialV2({
      rawDesignGapOpportunity: rawGap,
      preauditVisualGap: visualGap,
      preauditPurchaseGap: purchaseGap,
      highTicketFocusedFit: fit.highTicketFocusedFitScore,
      companyScaleFit: scale.companyScaleFitScore,
      businessMaturity: maturity,
      catalogFocusScore: catalogFocus,
      catalogVerified,
      estimatedCatalogSize: catalogSize,
      ownBrandSignal: ownBrand,
      heroPrice: hero?.price ?? null,
      heroPriceConfidence: heroTarget.heroPriceConfidence,
      assetReadinessProxy: resolved.assetReadinessProxy,
      contentAvailableScore: contentAvailable,
      adKeywordCount: entry.keywords.length,
      businessType,
    });

    enriched.push({
      domain: entry.domain,
      homepage: `https://${entry.domain}`,
      productFamily: entry.familyLabel,
      familyId: entry.familyId,
      branchLabel: ARCHETYPE_BY_ID.get(entry.archetypeId)?.label ?? entry.archetypeId,
      discoveryRoute: entry.discoveryRoute,
      discoverySource: entry.discoverySource,
      sourceQuery: entry.sourceQuery,
      platform,
      commerceModel:
        (ownBrand ?? 0) >= 72
          ? "DTC_OWN_BRAND"
          : (ownBrand ?? 0) >= 58
            ? "MOSTLY_OWN_BRAND"
            : (ownBrand ?? 0) >= 45
              ? "MIXED"
              : "SPECIALIST_RESELLER",
      companyScaleFit: scale.companyScaleFitScore,
      catalogEstimate: catalogSize,
      catalogEstimateConfidence: catalogVerified ? "MEDIUM" : "UNKNOWN",
      catalogFocus: catalogFocus,
      catalogFocusConfidence: catalogVerified ? "MEDIUM" : "UNKNOWN",
      ownBrand: ownBrand,
      ownBrandConfidence:
        ownBrand != null ? (ownBrand >= 65 ? "HIGH" : ownBrand >= 45 ? "MEDIUM" : "LOW") : "UNKNOWN",
      maturity: maturity,
      maturityConfidence: maturity != null ? "MEDIUM" : "UNKNOWN",
      heroTarget,
      adsShoppingEvidence: { keywords: entry.keywords, landingUrls: entry.landingUrls.slice(0, 3) },
      contentAvailable,
      contentPresentation,
      preauditVisualGap: visualGap,
      visualGapBand: gapScoreBand(visualGap),
      preauditPurchaseGap: purchaseGap,
      purchaseGapBand: gapScoreBand(purchaseGap),
      mobileGap,
      rawDesignGapOpportunity: rawGap,
      economicFit: v2.economicFitScore,
      previewCasePotentialV2: v2.previewCasePotentialV2,
      overallConfidence: v2.overallConfidence,
      oldEconomicPrescreenPass: oldEconomicPass,
      wideScreenSelected: false,
      visionScreened,
      hardExcluded: hard.excluded,
      hardExclusionReason: hard.reason,
      designGapRank: null,
      economicFitRank: null,
      combinedRank: null,
      screenshots: null,
    });
  }

  const hardEligible = enriched.filter((c) => !c.hardExcluded);
  const softRanked = [...hardEligible]
    .sort((a, b) => softWideScreenRank({
      domain: a.domain,
      businessType: null,
      isEcommerce: null,
      prospectClass: "",
      retailerScaleScore: null,
      businessMaturityScore: a.maturity,
      ownBrandSignal: a.ownBrand,
      catalogVerified: a.catalogEstimateConfidence !== "UNKNOWN",
      estimatedCatalogSize: a.catalogEstimate,
      catalogFocusScore: a.catalogFocus,
      highTicketFitScore: a.economicFit,
      heroPrice: a.heroTarget.heroPrice,
      heroProductUrl: a.heroTarget.heroProductUrl,
      adKeywordCount: a.adsShoppingEvidence.keywords.length,
      platform: a.platform,
    }) - softWideScreenRank({
      domain: b.domain,
      businessType: null,
      isEcommerce: null,
      prospectClass: "",
      retailerScaleScore: null,
      businessMaturityScore: b.maturity,
      ownBrandSignal: b.ownBrand,
      catalogVerified: b.catalogEstimateConfidence !== "UNKNOWN",
      estimatedCatalogSize: b.catalogEstimate,
      catalogFocusScore: b.catalogFocus,
      highTicketFitScore: b.economicFit,
      heroPrice: b.heroTarget.heroPrice,
      heroProductUrl: b.heroTarget.heroProductUrl,
      adKeywordCount: b.adsShoppingEvidence.keywords.length,
      platform: b.platform,
    }))
    .slice(0, M951_WIDE_SCREEN.maxViewportScreens);

  for (const candidate of softRanked) {
    candidate.wideScreenSelected = true;
    const heroUrl = candidate.heroTarget.heroProductUrl;
    if (!heroUrl) continue;

    const paths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: M951_WIDE_SCREEN.screenshotTimeoutMs,
      shots: [
        { key: "pdp-desktop-1440x1000", url: heroUrl, viewport: M951_WIDE_SCREEN.desktop },
        { key: "pdp-mobile-390x844", url: heroUrl, viewport: M951_WIDE_SCREEN.mobile },
      ],
    });
    candidate.screenshots = paths;

    if (
      visionScreens < M951_WIDE_SCREEN.maxVisionScreens &&
      canSpend(anthropicBudget, 0.01) &&
      paths["pdp-desktop-1440x1000"]
    ) {
      const vision = await screenPdpViewportWithVision(
        env,
        candidate.domain,
        paths["pdp-desktop-1440x1000"]
      );
      anthropicBudget.spent += vision.estimatedCost;
      visionScreens += 1;
      candidate.visionScreened = true;
      if (candidate.preauditVisualGap != null) {
        candidate.preauditVisualGap = Math.max(
          0,
          Math.min(100, candidate.preauditVisualGap + vision.visualAdjustment)
        );
      }
      if (candidate.preauditPurchaseGap != null) {
        candidate.preauditPurchaseGap = Math.max(
          0,
          Math.min(100, candidate.preauditPurchaseGap + vision.purchaseAdjustment)
        );
      }
      if (candidate.mobileGap != null) {
        candidate.mobileGap = Math.max(
          0,
          Math.min(100, candidate.mobileGap + vision.mobileAdjustment)
        );
      }
      if (vision.presentationQuality != null) {
        candidate.contentPresentation = vision.presentationQuality;
      }
      candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
      candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
      candidate.rawDesignGapOpportunity = computeRawDesignGapOpportunity({
        preauditVisualGap: candidate.preauditVisualGap,
        preauditPurchaseGap: candidate.preauditPurchaseGap,
        mobileGapProxy: candidate.mobileGap,
        contentPresentationQuality: candidate.contentPresentation,
      }).score;
      const v2 = computePreviewCasePotentialV2({
        rawDesignGapOpportunity: candidate.rawDesignGapOpportunity,
        preauditVisualGap: candidate.preauditVisualGap,
        preauditPurchaseGap: candidate.preauditPurchaseGap,
        highTicketFocusedFit: candidate.economicFit,
        companyScaleFit: candidate.companyScaleFit,
        businessMaturity: candidate.maturity,
        catalogFocusScore: candidate.catalogFocus,
        catalogVerified: candidate.catalogEstimateConfidence !== "UNKNOWN",
        estimatedCatalogSize: candidate.catalogEstimate,
        ownBrandSignal: candidate.ownBrand,
        heroPrice: candidate.heroTarget.heroPrice,
        heroPriceConfidence: candidate.heroTarget.heroPriceConfidence,
        assetReadinessProxy: null,
        contentAvailableScore: candidate.contentAvailable,
        adKeywordCount: candidate.adsShoppingEvidence.keywords.length,
        businessType: null,
      });
      candidate.previewCasePotentialV2 = v2.previewCasePotentialV2;
      candidate.economicFit = v2.economicFitScore;
      candidate.overallConfidence = v2.overallConfidence;
    }
  }

  const screened = enriched.filter((c) => c.wideScreenSelected);
  const designGapSorted = [...screened]
    .sort((a, b) => (b.rawDesignGapOpportunity ?? 0) - (a.rawDesignGapOpportunity ?? 0));
  const economicSorted = [...screened].sort((a, b) => (b.economicFit ?? 0) - (a.economicFit ?? 0));
  const combinedSorted = [...screened].sort(
    (a, b) => (b.previewCasePotentialV2 ?? 0) - (a.previewCasePotentialV2 ?? 0)
  );

  designGapSorted.forEach((c, i) => (c.designGapRank = i + 1));
  economicSorted.forEach((c, i) => (c.economicFitRank = i + 1));
  combinedSorted.forEach((c, i) => (c.combinedRank = i + 1));

  const falseNegatives = screened
    .filter(
      (c) =>
        !c.oldEconomicPrescreenPass &&
        (c.visualGapBand === "HIGH" ||
          c.visualGapBand === "VERY_HIGH" ||
          c.purchaseGapBand === "HIGH" ||
          c.purchaseGapBand === "VERY_HIGH")
    )
    .map((c) => ({
      domain: c.domain,
      visualGap: c.preauditVisualGap,
      visualGapBand: c.visualGapBand,
      purchaseGap: c.preauditPurchaseGap,
      purchaseGapBand: c.purchaseGapBand,
      oldGateMissReason: explainOldGateMiss(c),
      heroTitle: c.heroTarget.heroTitle,
      heroPrice: c.heroTarget.heroPrice,
    }));

  const combinedTop10 = combinedSorted.slice(0, M951_WIDE_SCREEN.combinedTopN);
  const designGapTop10 = designGapSorted.slice(0, M951_WIDE_SCREEN.designGapTopN);

  for (const candidate of combinedTop10) {
    if (candidate.screenshots?.["pdp-desktop-1440x1000"]) continue;
    const heroUrl = candidate.heroTarget.heroProductUrl;
    if (!heroUrl) continue;
    const paths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: M951_WIDE_SCREEN.screenshotTimeoutMs,
      shots: [
        { key: "pdp-desktop-1440x1000", url: heroUrl, viewport: M951_WIDE_SCREEN.desktop },
        { key: "pdp-mobile-390x844", url: heroUrl, viewport: M951_WIDE_SCREEN.mobile },
      ],
    });
    candidate.screenshots = { ...candidate.screenshots, ...paths };
  }

  const report = {
    milestone: M951_WIDE_SCREEN.milestone,
    version: M951_DISCOVERY_VERSION,
    sourceRunId,
    runId: run.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    dataConsistency: {
      cases: consistency.cases.filter((c) => c.assessment !== "consistent"),
      vitalwaveNote: consistency.vitalwaveNote,
      assessment:
        consistency.cases.find((c) => c.domain === "vitalwave.nl")?.likelyCause ??
        "no vitalwave overlap",
    },
    funnel: {
      m95_prospect_eligible: m95Report.funnel?.prospect_eligible ?? prospectEligible.length,
      m95_economic_prequalified: m95Report.funnel?.economic_prequalified ?? null,
      m95_design_gap_screened: m95Report.funnel?.design_gap_screened ?? null,
      m951_pool_loaded: pool.length,
      m951_prospect_eligible: prospectEligible.length,
      m951_hard_eligible: hardEligible.length,
      m951_wide_screened: screened.length,
    },
    falseNegatives,
    designGapTop10,
    combinedTop10,
    screenedCandidates: screened,
    allScored: enriched,
    brandFirstArchitecture: {
      version: BRAND_FIRST_DISCOVERY_VERSION,
      leadProfile: BRAND_FIRST_LEAD_PROFILE,
      pipelineStages: BRAND_FIRST_PIPELINE_STAGES,
      sourceAdapters: BRAND_FIRST_SOURCE_ADAPTERS,
      parked: BRAND_FIRST_PARKED,
      note: "Config only. No paid brand-first discovery executed in M9.5.1.",
    },
    cost: {
      dataForSeo: 0,
      anthropic: Math.round(anthropicBudget.spent * 10000) / 10000,
      anthropicCap: anthropicBudget.cap,
      visionScreens,
    },
    downstream: { croAudits: 0, previews: 0, outreach: 0 },
  };

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  const serialized = JSON.stringify(report, null, 2);
  await writeFile(REPORT_PATH, serialized, "utf8");
  await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
  await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");

  await completeRun(supabase, run.id, "completed", {
    screened: screened.length,
    anthropicCost: anthropicBudget.spent,
  });

  printReport(report);
}

function explainOldGateMiss(candidate: ScreenedCandidate): string {
  const reasons: string[] = [];
  if ((candidate.economicFit ?? 0) < 52) reasons.push("high_ticket_fit_below_52");
  if ((candidate.ownBrand ?? 0) < 42) reasons.push("own_brand_below_42");
  const price = candidate.heroTarget.heroPrice ?? 0;
  if (price > 0 && price < 60) reasons.push("hero_price_below_60");
  if (candidate.catalogEstimateConfidence === "UNKNOWN") reasons.push("catalog_unknown_not_fail_but_ranked_down");
  return reasons.join(" · ") || "old_gate_rules";
}

function printReport(report: Record<string, unknown>): void {
  const funnel = report.funnel as Record<string, number>;
  console.log("\n=== DATA CONSISTENCY ===");
  console.log(`  ${(report.dataConsistency as { vitalwaveNote: string }).vitalwaveNote}`);

  console.log("\n=== OLD FUNNEL VS NEW WIDE SCREEN ===");
  for (const [k, v] of Object.entries(funnel)) console.log(`  ${k.padEnd(28)} ${v}`);

  console.log("\n=== FALSE NEGATIVES (old economic gate miss + high gap) ===");
  for (const row of (report.falseNegatives as Array<Record<string, unknown>>) ?? []) {
    console.log(
      `  ${row.domain} · visual ${row.visualGap} (${row.visualGapBand}) · purchase ${row.purchaseGap} (${row.purchaseGapBand})`
    );
    console.log(`     miss: ${row.oldGateMissReason}`);
  }

  console.log("\n=== COMBINED TOP 10 ===");
  for (const c of (report.combinedTop10 as ScreenedCandidate[]) ?? []) {
    console.log(
      `\n  #${c.combinedRank} ${c.domain} · preview v2 ${c.previewCasePotentialV2} · raw gap ${c.rawDesignGapOpportunity}`
    );
    console.log(
      `     design rank #${c.designGapRank} · economic rank #${c.economicFitRank} · visual ${c.preauditVisualGap} (${c.visualGapBand})`
    );
    console.log(`     hero: ${c.heroTarget.heroTitle} · €${c.heroTarget.heroPrice ?? "?"} · ${c.heroTarget.heroProductUrl}`);
    for (const [key, path] of Object.entries(c.screenshots ?? {})) {
      console.log(`     ${key}: ${path}`);
    }
  }

  const cost = report.cost as { anthropic: number; anthropicCap: number; visionScreens: number };
  console.log("\n=== COST ===");
  console.log(
    `  DataForSEO $0 · Anthropic $${cost.anthropic.toFixed(4)} / $${cost.anthropicCap.toFixed(3)} (${cost.visionScreens} vision)`
  );
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runDesignGapWideScreen.js")
  : false;

if (invokedDirectly) {
  runDesignGapWideScreen()
    .then(async () => {
      await closeCrawlerBrowser();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(error);
      await closeCrawlerBrowser().catch(() => undefined);
      process.exit(1);
    });
}
