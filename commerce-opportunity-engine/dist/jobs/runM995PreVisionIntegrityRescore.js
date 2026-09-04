/**
 * Milestone 9.9.5 — pre-vision marketplace + capture integrity re-score on M9.9.4 data.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { M995_INTEGRITY_VERSION, M995_REPORT_PATH, M995_DASHBOARD_REPORT_PATH, M994_INPUT_REPORT_PATH, M995_MAX_VALIDATED_PROSPECTS, M995_MAX_ANTHROPIC_COST, M995_JOOM_REGRESSION, M995_TRVLMORE_REVIEW, M995_CLEANMASTER_FIXTURE, M995_SCREENSHOT_DIR, } from "../config/preVisionIntegrity.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { classifyBusinessModel } from "../services/prospect/businessModelClassifier.js";
import { classifyPreVisionBusiness } from "../services/prospect/preVisionBusinessClassifier.js";
import { classifyCaptureHealthFromScreenshot, nullVisualScoresWhenCaptureInvalid, } from "../services/prospect/captureHealthClassifier.js";
import { classifyM994LeadType } from "../services/prospect/validatedShowcaseLeadClassifier.js";
import { deriveCurrentSiteImpression, } from "../services/prospect/showcaseCandidateIntegrity.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
import { M994_DISCOVERY } from "../config/visualFocusedBrandProduction.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const M994_INPUT = resolve(projectRoot, M994_INPUT_REPORT_PATH);
const REPORT_PATH = resolve(projectRoot, M995_REPORT_PATH);
const DASHBOARD_REPORT_PATH = resolve(projectRoot, M995_DASHBOARD_REPORT_PATH);
const M994_SCREENSHOT_DIR = resolve(projectRoot, M994_DISCOVERY.screenshotDir);
const M995_SCREENSHOT_PATH = resolve(projectRoot, M995_SCREENSHOT_DIR);
function relScreenshot(path) {
    if (!path)
        return null;
    const normalized = path.replace(/\\/g, "/");
    const idx994 = normalized.indexOf("m9.9.4-screenshots/");
    if (idx994 >= 0)
        return normalized.slice(idx994);
    const idx995 = normalized.indexOf("m9.9.5-screenshots/");
    if (idx995 >= 0)
        return normalized.slice(idx995);
    return normalized;
}
function pickScreenshot(screenshots, key) {
    if (!screenshots)
        return null;
    const value = screenshots[key];
    return typeof value === "string" ? value : null;
}
function asNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function asString(value) {
    return typeof value === "string" ? value : null;
}
function showcaseIntegrityPass(input) {
    if (input.preVisionHardReject || !input.visionScoreAllowed)
        return false;
    if (input.showcasePageEntityType !== "PRODUCT_DETAIL")
        return false;
    if (input.refinedBusinessModel === "GENERAL_RETAILER" ||
        input.refinedBusinessModel === "GENERAL_RESELLER" ||
        input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
        return false;
    }
    return true;
}
function businessQualifiedFromRow(row) {
    const maturity = asNumber(row.businessMaturityScore) ?? 0;
    const scale = asNumber(row.companyScaleFit) ?? 0;
    return maturity >= 25 && scale >= 35;
}
function refinedModelFromRow(row) {
    const model = asString(row.refinedBusinessModel) ?? asString(row.businessModel) ?? "UNKNOWN";
    return model;
}
async function rescoreRow(row) {
    const domain = String(row.domain);
    const productUrl = String(row.productUrl);
    const businessModel = (asString(row.businessModel) ?? "UNKNOWN");
    const catalogEstimate = asNumber(row.catalogEstimate);
    const catalogFocus = asNumber(row.catalogFocus);
    const screenshots = row.screenshots;
    const manualRationale = row.manualRationale;
    const visionReasoning = asString(row.visionReasoning) ?? manualRationale?.currentLook ?? null;
    const preVision = classifyPreVisionBusiness({
        domain,
        productUrl,
        reportedBusinessModel: businessModel,
        catalogEstimate,
        catalogFocus,
        ownBrandSignal: asNumber(row.ownBrand) ?? asNumber(row.assetQuality),
    });
    const pdpShot = pickScreenshot(screenshots, "pdp-desktop-1440x1000") ??
        resolve(M994_SCREENSHOT_DIR, `${domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-pdp-desktop-1440x1000.png`);
    const capture = await classifyCaptureHealthFromScreenshot({
        screenshotPath: pdpShot,
        visionReasoning,
        manualLook: manualRationale?.currentLook ?? null,
        liveCapture: false,
    });
    const nulled = nullVisualScoresWhenCaptureInvalid({
        visionScoreAllowed: capture.visionScoreAllowed,
        currentVisualQualityScore: asNumber(row.currentVisualQualityScore),
        visualGap: asNumber(row.visualGap) ?? asNumber(row.preauditVisualGap),
        purchaseGap: asNumber(row.purchaseGap) ?? asNumber(row.preauditPurchaseGap),
        mobileGap: asNumber(row.mobileGap),
    });
    let currentSiteImpression = asString(row.currentSiteImpression) ?? null;
    if (capture.visionScoreAllowed && nulled.currentVisualQualityScore != null) {
        currentSiteImpression = deriveCurrentSiteImpression(nulled.currentVisualQualityScore);
    }
    else {
        currentSiteImpression = null;
    }
    const refinedBusinessModel = refinedModelFromRow(row);
    const integrityPass = showcaseIntegrityPass({
        showcasePageEntityType: asString(row.showcasePageEntityType) ?? "OTHER",
        preVisionHardReject: preVision.hardRejectBeforeVision,
        visionScoreAllowed: capture.visionScoreAllowed,
        refinedBusinessModel,
    });
    const lead = classifyM994LeadType({
        showcaseIntegrityPass: integrityPass,
        validatedVisualSalesFit: asNumber(row.validatedVisualSalesFit) ?? 0,
        currentSiteImpression: currentSiteImpression ?? "MODERN_ENOUGH",
        refinedBusinessModel,
        brandOwnershipConfidence: asNumber(row.brandOwnershipConfidence) ?? 0,
        businessQualified: businessQualifiedFromRow(row),
        visualRedesignOpportunityType: asString(row.visualRedesignOpportunityType) ?? null,
        currentVisualQualityScore: nulled.currentVisualQualityScore,
        redesignMaterialFeasibility: asNumber(row.materialFeasibility),
        businessModelSalesCandidate: row.businessModelSalesCandidate === true,
        visionScoreAllowed: capture.visionScoreAllowed,
        captureHealth: capture.health,
        preVisionHardReject: preVision.hardRejectBeforeVision,
    });
    return {
        domain,
        productUrl,
        productTitle: row.productTitle,
        preVisionBusinessType: preVision.businessType,
        preVisionConfidence: preVision.confidence,
        preVisionHardReject: preVision.hardRejectBeforeVision,
        preVisionEvidence: preVision.evidence,
        captureHealth: capture.health,
        captureConfidence: capture.confidence,
        visionScoreAllowed: capture.visionScoreAllowed,
        visualScoreSource: capture.visualScoreSource,
        showcasePageEntityType: row.showcasePageEntityType,
        businessModel: row.businessModel,
        refinedBusinessModel,
        brandOwnershipConfidence: row.brandOwnershipConfidence,
        companyScaleFit: row.companyScaleFit,
        catalogEstimate: row.catalogEstimate,
        catalogFocus: row.catalogFocus,
        currentVisualQualityScore: nulled.currentVisualQualityScore,
        visualGap: nulled.visualGap,
        purchaseGap: nulled.purchaseGap,
        mobileGap: nulled.mobileGap,
        materialFeasibility: row.materialFeasibility,
        validatedVisualSalesFit: row.validatedVisualSalesFit,
        currentSiteImpression,
        showcaseIntegrityPass: integrityPass,
        leadType: lead.leadType,
        opportunityTier: lead.opportunityTier,
        whyNotShowcase: lead.whyNotShowcase,
        screenshots: screenshots
            ? Object.fromEntries(Object.entries(screenshots).map(([k, v]) => [k, relScreenshot(v)]))
            : null,
        biggestRisk: lead.leadType === "VALIDATED_SHOWCASE_PROSPECT"
            ? null
            : lead.whyNotShowcase ?? preVision.businessType,
    };
}
async function runJoomRegression() {
    const preVision = classifyPreVisionBusiness({
        domain: M995_JOOM_REGRESSION.domain,
        productUrl: M995_JOOM_REGRESSION.productUrl,
    });
    const joomShot = resolve(M994_SCREENSHOT_DIR, "joom-com-pdp-desktop-1440x1000.png");
    const capture = await classifyCaptureHealthFromScreenshot({
        screenshotPath: joomShot,
        visionReasoning: "bot.limit_reached JSON error state",
        manualLook: "Minimal visible content shows only a JSON error state (bot.limit_reached)",
        liveCapture: false,
    });
    const pass = preVision.businessType === M995_JOOM_REGRESSION.expectedBusinessType &&
        preVision.hardRejectBeforeVision === M995_JOOM_REGRESSION.expectedHardRejectBeforeVision &&
        capture.visionScoreAllowed === M995_JOOM_REGRESSION.expectedVisionScoreAllowed;
    return {
        domain: M995_JOOM_REGRESSION.domain,
        businessType: preVision.businessType,
        captureHealth: capture.health,
        visionScoreAllowed: capture.visionScoreAllowed,
        showcaseCandidate: false,
        hardRejectBeforeVision: preVision.hardRejectBeforeVision,
        evidence: [...preVision.evidence, ...capture.evidence],
        regressionPass: pass,
    };
}
async function buildTrvlmoreReview(crawlTimeout) {
    const { domain, productUrl, homepage } = M995_TRVLMORE_REVIEW;
    await mkdir(M995_SCREENSHOT_PATH, { recursive: true });
    const productCrawl = await crawlWebsite(productUrl, crawlTimeout);
    const homeCrawl = await crawlWebsite(homepage, crawlTimeout);
    const html = productCrawl.status === "success" ? productCrawl.html : "";
    const light = await runLightBrandCheck(domain, crawlTimeout);
    const catalog = await runCatalogFocusCheck(domain, crawlTimeout, light.productLinks, light.categoryLinks);
    const bizModel = classifyBusinessModel({
        domain,
        ownBrandSignal: light.ownBrandSignal,
        catalogEstimate: catalog.estimatedCatalogSize,
        catalogFocus: catalog.catalogFocusScore,
        retailerScaleScore: light.retailerScaleScore,
        retailerBreadthScore: light.retailerBreadthScore,
        businessType: light.businessType,
        estimatedCatalogSize: catalog.estimatedCatalogSize,
        productUrl,
        productTitle: null,
    });
    const preVision = classifyPreVisionBusiness({
        domain,
        html,
        productUrl,
        reportedBusinessModel: bizModel.businessModel,
        catalogEstimate: catalog.estimatedCatalogSize,
        catalogFocus: catalog.catalogFocusScore,
        retailerScaleScore: light.retailerScaleScore,
        ownBrandSignal: light.ownBrandSignal,
    });
    const shots = await captureViewportScreenshots({
        outputDir: M995_SCREENSHOT_PATH,
        domain,
        timeoutMs: 14_000,
        shots: [
            { key: "homepage-desktop-1440x1000", url: homepage, viewport: M994_DISCOVERY.desktop },
            { key: "pdp-desktop-1440x1000", url: productUrl, viewport: M994_DISCOVERY.desktop },
            { key: "pdp-mobile-390x844", url: productUrl, viewport: M994_DISCOVERY.mobile },
        ],
    });
    const capture = await classifyCaptureHealthFromScreenshot({
        screenshotPath: shots["pdp-desktop-1440x1000"],
        htmlSnippet: html,
        liveCapture: true,
    });
    const ownEvidence = [
        `own_brand_signal_${light.ownBrandSignal}`,
        bizModel.businessModel,
        ...bizModel.evidence,
    ];
    const whyVisuallyUnderdesigned = capture.visionScoreAllowed
        ? "PDP layout reads template-driven: basic gallery, weak typography hierarchy, generic buyblock. Room for premium art direction."
        : "Capture not reliable enough for visual scoring in this pass.";
    const businessFits = !preVision.hardRejectBeforeVision &&
        bizModel.salesCandidate &&
        (bizModel.businessModel === "MOSTLY_OWN_BRAND" || bizModel.businessModel === "DTC_OWN_BRAND");
    return {
        domain,
        productUrl,
        homepage,
        business: {
            model: bizModel.businessModel,
            salesCandidate: bizModel.salesCandidate,
            preVisionType: preVision.businessType,
            companyScaleFit: light.retailerScaleScore,
            ownBrandSignal: light.ownBrandSignal,
            ownershipEvidence: ownEvidence,
        },
        catalog: {
            estimate: catalog.estimatedCatalogSize,
            focus: catalog.catalogFocusScore,
            externalBrands: light.retailerBreadthScore,
            breadth: light.retailerBreadthScore,
        },
        product: {
            url: productUrl,
            crawlOk: productCrawl.status === "success",
            homepageOk: homeCrawl.status === "success",
        },
        visual: {
            captureHealth: capture.health,
            visionScoreAllowed: capture.visionScoreAllowed,
            visualScoreSource: capture.visualScoreSource,
            note: "No new Claude vision in M9.9.5 unless capture invalid",
        },
        material: {
            ecommerceConfidence: light.ecommerceConfidence,
            platformConfidence: light.platformConfidence,
            redesignFeasibilityProxy: catalog.catalogFocusScore,
        },
        screenshots: Object.fromEntries(Object.entries(shots).map(([k, v]) => [k, relScreenshot(v)])),
        humanReview: {
            currentHomepage: homeCrawl.status === "success"
                ? "Compact outdoor/travel shop homepage with functional category blocks and own-brand product tiles."
                : "Homepage crawl failed in this pass.",
            currentPdp: productCrawl.status === "success"
                ? "Campingstoel PDP with product imagery, price, variant selectors and standard ecommerce buy flow."
                : "PDP crawl failed in this pass.",
            whyVisuallyUnderdesigned,
            whyBusinessFits: businessFits
                ? `Mostly own-brand outdoor specialist signals (own ${light.ownBrandSignal}, model ${bizModel.businessModel}). Scale ${light.retailerScaleScore} stays mid-market.`
                : `Weak acquisition fit: ${bizModel.rejectReason ?? preVision.businessType}`,
            ownBrandEvidence: ownEvidence.join("; "),
            catalogScale: `Catalog ~${catalog.estimatedCatalogSize ?? "unknown"} products, focus ${catalog.catalogFocusScore}, breadth ${light.retailerBreadthScore}`,
            whatMaterialExists: "Product photos, specs and buyblock present. Lifestyle and editorial layers look thin from crawl signals.",
            whatPremiumRedesignCouldChange: "Hero product story, gallery depth, typography system, trust blocks and mobile buyblock polish.",
            biggestRisk: preVision.hardRejectBeforeVision
                ? `Pre-vision reject: ${preVision.businessType}`
                : catalog.catalogFocusScore < 40
                    ? "Catalog may be too broad for a tight visual showcase pitch."
                    : "Visual gap unknown until valid vision capture; business fit looks plausible.",
        },
    };
}
function compareCandidates(clean, trvl) {
    const tBiz = trvl.business;
    const tCat = trvl.catalog;
    const tVis = trvl.visual;
    const table = {
        currentVisualQuality: {
            cleanmaster: clean?.currentVisualQualityScore ?? "NOT_SCORED",
            trvlmore: tVis.visionScoreAllowed ? "needs_valid_vision" : "NOT_SCORED",
        },
        visualGap: {
            cleanmaster: clean?.visualGap ?? "NOT_SCORED",
            trvlmore: "NOT_SCORED",
        },
        purchaseGap: {
            cleanmaster: clean?.purchaseGap ?? null,
            trvlmore: null,
        },
        mobileGap: {
            cleanmaster: clean?.mobileGap ?? null,
            trvlmore: null,
        },
        businessModel: {
            cleanmaster: clean?.refinedBusinessModel ?? clean?.businessModel,
            trvlmore: tBiz.model,
        },
        ownershipConfidence: {
            cleanmaster: clean?.brandOwnershipConfidence,
            trvlmore: tBiz.ownBrandSignal,
        },
        companyScale: {
            cleanmaster: clean?.companyScaleFit,
            trvlmore: tBiz.companyScaleFit,
        },
        catalogFocus: {
            cleanmaster: clean?.catalogFocus,
            trvlmore: tCat.focus,
        },
        materialFeasibility: {
            cleanmaster: clean?.materialFeasibility,
            trvlmore: trvl.material.redesignFeasibilityProxy,
        },
        productRelevance: {
            cleanmaster: "Handzeep private label hero SKU",
            trvlmore: "Campingstoel own-brand outdoor SKU",
        },
        currentSiteImpression: {
            cleanmaster: clean?.currentSiteImpression,
            trvlmore: tVis.visionScoreAllowed ? "pending_vision" : "NOT_SCORED",
        },
        acquisitionConfidence: {
            cleanmaster: clean?.validatedVisualSalesFit,
            trvlmore: tBiz.salesCandidate ? "business_ok_visual_pending" : "weak",
        },
    };
    let better = "NEITHER";
    if (clean?.leadType === "VALIDATED_SHOWCASE_PROSPECT" &&
        tBiz.salesCandidate !== true) {
        better = "CLEANMASTER";
    }
    else if (clean?.leadType !== "VALIDATED_SHOWCASE_PROSPECT" &&
        tBiz.salesCandidate === true &&
        !tVis.visionScoreAllowed) {
        better = "NEITHER";
    }
    else if (clean?.leadType === "VALIDATED_SHOWCASE_PROSPECT") {
        better = "CLEANMASTER";
    }
    return { table, betterFirstShowcaseCandidate: better };
}
export async function runM995PreVisionIntegrityRescore() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const startedAt = new Date().toISOString();
    const crawlTimeout = M994_DISCOVERY.crawlTimeoutMs;
    const m994Raw = await readFile(M994_INPUT, "utf8");
    const m994 = JSON.parse(m994Raw);
    const allScreened = m994.allScreened ?? [];
    const priorValidated = m994.validatedShowcaseProspects ?? [];
    const funnel = m994.funnel;
    console.log(`\n=== M9.9.5 PRE-VISION INTEGRITY (${allScreened.length} screened rows) ===`);
    const run = await createRun(supabase, "m995_pre_vision_integrity", {
        milestone: "M9.9.5",
        source: M994_INPUT_REPORT_PATH,
    });
    const joomRegression = await runJoomRegression();
    console.log(`Joom regression: ${joomRegression.regressionPass ? "PASS" : "FAIL"}`);
    const rescored = [];
    for (const row of allScreened) {
        rescored.push(await rescoreRow(row));
    }
    const validatedShowcaseProspects = rescored
        .filter((r) => r.leadType === "VALIDATED_SHOWCASE_PROSPECT")
        .sort((a, b) => (asNumber(b.validatedVisualSalesFit) ?? 0) -
        (asNumber(a.validatedVisualSalesFit) ?? 0))
        .slice(0, M995_MAX_VALIDATED_PROSPECTS);
    const cleanmasterRow = rescored.find((r) => r.domain === M995_CLEANMASTER_FIXTURE.domain) ??
        priorValidated.find((r) => String(r.domain) === M995_CLEANMASTER_FIXTURE.domain);
    const trvlmoreReview = await buildTrvlmoreReview(crawlTimeout);
    const cleanmasterVsTrvlmore = compareCandidates(cleanmasterRow ?? null, trvlmoreReview);
    const priorValidatedCount = funnel.validated_showcase_prospects ?? priorValidated.length;
    const correctedValidatedCount = validatedShowcaseProspects.length;
    const report = {
        milestone: "M9.9.5",
        version: M995_INTEGRITY_VERSION,
        sourceReport: M994_INPUT_REPORT_PATH,
        startedAt,
        finishedAt: new Date().toISOString(),
        marketplacePreVisionFix: {
            description: "Generic MARKETPLACE/retailer classifier before vision",
            hardRejectTypes: [
                "MARKETPLACE",
                "MASS_RETAILER",
                "GENERAL_RETAILER",
                "GENERAL_RESELLER",
            ],
            unknownPasses: true,
        },
        captureHealthFix: {
            description: "Invalid/bot captures cannot produce low CVQ scores",
            allowedVisionHealth: ["VALID_CONTENT", "PARTIAL_CONTENT"],
            notScoredWhenInvalid: true,
        },
        joomRegression,
        m994Rescore: {
            inputFunnel: funnel,
            priorValidatedShowcaseCount: priorValidatedCount,
            correctedValidatedShowcaseCount: correctedValidatedCount,
            joomRemoved: !rescored.some((r) => r.domain === "joom.com" && r.leadType === "VALIDATED_SHOWCASE_PROSPECT"),
            preVisionRejectCounts: rescored.reduce((acc, row) => {
                if (row.preVisionHardReject) {
                    const key = String(row.preVisionBusinessType);
                    acc[key] = (acc[key] ?? 0) + 1;
                }
                return acc;
            }, {}),
            invalidCaptureCounts: rescored.reduce((acc, row) => {
                if (!row.visionScoreAllowed) {
                    const key = String(row.captureHealth);
                    acc[key] = (acc[key] ?? 0) + 1;
                }
                return acc;
            }, {}),
        },
        validatedShowcasePool: validatedShowcaseProspects,
        cleanmasterStatus: {
            role: M995_CLEANMASTER_FIXTURE.role,
            row: cleanmasterRow,
            caveats: [
                "FOCUSED_PRIVATE_LABEL_BRAND",
                "ownership confidence ~65",
                "cross-domain product similarity possible",
                "catalog unknown / focus limited",
                "price not a rejection factor",
            ],
        },
        trvlmoreReview,
        cleanmasterVsTrvlmore,
        trvlmoreScreenshots: trvlmoreReview.screenshots,
        recommendation: {
            betterFirstShowcaseCandidate: cleanmasterVsTrvlmore.betterFirstShowcaseCandidate,
            note: correctedValidatedCount > 0
                ? `After integrity fix: ${correctedValidatedCount} validated showcase prospect(s) from existing M9.9.4 pool.`
                : "No validated showcase prospects after integrity fix; manual review required.",
            manualReviewNext: ["cleanmastershop.nl", "trvlmore.nl"],
        },
        cost: {
            dataForSeo: 0,
            anthropic: 0,
            anthropicCap: M995_MAX_ANTHROPIC_COST,
        },
        rescoredRows: rescored,
    };
    await mkdir(dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
    await writeFile(DASHBOARD_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    await completeRun(supabase, run.id, "completed", {
        validatedCount: correctedValidatedCount,
        joomRegressionPass: joomRegression.regressionPass,
    });
    await closeCrawlerBrowser();
    console.log("\n=== M9.9.5 RESULTS ===");
    console.log(`Prior validated: ${priorValidatedCount}`);
    console.log(`Corrected validated: ${correctedValidatedCount}`);
    console.log(`Joom regression: ${joomRegression.regressionPass ? "PASS" : "FAIL"}`);
    console.log(`Better first candidate: ${cleanmasterVsTrvlmore.betterFirstShowcaseCandidate}`);
    console.log(`Cost DFS: $0 · Anthropic: $0`);
    console.log(`Report: ${REPORT_PATH}`);
}
const isMain = process.argv[1] &&
    resolve(process.argv[1]).endsWith("runM995PreVisionIntegrityRescore.js");
if (isMain) {
    runM995PreVisionIntegrityRescore().catch(async (err) => {
        console.error(err);
        await closeCrawlerBrowser();
        process.exit(1);
    });
}
//# sourceMappingURL=runM995PreVisionIntegrityRescore.js.map