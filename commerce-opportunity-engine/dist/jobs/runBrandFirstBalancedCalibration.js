/**
 * Milestone 9.6.1 — balanced brand-first calibration across product families.
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
import { buildM961RoundRobinQueries, M961_DISCOVERY, M961_DISCOVERY_VERSION, M961_PARKED_FAMILY_TAGS, M961_PRODUCT_FAMILIES, M961_PROFILE_VERSION, } from "../config/brandFirstBalancedCalibration.js";
import { gapScoreBand } from "../config/designGapWideScreen.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { extractPageSignals } from "../services/crawler/pageExtractor.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { computeDeepDivePdpFitProxy } from "../services/prospect/prospectPreScore.js";
import { classifyOrganicEntity } from "../services/prospect/productBrandExtractor.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import { evaluateBrandFirstEarlyGate, passesBrandFirstEconomicQualifiedM961, } from "../services/prospect/brandFirstEarlyGate.js";
import { computeBrandFirstOpportunityScoreV2, manualReviewVerdict, } from "../services/prospect/brandFirstOpportunityScoreV2.js";
import { validatePaidAcquisition } from "../services/prospect/paidAcquisitionValidation.js";
import { classifyDiscoveryDomain } from "../services/prospect/discoveryEntityGate.js";
import { detectPurchaseMode } from "../services/prospect/purchaseModeDetector.js";
import { computeFamilyYieldAnalytics, recommendProductionFamilies, } from "../services/prospect/familyYieldAnalytics.js";
import { runProductBrandExtractionRegression } from "../services/prospect/productBrandExtractionRegression.js";
import { computePreauditVisualGap, countDomSections, } from "../services/prospect/preauditVisualGap.js";
import { computePreauditPurchaseGap, extractPurchaseGapSignals, } from "../services/prospect/preauditPurchaseGap.js";
import { computeContentPresentationGap, extractContentPresentationSignals, } from "../services/prospect/contentPresentationGap.js";
import { computeRawDesignGapOpportunity } from "../services/prospect/rawDesignGapOpportunity.js";
import { screenPdpViewportWithVision } from "../services/prospect/preauditVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { buildHeroTargetRecord } from "../services/prospect/heroTargetMetadata.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const REPORT_PATH = resolve(projectRoot, "reports/brand-first-balanced-report.json");
const DASHBOARD_REPORT_PATH = resolve(projectRoot, "dashboard/src/preview/concepts/data/brand-first-balanced-report.json");
const SCREENSHOT_DIR = resolve(projectRoot, M961_DISCOVERY.screenshotDir);
function canSpend(budget, est) {
    return budget.spent + est <= budget.cap + 1e-9;
}
async function extractHomepageProductUrls(domain, timeoutMs) {
    const home = await crawlWebsite(`https://${domain}`, timeoutMs);
    if (home.status !== "success")
        return [];
    const signals = extractPageSignals(home.html, home.finalUrl);
    return signals.internalLinks.filter((link) => /\/products?\/|\/producten\/|\/p\//i.test(link));
}
function buildManualReview(candidate) {
    return {
        whyBusinessFits: `First-party ${candidate.firstPartyConfidence}, schaal ${candidate.brandScaleFit}, eigen merk ${candidate.ownBrand ?? "?"}, catalogus ${candidate.catalogEstimate ?? "onbekend"} (focus ${candidate.catalogFocus ?? "?"}).`,
        whyProductFits: `Hero ${candidate.heroTarget.heroTitle ?? "?"} @ €${candidate.heroTarget.heroPrice ?? "?"}, mode ${candidate.purchaseMode}, story ${candidate.productStoryPotential ?? "?"}.`,
        whatIsAlreadyGood: candidate.whatIsAlreadyGood ?? "Nog niet beoordeeld.",
        whatPdpUnderuses: `Visual ${candidate.preauditVisualGap} (${candidate.visualGapBand}), purchase ${candidate.preauditPurchaseGap} (${candidate.purchaseGapBand}), presentatie ${candidate.contentPresentation}.`,
        expectedBeforeAfter: `Score v2 ${candidate.brandFirstOpportunityScoreV2}, profiel ${candidate.sweetSpotProfile}.`,
    };
}
export async function runBrandFirstBalancedCalibration(options) {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dataForSeo = createDataForSeoClient(env);
    const dfsBudget = { spent: 0, cap: env.M961_MAX_DATAFORSEO_COST };
    const anthropicBudget = { spent: 0, cap: env.M961_MAX_ANTHROPIC_COST };
    const serpOptions = { client: dataForSeo, env };
    const startedAt = new Date().toISOString();
    const crawlTimeout = M961_DISCOVERY.crawlTimeoutMs;
    const extractionRegression = runProductBrandExtractionRegression();
    console.log(`\n=== M9.6.1 BALANCED BRAND-FIRST CALIBRATION (${M961_DISCOVERY_VERSION}) ===`);
    console.log(`Extraction regression: ${extractionRegression.passed}/${extractionRegression.total} passed`);
    const queries = buildM961RoundRobinQueries();
    if (options?.dryRun) {
        console.log(`Dry run: ${queries.length} round-robin queries`);
        for (const q of queries)
            console.log(`  ${q.familyId}: ${q.query}`);
        return;
    }
    const run = await createRun(supabase, "brand_first_balanced_calibration", {
        milestone: M961_DISCOVERY.milestone,
        version: M961_DISCOVERY_VERSION,
        profile: M961_PROFILE_VERSION,
        queries: queries.map((q) => q.query),
    });
    const discovered = new Map();
    const familyBrandCounts = new Map();
    const queriesByFamily = new Map();
    const organicRowsByFamily = new Map();
    let organicQueriesExecuted = 0;
    let organicRows = 0;
    let retailerExtractions = 0;
    let agencyExcluded = 0;
    let mediaExcluded = 0;
    console.log("\nStap 1 — balanced organic SERP (family round-robin)");
    for (const entry of queries) {
        if (discovered.size >= M961_DISCOVERY.maxFirstPartyCandidates)
            break;
        const familyCount = familyBrandCounts.get(entry.familyId) ?? 0;
        if (familyCount >= M961_DISCOVERY.maxBrandsPerFamily)
            continue;
        if (!canSpend(dfsBudget, M961_DISCOVERY.estimatedSerpCostPerKeyword))
            break;
        organicQueriesExecuted += 1;
        queriesByFamily.set(entry.familyId, (queriesByFamily.get(entry.familyId) ?? 0) + 1);
        let serp;
        try {
            serp = await fetchGooglePaidAds(serpOptions, entry.query);
            dfsBudget.spent += serp.cost;
        }
        catch (error) {
            console.warn(`  SERP skip ${entry.query}: ${error.message}`);
            continue;
        }
        for (const organic of serp.organicResults) {
            organicRows += 1;
            organicRowsByFamily.set(entry.familyId, (organicRowsByFamily.get(entry.familyId) ?? 0) + 1);
            const gate = classifyDiscoveryDomain(organic.normalizedDomain);
            if (gate.hardExclude) {
                if (gate.entityClass === "AGENCY_EXCLUDED")
                    agencyExcluded += 1;
                if (gate.entityClass === "MEDIA_PUBLISHER" ||
                    gate.entityClass === "SOCIAL_PLATFORM" ||
                    gate.entityClass === "CONTENT_PLATFORM") {
                    mediaExcluded += 1;
                }
                continue;
            }
            const extraction = await classifyOrganicEntity({
                normalizedDomain: organic.normalizedDomain,
                title: organic.title,
                likelyRetailer: organic.likelyRetailer,
                timeoutMs: Math.min(crawlTimeout, 8_000),
            });
            if (extraction.merchantDomain && extraction.entityRole === "OFFICIAL_BRAND_DOMAIN") {
                retailerExtractions += 1;
            }
            const officialDomain = extraction.officialBrandDomain;
            if (!officialDomain || extraction.entityRole !== "OFFICIAL_BRAND_DOMAIN")
                continue;
            const officialGate = classifyDiscoveryDomain(officialDomain);
            if (officialGate.hardExclude) {
                if (officialGate.entityClass === "AGENCY_EXCLUDED")
                    agencyExcluded += 1;
                continue;
            }
            if (!discovered.has(officialDomain)) {
                const currentFamilyCount = familyBrandCounts.get(entry.familyId) ?? 0;
                if (currentFamilyCount >= M961_DISCOVERY.maxBrandsPerFamily)
                    continue;
                discovered.set(officialDomain, {
                    domain: officialDomain,
                    brandName: extraction.productBrandName ?? officialDomain,
                    productFamilyId: entry.familyId,
                    productFamilyLabel: entry.familyLabel,
                    archetypeId: entry.archetypeId,
                    discoverySource: extraction.merchantDomain ? "RETAILER_TO_BRAND_EXTRACTION" : "ORGANIC_PRODUCT_SERP",
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
                    purchaseMode: "UNKNOWN",
                    purchaseModeEvidence: [],
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
                    brandFirstOpportunityScoreV2: null,
                    sweetSpotProfile: null,
                    overallConfidence: "LOW",
                    manualReviewVerdict: "NO_TARGET",
                    designGapScreened: false,
                    rank: null,
                    whatIsAlreadyGood: null,
                    manualReview: null,
                    screenshots: null,
                });
                familyBrandCounts.set(entry.familyId, currentFamilyCount + 1);
            }
            if (discovered.size >= M961_DISCOVERY.maxFirstPartyCandidates)
                break;
        }
        console.log(`  ${entry.familyId} · ${entry.query} · organic ${serp.organicResults.length} · brands ${discovered.size}`);
    }
    console.log(`\nStap 2 — first-party + economic qualification (${discovered.size} brands)`);
    for (const candidate of discovered.values()) {
        const discoveryGate = classifyDiscoveryDomain(candidate.domain);
        if (discoveryGate.hardExclude) {
            candidate.hardReject = true;
            candidate.hardRejectReason = discoveryGate.reason;
            continue;
        }
        const light = await runLightBrandCheck(candidate.domain, crawlTimeout);
        candidate.platform = light.platform;
        candidate.businessType = light.businessType;
        candidate.ownBrand = light.ownBrandSignal;
        const mediaTypes = ["MEDIA_PUBLISHER", "SOCIAL_PLATFORM", "CONTENT_PLATFORM", "NON_ECOMMERCE"];
        if (mediaTypes.includes(light.businessType)) {
            candidate.hardReject = true;
            candidate.hardRejectReason = `media_or_non_ecommerce:${light.businessType}`;
            continue;
        }
        const catalog = await runCatalogFocusCheck(candidate.domain, crawlTimeout, light.productLinks, light.categoryLinks);
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
            businessMaturityScore: null,
            estimatedCatalogSize: catalog.estimatedCatalogSize,
            homepageProductLinks: light.productLinks,
            ownBrandSignal: light.ownBrandSignal,
            firstPartyBrandConfidence: fp.score,
        });
        candidate.brandScaleFit = scale.brandScaleFitScore;
        const homepageProductUrls = await extractHomepageProductUrls(candidate.domain, crawlTimeout);
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
        let heroSelectionEvidence = hero?.evidence ?? [];
        if (!hero?.url || !isUsableHeroUrl(hero.url, candidate.domain)) {
            const flagship = await resolveFlagshipProduct(candidate.domain, crawlTimeout, hero?.title ?? null, homepageProductUrls, [candidate.sourceQuery]);
            if (flagship) {
                hero = {
                    title: flagship.title,
                    url: flagship.url,
                    brand: null,
                    price: flagship.price,
                    currency: "EUR",
                    heroScore: hero?.heroScore ?? 55,
                    heroConfidence: 58,
                    evidence: ["hero_selection_scorer"],
                    source: "landing_linked_product",
                };
                heroSelectionEvidence = ["hero_selection_scorer", "homepage_prominence_weighted"];
            }
        }
        candidate.heroTarget = buildHeroTargetRecord({
            hero,
            keywords: [candidate.sourceQuery],
            resolutionSource: hero?.source ?? "unknown",
            heroSelectionEvidence,
        });
        candidate.productStoryPotential = computeDeepDivePdpFitProxy({
            archetypeId: candidate.archetypeId,
            catalogFocusScore: catalog.catalogFocusScore ?? 50,
            heroScore: hero?.heroScore ?? null,
        });
        candidate.assetContentAvailability = heroes.assetReadinessProxy;
        const heroUrl = hero?.url ?? null;
        let purchaseMode = "UNKNOWN";
        let purchaseEvidence = [];
        if (heroUrl) {
            const heroCrawl = await crawlWebsite(heroUrl, crawlTimeout);
            if (heroCrawl.status === "success") {
                const pm = detectPurchaseMode({
                    html: heroCrawl.html,
                    url: heroUrl,
                    heroPrice: hero?.price ?? null,
                    isEcommerce: light.isEcommerce,
                });
                purchaseMode = pm.purchaseMode;
                purchaseEvidence = pm.evidence;
            }
        }
        candidate.purchaseMode = purchaseMode;
        candidate.purchaseModeEvidence = purchaseEvidence;
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
        candidate.economicQualified = passesBrandFirstEconomicQualifiedM961({
            hardReject: gate.hardReject,
            firstPartyConfidence: fp.score,
            brandScaleFit: scale.brandScaleFitScore,
            heroPrice: hero?.price ?? null,
            ownBrandSignal: light.ownBrandSignal,
            catalogFocusScore: catalog.catalogFocusScore,
            purchaseMode,
        });
    }
    const economicPool = [...discovered.values()]
        .filter((c) => c.economicQualified)
        .sort((a, b) => b.brandScaleFit + b.firstPartyConfidence - (a.brandScaleFit + a.firstPartyConfidence));
    console.log(`  economic qualified: ${economicPool.length}`);
    console.log("\nStap 3 — design-gap screen");
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    let visionScreens = 0;
    const gapPool = economicPool.slice(0, M961_DISCOVERY.maxDesignGapScreens);
    for (const candidate of gapPool) {
        const heroUrl = candidate.heroTarget.heroProductUrl;
        if (!heroUrl)
            continue;
        const crawl = await crawlWebsite(heroUrl, crawlTimeout);
        if (crawl.status !== "success" || crawl.html.length < 200)
            continue;
        const html = crawl.html;
        const contentSignals = extractContentPresentationSignals(html);
        const contentGap = computeContentPresentationGap(contentSignals);
        candidate.contentAvailable = contentGap.contentAvailableScore;
        candidate.contentPresentation = contentGap.contentPresentationQuality;
        const purchaseSignals = extractPurchaseGapSignals(html);
        const purchase = computePreauditPurchaseGap({ html, ...purchaseSignals });
        candidate.preauditPurchaseGap = purchase.score;
        candidate.mobileGap = Math.max(0, Math.min(100, Math.round(purchase.score * 0.55 + 18 + (purchaseSignals.mobileAtcSignal ? 0 : 12))));
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
        candidate.whatIsAlreadyGood = [
            candidate.assetContentAvailability != null && candidate.assetContentAvailability >= 60
                ? "sterke assets op de pagina"
                : null,
            (candidate.contentPresentation ?? 0) >= 65 ? "redelijke contentpresentatie" : null,
            candidate.purchaseMode === "DIRECT_ECOMMERCE" ? "directe ecommerce flow" : null,
        ]
            .filter(Boolean)
            .join(" · ");
        const paths = await captureViewportScreenshots({
            outputDir: SCREENSHOT_DIR,
            domain: candidate.domain,
            timeoutMs: M961_DISCOVERY.screenshotTimeoutMs,
            shots: [
                { key: "pdp-desktop-1440x1000", url: heroUrl, viewport: M961_DISCOVERY.desktop },
                { key: "pdp-mobile-390x844", url: heroUrl, viewport: M961_DISCOVERY.mobile },
            ],
        });
        candidate.screenshots = paths;
        if (visionScreens < M961_DISCOVERY.maxVisionScreens &&
            canSpend(anthropicBudget, 0.01) &&
            paths["pdp-desktop-1440x1000"]) {
            const vision = await screenPdpViewportWithVision(env, candidate.domain, paths["pdp-desktop-1440x1000"]);
            anthropicBudget.spent += vision.estimatedCost;
            visionScreens += 1;
            candidate.preauditVisualGap = Math.max(0, Math.min(100, (candidate.preauditVisualGap ?? 0) + vision.visualAdjustment));
            candidate.preauditPurchaseGap = Math.max(0, Math.min(100, (candidate.preauditPurchaseGap ?? 0) + vision.purchaseAdjustment));
            if (vision.presentationQuality != null) {
                candidate.contentPresentation = vision.presentationQuality;
                if (vision.presentationQuality >= 68) {
                    candidate.whatIsAlreadyGood = `${candidate.whatIsAlreadyGood ?? ""} · vision: verzorgde presentatie`.trim();
                }
            }
            candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
            candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
        }
        const opportunity = computeBrandFirstOpportunityScoreV2({
            brandScaleFit: candidate.brandScaleFit,
            firstPartyConfidence: candidate.firstPartyConfidence,
            catalogFocusScore: candidate.catalogFocus,
            catalogVerified: candidate.catalogVerified,
            estimatedCatalogSize: candidate.catalogEstimate,
            ownBrandSignal: candidate.ownBrand,
            heroPrice: candidate.heroTarget.heroPrice,
            heroConfidence: candidate.heroTarget.heroConfidence,
            purchaseMode: candidate.purchaseMode,
            productStoryPotential: candidate.productStoryPotential,
            assetContentAvailability: candidate.assetContentAvailability,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            contentPresentationQuality: candidate.contentPresentation,
            paidAcquisitionLevel: "UNKNOWN",
        });
        candidate.brandFirstOpportunityScoreV2 = opportunity.brandFirstOpportunityScoreV2;
        candidate.sweetSpotProfile = opportunity.sweetSpotProfile;
        candidate.manualReviewVerdict = manualReviewVerdict({
            opportunityScoreV2: opportunity.brandFirstOpportunityScoreV2,
            sweetSpotProfile: opportunity.sweetSpotProfile,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            purchaseMode: candidate.purchaseMode,
            presentationQuality: candidate.contentPresentation,
        });
        candidate.overallConfidence =
            candidate.firstPartyConfidence >= 65 && candidate.catalogVerified ? "MEDIUM" : "LOW";
    }
    console.log("\nStap 4 — paid validation (top candidates only)");
    const rankedPrePaid = [...gapPool]
        .filter((c) => c.brandFirstOpportunityScoreV2 != null)
        .sort((a, b) => (b.brandFirstOpportunityScoreV2 ?? 0) - (a.brandFirstOpportunityScoreV2 ?? 0))
        .slice(0, M961_DISCOVERY.paidValidationMaxCandidates);
    for (const candidate of rankedPrePaid) {
        if (!canSpend(dfsBudget, M961_DISCOVERY.estimatedSerpCostPerKeyword * 2))
            break;
        const paid = await validatePaidAcquisition({
            domain: candidate.domain,
            brandName: candidate.brandName,
            productKeywords: [
                candidate.sourceQuery,
                candidate.heroTarget.heroTitle ?? candidate.sourceQuery,
            ].filter(Boolean),
            serpOptions,
            maxKeywords: M961_DISCOVERY.paidValidationKeywordsPerBrand,
        });
        dfsBudget.spent += paid.cost;
        candidate.paidAcquisition = paid.level;
        candidate.paidEvidence = paid.evidence;
        const opportunity = computeBrandFirstOpportunityScoreV2({
            brandScaleFit: candidate.brandScaleFit,
            firstPartyConfidence: candidate.firstPartyConfidence,
            catalogFocusScore: candidate.catalogFocus,
            catalogVerified: candidate.catalogVerified,
            estimatedCatalogSize: candidate.catalogEstimate,
            ownBrandSignal: candidate.ownBrand,
            heroPrice: candidate.heroTarget.heroPrice,
            heroConfidence: candidate.heroTarget.heroConfidence,
            purchaseMode: candidate.purchaseMode,
            productStoryPotential: candidate.productStoryPotential,
            assetContentAvailability: candidate.assetContentAvailability,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            contentPresentationQuality: candidate.contentPresentation,
            paidAcquisitionLevel: paid.level,
        });
        candidate.brandFirstOpportunityScoreV2 = opportunity.brandFirstOpportunityScoreV2;
        candidate.sweetSpotProfile = opportunity.sweetSpotProfile;
        candidate.manualReviewVerdict = manualReviewVerdict({
            opportunityScoreV2: opportunity.brandFirstOpportunityScoreV2,
            sweetSpotProfile: opportunity.sweetSpotProfile,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            purchaseMode: candidate.purchaseMode,
            presentationQuality: candidate.contentPresentation,
        });
    }
    const familyCounts = new Map();
    const ranked = [...discovered.values()]
        .filter((c) => c.brandFirstOpportunityScoreV2 != null)
        .sort((a, b) => (b.brandFirstOpportunityScoreV2 ?? 0) - (a.brandFirstOpportunityScoreV2 ?? 0))
        .filter((c) => {
        const count = familyCounts.get(c.productFamilyId) ?? 0;
        const family = M961_PRODUCT_FAMILIES.find((f) => f.id === c.productFamilyId);
        const max = family?.maxShortlisted ?? 3;
        if (count >= max)
            return false;
        familyCounts.set(c.productFamilyId, count + 1);
        return true;
    });
    ranked.forEach((c, i) => (c.rank = i + 1));
    const top10 = ranked.slice(0, 10);
    const manualReviewCandidates = ranked
        .filter((c) => c.manualReviewVerdict === "TRUE_MANUAL_REVIEW_CANDIDATE")
        .slice(0, M961_DISCOVERY.maxManualReview);
    for (const candidate of manualReviewCandidates) {
        candidate.manualReview = buildManualReview(candidate);
        if (!candidate.screenshots?.["homepage-desktop-1440x1000"]) {
            const homePaths = await captureViewportScreenshots({
                outputDir: SCREENSHOT_DIR,
                domain: candidate.domain,
                timeoutMs: M961_DISCOVERY.screenshotTimeoutMs,
                shots: [
                    {
                        key: "homepage-desktop-1440x1000",
                        url: `https://${candidate.domain}`,
                        viewport: M961_DISCOVERY.desktop,
                    },
                ],
            });
            candidate.screenshots = { ...candidate.screenshots, ...homePaths };
        }
    }
    const familyYield = computeFamilyYieldAnalytics({
        queriesByFamily,
        organicRowsByFamily,
        candidates: [...discovered.values()].map((c) => ({
            productFamilyId: c.productFamilyId,
            productFamilyLabel: c.productFamilyLabel,
            firstPartyConfidence: c.firstPartyConfidence,
            economicQualified: c.economicQualified,
            designGapScreened: c.designGapScreened,
            preauditVisualGap: c.preauditVisualGap,
            preauditPurchaseGap: c.preauditPurchaseGap,
            contentPresentation: c.contentPresentation,
        })),
        highGapVisualMin: M961_DISCOVERY.highGapVisualMin,
        highGapPurchaseMin: M961_DISCOVERY.highGapPurchaseMin,
    });
    const productionFamilies = recommendProductionFamilies(familyYield);
    const purchaseModeSummary = [...discovered.values()].reduce((acc, c) => {
        acc[c.purchaseMode] = (acc[c.purchaseMode] ?? 0) + 1;
        return acc;
    }, {});
    const report = {
        milestone: M961_DISCOVERY.milestone,
        version: M961_DISCOVERY_VERSION,
        profileVersion: M961_PROFILE_VERSION,
        runId: run.id,
        startedAt,
        finishedAt: new Date().toISOString(),
        parkedFamilies: M961_PARKED_FAMILY_TAGS,
        familyBalance: {
            queriesPlanned: queries.length,
            queriesExecuted: organicQueriesExecuted,
            familiesTested: queriesByFamily.size,
            maxBrandsPerFamily: M961_DISCOVERY.maxBrandsPerFamily,
            maxTotalCandidates: M961_DISCOVERY.maxFirstPartyCandidates,
        },
        retailerBrandExtractionTest: extractionRegression,
        funnel: {
            organic_queries_executed: organicQueriesExecuted,
            organic_rows: organicRows,
            agency_excluded: agencyExcluded,
            media_excluded: mediaExcluded,
            retailer_extractions: retailerExtractions,
            brands_discovered: discovered.size,
            first_party_passed: [...discovered.values()].filter((c) => c.firstPartyConfidence >= M961_DISCOVERY.firstPartyMinConfidence).length,
            economic_qualified: economicPool.length,
            design_gap_screened: gapPool.filter((c) => c.designGapScreened).length,
            paid_validated: rankedPrePaid.length,
            true_manual_review: manualReviewCandidates.length,
        },
        familyYield,
        purchaseModes: purchaseModeSummary,
        top10,
        manualReview: manualReviewCandidates,
        recommendation: {
            productionWorthyFamilies: productionFamilies,
            note: "2–3 families met STRONG of PROMISING verdict en hoogste design-gap yield",
        },
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
function printReport(report) {
    const funnel = report.funnel;
    console.log("\n=== FUNNEL ===");
    for (const [k, v] of Object.entries(funnel))
        console.log(`  ${k.padEnd(28)} ${v}`);
    const familyYield = report.familyYield;
    console.log("\n=== FAMILY VERDICTS ===");
    for (const row of familyYield)
        console.log(`  ${row.familyId}: ${row.verdict}`);
    const rec = report.recommendation;
    console.log("\n=== RECOMMENDATION ===");
    console.log(`  Production-worthy: ${rec.productionWorthyFamilies.join(", ") || "geen"}`);
    const cost = report.cost;
    console.log(`\n=== COST === DataForSEO $${cost.dataForSeo.toFixed(4)} · Anthropic $${cost.anthropic.toFixed(4)}`);
    console.log(`\nRapport: ${REPORT_PATH}\n`);
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("runBrandFirstBalancedCalibration.js")
    : false;
if (invokedDirectly) {
    runBrandFirstBalancedCalibration({ dryRun: process.argv.includes("--dry-run") })
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
//# sourceMappingURL=runBrandFirstBalancedCalibration.js.map