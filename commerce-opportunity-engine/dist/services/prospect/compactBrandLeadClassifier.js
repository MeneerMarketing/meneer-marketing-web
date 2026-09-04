/**
 * Milestone 9.9.7 — compact brand showcase lead classification.
 */
const OWNERSHIP_OK = [
    "DTC_OWN_BRAND",
    "MOSTLY_OWN_BRAND",
    "MANUFACTURER_DTC",
    "FOCUSED_PRIVATE_LABEL_BRAND",
];
export function classifyM997LeadType(input) {
    if (!input.visionScoreAllowed) {
        return { leadType: "REJECT", opportunityTier: "NO_VALUE", whyNotShowcase: "invalid_capture" };
    }
    if (input.refinedBusinessModel === "GENERAL_RETAILER" ||
        input.refinedBusinessModel === "GENERAL_RESELLER" ||
        input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
        return {
            leadType: "REJECT",
            opportunityTier: "NO_VALUE",
            whyNotShowcase: "retailer_or_reseller",
        };
    }
    const material = input.redesignMaterialFeasibility ?? 0;
    const hero = input.heroCandidateScore ?? 0;
    const validatedBase = input.showcaseIntegrityPass &&
        input.businessQualified &&
        OWNERSHIP_OK.includes(input.refinedBusinessModel) &&
        input.brandOwnershipConfidence >= 50 &&
        input.currentSiteImpression === "CLEARLY_UNDERDESIGNED" &&
        input.businessBreadthScore >= 55 &&
        material >= 60 &&
        hero >= 45 &&
        (input.catalogConfidence !== "UNKNOWN" || input.businessBreadthScore >= 62);
    if (validatedBase &&
        input.humanShowcaseLikelihood === "STRONG" &&
        input.validatedVisualSalesFit >= 68) {
        return {
            leadType: "VALIDATED_SHOWCASE_PROSPECT",
            opportunityTier: "VALIDATED_SHOWCASE_PROSPECT",
            whyNotShowcase: null,
        };
    }
    if (input.validatedVisualSalesFit >= 58 &&
        (input.humanShowcaseLikelihood === "STRONG" ||
            input.humanShowcaseLikelihood === "POSSIBLE") &&
        input.businessQualified &&
        material >= 55) {
        return {
            leadType: "HUMAN_REVIEW_CANDIDATE",
            opportunityTier: "HUMAN_REVIEW_CANDIDATE",
            whyNotShowcase: "needs_manual_before_after_judgment",
        };
    }
    if (input.validatedVisualSalesFit >= 55 &&
        input.businessQualified &&
        material >= 55 &&
        input.humanShowcaseLikelihood !== "NO") {
        return {
            leadType: "STRONG_SALES_PROSPECT",
            opportunityTier: "STRONG_SALES_PROSPECT",
            whyNotShowcase: "business_fit_without_primary_showcase",
        };
    }
    let why = "insufficient_fit";
    if (input.humanShowcaseLikelihood === "NO")
        why = "human_likelihood_no";
    else if (input.humanShowcaseLikelihood === "WEAK")
        why = "before_after_not_obvious";
    else if (input.currentSiteImpression !== "CLEARLY_UNDERDESIGNED") {
        why = "not_clearly_underdesigned";
    }
    else if (input.businessBreadthScore < 55)
        why = "catalog_too_broad";
    else if (input.catalogConfidence === "UNKNOWN")
        why = "catalog_unverified";
    return { leadType: "REJECT", opportunityTier: "NO_VALUE", whyNotShowcase: why };
}
export function passesShowcaseSalesCandidateM997(input) {
    const failures = [];
    if (!input.isValidProductDetail || input.pageEntityType !== "PRODUCT_DETAIL") {
        failures.push("not_product_detail");
    }
    if (input.refinedBusinessModel === "GENERAL_RETAILER" ||
        input.refinedBusinessModel === "GENERAL_RESELLER") {
        failures.push("retailer_or_reseller");
    }
    if (input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
        failures.push("focused_specialist_reseller");
    }
    if (input.brandOwnershipConfidence < 50)
        failures.push("insufficient_own_brand_evidence");
    if (!input.businessQualified)
        failures.push("business_not_qualified");
    if ((input.companyScaleFit ?? 0) < 32)
        failures.push("company_scale_low");
    if ((input.businessMaturityScore ?? 0) < 24)
        failures.push("amateur_maturity");
    if ((input.redesignMaterialFeasibility ?? 0) < 60)
        failures.push("material_feasibility_low");
    if (input.currentSiteImpression !== "CLEARLY_UNDERDESIGNED") {
        failures.push("not_clearly_underdesigned");
    }
    if (input.businessBreadthScore < 50)
        failures.push("catalog_or_business_too_broad");
    if (input.catalogConfidence === "UNKNOWN" && input.businessBreadthScore < 58) {
        failures.push("catalog_breadth_unverified");
    }
    return { pass: failures.length === 0, failures };
}
//# sourceMappingURL=compactBrandLeadClassifier.js.map