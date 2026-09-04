import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { CRO_SHORTLIST_WEIGHTS, TARGET_HARVEST_DEFAULTS, } from "../config/targetHarvest.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchPaidRankedKeywords } from "../services/dataforseo/rankedPaidKeywords.js";
import { harvestShoppingTargetsForBrand, } from "../services/harvest/shoppingHarvest.js";
import { computeIntelligenceCompleteness, scoreConfirmedForTargetResolution, scoreTargetPriority, } from "../services/qualification/verificationRanking.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { generateOpportunitiesFromPaidTargets, upsertPaidSearchTargets, } from "../services/supabase/paidTargetsRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { classifyDataForSeoError } from "../utils/dataforseoErrors.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const EXCLUDED_TYPES = new Set([
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
]);
/** Soft blocklist: large retail / farm chains that pass weak retailer_scale. */
const EXCLUDED_DOMAINS = new Set([
    "welkoop.nl",
    "coolblue.nl",
    "bol.com",
    "amazon.nl",
    "kruidvat.nl",
    "etos.nl",
    "hema.nl",
]);
function remaining(spent, cap) {
    return Math.max(0, cap - spent);
}
function scoreCroShortlist(input) {
    const w = CRO_SHORTLIST_WEIGHTS;
    let score = input.targetPriority * w.targetPriority +
        (input.preFit ?? 50) * w.preFit +
        (input.maturity ?? 40) * w.maturity;
    if ((input.platform ?? "").toUpperCase() === "SHOPIFY")
        score += w.shopifyBonus;
    if (input.readiness === "EXACT_PAID_FUNNEL")
        score += w.exactPaidBonus;
    if (input.readiness === "HIGH_CONFIDENCE_TARGET")
        score += w.highConfidenceBonus;
    score -= (input.retailerScale ?? 0) * w.retailerScalePenalty;
    return Math.max(0, Math.min(100, Math.round(score)));
}
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dfs = createDataForSeoClient(env);
    const maxCost = env.M722_MAX_DATAFORSEO_COST;
    let spent = 0;
    console.log("\n=== MILESTONE 7.2.2 — harvest:confirmed-targets ===");
    console.log("No SERP discovery. No keyword gen. No CRO. Anthropic $0.\n");
    const run = await createRun(supabase, "harvest_confirmed_targets", {
        milestone: "7.2.2",
        maxDataForSeo: maxCost,
    });
    const report = {
        milestone: "7.2.2",
        dataQuality: {},
        search: {},
        shopping: {},
        croReady: [],
        unresolved: [],
        costs: { dataforseo: 0, anthropic: 0 },
    };
    try {
        // ------------------------------------------------------------------
        // 1. Semantic fix already applied for dogsen/lyko; confirm counts
        // ------------------------------------------------------------------
        const { data: semanticRows } = await supabase
            .from("brands")
            .select("normalized_domain, transparency_status, transparency_metadata")
            .in("normalized_domain", ["dogsen.nl", "lyko.nl"]);
        report.dataQuality = {
            dogsenLyko: semanticRows ?? [],
            note: "Empty Transparency / No Search Results → NOT_RESOLVED (not NOT_CONFIRMED)",
        };
        // ------------------------------------------------------------------
        // 2. Select best confirmed prospects (max 10)
        // ------------------------------------------------------------------
        const { data: confirmedPool, error: poolErr } = await supabase
            .from("brands")
            .select(`id, normalized_domain, business_type, platform, is_ecommerce,
         business_maturity_score, retailer_scale_score, pre_fit_score,
         confirmed_google_advertiser, transparency_status, transparency_confirmed,
         manual_excluded, do_not_contact, lead_eligible, last_crawled_at,
         paid_target_status, crawl_status`)
            .eq("manual_excluded", false)
            .or("confirmed_google_advertiser.eq.true,transparency_status.eq.CONFIRMED,transparency_confirmed.eq.true");
        if (poolErr)
            throw new Error(poolErr.message);
        const eligiblePool = (confirmedPool ?? []).filter((b) => {
            const type = String(b.business_type ?? "").toUpperCase();
            if (EXCLUDED_TYPES.has(type))
                return false;
            if (b.do_not_contact)
                return false;
            if (EXCLUDED_DOMAINS.has(String(b.normalized_domain ?? "").toLowerCase()))
                return false;
            if ((b.retailer_scale_score ?? 0) > TARGET_HARVEST_DEFAULTS.maxRetailerScale)
                return false;
            if ((b.business_maturity_score ?? 0) < TARGET_HARVEST_DEFAULTS.minMaturity)
                return false;
            if (type !== "BRAND" && type !== "SPECIALIST_WEBSHOP")
                return false;
            return Boolean(b.is_ecommerce);
        });
        const candidates = [];
        for (const b of eligiblePool) {
            const { data: ads } = await supabase
                .from("ad_occurrences")
                .select(`keyword_id,
           keywords(id, keyword, prospecting_value_score, category_relevance_score,
                    keyword_intent_type, prospecting_tier, prospect_yield_score)`)
                .eq("brand_id", b.id)
                .limit(40);
            const sourceMap = new Map();
            for (const ad of ads ?? []) {
                const kw = Array.isArray(ad.keywords) ? ad.keywords[0] : ad.keywords;
                if (!kw || typeof kw !== "object")
                    continue;
                const row = kw;
                const id = String(row.id ?? ad.keyword_id);
                if (!sourceMap.has(id)) {
                    sourceMap.set(id, {
                        id,
                        keyword: String(row.keyword ?? ""),
                        prospecting: row.prospecting_value_score ?? null,
                        relevance: row.category_relevance_score ?? null,
                        intent: row.keyword_intent_type ?? null,
                        tier: row.prospecting_tier ?? null,
                        yieldScore: row.prospect_yield_score ?? null,
                    });
                }
            }
            const sources = [...sourceMap.values()];
            const nonBranded = sources.filter((s) => s.intent === "NON_BRANDED_PRODUCT").length;
            const avgProspecting = sources.length > 0
                ? sources.reduce((s, x) => s + (x.prospecting ?? 50), 0) / sources.length
                : null;
            const harvestRank = scoreConfirmedForTargetResolution({
                preFit: b.pre_fit_score,
                maturity: b.business_maturity_score,
                platform: b.platform,
                retailerScale: b.retailer_scale_score,
                uniqueSourceKeywords: sources.length,
                avgProspecting,
                nonBrandedSourceCount: nonBranded,
            });
            // Soft intelligence bump
            const intel = computeIntelligenceCompleteness({
                platform: b.platform,
                maturity: b.business_maturity_score,
                isEcommerce: b.is_ecommerce,
                businessType: b.business_type,
                lastCrawledAt: b.last_crawled_at,
                retailerScale: b.retailer_scale_score,
            });
            candidates.push({
                ...b,
                sources,
                harvestRank: harvestRank + Math.round(intel * 0.05),
            });
        }
        candidates.sort((a, b) => b.harvestRank - a.harvestRank);
        const selected = candidates.slice(0, TARGET_HARVEST_DEFAULTS.maxConfirmedProspects);
        console.log(`Confirmed eligible pool: ${eligiblePool.length}`);
        console.log(`Selected for harvest (max 10): ${selected.length}`);
        for (const s of selected) {
            console.log(`  ${s.normalized_domain} rank=${s.harvestRank} preFit=${s.pre_fit_score} platform=${s.platform} sources=${s.sources.length}`);
        }
        report.confirmedPool = {
            eligible: eligiblePool.length,
            selected: selected.map((s) => ({
                domain: s.normalized_domain,
                rank: s.harvestRank,
                preFit: s.pre_fit_score,
                platform: s.platform,
                maturity: s.business_maturity_score,
                retailerScale: s.retailer_scale_score,
                sources: s.sources.length,
            })),
        };
        // ------------------------------------------------------------------
        // 3. Search target harvest
        // ------------------------------------------------------------------
        const searchResults = [];
        let searchExact = 0;
        let searchBrandsWithTargets = 0;
        let searchCost = 0;
        const brandsNeedingShopping = [];
        for (const brand of selected) {
            if (remaining(spent, maxCost) < 0.01) {
                console.log("STOP search: budget nearly exhausted");
                brandsNeedingShopping.push(brand);
                continue;
            }
            // Prefer brands that still need targets; skip Shopping if Search already produced usable CRO targets
            try {
                const observedAt = new Date().toISOString();
                const labs = await fetchPaidRankedKeywords({
                    client: dfs,
                    env,
                    target: brand.normalized_domain,
                    limit: Math.min(30, env.PAID_GROUND_TRUTH_MAX_RESULTS_PER_DOMAIN),
                });
                spent += labs.cost;
                searchCost += labs.cost;
                let saved = { upserted: 0, croReadyLandingCount: 0 };
                try {
                    saved = await upsertPaidSearchTargets({
                        client: supabase,
                        brandId: brand.id,
                        items: labs.items,
                        observedAt,
                    });
                }
                catch (upsertErr) {
                    logger.warn("Search target upsert soft-fail; continuing with generate", {
                        domain: brand.normalized_domain,
                        error: upsertErr instanceof Error ? upsertErr.message : String(upsertErr),
                    });
                }
                let generated = { opportunitiesUpserted: 0, croReady: 0 };
                if (labs.items.some((i) => i.landingUrl)) {
                    generated = await generateOpportunitiesFromPaidTargets(supabase, brand.id);
                }
                searchExact += generated.croReady;
                if (generated.croReady > 0 || saved.upserted > 0)
                    searchBrandsWithTargets += 1;
                const examples = labs.items
                    .filter((i) => i.landingUrl)
                    .slice(0, 3)
                    .map((i) => ({
                    keyword: i.keyword,
                    title: i.title,
                    url: i.landingUrl,
                    volume: i.searchVolume,
                    cpc: i.cpc,
                }));
                // Score priorities on new opps
                const { data: opps } = await supabase
                    .from("opportunities")
                    .select("id, source_quality_score, cro_readiness_level, landing_url, ad_headline")
                    .eq("brand_id", brand.id)
                    .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"])
                    .order("source_quality_score", { ascending: false, nullsFirst: false })
                    .limit(15);
                for (const opp of opps ?? []) {
                    const src = brand.sources[0];
                    const priority = scoreTargetPriority({
                        sourceQuality: opp.source_quality_score != null ? Number(opp.source_quality_score) : null,
                        brandPreFit: brand.pre_fit_score,
                        maturity: brand.business_maturity_score,
                        platform: brand.platform,
                        keywordProspecting: src?.prospecting ?? null,
                        isNonBranded: src?.intent === "NON_BRANDED_PRODUCT",
                        productSignals: brand.pre_fit_score,
                        targetConfidence: opp.cro_readiness_level === "EXACT_PAID_FUNNEL"
                            ? 95
                            : opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET"
                                ? 80
                                : 50,
                    });
                    const minQuality = opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET"
                        ? TARGET_HARVEST_DEFAULTS.minSourceQualityForHighConfidence
                        : TARGET_HARVEST_DEFAULTS.minSourceQualityForCro;
                    const croEligible = !brand.manual_excluded &&
                        !brand.do_not_contact &&
                        Number(opp.source_quality_score ?? 0) >= minQuality &&
                        Boolean(opp.landing_url) &&
                        (opp.cro_readiness_level === "EXACT_PAID_FUNNEL" ||
                            opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET") &&
                        priority >= TARGET_HARVEST_DEFAULTS.minTargetPriorityForCro;
                    await supabase
                        .from("opportunities")
                        .update({
                        target_priority_score: priority,
                        cro_audit_eligible: croEligible,
                        updated_at: observedAt,
                    })
                        .eq("id", opp.id);
                }
                const hasUsable = generated.croReady > 0 ||
                    (opps ?? []).some((o) => o.cro_readiness_level === "EXACT_PAID_FUNNEL" ||
                        o.cro_readiness_level === "HIGH_CONFIDENCE_TARGET");
                await supabase
                    .from("brands")
                    .update({
                    paid_target_status: hasUsable
                        ? "RESOLVED"
                        : labs.itemsCount > 0
                            ? "PARTIAL"
                            : "NOT_RESOLVED",
                    paid_targets_count: saved.upserted,
                    paid_targets_resolved_at: observedAt,
                    updated_at: observedAt,
                })
                    .eq("id", brand.id);
                searchResults.push({
                    domain: brand.normalized_domain,
                    labsItems: labs.itemsCount,
                    upserted: saved.upserted,
                    croReady: generated.croReady,
                    cost: labs.cost,
                    examples,
                });
                if (!hasUsable)
                    brandsNeedingShopping.push(brand);
                console.log(`Search ${brand.normalized_domain}: items=${labs.itemsCount} croReady=${generated.croReady} cost=$${labs.cost.toFixed(4)}`);
            }
            catch (err) {
                const classified = classifyDataForSeoError(err);
                logger.warn("Search harvest failed", {
                    domain: brand.normalized_domain,
                    apiStatus: classified.apiStatus,
                    error: classified.message,
                });
                searchResults.push({
                    domain: brand.normalized_domain,
                    error: classified.message,
                    apiStatus: classified.apiStatus,
                });
                brandsNeedingShopping.push(brand);
                if (classified.apiStatus === "PAYMENT_REQUIRED")
                    break;
            }
        }
        report.search = {
            brandsChecked: searchResults.filter((r) => !r.error).length,
            brandsWithTargets: searchBrandsWithTargets,
            exactPaidFunnels: searchExact,
            cost: searchCost,
            results: searchResults,
        };
        // ------------------------------------------------------------------
        // 4. Shopping fallback for brands without usable Search targets
        // ------------------------------------------------------------------
        const shoppingResults = [];
        let shoppingCost = 0;
        let shopExactPaid = 0;
        let shopExactListing = 0;
        let shopFree = 0;
        let shopUnresolved = 0;
        const allMismatches = [];
        console.log(`\nShopping fallback brands: ${brandsNeedingShopping.length}`);
        for (const brand of brandsNeedingShopping) {
            const budgetLeft = remaining(spent, maxCost);
            if (budgetLeft < 0.02) {
                console.log("STOP shopping: budget nearly exhausted");
                shopUnresolved += 1;
                continue;
            }
            try {
                const result = await harvestShoppingTargetsForBrand({
                    client: dfs,
                    supabase,
                    env,
                    brandId: brand.id,
                    brandDomain: brand.normalized_domain,
                    keywords: brand.sources,
                    budgetRemaining: budgetLeft,
                });
                spent += result.cost;
                shoppingCost += result.cost;
                shopExactPaid += result.exactPaid;
                shopExactListing += result.exactListing;
                shopFree += result.freeListing;
                allMismatches.push(...result.mismatches);
                // Refresh priorities / eligibility for shopping opps
                const { data: opps } = await supabase
                    .from("opportunities")
                    .select("id, source_quality_score, cro_readiness_level, landing_url")
                    .eq("brand_id", brand.id)
                    .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"]);
                for (const opp of opps ?? []) {
                    const src = brand.sources[0];
                    const priority = scoreTargetPriority({
                        sourceQuality: opp.source_quality_score != null ? Number(opp.source_quality_score) : null,
                        brandPreFit: brand.pre_fit_score,
                        maturity: brand.business_maturity_score,
                        platform: brand.platform,
                        keywordProspecting: src?.prospecting ?? null,
                        isNonBranded: src?.intent === "NON_BRANDED_PRODUCT",
                        productSignals: brand.pre_fit_score,
                        targetConfidence: opp.cro_readiness_level === "EXACT_PAID_FUNNEL"
                            ? 95
                            : opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET"
                                ? 80
                                : 50,
                    });
                    const minQuality = opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET"
                        ? TARGET_HARVEST_DEFAULTS.minSourceQualityForHighConfidence
                        : TARGET_HARVEST_DEFAULTS.minSourceQualityForCro;
                    const croEligible = !brand.manual_excluded &&
                        !brand.do_not_contact &&
                        Number(opp.source_quality_score ?? 0) >= minQuality &&
                        Boolean(opp.landing_url) &&
                        (opp.cro_readiness_level === "EXACT_PAID_FUNNEL" ||
                            opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET") &&
                        priority >= TARGET_HARVEST_DEFAULTS.minTargetPriorityForCro;
                    await supabase
                        .from("opportunities")
                        .update({
                        target_priority_score: priority,
                        cro_audit_eligible: croEligible,
                        updated_at: new Date().toISOString(),
                    })
                        .eq("id", opp.id);
                }
                const hasUsable = result.exactPaid + result.exactListing > 0 || (opps ?? []).length > 0;
                await supabase
                    .from("brands")
                    .update({
                    paid_target_status: hasUsable ? "RESOLVED" : "NOT_RESOLVED",
                    updated_at: new Date().toISOString(),
                })
                    .eq("id", brand.id);
                if (!hasUsable)
                    shopUnresolved += 1;
                shoppingResults.push({
                    domain: brand.normalized_domain,
                    cost: result.cost,
                    exactPaid: result.exactPaid,
                    exactListing: result.exactListing,
                    freeListing: result.freeListing,
                    candidate: result.candidate,
                    mismatches: result.mismatches.length,
                    examples: result.examples,
                    opportunities: result.opportunitiesUpserted,
                });
                console.log(`Shopping ${brand.normalized_domain}: paid=${result.exactPaid} listing=${result.exactListing} mismatches=${result.mismatches.length} cost=$${result.cost.toFixed(4)}`);
            }
            catch (err) {
                const classified = classifyDataForSeoError(err);
                shopUnresolved += 1;
                shoppingResults.push({
                    domain: brand.normalized_domain,
                    error: classified.message,
                    apiStatus: classified.apiStatus,
                });
                if (classified.apiStatus === "PAYMENT_REQUIRED")
                    break;
            }
        }
        report.shopping = {
            brandsChecked: shoppingResults.filter((r) => !r.error).length,
            exactPaid: shopExactPaid,
            exactListings: shopExactListing,
            freeListings: shopFree,
            unresolved: shopUnresolved,
            mismatches: allMismatches.slice(0, 25),
            cost: shoppingCost,
            results: shoppingResults,
        };
        // ------------------------------------------------------------------
        // 5. CRO shortlist max 5
        // ------------------------------------------------------------------
        const selectedIds = selected.map((s) => s.id);
        const { data: eligibleOpps, error: oppErr } = await supabase
            .from("opportunities")
            .select(`id, brand_id, landing_url, cro_readiness_level, source_quality_score,
         target_priority_score, cro_audit_eligible, ad_headline, keyword_id,
         brands(
           normalized_domain, platform, pre_fit_score, business_maturity_score,
           retailer_scale_score, business_type, manual_excluded, do_not_contact
         )`)
            .in("brand_id", selectedIds.length ? selectedIds : ["00000000-0000-0000-0000-000000000000"])
            .eq("cro_audit_eligible", true)
            .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"]);
        if (oppErr) {
            logger.warn("CRO shortlist query failed", { error: oppErr.message });
        }
        const byBrand = new Map();
        for (const opp of eligibleOpps ?? []) {
            const brand = Array.isArray(opp.brands) ? opp.brands[0] : opp.brands;
            if (!brand || typeof brand !== "object")
                continue;
            const b = brand;
            if (b.manual_excluded || b.do_not_contact)
                continue;
            const domain = String(b.normalized_domain ?? "").toLowerCase();
            if (EXCLUDED_DOMAINS.has(domain))
                continue;
            if ((Number(b.retailer_scale_score ?? 0) > TARGET_HARVEST_DEFAULTS.maxRetailerScale)) {
                continue;
            }
            let keyword = null;
            let category = null;
            if (opp.keyword_id) {
                const { data: kwRow } = await supabase
                    .from("keywords")
                    .select("keyword, category")
                    .eq("id", opp.keyword_id)
                    .maybeSingle();
                keyword = kwRow?.keyword ?? null;
                category = kwRow?.category ?? null;
            }
            const targetPriority = Number(opp.target_priority_score ?? 0);
            const shortlistScore = scoreCroShortlist({
                targetPriority,
                preFit: b.pre_fit_score ?? null,
                platform: b.platform ?? null,
                maturity: b.business_maturity_score ?? null,
                retailerScale: b.retailer_scale_score ?? null,
                readiness: opp.cro_readiness_level,
            });
            const cand = {
                opportunityId: opp.id,
                brandId: opp.brand_id,
                domain: String(b.normalized_domain ?? ""),
                platform: b.platform ?? null,
                preFit: b.pre_fit_score ?? null,
                maturity: b.business_maturity_score ?? null,
                retailerScale: b.retailer_scale_score ?? null,
                category,
                keyword,
                targetUrl: opp.landing_url,
                targetType: opp.cro_readiness_level,
                sourceQuality: opp.source_quality_score != null ? Number(opp.source_quality_score) : null,
                targetPriority,
                shortlistScore,
            };
            const prev = byBrand.get(cand.brandId);
            if (!prev || cand.shortlistScore > prev.shortlistScore) {
                byBrand.set(cand.brandId, cand);
            }
        }
        const shortlist = [...byBrand.values()]
            .sort((a, b) => {
            if (b.targetPriority !== a.targetPriority)
                return b.targetPriority - a.targetPriority;
            return (b.preFit ?? 0) - (a.preFit ?? 0);
        })
            .slice(0, TARGET_HARVEST_DEFAULTS.maxCroShortlist);
        // Mark shortlist without forcing workflow status (constraint-safe)
        for (const s of shortlist) {
            await supabase
                .from("opportunities")
                .update({
                cro_audit_eligible: true,
                updated_at: new Date().toISOString(),
            })
                .eq("id", s.opportunityId);
        }
        report.croReady = shortlist;
        const unresolvedBrands = selected
            .filter((b) => {
            const inShort = shortlist.some((s) => s.brandId === b.id);
            return !inShort;
        })
            .map((b) => ({
            domain: b.normalized_domain,
            platform: b.platform,
            preFit: b.pre_fit_score,
            paidTargetStatus: b.paid_target_status,
        }));
        // Refresh unresolved from DB
        const { data: unresolvedFresh } = await supabase
            .from("brands")
            .select("normalized_domain, platform, pre_fit_score, paid_target_status")
            .in("id", selected.map((s) => s.id))
            .or("paid_target_status.eq.NOT_RESOLVED,paid_target_status.is.null,paid_target_status.eq.PARTIAL");
        report.unresolved = unresolvedFresh ?? unresolvedBrands;
        // ------------------------------------------------------------------
        // 6. Update controlled scale funnel extras
        // ------------------------------------------------------------------
        const { data: scaleRun } = await supabase
            .from("controlled_scale_runs")
            .select("id, funnel, noise_report")
            .eq("status", "completed")
            .order("completed_at", { ascending: false })
            .limit(1)
            .maybeSingle();
        if (scaleRun) {
            const funnel = {
                ...(scaleRun.funnel ?? {}),
                confirmedAdvertisers: selected.length,
                targetsResolved: selected.length - report.unresolved.length,
                exactPaidFunnels: searchExact + shopExactPaid,
                highConfidenceTargets: shopExactListing,
                croReadyShortlist: shortlist.length,
            };
            await supabase
                .from("controlled_scale_runs")
                .update({
                funnel,
                noise_report: {
                    ...(scaleRun.noise_report ?? {}),
                    m722: {
                        runId: run.id,
                        shortlist,
                        unresolved: report.unresolved,
                        search: report.search,
                        shopping: report.shopping,
                        dataQuality: report.dataQuality,
                        dataforseoCost: spent,
                    },
                },
            })
                .eq("id", scaleRun.id);
        }
        report.costs = {
            dataforseo: spent,
            anthropic: 0,
            search: searchCost,
            shopping: shoppingCost,
            cap: maxCost,
        };
        await completeRun(supabase, run.id, "completed", report);
        console.log("\n========== M7.2.2 COMPLETE ==========");
        console.log(JSON.stringify({
            selected: report.confirmedPool.selected,
            search: {
                brandsWithTargets: searchBrandsWithTargets,
                exactPaid: searchExact,
                cost: searchCost,
            },
            shopping: {
                brands: shoppingResults.length,
                exactPaid: shopExactPaid,
                exactListings: shopExactListing,
                free: shopFree,
                unresolved: shopUnresolved,
                cost: shoppingCost,
            },
            croReady: shortlist,
            unresolved: report.unresolved,
            mismatches: allMismatches.length,
            dogsenLyko: report.dataQuality,
            costs: report.costs,
        }, null, 2));
    }
    catch (err) {
        await completeRun(supabase, run.id, "failed", {
            error: err instanceof Error ? err.message : String(err),
            partial: report,
            dataforseo_cost: spent,
        });
        throw err;
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=harvestConfirmedTargets.js.map