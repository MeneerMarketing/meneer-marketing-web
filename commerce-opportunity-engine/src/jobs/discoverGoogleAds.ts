import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { isBlacklistedDomain } from "../config/blacklist.js";
import { classifySerpSignal } from "../config/signalClassification.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import {
  fetchGooglePaidAds,
  saveSerpFixture,
} from "../services/dataforseo/googleSerp.js";
import { checkGoogleAdsTransparency } from "../services/dataforseo/googleAdsTransparency.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import {
  loadActiveKeywords,
  seedDevelopmentKeywords,
  updateKeywordLastScanned,
} from "../services/supabase/keywordsRepository.js";
import {
  loadApprovedKeywordsForDiscovery,
  loadKeywordsByIds,
  markKeywordsScanned,
} from "../services/supabase/keywordIntelligenceRepository.js";
import { upsertBrandFromAd } from "../services/supabase/brandsRepository.js";
import { storeAdOccurrence } from "../services/supabase/adOccurrencesRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  countBrandsByBusinessCategory,
  countOccurrencesBySignal,
  getBrandActivityMetrics,
} from "../services/supabase/brandMetricsService.js";
import { reclassifyAllSignals } from "../services/supabase/signalReclassificationService.js";
import {
  applyTransparencyResult,
  selectDomainsForTransparencyCheck,
} from "../services/supabase/transparencyRepository.js";
import type { BrandActivityMetrics, DiscoveryRunStats } from "../types/discovery.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");

config({ path: resolve(projectRoot, ".env"), quiet: true });

const SOURCE = "dataforseo_google_serp_live";
const FIXTURE_DIR = resolve(projectRoot, "fixtures");
const PREFERRED_TRANSPARENCY_DOMAINS = ["boozyshop.nl", "haarshop.nl", "currentbody.nl"];

