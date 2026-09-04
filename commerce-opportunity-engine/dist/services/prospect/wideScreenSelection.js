/**
 * Milestone 9.5.1 — hard exclusion vs soft economic ranking for wide screen.
 */
import { classifyProspectExclusion } from "./prospectPipelineGate.js";
const HARD_BUSINESS_TYPES = new Set([
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "NON_ECOMMERCE",
    "SERVICE_BUSINESS",
]);
export function evaluateHardExclusion(entry) {
    const verdict = classifyProspectExclusion({
        domain: entry.domain,
        businessType: entry.businessType,
        isEcommerce: entry.isEcommerce,
        retailerScaleScore: entry.retailerScaleScore,
        businessMaturityScore: entry.businessMaturityScore,
    });
    if (!verdict.eligible) {
        return { excluded: true, reason: verdict.reason ?? verdict.prospectClass };
    }
    const type = (entry.businessType ?? "").toUpperCase();
    if (HARD_BUSINESS_TYPES.has(type)) {
        return { excluded: true, reason: `hard_business_type:${type}` };
    }
    if (entry.isEcommerce === false) {
        return { excluded: true, reason: "non_ecommerce" };
    }
    if (entry.retailerScaleScore != null && entry.retailerScaleScore >= 58) {
        return { excluded: true, reason: "mass_retailer_scale" };
    }
    return { excluded: false, reason: null };
}
/** M9.5 strict economic pre-screen (for false-negative comparison). */
export function passesOldEconomicPrescreen(entry) {
    if ((entry.highTicketFitScore ?? 0) < 52)
        return false;
    if ((entry.ownBrandSignal ?? 0) < 42)
        return false;
    if (entry.businessType !== "BRAND" && entry.businessType !== "SPECIALIST_WEBSHOP")
        return false;
    const heroPrice = entry.heroPrice ?? 0;
    if (heroPrice > 0 && heroPrice < 60)
        return false;
    return true;
}
export function softWideScreenRank(entry) {
    let score = 40;
    if (entry.businessType === "BRAND" || entry.businessType === "SPECIALIST_WEBSHOP")
        score += 12;
    if ((entry.ownBrandSignal ?? 0) >= 55)
        score += 10;
    else if ((entry.ownBrandSignal ?? 0) >= 42)
        score += 5;
    if (entry.heroPrice != null && entry.heroPrice >= 150)
        score += 14;
    else if (entry.heroPrice != null && entry.heroPrice >= 80)
        score += 10;
    else if (entry.heroPrice != null && entry.heroPrice >= 50)
        score += 4;
    if (entry.catalogVerified && (entry.estimatedCatalogSize ?? 999) <= 100)
        score += 10;
    else if (!entry.catalogVerified)
        score += 3;
    if ((entry.catalogFocusScore ?? 0) >= 65)
        score += 8;
    if (entry.adKeywordCount >= 2)
        score += 6;
    else if (entry.adKeywordCount >= 1)
        score += 3;
    if (entry.heroProductUrl)
        score += 8;
    if ((entry.highTicketFitScore ?? 0) >= 65)
        score += 8;
    return score;
}
//# sourceMappingURL=wideScreenSelection.js.map