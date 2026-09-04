/**
 * Milestone 9.3.3 — FOCUSED PRODUCTION DISCOVERY.
 *
 * Only the product families that earned their place in calibration run here.
 * Every keyword passes a SERP quality gate before it costs a full discovery
 * call, every domain passes the central prospect gate before anything else
 * touches it, and qualification stays cheap: homepage, listing, one hero page.
 *
 * Hard boundaries: no Claude, no CRO audit, no concept brief, no preview, no
 * contact discovery, no outreach. DataForSEO spend is checked before every call.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
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
import { ARCHETYPE_BY_ID } from "../config/idealProductArchetypes.js";
import { M933_DISCOVERY, M933_DISCOVERY_VERSION, PARKED_FAMILIES, PRODUCTION_BRANCHES, STRONG_PROSPECT_THRESHOLD, TARGET_PROFILE, } from "../config/productionDiscovery.js";
import { expandFamilyKeywords, persistFamilyKeywords, selectProductionKeywords, } from "../services/idealProspect/familyKeywordExpander.js";
import { computeSerpProspectQuality, } from "../services/idealProspect/serpProspectQuality.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { classifyProspectExclusion } from "../services/prospect/prospectPipelineGate.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { computeProspectPreScore } from "../services/prospect/prospectPreScore.js";
import { recoverShoppingSellerAds } from "../services/prospect/shoppingSellerRecovery.js";
import { recomputeBusinessClassification } from "./recomputeBusinessClassification.js";
import { BUSINESS_CLASSIFIER_VERSION } from "../services/crawler/businessClassifier.js";
import { extractAdProduct, resolveHeroProducts, } from "../services/prospect/heroProductResolver.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const REPORT_PATH = resolve(projectRoot, "reports/focused-production-discovery-report.json");
const DASHBOARD_REPORT_PATH = resolve(projectRoot, "dashboard/src/preview/concepts/data/focused-production-discovery-report.json");
const SOURCE = "dataforseo_google_serp_live";
function canSpend(budget, estimate) {
    return budget.spent + estimate <= budget.cap + 1e-9;
}
function percent(part, whole) {
    if (whole <= 0)
        return 0;
    return Math.round((part / whole) * 1000) / 10;
}
/** A keyword earns production discovery on quality, never on volume. */
function approvedForDiscovery(status, qualityScore) {
    if (status === "APPROVED")
        return true;
    return status === "MARGINAL" && qualityScore >= M933_DISCOVERY.minKeywordQualityScore;
}
/** Blank record for a domain, so live and replay build identical state. */
function emptyDomain(input) {
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
        idealProspectPreScore: null,
        preScoreEvidence: [],
        lightChecked: false,
    };
}
/**
 * Rebuilds the advertiser sample from a stored run. Same gate, same scoring,
 * zero DataForSEO spend, so a qualification fix never means buying the SERPs
 * a second time.
 */
