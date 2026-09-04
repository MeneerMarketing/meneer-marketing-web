import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTROLLED_SCALE_CATEGORIES } from "../config/controlledScale.js";
import { loadEnv } from "../config/env.js";
import { PAID_VERIFY_DEFAULTS } from "../config/paidVerify.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { checkGoogleAdsTransparency } from "../services/dataforseo/googleAdsTransparency.js";
import { fetchPaidRankedKeywords } from "../services/dataforseo/rankedPaidKeywords.js";
import { scoreCategoryRelevance } from "../services/keywords/categoryRelevance.js";
import { scoreDiscoveryPriority } from "../services/keywords/discoveryPriority.js";
import {
  categoryStatsToJson,
  computeCategoryUniqueStats,
} from "../services/qualification/categoryStats.js";
import {
  computeIntelligenceCompleteness,
  rankPrequalifiedForTransparency,
  scoreConfirmedForTargetResolution,
  scoreTargetPriority,
} from "../services/qualification/verificationRanking.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import {
  generateOpportunitiesFromPaidTargets,
  upsertPaidSearchTargets,
} from "../services/supabase/paidTargetsRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { applyTransparencyResult } from "../services/supabase/transparencyRepository.js";
import { classifyDataForSeoError } from "../utils/dataforseoErrors.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

interface BudgetTracker {
  spent: number;
  cap: number;
}

function remaining(b: BudgetTracker): number {
  return Math.max(0, b.cap - b.spent);
}

