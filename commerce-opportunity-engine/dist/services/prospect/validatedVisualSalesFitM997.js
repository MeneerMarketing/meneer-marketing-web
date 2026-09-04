/**
 * Milestone 9.9.7 — validated visual sales fit with compact-brand emphasis.
 */
export function computeValidatedVisualSalesFitM997(input) {
    const weakness = 100 - (input.currentVisualQualityScore ?? 55);
    const visual = input.preauditVisualGap ?? 45;
    const purchase = ((input.preauditPurchaseGap ?? 45) + (input.mobileGap ?? 45)) / 2;
    const ownership = input.brandOwnershipConfidence;
    const scale = input.companyScaleFit ?? 40;
    const material = input.redesignMaterialFeasibility ?? 45;
    const maturity = input.businessMaturityScore ?? 40;
    const breadth = input.catalogBreadth.businessBreadthScore;
    const compact = input.catalogBreadth.catalogCompactnessScore;
    const coherence = input.catalogBreadth.catalogCoherenceScore;
    const hero = input.heroCandidateScore ?? 45;
    let modelBonus = 40;
    if (input.refinedBusinessModel === "DTC_OWN_BRAND" ||
        input.refinedBusinessModel === "MANUFACTURER_DTC") {
        modelBonus = 92;
    }
    else if (input.refinedBusinessModel === "MOSTLY_OWN_BRAND" ||
        input.refinedBusinessModel === "FOCUSED_PRIVATE_LABEL_BRAND") {
        modelBonus = 78;
    }
    else if (input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
        modelBonus = 18;
    }
    else if (input.refinedBusinessModel === "GENERAL_RESELLER" ||
        input.refinedBusinessModel === "GENERAL_RETAILER") {
        modelBonus = 8;
    }
    let impressionAdj = 0;
    if (input.currentSiteImpression === "CLEARLY_UNDERDESIGNED")
        impressionAdj = 12;
    else if (input.currentSiteImpression === "BASIC_BUT_ACCEPTABLE")
        impressionAdj = -6;
    else if (input.currentSiteImpression === "MODERN_ENOUGH")
        impressionAdj = -18;
    else
        impressionAdj = -30;
    let likelihoodAdj = 0;
    if (input.humanShowcaseLikelihood === "STRONG")
        likelihoodAdj = 10;
    else if (input.humanShowcaseLikelihood === "POSSIBLE")
        likelihoodAdj = 2;
    else if (input.humanShowcaseLikelihood === "WEAK")
        likelihoodAdj = -10;
    else
        likelihoodAdj = -22;
    const score = weakness * 0.24 +
        visual * 0.14 +
        ownership * 0.16 +
        scale * 0.08 +
        material * 0.14 +
        purchase * 0.05 +
        maturity * 0.03 +
        breadth * 0.12 +
        compact * 0.08 +
        coherence * 0.06 +
        hero * 0.06 +
        modelBonus * 0.06 +
        impressionAdj +
        likelihoodAdj;
    return Math.max(0, Math.min(100, Math.round(score)));
}
//# sourceMappingURL=validatedVisualSalesFitM997.js.map