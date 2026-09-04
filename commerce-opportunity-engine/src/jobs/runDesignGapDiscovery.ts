/**
 * Milestone 9.5 — DESIGN-GAP-FIRST HIGH-TICKET DISCOVERY.
 *
 * Finds prospects where economic fit AND a weak/generic current PDP align.
 * Cheap viewport screening runs before any full CRO audit. No preview, mail,
 * outreach, or full CRO audits in this milestone.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds } from "../services/dataforseo/googleSerp.js";
import { classifySerpSignal } from "../config/signalClassification.js";
import { upsertBrandFromAd } from "../services/supabase/brandsRepository.js";
import { storeAdOccurrence } from "../services/supabase/adOccurrencesRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { isBlacklistedDomain } from "../config/blacklist.js";
import { ARCHETYPE_BY_ID, type ProductArchetypeId } from "../config/idealProductArchetypes.js";
import {
  DESIGN_GAP_BRANCHES,
  M95_DISCOVERY,
  M95_DISCOVERY_VERSION,
  M95_SCREENSHOT_CONFIG,
  PARKED_FOR_M95,
  type DesignGapFunnelStage,
} from "../config/designGapDiscovery.js";
import { DESIGN_GAP_PROFILE_VERSION } from "../config/designGapProspect.js";
import { ECONOMIC_PRESCREEN_THRESHOLDS } from "../config/designGapProspect.js";
import {
  expandFamilyKeywords,
  persistFamilyKeywords,
  selectProductionKeywords,
  type FamilyKeyword,
  type RejectedKeyword,
} from "../services/idealProspect/familyKeywordExpander.js";
import {
  computeSerpProspectQuality,
  type KeywordProspectStatus,
} from "../services/idealProspect/serpProspectQuality.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { classifyProspectExclusion } from "../services/prospect/prospectPipelineGate.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { computeDeepDivePdpFitProxy } from "../services/prospect/prospectPreScore.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { computeCompanyScaleFit } from "../services/prospect/companyScaleFit.js";
import { estimateContrastCeiling } from "../services/prospect/estimatedContrastCeiling.js";
import { computeHighTicketFocusedFit } from "../services/prospect/highTicketFocusedFit.js";
import { recoverShoppingSellerAds } from "../services/prospect/shoppingSellerRecovery.js";
import type { SellerDomainResolution } from "../services/prospect/sellerDomainResolver.js";
import {
  extractAdProduct,
  resolveHeroProducts,
  type AdProduct,
  type ResolvedHero,
} from "../services/prospect/heroProductResolver.js";
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
import { computePreviewCasePotential } from "../services/prospect/previewCasePotential.js";
import { screenPdpViewportWithVision } from "../services/prospect/preauditVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { runDesignGapRegression } from "../services/prospect/designGapRegression.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/design-gap-discovery-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/design-gap-discovery-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, M95_SCREENSHOT_CONFIG.outputDir);
const SOURCE = "dataforseo_google_serp_live";

type DiscoveryRoute = "ads_first" | "shopping_first" | "brand_first";

interface RoutedKeyword extends FamilyKeyword {
  discoveryRoute: DiscoveryRoute;
  serpQuery: string;
}

interface DiscoveredDomain {
  domain: string;
  brandId: string | null;
  brandName: string;
  discoveryRoute: DiscoveryRoute;
  landingUrls: string[];
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  keywords: string[];
  sellerResolution: string | null;
  prospectClass: string;
  gateEligible: boolean;
  gateReason: string | null;
  businessType: string | null;
  platform: string | null;
  isEcommerce: boolean | null;
  retailerScaleScore: number | null;
  businessMaturityScore: number | null;
  ownBrandSignal: number | null;
  ownBrandEvidence: string[];
  homepageProductLinks: number;
  homepageCategoryLinks: number;
  retailerBreadthScore: number | null;
  internationalPresenceScore: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  catalogEvidence: string[];
  adProducts: AdProduct[];
  heroes: ResolvedHero[];
  pdpWeaknessScore: number | null;
  assetReadinessProxy: number | null;
  deepDivePdpFitProxy: number | null;
  heroUrlIsProductPage: boolean;
  companyScaleFitScore: number | null;
  companyScaleBand: string | null;
  companyScaleEvidence: string[];
  estimatedContrastCeiling: number | null;
  contrastCeilingEvidence: string[];
  highTicketFitScore: number | null;
  priceBand: string | null;
  priceBandLabel: string | null;
  catalogBandLabel: string | null;
  fitEvidence: string[];
  fitPenalties: Array<{ reason: string; points: number }>;
  lightChecked: boolean;
  economicPrequalified: boolean;
  designGapScreened: boolean;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  contentAvailableScore: number | null;
  contentPresentationQuality: number | null;
  mobileGapProxy: number | null;
  previewCasePotential: number | null;
  passesPreauditGate: boolean;
  preauditGateFailures: string[];
  visionReasoning: string | null;
  designGapEvidence: string[];
  pdpScreenPaths: Record<string, string> | null;
}

interface CandidateRecord {
  rank: number;
  domain: string;
  siteUrl: string;
  heroProductUrl: string | null;
  heroUrlSource: "ad_landing" | "catalog_flagship" | null;
  discoveryRoute: DiscoveryRoute;
  branch: ProductArchetypeId;
  branchLabel: string;
  familyId: string;
  familyLabel: string;
  platform: string | null;
  businessType: string | null;
  commerceModel: string;
  companyScaleFit: number | null;
  companyScaleBand: string | null;
  businessMaturity: number | null;
  estimatedCatalogSize: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  catalogBandLabel: string | null;
  ownBrandSignal: number | null;
  heroProduct: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  heroScore: number | null;
  priceBand: string | null;
  priceBandLabel: string | null;
  googleAdsEvidence: {
    keywords: string[];
    landingUrls: string[];
    sellerResolution: string | null;
  };
  assetContentAvailability: number | null;
  currentContentPresentation: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGapProxy: number | null;
  estimatedContrastCeiling: number | null;
  previewCasePotential: number | null;
  passesPreauditGate: boolean;
  highTicketFocusedFitScore: number | null;
  currentPdpWeaknessProxy: number | null;
  evidence: string[];
  penalties: Array<{ reason: string; points: number }>;
  screenshots: Record<string, string> | null;
}

interface DesignGapReport {
  milestone: string;
  version: string;
  profileVersion: string;
  runId: string;
  startedAt: string;
  finishedAt: string;
  regression: ReturnType<typeof runDesignGapRegression>;
  discoveryRoutes: {
    adsFirst: number;
    shoppingFirst: number;
    brandFirst: number;
  };
  discovery: Record<string, unknown>;
  keywords: unknown[];
  funnel: Record<DesignGapFunnelStage, number>;
  candidates: CandidateRecord[];
  ranked: CandidateRecord[];
  manualReview: CandidateRecord[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    keywordIdeas: number;
    serp: number;
    visionScreens: number;
    designGapScreens: number;
    costPerCandidate: number | null;
    lightChecks: number;
    catalogChecks: number;
    heroResolutions: number;
  };
  downstream: Record<string, number>;
}

type BudgetTracker = { spent: number; cap: number };

function canSpend(budget: BudgetTracker, estimate: number): boolean {
  return budget.spent + estimate <= budget.cap + 1e-9;
}

function approvedForDiscovery(status: KeywordProspectStatus, qualityScore: number): boolean {
  if (status === "APPROVED") return true;
  return status === "MARGINAL" && qualityScore >= 26;
}

function buildRoutedKeywords(selected: FamilyKeyword[]): RoutedKeyword[] {
  const sorted = [...selected];
  const shoppingSlots = Math.ceil(sorted.length * M95_DISCOVERY.shoppingFirstShare);
  return sorted.map((keyword, index) => {
    const shoppingFirst = index < shoppingSlots;
    const serpQuery =
      shoppingFirst && !keyword.keyword.includes("kopen")
        ? `${keyword.keyword} kopen`
        : keyword.keyword;
    return {
      ...keyword,
      discoveryRoute: shoppingFirst ? "shopping_first" : "ads_first",
      serpQuery,
    };
  });
}

function emptyDomain(input: {
  domain: string;
  brandId: string | null;
  brandName: string;
  discoveryRoute: DiscoveryRoute;
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  sellerResolution: string | null;
}): DiscoveredDomain {
  return {
    ...input,
    landingUrls: [],
    keywords: [],
    prospectClass: "UNKNOWN",
    gateEligible: false,
    gateReason: null,
    businessType: null,
    platform: null,
    isEcommerce: null,
    retailerScaleScore: null,
    businessMaturityScore: null,
    ownBrandSignal: null,
    ownBrandEvidence: [],
    homepageProductLinks: 0,
    homepageCategoryLinks: 0,
    retailerBreadthScore: null,
    internationalPresenceScore: null,
    catalogFocusScore: null,
    catalogVerified: false,
    estimatedCatalogSize: null,
    catalogEvidence: [],
    adProducts: [],
    heroes: [],
    pdpWeaknessScore: null,
    assetReadinessProxy: null,
    deepDivePdpFitProxy: null,
    heroUrlIsProductPage: false,
    companyScaleFitScore: null,
    companyScaleBand: null,
    companyScaleEvidence: [],
    estimatedContrastCeiling: null,
    contrastCeilingEvidence: [],
    highTicketFitScore: null,
    priceBand: null,
    priceBandLabel: null,
    catalogBandLabel: null,
    fitEvidence: [],
    fitPenalties: [],
    lightChecked: false,
    economicPrequalified: false,
    designGapScreened: false,
    preauditVisualGap: null,
    preauditPurchaseGap: null,
    contentAvailableScore: null,
    contentPresentationQuality: null,
    mobileGapProxy: null,
    previewCasePotential: null,
    passesPreauditGate: false,
    preauditGateFailures: [],
    visionReasoning: null,
    designGapEvidence: [],
    pdpScreenPaths: null,
  };
}

async function loadStoredClassifications(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  domains: string[]
): Promise<
  Map<
    string,
    {
      business_type: string | null;
      platform: string | null;
      is_ecommerce: boolean | null;
      manual_excluded: boolean | null;
      retailer_scale_score: number | null;
      business_maturity_score: number | null;
      own_brand_signal_score: number | null;
      business_classifier_version: string | null;
      classification_needs_recompute: boolean | null;
    }
  >
> {
  const result = new Map<string, Record<string, unknown>>();
  if (domains.length === 0) return result as Map<string, never>;

  for (let index = 0; index < domains.length; index += 100) {
    const chunk = domains.slice(index, index + 100);
    const { data, error } = await supabase
      .from("brands")
      .select(
        "normalized_domain, business_type, platform, is_ecommerce, manual_excluded, retailer_scale_score, business_maturity_score, own_brand_signal_score, business_classifier_version, classification_needs_recompute"
      )
      .in("normalized_domain", chunk);
    if (error) throw new Error(`classification load failed: ${error.message}`);
    for (const row of data ?? []) {
      result.set(String(row.normalized_domain), row);
    }
  }
  return result as Map<string, never>;
}

function computeMobileGapProxy(
  purchaseGap: number,
  purchaseSignals: ReturnType<typeof extractPurchaseGapSignals>
): number {
  let mobile = purchaseGap * 0.55 + 18;
  if (!purchaseSignals.mobileAtcSignal) mobile += 12;
  if (!purchaseSignals.stickyAtcSignal) mobile += 8;
  if (!purchaseSignals.hasAddToCart) mobile += 6;
  return Math.max(0, Math.min(100, Math.round(mobile)));
}

function passesEconomicPrescreen(entry: DiscoveredDomain): boolean {
  if (!entry.gateEligible) return false;
  if ((entry.highTicketFitScore ?? 0) < ECONOMIC_PRESCREEN_THRESHOLDS.minHighTicketFit) return false;
  if ((entry.ownBrandSignal ?? 0) < ECONOMIC_PRESCREEN_THRESHOLDS.minOwnBrandSignal) return false;
  if ((entry.assetReadinessProxy ?? 0) < ECONOMIC_PRESCREEN_THRESHOLDS.minAssetProxy) return false;
  const heroPrice = entry.heroes[0]?.price ?? 0;
  if (heroPrice > 0 && heroPrice < ECONOMIC_PRESCREEN_THRESHOLDS.minHeroPricePreferred) return false;
  if (entry.businessType !== "BRAND" && entry.businessType !== "SPECIALIST_WEBSHOP") return false;
  return true;
}

function toCandidate(entry: DiscoveredDomain, index: number): CandidateRecord {
  return {
    rank: index + 1,
    domain: entry.domain,
    siteUrl: `https://${entry.domain}`,
    heroProductUrl: entry.heroUrlIsProductPage ? (entry.heroes[0]?.url ?? null) : null,
    heroUrlSource: entry.heroUrlIsProductPage ? "ad_landing" : null,
    discoveryRoute: entry.discoveryRoute,
    branch: entry.archetypeId,
    branchLabel: ARCHETYPE_BY_ID.get(entry.archetypeId)?.label ?? entry.archetypeId,
    familyId: entry.familyId,
    familyLabel: entry.familyLabel,
    platform: entry.platform,
    businessType: entry.businessType,
    commerceModel:
      (entry.ownBrandSignal ?? 0) >= 72
        ? "DTC_OWN_BRAND"
        : (entry.ownBrandSignal ?? 0) >= 58
          ? "MOSTLY_OWN_BRAND"
          : (entry.ownBrandSignal ?? 0) >= 45
            ? "MIXED"
            : "SPECIALIST_RESELLER",
    companyScaleFit: entry.companyScaleFitScore,
    companyScaleBand: entry.companyScaleBand,
    businessMaturity: entry.businessMaturityScore,
    estimatedCatalogSize: entry.estimatedCatalogSize,
    catalogFocusScore: entry.catalogFocusScore,
    catalogVerified: entry.catalogVerified,
    catalogBandLabel: entry.catalogBandLabel,
    ownBrandSignal: entry.ownBrandSignal,
    heroProduct: entry.heroes[0]?.title ?? null,
    heroPrice: entry.heroes[0]?.price ?? null,
    heroCurrency: entry.heroes[0]?.currency ?? null,
    heroScore: entry.heroes[0]?.heroScore ?? null,
    priceBand: entry.priceBand,
    priceBandLabel: entry.priceBandLabel,
    googleAdsEvidence: {
      keywords: entry.keywords,
      landingUrls: entry.landingUrls.slice(0, 3),
      sellerResolution: entry.sellerResolution,
    },
    assetContentAvailability: entry.contentAvailableScore ?? entry.assetReadinessProxy,
    currentContentPresentation: entry.contentPresentationQuality,
    preauditVisualGap: entry.preauditVisualGap,
    preauditPurchaseGap: entry.preauditPurchaseGap,
    mobileGapProxy: entry.mobileGapProxy,
    estimatedContrastCeiling: entry.estimatedContrastCeiling,
    previewCasePotential: entry.previewCasePotential,
    passesPreauditGate: entry.passesPreauditGate,
    highTicketFocusedFitScore: entry.highTicketFitScore,
    currentPdpWeaknessProxy: entry.pdpWeaknessScore,
    evidence: [...entry.fitEvidence, ...entry.designGapEvidence],
    penalties: entry.fitPenalties,
    screenshots: entry.pdpScreenPaths,
  };
}

export async function runDesignGapDiscovery(options?: { dryRun?: boolean }): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);

  const dfsBudget: BudgetTracker = { spent: 0, cap: env.M95_MAX_DATAFORSEO_COST };
  const anthropicBudget: BudgetTracker = { spent: 0, cap: env.M95_MAX_ANTHROPIC_COST };
  const startedAt = new Date().toISOString();

  const regression = runDesignGapRegression();
  console.log(`\n=== M9.5 DESIGN-GAP-FIRST HIGH-TICKET DISCOVERY (${M95_DISCOVERY_VERSION}) ===`);
  console.log(
    `Regression: ${regression.passed}/${regression.total} (ranking ${regression.rankingOk ? "OK" : "FAIL"})`
  );
  console.log(
    `DataForSEO cap: $${dfsBudget.cap.toFixed(3)} · Anthropic cap: $${anthropicBudget.cap.toFixed(3)}\n`
  );

  const ideasBudget = 0.04;
  const expansion = await expandFamilyKeywords({
    branches: DESIGN_GAP_BRANCHES,
    client: dataForSeo,
    env,
    ideasLimit: M95_DISCOVERY.keywordIdeasLimit,
    allowIdeas: !options?.dryRun && canSpend(dfsBudget, ideasBudget),
  });
  dfsBudget.spent += expansion.ideasCost;

  const selected = selectProductionKeywords(expansion.keywords, {
    maxTotal: M95_DISCOVERY.maxKeywords,
    maxPerFamily: M95_DISCOVERY.maxKeywordsPerFamily,
    branches: DESIGN_GAP_BRANCHES,
  });
  const routed = buildRoutedKeywords(selected);

  console.log(
    `Stap 1 — ${routed.length} keywords (${routed.filter((k) => k.discoveryRoute === "shopping_first").length} shopping-first)`
  );

  if (options?.dryRun) {
    for (const keyword of routed) {
      console.log(
        `  ${keyword.discoveryRoute.padEnd(14)} ${keyword.archetypeId.padEnd(20)} · ${keyword.serpQuery}`
      );
    }
    console.log(
      `\nDry run: geschat $${(routed.length * M95_DISCOVERY.estimatedSerpCostPerKeyword + expansion.ideasCost).toFixed(4)}\n`
    );
    return;
  }

  const persisted = (
    await persistFamilyKeywords(supabase, selected)
  ).filter((keyword): keyword is FamilyKeyword & { id: string } => keyword.id !== null);

  const routedByKeyword = new Map(
    routed.map((keyword) => [keyword.keyword, keyword])
  );

  const run = await createRun(supabase, "design_gap_discovery", {
    milestone: M95_DISCOVERY.milestone,
    version: M95_DISCOVERY_VERSION,
    profile: M95_DISCOVERY.profile,
    keywords: persisted.map((keyword) => keyword.keyword),
    maxDataForSeoCost: dfsBudget.cap,
    maxAnthropicCost: anthropicBudget.cap,
  });
  const runId = run.id;

  const domainIndex = new Map<string, DiscoveredDomain>();
  const keywordOutcomes: unknown[] = [];
  const sellerCache = new Map<string, SellerDomainResolution>();
  let serpSpend = 0;
  let recoveredSellerTotal = 0;

  console.log("Stap 2 — SERP (ads-first + shopping-first routes)");
  for (const keyword of persisted) {
    const routedKeyword = routedByKeyword.get(keyword.keyword);
    const serpQuery = routedKeyword?.serpQuery ?? keyword.keyword;
    const route: DiscoveryRoute = routedKeyword?.discoveryRoute ?? "ads_first";

    if (!canSpend(dfsBudget, M95_DISCOVERY.estimatedSerpCostPerKeyword)) continue;

    let serp;
    try {
      serp = await fetchGooglePaidAds({ client: dataForSeo, env }, serpQuery);
    } catch (error) {
      console.log(`  ${serpQuery}: SERP mislukt`);
      continue;
    }

    dfsBudget.spent += serp.cost;
    serpSpend += serp.cost;

    const recovery = await recoverShoppingSellerAds(serp.unresolvedShoppingAds, {
      timeoutMs: M95_DISCOVERY.sellerProbeTimeoutMs,
      cache: sellerCache,
      maxSellers: M95_DISCOVERY.maxSellerProbesPerKeyword,
    });
    recoveredSellerTotal += recovery.recovered.length;

    const paidAds = [...serp.paidAds, ...recovery.recovered];
    const sample: string[] = [];
    const seenDomains = new Set<string>();
    const pendingDomains: DiscoveredDomain[] = [];

    for (const ad of paidAds) {
      const signal = classifySerpSignal({ serpItemType: ad.serpItemType, rawItem: ad.rawItem });
      if (signal.adSignalType === "NON_PAID") continue;

      if (!seenDomains.has(ad.normalizedDomain)) {
        seenDomains.add(ad.normalizedDomain);
        sample.push(ad.normalizedDomain);
      }
      if (isBlacklistedDomain(ad.normalizedDomain)) continue;

      const isShopping =
        String(ad.serpItemType).toLowerCase().includes("shopping") ||
        recovery.recovered.some((item) => item.normalizedDomain === ad.normalizedDomain);
      const domainRoute: DiscoveryRoute = isShopping ? "shopping_first" : route;

      const brandName = ad.brandName?.trim() || ad.normalizedDomain;
      const isConfirmed = signal.adSignalType === "CONFIRMED_PAID";

      const { brand } = await upsertBrandFromAd(supabase, {
        name: brandName,
        domain: ad.advertiserDomain,
        normalizedDomain: ad.normalizedDomain,
        seenAt: ad.timestamp,
        confirmedGoogleAdvertiser: isConfirmed,
        confirmationSource: isConfirmed ? signal.confirmationSource : null,
      });

      await storeAdOccurrence(supabase, {
        runId,
        keywordId: keyword.id,
        brandId: brand.id,
        ad,
        source: SOURCE,
        signal,
      });

      let entry = domainIndex.get(ad.normalizedDomain);
      if (!entry) {
        entry = emptyDomain({
          domain: ad.normalizedDomain,
          brandId: brand.id,
          brandName,
          discoveryRoute: domainRoute,
          archetypeId: keyword.archetypeId,
          familyId: keyword.familyId,
          familyLabel: keyword.familyLabel,
          sellerResolution:
            (ad.rawItem as { seller_domain_resolution?: string } | null)?.seller_domain_resolution ??
            null,
        });
        domainIndex.set(ad.normalizedDomain, entry);
        pendingDomains.push(entry);
      }
      if (!entry.keywords.includes(keyword.keyword)) entry.keywords.push(keyword.keyword);
      const landingUrl = ad.landingUrl;
      if (landingUrl && !entry.landingUrls.includes(landingUrl)) entry.landingUrls.push(landingUrl);

      const adProduct = extractAdProduct(ad);
      if (adProduct && !entry.adProducts.some((item) => item.title === adProduct.title)) {
        entry.adProducts.push(adProduct);
      }
    }

    const stored = await loadStoredClassifications(supabase, sample);
    const quality = computeSerpProspectQuality(
      sample.map((domain) => ({
        domain,
        businessType: (stored.get(domain)?.business_type as string | null) ?? null,
      })),
      { archetypeTooBroad: keyword.archetypeFit < 40, coldStart: true }
    );

    const approved = approvedForDiscovery(quality.status, quality.prospectSerpQualityScore);
    if (!approved) {
      for (const entry of pendingDomains) domainIndex.delete(entry.domain);
    }

    keywordOutcomes.push({
      keyword: keyword.keyword,
      serpQuery,
      discoveryRoute: route,
      approvedForDiscovery: approved,
      serpQualityScore: quality.prospectSerpQualityScore,
      domains: sample,
      recoveredSellers: recovery.recovered.length,
      cost: serp.cost,
    });

    console.log(
      `  ${approved ? "OK" : "STOP"} ${route.padEnd(14)} ${serpQuery} · $${serp.cost.toFixed(4)}`
    );
  }

  const stored = await loadStoredClassifications(supabase, [...domainIndex.keys()]);
  const crawlTimeout = Math.min(env.CRAWLER_TIMEOUT_MS, 20000);
  let lightChecks = 0;
  let catalogChecks = 0;
  let heroResolutions = 0;
  let designGapScreens = 0;
  let visionScreens = 0;

  console.log("\nStap 3 — prospect gate + cheap qualification");
  for (const entry of domainIndex.values()) {
    const known = stored.get(entry.domain);
    const verdict = classifyProspectExclusion({
      domain: entry.domain,
      businessType: known?.business_type as string | null,
      isEcommerce: known?.is_ecommerce as boolean | null,
      manualExcluded: known?.manual_excluded as boolean | null,
      retailerScaleScore: known?.retailer_scale_score as number | null,
      businessMaturityScore: known?.business_maturity_score as number | null,
    });
    entry.prospectClass = verdict.prospectClass;
    entry.gateEligible = verdict.eligible;
    entry.gateReason = verdict.reason;
    entry.businessType = (known?.business_type as string | null) ?? null;
    entry.platform = (known?.platform as string | null) ?? null;
    entry.businessMaturityScore = (known?.business_maturity_score as number | null) ?? null;
    entry.ownBrandSignal = (known?.own_brand_signal_score as number | null) ?? null;

    if (!entry.gateEligible) continue;

    if (lightChecks < M95_DISCOVERY.maxLightChecks) {
      lightChecks += 1;
      try {
        const check = await runLightBrandCheck(entry.domain, crawlTimeout);
        entry.lightChecked = true;
        entry.businessType = check.businessType;
        entry.platform = check.platform;
        entry.isEcommerce = check.isEcommerce;
        entry.retailerScaleScore = check.retailerScaleScore;
        entry.ownBrandSignal = check.ownBrandSignal;
        entry.ownBrandEvidence = check.ownBrandEvidence;
        entry.homepageProductLinks = check.productLinks;
        entry.homepageCategoryLinks = check.categoryLinks;
        entry.retailerBreadthScore = check.retailerBreadthScore;
        entry.internationalPresenceScore = check.internationalPresenceScore;
        entry.gateEligible = check.gateEligible;
        entry.gateReason = check.gateReason;
      } catch {
        // keep stored classification
      }
    }

    if (!entry.gateEligible) continue;

    if (catalogChecks < M95_DISCOVERY.maxCatalogChecks) {
      catalogChecks += 1;
      try {
        const catalog = await runCatalogFocusCheck(
          entry.domain,
          crawlTimeout,
          entry.homepageProductLinks,
          entry.homepageCategoryLinks
        );
        entry.catalogFocusScore = catalog.catalogFocusScore;
        entry.catalogVerified = catalog.verified;
        entry.estimatedCatalogSize = catalog.estimatedCatalogSize;
        entry.catalogEvidence = catalog.evidence;
      } catch {
        // optional
      }
    }

    if (entry.isEcommerce === false) {
      entry.gateEligible = false;
      continue;
    }

    if (heroResolutions < M95_DISCOVERY.maxHeroResolutions) {
      heroResolutions += 1;
      const resolved = await resolveHeroProducts({
        domain: entry.domain,
        landingUrls: entry.landingUrls,
        adProducts: entry.adProducts,
        keyword: entry.keywords[0] ?? null,
        keywords: entry.keywords,
        timeoutMs: crawlTimeout,
        maxHeroes: M95_DISCOVERY.maxHeroesPerDomain,
      });
      entry.heroes = resolved.heroes;
      entry.pdpWeaknessScore = resolved.pdpWeaknessScore;
      entry.assetReadinessProxy = resolved.assetReadinessProxy;
      const hero = entry.heroes[0];
      entry.heroUrlIsProductPage = hero ? isUsableHeroUrl(hero.url, entry.domain) : false;
    }

    const scale = computeCompanyScaleFit({
      businessType: entry.businessType,
      isEcommerce: entry.isEcommerce,
      retailerScaleScore: entry.retailerScaleScore,
      retailerBreadthScore: entry.retailerBreadthScore,
      businessMaturityScore: entry.businessMaturityScore,
      internationalPresenceScore: entry.internationalPresenceScore,
      estimatedCatalogSize: entry.estimatedCatalogSize,
      homepageProductLinks: entry.homepageProductLinks,
      ownBrandSignal: entry.ownBrandSignal,
    });
    entry.companyScaleFitScore = scale.companyScaleFitScore;
    entry.companyScaleBand = scale.band;
    entry.companyScaleEvidence = scale.evidence;

    entry.deepDivePdpFitProxy = computeDeepDivePdpFitProxy({
      archetypeId: entry.archetypeId,
      catalogFocusScore: entry.catalogFocusScore ?? 50,
      heroScore: entry.heroes[0]?.heroScore ?? null,
    });

    const ceiling = estimateContrastCeiling({
      pdpWeaknessProxy: entry.pdpWeaknessScore,
      assetReadinessProxy: entry.assetReadinessProxy,
      deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
      ownBrandSignal: entry.ownBrandSignal,
      heroPrice: entry.heroes[0]?.price ?? null,
    });
    entry.estimatedContrastCeiling = ceiling.estimatedContrastCeiling;
    entry.contrastCeilingEvidence = ceiling.evidence;

    const fit = computeHighTicketFocusedFit({
      domain: entry.domain,
      businessType: entry.businessType,
      prospectClass: entry.prospectClass,
      estimatedCatalogSize: entry.estimatedCatalogSize,
      catalogFocusScore: entry.catalogFocusScore,
      catalogVerified: entry.catalogVerified,
      ownBrandSignal: entry.ownBrandSignal,
      companyScaleFitScore: scale.companyScaleFitScore,
      assetReadinessProxy: entry.assetReadinessProxy,
      deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
      pdpWeaknessProxy: entry.pdpWeaknessScore,
      heroScore: entry.heroes[0]?.heroScore ?? null,
      heroPrice: entry.heroes[0]?.price ?? null,
      adKeywordCount: entry.keywords.length,
      retailerBreadthScore: entry.retailerBreadthScore,
      businessMaturityScore: entry.businessMaturityScore,
    });
    entry.highTicketFitScore = fit.highTicketFocusedFitScore;
    entry.priceBand = fit.priceBand;
    entry.priceBandLabel = fit.priceBandLabel;
    entry.catalogBandLabel = fit.catalogBandLabel;
    entry.fitEvidence = [...fit.evidence, ...scale.evidence];
    entry.fitPenalties = fit.penalties;

    entry.economicPrequalified = passesEconomicPrescreen(entry);
  }

  const economicPool = [...domainIndex.values()].filter((entry) => entry.economicPrequalified);
  console.log(`  economic prequalified: ${economicPool.length}`);

  console.log("\nStap 4 — cheap PDP design-gap screen");
  await mkdir(SCREENSHOT_DIR, { recursive: true });

  const screenPool = economicPool
    .sort((a, b) => (b.highTicketFitScore ?? 0) - (a.highTicketFitScore ?? 0))
    .slice(0, M95_DISCOVERY.maxEconomicPrequalified);

  for (const entry of screenPool) {
    if (designGapScreens >= M95_DISCOVERY.maxDesignGapScreens) break;

    let pdpUrl = entry.heroUrlIsProductPage ? entry.heroes[0]?.url : null;
    if (!pdpUrl) {
      const flagship = await resolveFlagshipProduct(
        entry.domain,
        crawlTimeout,
        entry.heroes[0]?.title ?? null
      );
      if (flagship) {
        pdpUrl = flagship.url;
        entry.heroUrlIsProductPage = true;
        entry.heroes = [
          {
            url: flagship.url,
            title: flagship.title,
            brand: null,
            price: flagship.price,
            currency: "EUR",
            heroScore: entry.heroes[0]?.heroScore ?? 60,
            heroConfidence: 0.6,
            evidence: ["catalog_flagship_fallback"],
            source: "landing_linked_product",
          },
          ...entry.heroes,
        ];
      }
    }
    if (!pdpUrl) continue;

    designGapScreens += 1;
    const crawl = await crawlWebsite(pdpUrl, crawlTimeout);
    if (crawl.status !== "success" || crawl.html.length < 200) continue;

    const html = crawl.html;
    const weaknessSignals = pdpWeaknessSignalsFromHtml(html, pdpUrl, entry.platform);
    const weakness = computeCurrentPdpWeaknessProxy(weaknessSignals);
    entry.pdpWeaknessScore = weakness.score;

    const contentSignals = extractContentPresentationSignals(html);
    const contentGap = computeContentPresentationGap(contentSignals);
    entry.contentAvailableScore = contentGap.contentAvailableScore;
    entry.contentPresentationQuality = contentGap.contentPresentationQuality;

    const purchaseSignals = extractPurchaseGapSignals(html);
    const purchaseGap = computePreauditPurchaseGap({ html, ...purchaseSignals });
    entry.preauditPurchaseGap = purchaseGap.score;

    const visualGap = computePreauditVisualGap({
      html,
      url: pdpUrl,
      platform: entry.platform,
      bodyTextLength: contentSignals.bodyTextLength,
      imageCount: contentSignals.imageCount,
      sectionCount: countDomSections(html),
      pdpWeaknessProxy: weakness.score,
      estimatedContrastCeiling: entry.estimatedContrastCeiling,
    });
    entry.preauditVisualGap = visualGap.score;
    entry.mobileGapProxy = computeMobileGapProxy(purchaseGap.score, purchaseSignals);
    entry.designGapEvidence = [
      ...visualGap.evidence.slice(0, 4),
      ...purchaseGap.evidence.slice(0, 4),
      ...contentGap.evidence.slice(0, 3),
    ];
    entry.designGapScreened = true;

    const paths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: entry.domain,
      timeoutMs: M95_SCREENSHOT_CONFIG.timeoutMs,
      shots: [
        {
          key: "pdp-desktop-1440x1000",
          url: pdpUrl,
          viewport: M95_SCREENSHOT_CONFIG.desktop,
        },
        {
          key: "pdp-mobile-390x844",
          url: pdpUrl,
          viewport: M95_SCREENSHOT_CONFIG.mobile,
        },
      ],
    });
    entry.pdpScreenPaths = paths;

    if (
      visionScreens < M95_DISCOVERY.maxVisionScreens &&
      canSpend(anthropicBudget, 0.01) &&
      paths["pdp-desktop-1440x1000"]
    ) {
      try {
        const vision = await screenPdpViewportWithVision(
          env,
          entry.domain,
          paths["pdp-desktop-1440x1000"]
        );
        anthropicBudget.spent += vision.estimatedCost;
        visionScreens += 1;
        entry.preauditVisualGap = Math.max(
          0,
          Math.min(100, (entry.preauditVisualGap ?? 0) + vision.visualAdjustment)
        );
        entry.preauditPurchaseGap = Math.max(
          0,
          Math.min(100, (entry.preauditPurchaseGap ?? 0) + vision.purchaseAdjustment)
        );
        entry.mobileGapProxy = Math.max(
          0,
          Math.min(100, (entry.mobileGapProxy ?? 0) + vision.mobileAdjustment)
        );
        if (vision.presentationQuality != null) {
          entry.contentPresentationQuality = vision.presentationQuality;
        }
        entry.visionReasoning = vision.reasoning;
        entry.designGapEvidence.push(`vision:${vision.reasoning.slice(0, 60)}`);
      } catch (error) {
        logger.warn("Vision screen failed", {
          domain: entry.domain,
          error: error instanceof Error ? error.message : "unknown",
        });
      }
    }

    const polishedPenalty =
      (entry.contentPresentationQuality ?? 0) >= 72
        ? 14
        : (entry.contentPresentationQuality ?? 0) >= 62
          ? 8
          : 0;

    const preview = computePreviewCasePotential({
      highTicketFocusedFit: entry.highTicketFitScore,
      heroPrice: entry.heroes[0]?.price ?? null,
      assetReadinessProxy: entry.assetReadinessProxy,
      contentAvailableScore: entry.contentAvailableScore,
      contentPresentationQuality: entry.contentPresentationQuality,
      preauditVisualGap: entry.preauditVisualGap,
      preauditPurchaseGap: entry.preauditPurchaseGap,
      mobileGapProxy: entry.mobileGapProxy,
      estimatedContrastCeiling: entry.estimatedContrastCeiling,
      businessMaturity: entry.businessMaturityScore,
      ownBrandSignal: entry.ownBrandSignal,
      alreadyPolishedPenalty: polishedPenalty,
    });
    entry.previewCasePotential = preview.score;
    entry.passesPreauditGate = preview.passesPreauditGate;
    entry.preauditGateFailures = preview.gateFailures;
  }

  const gatePassed = [...domainIndex.values()].filter((entry) => entry.gateEligible);
  const economicPrequalified = gatePassed.filter((entry) => entry.economicPrequalified);
  const designGapScreened = gatePassed.filter((entry) => entry.designGapScreened);
  const preauditGatePassed = designGapScreened.filter((entry) => entry.passesPreauditGate);

  const funnel: Record<DesignGapFunnelStage, number> = {
    raw_advertisers: domainIndex.size,
    prospect_eligible: gatePassed.length,
    economic_prequalified: economicPrequalified.length,
    design_gap_screened: designGapScreened.length,
    preaudit_gate_passed: preauditGatePassed.length,
    design_gap_candidate: preauditGatePassed.length,
  };

  const routeCounts = { adsFirst: 0, shoppingFirst: 0, brandFirst: 0 };
  for (const entry of domainIndex.values()) {
    if (entry.discoveryRoute === "ads_first") routeCounts.adsFirst += 1;
    else if (entry.discoveryRoute === "shopping_first") routeCounts.shoppingFirst += 1;
    else routeCounts.brandFirst += 1;
  }

  const pool = designGapScreened
    .slice()
    .sort((a, b) => (b.previewCasePotential ?? 0) - (a.previewCasePotential ?? 0));

  const candidates = pool.slice(0, M95_DISCOVERY.maxCandidates).map(toCandidate);
  const ranked = candidates.slice(0, M95_DISCOVERY.maxRanked).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const manualReview = ranked.slice(0, M95_DISCOVERY.maxScreenshots);
  console.log("\nStap 5 — homepage screenshots voor top 5");
  for (const candidate of manualReview) {
    const homePaths = await captureViewportScreenshots({
      outputDir: SCREENSHOT_DIR,
      domain: candidate.domain,
      timeoutMs: M95_SCREENSHOT_CONFIG.timeoutMs,
      shots: [
        {
          key: "homepage-desktop-1440x1000",
          url: candidate.siteUrl,
          viewport: M95_SCREENSHOT_CONFIG.desktop,
        },
      ],
    });
    candidate.screenshots = { ...candidate.screenshots, ...homePaths };
  }

  const report: DesignGapReport = {
    milestone: M95_DISCOVERY.milestone,
    version: M95_DISCOVERY_VERSION,
    profileVersion: DESIGN_GAP_PROFILE_VERSION,
    runId,
    startedAt,
    finishedAt: new Date().toISOString(),
    regression,
    discoveryRoutes: routeCounts,
    discovery: {
      profile: M95_DISCOVERY.profile,
      branches: DESIGN_GAP_BRANCHES.map((branch) => branch.archetypeId),
      parkedArchetypes: PARKED_FOR_M95,
      keywordsGenerated: routed.length,
      keywordsRejected: expansion.rejected.slice(0, 30) as RejectedKeyword[],
      shoppingSellersResolved: recoveredSellerTotal,
    },
    keywords: keywordOutcomes,
    funnel,
    candidates,
    ranked,
    manualReview,
    cost: {
      dataForSeo: Math.round(dfsBudget.spent * 10000) / 10000,
      dataForSeoCap: dfsBudget.cap,
      anthropic: Math.round(anthropicBudget.spent * 10000) / 10000,
      anthropicCap: anthropicBudget.cap,
      keywordIdeas: Math.round(expansion.ideasCost * 10000) / 10000,
      serp: Math.round(serpSpend * 10000) / 10000,
      visionScreens,
      designGapScreens,
      costPerCandidate:
        candidates.length > 0
          ? Math.round((dfsBudget.spent / candidates.length) * 10000) / 10000
          : null,
      lightChecks,
      catalogChecks,
      heroResolutions,
    },
    downstream: { croAudits: 0, conceptBriefs: 0, previews: 0, contactDiscovery: 0, outreach: 0 },
  };

  const serialized = JSON.stringify(report, null, 2);
  await writeFile(REPORT_PATH, serialized, "utf8");
  await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
  await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");

  await completeRun(supabase, runId, "completed", {
    candidates: candidates.length,
    dataForSeoCost: dfsBudget.spent,
    anthropicCost: anthropicBudget.spent,
  });

  printReport(report);
}

function printReport(report: DesignGapReport): void {
  console.log("\n=== DISCOVERY ROUTES ===");
  console.log(`  ads_first: ${report.discoveryRoutes.adsFirst}`);
  console.log(`  shopping_first: ${report.discoveryRoutes.shoppingFirst}`);
  console.log(`  brand_first: ${report.discoveryRoutes.brandFirst}`);

  console.log("\n=== FUNNEL ===");
  for (const [stage, count] of Object.entries(report.funnel)) {
    console.log(`  ${stage.padEnd(24)} ${count}`);
  }

  console.log("\n=== TOP 10 (preview_case_potential) ===");
  for (const candidate of report.ranked) {
    console.log(
      `\n  #${candidate.rank} ${candidate.domain} · preview ${candidate.previewCasePotential} · fit ${candidate.highTicketFocusedFitScore}`
    );
    console.log(
      `     route ${candidate.discoveryRoute} · visual gap ${candidate.preauditVisualGap} · purchase gap ${candidate.preauditPurchaseGap} · mobile ${candidate.mobileGapProxy}`
    );
    console.log(
      `     content avail ${candidate.assetContentAvailability} · presentation ${candidate.currentContentPresentation} · plafond ${candidate.estimatedContrastCeiling}`
    );
    console.log(
      `     hero ${candidate.heroProduct ?? "?"} ${candidate.heroPrice != null ? `EUR ${candidate.heroPrice}` : ""}`
    );
    console.log(`     gate ${candidate.passesPreauditGate ? "PASS" : "FAIL"}`);
  }

  console.log("\n=== TOP 5 MANUAL REVIEW ===");
  for (const candidate of report.manualReview) {
    console.log(`\n  ${candidate.domain}`);
    for (const [key, path] of Object.entries(candidate.screenshots ?? {})) {
      console.log(`     ${key}: ${path}`);
    }
  }

  console.log("\n=== COST ===");
  console.log(
    `  DataForSEO $${report.cost.dataForSeo.toFixed(4)} / $${report.cost.dataForSeoCap.toFixed(3)}`
  );
  console.log(
    `  Anthropic $${report.cost.anthropic.toFixed(4)} / $${report.cost.anthropicCap.toFixed(3)} (${report.cost.visionScreens} vision screens)`
  );
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runDesignGapDiscovery.js")
  : false;

if (invokedDirectly) {
  runDesignGapDiscovery({ dryRun: process.argv.includes("--dry-run") })
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
