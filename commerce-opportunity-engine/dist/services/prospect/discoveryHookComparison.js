/**
 * Milestone 9.8 — compare all discovery hooks including PDP-gap-first.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
async function loadJson(path) {
    try {
        return JSON.parse(await readFile(path, "utf8"));
    }
    catch {
        return null;
    }
}
function pct(n, d) {
    if (d <= 0)
        return null;
    return Math.round((n / d) * 100);
}
function highGapFromCandidates(candidates, visualMin = 45, purchaseMin = 45, rawMin = 58) {
    return candidates.filter((c) => {
        if (c.designGapScreened === false)
            return false;
        const raw = c.rawPdpRedesignOpportunity;
        if (raw != null && raw >= rawMin)
            return true;
        return (c.preauditVisualGap ?? 0) >= visualMin || (c.preauditPurchaseGap ?? 0) >= purchaseMin;
    }).length;
}
function metricsFromBrandReport(report) {
    const funnel = report.funnel ?? {};
    const milestone = String(report.milestone ?? "?");
    const brands = funnel.brands_mined ?? funnel.brands_discovered ?? funnel.candidate_brands ?? 0;
    const firstParty = funnel.dtc_ecommerce ?? funnel.first_party_passed ?? funnel.validated_first_party ?? 0;
    const economic = funnel.economic_qualified ?? 0;
    const screened = funnel.design_gap_screened ?? 0;
    const allCandidates = report.allCandidates ?? [];
    const top10 = report.top10 ?? [];
    const gapPool = allCandidates.length > 0 ? allCandidates : top10;
    const highGap = highGapFromCandidates(gapPool.map((c) => ({
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        designGapScreened: c.designGapScreened,
    })));
    const dtcRate = funnel.dtc_ecommerce != null && brands > 0
        ? pct(funnel.dtc_ecommerce, brands)
        : firstParty > 0 && brands > 0
            ? pct(firstParty, brands)
            : null;
    return {
        milestone,
        brandsDiscovered: brands,
        firstPartyDtcRate: dtcRate,
        economicQualifiedRate: pct(economic, brands),
        designGapScreenRate: pct(screened, brands),
        highGapRate: screened > 0 ? pct(highGap, screened) : null,
        trueManualReview: funnel.true_manual_review ?? 0,
    };
}
function metricsFromAdsFirstReport(report) {
    const funnel = report.funnel ?? {};
    const milestone = String(report.milestone ?? "M9.5");
    const brands = funnel.raw_advertisers ?? funnel.prospect_eligible ?? 0;
    const screened = funnel.design_gap_screened ?? 0;
    const economic = funnel.economic_prequalified ?? 0;
    const candidates = report.candidates ?? [];
    const highGap = highGapFromCandidates(candidates.map((c) => ({
        preauditVisualGap: c.preauditVisualGap,
        preauditPurchaseGap: c.preauditPurchaseGap,
        designGapScreened: c.designGapScreened,
    })));
    return {
        milestone,
        brandsDiscovered: brands,
        firstPartyDtcRate: null,
        economicQualifiedRate: pct(economic, brands),
        designGapScreenRate: pct(screened, brands),
        highGapRate: screened > 0 ? pct(highGap, screened) : null,
        trueManualReview: funnel.design_gap_candidate ?? 0,
    };
}
function metricsFromPdpGapFirstReport(report) {
    const funnel = report.funnel ?? {};
    const milestone = String(report.milestone ?? "M9.8");
    const screened = funnel.valid_pdps_screened ?? funnel.design_gap_screened ?? 0;
    const highGap = funnel.high_gap_shortlist ?? 0;
    const goodBusiness = funnel.professional_ecommerce_after_gap ?? funnel.business_qualified ?? 0;
    const potential = funnel.potential_targets ??
        funnel.true_manual_review ??
        0;
    return {
        milestone,
        validPdpsScreened: screened,
        highGapCount: highGap,
        highGapRate: screened > 0 ? pct(highGap, screened) : null,
        goodBusinessAfterGap: goodBusiness,
        goodBusinessAfterGapRate: highGap > 0 ? pct(goodBusiness, highGap) : null,
        potentialTargets: potential,
        potentialTargetRate: screened > 0 ? pct(potential, screened) : null,
        trueManualReview: funnel.true_manual_review ?? 0,
    };
}
export async function buildDiscoveryHookComparison(projectRoot) {
    const m95 = await loadJson(resolve(projectRoot, "reports/design-gap-discovery-report.json"));
    const m96 = await loadJson(resolve(projectRoot, "reports/brand-first-discovery-report.json"));
    const m961 = await loadJson(resolve(projectRoot, "reports/brand-first-balanced-report.json"));
    const m97 = await loadJson(resolve(projectRoot, "reports/third-party-brand-mining-report.json"));
    const m98 = await loadJson(resolve(projectRoot, "reports/pdp-gap-first-report.json"));
    return {
        adsFirst: m95 ? metricsFromAdsFirstReport(m95) : null,
        organicFirstParty: m96 ? metricsFromBrandReport(m96) : null,
        organicBalanced: m961 ? metricsFromBrandReport(m961) : null,
        thirdPartyMining: m97 ? metricsFromBrandReport(m97) : null,
        pdpGapFirst: m98 ? metricsFromPdpGapFirstReport(m98) : null,
        note: "Vergelijkt hooks op screened yield, high-gap rate, en targets — niet alleen absolute volumes.",
    };
}
//# sourceMappingURL=discoveryHookComparison.js.map