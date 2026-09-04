/**
 * Milestone 9.9 — $0 re-score of M9.8 / M9.8.1 / M9.8.2 / M9.8.3 candidates
 * using FOCUSED_BRAND_GAP_FIRST_V1 preset.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";
import { FOCUSED_BRAND_GAP_FIRST_TARGET_V1, FOCUSED_BRAND_DISCOVERY_VERSION, FOCUSED_BRAND_REPORT_PATH, FOCUSED_BRAND_DASHBOARD_REPORT_PATH, FOCUSED_BRAND_SALES_FIT_WEIGHTS, FOCUSED_BRAND_THRESHOLDS, } from "../config/focusedBrandGapFirst.js";
import { HIGH_TICKET_GAP_FIRST_TARGET_V1 } from "../config/highTicketPdpGapFirst.js";
import { PRIMARY_DISCOVERY_HOOK } from "../config/discoveryHooks.js";
import { computeFocusedBrandSalesFit, passesShowcaseDesignGate, passesStrongSalesProspectGate, } from "../services/prospect/focusedBrandSalesFit.js";
import { classifyOpportunityTier, } from "../services/prospect/opportunityTierClassifier.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const REPORT_PATH = resolve(projectRoot, FOCUSED_BRAND_REPORT_PATH);
const DASHBOARD_REPORT_PATH = resolve(projectRoot, FOCUSED_BRAND_DASHBOARD_REPORT_PATH);
const SOURCE_REPORTS = [
    {
        milestone: "M9.8.1",
        path: resolve(projectRoot, "reports/m981-high-gap-integrity-report.json"),
        sections: ["highGapReview", "finalPreAuditCandidates", "explicitTopReview"],
    },
    {
        milestone: "M9.8.2",
        path: resolve(projectRoot, "reports/high-ticket-pdp-gap-first-report.json"),
        sections: ["allCandidates", "highGapReview"],
    },
    {
        milestone: "M9.8.3",
        path: resolve(projectRoot, "reports/high-ticket-gap-completion-report.json"),
        sections: ["allCandidates", "highGapReview"],
    },
];
function normalizeUrl(url) {
    try {
        const u = new URL(url);
        u.hash = "";
        let path = u.pathname.replace(/\/+$/, "");
        if (!path)
            path = "/";
        return `${u.origin}${path}`.toLowerCase();
    }
    catch {
        return url.toLowerCase();
    }
}
function asNum(v) {
    if (typeof v === "number" && Number.isFinite(v))
        return v;
    return null;
}
function asStr(v) {
    return typeof v === "string" ? v : null;
}
function asBool(v, fallback = false) {
    return typeof v === "boolean" ? v : fallback;
}
function pickHeroPrice(r) {
    const heroTarget = r.heroTarget;
    return (asNum(r.heroPrice) ??
        asNum(r.observedPrice) ??
        asNum(heroTarget?.heroPrice) ??
        null);
}
function normalizeRecord(r, milestone) {
    const productUrl = asStr(r.productUrl);
    const domain = asStr(r.domain);
    if (!productUrl || !domain)
        return null;
    const heroTarget = r.heroTarget;
    const purchaseMode = (asStr(r.purchaseMode) ?? "UNKNOWN");
    const paid = (asStr(r.paidAcquisition) ?? "UNKNOWN");
    return {
        candidateKey: normalizeUrl(productUrl),
        domain,
        productUrl,
        sourceMilestones: [milestone],
        sourceQuery: asStr(r.sourceQuery),
        productTitle: asStr(r.productTitle) ?? asStr(r.heroTitle) ?? asStr(heroTarget?.heroTitle),
        platform: asStr(r.platform),
        pageEntityType: asStr(r.pageEntityType) ?? "UNKNOWN",
        businessModel: (asStr(r.businessModel) ?? "UNKNOWN"),
        businessModelSalesCandidate: asBool(r.businessModelSalesCandidate, asBool(r.salesCandidate, false)),
        businessModelRejectReason: asStr(r.businessModelRejectReason),
        businessType: asStr(r.businessType),
        companyScaleFit: asNum(r.companyScaleFit),
        catalogEstimate: asNum(r.catalogEstimate),
        catalogFocus: asNum(r.catalogFocus),
        catalogVerified: asBool(r.catalogVerified, false),
        ownBrand: asNum(r.ownBrand),
        purchaseMode,
        heroPrice: pickHeroPrice(r),
        priceConfidence: (asStr(r.priceConfidence) ??
            asStr(heroTarget?.heroPriceConfidence) ??
            "UNKNOWN"),
        businessMaturityScore: asNum(r.businessMaturityScore),
        preauditVisualGap: asNum(r.preauditVisualGap),
        preauditPurchaseGap: asNum(r.preauditPurchaseGap),
        mobileGap: asNum(r.mobileGap),
        contentAvailable: asNum(r.contentAvailable),
        contentPresentation: asNum(r.contentPresentation),
        assetQualityProxy: asNum(r.assetQualityProxy) ?? asNum(r.assetQuality),
        brandDistinctivenessProxy: asNum(r.brandDistinctivenessProxy),
        rawPdpRedesignOpportunity: asNum(r.rawPdpRedesignOpportunity),
        redesignMaterialFeasibility: asNum(r.redesignMaterialFeasibility) ?? asNum(r.redesignMaterialFeasibility),
        showcaseGapPotential: asNum(r.showcaseGapPotential),
        showcaseReady: asBool(r.showcaseReady, false),
        heroCandidateScore: asNum(r.heroCandidateScore),
        paidAcquisition: paid,
        screened: asBool(r.screened, true),
        legacyHighTicketGapSalesFit: asNum(r.highTicketGapSalesFit),
        legacyPreAuditGatePass: asBool(r.preAuditGatePass, false),
        legacyOpportunityTier: asStr(r.opportunityTier),
        legacySalesCandidate: typeof r.salesCandidate === "boolean"
            ? r.salesCandidate
            : typeof r.preAuditGatePass === "boolean"
                ? r.preAuditGatePass
                : null,
    };
}
function mergeCandidates(existing, incoming) {
    const milestones = [...new Set([...existing.sourceMilestones, ...incoming.sourceMilestones])];
    const preferScreened = incoming.screened && !existing.screened ? incoming : existing;
    const other = preferScreened === incoming ? existing : incoming;
    return {
        ...preferScreened,
        sourceMilestones: milestones,
        sourceQuery: preferScreened.sourceQuery ?? other.sourceQuery,
        productTitle: preferScreened.productTitle ?? other.productTitle,
        platform: preferScreened.platform ?? other.platform,
        heroPrice: preferScreened.heroPrice ?? other.heroPrice,
        preauditVisualGap: preferScreened.preauditVisualGap ?? other.preauditVisualGap,
        preauditPurchaseGap: preferScreened.preauditPurchaseGap ?? other.preauditPurchaseGap,
        mobileGap: preferScreened.mobileGap ?? other.mobileGap,
        showcaseGapPotential: preferScreened.showcaseGapPotential ?? other.showcaseGapPotential,
        redesignMaterialFeasibility: preferScreened.redesignMaterialFeasibility ?? other.redesignMaterialFeasibility,
        legacyHighTicketGapSalesFit: preferScreened.legacyHighTicketGapSalesFit ?? other.legacyHighTicketGapSalesFit,
        legacyPreAuditGatePass: preferScreened.legacyPreAuditGatePass || other.legacyPreAuditGatePass,
        legacyOpportunityTier: preferScreened.legacyOpportunityTier ?? other.legacyOpportunityTier,
        legacySalesCandidate: preferScreened.legacySalesCandidate ?? other.legacySalesCandidate,
    };
}
function rescoreCandidate(c) {
    const fit = computeFocusedBrandSalesFit({
        showcaseGapPotential: c.showcaseGapPotential,
        rawPdpRedesignOpportunity: c.rawPdpRedesignOpportunity,
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        redesignMaterialFeasibility: c.redesignMaterialFeasibility,
        businessModel: c.businessModel,
        businessModelSalesCandidate: c.businessModelSalesCandidate,
        ownBrandSignal: c.ownBrand,
        companyScaleFit: c.companyScaleFit,
        catalogEstimate: c.catalogEstimate,
        catalogFocus: c.catalogFocus,
        catalogVerified: c.catalogVerified,
        businessMaturityScore: c.businessMaturityScore,
        contentAvailable: c.contentAvailable,
        assetQualityProxy: c.assetQualityProxy,
        contentPresentation: c.contentPresentation,
        heroCandidateScore: c.heroCandidateScore,
        brandDistinctivenessProxy: c.brandDistinctivenessProxy,
        productComplexityProxy: c.heroCandidateScore,
        heroPrice: c.heroPrice,
        priceConfidence: c.priceConfidence,
        purchaseMode: c.purchaseMode,
        paidAcquisitionLevel: c.paidAcquisition,
    });
    const showcaseGate = passesShowcaseDesignGate({
        pageEntityType: c.pageEntityType,
        businessModelSalesCandidate: c.businessModelSalesCandidate,
        businessModel: c.businessModel,
        companyScaleFit: c.companyScaleFit,
        catalogFocus: c.catalogFocus,
        ownBrandSignal: c.ownBrand,
        redesignMaterialFeasibility: c.redesignMaterialFeasibility,
        showcaseGapPotential: c.showcaseGapPotential,
        showcaseReady: c.showcaseReady,
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        purchaseMode: c.purchaseMode,
    });
    const strongGate = passesStrongSalesProspectGate({
        pageEntityType: c.pageEntityType,
        businessModelSalesCandidate: c.businessModelSalesCandidate,
        businessModel: c.businessModel,
        companyScaleFit: c.companyScaleFit,
        redesignMaterialFeasibility: c.redesignMaterialFeasibility,
        focusedBrandSalesFit: fit.score,
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        rawPdpRedesignOpportunity: c.rawPdpRedesignOpportunity,
        ownBrandSignal: c.ownBrand,
    });
    const tier = classifyOpportunityTier({
        showcaseDesignGatePass: showcaseGate.pass,
        strongSalesGatePass: strongGate.pass,
        pageEntityType: c.pageEntityType,
        businessModelSalesCandidate: c.businessModelSalesCandidate,
        businessModel: c.businessModel,
        purchaseMode: c.purchaseMode,
        showcaseGapPotential: c.showcaseGapPotential,
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        productEconomicFit: null,
        redesignMaterialFeasibility: c.redesignMaterialFeasibility,
        heroPrice: c.heroPrice,
        focusedBrandSalesFit: fit.score,
    });
    return {
        ...c,
        productCommercialValueSignal: fit.productCommercialValueSignal,
        productStoryValue: fit.productStoryValue,
        pdpDesignOpportunity: fit.pdpDesignOpportunity,
        focusedBrandSalesFit: fit.score,
        focusedBrandConfidence: fit.confidence,
        showcaseDesignGatePass: showcaseGate.pass,
        showcaseDesignGateFailures: showcaseGate.failures,
        strongSalesGatePass: strongGate.pass,
        strongSalesGateFailures: strongGate.failures,
        opportunityTier: tier.tier,
        leadType: tier.leadType,
        opportunityTierReason: tier.reason,
        legacyRank: null,
        focusedRank: null,
        rankDelta: null,
        movement: "NEW",
    };
}
function summarizeMovement(rescored, legacyRanked) {
    const legacyMap = new Map(legacyRanked.map((c, i) => [c.candidateKey, { rank: i + 1, fit: c.legacyHighTicketGapSalesFit }]));
    const focusedRanked = [...rescored]
        .filter((c) => c.screened && c.preauditVisualGap != null)
        .sort((a, b) => b.focusedBrandSalesFit - a.focusedBrandSalesFit);
    return focusedRanked.slice(0, 25).map((c, i) => {
        const focusedRank = i + 1;
        const legacy = legacyMap.get(c.candidateKey);
        const legacyRank = legacy?.rank ?? null;
        const rankDelta = legacyRank != null ? legacyRank - focusedRank : null;
        let movement = "NEW";
        if (rankDelta != null) {
            if (rankDelta > 3)
                movement = "UP";
            else if (rankDelta < -3)
                movement = "DOWN";
            else
                movement = "SAME";
        }
        return {
            domain: c.domain,
            heroPrice: c.heroPrice,
            legacyRank,
            focusedRank,
            rankDelta: rankDelta ?? 0,
            movement,
            legacyTier: c.legacyOpportunityTier,
            newLeadType: c.leadType,
            focusedBrandSalesFit: c.focusedBrandSalesFit,
            legacyHighTicketGapSalesFit: c.legacyHighTicketGapSalesFit,
        };
    });
}
export async function runM99FocusedBrandRescore() {
    const startedAt = new Date().toISOString();
    const merged = new Map();
    for (const source of SOURCE_REPORTS) {
        try {
            const raw = JSON.parse(await readFile(source.path, "utf8"));
            let loaded = 0;
            for (const section of source.sections) {
                const records = raw[section] ?? [];
                for (const r of records) {
                    const norm = normalizeRecord(r, source.milestone);
                    if (!norm)
                        continue;
                    loaded += 1;
                    const key = norm.candidateKey;
                    const existing = merged.get(key);
                    if (existing) {
                        merged.set(key, mergeCandidates(existing, norm));
                    }
                    else {
                        merged.set(key, norm);
                    }
                }
            }
            console.log(`${source.milestone}: loaded ${loaded} records`);
        }
        catch (err) {
            console.warn(`${source.milestone}: skip — ${err.message}`);
        }
    }
    const pool = [...merged.values()].filter((c) => c.screened || c.preauditVisualGap != null || c.rawPdpRedesignOpportunity != null);
    const rescored = pool.map(rescoreCandidate);
    const legacyRanked = [...rescored]
        .filter((c) => c.legacyHighTicketGapSalesFit != null)
        .sort((a, b) => (b.legacyHighTicketGapSalesFit ?? 0) - (a.legacyHighTicketGapSalesFit ?? 0));
    const focusedRanked = [...rescored]
        .sort((a, b) => b.focusedBrandSalesFit - a.focusedBrandSalesFit);
    for (let i = 0; i < focusedRanked.length; i++) {
        focusedRanked[i].focusedRank = i + 1;
    }
    for (let i = 0; i < legacyRanked.length; i++) {
        const c = legacyRanked[i];
        const match = rescored.find((r) => r.candidateKey === c.candidateKey);
        if (match)
            match.legacyRank = i + 1;
    }
    const movementSummary = summarizeMovement(rescored, legacyRanked);
    const strongSalesProspects = focusedRanked
        .filter((c) => c.leadType === "STRONG_SALES")
        .slice(0, 10);
    const showcaseCandidates = focusedRanked
        .filter((c) => c.showcaseDesignGatePass)
        .slice(0, 5);
    const croOnly = focusedRanked
        .filter((c) => c.leadType === "CRO_ONLY")
        .slice(0, 5);
    const pricePromoted = movementSummary.filter((m) => (m.movement === "UP" || m.movement === "NEW") &&
        m.heroPrice != null &&
        m.heroPrice < 100 &&
        m.newLeadType === "STRONG_SALES");
    const resellerDemoted = movementSummary.filter((m) => m.movement === "DOWN" &&
        (m.legacyHighTicketGapSalesFit ?? 0) >= 60);
    const report = {
        milestone: "M9.9",
        version: FOCUSED_BRAND_DISCOVERY_VERSION,
        primaryTargetPreset: FOCUSED_BRAND_GAP_FIRST_TARGET_V1,
        secondaryTargetPreset: HIGH_TICKET_GAP_FIRST_TARGET_V1,
        primaryDiscoveryHook: PRIMARY_DISCOVERY_HOOK,
        startedAt,
        finishedAt: new Date().toISOString(),
        rescoredFrom: SOURCE_REPORTS.map((s) => s.milestone),
        candidatePool: pool.length,
        gateChanges: {
            removedOrSoftened: [
                "price_hard_reject_below_60",
                "price_60_99_harvest_block",
                "hero_price_below_100_finalist_requirement",
                "product_economic_fit_55_finalist_requirement",
                "hero_economics_weak_low_price_exception",
                "cro_only_requires_hero_price_100",
            ],
            strengthened: [
                "business_model_hard_reject_general_retailer",
                "business_model_hard_reject_general_reseller",
                "focused_specialist_reseller_not_primary",
                "company_scale_fit_weight_in_sales_fit",
                "catalog_focus_own_brand_ratio",
                "material_feasibility_sweet_spot",
                "product_story_value_separate_from_price",
            ],
            priceRole: "product_commercial_value_signal_only_weight_3pct",
        },
        focusedBrandSalesFitFormula: {
            weights: FOCUSED_BRAND_SALES_FIT_WEIGHTS,
            thresholds: FOCUSED_BRAND_THRESHOLDS,
            components: [
                "pdp_design_opportunity (showcase + raw gap + visual/purchase/mobile)",
                "business_model_own_brand",
                "company_scale_fit",
                "material_feasibility",
                "catalog_focus_band + own_brand",
                "product_story_value",
                "business_maturity",
                "paid_commercial_evidence",
                "product_commercial_value_signal (low weight)",
            ],
        },
        summary: {
            strongSalesProspects: strongSalesProspects.length,
            showcaseDesignCandidates: showcaseCandidates.length,
            croOnlyOpportunities: croOnly.length,
            legacyPreAuditFinalists: rescored.filter((c) => c.legacyPreAuditGatePass).length,
            focusedShowcasePasses: showcaseCandidates.length,
            pricePromotedUnder100: pricePromoted.length,
            highTicketDemoted: resellerDemoted.length,
        },
        movementSummary,
        pricePromotedExamples: pricePromoted.slice(0, 8),
        resellerDemotedExamples: resellerDemoted.slice(0, 8),
        strongSalesProspects: strongSalesProspects.map(stripForReport),
        showcaseDesignCandidates: showcaseCandidates.map(stripForReport),
        croOnlyOpportunities: croOnly.map(stripForReport),
        allRescored: focusedRanked.map(stripForReport),
        cost: { dataForSeo: 0, anthropic: 0 },
    };
    await mkdir(dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
    await writeFile(DASHBOARD_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    console.log("\n=== M9.9 FOCUSED BRAND RE-SCORE ($0) ===");
    console.log(`Pool: ${pool.length} candidates`);
    console.log(`Strong sales prospects: ${strongSalesProspects.length}`);
    console.log(`Showcase design candidates: ${showcaseCandidates.length}`);
    console.log(`CRO-only: ${croOnly.length}`);
    console.log(`Price-promoted (<€100): ${pricePromoted.length}`);
    console.log(`Report: ${REPORT_PATH}`);
}
function stripForReport(c) {
    return {
        domain: c.domain,
        productUrl: c.productUrl,
        sourceMilestones: c.sourceMilestones,
        platform: c.platform,
        businessModel: c.businessModel,
        businessModelSalesCandidate: c.businessModelSalesCandidate,
        companyScaleFit: c.companyScaleFit,
        catalogEstimate: c.catalogEstimate,
        catalogFocus: c.catalogFocus,
        ownBrand: c.ownBrand,
        productTitle: c.productTitle,
        heroPrice: c.heroPrice,
        priceConfidence: c.priceConfidence,
        materialFeasibility: c.redesignMaterialFeasibility,
        visualGap: c.preauditVisualGap,
        purchaseGap: c.preauditPurchaseGap,
        mobileGap: c.mobileGap,
        rawRedesignOpportunity: c.rawPdpRedesignOpportunity,
        productStoryValue: c.productStoryValue,
        productCommercialValueSignal: c.productCommercialValueSignal,
        pdpDesignOpportunity: c.pdpDesignOpportunity,
        businessMaturityScore: c.businessMaturityScore,
        paidAcquisition: c.paidAcquisition,
        focusedBrandSalesFit: c.focusedBrandSalesFit,
        focusedBrandConfidence: c.focusedBrandConfidence,
        legacyHighTicketGapSalesFit: c.legacyHighTicketGapSalesFit,
        legacyPreAuditGatePass: c.legacyPreAuditGatePass,
        legacyOpportunityTier: c.legacyOpportunityTier,
        showcaseDesignGatePass: c.showcaseDesignGatePass,
        strongSalesGatePass: c.strongSalesGatePass,
        leadType: c.leadType,
        opportunityTier: c.opportunityTier,
        legacyRank: c.legacyRank,
        focusedRank: c.focusedRank,
    };
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("runM99FocusedBrandRescore.js")
    : false;
if (invokedDirectly) {
    runM99FocusedBrandRescore().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=runM99FocusedBrandRescore.js.map