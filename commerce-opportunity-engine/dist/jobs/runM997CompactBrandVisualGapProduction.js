/**
 * Milestone 9.9.7 — compact brand + strong visual gap production discovery.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds } from "../services/dataforseo/googleSerp.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { buildM997HarvestQueries, M997_DISCOVERY, M997_DISCOVERY_ROUTE, M997_DISCOVERY_VERSION, M997_PARKED_FAMILIES, M997_REPORT_PATH, M997_DASHBOARD_REPORT_PATH, M997_TARGET_PROFILE, } from "../config/compactBrandVisualGap.js";
import { PRIMARY_DISCOVERY_HOOK } from "../config/discoveryHooks.js";
import { gapScoreBand } from "../config/designGapWideScreen.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import { detectPurchaseMode } from "../services/prospect/purchaseModeDetector.js";
import { computePreauditVisualGap, countDomSections, } from "../services/prospect/preauditVisualGap.js";
import { computePreauditPurchaseGap, extractPurchaseGapSignals, } from "../services/prospect/preauditPurchaseGap.js";
import { computeContentPresentationGap, extractContentPresentationSignals, } from "../services/prospect/contentPresentationGap.js";
import { screenPdpVisualRedesignWithVision } from "../services/prospect/visualRedesignVisionScreen.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { buildHeroTargetRecord } from "../services/prospect/heroTargetMetadata.js";
import { evaluatePdpHarvestEarlyReject, evaluatePreVisionBusinessNoise, validatePdpFromCrawl, scorePdpUrlPlausibility, classifyHarvestSourceType, } from "../services/prospect/pdpCandidateGate.js";
import { computeAssetQualityProxy, computeBrandDistinctivenessProxy, computeRawPdpRedesignOpportunity, } from "../services/prospect/rawPdpRedesignOpportunity.js";
import { hardenShowcasePageEntity, assessBrandOwnership, assessCrossDomainMatches, deriveCurrentSiteImpression, extractProductIdentityFingerprint, } from "../services/prospect/showcaseCandidateIntegrity.js";
import { classifyPageEntity } from "../services/prospect/pageEntityClassifier.js";
import { classifyM997LeadType, passesShowcaseSalesCandidateM997, } from "../services/prospect/compactBrandLeadClassifier.js";
import { computeCatalogBreadthMetrics } from "../services/prospect/catalogBreadthScoring.js";
import { assessHumanShowcaseLikelihood } from "../services/prospect/humanShowcaseLikelihood.js";
import { computeValidatedVisualSalesFitM997 } from "../services/prospect/validatedVisualSalesFitM997.js";
import { runHumanGroundTruthCalibration } from "../services/prospect/humanGroundTruthCalibration.js";
import { classifyBusinessModel, } from "../services/prospect/businessModelClassifier.js";
import { computeRedesignMaterialFeasibility, computeHeroCandidateScore, } from "../services/prospect/validatedGapSalesFit.js";
import { inferPriceConfidence } from "../services/prospect/highTicketGapSalesFit.js";
import { assessPriceConsistency } from "../services/prospect/priceConsistencyCheck.js";
import { computeVisualRedesignSalesFit, classifyVisualRedesignOpportunity, } from "../services/prospect/visualRedesignSalesFit.js";
import { isVisuallyUnderdesigned, serpPositionBandExtended, visualQualityBand, } from "../services/prospect/visualQualityScore.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const REPORT_PATH = resolve(projectRoot, M997_REPORT_PATH);
const DASHBOARD_REPORT_PATH = resolve(projectRoot, M997_DASHBOARD_REPORT_PATH);
const SCREENSHOT_DIR = resolve(projectRoot, M997_DISCOVERY.screenshotDir);
function maturityProxy(light) {
    return Math.round(light.ecommerceConfidence * 0.35 +
        light.platformConfidence * 0.15 +
        light.ownBrandSignal * 0.25 +
        (100 - Math.min(light.retailerScaleScore, 85)) * 0.25);
}
function canSpend(budget, est) {
    return budget.spent + est <= budget.cap + 1e-9;
}
function normalizeProductUrl(url) {
    try {
        const parsed = new URL(url);
        parsed.hash = "";
        let path = parsed.pathname.replace(/\/+$/, "");
        if (!path)
            path = "/";
        return `${parsed.origin}${path}`.toLowerCase();
    }
    catch {
        return url.toLowerCase();
    }
}
function screenQueuePriority(input) {
    let score = input.urlPlausibility;
    if (input.serpPositionExtended === "21_50")
        score += 12;
    else if (input.serpPositionExtended === "11_20")
        score += 8;
    else if (input.serpPositionExtended === "51_100")
        score += 14;
    else if (input.serpPositionExtended === "101_PLUS")
        score += 10;
    return score;
}
async function loadSkipProductUrls() {
    const skip = new Set();
    for (const rel of M997_DISCOVERY.skipReportPaths) {
        try {
            const raw = await readFile(resolve(projectRoot, rel), "utf8");
            const report = JSON.parse(raw);
            const pools = [
                report.allScreened,
                report.validatedShowcaseProspects,
                report.humanReviewCandidates,
                report.rescoredRows,
            ];
            for (const pool of pools) {
                if (!Array.isArray(pool))
                    continue;
                for (const row of pool) {
                    const url = row.productUrl;
                    if (typeof url === "string")
                        skip.add(normalizeProductUrl(url));
                }
            }
        }
        catch {
            // prior report optional
        }
    }
    return skip;
}
export async function runM997CompactBrandVisualGapProduction(options) {
    const discovery = M997_DISCOVERY;
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dataForSeo = createDataForSeoClient(env);
    const dfsBudget = { spent: 0, cap: env.M997_MAX_DATAFORSEO_COST };
    const anthropicBudget = { spent: 0, cap: env.M997_MAX_ANTHROPIC_COST };
    const serpOptions = { client: dataForSeo, env };
    const startedAt = new Date().toISOString();
    const crawlTimeout = discovery.crawlTimeoutMs;
    const queries = buildM997HarvestQueries();
    const calibration = runHumanGroundTruthCalibration();
    const skipUrls = await loadSkipProductUrls();
    console.log("\n=== M9.9.7 COMPACT BRAND + STRONG VISUAL GAP ===");
    console.log(`Target: ${M997_TARGET_PROFILE}`);
    console.log(`Calibration fixtures: ${calibration.passCount}/${calibration.total}`);
    console.log(`Queries: ${queries.length} · SERP depth ${discovery.serpDepth}`);
    console.log(`Skip URLs from prior runs: ${skipUrls.size}`);
    console.log(`Parked: ${M997_PARKED_FAMILIES.join(", ")}`);
    if (options?.dryRun) {
        for (const q of queries) {
            console.log(`  ${q.familyId} · ${q.query}`);
        }
        return;
    }
    const run = await createRun(supabase, "compact_brand_visual_gap_production", {
        milestone: discovery.milestone,
        version: M997_DISCOVERY_VERSION,
        route: M997_DISCOVERY_ROUTE,
        targetProfile: M997_TARGET_PROFILE,
        queries: queries.map((q) => q.query),
    });
    const candidateMap = new Map();
    const earlyRejectCounts = {};
    let queriesExecuted = 0;
    const positionBandHarvest = {};
    const makeCandidate = (entry, input) => {
        const key = normalizeProductUrl(input.productUrl);
        if (candidateMap.has(key))
            return;
        if (skipUrls.has(key))
            return;
        if (candidateMap.size >= discovery.maxRawCandidates)
            return;
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
        if (scorePdpUrlPlausibility(input.productUrl, input.domain) < 40) {
            earlyRejectCounts.non_product_url = (earlyRejectCounts.non_product_url ?? 0) + 1;
            return;
        }
        const band = serpPositionBandExtended(input.serpPosition);
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
            productArchetype: entry.productArchetype,
            queryLineage: entry.lineage,
            productTitle: input.title,
            observedPrice: input.observedPrice,
            priceFromCrawl: false,
            priceConfidence: "UNKNOWN",
            pageEntityType: "INVALID",
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
            catalogEstimate: null,
            catalogFocus: null,
            catalogVerified: false,
            ownBrand: null,
            purchaseMode: "UNKNOWN",
            heroTarget: buildHeroTargetRecord({ hero: null, keywords: [entry.query] }),
            heroCandidateScore: null,
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
            redesignMaterialFeasibility: null,
            materialFeasibilityBand: null,
            currentVisualQualityScore: null,
            currentVisualQualityBand: "UNKNOWN",
            visuallyUnderdesigned: false,
            templateDriven: false,
            visionReasoning: null,
            visualRedesignOpportunityType: null,
            visualRedesignSalesFit: null,
            visualRedesignConfidence: "LOW",
            leadType: "REJECT",
            opportunityTier: "NO_VALUE",
            opportunityTierReason: "unscreened",
            showcasePageEntityType: "OTHER",
            preVisionRejected: false,
            preVisionRejectReason: null,
            refinedBusinessModel: "UNKNOWN",
            brandOwnershipConfidence: null,
            brandOwnershipEvidence: [],
            crossDomainProductMatch: "NONE",
            crossDomainPeers: [],
            validatedVisualSalesFit: null,
            currentSiteImpression: null,
            showcaseIntegrityPass: false,
            whyGoodProspect: null,
            whyNotShowcase: null,
            externalBrandBreadth: null,
            businessMaturityScore: null,
            productStoryValue: null,
            paidAcquisition: "NOT_FOUND",
            rank: null,
            screenshots: null,
            manualRationale: null,
            cachedHtml: null,
            catalogCompactnessScore: null,
            catalogCoherenceScore: null,
            businessBreadthScore: null,
            catalogConfidence: null,
            categoryBreadth: null,
            humanShowcaseLikelihood: null,
            humanShowcaseRationale: null,
            visionScoreAllowed: true,
        });
    };
    console.log("\nStap 1 — raw PDP harvest");
    async function fetchSerp(query, depth) {
        try {
            return await fetchGooglePaidAds(serpOptions, query, { depth });
        }
        catch (firstError) {
            await new Promise((resolve) => setTimeout(resolve, 2500));
            return await fetchGooglePaidAds(serpOptions, query, { depth });
        }
    }
    for (const entry of queries) {
        if (!canSpend(dfsBudget, discovery.estimatedSerpCostPerKeyword))
            break;
        let serp;
        try {
            serp = await fetchSerp(entry.query, discovery.serpDepth);
            dfsBudget.spent += serp.cost;
            queriesExecuted += 1;
        }
        catch (error) {
            console.warn(`  SERP skip ${entry.query}: ${error.message}`);
            continue;
        }
        for (const organic of serp.organicResults) {
            if (!organic.url)
                continue;
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
        console.log(`  ${entry.familyId} · ${entry.query} · raw ${candidateMap.size}`);
    }
    if (candidateMap.size < 70 &&
        canSpend(dfsBudget, discovery.estimatedSerpCostExtendedPerKeyword)) {
        console.log("\nStap 1b — extended SERP (51–100) for yield");
        for (const entry of queries.slice(0, queriesExecuted)) {
            if (!canSpend(dfsBudget, discovery.estimatedSerpCostExtendedPerKeyword))
                break;
            if (candidateMap.size >= discovery.maxRawCandidates)
                break;
            try {
                const serp = await fetchSerp(entry.query, discovery.serpDepthExtended);
                dfsBudget.spent += serp.cost;
                for (const organic of serp.organicResults) {
                    if (!organic.url)
                        continue;
                    if ((organic.rank ?? 0) <= discovery.serpDepth)
                        continue;
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
            }
            catch {
                /* extended pass optional */
            }
        }
    }
    console.log(`  raw candidates: ${candidateMap.size}`);
    const validCandidates = [];
    let invalidPdp = 0;
    const entityRejectCounts = {};
    const preVisionRejectCounts = {};
    console.log("\nStap 2 — M9.9.3 entity gate (before vision)");
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
        const hardened = hardenShowcasePageEntity({
            productUrl: candidate.productUrl,
            domain: candidate.domain,
            html: crawl.html,
            productTitle: validation.productTitle ?? candidate.productTitle,
            observedPrice: validation.observedPrice ?? candidate.observedPrice,
        });
        candidate.showcasePageEntityType = hardened.pageEntityType;
        candidate.pageEntityType = entity.pageEntityType;
        if (!validation.valid || !entity.isValidProductDetail) {
            invalidPdp += 1;
            const bucket = hardened.pageEntityType;
            entityRejectCounts[bucket] = (entityRejectCounts[bucket] ?? 0) + 1;
            continue;
        }
        const preVision = evaluatePreVisionBusinessNoise(candidate.domain);
        if (preVision.rejected) {
            invalidPdp += 1;
            candidate.preVisionRejected = true;
            candidate.preVisionRejectReason = preVision.reason;
            const reason = preVision.reason ?? "PRE_VISION_NOISE";
            preVisionRejectCounts[reason] = (preVisionRejectCounts[reason] ?? 0) + 1;
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
        if (priceConsistency.priceConfidence === "LOW") {
            candidate.priceConfidence = "LOW";
        }
        candidate.priceConfidence = inferPriceConfidence({
            observedPrice: candidate.observedPrice,
            heroPrice: candidate.observedPrice,
            priceFromCrawl: candidate.priceFromCrawl,
        });
        validCandidates.push(candidate);
    }
    const screenQueue = validCandidates
        .map((c) => ({
        candidate: c,
        priority: screenQueuePriority({
            serpPositionExtended: c.serpPositionBand,
            urlPlausibility: scorePdpUrlPlausibility(c.productUrl, c.domain),
        }),
    }))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, discovery.maxValidPdpScreens)
        .map((r) => r.candidate);
    console.log(`  valid PDPs: ${validCandidates.length} · screen queue: ${screenQueue.length}`);
    console.log("\nStap 3 — cheap visual screen (broad)");
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    let visionScreens = 0;
    const visualQualityDistribution = {};
    for (let i = 0; i < screenQueue.length; i += 1) {
        const candidate = screenQueue[i];
        console.log(`  screen ${i + 1}/${screenQueue.length} · ${candidate.domain}`);
        let html = candidate.cachedHtml;
        if (!html || html.length < 200) {
            const crawl = await crawlWebsite(candidate.productUrl, crawlTimeout);
            if (crawl.status !== "success")
                continue;
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
        candidate.mobileGap = Math.max(0, Math.min(100, Math.round(purchase.score * 0.55 + 18 + (purchaseSignals.mobileAtcSignal ? 0 : 12))));
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
        let quickPaths = {};
        try {
            quickPaths = await captureViewportScreenshots({
                outputDir: SCREENSHOT_DIR,
                domain: candidate.domain,
                timeoutMs: 12_000,
                shots: [
                    {
                        key: "pdp-desktop-1440x1000",
                        url: candidate.productUrl,
                        viewport: discovery.desktop,
                    },
                ],
            });
        }
        catch {
            console.warn(`  screenshot skip ${candidate.domain}`);
        }
        if (quickPaths["pdp-desktop-1440x1000"] &&
            canSpend(anthropicBudget, 0.002) &&
            visionScreens < discovery.maxVisionScreens) {
            try {
                const vision = await screenPdpVisualRedesignWithVision(env, candidate.domain, quickPaths["pdp-desktop-1440x1000"]);
                anthropicBudget.spent += vision.estimatedCost;
                visionScreens += 1;
                candidate.currentVisualQualityScore =
                    vision.currentVisualQuality ??
                        Math.max(0, Math.min(100, 100 - (candidate.preauditVisualGap ?? 45)));
                candidate.preauditVisualGap = Math.max(0, Math.min(100, (candidate.preauditVisualGap ?? 0) + vision.visualAdjustment));
                candidate.preauditPurchaseGap = Math.max(0, Math.min(100, (candidate.preauditPurchaseGap ?? 0) + vision.purchaseAdjustment));
                candidate.mobileGap = Math.max(0, Math.min(100, (candidate.mobileGap ?? 0) + vision.mobileAdjustment));
                candidate.templateDriven = vision.templateDriven;
                candidate.visionReasoning = vision.reasoning;
                candidate.visualGapBand = gapScoreBand(candidate.preauditVisualGap);
                candidate.purchaseGapBand = gapScoreBand(candidate.preauditPurchaseGap);
            }
            catch {
                console.warn(`  vision skip ${candidate.domain}`);
            }
        }
        else if (candidate.currentVisualQualityScore == null) {
            candidate.currentVisualQualityScore = Math.max(0, Math.min(100, 100 - (candidate.preauditVisualGap ?? 45)));
        }
        candidate.currentVisualQualityBand = visualQualityBand(candidate.currentVisualQualityScore);
        visualQualityDistribution[candidate.currentVisualQualityBand] =
            (visualQualityDistribution[candidate.currentVisualQualityBand] ?? 0) + 1;
        candidate.visuallyUnderdesigned = isVisuallyUnderdesigned(candidate.currentVisualQualityScore, discovery.currentVisualQualityShowcaseMax);
        const material = computeRedesignMaterialFeasibility({
            contentAvailable: candidate.contentAvailable,
            contentPresentation: candidate.contentPresentation,
            assetQualityProxy: candidate.assetQualityProxy,
            materialSweetSpot: raw.materialSweetSpot,
        });
        candidate.redesignMaterialFeasibility = material.score;
        candidate.materialFeasibilityBand = material.band;
        candidate.screened = true;
    }
    const visuallyWeakShortlist = screenQueue
        .filter((c) => c.screened &&
        (c.visuallyUnderdesigned ||
            (c.currentVisualQualityScore != null &&
                c.currentVisualQualityScore < discovery.currentVisualQualityShowcaseMax) ||
            (c.preauditVisualGap ?? 0) >= 58))
        .slice(0, discovery.maxVisuallyWeakBusinessQual);
    console.log(`\nStap 4 — ownership & business on ${visuallyWeakShortlist.length} visually weak PDPs`);
    const shortlistFingerprints = visuallyWeakShortlist.map((c) => extractProductIdentityFingerprint(c.cachedHtml ?? "", c.productUrl, c.domain, c.productTitle));
    const crossMap = assessCrossDomainMatches(shortlistFingerprints);
    for (let wi = 0; wi < visuallyWeakShortlist.length; wi += 1) {
        const candidate = visuallyWeakShortlist[wi];
        const light = await runLightBrandCheck(candidate.domain, crawlTimeout);
        candidate.platform = light.platform;
        candidate.businessType = light.businessType;
        candidate.businessMaturityScore = maturityProxy(light);
        candidate.ownBrand = light.ownBrandSignal;
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
            maxHeroes: 2,
        });
        let hero = heroes.heroes.find((h) => isUsableHeroUrl(h.url, candidate.domain)) ?? null;
        if (!hero?.url && isUsableHeroUrl(candidate.productUrl, candidate.domain)) {
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
        }
        candidate.heroTarget = buildHeroTargetRecord({
            hero,
            keywords: [candidate.sourceQuery],
            heroSelectionEvidence: hero?.evidence ?? [],
        });
        let purchaseMode = "UNKNOWN";
        const heroUrl = hero?.url ?? candidate.productUrl;
        const heroCrawl = await crawlWebsite(heroUrl, crawlTimeout);
        if (heroCrawl.status === "success") {
            purchaseMode = detectPurchaseMode({
                html: heroCrawl.html,
                url: heroUrl,
                heroPrice: hero?.price ?? candidate.observedPrice,
                isEcommerce: light.isEcommerce,
            }).purchaseMode;
        }
        candidate.purchaseMode = purchaseMode;
        const isProfessional = light.isEcommerce &&
            purchaseMode !== "LEAD_GENERATION" &&
            purchaseMode !== "SHOWROOM_ASSISTED" &&
            scale.brandScaleFitScore >= 35 &&
            (light.retailerScaleScore ?? 100) < 70;
        if (isProfessional && bizModel.salesCandidate) {
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
            isValidProductDetail: candidate.validPdp,
            assetContentAvailability: heroes.assetReadinessProxy,
            productFamilyRelevance: true,
        });
        candidate.heroCandidateScore = heroCand.score;
        const redesignFit = computeVisualRedesignSalesFit({
            currentVisualQualityScore: candidate.currentVisualQualityScore,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            redesignMaterialFeasibility: candidate.redesignMaterialFeasibility,
            businessModel: candidate.businessModel,
            businessModelSalesCandidate: candidate.businessModelSalesCandidate,
            companyScaleFit: candidate.companyScaleFit,
            catalogFocus: candidate.catalogFocus,
            ownBrandSignal: candidate.ownBrand,
            businessMaturityScore: candidate.businessMaturityScore,
            contentAvailable: candidate.contentAvailable,
            assetQualityProxy: candidate.assetQualityProxy,
            contentPresentation: candidate.contentPresentation,
            heroCandidateScore: candidate.heroCandidateScore,
            rawPdpRedesignOpportunity: candidate.rawPdpRedesignOpportunity,
            brandDistinctivenessProxy: candidate.brandDistinctivenessProxy,
            heroPrice,
            priceConfidence: candidate.priceConfidence,
            purchaseMode,
            paidAcquisitionLevel: "NOT_FOUND",
        });
        candidate.visualRedesignSalesFit = redesignFit.score;
        candidate.visualRedesignConfidence = redesignFit.confidence;
        candidate.productStoryValue = computeProductStoryValueProxy(candidate);
        const vro = classifyVisualRedesignOpportunity({
            currentVisualQualityScore: candidate.currentVisualQualityScore,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            businessModelSalesCandidate: candidate.businessModelSalesCandidate,
            businessModel: candidate.businessModel,
            redesignMaterialFeasibility: candidate.redesignMaterialFeasibility,
            visualThreshold: discovery.currentVisualQualityShowcaseMax,
        });
        candidate.visualRedesignOpportunityType = vro.type;
        const cross = crossMap.get(candidate.domain) ?? {
            match: "NONE",
            peers: [],
            evidence: [],
        };
        candidate.crossDomainProductMatch = cross.match;
        candidate.crossDomainPeers = cross.peers;
        const productFp = shortlistFingerprints[wi];
        const ownership = assessBrandOwnership({
            domain: candidate.domain,
            productTitle: candidate.productTitle,
            productBrand: productFp.productBrand,
            manufacturer: productFp.manufacturer,
            catalogEstimate: catalog.estimatedCatalogSize,
            ownBrandSignal: candidate.ownBrand,
            businessModel: candidate.businessModel,
            crossDomainMatch: cross.match,
            productUrl: candidate.productUrl,
        });
        candidate.refinedBusinessModel = ownership.refinedBusinessModel;
        candidate.brandOwnershipConfidence = ownership.brandOwnershipConfidence;
        candidate.brandOwnershipEvidence = ownership.brandOwnershipEvidence;
        candidate.externalBrandBreadth = ownership.externalBrandBreadth.value;
        const breadth = computeCatalogBreadthMetrics({
            catalogEstimate: catalog.estimatedCatalogSize,
            catalogVerified: catalog.verified,
            catalogFocusScore: catalog.catalogFocusScore,
            categoryLinks: light.categoryLinks,
            productLinks: light.productLinks,
            externalBrandBreadth: candidate.externalBrandBreadth,
            companyScaleFit: candidate.companyScaleFit,
            homepageHtml: candidate.cachedHtml,
        });
        candidate.catalogCompactnessScore = breadth.catalogCompactnessScore;
        candidate.catalogCoherenceScore = breadth.catalogCoherenceScore;
        candidate.businessBreadthScore = breadth.businessBreadthScore;
        candidate.catalogConfidence = breadth.catalogConfidence;
        candidate.categoryBreadth = breadth.categoryBreadth;
        candidate.currentSiteImpression = deriveCurrentSiteImpression(candidate.currentVisualQualityScore);
        const likelihood = assessHumanShowcaseLikelihood({
            currentSiteImpression: candidate.currentSiteImpression,
            currentVisualQualityScore: candidate.currentVisualQualityScore,
            templateDriven: candidate.templateDriven,
            businessBreadthScore: breadth.businessBreadthScore,
            catalogConfidence: breadth.catalogConfidence,
            catalogCompactnessScore: breadth.catalogCompactnessScore,
            materialFeasibility: candidate.redesignMaterialFeasibility,
            heroCandidateScore: candidate.heroCandidateScore,
            refinedBusinessModel: ownership.refinedBusinessModel,
            visionScoreAllowed: candidate.visionScoreAllowed,
        });
        candidate.humanShowcaseLikelihood = likelihood.likelihood;
        candidate.humanShowcaseRationale = likelihood.rationale;
        candidate.validatedVisualSalesFit = computeValidatedVisualSalesFitM997({
            currentVisualQualityScore: candidate.currentVisualQualityScore,
            preauditVisualGap: candidate.preauditVisualGap,
            preauditPurchaseGap: candidate.preauditPurchaseGap,
            mobileGap: candidate.mobileGap,
            brandOwnershipConfidence: ownership.brandOwnershipConfidence,
            companyScaleFit: candidate.companyScaleFit,
            redesignMaterialFeasibility: candidate.redesignMaterialFeasibility,
            businessMaturityScore: candidate.businessMaturityScore,
            refinedBusinessModel: ownership.refinedBusinessModel,
            currentSiteImpression: candidate.currentSiteImpression,
            catalogBreadth: breadth,
            heroCandidateScore: candidate.heroCandidateScore,
            humanShowcaseLikelihood: likelihood.likelihood,
        });
        const integrity = passesShowcaseSalesCandidateM997({
            pageEntityType: candidate.showcasePageEntityType,
            isValidProductDetail: candidate.showcasePageEntityType === "PRODUCT_DETAIL" &&
                candidate.pageEntityType === "PRODUCT_DETAIL",
            refinedBusinessModel: ownership.refinedBusinessModel,
            brandOwnershipConfidence: ownership.brandOwnershipConfidence,
            businessQualified: candidate.businessQualified,
            companyScaleFit: candidate.companyScaleFit,
            businessMaturityScore: candidate.businessMaturityScore,
            currentSiteImpression: candidate.currentSiteImpression,
            redesignMaterialFeasibility: candidate.redesignMaterialFeasibility,
            businessBreadthScore: breadth.businessBreadthScore,
            catalogConfidence: breadth.catalogConfidence,
        });
        candidate.showcaseIntegrityPass = integrity.pass;
        const lead = classifyM997LeadType({
            showcaseIntegrityPass: integrity.pass,
            validatedVisualSalesFit: candidate.validatedVisualSalesFit ?? 0,
            humanShowcaseLikelihood: likelihood.likelihood,
            currentSiteImpression: candidate.currentSiteImpression,
            refinedBusinessModel: ownership.refinedBusinessModel,
            brandOwnershipConfidence: ownership.brandOwnershipConfidence,
            businessQualified: candidate.businessQualified,
            currentVisualQualityScore: candidate.currentVisualQualityScore,
            redesignMaterialFeasibility: candidate.redesignMaterialFeasibility,
            businessBreadthScore: breadth.businessBreadthScore,
            catalogConfidence: breadth.catalogConfidence,
            heroCandidateScore: candidate.heroCandidateScore,
            visionScoreAllowed: candidate.visionScoreAllowed,
        });
        candidate.leadType = lead.leadType;
        candidate.opportunityTier = lead.opportunityTier;
        candidate.opportunityTierReason = vro.reason;
        candidate.whyNotShowcase = lead.whyNotShowcase;
        if (lead.leadType === "VALIDATED_SHOWCASE_PROSPECT") {
            candidate.whyGoodProspect = buildWhyGoodProspect(candidate);
        }
        candidate.manualRationale = {
            currentLook: candidate.visionReasoning ?? `visual_quality_${candidate.currentVisualQualityScore}`,
            whyVisuallyWeak: `band=${candidate.currentVisualQualityBand}, template=${candidate.templateDriven}`,
            whyBusinessGood: `model=${candidate.businessModel}, scale=${candidate.companyScaleFit}, own=${candidate.ownBrand}`,
            whatWeCouldTransform: `visual_gap=${candidate.preauditVisualGap}, material=${candidate.redesignMaterialFeasibility}`,
        };
    }
    const ranked = [...visuallyWeakShortlist]
        .filter((c) => c.validatedVisualSalesFit != null)
        .sort((a, b) => (b.validatedVisualSalesFit ?? 0) - (a.validatedVisualSalesFit ?? 0));
    for (let i = 0; i < ranked.length; i += 1) {
        ranked[i].rank = i + 1;
    }
    const validatedProspects = ranked
        .filter((c) => c.leadType === "VALIDATED_SHOWCASE_PROSPECT")
        .slice(0, discovery.maxValidatedProspectsListed);
    const humanReviewCandidates = ranked
        .filter((c) => c.leadType === "HUMAN_REVIEW_CANDIDATE")
        .slice(0, discovery.maxHumanReviewCandidates);
    const strongSales = ranked
        .filter((c) => c.leadType === "STRONG_SALES_PROSPECT")
        .slice(0, 5);
    console.log("\nStap 5 — screenshots for top validated + human review");
    const screenshotTargets = [...validatedProspects, ...humanReviewCandidates]
        .filter((c, i, arr) => arr.findIndex((x) => x.domain === c.domain) === i)
        .slice(0, discovery.maxValidatedProspectsListed);
    for (const candidate of screenshotTargets) {
        const fullPaths = await captureViewportScreenshots({
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
        candidate.screenshots = fullPaths;
    }
    const report = {
        milestone: "M9.9.7",
        version: M997_DISCOVERY_VERSION,
        discoveryRoute: M997_DISCOVERY_ROUTE,
        integrityVersion: discovery.integrityVersion,
        targetProfile: M997_TARGET_PROFILE,
        primaryDiscoveryHook: PRIMARY_DISCOVERY_HOOK,
        parkedFamilies: M997_PARKED_FAMILIES,
        humanGroundTruthCalibration: calibration,
        m996ManualConclusion: {
            noCurrentShowcaseWinner: true,
            cleanmaster: "REJECT_FIRST_SHOWCASE",
            nordinahome: "KEEP_NO_FIRST_SHOWCASE",
            oceancross: "KEEP_NO_FIRST_SHOWCASE",
        },
        startedAt,
        finishedAt: new Date().toISOString(),
        queryCoverage: {
            planned: queries.length,
            executed: queriesExecuted,
            families: [...new Set(queries.map((q) => q.familyId))],
        },
        queryMix: queries.map((q) => ({
            familyId: q.familyId,
            query: q.query,
            lineage: q.lineage,
        })),
        queriesExecuted,
        positionBandHarvest,
        earlyRejectCounts,
        entityRejectCounts,
        preVisionRejectCounts,
        funnel: {
            raw_results: candidateMap.size,
            entity_valid_product_details: validCandidates.length,
            entity_rejected: invalidPdp,
            vision_screened: screenQueue.filter((c) => c.screened).length,
            visually_weak_shortlist: visuallyWeakShortlist.length,
            business_qualified: visuallyWeakShortlist.filter((c) => c.businessQualified).length,
            validated_showcase_prospects: validatedProspects.length,
            human_review_candidates: humanReviewCandidates.length,
            strong_sales_prospects: strongSales.length,
        },
        visualQualityDistribution,
        visuallyWeakShortlist: visuallyWeakShortlist.map(stripCandidate),
        ownershipBusinessModel: visuallyWeakShortlist.map((c) => ({
            domain: c.domain,
            businessModel: c.refinedBusinessModel,
            brandOwnershipConfidence: c.brandOwnershipConfidence,
            brandOwnershipEvidence: c.brandOwnershipEvidence,
            crossDomainMatch: c.crossDomainProductMatch,
            externalBrandBreadth: c.externalBrandBreadth,
        })),
        catalogCompactnessCoherence: visuallyWeakShortlist.map((c) => ({
            domain: c.domain,
            catalogEstimate: c.catalogEstimate,
            catalogConfidence: c.catalogConfidence,
            catalogCompactnessScore: c.catalogCompactnessScore,
            catalogCoherenceScore: c.catalogCoherenceScore,
            businessBreadthScore: c.businessBreadthScore,
            categoryBreadth: c.categoryBreadth,
            externalBrandBreadth: c.externalBrandBreadth,
        })),
        humanShowcaseLikelihood: visuallyWeakShortlist.map((c) => ({
            domain: c.domain,
            likelihood: c.humanShowcaseLikelihood,
            rationale: c.humanShowcaseRationale,
            currentSiteImpression: c.currentSiteImpression,
            cvq: c.currentVisualQualityScore,
        })),
        materialSweetSpot: visuallyWeakShortlist
            .filter((c) => (c.currentVisualQualityScore ?? 60) < 55 &&
            (c.redesignMaterialFeasibility ?? 0) >= 65)
            .map((c) => ({
            domain: c.domain,
            cvq: c.currentVisualQualityScore,
            material: c.redesignMaterialFeasibility,
            assets: c.assetQualityProxy,
            content: c.contentAvailable,
        })),
        validatedShowcaseProspects: validatedProspects.map(stripCandidate),
        humanReviewCandidates: humanReviewCandidates.map(stripCandidate),
        top10HumanReview: humanReviewCandidates.slice(0, 10).map(stripCandidate),
        strongSalesProspects: strongSales.map(stripCandidate),
        top5Screenshots: screenshotTargets.map(stripCandidate),
        allScreened: screenQueue.filter((c) => c.screened).map(stripCandidate),
        cost: {
            dataforseo: dfsBudget.spent,
            dataforseoCap: dfsBudget.cap,
            anthropic: anthropicBudget.spent,
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
        screened: screenQueue.filter((c) => c.screened).length,
        validated: validatedProspects.length,
    });
    console.log("\n=== M9.9.7 RESULTS ===");
    console.log(`Human review candidates: ${humanReviewCandidates.length}`);
    console.log(`Validated showcase: ${validatedProspects.length}`);
    for (const c of humanReviewCandidates.slice(0, 10)) {
        console.log(`  ${c.domain} · cvq=${c.currentVisualQualityScore} · breadth=${c.businessBreadthScore} · likelihood=${c.humanShowcaseLikelihood} · fit=${c.validatedVisualSalesFit}`);
    }
    for (const c of validatedProspects) {
        console.log(`  ${c.domain} · cvq=${c.currentVisualQualityScore} · fit=${c.validatedVisualSalesFit} · ${c.leadType}`);
    }
    console.log(`Cost DFS: $${dfsBudget.spent.toFixed(4)} · Vision: $${anthropicBudget.spent.toFixed(4)}`);
    console.log(`Report: ${REPORT_PATH}`);
}
function computeProductStoryValueProxy(c) {
    const available = c.contentAvailable ?? 45;
    const assets = c.assetQualityProxy ?? 45;
    const presentation = c.contentPresentation ?? 55;
    return Math.round(available * 0.35 + assets * 0.35 + (100 - presentation) * 0.3);
}
function buildWhyGoodProspect(c) {
    return [
        `${c.domain} is a ${c.refinedBusinessModel.replace(/_/g, " ").toLowerCase()} shop with ${c.brandOwnershipConfidence ?? "unknown"}% ownership confidence.`,
        `PDP reads ${c.currentSiteImpression?.replace(/_/g, " ").toLowerCase() ?? "unknown"} (CVQ ${c.currentVisualQualityScore}).`,
        `Visual gap ${c.preauditVisualGap} with material ${c.redesignMaterialFeasibility} and scale ${c.companyScaleFit}.`,
        `Focused enough for a visual rebuild pitch without inventing the whole brand from zero.`,
    ].join(" ");
}
function stripCandidate(c) {
    return {
        domain: c.domain,
        productUrl: c.productUrl,
        productTitle: c.productTitle,
        homepage: `https://${c.domain}`,
        platform: c.platform,
        showcasePageEntityType: c.showcasePageEntityType,
        currentSiteImpression: c.currentSiteImpression,
        businessModel: c.refinedBusinessModel,
        brandOwnershipConfidence: c.brandOwnershipConfidence,
        brandOwnershipEvidence: c.brandOwnershipEvidence,
        companyScaleFit: c.companyScaleFit,
        catalogEstimate: c.catalogEstimate,
        catalogFocus: c.catalogFocus,
        catalogConfidence: c.catalogConfidence,
        catalogCompactnessScore: c.catalogCompactnessScore,
        catalogCoherenceScore: c.catalogCoherenceScore,
        businessBreadthScore: c.businessBreadthScore,
        categoryBreadth: c.categoryBreadth,
        externalBrandBreadth: c.externalBrandBreadth,
        crossDomainProductMatch: c.crossDomainProductMatch,
        heroPrice: c.heroTarget.heroPrice ?? c.observedPrice,
        priceConfidence: c.priceConfidence,
        currentVisualQualityScore: c.currentVisualQualityScore,
        currentVisualQualityBand: c.currentVisualQualityBand,
        visualGap: c.preauditVisualGap,
        purchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        assetQuality: c.assetQualityProxy,
        contentAvailable: c.contentAvailable,
        materialFeasibility: c.redesignMaterialFeasibility,
        validatedVisualSalesFit: c.validatedVisualSalesFit,
        humanShowcaseLikelihood: c.humanShowcaseLikelihood,
        humanShowcaseRationale: c.humanShowcaseRationale,
        heroCandidateScore: c.heroCandidateScore,
        visualRedesignOpportunityType: c.visualRedesignOpportunityType,
        leadType: c.leadType,
        opportunityTier: c.opportunityTier,
        businessMaturityScore: c.businessMaturityScore,
        paidAcquisition: c.paidAcquisition,
        rank: c.rank,
        screenshots: c.screenshots,
        whyGoodProspect: c.whyGoodProspect,
        whyNotShowcase: c.whyNotShowcase,
        manualRationale: c.manualRationale,
    };
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("runM997CompactBrandVisualGapProduction.js")
    : false;
if (invokedDirectly) {
    runM997CompactBrandVisualGapProduction().catch(async (err) => {
        console.error(err);
        await closeCrawlerBrowser().catch(() => undefined);
        process.exit(1);
    });
}
//# sourceMappingURL=runM997CompactBrandVisualGapProduction.js.map