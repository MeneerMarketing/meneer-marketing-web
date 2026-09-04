/**
 * Milestone 9.8.2 — HIGH-TICKET PDP-GAP-FIRST production search.
 *
 * Pipeline: harvest → valid PRODUCT_DETAIL → price gate → cheap gap → showcase scoring → business qual → finalists.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds } from "../services/dataforseo/googleSerp.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  buildM982HarvestQueries,
  buildM983CompletionQueries,
  inferExecutedQueriesFromCount,
  M982_DISCOVERY,
  M983_DISCOVERY,
  M983_DISCOVERY_VERSION,
  HAIR_SCALP_M983_STATUS,
  M982_DISCOVERY_ROUTE,
  M982_DISCOVERY_VERSION,
  HIGH_TICKET_GAP_FIRST_TARGET_V1,
  M982_PARKED_FAMILIES,
  M982_PRODUCT_QUERIES,
  type M982ProductQuery,
} from "../config/highTicketPdpGapFirst.js";
import type { PdpHarvestSourceType } from "../config/pdpGapFirstHarvest.js";
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
} from "../services/prospect/gapFirstSalesPotential.js";
import { classifyPageEntity, classifyPageEntityFromUrl, type PageEntityType } from "../services/prospect/pageEntityClassifier.js";
import {
  classifyBusinessModel,
  type BusinessModelClass,
} from "../services/prospect/businessModelClassifier.js";
import {
  computeRedesignMaterialFeasibility,
  computeHeroCandidateScore,
} from "../services/prospect/validatedGapSalesFit.js";
import {
  computeShowcaseGapPotential,
  isHighGapCandidate,
} from "../services/prospect/showcaseGapPotential.js";
import {
  computeProductEconomicFit,
  computeHighTicketGapSalesFit,
  passesHighTicketFinalistGate,
  meetsEarlySuccessPartialCriteria,
  meetsEarlySuccessFinalistCriteria,
  isStrongFinalistForEarlyStop,
  evaluatePriceGate,
  inferPriceConfidence,
  type PriceConfidence,
} from "../services/prospect/highTicketGapSalesFit.js";
import { assessPriceConsistency } from "../services/prospect/priceConsistencyCheck.js";
import {
  classifyOpportunityTierLegacy,
  type OpportunityTier,
} from "../services/prospect/opportunityTierClassifier.js";
import type { ProductArchetypeId } from "../config/idealProductArchetypes.js";
import type { PaidAcquisitionLevel } from "../config/brandFirstHighTicket.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const M982_REPORT_PATH = resolve(projectRoot, "reports/high-ticket-pdp-gap-first-report.json");
const M983_REPORT_PATH = resolve(
  projectRoot,
  "reports/high-ticket-gap-completion-report.json"
);
const M982_DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/high-ticket-pdp-gap-first-report.json"
);
const M983_DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/high-ticket-gap-completion-report.json"
);

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
    if (price >= M982_DISCOVERY.priceSweetSpotMin && price <= M982_DISCOVERY.priceSweetSpotMax) {
      score += 20;
    } else if (price >= M982_DISCOVERY.priceSoftMin) {
      score += 12;
    } else if (price < M982_DISCOVERY.priceHardRejectBelow) {
      score -= 30;
    } else if (price < M982_DISCOVERY.priceSoftMin) {
      score -= 10;
    }
  }
  return score;
}

interface M982Candidate {
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
  productArchetype: string;
  expectedPriceBand: string;
  deepDiveRationale: string;
  queryLineage: string;
  productTitle: string | null;
  observedPrice: number | null;
  priceFromCrawl: boolean;
  priceConfidence: PriceConfidence;
  priceGateReason: string | null;
  earlyRejectReason: string | null;
  pageEntityType: PageEntityType;
  pageEntityRejectReason: string | null;
  pageEntityEvidence: string[];
  isValidProductDetail: boolean;
  validPdp: boolean;
  validPdpEvidence: string[];
  screened: boolean;
  businessQualified: boolean;
  businessModel: BusinessModelClass;
  businessModelSalesCandidate: boolean;
  businessModelRejectReason: string | null;
  platform: string | null;
  businessType: string | null;
  companyScaleFit: number | null;
  firstPartyConfidence: number | null;
  brandScaleFit: number | null;
  businessMaturityScore: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  catalogVerified: boolean;
  ownBrand: number | null;
  purchaseMode: PurchaseMode;
  heroTarget: ReturnType<typeof buildHeroTargetRecord>;
  heroCandidateScore: number | null;
  heroConfidence: number | null;
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
  redesignMaterialFeasibility: number | null;
  materialFeasibilityBand: string | null;
  showcaseGapPotential: number | null;
  showcaseReady: boolean;
  productEconomicFit: number | null;
  businessEconomicFit: number | null;
  highTicketGapSalesFit: number | null;
  highTicketConfidence: string;
  preAuditGatePass: boolean;
  preAuditGateFailures: string[];
  opportunityTier: OpportunityTier;
  opportunityTierReason: string;
  priceConflict: boolean;
  priceConflictReason: string | null;
  paidAcquisition: PaidAcquisitionLevel;
  paidEvidence: string[];
  manualReview: Record<string, string> | null;
  screenshots: Record<string, string> | null;
  rank: number | null;
  cachedHtml: string | null;
}

export async function runM982HighTicketPdpGapFirst(options?: {
  dryRun?: boolean;
  completionPass?: boolean;
}): Promise<void> {
  const completionPass = options?.completionPass ?? false;
  const discovery = completionPass ? M983_DISCOVERY : M982_DISCOVERY;
  const REPORT_PATH = completionPass ? M983_REPORT_PATH : M982_REPORT_PATH;
  const DASHBOARD_REPORT_PATH = completionPass
    ? M983_DASHBOARD_REPORT_PATH
    : M982_DASHBOARD_REPORT_PATH;
  const SCREENSHOT_DIR = resolve(projectRoot, discovery.screenshotDir);

  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);
  const dfsBudget: Budget = {
    spent: 0,
    cap: completionPass ? env.M983_MAX_DATAFORSEO_COST : env.M982_MAX_DATAFORSEO_COST,
  };
  const anthropicBudget: Budget = {
    spent: 0,
    cap: completionPass ? env.M983_MAX_ANTHROPIC_COST : env.M982_MAX_ANTHROPIC_COST,
  };
  const serpOptions = { client: dataForSeo, env };
  const startedAt = new Date().toISOString();
  const crawlTimeout = discovery.crawlTimeoutMs;

  let priorExecutedQueries: string[] = [];
  if (completionPass) {
    try {
      const priorRaw = JSON.parse(
        await readFile(M982_REPORT_PATH, "utf8")
      ) as {
        queryCoverage?: { executedQueries?: string[] };
        funnel?: { source_queries_executed?: number };
      };
      priorExecutedQueries =
        priorRaw.queryCoverage?.executedQueries ??
        inferExecutedQueriesFromCount(priorRaw.funnel?.source_queries_executed ?? 9);
    } catch {
      priorExecutedQueries = inferExecutedQueriesFromCount(9);
    }
  }

  const executedQuerySet = new Set(priorExecutedQueries);
  const queries = completionPass
    ? buildM983CompletionQueries(executedQuerySet)
    : buildM982HarvestQueries();
  const executedQueriesThisRun: string[] = [];
  const skippedQueries: Array<{ query: string; reason: string }> = [];

  const versionLabel = completionPass ? M983_DISCOVERY_VERSION : M982_DISCOVERY_VERSION;
  const milestoneLabel = discovery.milestone;

  console.log(
    `\n=== ${milestoneLabel} HIGH-TICKET PDP-GAP-FIRST (${versionLabel}) ===`
  );
  if (completionPass) {
    console.log(`Completion pass · skipping ${priorExecutedQueries.length} prior queries`);
    console.log(`Hair/scalp status: ${HAIR_SCALP_M983_STATUS}`);
  }
  console.log(`Target: ${HIGH_TICKET_GAP_FIRST_TARGET_V1}`);
  console.log(`Route: ${M982_DISCOVERY_ROUTE}`);
  console.log(`Parked: ${M982_PARKED_FAMILIES.join(", ")}`);

  if (options?.dryRun) {
    for (const q of queries) {
      console.log(`  ${q.familyId} · ${q.expectedPriceBand} · ${q.query}`);
    }
    return;
  }

  let hpltPriceRegression: Record<string, unknown> = { note: "not_run" };
  if (completionPass) {
    const hpltUrl = "https://www.hplt.nl/product/hplt-3-red-high-power-laser/";
    const hpltCrawl = await crawlWebsite(hpltUrl, crawlTimeout);
    if (hpltCrawl.status === "success") {
      const v = validatePdpFromCrawl({
        html: hpltCrawl.html,
        productUrl: hpltUrl,
        domain: "hplt.nl",
      });
      const pc = assessPriceConsistency({
        html: hpltCrawl.html,
        productUrl: hpltUrl,
        primaryPrice: v.observedPrice,
      });
      hpltPriceRegression = {
        url: hpltUrl,
        extractedPrice: v.observedPrice,
        canonicalPrice: pc.canonicalPrice,
        priceConfidence: pc.priceConfidence,
        conflict: pc.conflict,
        conflictReason: pc.conflictReason,
        sources: pc.sources,
      };
      console.log(
        `HPLT price regression: extracted=${v.observedPrice} canonical=${pc.canonicalPrice} confidence=${pc.priceConfidence}`
      );
    }
  }

  const run = await createRun(
    supabase,
    completionPass ? "high_ticket_gap_completion" : "high_ticket_pdp_gap_first",
    {
      milestone: discovery.milestone,
      version: versionLabel,
      route: M982_DISCOVERY_ROUTE,
      targetProfile: HIGH_TICKET_GAP_FIRST_TARGET_V1,
      completionPass,
      queries: queries.map((q) => q.query),
    }
  );

  const candidateMap = new Map<string, M982Candidate>();
  const earlyRejectCounts: Record<string, number> = {};
  let queriesExecuted = 0;
  const positionBandHarvest: Record<string, number> = {};

  let earlyStopTriggered = false;
  let earlySuccessPartialCount = 0;
  let earlySuccessFinalistCount = 0;

  const makeCandidate = (
    entry: M982ProductQuery,
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
    if (candidateMap.size >= discovery.maxRawCandidates) return;

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
      productArchetype: entry.productArchetype,
      expectedPriceBand: entry.expectedPriceBand,
      deepDiveRationale: entry.deepDiveRationale,
      queryLineage: entry.lineage,
      productTitle: input.title,
      observedPrice: input.observedPrice,
      priceFromCrawl: false,
      priceConfidence: "UNKNOWN",
      priceGateReason: null,
      earlyRejectReason: null,
      pageEntityType: "INVALID",
      pageEntityRejectReason: null,
      pageEntityEvidence: [],
      isValidProductDetail: false,
      validPdp: false,
      validPdpEvidence: [],
      screened: false,
      businessQualified: false,
      businessModel: "UNKNOWN",
      businessModelSalesCandidate: false,
      businessModelRejectReason: null,
      platform: null,
      businessType: null,
      companyScaleFit: null,
      firstPartyConfidence: null,
      brandScaleFit: null,
      businessMaturityScore: null,
      catalogEstimate: null,
      catalogFocus: null,
      catalogVerified: false,
      ownBrand: null,
      purchaseMode: "UNKNOWN",
      heroTarget: buildHeroTargetRecord({ hero: null, keywords: [entry.query] }),
      heroCandidateScore: null,
      heroConfidence: null,
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
      redesignMaterialFeasibility: null,
      materialFeasibilityBand: null,
      showcaseGapPotential: null,
      showcaseReady: false,
      productEconomicFit: null,
      businessEconomicFit: null,
      highTicketGapSalesFit: null,
      highTicketConfidence: "LOW",
      preAuditGatePass: false,
      preAuditGateFailures: [],
      opportunityTier: "NO_VALUE",
      opportunityTierReason: "unscreened",
      priceConflict: false,
      priceConflictReason: null,
      paidAcquisition: "UNKNOWN",
      paidEvidence: [],
      manualReview: null,
      screenshots: null,
      rank: null,
      cachedHtml: null,
    });
  };

  console.log("\nStap 1 — raw PDP harvest (depth " + discovery.serpDepth + ")");
  for (const entry of queries) {
    if (earlyStopTriggered) break;
    if (completionPass && executedQuerySet.has(entry.query)) {
      skippedQueries.push({ query: entry.query, reason: "already_executed_m982" });
      continue;
    }
    if (!canSpend(dfsBudget, discovery.estimatedSerpCostPerKeyword)) break;

    let serp: Awaited<ReturnType<typeof fetchGooglePaidAds>>;
    try {
      serp = await fetchGooglePaidAds(serpOptions, entry.query, {
        depth: discovery.serpDepth,
      });
      dfsBudget.spent += serp.cost;
      queriesExecuted += 1;
      executedQueriesThisRun.push(entry.query);
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

  console.log("\nStap 2 — valid PDP + entity + price gate");
  const validCandidates: M982Candidate[] = [];
  let invalidPdp = 0;
  let priceHardRejected = 0;
  const priceDistribution: Record<string, number> = {};

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

    const entity = classifyPageEntity({
      productUrl: candidate.productUrl,
      domain: candidate.domain,
      html: crawl.html,
      productTitle: validation.productTitle ?? candidate.productTitle,
      observedPrice: validation.observedPrice ?? candidate.observedPrice,
    });

    candidate.pageEntityType = entity.pageEntityType;
    candidate.pageEntityRejectReason = entity.rejectReason;
    candidate.pageEntityEvidence = entity.evidence;
    candidate.isValidProductDetail = entity.isValidProductDetail;

    if (!validation.valid || !entity.isValidProductDetail) {
      invalidPdp += 1;
      continue;
    }

    candidate.validPdp = true;
    candidate.validPdpEvidence = validation.evidence;
    candidate.cachedHtml = crawl.html;
    candidate.productTitle = validation.productTitle ?? candidate.productTitle;
    if (validation.observedPrice != null) {
      candidate.observedPrice = validation.observedPrice;
      candidate.priceFromCrawl = true;
    }

    const priceConsistency = assessPriceConsistency({
      html: crawl.html,
      productUrl: candidate.productUrl,
      primaryPrice: candidate.observedPrice,
    });
    if (priceConsistency.canonicalPrice != null) {
      candidate.observedPrice = priceConsistency.canonicalPrice;
      candidate.priceFromCrawl = true;
    }
    candidate.priceConfidence = priceConsistency.priceConfidence;
    candidate.priceConflict = priceConsistency.conflict;
    candidate.priceConflictReason = priceConsistency.conflictReason;

    candidate.priceConfidence = inferPriceConfidence({
      observedPrice: candidate.observedPrice,
      heroPrice: candidate.observedPrice,
      priceFromCrawl: candidate.priceFromCrawl,
    });
    if (priceConsistency.priceConfidence === "LOW") {
      candidate.priceConfidence = "LOW";
    }

    const priceGate = evaluatePriceGate({
      price: candidate.observedPrice,
      priceConfidence: candidate.priceConfidence,
    });
    candidate.priceGateReason = priceGate.reason;

    if (priceGate.hardReject) {
      priceHardRejected += 1;
      invalidPdp += 1;
      candidate.validPdp = false;
      continue;
    }

    const price = candidate.observedPrice;
    if (price == null) priceDistribution.UNKNOWN = (priceDistribution.UNKNOWN ?? 0) + 1;
    else if (price < 60) priceDistribution.UNDER_60 = (priceDistribution.UNDER_60 ?? 0) + 1;
    else if (price < 100) priceDistribution["60_99"] = (priceDistribution["60_99"] ?? 0) + 1;
    else if (price < 150) priceDistribution["100_149"] = (priceDistribution["100_149"] ?? 0) + 1;
    else if (price <= 750) priceDistribution["150_750"] = (priceDistribution["150_750"] ?? 0) + 1;
    else priceDistribution["750_PLUS"] = (priceDistribution["750_PLUS"] ?? 0) + 1;

    if (!priceGate.pass && priceGate.reason === "price_60_99_needs_exception") {
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
    .slice(0, discovery.maxValidPdpScreens)
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

    const showcase = computeShowcaseGapPotential({
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentAvailable: candidate.contentAvailable,
      contentPresentation: candidate.contentPresentation,
      assetQualityProxy: candidate.assetQualityProxy,
    });
    candidate.showcaseGapPotential = showcase.score;
    candidate.showcaseReady = showcase.showcaseReady;

    const materialFeas = computeRedesignMaterialFeasibility({
      contentAvailable: candidate.contentAvailable,
      contentPresentation: candidate.contentPresentation,
      assetQualityProxy: candidate.assetQualityProxy,
      materialSweetSpot: candidate.materialSweetSpot,
    });
    candidate.redesignMaterialFeasibility = materialFeas.score;
    candidate.materialFeasibilityBand = materialFeas.band;

    if (
      candidate.pageEntityType === "PRODUCT_DETAIL" &&
      visionScreens < discovery.maxVisionScreens &&
      canSpend(anthropicBudget, 0.009) &&
      isHighGapCandidate({
        preauditVisualGap: candidate.preauditVisualGap,
        preauditPurchaseGap: candidate.preauditPurchaseGap,
        mobileGap: candidate.mobileGap,
        rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity,
      })
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
              viewport: discovery.desktop,
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
          const showcaseAfter = computeShowcaseGapPotential({
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            contentAvailable: candidate.contentAvailable,
            contentPresentation: candidate.contentPresentation,
            assetQualityProxy: candidate.assetQualityProxy,
          });
          candidate.showcaseGapPotential = showcaseAfter.score;
          candidate.showcaseReady = showcaseAfter.showcaseReady;
          const feasAfter = computeRedesignMaterialFeasibility({
            contentAvailable: candidate.contentAvailable,
            contentPresentation: candidate.contentPresentation,
            assetQualityProxy: candidate.assetQualityProxy,
            materialSweetSpot: rawAfterVision.materialSweetSpot,
          });
          candidate.redesignMaterialFeasibility = feasAfter.score;
          candidate.materialFeasibilityBand = feasAfter.band;
        }
      } catch (error) {
        console.warn(`  vision skip ${candidate.domain}: ${(error as Error).message}`);
      }
    }
  }

  const screened = screenQueue.filter((c) => c.screened);
  const highGapShortlist = screened
    .filter((c) =>
      isHighGapCandidate({
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        rawPdpRedesignOpportunity: c.rawPdpRedesignOpportunity,
      })
    )
    .sort((a, b) => (b.showcaseGapPotential ?? 0) - (a.showcaseGapPotential ?? 0))
    .slice(0, discovery.maxHighGapBusinessQual);

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
    candidate.companyScaleFit = scale.brandScaleFitScore;

    const bizModel = classifyBusinessModel({
      domain: candidate.domain,
      ownBrandSignal: light.ownBrandSignal,
      catalogEstimate: catalog.estimatedCatalogSize,
      catalogFocus: catalog.catalogFocusScore,
      retailerScaleScore: light.retailerScaleScore,
      retailerBreadthScore: light.retailerBreadthScore,
      businessType: light.businessType,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      productUrl: candidate.productUrl,
      productTitle: candidate.productTitle,
    });
    candidate.businessModel = bizModel.businessModel;
    candidate.businessModelSalesCandidate = bizModel.salesCandidate;
    candidate.businessModelRejectReason = bizModel.rejectReason;

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
    candidate.priceConfidence = inferPriceConfidence({
      observedPrice: candidate.observedPrice,
      heroPrice,
      priceFromCrawl: candidate.priceFromCrawl,
    });

    const heroCand = computeHeroCandidateScore({
      heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      heroProductUrl: candidate.heroTarget.heroProductUrl,
      discoveredProductUrl: candidate.productUrl,
      isValidProductDetail: candidate.isValidProductDetail,
      assetContentAvailability: candidate.assetContentAvailability,
      productFamilyRelevance: true,
    });
    candidate.heroCandidateScore = heroCand.score;
    candidate.heroConfidence = heroCand.confidence;

    const productFit = computeProductEconomicFit({
      heroPrice,
      priceConfidence: candidate.priceConfidence,
      heroCandidateScore: heroCand.score,
      purchaseMode,
      productComplexityProxy: candidate.contentAvailable,
      assetContentAvailability: candidate.assetContentAvailability,
    });
    candidate.productEconomicFit = productFit.score;

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

    const htFit = computeHighTicketGapSalesFit({
      showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      productEconomicFit: productFit.score,
      businessEconomicFit: businessFit.score,
      businessModel: bizModel.businessModel,
      businessModelSalesCandidate: bizModel.salesCandidate,
      paidAcquisitionLevel: "UNKNOWN",
    });
    candidate.highTicketGapSalesFit = htFit.score;
    candidate.highTicketConfidence = htFit.confidence;

    const gate = passesHighTicketFinalistGate({
      pageEntityType: candidate.pageEntityType,
      heroPrice,
      priceConfidence: candidate.priceConfidence,
      showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      productEconomicFit: productFit.score,
      businessEconomicFit: businessFit.score,
      businessModelSalesCandidate: bizModel.salesCandidate,
      businessModel: bizModel.businessModel,
      companyScaleFit: candidate.companyScaleFit,
      catalogFocus: candidate.catalogFocus,
      purchaseMode,
      businessMaturityScore: candidate.businessMaturityScore,
      ownBrandSignal: candidate.ownBrand,
      catalogEstimate: candidate.catalogEstimate,
      showcaseReady: candidate.showcaseReady,
    });
    candidate.preAuditGatePass = gate.pass;
    candidate.preAuditGateFailures = gate.failures;

    const tier = classifyOpportunityTierLegacy({
      preAuditGatePass: gate.pass,
      pageEntityType: candidate.pageEntityType,
      businessModelSalesCandidate: bizModel.salesCandidate,
      businessModel: bizModel.businessModel,
      purchaseMode,
      showcaseGapPotential: candidate.showcaseGapPotential,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      productEconomicFit: productFit.score,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      heroPrice,
    });
    candidate.opportunityTier = tier.tier;
    candidate.opportunityTierReason = tier.reason;

    if (meetsEarlySuccessPartialCriteria({
      pageEntityType: candidate.pageEntityType,
      heroPrice,
      showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      businessModelSalesCandidate: bizModel.salesCandidate,
      businessModel: bizModel.businessModel,
      purchaseMode,
      companyScaleFit: candidate.companyScaleFit,
    })) {
      earlySuccessPartialCount += 1;
    }

    if (
      meetsEarlySuccessFinalistCriteria({
        pageEntityType: candidate.pageEntityType,
        heroPrice,
        priceConfidence: candidate.priceConfidence,
        showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
        redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
        productEconomicFit: productFit.score,
        businessEconomicFit: businessFit.score,
        businessModelSalesCandidate: bizModel.salesCandidate,
        businessModel: bizModel.businessModel,
        companyScaleFit: candidate.companyScaleFit,
        catalogFocus: candidate.catalogFocus,
        purchaseMode,
        businessMaturityScore: candidate.businessMaturityScore,
        ownBrandSignal: candidate.ownBrand,
        catalogEstimate: candidate.catalogEstimate,
        showcaseReady: candidate.showcaseReady,
      })
    ) {
      earlySuccessFinalistCount += 1;
    }

    if (
      isStrongFinalistForEarlyStop({
        businessModel: bizModel.businessModel,
        heroPrice,
        catalogFocus: candidate.catalogFocus,
        catalogEstimate: candidate.catalogEstimate,
        redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
        preauditVisualGap: candidate.preauditVisualGap,
        preauditPurchaseGap: candidate.preauditPurchaseGap,
        mobileGap: candidate.mobileGap,
        showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
        businessEconomicFit: businessFit.score,
        productEconomicFit: productFit.score,
        purchaseMode,
        preAuditGatePass: gate.pass,
      })
    ) {
      earlyStopTriggered = true;
      console.log(`  Strong finalist early stop: ${candidate.domain}`);
    }
  }

  if (earlySuccessFinalistCount >= discovery.earlySuccessCount) {
    earlyStopTriggered = true;
    console.log(
      `  Early success finalists: ${earlySuccessFinalistCount} meet full gate`
    );
  }

  console.log("\nStap 5 — paid validation (top " + discovery.maxPaidValidation + ")");
  const paidPool = highGapShortlist
    .filter((c) => c.businessQualified)
    .sort((a, b) => (b.highTicketGapSalesFit ?? 0) - (a.highTicketGapSalesFit ?? 0))
    .slice(0, discovery.maxPaidValidation);

  if (earlyStopTriggered && earlySuccessFinalistCount >= discovery.earlySuccessCount) {
    console.log("  Skipping excess paid validation — early success threshold met");
  }

  for (const candidate of paidPool) {
    if (!canSpend(dfsBudget, discovery.estimatedSerpCostPerKeyword * 2)) break;
    const paid = await validatePaidAcquisition({
      domain: candidate.domain,
      brandName: candidate.productTitle ?? candidate.domain,
      productKeywords: [
        candidate.sourceQuery,
        candidate.heroTarget.heroTitle ?? candidate.productTitle ?? "",
      ].filter(Boolean),
      serpOptions,
      maxKeywords: discovery.paidValidationKeywordsPerDomain,
    });
    dfsBudget.spent += paid.cost;
    candidate.paidAcquisition = paid.level;
    candidate.paidEvidence = paid.evidence;

    const heroPrice = candidate.heroTarget.heroPrice ?? candidate.observedPrice;
    const businessFit = computeBusinessEconomicFit({
      brandScaleFit: candidate.brandScaleFit,
      firstPartyConfidence: candidate.firstPartyConfidence,
      catalogFocusScore: candidate.catalogFocus,
      catalogVerified: candidate.catalogVerified,
      estimatedCatalogSize: candidate.catalogEstimate,
      ownBrandSignal: candidate.ownBrand,
      businessMaturityScore: candidate.businessMaturityScore,
      heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      purchaseMode: candidate.purchaseMode,
      paidAcquisitionLevel: paid.level,
    });
    candidate.businessEconomicFit = businessFit.score;

    const productFit = computeProductEconomicFit({
      heroPrice,
      priceConfidence: candidate.priceConfidence,
      heroCandidateScore: candidate.heroCandidateScore ?? 0,
      purchaseMode: candidate.purchaseMode,
      productComplexityProxy: candidate.contentAvailable,
      assetContentAvailability: candidate.assetContentAvailability,
    });
    candidate.productEconomicFit = productFit.score;

    const htFit = computeHighTicketGapSalesFit({
      showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      productEconomicFit: productFit.score,
      businessEconomicFit: businessFit.score,
      businessModel: candidate.businessModel,
      businessModelSalesCandidate: candidate.businessModelSalesCandidate,
      paidAcquisitionLevel: paid.level,
    });
    candidate.highTicketGapSalesFit = htFit.score;
    candidate.highTicketConfidence = htFit.confidence;

    const gate = passesHighTicketFinalistGate({
      pageEntityType: candidate.pageEntityType,
      heroPrice,
      priceConfidence: candidate.priceConfidence,
      showcaseGapPotential: candidate.showcaseGapPotential ?? 0,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      productEconomicFit: productFit.score,
      businessEconomicFit: businessFit.score,
      businessModelSalesCandidate: candidate.businessModelSalesCandidate,
      businessModel: candidate.businessModel,
      companyScaleFit: candidate.companyScaleFit,
      catalogFocus: candidate.catalogFocus,
      purchaseMode: candidate.purchaseMode,
      businessMaturityScore: candidate.businessMaturityScore,
      ownBrandSignal: candidate.ownBrand,
      catalogEstimate: candidate.catalogEstimate,
      showcaseReady: candidate.showcaseReady,
    });
    candidate.preAuditGatePass = gate.pass;
    candidate.preAuditGateFailures = gate.failures;

    const tierPaid = classifyOpportunityTierLegacy({
      preAuditGatePass: gate.pass,
      pageEntityType: candidate.pageEntityType,
      businessModelSalesCandidate: candidate.businessModelSalesCandidate,
      businessModel: candidate.businessModel,
      purchaseMode: candidate.purchaseMode,
      showcaseGapPotential: candidate.showcaseGapPotential,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      productEconomicFit: productFit.score,
      redesignMaterialFeasibility: candidate.redesignMaterialFeasibility ?? 0,
      heroPrice,
    });
    candidate.opportunityTier = tierPaid.tier;
    candidate.opportunityTierReason = tierPaid.reason;
  }

  const ranked = highGapShortlist
    .filter((c) => c.highTicketGapSalesFit != null)
    .sort((a, b) => (b.highTicketGapSalesFit ?? 0) - (a.highTicketGapSalesFit ?? 0));
  ranked.forEach((c, i) => (c.rank = i + 1));

  const preAuditFinalists = ranked
    .filter((c) => c.preAuditGatePass)
    .slice(0, discovery.maxPreAuditFinalists);

  const croOnlyOpportunities = ranked
    .filter((c) => c.opportunityTier === "CRO_ONLY_OPPORTUNITY")
    .slice(0, discovery.maxCroOnlyOpportunities);

  const showcaseCandidates = ranked.filter(
    (c) => c.opportunityTier === "SHOWCASE_DESIGN_CANDIDATE"
  );

  const positionBandYield: Record<string, { screened: number; highGap: number }> = {
    TOP_10: { screened: 0, highGap: 0 },
    "11_20": { screened: 0, highGap: 0 },
    "21_50": { screened: 0, highGap: 0 },
    "51_PLUS": { screened: 0, highGap: 0 },
  };
  for (const c of screened) {
    const band = c.serpPositionBand;
    if (positionBandYield[band]) positionBandYield[band].screened += 1;
  }
  for (const c of highGapShortlist) {
    const band = c.serpPositionBand;
    if (positionBandYield[band]) positionBandYield[band].highGap += 1;
  }

  const waterpikUrlCheck = classifyPageEntityFromUrl(
    "https://www.waterpik.nl/product-categorie/waterflossers/",
    "waterpik.nl"
  );
  const waterpikRegression = {
    passed: waterpikUrlCheck.pageEntityType === "CATEGORY",
    notes: [`waterpik entity=${waterpikUrlCheck.pageEntityType} reason=${waterpikUrlCheck.rejectReason}`],
  };

  for (const candidate of preAuditFinalists) {
    candidate.manualReview = {
      whyProductValuable: `€${candidate.heroTarget.heroPrice ?? candidate.observedPrice ?? "?"} · ${candidate.productArchetype} · hero score ${candidate.heroCandidateScore}`,
      whyBusinessInteresting: `${candidate.businessModel} · scale ${candidate.companyScaleFit} · own-brand ${candidate.ownBrand} · catalog ${candidate.catalogEstimate ?? "unknown"}`,
      whatPdpDoesBadly: `visual ${candidate.preauditVisualGap} · purchase ${candidate.preauditPurchaseGap} · mobile ${candidate.mobileGap} · showcase ${candidate.showcaseGapPotential}`,
      whatMaterialExists: `assets ${candidate.assetQualityProxy} · content ${candidate.contentAvailable} · feasibility ${candidate.redesignMaterialFeasibility}`,
      whyRedesignDramatic: `showcase gap ${candidate.showcaseGapPotential} · raw redesign ${candidate.rawPdpRedesignOpportunity} · presentation ${candidate.contentPresentation}`,
      biggestCommercialRisk: candidate.preAuditGateFailures.length
        ? candidate.preAuditGateFailures.join(", ")
        : "moderate — verify hero PDP and economics manually",
    };

    const homePaths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: discovery.screenshotTimeoutMs,
      shots: [
        {
          key: "homepage-desktop-1440x1000",
          url: `https://${candidate.domain}`,
          viewport: discovery.desktop,
        },
        {
          key: "pdp-desktop-1440x1000",
          url: candidate.productUrl,
          viewport: discovery.desktop,
        },
        {
          key: "pdp-mobile-390x844",
          url: candidate.productUrl,
          viewport: discovery.mobile,
        },
      ],
    });
    candidate.screenshots = homePaths;
  }

  const sufficientMaterials = screened.filter(
    (c) => (c.redesignMaterialFeasibility ?? 0) >= 65 || c.materialSweetSpot
  ).length;

  const hookComparison = await buildDiscoveryHookComparison(projectRoot);

  const stripCandidate = (c: M982Candidate) => {
    const { cachedHtml: _drop, ...rest } = c;
    return rest;
  };

  const familyResults: Record<
    string,
    { screened: number; highGap: number; finalists: number; croOnly: number }
  > = {};
  for (const c of screened) {
    const fam = c.productFamilyId;
    if (!familyResults[fam]) {
      familyResults[fam] = { screened: 0, highGap: 0, finalists: 0, croOnly: 0 };
    }
    familyResults[fam].screened += 1;
  }
  for (const c of highGapShortlist) {
    const fam = c.productFamilyId;
    if (familyResults[fam]) familyResults[fam].highGap += 1;
  }
  for (const c of preAuditFinalists) {
    const fam = c.productFamilyId;
    if (familyResults[fam]) familyResults[fam].finalists += 1;
  }
  for (const c of croOnlyOpportunities) {
    const fam = c.productFamilyId;
    if (familyResults[fam]) familyResults[fam].croOnly += 1;
  }

  const report = {
    milestone: discovery.milestone,
    version: versionLabel,
    discoveryRoute: M982_DISCOVERY_ROUTE,
    targetProfile: HIGH_TICKET_GAP_FIRST_TARGET_V1,
    parkedFamilies: M982_PARKED_FAMILIES,
    primaryDiscoveryHook: "PDP_GAP_FIRST",
    completionPass,
    runId: run.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    earlyStopTriggered,
    earlySuccessPartialCount,
    earlySuccessFinalistCount,
    waterpikRegression,
    hpltPriceRegression,
    hairScalpStatus: completionPass ? HAIR_SCALP_M983_STATUS : undefined,
    queryCoverage: {
      totalM982Queries: M982_PRODUCT_QUERIES.length,
      priorExecutedQueries,
      executedThisRun: executedQueriesThisRun,
      skippedQueries,
      pendingCompletionQueries: completionPass
        ? queries.map((q) => q.query)
        : buildM983CompletionQueries(new Set(executedQueriesThisRun)).map((q) => q.query),
    },
    familyResults,
    sourceQueries: queries.map((q) => ({
      familyId: q.familyId,
      query: q.query,
      productArchetype: q.productArchetype,
      expectedPriceBand: q.expectedPriceBand,
      deepDiveRationale: q.deepDiveRationale,
      lineage: q.lineage,
    })),
    positionBandHarvest,
    positionBandYield,
    earlyRejectCounts,
    rawPdpHarvest: {
      queries_executed: queriesExecuted,
      raw_candidates: candidateMap.size,
      valid_pdps: validCandidates.length,
      invalid_pdps: invalidPdp,
      price_hard_rejected: priceHardRejected,
      price_distribution: priceDistribution,
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
      pre_audit_finalists: preAuditFinalists.length,
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
      pre_audit_finalists: preAuditFinalists.length,
    },
    hookComparison,
    highGapReview: ranked.slice(0, 12).map(stripCandidate),
    showcaseCandidates: showcaseCandidates.map(stripCandidate),
    croOnlyOpportunities: croOnlyOpportunities.map(stripCandidate),
    preAuditFinalists: preAuditFinalists.map(stripCandidate),
    allCandidates: [...candidateMap.values()].map(stripCandidate),
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

  printReport(report, REPORT_PATH);
}

function printReport(report: Record<string, unknown>, reportPath: string): void {
  const funnel = report.funnel as Record<string, number>;
  console.log("\n=== FUNNEL ===");
  for (const [k, v] of Object.entries(funnel)) console.log(`  ${k.padEnd(32)} ${v}`);

  const finalists = (report.preAuditFinalists as unknown[]) ?? [];
  console.log(`\n=== PRE-AUDIT FINALISTS (${finalists.length}) ===`);
  for (const raw of finalists) {
    const c = raw as { domain: string; highTicketGapSalesFit: number; showcaseGapPotential: number };
    console.log(
      `  ${c.domain} · ht_fit=${c.highTicketGapSalesFit} · showcase=${c.showcaseGapPotential}`
    );
  }

  const wp = report.waterpikRegression as { passed: boolean };
  console.log(`\nWaterpik regression: ${wp.passed ? "PASS" : "FAIL"}`);

  const cost = report.cost as { dataForSeo: number; anthropic: number };
  console.log(
    `\n=== COST === DataForSEO $${cost.dataForSeo.toFixed(4)} · Anthropic $${cost.anthropic.toFixed(4)}`
  );
  console.log(`\nRapport: ${reportPath}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runM982HighTicketPdpGapFirst.js")
  : false;

if (invokedDirectly) {
  runM982HighTicketPdpGapFirst({ dryRun: process.argv.includes("--dry-run") })
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