async function replayStoredRun(input) {
    const { data, error } = await input.supabase
        .from("ad_occurrences")
        .select("keyword_id, brand_id, landing_url, headline, serp_item_type, raw_payload, brands(normalized_domain, name)")
        .eq("run_id", input.runId);
    if (error)
        throw new Error(`replay load failed: ${error.message}`);
    const rows = data ?? [];
    const recoveredSellers = new Set(rows
        .filter((row) => (row.raw_payload ?? {})
        .seller_domain_resolution)
        .map((row) => String(row.brand_id)));
    const storedByDomain = await loadStoredClassifications(input.supabase, [
        ...new Set(rows
            .map((row) => {
            const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands);
            return brand?.normalized_domain ?? null;
        })
            .filter((domain) => Boolean(domain))),
    ]);
    for (const keyword of input.keywords) {
        const keywordRows = rows.filter((row) => row.keyword_id === keyword.id);
        if (keywordRows.length === 0)
            continue;
        const sample = [];
        const pending = [];
        const seen = new Set();
        for (const row of keywordRows) {
            const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands);
            const domain = brand?.normalized_domain;
            if (!domain)
                continue;
            if (!seen.has(domain)) {
                seen.add(domain);
                sample.push(domain);
            }
            if (isBlacklistedDomain(domain))
                continue;
            const rawItem = (row.raw_payload ?? {});
            let entry = input.domainIndex.get(domain);
            if (!entry) {
                entry = emptyDomain({
                    domain,
                    brandId: row.brand_id ? String(row.brand_id) : null,
                    brandName: brand?.name ?? domain,
                    archetypeId: keyword.archetypeId,
                    familyId: keyword.familyId,
                    familyLabel: keyword.familyLabel,
                    sellerResolution: rawItem.seller_domain_resolution ?? null,
                });
                input.domainIndex.set(domain, entry);
                pending.push(entry);
            }
            if (!entry.keywords.includes(keyword.keyword))
                entry.keywords.push(keyword.keyword);
            const landingUrl = row.landing_url;
            if (landingUrl && !entry.landingUrls.includes(landingUrl))
                entry.landingUrls.push(landingUrl);
            const adProduct = extractAdProduct({
                headline: row.headline ?? null,
                landingUrl,
                serpItemType: String(row.serp_item_type ?? ""),
                rawItem,
            });
            if (adProduct && !entry.adProducts.some((item) => item.title === adProduct.title)) {
                entry.adProducts.push(adProduct);
            }
        }
        const quality = computeSerpProspectQuality(sample.map((domain) => ({
            domain,
            businessType: storedByDomain.get(domain)?.business_type ?? null,
        })), { archetypeTooBroad: keyword.archetypeFit < 40 });
        const approved = approvedForDiscovery(quality.status, quality.prospectSerpQualityScore);
        if (!approved) {
            for (const entry of pending)
                input.domainIndex.delete(entry.domain);
        }
        input.keywordOutcomes.push({
            keyword: keyword.keyword,
            keywordId: keyword.id,
            archetypeId: keyword.archetypeId,
            familyId: keyword.familyId,
            familyLabel: keyword.familyLabel,
            seed: keyword.seed,
            generationSource: keyword.generationSource,
            archetypeFit: keyword.archetypeFit,
            preGateClass: keyword.preGateClass,
            prospectingValue: keyword.prospectingValue,
            searchVolume: keyword.searchVolume,
            status: quality.status,
            serpQualityScore: quality.prospectSerpQualityScore,
            reason: quality.stopReason,
            rawAdvertisers: sample.length,
            prospectEligible: quality.prospectDomains.length,
            approvedForDiscovery: approved,
            cost: 0,
            domains: sample,
            recoveredSellers: 0,
            unresolvedSellers: [],
        });
    }
    return { recoveredSellers: recoveredSellers.size };
}
export async function runFocusedProductionDiscovery(options) {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dataForSeo = createDataForSeoClient(env);
    const budget = { spent: 0, cap: env.M933_MAX_DATAFORSEO_COST };
    const startedAt = new Date().toISOString();
    console.log(`\n=== M9.3.3 FOCUSED PRODUCTION DISCOVERY (${M933_DISCOVERY_VERSION}) ===`);
    console.log(`DataForSEO cap: $${budget.cap.toFixed(3)} · Anthropic: $0.000\n`);
    // ---------------------------------------------------------------------
    // 1. Classifier first. International reach no longer excludes specialists.
    // ---------------------------------------------------------------------
    console.log("Stap 1 — classifier recompute met de nieuwe breedte-logica");
    const recompute = await recomputeBusinessClassification();
    console.log(`  ${recompute.corrected} gecorrigeerd, ${recompute.reverted} onterechte uitsluitingen teruggedraaid, ` +
        `gate ${recompute.regressionPassed}/${recompute.regressionTotal}, ` +
        `classifier ${recompute.classifierRegression.passed}/${recompute.classifierRegression.total}\n`);
    // ---------------------------------------------------------------------
    // 2. Keyword expansion inside the proven families only.
    // ---------------------------------------------------------------------
    console.log("Stap 2 — keyword expansion binnen de bewezen productfamilies");
    const ideasBudget = 0.04;
    const expansion = await expandFamilyKeywords({
        branches: PRODUCTION_BRANCHES,
        client: dataForSeo,
        env,
        ideasLimit: M933_DISCOVERY.keywordIdeasLimit,
        allowIdeas: !options?.dryRun && !options?.replayRunId && canSpend(budget, ideasBudget),
    });
    budget.spent += expansion.ideasCost;
    const selected = selectProductionKeywords(expansion.keywords, {
        maxTotal: M933_DISCOVERY.maxKeywords,
        maxPerFamily: M933_DISCOVERY.maxKeywordsPerFamily,
        branches: PRODUCTION_BRANCHES,
    });
    console.log(`  ${expansion.keywords.length} keywords met volledige lineage, ${expansion.rejected.length} geweigerd, ` +
        `${selected.length} geselecteerd · ideas $${expansion.ideasCost.toFixed(4)}\n`);
    if (options?.dryRun) {
        for (const keyword of selected) {
            console.log(`  ${keyword.archetypeId.padEnd(14)} ${keyword.familyId.padEnd(26)} ${keyword.generationSource.padEnd(17)} fit ${String(keyword.archetypeFit).padStart(3)} · ${keyword.keyword}`);
        }
        console.log(`\nDry run: ${selected.length} keywords, geschat $${(selected.length * M933_DISCOVERY.estimatedSerpCostPerKeyword + expansion.ideasCost).toFixed(4)} van cap $${budget.cap.toFixed(3)}.\n`);
        return;
    }
    // A keyword without a database id cannot carry its lineage, so it never runs.
    // A replay must measure exactly the keywords the stored run paid for, not a
    // freshly expanded set that would silently drop the expansion keywords.
    const persisted = options?.replayRunId
        ? await loadKeywordsFromRun(supabase, options.replayRunId)
        : (await persistFamilyKeywords(supabase, selected)).filter((keyword) => keyword.id !== null);
    const run = await createRun(supabase, "focused_production_discovery", {
        milestone: "M9.3.3",
        version: M933_DISCOVERY_VERSION,
        branches: PRODUCTION_BRANCHES.map((branch) => branch.archetypeId),
        keywords: persisted.map((keyword) => keyword.keyword),
        maxDataForSeoCost: budget.cap,
    });
    const runId = run.id;
    // ---------------------------------------------------------------------
    // 3. SERP per keyword: quality gate and discovery in one paid call.
    // ---------------------------------------------------------------------
    console.log("Stap 3 — SERP per keyword met quality gate en seller resolution");
    const domainIndex = new Map();
    const keywordOutcomes = [];
    const sellerCache = new Map();
    const skippedForBudget = [];
    let serpSpend = 0;
    let recoveredSellerTotal = 0;
    let unresolvedSellerTotal = 0;
    if (options?.replayRunId) {
        const replay = await replayStoredRun({
            supabase,
            runId: options.replayRunId,
            keywords: persisted,
            domainIndex,
            keywordOutcomes,
        });
        recoveredSellerTotal = replay.recoveredSellers;
        console.log(`  replay van run ${options.replayRunId}: ${keywordOutcomes.length} keywords, ${domainIndex.size} domeinen, $0.0000 nieuwe kosten`);
    }
    for (const keyword of options?.replayRunId ? [] : persisted) {
        if (!canSpend(budget, M933_DISCOVERY.estimatedSerpCostPerKeyword)) {
            skippedForBudget.push(keyword.keyword);
            continue;
        }
        let serp;
        try {
            serp = await fetchGooglePaidAds({ client: dataForSeo, env }, keyword.keyword);
        }
        catch (error) {
            console.log(`  ${keyword.keyword}: SERP mislukt (${error instanceof Error ? error.message : "onbekend"})`);
            continue;
        }
        budget.spent += serp.cost;
        serpSpend += serp.cost;
        const recovery = await recoverShoppingSellerAds(serp.unresolvedShoppingAds, {
            timeoutMs: M933_DISCOVERY.sellerProbeTimeoutMs,
            cache: sellerCache,
            maxSellers: M933_DISCOVERY.maxSellerProbesPerKeyword,
        });
        recoveredSellerTotal += recovery.recovered.length;
        unresolvedSellerTotal += recovery.stillUnresolved.length;
        const paidAds = [...serp.paidAds, ...recovery.recovered];
        const sample = [];
        const seenDomains = new Set();
        const pendingDomains = [];
        for (const ad of paidAds) {
            const signal = classifySerpSignal({ serpItemType: ad.serpItemType, rawItem: ad.rawItem });
            if (signal.adSignalType === "NON_PAID")
                continue;
            if (!seenDomains.has(ad.normalizedDomain)) {
                seenDomains.add(ad.normalizedDomain);
                sample.push({ domain: ad.normalizedDomain, landingUrl: ad.landingUrl });
            }
            // Blacklisted domains count as landscape but never become prospects.
            if (isBlacklistedDomain(ad.normalizedDomain))
                continue;
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
            // Raw placements are always stored; the gate decides what moves on.
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
                    archetypeId: keyword.archetypeId,
                    familyId: keyword.familyId,
                    familyLabel: keyword.familyLabel,
                    sellerResolution: ad.rawItem
                        ?.seller_domain_resolution ?? null,
                });
                domainIndex.set(ad.normalizedDomain, entry);
                pendingDomains.push(entry);
            }
            if (!entry.keywords.includes(keyword.keyword))
                entry.keywords.push(keyword.keyword);
            if (ad.landingUrl && !entry.landingUrls.includes(ad.landingUrl)) {
                entry.landingUrls.push(ad.landingUrl);
            }
            // The advertised product itself is the strongest hero signal we get.
            const adProduct = extractAdProduct(ad);
            if (adProduct && !entry.adProducts.some((item) => item.title === adProduct.title)) {
                entry.adProducts.push(adProduct);
            }
        }
        // Quality verdict on this keyword's advertiser mix.
        const stored = await loadStoredClassifications(supabase, sample.map((item) => item.domain));
        const quality = computeSerpProspectQuality(sample.map((item) => ({
            domain: item.domain,
            businessType: stored.get(item.domain)?.business_type ?? null,
        })), { archetypeTooBroad: keyword.archetypeFit < 40 });
        const approved = approvedForDiscovery(quality.status, quality.prospectSerpQualityScore);
        // A bad keyword stops here: its domains never enter qualification.
        if (!approved) {
            for (const entry of pendingDomains)
                domainIndex.delete(entry.domain);
        }
        keywordOutcomes.push({
            keyword: keyword.keyword,
            keywordId: keyword.id,
            archetypeId: keyword.archetypeId,
            familyId: keyword.familyId,
            familyLabel: keyword.familyLabel,
            seed: keyword.seed,
            generationSource: keyword.generationSource,
            archetypeFit: keyword.archetypeFit,
            preGateClass: keyword.preGateClass,
            prospectingValue: keyword.prospectingValue,
            searchVolume: keyword.searchVolume,
            status: quality.status,
            serpQualityScore: quality.prospectSerpQualityScore,
            reason: quality.stopReason,
            rawAdvertisers: sample.length,
            prospectEligible: quality.prospectDomains.length,
            approvedForDiscovery: approved,
            cost: serp.cost,
            domains: sample.map((item) => item.domain),
            recoveredSellers: recovery.recovered.length,
            unresolvedSellers: recovery.stillUnresolved.map((entry) => entry.seller),
        });
        if (keyword.id) {
            await supabase
                .from("keywords")
                .update({
                prospect_serp_quality_score: quality.prospectSerpQualityScore,
                keyword_prospect_status: quality.status,
                keyword_prospect_reason: quality.stopReason,
                keyword_prospect_checked_at: new Date().toISOString(),
                serp_cost: serp.cost,
                last_scanned_at: new Date().toISOString(),
            })
                .eq("id", keyword.id);
        }
        console.log(`  ${approved ? "OK " : "STOP"} ${quality.status.padEnd(22)} ${keyword.keyword} · ${sample.length} advertisers · quality ${quality.prospectSerpQualityScore} · $${serp.cost.toFixed(4)} (totaal $${budget.spent.toFixed(4)})`);
    }
    if (skippedForBudget.length > 0) {
        console.log(`  ${skippedForBudget.length} keyword(s) overgeslagen wegens budgetplafond`);
    }
    const rawAdvertisers = keywordOutcomes.reduce((sum, k) => sum + k.rawAdvertisers, 0);
    const allDiscoveredDomains = new Set(keywordOutcomes.flatMap((k) => k.domains));
    // ---------------------------------------------------------------------
    // 4. Central prospect gate. Nothing continues without passing it.
    // ---------------------------------------------------------------------
    console.log("\nStap 4 — centrale prospect gate");
    const stored = await loadStoredClassifications(supabase, [...domainIndex.keys()]);
    const excludedRetailers = [];
    for (const entry of domainIndex.values()) {
        const known = stored.get(entry.domain);
        entry.businessType = known?.business_type ?? null;
        entry.platform = known?.platform ?? null;
        entry.isEcommerce = known?.is_ecommerce ?? null;
        entry.retailerScaleScore = known?.retailer_scale_score ?? null;
        entry.businessMaturityScore = known?.business_maturity_score ?? null;
        entry.ownBrandSignal = known?.own_brand_signal_score ?? null;
        const verdict = classifyProspectExclusion({
            domain: entry.domain,
            businessType: known?.business_type,
            isEcommerce: known?.is_ecommerce,
            manualExcluded: known?.manual_excluded,
            retailerScaleScore: known?.retailer_scale_score,
            businessMaturityScore: known?.business_maturity_score,
        });
        entry.prospectClass = verdict.prospectClass;
        entry.gateEligible = verdict.eligible;
        entry.gateReason = verdict.reason;
        if (!verdict.eligible) {
            excludedRetailers.push({
                domain: entry.domain,
                prospectClass: verdict.prospectClass,
                reason: verdict.reason,
            });
        }
    }
    console.log(`  ${domainIndex.size - excludedRetailers.length} van ${domainIndex.size} domeinen mogen verder`);
    // ---------------------------------------------------------------------
    // 5. Cheap qualification: homepage, then listing page.
    // ---------------------------------------------------------------------
    console.log("\nStap 5 — goedkope kwalificatie");
    const crawlTimeout = Math.min(env.CRAWLER_TIMEOUT_MS, 20000);
    let lightChecks = 0;
    let catalogChecks = 0;
    const eligible = [...domainIndex.values()].filter((entry) => entry.gateEligible);
    for (const entry of eligible) {
        const known = stored.get(entry.domain);
        const hasCurrentClassification = known?.business_classifier_version === BUSINESS_CLASSIFIER_VERSION &&
            known?.classification_needs_recompute !== true &&
            known?.business_type &&
            known.business_type !== "UNKNOWN" &&
            known.own_brand_signal_score !== null;
        if (!hasCurrentClassification && lightChecks < M933_DISCOVERY.maxLightChecks) {
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
                entry.prospectClass = check.prospectClass;
                entry.gateEligible = check.gateEligible;
                entry.gateReason = check.gateReason;
                if (entry.brandId && check.crawlStatus === "success") {
                    await supabase
                        .from("brands")
                        .update({
                        business_type: check.businessType,
                        business_type_confidence: check.businessTypeConfidence,
                        business_type_reasoning: check.businessTypeReasoning,
                        is_ecommerce: check.isEcommerce,
                        ecommerce_confidence: check.ecommerceConfidence,
                        platform: check.platform,
                        platform_confidence: check.platformConfidence,
                        retailer_scale_score: check.retailerScaleScore,
                        own_brand_signal_score: check.ownBrandSignal,
                        business_classifier_version: BUSINESS_CLASSIFIER_VERSION,
                        classification_needs_recompute: false,
                        classification_recomputed_at: new Date().toISOString(),
                        classification_recompute_reason: "m933_light_check",
                        prospect_gate_class: check.prospectClass,
                        prospect_gate_reason: check.gateReason,
                    })
                        .eq("id", entry.brandId);
                }
            }
            catch {
                // A failed fetch leaves the stored classification in place.
            }
        }
        // The gate can flip on fresh evidence: a chain that looked unknown before.
        if (!entry.gateEligible) {
            excludedRetailers.push({
                domain: entry.domain,
                prospectClass: entry.prospectClass,
                reason: entry.gateReason,
            });
            continue;
        }
        if (entry.isEcommerce === false)
            continue;
        if (catalogChecks >= M933_DISCOVERY.maxCatalogChecks)
            continue;
        catalogChecks += 1;
        const catalog = await runCatalogFocusCheck(entry.domain, crawlTimeout, entry.homepageProductLinks, entry.homepageCategoryLinks);
        entry.catalogFocusScore = catalog.catalogFocusScore;
        entry.catalogVerified = catalog.verified;
        entry.estimatedCatalogSize = catalog.estimatedCatalogSize;
        entry.catalogEvidence = catalog.evidence;
    }
    console.log(`  ${lightChecks} homepage checks · ${catalogChecks} catalogus checks · geen Claude, geen catalog crawl`);
    // ---------------------------------------------------------------------
    // 6. Hero products for the domains that already look right.
    // ---------------------------------------------------------------------
    console.log("\nStap 6 — heroproducten voor de sterkste kandidaten");
    const heroCandidates = eligible
        .filter((entry) => entry.gateEligible && entry.isEcommerce !== false)
        .sort((a, b) => (b.catalogFocusScore ?? 0) - (a.catalogFocusScore ?? 0))
        .slice(0, M933_DISCOVERY.maxHeroResolutions);
    let heroResolutions = 0;
    for (const entry of heroCandidates) {
        heroResolutions += 1;
        const resolved = await resolveHeroProducts({
            domain: entry.domain,
            landingUrls: entry.landingUrls,
            adProducts: entry.adProducts,
            keyword: entry.keywords[0] ?? null,
            timeoutMs: crawlTimeout,
            maxHeroes: M933_DISCOVERY.maxHeroesPerDomain,
        });
        entry.heroes = resolved.heroes;
        entry.pdpWeaknessScore = resolved.pdpWeaknessScore;
        entry.assetReadinessProxy = resolved.assetReadinessProxy;
    }
    console.log(`  ${heroResolutions} kandidaten met heroresolutie via de advertentielandingspagina`);
    // ---------------------------------------------------------------------
    // 7. Pre-score without Claude.
    // ---------------------------------------------------------------------
    for (const entry of eligible) {
        if (!entry.gateEligible)
            continue;
        const heroScore = entry.heroes[0]?.heroScore ?? null;
        const preScore = computeProspectPreScore({
            archetypeId: entry.archetypeId,
            catalogFocusScore: entry.catalogFocusScore ?? 50,
            estimatedCatalogSize: entry.estimatedCatalogSize,
            ownBrandSignal: entry.ownBrandSignal,
            platform: entry.platform,
            pdpWeaknessScore: entry.pdpWeaknessScore,
            heroScore,
            businessMaturityScore: entry.businessMaturityScore,
            retailerBreadthScore: entry.retailerBreadthScore,
            catalogVerified: entry.catalogVerified,
        });
        entry.idealProspectPreScore = preScore.idealProspectPreScore;
        entry.deepDivePdpFitProxy = preScore.deepDivePdpFitProxy;
        entry.preScoreEvidence = preScore.evidence;
    }
    // ---------------------------------------------------------------------
    // 8. Funnel and report.
    // ---------------------------------------------------------------------
    const gatePassed = [...domainIndex.values()].filter((entry) => entry.gateEligible);
    const specialists = gatePassed.filter((entry) => entry.businessType === "SPECIALIST_WEBSHOP" || entry.businessType === "BRAND");
    // Focus counts only when we actually read the catalog. An unverifiable
    // listing is not evidence of a boutique assortment.
    const focused = specialists.filter((entry) => entry.catalogVerified &&
        (entry.catalogFocusScore ?? 0) >= 55 &&
        (entry.estimatedCatalogSize ?? 0) <= TARGET_PROFILE.catalogHardMax);
    const ownBrand = focused.filter((entry) => (entry.ownBrandSignal ?? 0) >= TARGET_PROFILE.minOwnBrandSignal);
    const strongHero = ownBrand.filter((entry) => (entry.heroes[0]?.heroScore ?? 0) >= 45);
    const strongProspects = gatePassed
        .filter((entry) => (entry.idealProspectPreScore ?? 0) >= STRONG_PROSPECT_THRESHOLD)
        .sort((a, b) => (b.idealProspectPreScore ?? 0) - (a.idealProspectPreScore ?? 0));
    const funnel = {
        raw_advertisers: rawAdvertisers,
        prospect_eligible: gatePassed.length,
        ecommerce_specialists: specialists.length,
        focused_catalog: focused.length,
        own_brand: ownBrand.length,
        strong_hero: strongHero.length,
        strong_prospect: strongProspects.length,
    };
    const topProspects = (strongProspects.length > 0 ? strongProspects : gatePassed)
        .sort((a, b) => (b.idealProspectPreScore ?? 0) - (a.idealProspectPreScore ?? 0))
        .slice(0, M933_DISCOVERY.topProspects)
        .map((entry) => ({
        domain: entry.domain,
        siteUrl: `https://${entry.domain}`,
        branch: entry.archetypeId,
        branchLabel: ARCHETYPE_BY_ID.get(entry.archetypeId)?.label ?? entry.archetypeId,
        sourceKeyword: entry.keywords[0] ?? null,
        allKeywords: entry.keywords,
        familyId: entry.familyId,
        familyLabel: entry.familyLabel,
        platform: entry.platform,
        businessType: entry.businessType,
        commerceModel: entry.isEcommerce ? "ECOMMERCE" : "ONBEKEND",
        estimatedCatalogSize: entry.estimatedCatalogSize,
        catalogFocusScore: entry.catalogFocusScore,
        catalogVerified: entry.catalogVerified,
        catalogEvidence: entry.catalogEvidence,
        retailerBreadthScore: entry.retailerBreadthScore,
        internationalPresenceScore: entry.internationalPresenceScore,
        ownBrandSignal: entry.ownBrandSignal,
        ownBrandEvidence: entry.ownBrandEvidence,
        googleAdsEvidence: {
            keywords: entry.keywords,
            landingUrls: entry.landingUrls.slice(0, 3),
            sellerResolution: entry.sellerResolution,
        },
        heroProduct: entry.heroes[0]?.title ?? null,
        heroProductUrl: entry.heroes[0]?.url ?? null,
        heroPrice: entry.heroes[0]?.price ?? null,
        heroCurrency: entry.heroes[0]?.currency ?? null,
        additionalHeroes: entry.heroes.slice(1).map((hero) => ({
            title: hero.title,
            url: hero.url,
            price: hero.price,
        })),
        assetReadinessProxy: entry.assetReadinessProxy,
        deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
        currentPdpWeaknessProxy: entry.pdpWeaknessScore,
        idealProspectPreScore: entry.idealProspectPreScore,
        preScoreEvidence: entry.preScoreEvidence,
    }));
    // Spend is cumulative across passes: a replay that fixes scoring must not
    // make the milestone look cheaper than it was.
    const { data: priorRuns } = await supabase
        .from("runs")
        .select("id, metadata")
        .eq("run_type", "focused_production_discovery");
    const priorSpend = (priorRuns ?? [])
        .filter((row) => String(row.id) !== runId)
        .reduce((sum, row) => sum + ((row.metadata ?? {}).dataForSeoCost ?? 0), 0);
    const totalSpend = budget.spent + priorSpend;
    const costPerStrongProspect = strongProspects.length > 0
        ? Math.round((totalSpend / strongProspects.length) * 10000) / 10000
        : null;
    // On replay the persisted rows only cover keywords that produced placements,
    // while the expansion regenerates the current seed list. Taking both keeps a
    // keyword whose SERP call failed visible instead of quietly dropping it.
    const selectedKeywordNames = [
        ...new Set([...expansion.keywords, ...persisted].map((keyword) => keyword.keyword)),
    ];
    const report = {
        milestone: "M9.3.3",
        version: M933_DISCOVERY_VERSION,
        runId,
        startedAt,
        finishedAt: new Date().toISOString(),
        classifier: {
            version: BUSINESS_CLASSIFIER_VERSION,
            scanned: recompute.scanned,
            correctedThisPass: recompute.corrected,
            correctedTotal: recompute.correctedTotal,
            revertedExclusions: recompute.reverted,
            revertedDomains: recompute.revertedDomains,
            flaggedForRecrawl: recompute.flaggedForRecrawl,
            gateRegression: `${recompute.regressionPassed}/${recompute.regressionTotal}`,
            classifierRegression: `${recompute.classifierRegression.passed}/${recompute.classifierRegression.total}`,
            regressionCases: recompute.classifierRegression.cases.map((entry) => ({
                label: entry.label,
                verdict: entry.verdict,
                passed: entry.passed,
                internationalPresenceScore: entry.internationalPresenceScore,
                retailerBreadthScore: entry.retailerBreadthScore,
            })),
        },
        discovery: {
            branches: PRODUCTION_BRANCHES.map((branch) => ({
                archetypeId: branch.archetypeId,
                families: branch.familyIds,
                evidence: branch.evidence,
            })),
            parkedFamilies: [...PARKED_FAMILIES],
            keywordsGenerated: selectedKeywordNames.length,
            keywordsRejected: expansion.rejected.slice(0, 40),
            keywordsTested: keywordOutcomes.length,
            keywordsApproved: keywordOutcomes.filter((k) => k.approvedForDiscovery).length,
            keywordsNotTested: selectedKeywordNames.filter((keyword) => !keywordOutcomes.some((entry) => entry.keyword === keyword)),
            rawAdvertisers,
            uniqueAdvertisers: allDiscoveredDomains.size,
            shoppingSellersResolved: recoveredSellerTotal,
            shoppingSellersUnresolved: unresolvedSellerTotal,
            skippedForBudget,
        },
        keywords: keywordOutcomes,
        funnel,
        funnelYieldPercent: {
            prospectYield: percent(gatePassed.length, allDiscoveredDomains.size),
            specialistYield: percent(specialists.length, allDiscoveredDomains.size),
            strongProspectYield: percent(strongProspects.length, allDiscoveredDomains.size),
        },
        excludedRetailers: excludedRetailers.slice(0, 40),
        topProspects,
        cost: {
            dataForSeo: Math.round(totalSpend * 10000) / 10000,
            dataForSeoCap: budget.cap,
            keywordIdeas: Math.round(expansion.ideasCost * 10000) / 10000,
            serp: Math.round(serpSpend * 10000) / 10000,
            anthropic: 0,
            costPerStrongProspect,
            lightChecks,
            catalogChecks,
            heroResolutions,
        },
        downstream: {
            croAudits: 0,
            conceptBriefs: 0,
            previews: 0,
            contactDiscovery: 0,
            outreach: 0,
        },
    };
    const serialized = JSON.stringify(report, null, 2);
    await writeFile(REPORT_PATH, serialized, "utf8");
    await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");
    await completeRun(supabase, runId, "completed", {
        keywordsTested: keywordOutcomes.length,
        keywordsApproved: report.discovery.keywordsApproved,
        strongProspects: strongProspects.length,
        dataForSeoCost: budget.spent,
        anthropicCost: 0,
    });
    printReport(report);
}
/** Rehydrates the exact keyword set a stored run used, lineage included. */
async function loadKeywordsFromRun(supabase, runId) {
    const { data: run } = await supabase
        .from("runs")
        .select("metadata")
        .eq("id", runId)
        .maybeSingle();
    const names = (run?.metadata ?? {}).keywords ?? [];
    // The stored placements are the ground truth for what actually ran; the
    // metadata list only adds keywords that returned no advertisers at all.
    const { data: occurrenceRows } = await supabase
        .from("ad_occurrences")
        .select("keyword_id")
        .eq("run_id", runId);
    const keywordIds = [
        ...new Set((occurrenceRows ?? []).map((row) => String(row.keyword_id)).filter(Boolean)),
    ];
    if (keywordIds.length === 0 && names.length === 0)
        return [];
    const columns = "id, keyword, category, cluster, seed_keyword, keyword_source, product_archetype_id, product_family_id, product_archetype_fit_score, keyword_pre_gate_class, prospecting_value_score, search_volume, cpc";
    const byId = new Map();
    if (keywordIds.length > 0) {
        const { data, error } = await supabase.from("keywords").select(columns).in("id", keywordIds);
        if (error)
            throw new Error(`replay keywords load failed: ${error.message}`);
        for (const row of data ?? [])
            byId.set(String(row.id), row);
    }
    if (names.length > 0) {
        const { data } = await supabase.from("keywords").select(columns).in("keyword", names);
        for (const row of data ?? [])
            byId.set(String(row.id), row);
    }
    const data = [...byId.values()];
    return (data ?? []).map((row) => {
        const archetypeId = String(row.product_archetype_id);
        const familyId = String(row.cluster ?? row.product_family_id ?? "");
        const family = ARCHETYPE_BY_ID.get(archetypeId)?.families.find((entry) => entry.id === familyId);
        return {
            id: String(row.id),
            keyword: String(row.keyword),
            category: String(row.category ?? ""),
            archetypeId,
            familyId,
            familyLabel: family?.label ?? familyId,
            seed: String(row.seed_keyword ?? row.keyword),
            generationSource: row.keyword_source === "ARCHETYPE_EXPANSION"
                ? "dataforseo_ideas"
                : "family_seed",
            archetypeFit: Number(row.product_archetype_fit_score ?? 0),
            preGateClass: String(row.keyword_pre_gate_class ?? ""),
            prospectingValue: Number(row.prospecting_value_score ?? 0),
            searchVolume: row.search_volume ?? null,
            cpc: row.cpc ?? null,
        };
    });
}
/** Stored classifications for a batch of domains, chunked for the URL limit. */
async function loadStoredClassifications(supabase, domains) {
    const result = new Map();
    for (let index = 0; index < domains.length; index += 100) {
        const chunk = domains.slice(index, index + 100);
        if (chunk.length === 0)
            continue;
        const { data } = await supabase
            .from("brands")
            .select("normalized_domain, business_type, is_ecommerce, platform, retailer_scale_score, business_maturity_score, manual_excluded, business_classifier_version, classification_needs_recompute, own_brand_signal_score")
            .in("normalized_domain", chunk);
        for (const row of data ?? []) {
            result.set(String(row.normalized_domain), row);
        }
    }
    return result;
}
function printReport(report) {
    console.log("\n=== CLASSIFIER ===");
    console.log(`  versie ${report.classifier.version}`);
    console.log(`  ${report.classifier.correctedThisPass} gecorrigeerd, ${report.classifier.revertedExclusions} onterechte uitsluitingen teruggedraaid`);
    for (const entry of report.classifier.revertedDomains) {
        console.log(`    ${entry.domain}: ${entry.from} → opnieuw bepalen`);
    }
    console.log(`  regressie: gate ${report.classifier.gateRegression} · classifier ${report.classifier.classifierRegression}`);
    console.log("\n=== DISCOVERY ===");
    for (const branch of report.discovery.branches) {
        console.log(`  ${branch.archetypeId}: ${branch.families.join(", ")}`);
    }
    console.log(`  keywords: ${report.discovery.keywordsGenerated} gegenereerd, ${report.discovery.keywordsTested} getest, ${report.discovery.keywordsApproved} goedgekeurd`);
    if (report.discovery.keywordsNotTested.length > 0) {
        console.log(`  niet gemeten in deze run: ${report.discovery.keywordsNotTested.join(", ")}`);
    }
    console.log(`  advertisers: ${report.discovery.rawAdvertisers} ruw, ${report.discovery.uniqueAdvertisers} uniek`);
    console.log(`  shopping sellers: ${report.discovery.shoppingSellersResolved} herleid, ${report.discovery.shoppingSellersUnresolved} onopgelost`);
    console.log("\n=== KEYWORDS ===");
    for (const keyword of report.keywords) {
        console.log(`  ${(keyword.approvedForDiscovery ? "OK" : "STOP").padEnd(4)} ${keyword.status.padEnd(22)} ${keyword.keyword} · ${keyword.familyLabel} · ${keyword.generationSource} · quality ${keyword.serpQualityScore} · ${keyword.rawAdvertisers} advertisers`);
    }
    console.log("\n=== FUNNEL ===");
    for (const [stage, count] of Object.entries(report.funnel)) {
        console.log(`  ${stage.padEnd(22)} ${count}`);
    }
    console.log(`  prospect yield ${report.funnelYieldPercent.prospectYield}% · strong prospect yield ${report.funnelYieldPercent.strongProspectYield}%`);
    console.log("\n=== TOP PROSPECTS ===");
    for (const prospect of report.topProspects) {
        console.log(`\n  ${prospect.domain} · score ${prospect.idealProspectPreScore} · ${prospect.branchLabel}\n` +
            `    keyword: ${prospect.sourceKeyword ?? "onbekend"} (${prospect.familyLabel})\n` +
            `    platform ${prospect.platform ?? "onbekend"} · type ${prospect.businessType ?? "onbekend"} · catalogus ${prospect.estimatedCatalogSize ?? "?"} · focus ${prospect.catalogFocusScore ?? "?"}\n` +
            `    eigen merk ${prospect.ownBrandSignal ?? "?"} · deep-dive fit ${prospect.deepDivePdpFitProxy ?? "?"} · PDP zwakte ${prospect.currentPdpWeaknessProxy ?? "?"}\n` +
            `    hero: ${prospect.heroProduct ?? "geen"} ${prospect.heroPrice ? `(${prospect.heroCurrency ?? "EUR"} ${prospect.heroPrice})` : ""}\n` +
            `    ${prospect.siteUrl}`);
    }
    console.log("\n=== COST ===");
    console.log(`  DataForSEO $${report.cost.dataForSeo.toFixed(4)} van cap $${report.cost.dataForSeoCap.toFixed(3)} (keyword ideas $${report.cost.keywordIdeas.toFixed(4)}, SERP $${report.cost.serp.toFixed(4)})`);
    console.log(`  Anthropic $0.0000`);
    console.log(`  kosten per sterke prospect: ${report.cost.costPerStrongProspect !== null ? `$${report.cost.costPerStrongProspect.toFixed(4)}` : "n.v.t."}`);
    console.log(`\nRapport: ${REPORT_PATH}\n`);
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("runFocusedProductionDiscovery.js")
    : false;
const replayArg = process.argv.find((arg) => arg.startsWith("--replay="));
if (invokedDirectly) {
    runFocusedProductionDiscovery({
        dryRun: process.argv.includes("--dry-run"),
        replayRunId: replayArg ? replayArg.slice("--replay=".length) : undefined,
    })
        .then(async () => {
        // The crawler keeps a browser alive, so the process hangs after the run
        // finishes and the terminal has to be killed by hand.
        await closeCrawlerBrowser();
        process.exit(0);
    })
        .catch(async (error) => {
        console.error(error);
        await closeCrawlerBrowser().catch(() => undefined);
        process.exit(1);
    });
}
//# sourceMappingURL=runFocusedProductionDiscovery.js.map