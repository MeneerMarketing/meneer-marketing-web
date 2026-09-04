/**
 * Milestone 9.8 — PDP-GAP-FIRST ECOMMERCE HARVEST.
 *
 * Pipeline: harvest PDP URLs → cheap gap screen → high-gap shortlist → business qual → paid last.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds } from "../services/dataforseo/googleSerp.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  buildM98HarvestQueries,
  M98_DISCOVERY,
  M98_DISCOVERY_ROUTE,
  M98_DISCOVERY_VERSION,
  type PdpHarvestSourceType,
} from "../config/pdpGapFirstHarvest.js";
import { gapScoreBand } from "../config/designGapWideScreen.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import { detectPurchaseMode } from "../services/prospect/purchaseModeDetector.js";
import type { PurchaseMode } from "../config/brandFirstBalancedCalibration.js";
import { validatePaidAcquisition } from "../services/prospect/paidAcquisitionValidation.js";
import { buildDiscoveryHookComparison } from "../services/prospect/discoveryHookComparison.js";
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
import { screenPdpViewportWithVision } from "../services/prospect/preauditVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { buildHeroTargetRecord } from "../services/prospect/heroTargetMetadata.js";
import { serpPositionBand, type SerpPositionBand } from "../services/prospect/serpPositionBand.js";
import {
  evaluatePdpHarvestEarlyReject,
  validatePdpFromCrawl,
  scorePdpUrlPlausibility,
  classifyHarvestSourceType,
} from "../services/prospect/pdpCandidateGate.js";
import {
  computeAssetQualityProxy,
  computeBrandDistinctivenessProxy,
  computeRawPdpRedesignOpportunity,
} from "../services/prospect/rawPdpRedesignOpportunity.js";
import {
  computeBusinessEconomicFit,
  computeMaterialQualityScore,
  computeGapFirstSalesPotential,
  manualReviewVerdictM98,
} from "../services/prospect/gapFirstSalesPotential.js";
import type { ProductArchetypeId } from "../config/idealProductArchetypes.js";
import type { PaidAcquisitionLevel } from "../config/brandFirstHighTicket.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/pdp-gap-first-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/pdp-gap-first-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, M98_DISCOVERY.screenshotDir);

type Budget = { spent: number; cap: number };

function maturityProxy(light: Awaited<ReturnType<typeof runLightBrandCheck>>): number {
  return Math.round(
    light.ecommerceConfidence * 0.35 +
      light.platformConfidence * 0.15 +
      light.ownBrandSignal * 0.25 +
      (100 - Math.min(light.retailerScaleScore, 85)) * 0.25
  );
}

function canSpend(budget: Budget, est: number): boolean {
  return budget.spent + est <= budget.cap + 1e-9;
}

function normalizeProductUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    let path = parsed.pathname.replace(/\/+$/, "");
    if (!path) path = "/";
    return `${parsed.origin}${path}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function screenPriority(input: {
  serpPositionBand: SerpPositionBand;
  observedPrice: number | null;
  urlPlausibility: number;
}): number {
  let score = input.urlPlausibility;
  if (input.serpPositionBand === "21_50") score += 14;
  else if (input.serpPositionBand === "11_20") score += 10;
  else if (input.serpPositionBand === "51_PLUS") score += 8;
  const price = input.observedPrice;
  if (price != null) {
    if (price >= M98_DISCOVERY.priceSweetSpotMin && price <= M98_DISCOVERY.priceSweetSpotMax) {
      score += 16;
    } else if (price >= M98_DISCOVERY.minPriceSoftFilter) {
      score += 8;
    } else if (price < 50) {
      score -= 12;
    }
  }
  return score;
}

interface PdpCandidate {
  candidateKey: string;
  domain: string;
  productUrl: string;
  sourceQuery: string;
  sourceType: PdpHarvestSourceType;
  serpPosition: number | null;
  serpPositionBand: SerpPositionBand;
  productFamilyId: string;
  productFamilyLabel: string;
  archetypeId: ProductArchetypeId;
  productTitle: string | null;
  observedPrice: number | null;
  earlyRejectReason: string | null;
  validPdp: boolean;
  validPdpEvidence: string[];
  screened: boolean;
  platform: string | null;
  businessType: string | null;
  firstPartyConfidence: number | null;
  brandScaleFit: number | null;
  businessMaturityScore: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  catalogVerified: boolean;
  ownBrand: number | null;
  purchaseMode: PurchaseMode;
  heroTarget: ReturnType<typeof buildHeroTargetRecord>;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentAvailable: number | null;
  contentPresentation: number | null;
  assetQualityProxy: number | null;
  brandDistinctivenessProxy: number | null;
  visualGapBand: string;
  purchaseGapBand: string;
  rawPdpRedesignOpportunity: number | null;
  materialSweetSpot: boolean;
  materialQualityScore: number | null;
  businessEconomicFit: number | null;
  gapFirstSalesPotential: number | null;
  opportunityConfidence: string;
  sweetSpotProfile: string;
  businessQualified: boolean;
  paidAcquisition: PaidAcquisitionLevel;
  paidEvidence: string[];
  manualReviewVerdict: string;
  manualReview: Record<string, string> | null;
  screenshots: Record<string, string> | null;
  rank: number | null;
  cachedHtml: string | null;
}

export async function runPdpGapFirstHarvest(options?: { dryRun?: boolean }): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);
  const dfsBudget: Budget = { spent: 0, cap: env.M98_MAX_DATAFORSEO_COST };
  const anthropicBudget: Budget = { spent: 0, cap: env.M98_MAX_ANTHROPIC_COST };
  const serpOptions = { client: dataForSeo, env };
  const startedAt = new Date().toISOString();
  const crawlTimeout = M98_DISCOVERY.crawlTimeoutMs;

  const queries = buildM98HarvestQueries();

  console.log(`\n=== M9.8 PDP-GAP-FIRST HARVEST (${M98_DISCOVERY_VERSION}) ===`);
  console.log(`Route: ${M98_DISCOVERY_ROUTE}`);

  if (options?.dryRun) {
    for (const q of queries) console.log(`  ${q.familyId}: ${q.query}`);
    return;
  }

  const run = await createRun(supabase, "pdp_gap_first_harvest", {
    milestone: M98_DISCOVERY.milestone,
    version: M98_DISCOVERY_VERSION,
    route: M98_DISCOVERY_ROUTE,
    queries: queries.map((q) => q.query),
  });

  const candidateMap = new Map<string, PdpCandidate>();
  const earlyRejectCounts: Record<string, number> = {};
  let queriesExecuted = 0;
  const positionBandHarvest: Record<string, number> = {};

  const makeCandidate = (
    entry: typeof queries[number],
    input: {
      domain: string;
      productUrl: string;
      sourceType: PdpHarvestSourceType;
      serpPosition: number | null;
      title: string | null;
      observedPrice: number | null;
    }
  ): void => {
    const key = normalizeProductUrl(input.productUrl);
    if (candidateMap.has(key)) return;
    if (candidateMap.size >= M98_DISCOVERY.maxRawCandidates) return;

    const early = evaluatePdpHarvestEarlyReject({
      normalizedDomain: input.domain,
      productUrl: input.productUrl,
      title: input.title,
    });
    if (early.rejected) {
      const reason = early.reason ?? "rejected";
      earlyRejectCounts[reason] = (earlyRejectCounts[reason] ?? 0) + 1;
      return;
    }

    const band = serpPositionBand(input.serpPosition);
    positionBandHarvest[band] = (positionBandHarvest[band] ?? 0) + 1;

    candidateMap.set(key, {
      candidateKey: key,
      domain: input.domain,
      productUrl: input.productUrl,
      sourceQuery: entry.query,
      sourceType: input.sourceType,
      serpPosition: input.serpPosition,
      serpPositionBand: band,
      productFamilyId: entry.familyId,
      productFamilyLabel: entry.familyLabel,
      archetypeId: entry.archetypeId as ProductArchetypeId,
      productTitle: input.title,
      observedPrice: input.observedPrice,
      earlyRejectReason: null,
      validPdp: false,
      validPdpEvidence: [],
      screened: false,
      platform: null,
      businessType: null,
      firstPartyConfidence: null,
      brandScaleFit: null,
      businessMaturityScore: null,
      catalogEstimate: null,
      catalogFocus: null,
      catalogVerified: false,
      ownBrand: null,
      purchaseMode: "UNKNOWN",
      heroTarget: buildHeroTargetRecord({ hero: null, keywords: [entry.query] }),
      assetContentAvailability: null,
      preauditVisualGap: null,
      preauditPurchaseGap: null,
      mobileGap: null,
      contentAvailable: null,
      contentPresentation: null,
      assetQualityProxy: null,
      brandDistinctivenessProxy: null,
      visualGapBand: "LOW",
      purchaseGapBand: "LOW",
      rawPdpRedesignOpportunity: null,
      materialSweetSpot: false,
      materialQualityScore: null,
      businessEconomicFit: null,
      gapFirstSalesPotential: null,
      opportunityConfidence: "LOW",
      sweetSpotProfile: "MIXED",
      businessQualified: false,
      paidAcquisition: "UNKNOWN",
      paidEvidence: [],
      manualReviewVerdict: "NO_TARGET",
      manualReview: null,
      screenshots: null,
      rank: null,
      cachedHtml: null,
    });
  };

  console.log("\nStap 1 — raw PDP harvest (depth " + M98_DISCOVERY.serpDepth + ")");
  for (const entry of queries) {
    if (!canSpend(dfsBudget, M98_DISCOVERY.estimatedSerpCostPerKeyword)) break;

    let serp: Awaited<ReturnType<typeof fetchGooglePaidAds>>;
    try {
      serp = await fetchGooglePaidAds(serpOptions, entry.query, {
        depth: M98_DISCOVERY.serpDepth,
      });
      dfsBudget.spent += serp.cost;
      queriesExecuted += 1;
    } catch (error) {
      console.warn(`  SERP skip ${entry.query}: ${(error as Error).message}`);
      continue;
    }

    for (const organic of serp.organicResults) {
      if (!organic.url) continue;
      const sourceType = classifyHarvestSourceType({
        sourceType: "ORGANIC_PRODUCT_RESULT",
        likelyRetailer: organic.likelyRetailer,
      });
      makeCandidate(entry, {
        domain: organic.normalizedDomain,
        productUrl: organic.url,
        sourceType,
        serpPosition: organic.rank,
        title: organic.title,
        observedPrice: null,
      });
    }

    for (const ad of serp.paidAds) {
      if (!ad.landingUrl) continue;
      makeCandidate(entry, {
        domain: ad.normalizedDomain,
        productUrl: ad.landingUrl,
        sourceType: "SHOPPING_PRODUCT_RESULT",
        serpPosition: ad.rank,
        title: ad.headline,
        observedPrice: null,
      });
    }

    console.log(`  ${entry.familyId} · ${entry.query} · raw ${candidateMap.size}`);
  }

  console.log("\nStap 2 — valid PDP detection");
  const validCandidates: PdpCandidate[] = [];
  let invalidPdp = 0;

  for (const candidate of candidateMap.values()) {
    const crawl = await crawlWebsite(candidate.productUrl, crawlTimeout);
    if (crawl.status !== "success" || crawl.html.length < 200) {
      invalidPdp += 1;
      continue;
    }

    const validation = validatePdpFromCrawl({
      html: crawl.html,
      productUrl: candidate.productUrl,
      domain: candidate.domain,
    });

    if (!validation.valid) {
      invalidPdp += 1;
      continue;
    }

    candidate.validPdp = true;
    candidate.validPdpEvidence = validation.evidence;
    candidate.cachedHtml = crawl.html;
    candidate.productTitle = validation.productTitle ?? candidate.productTitle;
    if (validation.observedPrice != null) {
      candidate.observedPrice = validation.observedPrice;
    }

    if (
      candidate.observedPrice != null &&
      candidate.observedPrice < 35 &&
      scorePdpUrlPlausibility(candidate.productUrl, candidate.domain) < 80
    ) {
      invalidPdp += 1;
      candidate.validPdp = false;
      continue;
    }

    validCandidates.push(candidate);
  }

  const screenQueue = validCandidates
    .map((c) => ({
      candidate: c,
      priority: screenPriority({
        serpPositionBand: c.serpPositionBand,
        observedPrice: c.observedPrice,
        urlPlausibility: scorePdpUrlPlausibility(c.productUrl, c.domain),
      }),
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, M98_DISCOVERY.maxValidPdpScreens)
    .map((row) => row.candidate);

  console.log(`  valid PDPs: ${validCandidates.length} · screen queue: ${screenQueue.length}`);

  console.log("\nStap 3 — cheap design-gap screen");
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  let visionScreens = 0;

  for (let i = 0; i < screenQueue.length; i += 1) {
    const candidate = screenQueue[i];
    console.log(`  screen ${i + 1}/${screenQueue.length} · ${candidate.domain}`);

    let html = candidate.cachedHtml;
    if (!html || html.length < 200) {
      const crawl = await crawlWebsite(candidate.productUrl, crawlTimeout);
      if (crawl.status !== "success") continue;
      html = crawl.html;
      candidate.cachedHtml = html;
    }
    const contentSignals = extractContentPresentationSignals(html);
    const contentGap = computeContentPresentationGap(contentSignals);
    candidate.contentAvailable = contentGap.contentAvailableScore;
    candidate.contentPresentation = contentGap.contentPresentationQuality;

    const purchaseSignals = extractPurchaseGapSignals(html);
    const purchase = computePreauditPurchaseGap({ html, ...purchaseSignals });
    candidate.preauditPurchaseGap = purchase.score;
    candidate.mobileGap = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          purchase.score * 0.55 +
            18 +
            (purchaseSignals.mobileAtcSignal ? 0 : 12)
        )
      )
    );

    const visual = computePreauditVisualGap({
      html,
      url: candidate.productUrl,
      platform: candidate.platform,
      bodyTextLength: contentSignals.bodyTextLength,
      imageCount: contentSignals.imageCount,
      sectionCount: countDomSections(html),
      pdpWeaknessProxy: null,
      estimatedContrastCeiling: null,
    });
    candidate.preauditVisualGap = visual.score;
    candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
    candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);

    candidate.assetQualityProxy = computeAssetQualityProxy({
      imageCount: contentSignals.imageCount,
      videoPresent: contentSignals.videoPresent,
      featuresPresent: contentSignals.featuresPresent,
      faqPresent: contentSignals.faqPresent,
    });
    candidate.brandDistinctivenessProxy = computeBrandDistinctivenessProxy({
      styledBlocks: contentSignals.styledBlocks,
      listOnlyBlocks: contentSignals.listOnlyBlocks,
      contentPresentationQuality: candidate.contentPresentation,
    });

    const raw = computeRawPdpRedesignOpportunity({
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentAvailableScore: candidate.contentAvailable,
      contentPresentationQuality: candidate.contentPresentation,
      assetQualityProxy: candidate.assetQualityProxy,
      brandDistinctivenessProxy: candidate.brandDistinctivenessProxy,
    });
    candidate.rawPdpRedesignOpportunity = raw.score;
    candidate.materialSweetSpot = raw.materialSweetSpot;
    candidate.materialQualityScore = computeMaterialQualityScore({
      contentAvailableScore: candidate.contentAvailable,
      assetQualityProxy: candidate.assetQualityProxy,
      contentPresentationQuality: candidate.contentPresentation,
      materialSweetSpot: raw.materialSweetSpot,
    });
    candidate.screened = true;

    if (
      visionScreens < 8 &&
      canSpend(anthropicBudget, 0.009) &&
      (candidate.rawPdpRedesignOpportunity ?? 0) >= M98_DISCOVERY.highGapRawThreshold - 8
    ) {
      try {
        const quickPaths = await captureViewportScreenshots({
          outputDir: SCREENSHOT_DIR,
          domain: candidate.domain,
          timeoutMs: 20_000,
          shots: [
            {
              key: "pdp-desktop-1440x1000",
              url: candidate.productUrl,
              viewport: M98_DISCOVERY.desktop,
            },
          ],
        });
        if (quickPaths["pdp-desktop-1440x1000"]) {
          const vision = await screenPdpViewportWithVision(
            env,
            candidate.domain,
            quickPaths["pdp-desktop-1440x1000"]
          );
          anthropicBudget.spent += vision.estimatedCost;
          visionScreens += 1;
          candidate.preauditVisualGap = Math.max(
            0,
            Math.min(100, (candidate.preauditVisualGap ?? 0) + vision.visualAdjustment)
          );
          candidate.preauditPurchaseGap = Math.max(
            0,
            Math.min(100, (candidate.preauditPurchaseGap ?? 0) + vision.purchaseAdjustment)
          );
          if (vision.presentationQuality != null) {
            candidate.contentPresentation = vision.presentationQuality;
          }
          candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
          candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);

          const rawAfterVision = computeRawPdpRedesignOpportunity({
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            contentAvailableScore: candidate.contentAvailable,
            contentPresentationQuality: candidate.contentPresentation,
            assetQualityProxy: candidate.assetQualityProxy,
            brandDistinctivenessProxy: candidate.brandDistinctivenessProxy,
          });
          candidate.rawPdpRedesignOpportunity = rawAfterVision.score;
          candidate.materialSweetSpot = rawAfterVision.materialSweetSpot;
          candidate.materialQualityScore = computeMaterialQualityScore({
            contentAvailableScore: candidate.contentAvailable,
            assetQualityProxy: candidate.assetQualityProxy,
            contentPresentationQuality: candidate.contentPresentation,
            materialSweetSpot: rawAfterVision.materialSweetSpot,
          });
        }
      } catch (error) {
        console.warn(`  vision skip ${candidate.domain}: ${(error as Error).message}`);
      }
    }
  }

  const screened = screenQueue.filter((c) => c.screened);
  const highGapShortlist = screened
    .filter(
      (c) =>
        (c.rawPdpRedesignOpportunity ?? 0) >= M98_DISCOVERY.highGapRawThreshold ||
        (c.preauditVisualGap ?? 0) >= 45 ||
        (c.preauditPurchaseGap ?? 0) >= 45
    )
    .sort((a, b) => (b.rawPdpRedesignOpportunity ?? 0) - (a.rawPdpRedesignOpportunity ?? 0))
    .slice(0, M98_DISCOVERY.maxHighGapBusinessQual);

  console.log(
    `\nStap 4 — business qualification on ${highGapShortlist.length} high-gap PDPs`
  );

  let professionalEcommerce = 0;

  for (const candidate of highGapShortlist) {
    const light = await runLightBrandCheck(candidate.domain, crawlTimeout);
    candidate.platform = light.platform;
    candidate.businessType = light.businessType;
    candidate.businessMaturityScore = maturityProxy(light);
    candidate.ownBrand = light.ownBrandSignal;

    const catalog = await runCatalogFocusCheck(
      candidate.domain,
      crawlTimeout,
      light.productLinks,
      light.categoryLinks
    );
    candidate.catalogFocus = catalog.catalogFocusScore;
    candidate.catalogVerified = catalog.verified;
    candidate.catalogEstimate = catalog.estimatedCatalogSize;

    const fp = computeFirstPartyBrandConfidence({
      light,
      ownBrandSignal: light.ownBrandSignal,
      catalogFocusScore: catalog.catalogFocusScore,
      catalogVerified: catalog.verified,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      domain: candidate.domain,
    });
    candidate.firstPartyConfidence = fp.score;

    const scale = computeBrandScaleFit({
      businessType: light.businessType,
      isEcommerce: light.isEcommerce,
      retailerScaleScore: light.retailerScaleScore,
      retailerBreadthScore: light.retailerBreadthScore,
      businessMaturityScore: candidate.businessMaturityScore,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      homepageProductLinks: light.productLinks,
      ownBrandSignal: light.ownBrandSignal,
      firstPartyBrandConfidence: fp.score,
    });
    candidate.brandScaleFit = scale.brandScaleFitScore;

    const heroes = await resolveHeroProducts({
      domain: candidate.domain,
      landingUrls: [candidate.productUrl],
      adProducts: [],
      keyword: candidate.sourceQuery,
      keywords: [candidate.sourceQuery],
      timeoutMs: crawlTimeout,
      maxHeroes: 3,
    });
    candidate.assetContentAvailability = heroes.assetReadinessProxy;

    let hero = heroes.heroes.find((h) => isUsableHeroUrl(h.url, candidate.domain)) ?? null;
    let heroEvidence = hero?.evidence ?? [];

    if (
      !hero?.url &&
      isUsableHeroUrl(candidate.productUrl, candidate.domain)
    ) {
      hero = {
        title: candidate.productTitle ?? candidate.domain,
        url: candidate.productUrl,
        brand: null,
        price: candidate.observedPrice,
        currency: "EUR",
        heroScore: 62,
        heroConfidence: 65,
        evidence: ["discovered_pdp"],
        source: "landing_linked_product",
      };
      heroEvidence = ["discovered_pdp_prominence"];
    }

    if (!hero?.url) {
      const flagship = await resolveFlagshipProduct(
        candidate.domain,
        crawlTimeout,
        candidate.productTitle,
        [],
        [candidate.sourceQuery]
      );
      if (flagship && isUsableHeroUrl(flagship.url, candidate.domain)) {
        hero = {
          title: flagship.title,
          url: flagship.url,
          brand: null,
          price: flagship.price,
          currency: "EUR",
          heroScore: 58,
          heroConfidence: 58,
          evidence: ["flagship_fallback"],
          source: "landing_linked_product",
        };
        heroEvidence = ["flagship_fallback"];
      }
    }

    candidate.heroTarget = buildHeroTargetRecord({
      hero,
      keywords: [candidate.sourceQuery],
      heroSelectionEvidence: heroEvidence,
    });

    let purchaseMode: PurchaseMode = "UNKNOWN";
    const heroUrl = hero?.url ?? candidate.productUrl;
    const heroCrawl = await crawlWebsite(heroUrl, crawlTimeout);
    if (heroCrawl.status === "success") {
      const pm = detectPurchaseMode({
        html: heroCrawl.html,
        url: heroUrl,
        heroPrice: hero?.price ?? candidate.observedPrice,
        isEcommerce: light.isEcommerce,
      });
      purchaseMode = pm.purchaseMode;
    }
    candidate.purchaseMode = purchaseMode;

    const isProfessional =
      light.isEcommerce &&
      purchaseMode !== "LEAD_GENERATION" &&
      purchaseMode !== "SHOWROOM_ASSISTED" &&
      scale.brandScaleFitScore >= 35 &&
      (light.retailerScaleScore ?? 100) < 70;

    if (isProfessional) {
      professionalEcommerce += 1;
      candidate.businessQualified = true;
    }

    const heroPrice = candidate.heroTarget.heroPrice ?? candidate.observedPrice;
    let heroEconomics = 38;
    if (heroPrice != null) {
      if (heroPrice >= 150 && heroPrice <= 750) heroEconomics = 94;
      else if (heroPrice >= 120 && heroPrice <= 3000) heroEconomics = 76;
      else if (heroPrice >= 80) heroEconomics = 52;
    }

    const businessFit = computeBusinessEconomicFit({
      brandScaleFit: scale.brandScaleFitScore,
      firstPartyConfidence: fp.score,
      catalogFocusScore: catalog.catalogFocusScore,
      catalogVerified: catalog.verified,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      ownBrandSignal: light.ownBrandSignal,
      businessMaturityScore: candidate.businessMaturityScore,
      heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      purchaseMode,
      paidAcquisitionLevel: "UNKNOWN",
    });
    candidate.businessEconomicFit = businessFit.score;

    const gapFirst = computeGapFirstSalesPotential({
      rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity ?? 0,
      materialQualityScore: candidate.materialQualityScore ?? 0,
      businessEconomicFit: businessFit.score,
      heroEconomicsComponent: heroEconomics,
    });
    candidate.gapFirstSalesPotential = gapFirst.score;
    candidate.opportunityConfidence = gapFirst.confidence;
    candidate.sweetSpotProfile = gapFirst.profile;
    candidate.manualReviewVerdict = manualReviewVerdictM98({
      gapFirstSalesPotential: gapFirst.score,
      rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity ?? 0,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      materialQualityScore: candidate.materialQualityScore ?? 0,
      businessEconomicFit: businessFit.score,
      purchaseMode,
      profile: gapFirst.profile,
    });
  }

  console.log("\nStap 5 — paid validation (top " + M98_DISCOVERY.maxPaidValidation + ")");
  const paidPool = highGapShortlist
    .filter((c) => c.businessQualified)
    .sort((a, b) => (b.gapFirstSalesPotential ?? 0) - (a.gapFirstSalesPotential ?? 0))
    .slice(0, M98_DISCOVERY.maxPaidValidation);

  for (const candidate of paidPool) {
    if (!canSpend(dfsBudget, M98_DISCOVERY.estimatedSerpCostPerKeyword * 2)) break;
    const paid = await validatePaidAcquisition({
      domain: candidate.domain,
      brandName: candidate.productTitle ?? candidate.domain,
      productKeywords: [
        candidate.sourceQuery,
        candidate.heroTarget.heroTitle ?? candidate.productTitle ?? "",
      ].filter(Boolean),
      serpOptions,
      maxKeywords: M98_DISCOVERY.paidValidationKeywordsPerDomain,
    });
    dfsBudget.spent += paid.cost;
    candidate.paidAcquisition = paid.level;
    candidate.paidEvidence = paid.evidence;

    const businessFit = computeBusinessEconomicFit({
      brandScaleFit: candidate.brandScaleFit,
      firstPartyConfidence: candidate.firstPartyConfidence,
      catalogFocusScore: candidate.catalogFocus,
      catalogVerified: candidate.catalogVerified,
      estimatedCatalogSize: candidate.catalogEstimate,
      ownBrandSignal: candidate.ownBrand,
      businessMaturityScore: candidate.businessMaturityScore,
      heroPrice: candidate.heroTarget.heroPrice ?? candidate.observedPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      purchaseMode: candidate.purchaseMode,
      paidAcquisitionLevel: paid.level,
    });
    candidate.businessEconomicFit = businessFit.score;

    const heroPrice = candidate.heroTarget.heroPrice ?? candidate.observedPrice;
    let heroEconomics = 38;
    if (heroPrice != null) {
      if (heroPrice >= 150 && heroPrice <= 750) heroEconomics = 94;
      else if (heroPrice >= 120 && heroPrice <= 3000) heroEconomics = 76;
      else if (heroPrice >= 80) heroEconomics = 52;
    }

    const gapFirst = computeGapFirstSalesPotential({
      rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity ?? 0,
      materialQualityScore: candidate.materialQualityScore ?? 0,
      businessEconomicFit: businessFit.score,
      heroEconomicsComponent: heroEconomics,
    });
    candidate.gapFirstSalesPotential = gapFirst.score;
    candidate.opportunityConfidence = gapFirst.confidence;
    candidate.sweetSpotProfile = gapFirst.profile;
    candidate.manualReviewVerdict = manualReviewVerdictM98({
      gapFirstSalesPotential: gapFirst.score,
      rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity ?? 0,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      materialQualityScore: candidate.materialQualityScore ?? 0,
      businessEconomicFit: businessFit.score,
      purchaseMode: candidate.purchaseMode,
      profile: gapFirst.profile,
    });
  }

  const ranked = highGapShortlist
    .filter((c) => c.gapFirstSalesPotential != null)
    .sort((a, b) => (b.gapFirstSalesPotential ?? 0) - (a.gapFirstSalesPotential ?? 0));
  ranked.forEach((c, i) => (c.rank = i + 1));

  const top10 = ranked.slice(0, 10);
  const manualReviewList = ranked
    .filter((c) => c.manualReviewVerdict === "TRUE_MANUAL_REVIEW_CANDIDATE")
    .slice(0, M98_DISCOVERY.maxManualReview);

  for (const candidate of manualReviewList) {
    candidate.manualReview = {
      whyPdpDiscovered: `PDP gevonden via ${candidate.sourceType} op positie ${candidate.serpPosition ?? "?"} (${candidate.serpPositionBand}) voor query "${candidate.sourceQuery}".`,
      whatLooksUnderdesigned: `Visual gap ${candidate.preauditVisualGap}, purchase gap ${candidate.preauditPurchaseGap}, raw redesign ${candidate.rawPdpRedesignOpportunity}.`,
      whyBusinessInteresting: `Platform ${candidate.platform}, schaal ${candidate.brandScaleFit}, maturity ${candidate.businessMaturityScore}, catalog ${candidate.catalogEstimate}.`,
      whatMaterialExists: `Content available ${candidate.contentAvailable}, assets proxy ${candidate.assetQualityProxy}, presentation ${candidate.contentPresentation}.`,
      whyRedesignDramatic: `Material sweet spot ${candidate.materialSweetSpot ? "ja" : "nee"} · gap-first score ${candidate.gapFirstSalesPotential}.`,
    };

    const homePaths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: M98_DISCOVERY.screenshotTimeoutMs,
      shots: [
        {
          key: "homepage-desktop-1440x1000",
          url: `https://${candidate.domain}`,
          viewport: M98_DISCOVERY.desktop,
        },
        {
          key: "pdp-desktop-1440x1000",
          url: candidate.productUrl,
          viewport: M98_DISCOVERY.desktop,
        },
        {
          key: "pdp-mobile-390x844",
          url: candidate.productUrl,
          viewport: M98_DISCOVERY.mobile,
        },
      ],
    });
    candidate.screenshots = homePaths;
  }

  const sufficientMaterials = screened.filter(
    (c) =>
      (c.materialQualityScore ?? 0) >= M98_DISCOVERY.minSufficientMaterials ||
      c.materialSweetSpot
  ).length;

  const potentialTargets = ranked.filter(
    (c) =>
      c.manualReviewVerdict === "TRUE_MANUAL_REVIEW_CANDIDATE" ||
      c.manualReviewVerdict === "PROMISING"
  ).length;

  const hookComparison = await buildDiscoveryHookComparison(projectRoot);

  const report = {
    milestone: M98_DISCOVERY.milestone,
    version: M98_DISCOVERY_VERSION,
    discoveryRoute: M98_DISCOVERY_ROUTE,
    runId: run.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    sourceQueries: queries.map((q) => ({ familyId: q.familyId, query: q.query })),
    positionBandHarvest,
    earlyRejectCounts,
    rawPdpHarvest: {
      queries_executed: queriesExecuted,
      raw_candidates: candidateMap.size,
      valid_pdps: validCandidates.length,
      invalid_pdps: invalidPdp,
    },
    designGapFunnel: {
      valid_pdps: validCandidates.length,
      screened: screened.length,
      high_gap_shortlist: highGapShortlist.length,
      sufficient_materials: sufficientMaterials,
    },
    businessFunnel: {
      high_gap: highGapShortlist.length,
      professional_ecommerce_after_gap: professionalEcommerce,
      paid_validated: paidPool.length,
      gap_sales_verdict_promising: potentialTargets,
      true_manual_review: manualReviewList.length,
    },
    funnel: {
      source_queries_executed: queriesExecuted,
      raw_candidates: candidateMap.size,
      valid_pdps: validCandidates.length,
      valid_pdps_screened: screened.length,
      high_gap_shortlist: highGapShortlist.length,
      sufficient_materials: sufficientMaterials,
      business_qualified: professionalEcommerce,
      professional_ecommerce_after_gap: professionalEcommerce,
      paid_validated: paidPool.length,
      gap_sales_verdict_promising: potentialTargets,
      true_manual_review: manualReviewList.length,
    },
    hookComparison,
    top10: top10.map((c) => {
      const { cachedHtml: _drop, ...rest } = c;
      return rest;
    }),
    manualReview: manualReviewList.map((c) => {
      const { cachedHtml: _drop, ...rest } = c;
      return rest;
    }),
    allCandidates: [...candidateMap.values()].map((c) => {
      const { cachedHtml: _drop, ...rest } = c;
      return rest;
    }),
    cost: {
      dataForSeo: Math.round(dfsBudget.spent * 10000) / 10000,
      dataForSeoCap: dfsBudget.cap,
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
    validPdps: validCandidates.length,
    screened: screened.length,
    dataForSeoCost: dfsBudget.spent,
    anthropicCost: anthropicBudget.spent,
  });

  printReport(report);
}

function printReport(report: Record<string, unknown>): void {
  const funnel = report.funnel as Record<string, number>;
  console.log("\n=== FUNNEL ===");
  for (const [k, v] of Object.entries(funnel)) console.log(`  ${k.padEnd(32)} ${v}`);

  const cost = report.cost as { dataForSeo: number; anthropic: number };
  console.log(`\n=== COST === DataForSEO $${cost.dataForSeo.toFixed(4)} · Anthropic $${cost.anthropic.toFixed(4)}`);
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runPdpGapFirstHarvest.js")
  : false;

if (invokedDirectly) {
  runPdpGapFirstHarvest({ dryRun: process.argv.includes("--dry-run") })
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