interface KeywordProcessResult {
  keywordId: string;
  keyword: string;
  paidAdsFound: number;
  keywordsWithAds: number;
  uniqueAdvertisers: Set<string>;
  blacklistedAdvertisers: number;
  newBrandIds: Set<string>;
  existingBrandIds: Set<string>;
  adOccurrencesStored: number;
  errors: number;
  cost: number;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

function printRankedAdvertisers(
  title: string,
  advertisers: BrandActivityMetrics[],
  mode: "confirmed" | "candidate"
): void {
  console.log(title);
  console.log("");

  if (advertisers.length === 0) {
    console.log("None in this run.");
    console.log("");
    return;
  }

  advertisers.forEach((advertiser, index) => {
    console.log(`${index + 1}. ${advertiser.normalizedDomain}`);
    if (mode === "confirmed") {
      console.log(`   Confirmed keywords: ${advertiser.confirmedPaidKeywords}`);
      console.log(`   Confirmed occurrences: ${advertiser.confirmedPaidOccurrences}`);
      if (advertiser.transparencyConfirmed) {
        console.log("   Transparency: confirmed");
      }
    } else {
      console.log(`   Candidate keywords: ${advertiser.candidatePaidKeywords}`);
      console.log(`   Candidate occurrences: ${advertiser.candidatePaidOccurrences}`);
    }
    console.log(`   Lead eligible: ${advertiser.leadEligible ? "yes" : "no"}`);
    console.log("");
  });
}

function printFinalReport(
  stats: DiscoveryRunStats,
  topConfirmed: BrandActivityMetrics[],
  topCandidates: BrandActivityMetrics[]
): void {
  console.log("");
  console.log("GOOGLE DISCOVERY COMPLETE");
  console.log("");
  console.log(`Keywords: ${stats.keywordsProcessed}`);
  console.log("");
  console.log("CONFIRMED PAID");
  console.log(`Search Ads: ${stats.confirmedSearchAds}`);
  console.log(`Sponsored Shopping: ${stats.confirmedSponsoredShopping}`);
  console.log(`Transparency confirmed: ${stats.transparencyConfirmed}`);
  console.log("");
  console.log("CANDIDATES");
  console.log(`Generic Shopping results: ${stats.genericShoppingCandidates}`);
  console.log(`Popular products: ${stats.popularProductsCandidates}`);
  console.log("");
  console.log(`Unique domains: ${stats.uniqueDomains}`);
  console.log("");
  console.log(`Lead eligible: ${stats.leadEligible}`);
  console.log(`Major retailers excluded: ${stats.majorRetailersExcluded}`);
  console.log(`Comparison sites excluded: ${stats.comparisonSitesExcluded}`);
  console.log("");
  console.log(`Reclassified occurrences: ${stats.reclassifiedOccurrences}`);
  console.log(`Transparency checks run: ${stats.transparencyChecksRun}`);
  console.log(`API cost: ${formatCost(stats.dataForSeoCost)}`);
  console.log(`  SERP cost: ${formatCost(stats.serpCost)}`);
  console.log(`  Transparency cost: ${formatCost(stats.transparencyCost)}`);
  console.log("");

  printRankedAdvertisers("TOP CONFIRMED ADVERTISERS", topConfirmed, "confirmed");
  printRankedAdvertisers("TOP PAID CANDIDATES", topCandidates, "candidate");
}

async function processKeyword(
  runId: string,
  keywordId: string,
  keyword: string,
  accumulatedCost: { value: number },
  maxCost: number
): Promise<KeywordProcessResult> {
  const env = loadEnv();
  const dataForSeoClient = createDataForSeoClient(env);
  const supabase = createSupabaseServerClient(env);

  const result: KeywordProcessResult = {
    keywordId,
    keyword,
    paidAdsFound: 0,
    keywordsWithAds: 0,
    uniqueAdvertisers: new Set<string>(),
    blacklistedAdvertisers: 0,
    newBrandIds: new Set<string>(),
    existingBrandIds: new Set<string>(),
    adOccurrencesStored: 0,
    errors: 0,
    cost: 0,
  };

  if (accumulatedCost.value >= maxCost) {
    logger.warn("Skipping keyword due to cost budget", { keyword, maxCost });
    result.errors += 1;
    return result;
  }

  try {
    const serpResult = await fetchGooglePaidAds(
      { client: dataForSeoClient, env },
      keyword
    );

    result.cost = serpResult.cost;
    accumulatedCost.value += serpResult.cost;

    if (!env.DATAFORSEO_SERP_FIXTURE_PATH) {
      const fixturePath = resolve(FIXTURE_DIR, `${keyword.replace(/\s+/g, "-")}.json`);
      await saveSerpFixture(fixturePath, serpResult.rawResponse);
    }

    const scannedAt = new Date().toISOString();
    let storedForKeyword = 0;

    for (const ad of serpResult.paidAds) {
      const signal = classifySerpSignal({
        serpItemType: ad.serpItemType,
        rawItem: ad.rawItem,
      });

      if (signal.adSignalType === "NON_PAID") {
        continue;
      }

      result.paidAdsFound += 1;

      if (isBlacklistedDomain(ad.normalizedDomain)) {
        result.blacklistedAdvertisers += 1;
        continue;
      }

      result.uniqueAdvertisers.add(ad.normalizedDomain);

      const brandName = ad.brandName?.trim() || ad.normalizedDomain;
      const isConfirmed = signal.adSignalType === "CONFIRMED_PAID";

      const { brand, isNew } = await upsertBrandFromAd(supabase, {
        name: brandName,
        domain: ad.advertiserDomain,
        normalizedDomain: ad.normalizedDomain,
        seenAt: ad.timestamp,
        confirmedGoogleAdvertiser: isConfirmed,
        confirmationSource: isConfirmed ? signal.confirmationSource : null,
      });

      if (isNew) {
        result.newBrandIds.add(brand.id);
      } else {
        result.existingBrandIds.add(brand.id);
      }

      const stored = await storeAdOccurrence(supabase, {
        runId,
        keywordId,
        brandId: brand.id,
        ad,
        source: SOURCE,
        signal,
      });

      if (stored) {
        result.adOccurrencesStored += 1;
        storedForKeyword += 1;
      }
    }

    if (storedForKeyword > 0) {
      result.keywordsWithAds = 1;
    }

    await updateKeywordLastScanned(supabase, keywordId, scannedAt);
  } catch (error) {
    result.errors += 1;
    logger.error("Keyword processing failed", {
      keyword,
      error: error instanceof Error ? error.message : "unknown error",
    });
  }

  return result;
}

async function runTransparencyChecks(
  accumulatedCost: { value: number },
  maxCost: number
): Promise<{ cost: number; checksRun: number }> {
  const env = loadEnv();
  if (!env.GOOGLE_ADS_CONFIRMATION_ENABLED) {
    return { cost: 0, checksRun: 0 };
  }

  const supabase = createSupabaseServerClient(env);
  const dataForSeoClient = createDataForSeoClient(env);
  const domains = await selectDomainsForTransparencyCheck(
    supabase,
    env.GOOGLE_ADS_CONFIRMATION_MAX_DOMAINS_PER_RUN,
    PREFERRED_TRANSPARENCY_DOMAINS
  );

  let cost = 0;
  let checksRun = 0;

  for (const domain of domains) {
    if (accumulatedCost.value >= maxCost) {
      logger.warn("Skipping transparency due to budget", { domain, maxCost });
      break;
    }

    try {
      const result = await checkGoogleAdsTransparency(
        { client: dataForSeoClient, env },
        domain
      );
      cost += result.cost;
      accumulatedCost.value += result.cost;
      checksRun += 1;
      await applyTransparencyResult(supabase, result);
    } catch (error) {
      logger.error("Transparency check failed", {
        domain,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  return { cost, checksRun };
}

export type GoogleAdsDiscoveryOptions = {
  /** Exact keyword set for controlled scale (bypasses approved/active loaders). */
  keywordIds?: string[];
  /** Skip Google Ads Transparency phase (selective transparency handled elsewhere). */
  skipTransparency?: boolean;
  /** Override SERP keyword cap. */
  maxKeywords?: number;
  /** Override SERP cost cap for this run. */
  maxSerpCost?: number;
  /** Skip auto-seed of development keywords. */
  skipSeedKeywords?: boolean;
};

export async function runGoogleAdsDiscovery(
  options: GoogleAdsDiscoveryOptions = {}
): Promise<DiscoveryRunStats> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);

  const reclassifyBefore = await reclassifyAllSignals(supabase);

  const approvedOnly = env.KEYWORD_DISCOVERY_APPROVED_ONLY;
  if (!options.keywordIds?.length && !options.skipSeedKeywords && !approvedOnly) {
    await seedDevelopmentKeywords(supabase);
  }

  const maxKeywords = options.maxKeywords ?? env.GOOGLE_DISCOVERY_MAX_KEYWORDS;
  const maxSerpCost = options.maxSerpCost ?? env.DATAFORSEO_MAX_COST_PER_RUN;

  let keywords: Array<{
    id: string;
    keyword: string;
    locale: string | null;
    category: string | null;
  }> = [];

  if (env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH) {
    keywords = [];
  } else if (options.keywordIds?.length) {
    keywords = await loadKeywordsByIds(supabase, options.keywordIds.slice(0, maxKeywords));
  } else if (approvedOnly) {
    keywords = await loadApprovedKeywordsForDiscovery(supabase, maxKeywords);
  } else {
    keywords = await loadActiveKeywords(
      supabase,
      maxKeywords,
      env.GOOGLE_DISCOVERY_KEYWORD_FILTER
    );
  }

  logger.info("Starting Google Ads discovery", {
    keywordCount: keywords.length,
    approvedOnly,
    explicitKeywordIds: Boolean(options.keywordIds?.length),
    skipSerp: env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH,
    skipTransparency: Boolean(options.skipTransparency),
    maxSerpCost,
    transparencyEnabled: env.GOOGLE_ADS_CONFIRMATION_ENABLED && !options.skipTransparency,
  });

  const run = await createRun(supabase, "google_ads_discovery", {
    keywordLimit: maxKeywords,
    skipSerpFetch: env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH,
    approvedOnly,
    controlledScale: Boolean(options.keywordIds?.length),
    skipTransparency: Boolean(options.skipTransparency),
  });

  const accumulatedCost = { value: 0 };
  let serpCost = 0;

  const aggregate: DiscoveryRunStats = {
    keywordsProcessed: 0,
    keywordsWithAds: 0,
    paidAdsFound: 0,
    uniqueAdvertisers: 0,
    blacklistedAdvertisers: 0,
    newBrands: 0,
    existingBrands: 0,
    adOccurrencesStored: 0,
    errors: 0,
    dataForSeoCost: 0,
    serpCost: 0,
    transparencyCost: 0,
    confirmedSearchAds: 0,
    confirmedSponsoredShopping: 0,
    transparencyConfirmed: 0,
    genericShoppingCandidates: 0,
    popularProductsCandidates: 0,
    uniqueDomains: 0,
    leadEligible: 0,
    majorRetailersExcluded: 0,
    comparisonSitesExcluded: 0,
    reclassifiedOccurrences: reclassifyBefore.occurrencesUpdated,
    transparencyChecksRun: 0,
  };

  if (keywords.length > 0) {
    const results = await mapWithConcurrency(
      keywords,
      env.DATAFORSEO_CONCURRENCY,
      async (keywordRow) =>
        processKeyword(
          run.id,
          keywordRow.id,
          keywordRow.keyword,
          accumulatedCost,
          maxSerpCost
        )
    );

    const allUniqueAdvertisers = new Set<string>();
    const allNewBrandIds = new Set<string>();
    const allExistingBrandIds = new Set<string>();

    for (const result of results) {
      aggregate.keywordsProcessed += 1;
      aggregate.keywordsWithAds += result.keywordsWithAds;
      aggregate.paidAdsFound += result.paidAdsFound;
      aggregate.blacklistedAdvertisers += result.blacklistedAdvertisers;
      aggregate.adOccurrencesStored += result.adOccurrencesStored;
      aggregate.errors += result.errors;
      serpCost += result.cost;

      for (const domain of result.uniqueAdvertisers) {
        allUniqueAdvertisers.add(domain);
      }
      for (const brandId of result.newBrandIds) {
        allNewBrandIds.add(brandId);
      }
      for (const brandId of result.existingBrandIds) {
        allExistingBrandIds.add(brandId);
      }
    }

    aggregate.uniqueAdvertisers = allUniqueAdvertisers.size;
    aggregate.newBrands = allNewBrandIds.size;
    aggregate.existingBrands = allExistingBrandIds.size;

    if (approvedOnly || options.keywordIds?.length) {
      await markKeywordsScanned(
        supabase,
        keywords.map((k) => k.id),
        new Date().toISOString()
      );
    }
  }

  if (!options.skipTransparency) {
    const transparency = await runTransparencyChecks(
      accumulatedCost,
      env.GOOGLE_ADS_CONFIRMATION_MAX_COST_PER_RUN
    );
    aggregate.transparencyCost = transparency.cost;
    aggregate.transparencyChecksRun = transparency.checksRun;
  }

  await reclassifyAllSignals(supabase);

  const signalCounts = await countOccurrencesBySignal(supabase);
  const brandCounts = await countBrandsByBusinessCategory(supabase);

  aggregate.confirmedSearchAds = signalCounts.confirmedSearchAds;
  aggregate.confirmedSponsoredShopping = signalCounts.confirmedSponsoredShopping;
  aggregate.genericShoppingCandidates = signalCounts.genericShoppingCandidates;
  aggregate.popularProductsCandidates = signalCounts.popularProductsCandidates;
  aggregate.uniqueDomains = brandCounts.uniqueDomains;
  aggregate.leadEligible = brandCounts.leadEligible;
  aggregate.majorRetailersExcluded = brandCounts.majorRetailersExcluded;
  aggregate.comparisonSitesExcluded = brandCounts.comparisonSitesExcluded;
  aggregate.transparencyConfirmed = brandCounts.transparencyConfirmed;
  aggregate.serpCost = serpCost;
  aggregate.dataForSeoCost = accumulatedCost.value;

  await completeRun(supabase, run.id, "completed", { ...aggregate });

  const topConfirmed = (
    await getBrandActivityMetrics(supabase, undefined, "CONFIRMED_PAID")
  ).slice(0, 10);
  const topCandidates = (
    await getBrandActivityMetrics(supabase, undefined, "PAID_CANDIDATE")
  ).slice(0, 10);

  printFinalReport(aggregate, topConfirmed, topCandidates);

  return { ...aggregate, runId: run.id };
}

async function main(): Promise<void> {
  try {
    await runGoogleAdsDiscovery();
    process.exit(0);
  } catch (error) {
    logger.error("Discovery job failed", {
      error: error instanceof Error ? error.message : "unknown error",
    });
    process.exit(1);
  }
}

const isDirectRun = process.argv[1]
  ? fileURLToPath(import.meta.url) === resolve(process.argv[1])
  : false;

if (isDirectRun) {
  main();
}