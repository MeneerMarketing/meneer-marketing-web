/**
 * Milestone 9.8.1 — integrity review on existing M9.8 high-gap candidates.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { M98_DISCOVERY } from "../config/pdpGapFirstHarvest.js";
import { PRIMARY_DISCOVERY_HOOK, DISCOVERY_HOOKS } from "../config/discoveryHooks.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { classifyPageEntity } from "../services/prospect/pageEntityClassifier.js";
import { classifyBusinessModel, catalogBandPenalty, } from "../services/prospect/businessModelClassifier.js";
import { computeRedesignMaterialFeasibility, computeHeroCandidateScore, computeValidatedGapSalesFit, passesPreAuditGate, } from "../services/prospect/validatedGapSalesFit.js";
import { captureViewportScreenshots } from "../services/prospect/pdpViewportCapture.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const M98_REPORT_PATH = resolve(projectRoot, "reports/pdp-gap-first-report.json");
const REPORT_PATH = resolve(projectRoot, "reports/m981-high-gap-integrity-report.json");
const DASHBOARD_REPORT_PATH = resolve(projectRoot, "dashboard/src/preview/concepts/data/m981-high-gap-integrity-report.json");
const SCREENSHOT_DIR = resolve(projectRoot, M98_DISCOVERY.screenshotDir);
function isHighGap(c) {
    const raw = c.rawPdpRedesignOpportunity;
    const visual = c.preauditVisualGap;
    const purchase = c.preauditPurchaseGap;
    return (c.screened === true &&
        ((raw ?? 0) >= 58 || (visual ?? 0) >= 45 || (purchase ?? 0) >= 45));
}
function heroEconomicsScore(price) {
    if (price == null)
        return 38;
    if (price >= 150 && price <= 750)
        return 94;
    if (price >= 120 && price <= 3000)
        return 76;
    if (price >= 100)
        return 58;
    if (price >= 80)
        return 48;
    if (price >= 50)
        return 32;
    return 18;
}
async function fileExists(path) {
    try {
        await access(path);
        return true;
    }
    catch {
        return false;
    }
}
export async function runM981HighGapIntegrity() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const startedAt = new Date().toISOString();
    const crawlTimeout = 15_000;
    const m98Raw = await readFile(M98_REPORT_PATH, "utf8");
    const m98 = JSON.parse(m98Raw);
    const allCandidates = m98.allCandidates ?? [];
    const highGapPool = allCandidates
        .filter(isHighGap)
        .sort((a, b) => (b.rawPdpRedesignOpportunity ?? 0) -
        (a.rawPdpRedesignOpportunity ?? 0))
        .slice(0, 12);
    console.log(`\n=== M9.8.1 HIGH-GAP INTEGRITY (${highGapPool.length} candidates) ===`);
    const run = await createRun(supabase, "m981_high_gap_integrity", {
        milestone: "M9.8.1",
        source: M98_REPORT_PATH,
        primaryHook: PRIMARY_DISCOVERY_HOOK,
    });
    const reviewed = [];
    const waterpikRegression = { passed: false, notes: [] };
    for (const raw of highGapPool) {
        const domain = String(raw.domain);
        const productUrl = String(raw.productUrl);
        const productTitle = raw.productTitle;
        let html = raw.cachedHtml ?? null;
        if (!html || html.length < 500) {
            const crawl = await crawlWebsite(productUrl, crawlTimeout);
            if (crawl.status === "success")
                html = crawl.html;
        }
        const entity = classifyPageEntity({
            productUrl,
            domain,
            html,
            productTitle,
            observedPrice: raw.observedPrice,
        });
        if (domain.includes("waterpik")) {
            waterpikRegression.passed = entity.pageEntityType === "CATEGORY";
            waterpikRegression.notes.push(`waterpik entity=${entity.pageEntityType} reason=${entity.rejectReason}`);
        }
        const light = await runLightBrandCheck(domain, crawlTimeout);
        const catalog = await runCatalogFocusCheck(domain, crawlTimeout, light.productLinks, light.categoryLinks);
        const business = classifyBusinessModel({
            domain,
            ownBrandSignal: light.ownBrandSignal,
            catalogEstimate: catalog.estimatedCatalogSize,
            catalogFocus: catalog.catalogFocusScore,
            retailerScaleScore: light.retailerScaleScore,
            retailerBreadthScore: light.retailerBreadthScore,
            businessType: light.businessType,
            estimatedCatalogSize: catalog.estimatedCatalogSize,
            productUrl,
            productTitle,
        });
        const catalogBand = catalogBandPenalty(catalog.estimatedCatalogSize);
        const material = computeRedesignMaterialFeasibility({
            contentAvailable: raw.contentAvailable,
            contentPresentation: raw.contentPresentation,
            assetQualityProxy: raw.assetQualityProxy,
            materialSweetSpot: Boolean(raw.materialSweetSpot),
        });
        const heroTarget = raw.heroTarget;
        const heroPrice = heroTarget?.heroPrice ?? raw.observedPrice;
        const hero = computeHeroCandidateScore({
            heroPrice,
            heroConfidence: heroTarget?.heroConfidence,
            heroProductUrl: heroTarget?.heroProductUrl,
            discoveredProductUrl: productUrl,
            isValidProductDetail: entity.isValidProductDetail,
            assetContentAvailability: raw.assetContentAvailability,
            productFamilyRelevance: true,
        });
        const economics = heroEconomicsScore(heroPrice);
        const validated = computeValidatedGapSalesFit({
            rawPdpRedesignOpportunity: raw.rawPdpRedesignOpportunity,
            redesignMaterialFeasibility: material.score,
            businessModel: business.businessModel,
            businessModelSalesCandidate: business.salesCandidate,
            companyScaleFit: raw.brandScaleFit,
            catalogFocus: catalog.catalogFocusScore,
            catalogBandScore: catalogBand.score,
            ownBrandSignal: light.ownBrandSignal,
            heroCandidateScore: hero.score,
            heroEconomicsScore: economics,
            paidAcquisitionLevel: raw.paidAcquisition ?? "UNKNOWN",
        });
        const maturity = Math.round(light.ecommerceConfidence * 0.35 +
            light.platformConfidence * 0.15 +
            light.ownBrandSignal * 0.25 +
            (100 - Math.min(light.retailerScaleScore, 85)) * 0.25);
        const gate = passesPreAuditGate({
            isValidProductDetail: entity.isValidProductDetail,
            rawPdpRedesignOpportunity: raw.rawPdpRedesignOpportunity,
            redesignMaterialFeasibility: material.score,
            companyScaleFit: raw.brandScaleFit,
            catalogFocus: catalog.catalogFocusScore,
            businessModelSalesCandidate: business.salesCandidate,
            businessModel: business.businessModel,
            heroCandidateScore: hero.score,
            heroEconomicsScore: economics,
            businessMaturityScore: maturity,
            heroPrice,
            ownBrandSignal: light.ownBrandSignal,
            catalogEstimate: catalog.estimatedCatalogSize,
        });
        const existingScreenshots = raw.screenshots ?? {};
        let screenshots = { ...existingScreenshots };
        reviewed.push({
            domain,
            productUrl,
            productTitle,
            sourceQuery: raw.sourceQuery,
            serpPosition: raw.serpPosition,
            serpPositionBand: raw.serpPositionBand,
            pageEntityType: entity.pageEntityType,
            pageEntityRejectReason: entity.rejectReason,
            pageEntityEvidence: entity.evidence,
            isValidProductDetail: entity.isValidProductDetail,
            businessModel: business.businessModel,
            businessModelSalesCandidate: business.salesCandidate,
            businessModelRejectReason: business.rejectReason,
            platform: light.platform,
            businessType: light.businessType,
            companyScaleFit: raw.brandScaleFit,
            businessMaturityScore: maturity,
            catalogEstimate: catalog.estimatedCatalogSize,
            catalogVerified: catalog.verified,
            catalogFocus: catalog.catalogFocusScore,
            catalogBand: catalogBand.band,
            ownBrand: light.ownBrandSignal,
            heroTitle: heroTarget?.heroTitle ?? productTitle,
            heroPrice,
            heroCandidateScore: hero.score,
            heroConfidence: hero.confidence,
            assetQuality: raw.assetQualityProxy,
            contentAvailable: raw.contentAvailable,
            contentPresentation: raw.contentPresentation,
            redesignMaterialFeasibility: material.score,
            materialFeasibilityBand: material.band,
            preauditVisualGap: raw.preauditVisualGap,
            preauditPurchaseGap: raw.preauditPurchaseGap,
            mobileGap: raw.mobileGap,
            rawPdpRedesignOpportunity: raw.rawPdpRedesignOpportunity,
            gapFirstSalesPotential: raw.gapFirstSalesPotential,
            validatedGapSalesFit: validated.score,
            validatedConfidence: validated.confidence,
            paidAcquisition: raw.paidAcquisition,
            preAuditGatePass: gate.pass,
            preAuditGateFailures: gate.failures,
            salesCandidate: gate.pass && business.salesCandidate,
            screenshots,
            m98ManualReviewVerdict: raw.manualReviewVerdict,
        });
    }
    const finalists = reviewed
        .filter((c) => c.salesCandidate === true)
        .sort((a, b) => b.validatedGapSalesFit - a.validatedGapSalesFit)
        .slice(0, 3);
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    for (const candidate of finalists) {
        const domain = String(candidate.domain);
        const productUrl = String(candidate.productUrl);
        const shots = candidate.screenshots;
        const needed = [];
        for (const s of [
            { key: "homepage-desktop-1440x1000", url: `https://${domain}` },
            { key: "pdp-desktop-1440x1000", url: productUrl },
            { key: "pdp-mobile-390x844", url: productUrl },
        ]) {
            if (!shots[s.key] || !(await fileExists(shots[s.key])))
                needed.push(s);
        }
        if (needed.length > 0) {
            try {
                const captured = await captureViewportScreenshots({
                    outputDir: SCREENSHOT_DIR,
                    domain,
                    timeoutMs: 25_000,
                    shots: needed.map((s) => ({
                        key: s.key,
                        url: s.url,
                        viewport: s.key.includes("mobile")
                            ? M98_DISCOVERY.mobile
                            : M98_DISCOVERY.desktop,
                    })),
                });
                candidate.screenshots = { ...shots, ...captured };
            }
            catch (error) {
                console.warn(`Screenshot skip ${domain}: ${error.message}`);
            }
        }
        candidate.manualRationale = {
            whyRealPdp: `page_entity=${candidate.pageEntityType}, evidence: ${candidate.pageEntityEvidence.join(", ")}`,
            whyBusinessInteresting: `model=${candidate.businessModel}, scale=${candidate.companyScaleFit}, catalog=${candidate.catalogEstimate}, own-brand=${candidate.ownBrand}`,
            whyNotJustReseller: `sales_candidate=${candidate.businessModelSalesCandidate}, reject=${candidate.businessModelRejectReason ?? "none"}`,
            whatMaterialWeHave: `assets=${candidate.assetQuality}, content=${candidate.contentAvailable}, feasibility=${candidate.redesignMaterialFeasibility}`,
            whyBeforeAfterLarge: `raw_gap=${candidate.rawPdpRedesignOpportunity}, visual=${candidate.preauditVisualGap}, purchase=${candidate.preauditPurchaseGap}`,
            biggestRisk: candidate.preAuditGateFailures.length
                ? candidate.preAuditGateFailures.join(", ")
                : "moderate — verify hero PDP and brand ownership manually",
        };
    }
    const screened = allCandidates.filter((c) => c.screened === true);
    const sufficientMaterials = screened.filter((c) => c.materialQualityScore != null &&
        (c.materialQualityScore >= 55 || c.materialSweetSpot === true));
    const positionBandYield = {};
    for (const c of screened) {
        const band = String(c.serpPositionBand ?? "UNKNOWN");
        if (!positionBandYield[band])
            positionBandYield[band] = { screened: 0, highGap: 0 };
        positionBandYield[band].screened += 1;
        if (isHighGap(c))
            positionBandYield[band].highGap += 1;
    }
    const m98Funnel = m98.funnel ?? {};
    const funnelConsistency = {
        professional_ecommerce_after_gap: m98Funnel.professional_ecommerce_after_gap ?? 0,
        gap_sales_verdict_promising: m98Funnel.gap_sales_verdict_promising ?? m98Funnel.potential_targets ?? 0,
        explanation: "gap_sales_verdict_promising = high-gap candidates met TRUE_MANUAL_REVIEW of PROMISING op gap-first score (kan hoger zijn dan professional_ecommerce wanneer business qualification faalt, bv. debeterewereld.nl). professional_ecommerce_after_gap = alleen candidates die businessQualified=true kregen in M9.8.",
        sufficient_materials_screened: sufficientMaterials.length,
        sufficient_materials_total_screened: screened.length,
        sufficient_materials_always_true: sufficientMaterials.length === screened.length && screened.length > 0,
        sufficient_materials_note: sufficientMaterials.length === screened.length
            ? "Metric gebruikt materialQualityScore>=55 of materialSweetSpot — in deze run vrijwel altijd true bij screened PDPs. Zie per-candidate materialFeasibilityBand in review."
            : "Metric onderscheidend voor subset van screened pool.",
    };
    const explicitReview = ["waterpik.nl", "shop.runnerslab.be", "tandenborstelexpert.nl", "fleeck.com"]
        .map((d) => reviewed.find((r) => String(r.domain).includes(d.replace("shop.", "")) || r.domain === d))
        .filter(Boolean);
    const report = {
        milestone: "M9.8.1",
        version: "HIGH_GAP_INTEGRITY_V1",
        startedAt,
        finishedAt: new Date().toISOString(),
        primaryDiscoveryHook: PRIMARY_DISCOVERY_HOOK,
        discoveryHooks: DISCOVERY_HOOKS,
        waterpikRegression,
        pdpValidationFix: {
            pageEntityTypes: reviewed.map((r) => ({
                domain: r.domain,
                type: r.pageEntityType,
                valid: r.isValidProductDetail,
            })),
        },
        highGapReview: reviewed,
        explicitTopReview: explicitReview,
        businessModelBreakdown: reviewed.reduce((acc, r) => {
            const key = String(r.businessModel);
            if (!acc[key])
                acc[key] = [];
            acc[key].push(r);
            return acc;
        }, {}),
        funnelConsistency,
        positionBandYield,
        finalPreAuditCandidates: finalists,
        cost: { dataForSeo: 0, anthropic: 0, anthropicCap: 0.005 },
        downstream: { croAudits: 0, previews: 0, outreach: 0 },
    };
    await mkdir(dirname(REPORT_PATH), { recursive: true });
    const serialized = JSON.stringify(report, null, 2);
    await writeFile(REPORT_PATH, serialized, "utf8");
    await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
    await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");
    await completeRun(supabase, run.id, "completed", {
        reviewed: reviewed.length,
        finalists: finalists.length,
    });
    console.log("\n=== FINAL PRE-AUDIT (max 3) ===");
    for (const f of finalists) {
        console.log(`  ${f.domain} · validated=${f.validatedGapSalesFit} · model=${f.businessModel} · entity=${f.pageEntityType}`);
    }
    console.log(`\nWaterpik regression: ${waterpikRegression.passed ? "PASS" : "FAIL"}`);
    console.log(`Rapport: ${REPORT_PATH}\n`);
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("runM981HighGapIntegrity.js")
    : false;
if (invokedDirectly) {
    runM981HighGapIntegrity()
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
//# sourceMappingURL=runM981HighGapIntegrity.js.map