/**
 * Milestone 9.8.3 / 9.9 — lead type classification.
 */
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { BusinessModelClass } from "./businessModelClassifier.js";
export type OpportunityTier = "SHOWCASE_DESIGN_CANDIDATE" | "CRO_ONLY_OPPORTUNITY" | "STRONG_SALES_PROSPECT" | "NO_VALUE";
export type LeadType = "SHOWCASE_DESIGN" | "CRO_ONLY" | "STRONG_SALES" | "REJECT";
export declare function classifyOpportunityTier(input: {
    showcaseDesignGatePass: boolean;
    strongSalesGatePass: boolean;
    pageEntityType: string;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    purchaseMode: PurchaseMode;
    showcaseGapPotential: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    productEconomicFit: number | null;
    redesignMaterialFeasibility: number | null;
    heroPrice: number | null;
    focusedBrandSalesFit?: number | null;
}): {
    tier: OpportunityTier;
    leadType: LeadType;
    reason: string;
};
/** Legacy M9.8.2 classifier — uses preAuditGatePass as showcase proxy. */
export declare function classifyOpportunityTierLegacy(input: {
    preAuditGatePass: boolean;
    pageEntityType: string;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    purchaseMode: PurchaseMode;
    showcaseGapPotential: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    productEconomicFit: number | null;
    redesignMaterialFeasibility: number | null;
    heroPrice: number | null;
}): {
    tier: OpportunityTier;
    reason: string;
};
//# sourceMappingURL=opportunityTierClassifier.d.ts.map