function canSpend(b: BudgetTracker, min = 0.005): boolean {
  return remaining(b) >= min;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    while (next < items.length) {
      const i = next;
      next += 1;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function daysAgo(iso: string | null | undefined): number | null {
  if (!iso) return null;
  return (Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000);
}

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dfs = createDataForSeoClient(env);

  const totalBudget: BudgetTracker = {
    spent: 0,
    cap: env.M721_MAX_DATAFORSEO_COST,
  };

  const report: Record<string, unknown> = {
    milestone: "7.2.1",
    faseA: {},
    verification: {},
    targets: {},
    bestProspects: [],
    costs: { dataforseo: 0, anthropic: 0 },
  };

  console.log("\n=== MILESTONE 7.2.1 — verify:prequalified ===");
  console.log("No keyword generation. No SERP discovery. No CRO. Anthropic $0.\n");

  // ------------------------------------------------------------------
  // Load latest M7.2 controlled scale run
  // ------------------------------------------------------------------
  const { data: scaleRun, error: scaleErr } = await supabase
    .from("controlled_scale_runs")
    .select("*")
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (scaleErr) throw new Error(scaleErr.message);
  if (!scaleRun) throw new Error("No completed controlled_scale_runs found. Run scale:controlled first.");

  const keywordIds: string[] = scaleRun.selected_keyword_ids ?? [];
  if (!keywordIds.length) throw new Error("Latest controlled scale run has no selected_keyword_ids.");

  console.log(`Using M7.2 run ${scaleRun.id} with ${keywordIds.length} keywords`);

  const parentRun = await createRun(supabase, "verify_prequalified", {
    milestone: "7.2.1",
    sourceControlledScaleRunId: scaleRun.id,
    keywordCount: keywordIds.length,
    maxDataForSeo: env.M721_MAX_DATAFORSEO_COST,
  });

  try {
    // ------------------------------------------------------------------
    // FASE A1 — Reset false NOT_RESOLVED from M7.2 402s
    // ------------------------------------------------------------------
    const { data: falseUnresolved } = await supabase
      .from("brands")
      .select("id, normalized_domain, transparency_status, transparency_checked_at")
      .eq("transparency_status", "NOT_RESOLVED")
      .is("transparency_checked_at", null);

    let resetCount = 0;
    for (const b of falseUnresolved ?? []) {
      await supabase
        .from("brands")
        .update({
          transparency_status: "NOT_CHECKED",
          transparency_api_status: "PAYMENT_REQUIRED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", b.id);
      resetCount += 1;
    }
    console.log(`Reset false NOT_RESOLVED (402 leftovers) → NOT_CHECKED: ${resetCount}`);

    // ------------------------------------------------------------------
    // FASE A2 — Category relevance + discovery priority v2 ($0)
    // ------------------------------------------------------------------
    const { data: keywords, error: kwErr } = await supabase
      .from("keywords")
      .select(
        `id, keyword, category, cluster, prospecting_value_score, keyword_quality_score,
         commercial_intent_score, product_intent_score, prospect_yield_score,
         unique_domains_found, retailer_ratio, prospecting_tier, keyword_intent_type`
      )
      .in("id", keywordIds);

    if (kwErr) throw new Error(kwErr.message);

    const relevanceExamples: Array<Record<string, unknown>> = [];
    let demoted = 0;

    for (const kw of keywords ?? []) {
      const relevance = scoreCategoryRelevance(
        kw.keyword as string,
        kw.category as string,
        kw.cluster as string | null
      );
      const priority = scoreDiscoveryPriority({
        prospectingValue: kw.prospecting_value_score,
        keywordQuality: kw.keyword_quality_score,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
        historicalYield: kw.prospect_yield_score,
        uniqueDomainsFound: kw.unique_domains_found,
        retailerRatio: kw.retailer_ratio != null ? Number(kw.retailer_ratio) : null,
        categoryRelevance: relevance.score,
      });

      const updates: Record<string, unknown> = {
        category_relevance_score: relevance.score,
        category_relevance_reasons: relevance.reasons,
        discovery_priority_score: priority.score,
        updated_at: new Date().toISOString(),
      };

      if (
        relevance.score < PAID_VERIFY_DEFAULTS.minRelevanceForPrimary &&
        kw.prospecting_tier === "PRIMARY"
      ) {
        updates.prospecting_tier = "LOW_VALUE";
        demoted += 1;
      }

      await supabase.from("keywords").update(updates).eq("id", kw.id);

      if (relevance.score < 45 || relevance.matchedDeny.length > 0) {
        relevanceExamples.push({
          keyword: kw.keyword,
          category: kw.category,
          relevance: relevance.score,
          priority: priority.score,
          reasons: relevance.reasons.slice(0, 6),
          deny: relevance.matchedDeny,
        });
      }
    }

    // Also reclassify all keywords in the four categories (not only the 50 scanned)
    const { data: allCatKeywords } = await supabase
      .from("keywords")
      .select(
        `id, keyword, category, cluster, prospecting_value_score, keyword_quality_score,
         commercial_intent_score, product_intent_score, prospect_yield_score,
         unique_domains_found, retailer_ratio, prospecting_tier`
      )
      .in("category", [...CONTROLLED_SCALE_CATEGORIES]);

    let allReclassified = 0;
    for (const kw of allCatKeywords ?? []) {
      if (keywordIds.includes(kw.id)) continue;
      const relevance = scoreCategoryRelevance(
        kw.keyword as string,
        kw.category as string,
        kw.cluster as string | null
      );
      const priority = scoreDiscoveryPriority({
        prospectingValue: kw.prospecting_value_score,
        keywordQuality: kw.keyword_quality_score,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
        historicalYield: kw.prospect_yield_score,
        uniqueDomainsFound: kw.unique_domains_found,
        retailerRatio: kw.retailer_ratio != null ? Number(kw.retailer_ratio) : null,
        categoryRelevance: relevance.score,
      });
      const updates: Record<string, unknown> = {
        category_relevance_score: relevance.score,
        category_relevance_reasons: relevance.reasons,
        discovery_priority_score: priority.score,
        updated_at: new Date().toISOString(),
      };
      if (
        relevance.score < PAID_VERIFY_DEFAULTS.minRelevanceForPrimary &&
        kw.prospecting_tier === "PRIMARY"
      ) {
        updates.prospecting_tier = "LOW_VALUE";
        demoted += 1;
      }
      await supabase.from("keywords").update(updates).eq("id", kw.id);
      allReclassified += 1;
    }

    console.log(
      `Category relevance: ${keywords?.length ?? 0} M7.2 keywords + ${allReclassified} others; demoted PRIMARY→LOW_VALUE: ${demoted}`
    );

    // ------------------------------------------------------------------
    // FASE A3 — Fix UNIQUE category stats
    // ------------------------------------------------------------------
    const categoryKeywordIds: Record<string, string[]> = {};
    for (const cat of CONTROLLED_SCALE_CATEGORIES) {
      categoryKeywordIds[cat] = (keywords ?? [])
        .filter((k) => k.category === cat)
        .map((k) => k.id);
    }

    const oldStats = (scaleRun.category_stats ?? {}) as Record<
      string,
      { serpCost?: number; prequalified?: number; domainsFound?: number }
    >;
    const serpCostByCategory: Record<string, number> = {};
    for (const cat of CONTROLLED_SCALE_CATEGORIES) {
      serpCostByCategory[cat] = Number(oldStats[cat]?.serpCost ?? 0);
    }

    const uniqueStats = await computeCategoryUniqueStats(supabase, {
      categoryKeywordIds,
      serpCostByCategory,
    });

    const categoryStatsJson: Record<string, Record<string, number>> = {};
    for (const [cat, m] of Object.entries(uniqueStats)) {
      categoryStatsJson[cat] = categoryStatsToJson(m);
      await supabase.from("category_prospect_yield").upsert({
        category_id: cat,
        keywords_scanned: m.keywordsScanned,
        serp_cost: m.serpCost,
        domains_found: m.uniqueDomains,
        specialists_brands: m.uniqueBrandSpecialistDomains,
        prequalified: m.uniquePrequalifiedDomains,
        shopify: m.uniqueShopifyDomains,
        confirmed_advertisers: m.uniqueConfirmedDomains,
        unique_ecommerce_domains: m.uniqueEcommerceDomains,
        unique_brand_specialist_domains: m.uniqueBrandSpecialistDomains,
        unique_prequalified_domains: m.uniquePrequalifiedDomains,
        unique_shopify_domains: m.uniqueShopifyDomains,
        unique_confirmed_domains: m.uniqueConfirmedDomains,
        category_prospect_yield_score: m.categoryProspectYieldScore,
        last_run_id: parentRun.id,
        updated_at: new Date().toISOString(),
      });
    }

    report.faseA = {
      petsBugCause:
        "prequalified/specialists/shopify counted per ad_occurrence row; domainsFound used a Set",
      petsBefore: {
        domains: oldStats.PETS?.domainsFound ?? null,
        prequalified: oldStats.PETS?.prequalified ?? null,
      },
      petsAfter: {
        domains: uniqueStats.PETS?.uniqueDomains ?? null,
        prequalified: uniqueStats.PETS?.uniquePrequalifiedDomains ?? null,
      },
      categoryStats: categoryStatsJson,
      demotedPrimary: demoted,
      lowRelevanceExamples: relevanceExamples.slice(0, 12),
      resetFalseNotResolved: resetCount,
      dataforseo: 0,
      anthropic: 0,
    };

    console.log("\nCorrected UNIQUE category metrics:");
    for (const cat of CONTROLLED_SCALE_CATEGORIES) {
      const m = uniqueStats[cat];
      console.log(
        `  ${cat}: domains=${m.uniqueDomains} ecommerce=${m.uniqueEcommerceDomains} brand/spec=${m.uniqueBrandSpecialistDomains} preq=${m.uniquePrequalifiedDomains} shopify=${m.uniqueShopifyDomains}`
      );
    }

    // ------------------------------------------------------------------
    // FASE B — Rank prequalified from M7.2 keyword set
    // ------------------------------------------------------------------
    const { data: ads } = await supabase
      .from("ad_occurrences")
      .select(
        `brand_id, keyword_id,
         brands(
           id, normalized_domain, business_type, platform, is_ecommerce,
           business_maturity_score, retailer_scale_score, pre_fit_score,
           prequalified_prospect, confirmed_google_advertiser, transparency_confirmed,
           transparency_status, transparency_checked_at, transparency_api_status,
           manual_excluded, last_crawled_at, lead_eligible, paid_target_status
         ),
         keywords(id, keyword, category, prospecting_value_score, category_relevance_score, keyword_intent_type)`
      )
      .in("keyword_id", keywordIds);

    type BrandAgg = {
      id: string;
      domain: string;
      businessType: string | null;
      platform: string | null;
      isEcommerce: boolean;
      maturity: number | null;
      retailerScale: number | null;
      preFit: number | null;
      confirmed: boolean;
      transparencyStatus: string | null;
      transparencyCheckedAt: string | null;
      transparencyApiStatus: string | null;
      manualExcluded: boolean;
      lastCrawledAt: string | null;
      paidTargetStatus: string | null;
      sourceKeywords: Map<
        string,
        {
          keyword: string;
          category: string;
          prospecting: number | null;
          relevance: number | null;
          intent: string | null;
        }
      >;
    };

    const brandMap = new Map<string, BrandAgg>();
    for (const ad of ads ?? []) {
      if (!ad.brand_id) continue;
      const brandRaw = Array.isArray(ad.brands) ? ad.brands[0] : ad.brands;
      const kwRaw = Array.isArray(ad.keywords) ? ad.keywords[0] : ad.keywords;
      if (!brandRaw || typeof brandRaw !== "object") continue;
      const b = brandRaw as Record<string, unknown>;
      let agg = brandMap.get(ad.brand_id);
      if (!agg) {
        agg = {
          id: ad.brand_id,
          domain: String(b.normalized_domain ?? ""),
          businessType: (b.business_type as string) ?? null,
          platform: (b.platform as string) ?? null,
          isEcommerce: Boolean(b.is_ecommerce),
          maturity: (b.business_maturity_score as number) ?? null,
          retailerScale: (b.retailer_scale_score as number) ?? null,
          preFit: (b.pre_fit_score as number) ?? null,
          confirmed: Boolean(b.confirmed_google_advertiser || b.transparency_confirmed),
          transparencyStatus: (b.transparency_status as string) ?? null,
          transparencyCheckedAt: (b.transparency_checked_at as string) ?? null,
          transparencyApiStatus: (b.transparency_api_status as string) ?? null,
          manualExcluded: Boolean(b.manual_excluded),
          lastCrawledAt: (b.last_crawled_at as string) ?? null,
          paidTargetStatus: (b.paid_target_status as string) ?? null,
          sourceKeywords: new Map(),
        };
        brandMap.set(ad.brand_id, agg);
      }
      if (kwRaw && typeof kwRaw === "object") {
        const kw = kwRaw as Record<string, unknown>;
        const kid = String(kw.id ?? ad.keyword_id);
        if (!agg.sourceKeywords.has(kid)) {
          agg.sourceKeywords.set(kid, {
            keyword: String(kw.keyword ?? ""),
            category: String(kw.category ?? ""),
            prospecting: (kw.prospecting_value_score as number) ?? null,
            relevance: (kw.category_relevance_score as number) ?? null,
            intent: (kw.keyword_intent_type as string) ?? null,
          });
        }
      }
    }

    const sourcesByBrand = new Map<
      string,
      Array<{
        keyword: string;
        category: string;
        prospecting: number | null;
        relevance: number | null;
        intent: string | null;
      }>
    >();
    const paidStatusByBrand = new Map<string, string | null>();

    const rankInputs = [...brandMap.values()]
      .filter((b) => {
        const type = (b.businessType ?? "").toUpperCase();
        return (
          b.isEcommerce &&
          (type === "BRAND" || type === "SPECIALIST_WEBSHOP") &&
          !b.manualExcluded &&
          (b.retailerScale ?? 0) <= 65 &&
          (b.maturity ?? 0) >= 35
        );
      })
      .map((b) => {
        const sources = [...b.sourceKeywords.values()];
        sourcesByBrand.set(b.id, sources);
        paidStatusByBrand.set(b.id, b.paidTargetStatus);
        const avgProspecting =
          sources.length > 0
            ? sources.reduce((s, x) => s + (x.prospecting ?? 50), 0) / sources.length
            : null;
        const avgRelevance =
          sources.length > 0
            ? sources.reduce((s, x) => s + (x.relevance ?? 50), 0) / sources.length
            : null;
        return {
          id: b.id,
          domain: b.domain,
          businessType: b.businessType,
          platform: b.platform,
          maturity: b.maturity,
          retailerScale: b.retailerScale,
          preFit: b.preFit,
          uniqueSourceKeywords: sources.length,
          avgProspecting,
          avgCategoryRelevance: avgRelevance,
          intelligenceCompleteness: computeIntelligenceCompleteness({
            platform: b.platform,
            maturity: b.maturity,
            isEcommerce: b.isEcommerce,
            businessType: b.businessType,
            lastCrawledAt: b.lastCrawledAt,
            retailerScale: b.retailerScale,
          }),
          confirmedAdvertiser: b.confirmed,
          transparencyStatus: b.transparencyStatus,
          transparencyCheckedAt: b.transparencyCheckedAt,
          transparencyApiStatus: b.transparencyApiStatus,
        };
      });

    const ranked = rankPrequalifiedForTransparency(rankInputs);

    const needsTransparency = ranked.filter((b) => {
      if (b.confirmedAdvertiser) return false;
      if (b.transparencyStatus === "CONFIRMED") return false;
      if (b.transparencyStatus === "NOT_CONFIRMED" && b.transparencyCheckedAt) {
        const age = daysAgo(b.transparencyCheckedAt);
        if (age != null && age < PAID_VERIFY_DEFAULTS.confirmationCooldownDays) return false;
      }
      // Successful unresolved (semantic) within cooldown — skip
      if (
        b.transparencyStatus === "NOT_RESOLVED" &&
        b.transparencyApiStatus === "SUCCESS" &&
        b.transparencyCheckedAt
      ) {
        const age = daysAgo(b.transparencyCheckedAt);
        if (age != null && age < PAID_VERIFY_DEFAULTS.unresolvedCooldownDays) return false;
      }
      // PAYMENT_REQUIRED / missing check / false NOT_RESOLVED → retry
      return true;
    });

    const toCheck = needsTransparency.slice(0, env.PAID_VERIFY_MAX_DOMAINS);

    console.log(`\nPrequalified ranked: ${ranked.length}`);
    console.log(`Transparency candidates (max ${env.PAID_VERIFY_MAX_DOMAINS}): ${toCheck.length}`);
    for (const c of toCheck) {
      console.log(
        `  ${c.domain} preFit=${c.preFit} verifyScore=${c.verificationPriorityScore} shopify=${(c.platform ?? "").toUpperCase() === "SHOPIFY"} sources=${c.uniqueSourceKeywords}`
      );
    }

    // ------------------------------------------------------------------
    // Selective Transparency
    // ------------------------------------------------------------------
    const transparencyCap = Math.min(env.PAID_VERIFY_MAX_COST, remaining(totalBudget));
    let transparencyCost = 0;
    let confirmed = 0;
    let notConfirmed = 0;
    let notResolved = 0;
    let paymentRequired = 0;
    let apiErrors = 0;
    const transparencyResults: Array<Record<string, unknown>> = [];

    const checkOne = async (brand: (typeof toCheck)[number]) => {
      if (!canSpend(totalBudget) || transparencyCost >= transparencyCap) {
        return {
          domain: brand.domain,
          skipped: true,
          reason: "budget",
        };
      }
      try {
        const result = await checkGoogleAdsTransparency(
          { client: dfs, env },
          brand.domain
        );
        transparencyCost += result.cost;
        totalBudget.spent += result.cost;
        await applyTransparencyResult(supabase, result);
        const advertiserStatus = result.confirmedAdvertiser
          ? "CONFIRMED"
          : result.evidenceStrength === "EXPLICIT_NEGATIVE"
            ? "NOT_CONFIRMED"
            : "NOT_RESOLVED";
        if (advertiserStatus === "CONFIRMED") confirmed += 1;
        else if (advertiserStatus === "NOT_CONFIRMED") notConfirmed += 1;
        else notResolved += 1;

        const row = {
          domain: brand.domain,
          brandId: brand.id,
          verifyScore: brand.verificationPriorityScore,
          confirmed: result.confirmedAdvertiser,
          adsFound: result.adsFound,
          cost: result.cost,
          apiStatus: "SUCCESS",
          advertiserStatus,
          evidenceStrength: result.evidenceStrength,
        };
        transparencyResults.push(row);
        return row;
      } catch (err) {
        const classified = classifyDataForSeoError(err);
        // NEVER overwrite semantic advertiser status on technical failure
        await supabase
          .from("brands")
          .update({
            transparency_api_status: classified.apiStatus,
            transparency_api_error: classified.message,
            transparency_api_error_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", brand.id);

        if (classified.apiStatus === "PAYMENT_REQUIRED") {
          paymentRequired += 1;
          logger.warn("Transparency PAYMENT_REQUIRED — advertiser status unchanged", {
            domain: brand.domain,
            message: classified.message,
          });
        } else if (classified.apiStatus === "RATE_LIMITED") {
          apiErrors += 1;
          logger.warn("Transparency rate limited — advertiser status unchanged", {
            domain: brand.domain,
          });
        } else {
          // Real API/parse error without payment: semantic NOT_RESOLVED only if never checked
          notResolved += 1;
          const { data: current } = await supabase
            .from("brands")
            .select("transparency_checked_at, confirmed_google_advertiser, transparency_status")
            .eq("id", brand.id)
            .maybeSingle();
          if (
            current &&
            !current.transparency_checked_at &&
            !current.confirmed_google_advertiser &&
            current.transparency_status !== "CONFIRMED" &&
            current.transparency_status !== "NOT_CONFIRMED"
          ) {
            await supabase
              .from("brands")
              .update({ transparency_status: "NOT_RESOLVED" })
              .eq("id", brand.id);
          }
          logger.warn("Transparency ERROR — limited semantic write", {
            domain: brand.domain,
            message: classified.message,
          });
        }

        const row = {
          domain: brand.domain,
          brandId: brand.id,
          verifyScore: brand.verificationPriorityScore,
          confirmed: false,
          cost: 0,
          apiStatus: classified.apiStatus,
          advertiserStatus: "UNCHANGED",
          error: classified.message,
        };
        transparencyResults.push(row);
        return row;
      }
    };

    // Sequential if payment risk; still honor concurrency for success path
    await mapPool(toCheck, env.PAID_VERIFY_CONCURRENCY, async (brand) => {
      if (paymentRequired > 0 && !canSpend(totalBudget)) {
        return { domain: brand.domain, skipped: true, reason: "payment_required_stop" };
      }
      return checkOne(brand);
    });

    // Stop further paid phases if payment required drained ability
    if (paymentRequired > 0 && !canSpend(totalBudget, 0.01)) {
      console.log("STOP: DataForSEO PAYMENT_REQUIRED — skipping further paid phases");
    }

    report.verification = {
      selected: toCheck.map((c) => ({
        domain: c.domain,
        verifyScore: c.verificationPriorityScore,
        preFit: c.preFit,
        platform: c.platform,
        maturity: c.maturity,
        sources: c.uniqueSourceKeywords,
        why: [
          c.preFit != null ? `pre_fit=${c.preFit}` : null,
          (c.platform ?? "").toUpperCase() === "SHOPIFY" ? "shopify" : null,
          c.uniqueSourceKeywords > 1 ? `multi_kw=${c.uniqueSourceKeywords}` : null,
          c.maturity != null ? `maturity=${c.maturity}` : null,
        ].filter(Boolean),
      })),
      checked: transparencyResults.filter((r) => !("skipped" in r && r.skipped)).length,
      confirmed,
      notConfirmed,
      notResolved,
      paymentRequired,
      apiErrors,
      cost: transparencyCost,
      results: transparencyResults,
    };

    console.log(
      `\nTransparency: confirmed=${confirmed} notConfirmed=${notConfirmed} notResolved=${notResolved} paymentRequired=${paymentRequired} cost=$${transparencyCost.toFixed(4)}`
    );

    // ------------------------------------------------------------------
    // Paid targets — max 5 best CONFIRMED from this batch / M7.2 set
    // ------------------------------------------------------------------
    const confirmedCandidates = ranked
      .map((r) => {
        const fresh = transparencyResults.find(
          (t) => t.brandId === r.id && t.advertiserStatus === "CONFIRMED"
        );
        const already = r.confirmedAdvertiser || r.transparencyStatus === "CONFIRMED";
        return { ...r, newlyConfirmed: Boolean(fresh), eligible: Boolean(fresh) || already };
      })
      .filter((r) => r.eligible)
      .map((r) => {
        const sources = sourcesByBrand.get(r.id) ?? [];
        const nonBranded = sources.filter((s) => s.intent === "NON_BRANDED_PRODUCT").length;
        return {
          ...r,
          targetRankScore: scoreConfirmedForTargetResolution({
            preFit: r.preFit,
            maturity: r.maturity,
            platform: r.platform,
            retailerScale: r.retailerScale,
            uniqueSourceKeywords: r.uniqueSourceKeywords,
            avgProspecting: r.avgProspecting,
            nonBrandedSourceCount: nonBranded,
          }),
          sources,
        };
      })
      .sort((a, b) => b.targetRankScore - a.targetRankScore);

    // Prefer newly confirmed from this run; fill with prior confirmed in set
    const newly = confirmedCandidates.filter((c) => c.newlyConfirmed);
    const prior = confirmedCandidates.filter((c) => !c.newlyConfirmed);
    const targetPick = [...newly, ...prior].slice(0, env.PAID_TARGET_VERIFY_MAX_BRANDS);

    const paidCap = Math.min(env.PAID_TARGET_VERIFY_MAX_COST, remaining(totalBudget));
    let paidCost = 0;
    let exactPaid = 0;
    let highConfidence = 0;
    let discoveryOnly = 0;
    const paidResults: Array<Record<string, unknown>> = [];

    console.log(`\nPaid target candidates (max ${env.PAID_TARGET_VERIFY_MAX_BRANDS}): ${targetPick.length}`);

    for (const brand of targetPick) {
      if (!canSpend(totalBudget) || paidCost >= paidCap) {
        console.log("STOP paid targets: budget / payment cap");
        break;
      }
      try {
        const observedAt = new Date().toISOString();
        const labs = await fetchPaidRankedKeywords({
          client: dfs,
          env,
          target: brand.domain,
          limit: Math.min(30, env.PAID_GROUND_TRUTH_MAX_RESULTS_PER_DOMAIN),
        });
        paidCost += labs.cost;
        totalBudget.spent += labs.cost;

        const saved = await upsertPaidSearchTargets({
          client: supabase,
          brandId: brand.id,
          items: labs.items,
          observedAt,
        });

        let generated = { opportunitiesUpserted: 0, croReady: 0 };
        if (labs.items.some((i) => i.landingUrl)) {
          generated = await generateOpportunitiesFromPaidTargets(supabase, brand.id);
        }

        exactPaid += generated.croReady;
        highConfidence += Math.max(0, generated.opportunitiesUpserted - generated.croReady);
        if (generated.opportunitiesUpserted === 0 && labs.items.length > 0) {
          discoveryOnly += labs.items.length;
        }

        // Attach target_priority_score on opportunities for this brand
        const { data: opps } = await supabase
          .from("opportunities")
          .select(
            "id, source_quality_score, cro_readiness_level, landing_url, ad_headline, ground_truth_source_type, keyword_id"
          )
          .eq("brand_id", brand.id)
          .order("source_quality_score", { ascending: false, nullsFirst: false })
          .limit(20);

        const topTargets: Array<Record<string, unknown>> = [];
        for (const opp of opps ?? []) {
          const src = brand.sources[0];
          const priority = scoreTargetPriority({
            sourceQuality: opp.source_quality_score != null ? Number(opp.source_quality_score) : null,
            brandPreFit: brand.preFit,
            maturity: brand.maturity,
            platform: brand.platform,
            keywordProspecting: src?.prospecting ?? null,
            isNonBranded: src?.intent === "NON_BRANDED_PRODUCT",
            productSignals: brand.preFit,
            targetConfidence:
              opp.cro_readiness_level === "EXACT_PAID_FUNNEL"
                ? 95
                : opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET"
                  ? 80
                  : 50,
          });
          await supabase
            .from("opportunities")
            .update({ target_priority_score: priority, updated_at: observedAt })
            .eq("id", opp.id);
          topTargets.push({
            landingUrl: opp.landing_url,
            headline: opp.ad_headline,
            readiness: opp.cro_readiness_level,
            sourceQuality: opp.source_quality_score,
            targetPriority: priority,
            sourceType: opp.ground_truth_source_type,
          });
        }

        await supabase
          .from("brands")
          .update({
            paid_target_status: saved.upserted > 0 ? "RESOLVED" : "NOT_RESOLVED",
            paid_targets_count: saved.upserted,
            paid_targets_resolved_at: observedAt,
            updated_at: observedAt,
          })
          .eq("id", brand.id);

        paidResults.push({
          domain: brand.domain,
          labsItems: labs.itemsCount,
          cost: labs.cost,
          upserted: saved.upserted,
          generated,
          topTargets: topTargets.slice(0, 5),
        });
      } catch (err) {
        const classified = classifyDataForSeoError(err);
        logger.warn("Paid target resolve failed", {
          domain: brand.domain,
          apiStatus: classified.apiStatus,
          error: classified.message,
        });
        paidResults.push({
          domain: brand.domain,
          apiStatus: classified.apiStatus,
          error: classified.message,
          cost: 0,
        });
        if (classified.apiStatus === "PAYMENT_REQUIRED") {
          paymentRequired += 1;
          break;
        }
      }
    }

    report.targets = {
      brandsChecked: paidResults.filter((r) => !r.error || r.upserted).length,
      brandsAttempted: paidResults.length,
      exactPaidFunnels: exactPaid,
      highConfidenceTargets: highConfidence,
      discoveryOnly,
      cost: paidCost,
      results: paidResults,
    };

    // ------------------------------------------------------------------
    // Best prospects (max 10 interesting)
    // ------------------------------------------------------------------
    const bestProspects = [];
    const sortedForReport = [...ranked].sort((a, b) => {
      const aConf = a.confirmedAdvertiser || a.transparencyStatus === "CONFIRMED" ? 1 : 0;
      const bConf = b.confirmedAdvertiser || b.transparencyStatus === "CONFIRMED" ? 1 : 0;
      if (bConf !== aConf) return bConf - aConf;
      return (b.preFit ?? 0) - (a.preFit ?? 0);
    });

    for (const r of sortedForReport.slice(0, 10)) {
      const { data: brandFresh } = await supabase
        .from("brands")
        .select(
          "transparency_status, confirmed_google_advertiser, confirmation_source, paid_target_status, platform, business_type, pre_fit_score, business_maturity_score, retailer_scale_score"
        )
        .eq("id", r.id)
        .maybeSingle();

      const { data: topOpp } = await supabase
        .from("opportunities")
        .select(
          "landing_url, source_quality_score, cro_readiness_level, target_priority_score, ad_headline"
        )
        .eq("brand_id", r.id)
        .order("target_priority_score", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

      const sources = sourcesByBrand.get(r.id) ?? [];
      bestProspects.push({
        domain: r.domain,
        category: sources[0]?.category ?? null,
        sourceKeywords: sources.map((s) => s.keyword).slice(0, 5),
        platform: brandFresh?.platform ?? r.platform,
        businessType: brandFresh?.business_type ?? r.businessType,
        maturity: brandFresh?.business_maturity_score ?? r.maturity,
        retailerScale: brandFresh?.retailer_scale_score ?? r.retailerScale,
        preFit: brandFresh?.pre_fit_score ?? r.preFit,
        googleAdvertiserStatus: brandFresh?.confirmed_google_advertiser
          ? "CONFIRMED"
          : brandFresh?.transparency_status ?? "NOT_CHECKED",
        verificationSource: brandFresh?.confirmation_source ?? null,
        paidTargetStatus: brandFresh?.paid_target_status ?? null,
        targetUrl: topOpp?.landing_url ?? null,
        targetSourceQuality: topOpp?.source_quality_score ?? null,
        targetPriority: topOpp?.target_priority_score ?? null,
        readiness: topOpp?.cro_readiness_level ?? null,
      });
    }
    report.bestProspects = bestProspects;

    // ------------------------------------------------------------------
    // Update funnel on controlled_scale_runs (preserve discovery, update paid)
    // ------------------------------------------------------------------
    const oldFunnel = (scaleRun.funnel ?? {}) as Record<string, number>;
    const prequalifiedList = rankInputs.map((r) => {
      const sources = sourcesByBrand.get(r.id) ?? [];
      return {
        domain: r.domain,
        category: sources[0]?.category ?? null,
        bestSourceKeyword: sources[0]?.keyword ?? null,
        platform: r.platform,
        businessType: r.businessType,
        maturity: r.maturity,
        retailerScale: r.retailerScale,
        preFit: r.preFit,
        keywordSignals: r.uniqueSourceKeywords,
        adsStatus: r.transparencyStatus ?? "NOT_CHECKED",
        paidTargetStatus: paidStatusByBrand.get(r.id) ?? null,
        verificationPriority: ranked.find((x) => x.id === r.id)?.verificationPriorityScore ?? null,
      };
    });

    prequalifiedList.sort(
      (a, b) => (b.verificationPriority ?? 0) - (a.verificationPriority ?? 0)
    );

    const updatedFunnel = {
      ...oldFunnel,
      keywords: keywordIds.length,
      uniqueDomains: oldFunnel.uniqueDomains ?? oldFunnel.domains ?? null,
      ecommerce: oldFunnel.ecommerce ?? null,
      brandSpecialist: oldFunnel.brandSpecialist ?? null,
      prequalified: oldFunnel.prequalified ?? rankInputs.length,
      shopify: oldFunnel.shopify ?? null,
      transparencyChecked: transparencyResults.filter((r) => r.apiStatus === "SUCCESS").length,
      confirmedAdvertisers: confirmed + (oldFunnel.confirmedAdvertisers ?? 0),
      targetResolutionChecked: paidResults.filter((r) => !r.apiStatus || r.apiStatus === "SUCCESS").length,
      exactPaidFunnels: exactPaid,
      highConfidenceTargets: highConfidence,
    };

    // Prefer unique totals from corrected stats for display consistency
    await supabase
      .from("controlled_scale_runs")
      .update({
        category_stats: categoryStatsJson,
        funnel: updatedFunnel,
        best_prospects: bestProspects,
        noise_report: {
          ...(typeof scaleRun.noise_report === "object" && scaleRun.noise_report
            ? scaleRun.noise_report
            : {}),
          m721: {
            verifyRunId: parentRun.id,
            prequalifiedProspects: prequalifiedList.slice(0, 50),
            verification: report.verification,
            targets: report.targets,
            faseA: report.faseA,
          },
        },
        dataforseo_cost: Number(scaleRun.dataforseo_cost ?? 0) + totalBudget.spent,
      })
      .eq("id", scaleRun.id);

    // Also store dedicated verify run row if table supports — use runs metadata
    report.costs = {
      dataforseo: totalBudget.spent,
      anthropic: 0,
      transparency: transparencyCost,
      paidTargets: paidCost,
      totalCap: env.M721_MAX_DATAFORSEO_COST,
    };
    report.funnel = updatedFunnel;
    report.prequalifiedProspects = prequalifiedList.slice(0, 30);

    await completeRun(supabase, parentRun.id, "completed", {
      ...report,
      dataforseo_cost: totalBudget.spent,
      anthropic_cost: 0,
    });

    // ------------------------------------------------------------------
    // Print eindrapport
    // ------------------------------------------------------------------
    console.log("\n========== M7.2.1 COMPLETE ==========");
    console.log(JSON.stringify({
      faseA: report.faseA,
      verification: {
        confirmed,
        notConfirmed,
        notResolved,
        paymentRequired,
        cost: transparencyCost,
        selectedDomains: toCheck.map((t) => t.domain),
      },
      targets: report.targets,
      bestProspects,
      costs: report.costs,
    }, null, 2));
  } catch (err) {
    await completeRun(supabase, parentRun.id, "failed", {
      error: err instanceof Error ? err.message : String(err),
      partial: report,
      dataforseo_cost: totalBudget.spent,
      anthropic_cost: 0,
    });
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
