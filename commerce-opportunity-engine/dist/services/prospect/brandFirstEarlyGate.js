/**
 * Milestone 9.6 — early economic hard reject vs soft unknowns.
 */
export function evaluateBrandFirstEarlyGate(input) {
    const type = (input.businessType ?? "").toUpperCase();
    if (type === "MARKETPLACE" || type === "COMPARISON_SITE" || type === "GENERAL_RETAILER") {
        return { hardReject: true, reason: `hard:${type}` };
    }
    if (input.isEcommerce === false) {
        return { hardReject: true, reason: "non_ecommerce" };
    }
    if ((input.retailerScaleScore ?? 0) >= 58) {
        return { hardReject: true, reason: "mass_retailer_scale" };
    }
    if (input.firstPartyConfidence < 45) {
        return { hardReject: true, reason: "low_first_party_confidence" };
    }
    if (input.catalogVerified && (input.estimatedCatalogSize ?? 0) > 400) {
        return { hardReject: true, reason: "huge_mixed_catalog" };
    }
    if (!input.heroProductUrl) {
        return { hardReject: true, reason: "no_hero_product" };
    }
    const price = input.heroPrice ?? 0;
    if (price > 0 && price < 35) {
        return { hardReject: true, reason: "commodity_hero_price" };
    }
    if ((input.heroConfidence ?? 0) < 25 && !input.heroProductUrl.includes("/products/")) {
        return { hardReject: true, reason: "weak_hero_confidence" };
    }
    return { hardReject: false, reason: null };
}
export function passesBrandFirstEconomicQualified(input) {
    if (input.hardReject)
        return false;
    if (input.firstPartyConfidence < 58)
        return false;
    if (input.brandScaleFit < 48)
        return false;
    if ((input.ownBrandSignal ?? 0) < 40)
        return false;
    const price = input.heroPrice ?? 0;
    if (price > 0 && price < 80)
        return false;
    return true;
}
export function passesBrandFirstEconomicQualifiedM961(input) {
    if (input.hardReject)
        return false;
    if (input.firstPartyConfidence < 58)
        return false;
    if (input.brandScaleFit < 48)
        return false;
    if ((input.ownBrandSignal ?? 0) < 40)
        return false;
    const price = input.heroPrice ?? 0;
    if (price > 0 && price < 120)
        return false;
    if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
        return false;
    }
    return true;
}
//# sourceMappingURL=brandFirstEarlyGate.js.map