/**
 * Milestone 9.7 — THIRD-PARTY BRAND MINING calibration job.
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
  buildM97SourceQueries,
  M97_DISCOVERY,
  M97_DISCOVERY_ROUTE,
  M97_DISCOVERY_VERSION,
} from "../config/thirdPartyBrandMining.js";
import type {
  FirstPartyStoreClass,
  OfficialDomainStatus,
  ThirdPartySourceType,
} from "../config/thirdPartyBrandMining.js";
import { gapScoreBand } from "../config/designGapWideScreen.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { extractPageSignals } from "../services/crawler/pageExtractor.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import {
  evaluateBrandFirstEarlyGate,
  passesBrandFirstEconomicQualifiedM961,
} from "../services/prospect/brandFirstEarlyGate.js";
import { detectPurchaseMode } from "../services/prospect/purchaseModeDetector.js";
import type { PurchaseMode } from "../config/brandFirstBalancedCalibration.js";
import {
  classifyThirdPartySource,
  isOrganicFirstPartySkip,
} from "../services/prospect/thirdPartySourceClassifier.js";
import { extractThirdPartyProductEntity } from "../services/prospect/thirdPartyProductExtractor.js";
import { resolveOfficialBrandDomainWithConfidence } from "../services/prospect/officialBrandDomainResolver.js";
import {
  classifyFirstPartyStore,
  passesDtcEcommerceGate,
} from "../services/prospect/firstPartyStoreGate.js";
import { computeBrandMarketPresenceScore } from "../services/prospect/brandMarketPresence.js";
import { computeThirdPartyStoryPotential } from "../services/prospect/thirdPartyStoryPotential.js";
import {
  computeThirdPartyBrandOpportunityScore,
  manualReviewVerdictM97,
} from "../services/prospect/thirdPartyBrandOpportunityScore.js";
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
import { resolveSellerDomain } from "../services/prospect/sellerDomainResolver.js";
import type { ProductArchetypeId } from "../config/idealProductArchetypes.js";
import type { PaidAcquisitionLevel } from "../config/brandFirstHighTicket.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/third-party-brand-mining-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/third-party-brand-mining-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, M97_DISCOVERY.screenshotDir);

type Budget = { spent: number; cap: number };

function canSpend(budget: Budget, est: number): boolean {
  return budget.spent + est <= budget.cap + 1e-9;
}

function brandKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

type SourceLineage = {
  sourceDomain: string;
  sourceUrl: string | null;
  sourceType: ThirdPartySourceType;
  sourceQuery: string;
  productFamilyId: string;
  productFamilyLabel: string;
  discoverySourceQuality: "HIGH" | "MEDIUM" | "LOW";
  productTitle: string | null;
  productModel: string | null;
  observedPrice: number | null;
  productBrandConfidence: number;
};

interface MinedBrandCandidate {
  brandKey: string;
  productBrandName: string;
  productFamilyId: string;
  productFamilyLabel: string;
  archetypeId: ProductArchetypeId;
  sources: SourceLineage[];
  officialDomain: string | null;
  officialDomainConfidence: number;
  officialDomainStatus: OfficialDomainStatus;
  brandMarketPresenceScore: number;
  independentSourceCount: number;
  discoveredProductTitle: string | null;
  discoveredProductModel: string | null;
  observedSourcePrice: number | null;
  thirdPartyStoryPotential: number;
  storeClass: FirstPartyStoreClass;
  platform: string | null;
  businessType: string | null;
  firstPartyConfidence: number;
  brandScaleFit: number;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  catalogVerified: boolean;
  ownBrand: number | null;
  heroTarget: ReturnType<typeof buildHeroTargetRecord>;
  purchaseMode: PurchaseMode;
  economicQualified: boolean;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentPresentation: number | null;
  assetContentAvailability: number | null;
  visualGapBand: string;
  purchaseGapBand: string;
  paidAcquisition: PaidAcquisitionLevel;
  paidEvidence: string[];
  thirdPartyBrandOpportunityScore: number | null;
  opportunityConfidence: string;
  manualReviewVerdict: string;
  designGapScreened: boolean;
  rank: number | null;
  whatIsAlreadyGood: string | null;
  manualReview: Record<string, string> | null;
  screenshots: Record<string, string> | null;
}

export async function runThirdPartyBrandMining(options?: { dryRun?: boolean }): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);
  const dfsBudget: Budget = { spent: 0, cap: env.M97_MAX_DATAFORSEO_COST };
  const anthropicBudget: Budget = { spent: 0, cap: env.M97_MAX_ANTHROPIC_COST };
  const serpOptions = { client: dataForSeo, env };
  const startedAt = new Date().toISOString();
  const crawlTimeout = M97_DISCOVERY.crawlTimeoutMs;

  const queries = buildM97SourceQueries();

  console.log(`\n=== M9.7 THIRD-PARTY BRAND MINING (${M97_DISCOVERY_VERSION}) ===`);
  console.log(`Route: ${M97_DISCOVERY_ROUTE}`);

  if (options?.dryRun) {
    for (const q of queries) console.log(`  ${q.familyId}: ${q.query}`);
    return;
  }

  const run = await createRun(supabase, "third_party_brand_mining", {
    milestone: M97_DISCOVERY.milestone,
    version: M97_DISCOVERY_VERSION,
    route: M97_DISCOVERY_ROUTE,
    queries: queries.map((q) => q.query),
  });

  const brandMap = new Map<string, MinedBrandCandidate>();
  const falsePositives = {
    implausibleBrandExtractions: 0,
    unresolvedOfficialDomains: 0,
    retailerPrivateLabels: 0,
    noDtcEcommerce: 0,
    largeBrandsFiltered: 0,
    organicFirstPartySkipped: 0,
    blockedSources: 0,
  };

  let sourceRowsProcessed = 0;
  let queriesExecuted = 0;

  console.log("\nStap 1 — mine brands from third-party sources");
  for (const entry of queries) {
    if (!canSpend(dfsBudget, M97_DISCOVERY.estimatedSerpCostPerKeyword)) break;

    let serp: Awaited<ReturnType<typeof fetchGooglePaidAds>>;
    try {
      serp = await fetchGooglePaidAds(serpOptions, entry.query);
      dfsBudget.spent += serp.cost;
      queriesExecuted += 1;
    } catch (error) {
      console.warn(`  SERP skip ${entry.query}: ${(error as Error).message}`);
      continue;
    }

    const processSource = async (input: {
      sourceDomain: string;
      sourceUrl: string | null;
      title: string | null;
      description: string | null;
      isShopping: boolean;
      likelyRetailer: boolean;
      rawItem: Record<string, unknown>;
    }) => {
      sourceRowsProcessed += 1;
      const classification = classifyThirdPartySource({
        normalizedDomain: input.sourceDomain,
        title: input.title,
        isShoppingResult: input.isShopping,
        likelyRetailer: input.likelyRetailer,
      });

      if (!classification.isAllowedSource) {
        if (classification.skipReason === "organic_first_party_skip") {
          falsePositives.organicFirstPartySkipped += 1;
        } else {
          falsePositives.blockedSources += 1;
        }
        return;
      }

      const extraction = extractThirdPartyProductEntity({
        title: input.title,
        description: input.description,
        rawItem: input.rawItem,
      });

      if (
        !extraction.productBrand ||
        extraction.productBrandConfidence < M97_DISCOVERY.minProductBrandConfidence
      ) {
        falsePositives.implausibleBrandExtractions += 1;
        return;
      }

      const key = brandKey(extraction.productBrand);
      const lineage: SourceLineage = {
        sourceDomain: input.sourceDomain,
        sourceUrl: input.sourceUrl,
        sourceType: classification.sourceType as ThirdPartySourceType,
        sourceQuery: entry.query,
        productFamilyId: entry.familyId,
        productFamilyLabel: entry.familyLabel,
        discoverySourceQuality: classification.discoverySourceQuality,
        productTitle: extraction.productTitle,
        productModel: extraction.productModel,
        observedPrice: extraction.observedPrice,
        productBrandConfidence: extraction.productBrandConfidence,
      };

      let candidate = brandMap.get(key);
      if (!candidate) {
        if (brandMap.size >= M97_DISCOVERY.maxExtractedBrands) return;
        candidate = {
          brandKey: key,
          productBrandName: extraction.productBrand,
          productFamilyId: entry.familyId,
          productFamilyLabel: entry.familyLabel,
          archetypeId: entry.archetypeId as ProductArchetypeId,
          sources: [],
          officialDomain: null,
          officialDomainConfidence: 0,
          officialDomainStatus: "UNRESOLVED_BRAND_DOMAIN",
          brandMarketPresenceScore: 0,
          independentSourceCount: 0,
          discoveredProductTitle: extraction.productTitle,
          discoveredProductModel: extraction.productModel,
          observedSourcePrice: extraction.observedPrice,
          thirdPartyStoryPotential: 0,
          storeClass: "UNKNOWN",
          platform: null,
          businessType: null,
          firstPartyConfidence: 0,
          brandScaleFit: 0,
          catalogEstimate: null,
          catalogFocus: null,
          catalogVerified: false,
          ownBrand: null,
          heroTarget: buildHeroTargetRecord({ hero: null, keywords: [entry.query] }),
          purchaseMode: "UNKNOWN",
          economicQualified: false,
          preauditVisualGap: null,
          preauditPurchaseGap: null,
          mobileGap: null,
          contentPresentation: null,
          assetContentAvailability: null,
          visualGapBand: "LOW",
          purchaseGapBand: "LOW",
          paidAcquisition: "UNKNOWN",
          paidEvidence: [],
          thirdPartyBrandOpportunityScore: null,
          opportunityConfidence: "LOW",
          manualReviewVerdict: "NO_TARGET",
          designGapScreened: false,
          rank: null,
          whatIsAlreadyGood: null,
          manualReview: null,
          screenshots: null,
        };
        brandMap.set(key, candidate);
      }

      candidate.sources.push(lineage);
      if (extraction.observedPrice != null && (candidate.observedSourcePrice ?? 0) < extraction.observedPrice) {
        candidate.observedSourcePrice = extraction.observedPrice;
      }
      if (extraction.productTitle) candidate.discoveredProductTitle = extraction.productTitle;
      if (extraction.productModel) candidate.discoveredProductModel = extraction.productModel;
    };

    for (const organic of serp.organicResults) {
      const classification = classifyThirdPartySource({
        normalizedDomain: organic.normalizedDomain,
        title: organic.title,
        isShoppingResult: false,
        likelyRetailer: organic.likelyRetailer,
      });
      if (isOrganicFirstPartySkip(organic.normalizedDomain, organic.likelyRetailer, classification)) {
        falsePositives.organicFirstPartySkipped += 1;
        continue;
      }
      await processSource({
        sourceDomain: organic.normalizedDomain,
        sourceUrl: organic.url,
        title: organic.title,
        description: organic.description,
        isShopping: false,
        likelyRetailer: organic.likelyRetailer,
        rawItem: organic.rawItem,
      });
    }

    for (const ad of serp.paidAds) {
      if (ad.serpItemType === "paid") continue;
      await processSource({
        sourceDomain: ad.normalizedDomain,
        sourceUrl: ad.landingUrl,
        title: ad.headline,
        description: ad.description,
        isShopping: true,
        likelyRetailer: true,
        rawItem: ad.rawItem,
      });
    }

    for (const unresolved of serp.unresolvedShoppingAds) {
      const sellerResolution = await resolveSellerDomain(unresolved.seller, {
        timeoutMs: 5000,
      });
      const sourceDomain = sellerResolution.domain ?? `seller:${unresolved.seller.toLowerCase().replace(/\s+/g, "-")}`;
      await processSource({
        sourceDomain: sourceDomain.replace(/^www\./, ""),
        sourceUrl: unresolved.landingUrl,
        title: unresolved.headline,
        description: unresolved.description,
        isShopping: true,
        likelyRetailer: true,
        rawItem: unresolved.rawItem,
      });
    }

    console.log(`  ${entry.familyId} · ${entry.query} · brands mined ${brandMap.size}`);
  }

  for (const candidate of brandMap.values()) {
    const presence = computeBrandMarketPresenceScore(
      candidate.sources.map((s) => ({
        sourceDomain: s.sourceDomain,
        sourceType: s.sourceType,
        sourceUrl: s.sourceUrl,
        discoverySourceQuality: s.discoverySourceQuality,
      }))
    );
    candidate.brandMarketPresenceScore = presence.score;
    candidate.independentSourceCount = presence.independentSourceCount;
    candidate.thirdPartyStoryPotential = computeThirdPartyStoryPotential({
      archetypeId: candidate.archetypeId,
      productTitle: candidate.discoveredProductTitle,
      observedPrice: candidate.observedSourcePrice,
      productBrandConfidence: Math.max(...candidate.sources.map((s) => s.productBrandConfidence)),
    });
  }

  console.log(`\nStap 2 — official domain resolution (max ${M97_DISCOVERY.maxOfficialResolutions})`);
  const resolutionQueue = [...brandMap.values()]
    .sort(
      (a, b) =>
        b.brandMarketPresenceScore +
        b.independentSourceCount -
        (a.brandMarketPresenceScore + a.independentSourceCount)
    )
    .slice(0, M97_DISCOVERY.maxOfficialResolutions);

  let resolutionsAttempted = 0;
  for (const candidate of resolutionQueue) {
    resolutionsAttempted += 1;
    const resolution = await resolveOfficialBrandDomainWithConfidence({
      productBrand: candidate.productBrandName,
      productModel: candidate.discoveredProductModel,
      productTitle: candidate.discoveredProductTitle,
      timeoutMs: M97_DISCOVERY.resolutionTimeoutMs,
    });

    candidate.officialDomainConfidence = resolution.officialDomainConfidence;
    candidate.officialDomainStatus = resolution.status;

    if (resolution.status !== "RESOLVED" || !resolution.officialDomain) {
      falsePositives.unresolvedOfficialDomains += 1;
      continue;
    }

    candidate.officialDomain = resolution.officialDomain;

    const sourceDomains = new Set(candidate.sources.map((s) => s.sourceDomain));
    if (sourceDomains.has(resolution.officialDomain)) {
      falsePositives.retailerPrivateLabels += 1;
      candidate.officialDomain = null;
      candidate.officialDomainStatus = "UNRESOLVED_BRAND_DOMAIN";
      continue;
    }
  }

  console.log(`\nStap 3 — first-party DTC + economic qualification`);
  const dtcCandidates: MinedBrandCandidate[] = [];

  for (const candidate of brandMap.values()) {
    if (!candidate.officialDomain || candidate.officialDomainStatus !== "RESOLVED") continue;

    const light = await runLightBrandCheck(candidate.officialDomain, crawlTimeout);
    candidate.platform = light.platform;
    candidate.businessType = light.businessType;
    candidate.ownBrand = light.ownBrandSignal;

    const catalog = await runCatalogFocusCheck(
      candidate.officialDomain,
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
      domain: candidate.officialDomain,
    });
    candidate.firstPartyConfidence = fp.score;

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

    if (scale.brandScaleFitScore < 25) {
      falsePositives.largeBrandsFiltered += 1;
      continue;
    }

    const homepageUrls = await (async () => {
      const home = await crawlWebsite(`https://${candidate.officialDomain}`, crawlTimeout);
      if (home.status !== "success") return [];
      return extractPageSignals(home.html, home.finalUrl).internalLinks.filter((l) =>
        /\/products?\/|\/producten\//i.test(l)
      );
    })();

    const discoveryKeywords = candidate.sources.map((s) => s.sourceQuery);
    const heroes = await resolveHeroProducts({
      domain: candidate.officialDomain!,
      landingUrls: [],
      adProducts: [],
      keyword: discoveryKeywords[0] ?? null,
      keywords: discoveryKeywords,
      timeoutMs: crawlTimeout,
      maxHeroes: 3,
    });

    let hero = heroes.heroes[0] ?? null;
    let heroSelectionEvidence: string[] = hero?.evidence ?? [];

    if (!hero?.url || !isUsableHeroUrl(hero.url, candidate.officialDomain!)) {
      const flagship = await resolveFlagshipProduct(
        candidate.officialDomain!,
        crawlTimeout,
        candidate.discoveredProductTitle ?? hero?.title ?? null,
        homepageUrls,
        discoveryKeywords
      );
      if (flagship) {
        hero = {
          title: flagship.title,
          url: flagship.url,
          brand: null,
          price: flagship.price,
          currency: "EUR",
          heroScore: 58,
          heroConfidence: 60,
          evidence: ["third_party_discovery_prominence", "hero_selection_scorer"],
          source: "landing_linked_product",
        };
        heroSelectionEvidence = ["third_party_model_match", "hero_selection_scorer"];
      }
    }

    candidate.heroTarget = buildHeroTargetRecord({
      hero,
      keywords: discoveryKeywords,
      heroSelectionEvidence,
    });
    candidate.assetContentAvailability = heroes.assetReadinessProxy;

    const heroUrl = hero?.url ?? null;
    let purchaseMode: PurchaseMode = "UNKNOWN";
    if (heroUrl) {
      const heroCrawl = await crawlWebsite(heroUrl, crawlTimeout);
      if (heroCrawl.status === "success") {
        const pm = detectPurchaseMode({
          html: heroCrawl.html,
          url: heroUrl,
          heroPrice: hero?.price ?? candidate.observedSourcePrice,
          isEcommerce: light.isEcommerce,
        });
        purchaseMode = pm.purchaseMode;
      }
    }
    candidate.purchaseMode = purchaseMode;

    const store = classifyFirstPartyStore({
      light,
      purchaseMode,
      hasProductPages: light.productLinks > 0,
      heroPrice: hero?.price ?? candidate.observedSourcePrice,
    });
    candidate.storeClass = store.storeClass;

    if (!passesDtcEcommerceGate(store.storeClass)) {
      falsePositives.noDtcEcommerce += 1;
      continue;
    }

    dtcCandidates.push(candidate);

    const gate = evaluateBrandFirstEarlyGate({
      businessType: light.businessType,
      isEcommerce: light.isEcommerce,
      retailerScaleScore: light.retailerScaleScore,
      firstPartyConfidence: fp.score,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      catalogVerified: catalog.verified,
      heroPrice: hero?.price ?? candidate.observedSourcePrice,
      heroProductUrl: hero?.url ?? null,
      heroConfidence: hero?.heroConfidence ?? null,
    });

    candidate.economicQualified =
      !gate.hardReject &&
      passesBrandFirstEconomicQualifiedM961({
        hardReject: gate.hardReject,
        firstPartyConfidence: fp.score,
        brandScaleFit: scale.brandScaleFitScore,
        heroPrice: hero?.price ?? candidate.observedSourcePrice,
        ownBrandSignal: light.ownBrandSignal,
        catalogFocusScore: catalog.catalogFocusScore,
        purchaseMode,
      });
  }

  const economicPool = dtcCandidates
    .filter((c) => c.economicQualified)
    .slice(0, M97_DISCOVERY.maxEconomicQualified);

  console.log(`  DTC brands: ${dtcCandidates.length} · economic qualified: ${economicPool.length}`);

  console.log("\nStap 4 — design-gap screen");
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  let visionScreens = 0;
  const gapPool = economicPool.slice(0, M97_DISCOVERY.maxDesignGapScreens);

  for (const candidate of gapPool) {
    const heroUrl = candidate.heroTarget.heroProductUrl;
    if (!heroUrl) continue;

    const crawl = await crawlWebsite(heroUrl, crawlTimeout);
    if (crawl.status !== "success" || crawl.html.length < 200) continue;

    const html = crawl.html;
    const contentSignals = extractContentPresentationSignals(html);
    const contentGap = computeContentPresentationGap(contentSignals);
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
    candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
    candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
    candidate.designGapScreened = true;

    candidate.whatIsAlreadyGood = [
      candidate.independentSourceCount >= 3 ? "zichtbaar via meerdere bronnen" : null,
      (candidate.contentPresentation ?? 0) >= 65 ? "redelijke presentatie" : null,
      candidate.purchaseMode === "DIRECT_ECOMMERCE" ? "directe checkout" : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const paths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.officialDomain!,
      timeoutMs: M97_DISCOVERY.screenshotTimeoutMs,
      shots: [
        { key: "pdp-desktop-1440x1000", url: heroUrl, viewport: M97_DISCOVERY.desktop },
        { key: "pdp-mobile-390x844", url: heroUrl, viewport: M97_DISCOVERY.mobile },
      ],
    });
    candidate.screenshots = paths;

    if (
      visionScreens < M97_DISCOVERY.maxVisionScreens &&
      canSpend(anthropicBudget, 0.01) &&
      paths["pdp-desktop-1440x1000"]
    ) {
      const vision = await screenPdpViewportWithVision(
        env,
        candidate.officialDomain!,
        paths["pdp-desktop-1440x1000"]
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
    }

    const opportunity = computeThirdPartyBrandOpportunityScore({
      brandMarketPresenceScore: candidate.brandMarketPresenceScore,
      independentSourceCount: candidate.independentSourceCount,
      firstPartyConfidence: candidate.firstPartyConfidence,
      officialDomainConfidence: candidate.officialDomainConfidence,
      brandScaleFit: candidate.brandScaleFit,
      catalogFocusScore: candidate.catalogFocus,
      ownBrandSignal: candidate.ownBrand,
      heroPrice: candidate.heroTarget.heroPrice ?? candidate.observedSourcePrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      purchaseMode: candidate.purchaseMode,
      thirdPartyStoryPotential: candidate.thirdPartyStoryPotential,
      assetContentAvailability: candidate.assetContentAvailability,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentPresentationQuality: candidate.contentPresentation,
      paidAcquisitionLevel: "UNKNOWN",
    });
    candidate.thirdPartyBrandOpportunityScore = opportunity.thirdPartyBrandOpportunityScore;
    candidate.opportunityConfidence = opportunity.confidence;
    candidate.manualReviewVerdict = manualReviewVerdictM97({
      opportunityScore: opportunity.thirdPartyBrandOpportunityScore,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      presentationQuality: candidate.contentPresentation,
      purchaseMode: candidate.purchaseMode,
      independentSourceCount: candidate.independentSourceCount,
    });
  }

  console.log("\nStap 5 — paid validation");
  const rankedPrePaid = gapPool
    .filter((c) => c.thirdPartyBrandOpportunityScore != null)
    .sort((a, b) => (b.thirdPartyBrandOpportunityScore ?? 0) - (a.thirdPartyBrandOpportunityScore ?? 0))
    .slice(0, M97_DISCOVERY.maxPaidValidation);

  for (const candidate of rankedPrePaid) {
    if (!canSpend(dfsBudget, M97_DISCOVERY.estimatedSerpCostPerKeyword * 2)) break;
    const paid = await validatePaidAcquisition({
      domain: candidate.officialDomain!,
      brandName: candidate.productBrandName,
      productKeywords: [
        candidate.sources[0]?.sourceQuery ?? "",
        candidate.heroTarget.heroTitle ?? candidate.discoveredProductTitle ?? "",
      ].filter(Boolean),
      serpOptions,
      maxKeywords: M97_DISCOVERY.paidValidationKeywordsPerBrand,
    });
    dfsBudget.spent += paid.cost;
    candidate.paidAcquisition = paid.level;
    candidate.paidEvidence = paid.evidence;

    const opportunity = computeThirdPartyBrandOpportunityScore({
      brandMarketPresenceScore: candidate.brandMarketPresenceScore,
      independentSourceCount: candidate.independentSourceCount,
      firstPartyConfidence: candidate.firstPartyConfidence,
      officialDomainConfidence: candidate.officialDomainConfidence,
      brandScaleFit: candidate.brandScaleFit,
      catalogFocusScore: candidate.catalogFocus,
      ownBrandSignal: candidate.ownBrand,
      heroPrice: candidate.heroTarget.heroPrice,
      heroConfidence: candidate.heroTarget.heroConfidence,
      purchaseMode: candidate.purchaseMode,
      thirdPartyStoryPotential: candidate.thirdPartyStoryPotential,
      assetContentAvailability: candidate.assetContentAvailability,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      mobileGap: candidate.mobileGap,
      contentPresentationQuality: candidate.contentPresentation,
      paidAcquisitionLevel: paid.level,
    });
    candidate.thirdPartyBrandOpportunityScore = opportunity.thirdPartyBrandOpportunityScore;
    candidate.opportunityConfidence = opportunity.confidence;
    candidate.manualReviewVerdict = manualReviewVerdictM97({
      opportunityScore: opportunity.thirdPartyBrandOpportunityScore,
      preauditVisualGap: candidate.preauditVisualGap,
      preauditPurchaseGap: candidate.preauditPurchaseGap,
      presentationQuality: candidate.contentPresentation,
      purchaseMode: candidate.purchaseMode,
      independentSourceCount: candidate.independentSourceCount,
    });
  }

  const ranked = gapPool
    .filter((c) => c.thirdPartyBrandOpportunityScore != null)
    .sort((a, b) => (b.thirdPartyBrandOpportunityScore ?? 0) - (a.thirdPartyBrandOpportunityScore ?? 0));

  ranked.forEach((c, i) => (c.rank = i + 1));
  const top10 = ranked.slice(0, 10);
  const manualReviewList = ranked
    .filter((c) => c.manualReviewVerdict === "TRUE_MANUAL_REVIEW_CANDIDATE")
    .slice(0, M97_DISCOVERY.maxManualReview);

  for (const candidate of manualReviewList) {
    const primarySource = candidate.sources[0];
    candidate.manualReview = {
      whyInPipeline: `Merk ${candidate.productBrandName} gevonden via ${candidate.independentSourceCount} onafhankelijke third-party bronnen (${primarySource?.sourceType ?? "source"}).`,
      whyBusinessFits: `Official ${candidate.officialDomain}, first-party ${candidate.firstPartyConfidence}, schaal ${candidate.brandScaleFit}, presence ${candidate.brandMarketPresenceScore}.`,
      whyProductFits: `Product ${candidate.discoveredProductTitle ?? "?"} @ €${candidate.observedSourcePrice ?? candidate.heroTarget.heroPrice ?? "?"}, story ${candidate.thirdPartyStoryPotential}.`,
      whyPdpMayLag: `Zichtbaar via retailers/editorial/shopping maar eigen PDP gap visual ${candidate.preauditVisualGap} purchase ${candidate.preauditPurchaseGap}.`,
      whatAlreadyGood: candidate.whatIsAlreadyGood ?? "Nog niet beoordeeld.",
      expectedBeforeAfter: `Score ${candidate.thirdPartyBrandOpportunityScore}, confidence ${candidate.opportunityConfidence}.`,
    };
    if (!candidate.screenshots?.["homepage-desktop-1440x1000"]) {
      const homePaths = await captureViewportScreenshots({
        outputDir: SCREENSHOT_DIR,
        domain: candidate.officialDomain!,
        timeoutMs: M97_DISCOVERY.screenshotTimeoutMs,
        shots: [
          {
            key: "homepage-desktop-1440x1000",
            url: `https://${candidate.officialDomain}`,
            viewport: M97_DISCOVERY.desktop,
          },
        ],
      });
      candidate.screenshots = { ...candidate.screenshots, ...homePaths };
    }
  }

  const hookComparison = await buildDiscoveryHookComparison(projectRoot);

  const report = {
    milestone: M97_DISCOVERY.milestone,
    version: M97_DISCOVERY_VERSION,
    discoveryRoute: M97_DISCOVERY_ROUTE,
    runId: run.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    sourceQueries: queries.map((q) => ({ familyId: q.familyId, query: q.query })),
    funnel: {
      source_queries_executed: queriesExecuted,
      source_rows_processed: sourceRowsProcessed,
      brands_mined: brandMap.size,
      official_resolutions_attempted: resolutionsAttempted,
      official_domains_resolved: [...brandMap.values()].filter(
        (c) => c.officialDomainStatus === "RESOLVED"
      ).length,
      dtc_ecommerce: dtcCandidates.length,
      economic_qualified: economicPool.length,
      design_gap_screened: gapPool.filter((c) => c.designGapScreened).length,
      paid_validated: rankedPrePaid.length,
      true_manual_review: manualReviewList.length,
    },
    falsePositives,
    hookComparison,
    top10,
    manualReview: manualReviewList,
    allCandidates: [...brandMap.values()],
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
    brandsMined: brandMap.size,
    dtc: dtcCandidates.length,
    dataForSeoCost: dfsBudget.spent,
    anthropicCost: anthropicBudget.spent,
  });

  printReport(report);
}

function printReport(report: Record<string, unknown>): void {
  const funnel = report.funnel as Record<string, number>;
  console.log("\n=== FUNNEL ===");
  for (const [k, v] of Object.entries(funnel)) console.log(`  ${k.padEnd(30)} ${v}`);

  const fp = report.falsePositives as Record<string, number>;
  console.log("\n=== FALSE POSITIVE SAFETY ===");
  for (const [k, v] of Object.entries(fp)) console.log(`  ${k.padEnd(30)} ${v}`);

  const cmp = report.hookComparison as { thirdPartyMining: { brandsDiscovered: number } | null };
  console.log("\n=== HOOK COMPARISON ===");
  console.log(`  Third-party brands mined: ${cmp.thirdPartyMining?.brandsDiscovered ?? 0}`);

  const cost = report.cost as { dataForSeo: number; anthropic: number };
  console.log(`\n=== COST === DataForSEO $${cost.dataForSeo.toFixed(4)} · Anthropic $${cost.anthropic.toFixed(4)}`);
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runThirdPartyBrandMining.js")
  : false;

if (invokedDirectly) {
  runThirdPartyBrandMining({ dryRun: process.argv.includes("--dry-run") })
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
