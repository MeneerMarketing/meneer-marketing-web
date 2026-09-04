import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { CONTROLLED_SCALE_DEFAULTS, } from "../config/controlledScale.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { checkGoogleAdsTransparency } from "../services/dataforseo/googleAdsTransparency.js";
import { fetchPaidRankedKeywords } from "../services/dataforseo/rankedPaidKeywords.js";
import { detectKeywordQualityProblems, runKeywordGeneration, } from "../services/keywords/keywordEngine.js";
import { ensureCategoryList, selectControlledScaleKeywords, } from "../services/keywords/controlledKeywordSelector.js";
import { classifyKeywordIntentType } from "../services/keywords/keywordIntentType.js";
import { assignProspectingTier, scoreProspectingValue, } from "../services/keywords/prospectingValue.js";
import { buildProductBrandTokens, buildRetailerNameTokens, } from "../services/keywords/retailerNameDetector.js";
import { computePreFit } from "../services/qualification/preFit.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { applyTransparencyResult } from "../services/supabase/transparencyRepository.js";
import { generateOpportunitiesFromPaidTargets, upsertPaidSearchTargets, } from "../services/supabase/paidTargetsRepository.js";
import { qualifyBrandCandidate } from "../services/qualification/brandQualificationRunner.js";
import { enrichCandidate, saveBrandQualification, } from "../services/supabase/brandsQualificationRepository.js";
import { upsertQualifiedPage } from "../services/supabase/pagesRepository.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";
import { runGoogleAdsDiscovery } from "./discoverGoogleAds.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
function remaining(budget) {
    return Math.max(0, budget.cap - budget.spent);
}
function canSpend(budget, estimated) {
    return budget.spent + estimated <= budget.cap + 1e-9;
}
async function main() {
    // Force crawl-only Anthropic preference for this process
    process.env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH = "false";
    process.env.QUALIFICATION_HAIKU_FALLBACK_ENABLED = "false";
    if (!process.env.DATAFORSEO_MAX_COST_PER_RUN) {
        process.env.DATAFORSEO_MAX_COST_PER_RUN = "0.25";
    }
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dfs = createDataForSeoClient(env);
    const maxKeywords = Math.min(env.CONTROLLED_SCALE_MAX_KEYWORDS, CONTROLLED_SCALE_DEFAULTS.maxKeywords);
    const maxSerpCost = env.CONTROLLED_SCALE_MAX_SERP_COST;
    const totalBudget = {
        spent: 0,
        cap: env.CONTROLLED_SCALE_TOTAL_DATAFORSEO_BUDGET,
    };
    const anthropicBudget = {
        spent: 0,
        cap: env.CONTROLLED_SCALE_MAX_ANTHROPIC_COST,
    };
    console.log("");
    console.log("M7.2 — CONTROLLED MULTI-CATEGORY SCALE");
    console.log(`Max keywords: ${maxKeywords}`);
    console.log(`SERP cap: $${maxSerpCost}`);
    console.log(`Total DataForSEO budget: $${totalBudget.cap}`);
    console.log(`Anthropic cap: $${anthropicBudget.cap}`);
    console.log("No CRO. No outreach. No Meta.");
    console.log("");
    const parentRun = await createRun(supabase, "controlled_scale", {
        milestone: "7.2",
        maxKeywords,
        maxSerpCost,
        totalBudget: totalBudget.cap,
    });
    const { data: scaleRow, error: scaleInsertError } = await supabase
        .from("controlled_scale_runs")
        .insert({
        run_id: parentRun.id,
        status: "running",
    })
        .select("id")
        .single();
    if (scaleInsertError) {
        throw new Error(`Failed to create controlled_scale_runs: ${scaleInsertError.message}`);
    }
    const report = {
        keywords: {},
        discovery: {},
        qualification: {},
        transparency: {},
        targets: {},
        categoryPerformance: {},
        bestProspects: [],
        noise: {},
        costs: { dataForSeo: 0, anthropic: 0 },
    };
    try {
        // ------------------------------------------------------------------
        // 1. Ensure categories active + generate keyword candidates if needed
        // ------------------------------------------------------------------
        await supabase
            .from("keyword_categories")
            .update({ paused: false, active: true, updated_at: new Date().toISOString() })
            .in("id", ensureCategoryList());
        let keywordGenCost = 0;
        if (!env.CONTROLLED_SCALE_SKIP_KEYWORD_GENERATE) {
            for (const categoryId of ensureCategoryList()) {
                const { count } = await supabase
                    .from("keywords")
                    .select("id", { count: "exact", head: true })
                    .eq("category", categoryId)
                    .eq("rejected", false);
                const needGenerate = (count ?? 0) < 20;
                if (!needGenerate) {
                    console.log(`Skip generate ${categoryId}: already ${count} keywords`);
                    continue;
                }
                const estimate = CONTROLLED_SCALE_DEFAULTS.estimatedKeywordIdeasCostPerCategory;
                if (!canSpend(totalBudget, estimate)) {
                    console.log(`STOP keyword generate: budget remaining $${remaining(totalBudget).toFixed(4)}`);
                    break;
                }
                console.log(`Generating keywords for ${categoryId}...`);
                const result = await runKeywordGeneration({
                    client: dfs,
                    supabase,
                    env,
                    categoryId: categoryId,
                    dryEstimateOnly: false,
                });
                keywordGenCost += result.actualCost;
                totalBudget.spent += result.actualCost;
                const problems = detectKeywordQualityProblems(result);
                console.log(`  ${categoryId}: candidates=${result.afterDedupe} qualified=${result.qualified} cost=$${result.actualCost.toFixed(4)}`);
                if (problems.length) {
                    console.log(`  quality notes: ${problems.join("; ")}`);
                }
            }
        }
        // Ensure prospecting scores exist for new category keywords (no paid APIs)
        {
            const retailerTokens = await buildRetailerNameTokens(supabase);
            const productBrandTokens = await buildProductBrandTokens(supabase);
            const { data: unscored } = await supabase
                .from("keywords")
                .select("id, keyword, commercial_intent_score, product_intent_score, keyword_quality_score, search_volume, competition, cpc, prospect_yield_score, unique_domains_found, retailer_ratio, prospecting_tier")
                .in("category", ensureCategoryList())
                .is("prospecting_tier", null)
                .limit(500);
            for (const kw of unscored ?? []) {
                const intent = classifyKeywordIntentType({
                    keyword: kw.keyword,
                    retailerTokens,
                    productBrandTokens,
                });
                const prospecting = scoreProspectingValue({
                    keyword: kw.keyword,
                    intentType: intent.type,
                    commercialIntent: kw.commercial_intent_score,
                    productIntent: kw.product_intent_score,
                    keywordQuality: kw.keyword_quality_score,
                    searchVolume: kw.search_volume,
                    competition: kw.competition != null ? Number(kw.competition) : null,
                    cpc: kw.cpc != null ? Number(kw.cpc) : null,
                    uniqueDomains: kw.unique_domains_found,
                    leadEligibleFound: null,
                    shopifyFound: null,
                    generalRetailersFound: null,
                    comparisonSitesFound: null,
                });
                const tier = assignProspectingTier({
                    intentType: intent.type,
                    prospectingValue: prospecting.score,
                    commercialIntent: kw.commercial_intent_score,
                    productIntent: kw.product_intent_score,
                });
                await supabase
                    .from("keywords")
                    .update({
                    keyword_intent_type: intent.type,
                    keyword_intent_confidence: intent.confidence,
                    keyword_intent_reason: intent.reason,
                    prospecting_value_score: prospecting.score,
                    prospecting_tier: tier.tier,
                    eligible_for_auto_approval: tier.eligibleForAutoApproval,
                    updated_at: new Date().toISOString(),
                })
                    .eq("id", kw.id);
            }
            console.log(`Prospecting scores filled for ${unscored?.length ?? 0} keywords`);
        }
        // ------------------------------------------------------------------
        // 2. Select max 50 keywords
        // ------------------------------------------------------------------
        const selection = await selectControlledScaleKeywords(supabase, {
            maxKeywords,
            cooldownDays: env.KEYWORD_RESCAN_COOLDOWN_DAYS,
        });
        if (selection.selected.length === 0) {
            throw new Error("No keywords selected for controlled scale");
        }
        const estimatedSerp = selection.selected.length *
            (env.KEYWORD_SERP_ESTIMATED_COST_PER_KEYWORD ||
                CONTROLLED_SCALE_DEFAULTS.estimatedSerpCostPerKeyword);
        console.log("");
        console.log("COST PREVIEW");
        console.log(`  Selected keywords: ${selection.selected.length}`);
        console.log(`  By category: ${JSON.stringify(selection.byCategory)}`);
        console.log(`  Branded share: ${selection.brandedCount}/${selection.selected.length}`);
        console.log(`  Avg prospecting: ${selection.avgProspecting}`);
        console.log(`  Avg discovery priority: ${selection.avgPriority}`);
        console.log(`  Skipped cooldown: ${selection.skippedCooldown}`);
        console.log(`  Keyword gen cost so far: $${keywordGenCost.toFixed(4)}`);
        console.log(`  Estimated SERP cost: $${estimatedSerp.toFixed(4)}`);
        console.log(`  SERP cap: $${maxSerpCost.toFixed(4)}`);
        console.log(`  Remaining total budget: $${remaining(totalBudget).toFixed(4)}`);
        console.log("");
        if (estimatedSerp > maxSerpCost) {
            throw new Error(`Estimated SERP $${estimatedSerp.toFixed(4)} exceeds CONTROLLED_SCALE_MAX_SERP_COST $${maxSerpCost}`);
        }
        if (!canSpend(totalBudget, estimatedSerp)) {
            throw new Error(`Estimated SERP would exceed total DataForSEO budget (remaining $${remaining(totalBudget).toFixed(4)})`);
        }
        report.keywords = {
            count: selection.selected.length,
            byCategory: selection.byCategory,
            brandedCount: selection.brandedCount,
            avgProspecting: selection.avgProspecting,
            avgPriority: selection.avgPriority,
            list: selection.selected.map((k) => ({
                keyword: k.keyword,
                category: k.category,
                cluster: k.cluster,
                priority: k.discovery_priority_score,
                prospecting: k.prospecting_value_score,
                intent: k.keyword_intent_type,
                tier: k.prospecting_tier,
            })),
        };
        await supabase
            .from("controlled_scale_runs")
            .update({
            selected_keyword_ids: selection.selected.map((k) => k.id),
        })
            .eq("id", scaleRow.id);
        // ------------------------------------------------------------------
        // 3. Google discovery (no mass transparency)
        // ------------------------------------------------------------------
        process.env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH = "false";
        const discovery = await runGoogleAdsDiscovery({
            keywordIds: selection.selected.map((k) => k.id),
            skipTransparency: true,
            skipSeedKeywords: true,
            maxKeywords: selection.selected.length,
            maxSerpCost: Math.min(maxSerpCost, remaining(totalBudget)),
        });
        totalBudget.spent += discovery.serpCost;
        console.log(`Discovery: keywords=${discovery.keywordsProcessed} ads=${discovery.paidAdsFound} cost=$${discovery.serpCost.toFixed(4)}`);
        report.discovery = {
            keywordsProcessed: discovery.keywordsProcessed,
            paidAdsFound: discovery.paidAdsFound,
            uniqueAdvertisers: discovery.uniqueAdvertisers,
            serpCost: discovery.serpCost,
            runId: discovery.runId,
        };
        // Brands touched by selected keywords
        const keywordIds = selection.selected.map((k) => k.id);
        const { data: brandLinks } = await supabase
            .from("ad_occurrences")
            .select("brand_id, brands(id, normalized_domain, last_crawled_at)")
            .in("keyword_id", keywordIds);
        const brandIds = [
            ...new Set((brandLinks ?? [])
                .map((row) => row.brand_id)
                .filter((id) => Boolean(id))),
        ];
        // ------------------------------------------------------------------
        // 4. Qualify uncrawled brands from this discovery set
        // ------------------------------------------------------------------
        const { data: brandRows } = await supabase
            .from("brands")
            .select("id, normalized_domain, name, confirmed_google_advertiser, transparency_confirmed, last_crawled_at, platform, is_ecommerce, business_type, retailer_scale_score, manual_excluded, business_maturity_score, lead_eligible")
            .in("id", brandIds.length ? brandIds : ["00000000-0000-0000-0000-000000000000"]);
        const toQualify = (brandRows ?? []).filter((b) => !b.last_crawled_at && !b.manual_excluded);
        console.log(`Qualification candidates (uncrawled): ${toQualify.length}`);
        let qualifyErrors = 0;
        let haikuCost = 0;
        try {
            await mapWithConcurrency(toQualify, env.CRAWLER_CONCURRENCY, async (brand) => {
                try {
                    const candidate = await enrichCandidate(supabase, brand);
                    const result = await qualifyBrandCandidate(env, candidate);
                    haikuCost += result.haikuCostEstimate ?? 0;
                    anthropicBudget.spent += result.haikuCostEstimate ?? 0;
                    await saveBrandQualification(supabase, {
                        brandId: brand.id,
                        crawlStatus: result.crawlStatus,
                        isEcommerce: result.isEcommerce,
                        ecommerceConfidence: result.ecommerceConfidence,
                        platform: result.platform,
                        platformConfidence: result.platformConfidence,
                        platformCandidate: result.platformCandidate,
                        platformEvidence: result.platformEvidence,
                        shopifyConfidence: result.shopifyConfidence,
                        businessType: result.businessType,
                        businessTypeConfidence: result.businessTypeConfidence,
                        businessTypeReasoning: result.businessTypeReasoning,
                        leadEligible: result.leadEligible,
                        qualificationReason: result.qualificationReason,
                        qualificationEvidence: result.qualificationEvidence,
                        businessMaturityScore: result.businessMaturityScore,
                        businessMaturityComponents: result.businessMaturityComponents,
                        retailerScaleScore: result.retailerScaleScore,
                        crawlMetadata: {
                            errors: result.errors,
                            haikuCostEstimate: result.haikuCostEstimate,
                        },
                    });
                    if (result.crawlStatus === "success") {
                        await upsertQualifiedPage(supabase, {
                            brandId: brand.id,
                            url: result.crawlStartUrl,
                            finalUrl: result.crawlFinalUrl,
                            crawlStatus: result.crawlStatus,
                            productPage: result.productPage,
                            signals: result.pageSignals,
                            maturityScore: result.businessMaturityScore,
                        });
                    }
                }
                catch (err) {
                    qualifyErrors += 1;
                    logger.warn("Qualify failed", {
                        domain: brand.normalized_domain,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            });
        }
        finally {
            await closeCrawlerBrowser();
        }
        if (haikuCost > anthropicBudget.cap) {
            console.log(`WARN: Anthropic spend $${haikuCost.toFixed(4)} exceeded soft guidance`);
        }
        // ------------------------------------------------------------------
        // 5. Mark PREQUALIFIED + pre_fit for all brands in set
        // ------------------------------------------------------------------
        const { data: refreshedBrands } = await supabase
            .from("brands")
            .select(`id, normalized_domain, business_type, platform, is_ecommerce, business_maturity_score,
         retailer_scale_score, confirmed_google_advertiser, transparency_confirmed,
         manual_excluded, lead_eligible, eligibility_status`)
            .in("id", brandIds.length ? brandIds : ["00000000-0000-0000-0000-000000000000"]);
        let prequalifiedCount = 0;
        let ecommerceCount = 0;
        let brandSpecialist = 0;
        let retailers = 0;
        let comparisonMp = 0;
        let shopifyCount = 0;
        for (const brand of refreshedBrands ?? []) {
            if (brand.is_ecommerce)
                ecommerceCount += 1;
            const type = (brand.business_type ?? "").toUpperCase();
            if (type === "BRAND" || type === "SPECIALIST_WEBSHOP")
                brandSpecialist += 1;
            if (type === "GENERAL_RETAILER")
                retailers += 1;
            if (type === "COMPARISON_SITE" || type === "MARKETPLACE")
                comparisonMp += 1;
            if ((brand.platform ?? "").toUpperCase() === "SHOPIFY")
                shopifyCount += 1;
            const preFit = computePreFit({
                businessType: brand.business_type,
                platform: brand.platform,
                isEcommerce: Boolean(brand.is_ecommerce),
                maturity: brand.business_maturity_score,
                retailerScale: brand.retailer_scale_score,
                confirmedAdvertiser: Boolean(brand.confirmed_google_advertiser),
                transparencyConfirmed: Boolean(brand.transparency_confirmed),
                manualExcluded: Boolean(brand.manual_excluded),
            });
            if (preFit.prequalified)
                prequalifiedCount += 1;
            await supabase
                .from("brands")
                .update({
                prequalified_prospect: preFit.prequalified,
                prequalified_at: preFit.prequalified ? new Date().toISOString() : null,
                pre_fit_score: preFit.score,
                pre_fit_reason: preFit.reason,
                transparency_status: brand.confirmed_google_advertiser
                    ? "CONFIRMED"
                    : brand.transparency_confirmed === false && brand.lead_eligible
                        ? "NOT_CONFIRMED"
                        : "UNCHECKED",
                updated_at: new Date().toISOString(),
            })
                .eq("id", brand.id);
        }
        report.qualification = {
            brandsInSet: refreshedBrands?.length ?? 0,
            qualifiedThisRun: toQualify.length,
            qualifyErrors,
            ecommerce: ecommerceCount,
            brandSpecialist,
            retailers,
            comparisonMarketplace: comparisonMp,
            shopify: shopifyCount,
            prequalified: prequalifiedCount,
            haikuCost,
        };
        // ------------------------------------------------------------------
        // 6. Selective Transparency — top 15 prequalified
        // ------------------------------------------------------------------
        const transparencyCap = Math.min(env.TRANSPARENCY_SCALE_MAX_COST, remaining(totalBudget));
        const transparencyMax = env.TRANSPARENCY_SCALE_MAX_DOMAINS;
        const prequalifiedRanked = [...(refreshedBrands ?? [])]
            .filter((b) => {
            const type = (b.business_type ?? "").toUpperCase();
            return (Boolean(b.is_ecommerce) &&
                (type === "BRAND" || type === "SPECIALIST_WEBSHOP") &&
                !b.manual_excluded &&
                (b.retailer_scale_score ?? 0) <= CONTROLLED_SCALE_DEFAULTS.maxRetailerScaleForPrequalified &&
                (b.business_maturity_score ?? 0) >= CONTROLLED_SCALE_DEFAULTS.minMaturityForPrequalified &&
                !b.confirmed_google_advertiser);
        })
            .sort((a, b) => {
            const scoreA = (a.business_maturity_score ?? 0) +
                ((a.platform ?? "").toUpperCase() === "SHOPIFY" ? 20 : 0) -
                (a.retailer_scale_score ?? 0) * 0.3;
            const scoreB = (b.business_maturity_score ?? 0) +
                ((b.platform ?? "").toUpperCase() === "SHOPIFY" ? 20 : 0) -
                (b.retailer_scale_score ?? 0) * 0.3;
            return scoreB - scoreA;
        })
            .slice(0, transparencyMax);
        let transparencyCost = 0;
        let confirmed = 0;
        let notConfirmed = 0;
        let unresolved = 0;
        const transparencyResults = [];
        console.log(`Transparency candidates: ${prequalifiedRanked.length} (cap $${transparencyCap})`);
        for (const brand of prequalifiedRanked) {
            if (!canSpend(totalBudget, 0.01) || transparencyCost >= transparencyCap) {
                console.log("STOP transparency: budget reached");
                break;
            }
            try {
                const result = await checkGoogleAdsTransparency({ client: dfs, env }, brand.normalized_domain);
                transparencyCost += result.cost;
                totalBudget.spent += result.cost;
                await applyTransparencyResult(supabase, result);
                if (result.confirmedAdvertiser) {
                    confirmed += 1;
                    await supabase
                        .from("brands")
                        .update({ transparency_status: "CONFIRMED" })
                        .eq("id", brand.id);
                }
                else {
                    notConfirmed += 1;
                    await supabase
                        .from("brands")
                        .update({ transparency_status: "NOT_CONFIRMED" })
                        .eq("id", brand.id);
                }
                transparencyResults.push({
                    domain: brand.normalized_domain,
                    confirmed: result.confirmedAdvertiser,
                    adsFound: result.adsFound,
                    cost: result.cost,
                });
            }
            catch (err) {
                unresolved += 1;
                await supabase
                    .from("brands")
                    .update({ transparency_status: "NOT_RESOLVED" })
                    .eq("id", brand.id);
                logger.warn("Transparency unresolved", {
                    domain: brand.normalized_domain,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        }
        report.transparency = {
            checked: transparencyResults.length,
            confirmed,
            notConfirmed,
            unresolved,
            cost: transparencyCost,
            results: transparencyResults,
        };
        // ------------------------------------------------------------------
        // 7. Paid target resolution — max 5 best confirmed
        // ------------------------------------------------------------------
        const paidCap = Math.min(env.PAID_TARGET_SCALE_MAX_COST, remaining(totalBudget));
        const { data: confirmedBrands } = await supabase
            .from("brands")
            .select("id, normalized_domain, business_maturity_score, platform, retailer_scale_score, pre_fit_score, confirmed_google_advertiser, transparency_confirmed")
            .in("id", brandIds.length ? brandIds : ["00000000-0000-0000-0000-000000000000"])
            .or("confirmed_google_advertiser.eq.true,transparency_confirmed.eq.true")
            .eq("manual_excluded", false)
            .order("pre_fit_score", { ascending: false, nullsFirst: false })
            .limit(env.PAID_TARGET_SCALE_MAX_BRANDS);
        let paidCost = 0;
        let exactPaid = 0;
        let highConfidence = 0;
        const paidResults = [];
        for (const brand of confirmedBrands ?? []) {
            if (!canSpend(totalBudget, 0.01) || paidCost >= paidCap) {
                console.log("STOP paid targets: budget reached");
                break;
            }
            try {
                const observedAt = new Date().toISOString();
                const labs = await fetchPaidRankedKeywords({
                    client: dfs,
                    env,
                    target: brand.normalized_domain,
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
                paidResults.push({
                    domain: brand.normalized_domain,
                    labsItems: labs.itemsCount,
                    cost: labs.cost,
                    upserted: saved.upserted,
                    generated,
                });
            }
            catch (err) {
                logger.warn("Paid target resolve failed", {
                    domain: brand.normalized_domain,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        }
        report.targets = {
            brandsChecked: paidResults.length,
            exactPaid,
            highConfidence,
            cost: paidCost,
            results: paidResults,
        };
        // ------------------------------------------------------------------
        // 8. Update keyword_scan_stats + category yield
        // ------------------------------------------------------------------
        for (const kw of selection.selected) {
            const { data: ads } = await supabase
                .from("ad_occurrences")
                .select("brand_id, brands(business_type, lead_eligible, platform, confirmed_google_advertiser)")
                .eq("keyword_id", kw.id);
            const brandMap = new Map();
            for (const ad of ads ?? []) {
                const b = Array.isArray(ad.brands) ? ad.brands[0] : ad.brands;
                if (ad.brand_id && b)
                    brandMap.set(ad.brand_id, b);
            }
            let eligible = 0;
            let shopify = 0;
            let generalRetailers = 0;
            let comparison = 0;
            let marketplaces = 0;
            let confirmedAdv = 0;
            for (const b of brandMap.values()) {
                if (b.lead_eligible)
                    eligible += 1;
                if (String(b.platform ?? "").toUpperCase() === "SHOPIFY")
                    shopify += 1;
                const t = String(b.business_type ?? "").toUpperCase();
                if (t === "GENERAL_RETAILER")
                    generalRetailers += 1;
                if (t === "COMPARISON_SITE")
                    comparison += 1;
                if (t === "MARKETPLACE")
                    marketplaces += 1;
                if (b.confirmed_google_advertiser)
                    confirmedAdv += 1;
            }
            const uniqueDomains = brandMap.size;
            let yieldScore = 20;
            yieldScore += Math.min(25, uniqueDomains * 3);
            yieldScore += Math.min(30, eligible * 12);
            yieldScore += Math.min(20, shopify * 8);
            yieldScore -= Math.min(35, generalRetailers * 5 + comparison * 6 + marketplaces * 8);
            yieldScore = Math.max(0, Math.min(100, Math.round(yieldScore)));
            const perKeywordCost = discovery.keywordsProcessed > 0
                ? discovery.serpCost / discovery.keywordsProcessed
                : null;
            await supabase.from("keyword_scan_stats").insert({
                keyword_id: kw.id,
                run_id: parentRun.id,
                scan_date: new Date().toISOString(),
                cost: perKeywordCost,
                placements: ads?.length ?? 0,
                unique_domains: uniqueDomains,
                lead_eligible: eligible,
                shopify,
                general_retailers: generalRetailers,
                comparison_sites: comparison,
                marketplaces,
                confirmed_advertisers: confirmedAdv,
                prospect_yield_score: yieldScore,
                metadata: { source: "controlled_scale", category: kw.category },
            });
            await supabase
                .from("keywords")
                .update({
                prospect_yield_score: yieldScore,
                placements_found: ads?.length ?? 0,
                unique_domains_found: uniqueDomains,
                lead_eligible_found: eligible,
                shopify_found: shopify,
                general_retailers_found: generalRetailers,
                comparison_sites_found: comparison,
                confirmed_advertisers_found: confirmedAdv,
                serp_cost: perKeywordCost,
                yield_computed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
                .eq("id", kw.id);
        }
        const categoryStats = {};
        for (const cat of ensureCategoryList()) {
            const catKeywords = selection.selected.filter((k) => k.category === cat);
            const catIds = catKeywords.map((k) => k.id);
            const { data: catAds } = await supabase
                .from("ad_occurrences")
                .select("brand_id, brands(business_type, platform, confirmed_google_advertiser, prequalified_prospect)")
                .in("keyword_id", catIds.length ? catIds : ["00000000-0000-0000-0000-000000000000"]);
            const domains = new Set();
            const brandsById = new Map();
            for (const ad of catAds ?? []) {
                if (!ad.brand_id)
                    continue;
                const b = Array.isArray(ad.brands) ? ad.brands[0] : ad.brands;
                if (!b)
                    continue;
                brandsById.set(ad.brand_id, b);
                domains.add(ad.brand_id);
            }
            let specialists = 0;
            let preq = 0;
            let shop = 0;
            let conf = 0;
            for (const b of brandsById.values()) {
                const t = String(b.business_type ?? "").toUpperCase();
                if (t === "BRAND" || t === "SPECIALIST_WEBSHOP")
                    specialists += 1;
                if (b.prequalified_prospect)
                    preq += 1;
                if (String(b.platform ?? "").toUpperCase() === "SHOPIFY")
                    shop += 1;
                if (b.confirmed_google_advertiser)
                    conf += 1;
            }
            const serpShare = selection.selected.length > 0
                ? (discovery.serpCost * catKeywords.length) / selection.selected.length
                : 0;
            const yieldCat = Math.max(0, Math.min(100, Math.round(20 +
                domains.size * 2 +
                specialists * 3 +
                shop * 4 +
                conf * 5 -
                Math.max(0, specialists === 0 ? 10 : 0))));
            categoryStats[cat] = {
                keywordsScanned: catKeywords.length,
                serpCost: Number(serpShare.toFixed(4)),
                domainsFound: domains.size,
                specialistsBrands: specialists,
                prequalified: preq,
                shopify: shop,
                confirmedAdvertisers: conf,
                categoryProspectYieldScore: yieldCat,
            };
            await supabase.from("category_prospect_yield").upsert({
                category_id: cat,
                keywords_scanned: catKeywords.length,
                serp_cost: serpShare,
                domains_found: domains.size,
                specialists_brands: specialists,
                prequalified: preq,
                shopify: shop,
                confirmed_advertisers: conf,
                paid_targets: paidResults.filter(() => true).length,
                category_prospect_yield_score: yieldCat,
                last_run_id: parentRun.id,
                updated_at: new Date().toISOString(),
            });
        }
        report.categoryPerformance = categoryStats;
        // ------------------------------------------------------------------
        // 9. Best prospects + noise
        // ------------------------------------------------------------------
        const { data: best } = await supabase
            .from("brands")
            .select(`id, normalized_domain, business_type, platform, business_maturity_score, retailer_scale_score,
         pre_fit_score, prequalified_prospect, confirmed_google_advertiser, transparency_status, lead_eligible`)
            .in("id", brandIds.length ? brandIds : ["00000000-0000-0000-0000-000000000000"])
            .eq("prequalified_prospect", true)
            .order("pre_fit_score", { ascending: false, nullsFirst: false })
            .limit(15);
        const bestProspects = [];
        for (const b of best ?? []) {
            const { data: sources } = await supabase
                .from("ad_occurrences")
                .select("keywords(keyword, category)")
                .eq("brand_id", b.id)
                .in("keyword_id", keywordIds)
                .limit(5);
            const sourceKeywords = (sources ?? [])
                .map((s) => {
                const kw = Array.isArray(s.keywords) ? s.keywords[0] : s.keywords;
                return kw;
            })
                .filter(Boolean);
            bestProspects.push({
                domain: b.normalized_domain,
                businessType: b.business_type,
                platform: b.platform,
                maturity: b.business_maturity_score,
                retailerScale: b.retailer_scale_score,
                preFit: b.pre_fit_score,
                shopify: (b.platform ?? "").toUpperCase() === "SHOPIFY",
                transparencyStatus: b.transparency_status,
                leadEligible: b.lead_eligible,
                sourceKeywords,
                category: sourceKeywords[0]?.category ?? null,
            });
        }
        report.bestProspects = bestProspects;
        const noiseBrands = (refreshedBrands ?? []).filter((b) => {
            const t = (b.business_type ?? "").toUpperCase();
            return t === "GENERAL_RETAILER" || t === "COMPARISON_SITE" || t === "MARKETPLACE";
        });
        report.noise = {
            retailers: noiseBrands
                .filter((b) => b.business_type === "GENERAL_RETAILER")
                .map((b) => b.normalized_domain),
            comparison: noiseBrands
                .filter((b) => b.business_type === "COMPARISON_SITE")
                .map((b) => b.normalized_domain),
            marketplaces: noiseBrands
                .filter((b) => b.business_type === "MARKETPLACE")
                .map((b) => b.normalized_domain),
        };
        const funnel = {
            keywords: selection.selected.length,
            placements: discovery.paidAdsFound,
            uniqueDomains: refreshedBrands?.length ?? 0,
            ecommerce: ecommerceCount,
            brandSpecialist,
            prequalified: prequalifiedCount,
            shopify: shopifyCount,
            transparencyChecked: transparencyResults.length,
            confirmedAdvertisers: confirmed,
            targetResolutionChecked: paidResults.length,
            exactPaidFunnels: exactPaid,
            highConfidenceTargets: highConfidence,
        };
        report.costs = {
            dataForSeo: Number(totalBudget.spent.toFixed(4)),
            anthropic: Number(anthropicBudget.spent.toFixed(4)),
            keywordGen: keywordGenCost,
            serp: discovery.serpCost,
            transparency: transparencyCost,
            paidTargets: paidCost,
        };
        await supabase
            .from("controlled_scale_runs")
            .update({
            status: "completed",
            funnel,
            category_stats: categoryStats,
            best_prospects: bestProspects,
            noise_report: report.noise,
            dataforseo_cost: totalBudget.spent,
            anthropic_cost: anthropicBudget.spent,
            completed_at: new Date().toISOString(),
        })
            .eq("id", scaleRow.id);
        await completeRun(supabase, parentRun.id, "completed", {
            milestone: "7.2",
            ...report,
            funnel,
            dataForSeoCost: totalBudget.spent,
            anthropicCost: anthropicBudget.spent,
        });
        console.log("");
        console.log("CONTROLLED SCALE COMPLETE");
        console.log(JSON.stringify(funnel, null, 2));
        console.log(`DataForSEO total: $${totalBudget.spent.toFixed(4)}`);
        console.log(`Anthropic total: $${anthropicBudget.spent.toFixed(4)}`);
        console.log("");
        console.log("BEST PROSPECTS");
        bestProspects.forEach((p, i) => {
            console.log(`${i + 1}. ${p.domain} | ${p.businessType} | ${p.platform ?? "—"} | preFit=${p.preFit} | transparency=${p.transparencyStatus ?? "—"}`);
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("Controlled scale failed", { message });
        await supabase
            .from("controlled_scale_runs")
            .update({
            status: "failed",
            dataforseo_cost: totalBudget.spent,
            anthropic_cost: anthropicBudget.spent,
            completed_at: new Date().toISOString(),
            funnel: report,
        })
            .eq("id", scaleRow.id);
        await completeRun(supabase, parentRun.id, "failed", {
            milestone: "7.2",
            error: message,
            dataForSeoCost: totalBudget.spent,
            anthropicCost: anthropicBudget.spent,
            partial: report,
        });
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=controlledScale.js.map