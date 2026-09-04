/**
 * Milestone 9.8.3 / 9.9 — lead type classification.
 */
export function classifyOpportunityTier(input) {
    if (input.showcaseDesignGatePass) {
        return {
            tier: "SHOWCASE_DESIGN_CANDIDATE",
            leadType: "SHOWCASE_DESIGN",
            reason: "showcase_design_gate_pass",
        };
    }
    if (input.strongSalesGatePass) {
        return {
            tier: "STRONG_SALES_PROSPECT",
            leadType: "STRONG_SALES",
            reason: "strong_sales_gate_pass",
        };
    }
    const visual = input.preauditVisualGap ?? 0;
    const purchase = input.preauditPurchaseGap ?? 0;
    const mobile = input.mobileGap ?? 0;
    const showcase = input.showcaseGapPotential ?? 0;
    const purchaseHeavy = purchase >= 65 || mobile >= 65;
    const visualWeak = visual < 50;
    const businessOk = input.businessModelSalesCandidate &&
        input.businessModel !== "GENERAL_RETAILER" &&
        input.businessModel !== "GENERAL_RESELLER" &&
        input.businessModel !== "FOCUSED_SPECIALIST_RESELLER";
    const materialOk = (input.redesignMaterialFeasibility ?? 0) >= 55;
    const economicsOk = (input.focusedBrandSalesFit ?? input.productEconomicFit ?? 0) >= 50;
    if (input.pageEntityType === "PRODUCT_DETAIL" &&
        businessOk &&
        purchaseHeavy &&
        visualWeak &&
        economicsOk &&
        materialOk &&
        showcase >= 55 &&
        input.purchaseMode !== "LEAD_GENERATION" &&
        input.purchaseMode !== "SHOWROOM_ASSISTED") {
        return {
            tier: "CRO_ONLY_OPPORTUNITY",
            leadType: "CRO_ONLY",
            reason: `purchase_heavy_visual_${visual}_purchase_${purchase}`,
        };
    }
    return { tier: "NO_VALUE", leadType: "REJECT", reason: "insufficient_commercial_signal" };
}
/** Legacy M9.8.2 classifier — uses preAuditGatePass as showcase proxy. */
export function classifyOpportunityTierLegacy(input) {
    const modern = classifyOpportunityTier({
        showcaseDesignGatePass: input.preAuditGatePass,
        strongSalesGatePass: false,
        pageEntityType: input.pageEntityType,
        businessModelSalesCandidate: input.businessModelSalesCandidate,
        businessModel: input.businessModel,
        purchaseMode: input.purchaseMode,
        showcaseGapPotential: input.showcaseGapPotential,
        preauditVisualGap: input.preauditVisualGap,
        preauditPurchaseGap: input.preauditPurchaseGap,
        mobileGap: input.mobileGap,
        productEconomicFit: input.productEconomicFit,
        redesignMaterialFeasibility: input.redesignMaterialFeasibility,
        heroPrice: input.heroPrice,
    });
    return { tier: modern.tier, reason: modern.reason };
}
//# sourceMappingURL=opportunityTierClassifier.js.map