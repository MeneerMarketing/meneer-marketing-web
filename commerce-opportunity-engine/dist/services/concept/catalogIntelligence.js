/**
 * Milestone 9 — catalog intelligence from existing DB signals only.
 * No live crawls / DataForSEO. Unknowns stay UNKNOWN.
 */
function clamp(n, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(n)));
}
export function scoreCatalogIntelligence(input) {
    const evidence = [];
    const biz = (input.businessType ?? "").toUpperCase();
    const rel = (input.productMerchantRelationship ?? "").toUpperCase();
    const scale = input.retailerScaleScore ?? 40;
    // Estimate product count from scale + business type (proxy only)
    let estimatedProducts = null;
    let estimatedCategories = null;
    let estimatedBrands = null;
    let confidence = 35;
    if (biz === "BRAND" || biz === "DTC") {
        estimatedProducts = scale <= 30 ? 25 : scale <= 50 ? 60 : 120;
        estimatedCategories = 3;
        estimatedBrands = 1;
        confidence = 48;
        evidence.push("business_type_brand_implies_focused_catalog");
    }
    else if (biz === "SPECIALIST_WEBSHOP") {
        // High maturity with weak scale signal often means large specialist retailer
        const maturity = input.businessMaturityHint ?? 0;
        const effectiveScale = scale <= 15 && maturity >= 70
            ? Math.max(scale, Math.round(maturity * 0.7))
            : scale;
        estimatedProducts =
            effectiveScale <= 25
                ? 80
                : effectiveScale <= 45
                    ? 250
                    : effectiveScale <= 65
                        ? 800
                        : 2500;
        estimatedCategories = effectiveScale <= 40 ? 6 : 14;
        estimatedBrands =
            rel === "OWN_BRAND"
                ? 1
                : rel === "RESELLER_PRODUCT"
                    ? Math.max(8, Math.round(effectiveScale / 3))
                    : maturity >= 75
                        ? Math.max(12, Math.round(effectiveScale / 2))
                        : 5;
        confidence = 42;
        evidence.push("specialist_webshop_scale_proxy");
        if (effectiveScale !== scale) {
            evidence.push(`maturity_implied_scale:${effectiveScale}`);
        }
    }
    else if (biz === "GENERAL_RETAILER" || biz === "MARKETPLACE") {
        estimatedProducts = scale <= 50 ? 5000 : 20000;
        estimatedCategories = 40;
        estimatedBrands = 200;
        confidence = 55;
        evidence.push("general_retailer_or_marketplace_proxy");
    }
    else {
        evidence.push("catalog_size_unknown_weak_signals");
    }
    // Refine with page sample counts when available
    if (input.pageCountForBrand > 0) {
        confidence = Math.min(70, confidence + 12);
        evidence.push(`brand_pages_sampled:${input.pageCountForBrand}`);
        if (estimatedProducts == null) {
            estimatedProducts = Math.max(input.pageCountForBrand * 4, 10);
        }
    }
    if (input.distinctProductBrandsOnPages > 0) {
        estimatedBrands = Math.max(estimatedBrands ?? 0, input.distinctProductBrandsOnPages);
        evidence.push(`distinct_product_brands_on_pages:${input.distinctProductBrandsOnPages}`);
        confidence = Math.min(75, confidence + 8);
    }
    // Focus score — not just count
    let focus = 55;
    if (biz === "BRAND" || biz === "DTC")
        focus += 25;
    if (biz === "SPECIALIST_WEBSHOP")
        focus += 12;
    if (biz === "GENERAL_RETAILER")
        focus -= 35;
    if (biz === "MARKETPLACE")
        focus -= 45;
    if (rel === "OWN_BRAND")
        focus += 15;
    if (rel === "RESELLER_PRODUCT")
        focus -= 8;
    if (scale >= 70)
        focus -= 20;
    else if (scale >= 55)
        focus -= 10;
    else if (scale <= 30)
        focus += 10;
    // Large specialist retailers mis-tagged with low scale
    if (biz === "SPECIALIST_WEBSHOP" &&
        (input.businessMaturityHint ?? 0) >= 80 &&
        scale < 40 &&
        rel !== "OWN_BRAND") {
        focus -= 28;
        evidence.push("high_maturity_specialist_likely_broad_catalog");
    }
    if ((estimatedBrands ?? 1) <= 2)
        focus += 10;
    if ((estimatedBrands ?? 99) >= 20)
        focus -= 15;
    if ((estimatedProducts ?? 9999) <= 100)
        focus += 8;
    if ((estimatedProducts ?? 0) >= 3000)
        focus -= 18;
    if (input.hasProductPage)
        focus += 3;
    focus = clamp(focus);
    let tier = "UNKNOWN";
    if (estimatedProducts != null) {
        if (estimatedProducts <= 20)
            tier = "MICRO";
        else if (estimatedProducts <= 80)
            tier = "SMALL";
        else if (estimatedProducts <= 250 && focus >= 60)
            tier = "FOCUSED";
        else if (estimatedProducts <= 600)
            tier = "MEDIUM";
        else if (estimatedProducts <= 3000)
            tier = "LARGE";
        else
            tier = "MASSIVE";
        // Focused override: coherent mid-size catalog
        if (focus >= 72 && estimatedProducts <= 400 && tier !== "MICRO") {
            tier = "FOCUSED";
        }
    }
    return {
        estimated_product_count: estimatedProducts,
        estimated_category_count: estimatedCategories,
        estimated_brand_count: estimatedBrands,
        catalog_focus_score: focus,
        catalog_size_tier: tier,
        catalog_confidence: clamp(confidence),
        evidence,
    };
}
//# sourceMappingURL=catalogIntelligence.js.map