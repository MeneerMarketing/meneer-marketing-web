/**
 * Milestone 9.9 — focused_brand_sales_fit + product story/commercial value signals.
 *
 * Price is weighted last. Business model and design gap dominate.
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
import type { PriceConfidence } from "./highTicketGapSalesFit.js";
/** Soft commercial signal only — never hard reject. */
export declare function computeProductCommercialValueSignal(input: {
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    purchaseMode: PurchaseMode;
    productSimplicityProxy: number | null;
}): {
    score: number;
    evidence: string[];
};
/** Explainability / differentiation potential — independent of price band. */
export declare function computeProductStoryValue(input: {
    contentAvailable: number | null;
    assetQualityProxy: number | null;
    contentPresentation: number | null;
    heroCandidateScore: number | null;
    rawPdpRedesignOpportunity: number | null;
    brandDistinctivenessProxy: number | null;
    productComplexityProxy: number | null;
}): {
    score: number;
    evidence: string[];
};
export declare function computePdpDesignOpportunity(input: {
    showcaseGapPotential: number | null;
    rawPdpRedesignOpportunity: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
}): number;
export declare function computeFocusedBrandSalesFit(input: {
    showcaseGapPotential: number | null;
    rawPdpRedesignOpportunity: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    redesignMaterialFeasibility: number | null;
    businessModel: BusinessModelClass;
    businessModelSalesCandidate: boolean;
    ownBrandSignal: number | null;
    companyScaleFit: number | null;
    catalogEstimate: number | null;
    catalogFocus: number | null;
    catalogVerified: boolean;
    businessMaturityScore: number | null;
    contentAvailable: number | null;
    assetQualityProxy: number | null;
    contentPresentation: number | null;
    heroCandidateScore: number | null;
    brandDistinctivenessProxy: number | null;
    productComplexityProxy: number | null;
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    purchaseMode: PurchaseMode;
    paidAcquisitionLevel: PaidAcquisitionLevel;
}): {
    score: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    productCommercialValueSignal: number;
    productStoryValue: number;
    pdpDesignOpportunity: number;
    evidence: string[];
};
export declare function passesShowcaseDesignGate(input: {
    pageEntityType: string;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    ownBrandSignal: number | null;
    redesignMaterialFeasibility: number | null;
    showcaseGapPotential: number | null;
    showcaseReady: boolean;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    purchaseMode: PurchaseMode;
}): {
    pass: boolean;
    failures: string[];
};
export declare function passesStrongSalesProspectGate(input: {
    pageEntityType: string;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    companyScaleFit: number | null;
    redesignMaterialFeasibility: number | null;
    focusedBrandSalesFit: number;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    rawPdpRedesignOpportunity: number | null;
    ownBrandSignal: number | null;
}): {
    pass: boolean;
    failures: string[];
};
/** Focused-brand mode: price never hard-rejects harvest or screen. */
export declare function evaluateFocusedBrandPriceGate(): {
    pass: boolean;
    hardReject: boolean;
    reason: string | null;
};
//# sourceMappingURL=focusedBrandSalesFit.d.ts.map