/**
 * Milestone 9.6 — BRAND-FIRST FOCUSED HIGH-TICKET DISCOVERY.
 *
 * Organic product discovery → official brand qualification → design gap →
 * paid acquisition validation last. No full CRO, preview, mail, or outreach.
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
import { isBlacklistedDomain } from "../config/blacklist.js";
import {
  BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION,
  BRAND_FIRST_PRODUCT_FAMILIES,
  M96_DISCOVERY,
  M96_DISCOVERY_VERSION,
  ORGANIC_QUERY_REJECT,
} from "../config/brandFirstHighTicket.js";
import { BRAND_FIRST_DISCOVERY_VERSION } from "../config/brandFirstDiscovery.js";
import { gapScoreBand } from "../config/designGapWideScreen.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { computeDeepDivePdpFitProxy } from "../services/prospect/prospectPreScore.js";
import { classifyOrganicEntity } from "../services/prospect/productBrandExtractor.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import {
  evaluateBrandFirstEarlyGate,
  passesBrandFirstEconomicQualified,
} from "../services/prospect/brandFirstEarlyGate.js";
import { computeBrandFirstOpportunityScore } from "../services/prospect/brandFirstOpportunityScore.js";
import {
  paidAcquisitionBonus,
  validatePaidAcquisition,
} from "../services/prospect/paidAcquisitionValidation.js";
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
import { screenPdpViewportWithVision } from "../services/prospect/preauditVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { buildHeroTargetRecord } from "../services/prospect/heroTargetMetadata.js";
import type { ProductArchetypeId } from "../config/idealProductArchetypes.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/brand-first-discovery-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/brand-first-discovery-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, M96_DISCOVERY.screenshotDir);

type Budget = { spent: number; cap: number };

function canSpend(budget: Budget, est: number): boolean {
  return budget.spent + est <= budget.cap + 1e-9;
}

interface BrandCandidate {
  domain: string;
  brandName: string;
  productFamilyId: string;
  productFamilyLabel: string;
  archetypeId: ProductArchetypeId;
  discoverySource: string;
  sourceQuery: string;
  sourceEvidence: string[];
  merchantDomain: string | null;
  productBrandName: string | null;
  platform: string | null;
  businessType: string | null;
  firstPartyConfidence: number;
  brandScaleFit: number;
  businessMaturity: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  catalogVerified: boolean;
  ownBrand: number | null;
  heroTarget: ReturnType<typeof buildHeroTargetRecord>;
  heroCandidates: Array<{ title: string; price: number | null; confidence: number; url: string | null }>;
  productStoryPotential: number | null;
  assetContentAvailability: number | null;
  hardReject: boolean;
  hardRejectReason: string | null;
  economicQualified: boolean;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentAvailable: number | null;
  contentPresentation: number | null;
  rawDesignGapOpportunity: number | null;
  visualGapBand: string;
  purchaseGapBand: string;
  paidAcquisition: string;
  paidEvidence: string[];
  brandFirstOpportunityScore: number | null;
  sweetSpotProfile: string | null;
  overallConfidence: string;
  designGapScreened: boolean;
  rank: number | null;
  manualReview: {
    whyBusinessFits: string;
    whyProductFits: string;
    whatPdpLeavesOnTable: string;
    expectedBeforeAfter: string;
  } | null;
  screenshots: Record<string, string> | null;
}

function buildManualReview(candidate: BrandCandidate): BrandCandidate["manualReview"] {
  return {
    whyBusinessFits: `First-party ${candidate.firstPartyConfidence}, schaal ${candidate.brandScaleFit}, eigen merk ${candidate.ownBrand ?? "?"}, catalogus ${candidate.catalogEstimate ?? "onbekend"} (focus ${candidate.catalogFocus ?? "?"}).`,
    whyProductFits: `Hero ${candidate.heroTarget.heroTitle ?? "?"} @ €${candidate.heroTarget.heroPrice ?? "?"}, story potential ${candidate.productStoryPotential ?? "?"}, assets ${candidate.assetContentAvailability ?? "?"}.`,
    whatPdpLeavesOnTable: `Visual gap ${candidate.preauditVisualGap} (${candidate.visualGapBand}), purchase gap ${candidate.preauditPurchaseGap} (${candidate.purchaseGapBand}), presentatie ${candidate.contentPresentation}.`,
    expectedBeforeAfter: `Raw design gap ${candidate.rawDesignGapOpportunity}, profiel ${candidate.sweetSpotProfile}. Sterk merk met ruimte op de PDP, geen volwassen premium storytelling.`,
  };
}

export async function runBrandFirstDiscovery(options?: { dryRun?: boolean }): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);
  const dfsBudget: Budget = { spent: 0, cap: env.M96_MAX_DATAFORSEO_COST };
  const anthropicBudget: Budget = { spent: 0, cap: env.M96_MAX_ANTHROPIC_COST };
  const serpOptions = { client: dataForSeo, env };
  const startedAt = new Date().toISOString();
  const crawlTimeout = M96_DISCOVERY.crawlTimeoutMs;

  console.log(`\n=== M9.6 BRAND-FIRST HIGH-TICKET DISCOVERY (${M96_DISCOVERY_VERSION}) ===`);
  console.log(`Profile: ${BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION}`);
  console.log(`DataForSEO cap $${dfsBudget.cap} · Anthropic cap $${anthropicBudget.cap}\n`);

  const queries: Array<{
    query: string;
    familyId: string;
    familyLabel: string;
    archetypeId: ProductArchetypeId;
  }> = [];

  const familyQueryRows = BRAND_FIRST_PRODUCT_FAMILIES.map((family) => ({
    familyId: family.id,
    familyLabel: family.label,
    archetypeId: family.archetypeId as ProductArchetypeId,
    queries: family.organicQueries.filter((query) => {
      const lower = query.toLowerCase();
      return !ORGANIC_QUERY_REJECT.some((token) => lower.includes(token));
    }),
  }));

  let round = 0;
  while (queries.length < M96_DISCOVERY.maxOrganicQueries) {
    let added = false;
    for (const row of familyQueryRows) {
      const query = row.queries[round];
      if (!query) continue;
      queries.push({
        query,
        familyId: row.familyId,
        familyLabel: row.familyLabel,
        archetypeId: row.archetypeId,
      });
      added = true;
      if (queries.length >= M96_DISCOVERY.maxOrganicQueries) break;
    }
    if (!added) break;
    round += 1;
  }

  if (options?.dryRun) {
    console.log(`Dry run: ${queries.length} organic queries`);
    for (const q of queries) console.log(`  ${q.familyId}: ${q.query}`);
    return;
  }

  const run = await createRun(supabase, "brand_first_discovery", {
    milestone: M96_DISCOVERY.milestone,
    version: M96_DISCOVERY_VERSION,
    profile: BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION,
    queries: queries.map((q) => q.query),
  });

  const discovered = new Map<string, BrandCandidate>();
  let organicRows = 0;
  let retailerExtractions = 0;

  let organicQueriesExecuted = 0;
  const familyBrandCounts = new Map<string, number>();

  console.log("Stap 1 — organic product SERP (brand-first)");
  for (const entry of queries) {
    const familyCount = familyBrandCounts.get(entry.familyId) ?? 0;
    if (familyCount >= M96_DISCOVERY.maxBrandsPerFamily) continue;
    if (discovered.size >= M96_DISCOVERY.maxBrandCandidates) break;
    if (!canSpend(dfsBudget, M96_DISCOVERY.estimatedSerpCostPerKeyword)) break;

    organicQueriesExecuted += 1;
    const serp = await fetchGooglePaidAds(serpOptions, entry.query);
    dfsBudget.spent += serp.cost;

    for (const organic of serp.organicResults) {
      organicRows += 1;
      if (isBlacklistedDomain(organic.normalizedDomain)) continue;

      const extraction = await classifyOrganicEntity({
        normalizedDomain: organic.normalizedDomain,
        title: organic.title,
        likelyRetailer: organic.likelyRetailer,
        timeoutMs: crawlTimeout,
      });

      const officialDomain = extraction.officialBrandDomain;
      if (!officialDomain || extraction.entityRole !== "OFFICIAL_BRAND_DOMAIN") {
        if (extraction.merchantDomain) retailerExtractions += 1;
        continue;
      }
      if (isBlacklistedDomain(officialDomain)) continue;

      if (!discovered.has(officialDomain)) {
        discovered.set(officialDomain, {
          domain: officialDomain,
          brandName: extraction.productBrandName ?? officialDomain,
          productFamilyId: entry.familyId,
          productFamilyLabel: entry.familyLabel,
          archetypeId: entry.archetypeId,
          discoverySource: "ORGANIC_PRODUCT_SERP",
          sourceQuery: entry.query,
          sourceEvidence: extraction.evidence,
          merchantDomain: extraction.merchantDomain,
          productBrandName: extraction.productBrandName,
          platform: null,
          businessType: null,
          firstPartyConfidence: 0,
          brandScaleFit: 0,
          businessMaturity: null,
          catalogEstimate: null,
          catalogFocus: null,
          catalogVerified: false,
          ownBrand: null,
          heroTarget: buildHeroTargetRecord({ hero: null, keywords: [entry.query] }),
          heroCandidates: [],
          productStoryPotential: null,
          assetContentAvailability: null,
          hardReject: false,
          hardRejectReason: null,
          economicQualified: false,
          preauditVisualGap: null,
          preauditPurchaseGap: null,
          mobileGap: null,
          contentAvailable: null,
          contentPresentation: null,
          rawDesignGapOpportunity: null,
          visualGapBand: "LOW",
          purchaseGapBand: "LOW",
          paidAcquisition: "UNKNOWN",
          paidEvidence: [],
          brandFirstOpportunityScore: null,
          sweetSpotProfile: null,
          overallConfidence: "LOW",
          designGapScreened: false,
          rank: null,
          manualReview: null,
          screenshots: null,
        });
        familyBrandCounts.set(entry.familyId, familyCount + 1);
      }
      if (discovered.size >= M96_DISCOVERY.maxBrandCandidates) break;
    }
    console.log(`  ${entry.query} · organic ${serp.organicResults.length} · brands ${discovered.size}`);
    if (discovered.size >= M96_DISCOVERY.maxBrandCandidates) break;
  }

  console.log(`\nStap 2 — first-party + catalog qualification (${discovered.size} brands)`);
  for (const candidate of discovered.values()) {
    const light = await runLightBrandCheck(candidate.domain, crawlTimeout);
    candidate.platform = light.platform;
    candidate.businessType = light.businessType;
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
    candidate.sourceEvidence.push(...fp.evidence.slice(0, 3));

    const scale = computeBrandScaleFit({
      businessType: light.businessType,
      isEcommerce: light.isEcommerce,
      retailerScaleScore: light.retailerScaleScore,
      retailerBreadthScore: light.retailerBreadthScore,
      businessMaturityScore: null,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      homepageProductLinks: light.productLinks,
      ownBrandSignal: light.ownBrandSignal,
      firstPartyBrandConfidence: fp.score,
    });
    candidate.brandScaleFit = scale.brandScaleFitScore;

    const heroes = await resolveHeroProducts({
      domain: candidate.domain,
      landingUrls: [],
      adProducts: [],
      keyword: candidate.sourceQuery,
      keywords: [candidate.sourceQuery],
      timeoutMs: crawlTimeout,
      maxHeroes: 3,
    });

    candidate.heroCandidates = heroes.heroes.map((h) => ({
      title: h.title,
      price: h.price,
      confidence: h.heroConfidence,
      url: h.url,
    }));

    let hero = heroes.heroes[0] ?? null;
    if (!hero?.url || !isUsableHeroUrl(hero.url, candidate.domain)) {
      const flagship = await resolveFlagshipProduct(candidate.domain, crawlTimeout, hero?.title ?? null);
      if (flagship) {
        hero = {
          title: flagship.title,
          url: flagship.url,
          brand: null,
          price: flagship.price,
          currency: "EUR",
          heroScore: hero?.heroScore ?? 55,
          heroConfidence: 55,
          evidence: ["catalog_flagship"],
          source: "landing_linked_product",
        };
      }
    }

    candidate.heroTarget = buildHeroTargetRecord({
      hero,
      keywords: [candidate.sourceQuery],
      resolutionSource: hero?.source ?? "unknown",
    });

    candidate.productStoryPotential = computeDeepDivePdpFitProxy({
      archetypeId: candidate.archetypeId,
      catalogFocusScore: catalog.catalogFocusScore ?? 50,
      heroScore: hero?.heroScore ?? null,
    });
    candidate.assetContentAvailability = heroes.assetReadinessProxy;

    const gate = evaluateBrandFirstEarlyGate({
      businessType: light.businessType,
      isEcommerce: light.isEcommerce,
      retailerScaleScore: light.retailerScaleScore,
      firstPartyConfidence: fp.score,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      catalogVerified: catalog.verified,
      heroPrice: hero?.price ?? null,
      heroProductUrl: hero?.url ?? null,
      heroConfidence: hero?.heroConfidence ?? null,
    });
    candidate.hardReject = gate.hardReject;
    candidate.hardRejectReason = gate.reason;

    candidate.economicQualified = passesBrandFirstEconomicQualified({
      hardReject: gate.hardReject,
      firstPartyConfidence: fp.score,
      brandScaleFit: scale.brandScaleFitScore,
      heroPrice: hero?.price ?? null,
      ownBrandSignal: light.ownBrandSignal,
      catalogFocusScore: catalog.catalogFocusScore,
    });
  }

  const economicPool = [...discovered.values()]
    .filter((c) => c.economicQualified)
    .sort((a, b) => b.brandScaleFit + b.firstPartyConfidence - (a.brandScaleFit + a.firstPartyConfidence))
    .slice(0, M96_DISCOVERY.maxEconomicQualified);

  console.log(`  economic qualified: ${economicPool.length}`);

  console.log("\nStap 3 — design-gap screen");
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  let visionScreens = 0;

  const gapPool = economicPool.slice(0, M96_DISCOVERY.maxDesignGapScreens);
  for (const candidate of gapPool) {
    const heroUrl = candidate.heroTarget.heroProductUrl;
    if (!heroUrl) continue;

    const crawl = await crawlWebsite(heroUrl, crawlTimeout);
    if (crawl.status !== "success" || crawl.html.length < 200) continue;

    const html = crawl.html;
    const contentSignals = extractContentPresentationSignals(html);
    const contentGap = computeContentPresentationGap(contentSignals);
    candidate.contentAvailable = contentGap.contentAvailableScore;
    candidate.contentPresentation = contentGap.contentPresentationQuality;

    const purchaseSignals = extractPurchaseGapSignals(html);
    const purchase = computePreauditPurchaseGap({ html, ...purchaseSignals });
    candidate.preauditPurchaseGap = purchase.score;
    candidate.mobileGap = Math.max(
      0,
      Math.min(100, Math.round(purchase.score * 0.55 + 18 + (purchaseSignals.mobileAtcSignal ? 0 : 12)))
    );

    const visual = computePreauditVisualGap({
      html,
      url: heroUrl,
      platform: candidate.platform,
      bodyTextLength: contentSignals.bodyTextLength,
      imageCount: contentSignals.imageCount,
      sectionCount: countDomSections(html),
      pdpWeaknessProxy: null,
      estimatedContrastCeiling: null,
    });
    candidate.preauditVisualGap = visual.score;
    candidate.rawDesignGapOpportunity = computeRawDesignGapOpportunity({
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGapProxy: candidate.mobileGap,
      contentPresentationQuality: candidate.contentPresentation,
    }).score;
    candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
    candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
    candidate.designGapScreened = true;

    const paths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: M96_DISCOVERY.screenshotTimeoutMs,
      shots: [
        { key: "pdp-desktop-1440x1000", url: heroUrl, viewport: M96_DISCOVERY.desktop },
        { key: "pdp-mobile-390x844", url: heroUrl, viewport: M96_DISCOVERY.mobile },
      ],
    });
    candidate.screenshots = paths;

    if (
      visionScreens < M96_DISCOVERY.maxVisionScreens &&
      canSpend(anthropicBudget, 0.01) &&
      paths["pdp-desktop-1440x1000"]
    ) {
      const vision = await screenPdpViewportWithVision(env, candidate.domain, paths["pdp-desktop-1440x1000"]);
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
      if (vision.presentationQuality != null) candidate.contentPresentation = vision.presentationQuality;
      candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
      candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
      candidate.rawDesignGapOpportunity = computeRawDesignGapOpportunity({
        preauditVisualGap: candidate.preauditVisualGap,
        preauditPurchaseGap: candidate.preauditPurchaseGap,
        mobileGapProxy: candidate.mobileGap,
        contentPresentationQuality: candidate.contentPresentation,
      }).score;
    }
  }

  console.log("\nStap 3b — opportunity score (pre-paid)");
  for (const candidate of gapPool) {
    if (!candidate.designGapScreened) continue;
    const opportunity = computeBrandFirstOpportunityScore({
      brandScaleFit: candidate.brandScaleFit,
      firstPartyConfidence: candidate.firstPartyConfidence,
      catalogFocusScore: candidate.catalogFocus,
      catalogVerified: candidate.catalogVerified,
      estimatedCatalogSize: candidate.catalogEstimate,
      ownBrandSignal: candidate.ownBrand,
      heroPrice: candidate.heroTarget.heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      productStoryPotential: candidate.productStoryPotential,
      assetContentAvailability: candidate.assetContentAvailability,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentPresentationQuality: candidate.contentPresentation,
      paidAcquisitionBonus: paidAcquisitionBonus("UNKNOWN"),
    });
    candidate.brandFirstOpportunityScore = opportunity.brandFirstOpportunityScore;
    candidate.sweetSpotProfile = opportunity.sweetSpotProfile;
    candidate.overallConfidence =
      candidate.firstPartyConfidence >= 65 && candidate.catalogVerified ? "MEDIUM" : "LOW";
  }

  console.log("\nStap 4 — paid acquisition validation (bonus only)");
  const paidPool = gapPool.slice(0, M96_DISCOVERY.paidValidationMaxCandidates);
  for (const candidate of paidPool) {
    if (!canSpend(dfsBudget, M96_DISCOVERY.estimatedSerpCostPerKeyword * 2)) break;
    const paid = await validatePaidAcquisition({
      domain: candidate.domain,
      brandName: candidate.brandName,
      productKeywords: [candidate.sourceQuery, candidate.heroTarget.heroTitle ?? candidate.sourceQuery].filter(
        Boolean
      ) as string[],
      serpOptions,
      maxKeywords: M96_DISCOVERY.paidValidationKeywordsPerBrand,
    });
    dfsBudget.spent += paid.cost;
    candidate.paidAcquisition = paid.level;
    candidate.paidEvidence = paid.evidence;

    const opportunity = computeBrandFirstOpportunityScore({
      brandScaleFit: candidate.brandScaleFit,
      firstPartyConfidence: candidate.firstPartyConfidence,
      catalogFocusScore: candidate.catalogFocus,
      catalogVerified: candidate.catalogVerified,
      estimatedCatalogSize: candidate.catalogEstimate,
      ownBrandSignal: candidate.ownBrand,
      heroPrice: candidate.heroTarget.heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      productStoryPotential: candidate.productStoryPotential,
      assetContentAvailability: candidate.assetContentAvailability,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentPresentationQuality: candidate.contentPresentation,
      paidAcquisitionBonus: paidAcquisitionBonus(paid.level),
    });
    candidate.brandFirstOpportunityScore = opportunity.brandFirstOpportunityScore;
    candidate.sweetSpotProfile = opportunity.sweetSpotProfile;
  }

  const familyCounts = new Map<string, number>();
  const ranked = [...discovered.values()]
    .filter((c) => c.brandFirstOpportunityScore != null)
    .sort((a, b) => (b.brandFirstOpportunityScore ?? 0) - (a.brandFirstOpportunityScore ?? 0))
    .filter((c) => {
      const count = familyCounts.get(c.productFamilyId) ?? 0;
      const family = BRAND_FIRST_PRODUCT_FAMILIES.find((f) => f.id === c.productFamilyId);
      const max = family?.maxShortlisted ?? 3;
      if (count >= max) return false;
      familyCounts.set(c.productFamilyId, count + 1);
      return true;
    });

  ranked.forEach((c, i) => (c.rank = i + 1));
  const top10 = ranked.slice(0, 10);
  const manualReview = ranked.slice(0, M96_DISCOVERY.maxManualReview);

  for (const candidate of manualReview) {
    candidate.manualReview = buildManualReview(candidate);
    if (!candidate.screenshots?.["homepage-desktop-1440x1000"]) {
      const homePaths = await captureViewportScreenshots({
        outputDir: SCREENSHOT_DIR,
        domain: candidate.domain,
        timeoutMs: M96_DISCOVERY.screenshotTimeoutMs,
        shots: [
          {
            key: "homepage-desktop-1440x1000",
            url: `https://${candidate.domain}`,
            viewport: M96_DISCOVERY.desktop,
          },
        ],
      });
      candidate.screenshots = { ...candidate.screenshots, ...homePaths };
    }
  }

  const report = {
    milestone: M96_DISCOVERY.milestone,
    version: M96_DISCOVERY_VERSION,
    profileVersion: BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION,
    architectureVersion: BRAND_FIRST_DISCOVERY_VERSION,
    runId: run.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    sources: {
      primary: "ORGANIC_PRODUCT_SERP",
      discoveryRoute: "brand_first",
      paidValidation: "post_qualification_only",
    },
    productFamilies: BRAND_FIRST_PRODUCT_FAMILIES.map((f) => ({
      id: f.id,
      label: f.label,
      queries: f.organicQueries,
    })),
    funnel: {
      organic_queries_planned: queries.length,
      organic_queries_executed: organicQueriesExecuted,
      organic_rows: organicRows,
      retailer_extractions_attempted: retailerExtractions,
      brands_discovered: discovered.size,
      first_party_passed: [...discovered.values()].filter(
        (c) => c.firstPartyConfidence >= M96_DISCOVERY.firstPartyMinConfidence
      ).length,
      economic_qualified: economicPool.length,
      design_gap_screened: gapPool.filter((c) => c.designGapScreened).length,
      paid_validated: paidPool.length,
    },
    top10,
    manualReview,
    allCandidates: [...discovered.values()],
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
    brands: discovered.size,
    top10: top10.length,
    dataForSeoCost: dfsBudget.spent,
    anthropicCost: anthropicBudget.spent,
  });

  printReport(report);
}

function printReport(report: Record<string, unknown>): void {
  const funnel = report.funnel as Record<string, number>;
  console.log("\n=== FUNNEL ===");
  for (const [k, v] of Object.entries(funnel)) console.log(`  ${k.padEnd(28)} ${v}`);

  console.log("\n=== TOP 10 ===");
  for (const c of (report.top10 as BrandCandidate[]) ?? []) {
    console.log(
      `\n  #${c.rank} ${c.domain} · opportunity ${c.brandFirstOpportunityScore} · ${c.sweetSpotProfile}`
    );
    console.log(
      `     first-party ${c.firstPartyConfidence} · scale ${c.brandScaleFit} · visual ${c.preauditVisualGap} (${c.visualGapBand}) · paid ${c.paidAcquisition}`
    );
    console.log(`     hero: ${c.heroTarget.heroTitle} · €${c.heroTarget.heroPrice ?? "?"}`);
  }

  const cost = report.cost as { dataForSeo: number; anthropic: number };
  console.log(`\n=== COST === DataForSEO $${cost.dataForSeo.toFixed(4)} · Anthropic $${cost.anthropic.toFixed(4)}`);
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runBrandFirstDiscovery.js")
  : false;

if (invokedDirectly) {
  runBrandFirstDiscovery({ dryRun: process.argv.includes("--dry-run") })
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
