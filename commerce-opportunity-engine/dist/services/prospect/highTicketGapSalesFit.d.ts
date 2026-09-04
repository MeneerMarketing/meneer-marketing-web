/**
 * Milestone 9.8.2 — product/business economics + high_ticket_gap_sales_fit.
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
export type PriceConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export declare function inferPriceConfidence(input: {
    observedPrice: number | null;
    heroPrice: number | null;
    priceFromCrawl: boolean;
}): PriceConfidence;
export declare function evaluatePriceGate(input: {
    price: number | null;
    priceConfidence: PriceConfidence;
}): {
    pass: boolean;
    hardReject: boolean;
    reason: string | null;
};
export declare function computeProductEconomicFit(input: {
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    heroCandidateScore: number;
    purchaseMode: PurchaseMode;
    productComplexityProxy: number | null;
    assetContentAvailability: number | null;
}): {
    score: number;
    evidence: string[];
};
export declare function computeHighTicketGapSalesFit(input: {
    showcaseGapPotential: number;
    redesignMaterialFeasibility: number;
    productEconomicFit: number;
    businessEconomicFit: number;
    businessModel: BusinessModelClass;
    businessModelSalesCandidate: boolean;
    paidAcquisitionLevel: PaidAcquisitionLevel;
}): {
    score: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    evidence: string[];
};
export declare function passesHighTicketFinalistGate(input: {
    pageEntityType: string;
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    showcaseGapPotential: number;
    redesignMaterialFeasibility: number;
    productEconomicFit: number;
    businessEconomicFit: number;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    purchaseMode: PurchaseMode;
    businessMaturityScore: number | null;
    ownBrandSignal: number | null;
    catalogEstimate: number | null;
    showcaseReady: boolean;
}): {
    pass: boolean;
    failures: string[];
};
export declare function meetsEarlySuccessPartialCriteria(input: {
    pageEntityType: string;
    heroPrice: number | null;
    showcaseGapPotential: number;
    redesignMaterialFeasibility: number;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    purchaseMode: PurchaseMode;
    companyScaleFit: number | null;
}): boolean;
/** Same criteria as PRE_AUDIT_FINALIST gate — early stop only when a true finalist exists. */
export declare function meetsEarlySuccessFinalistCriteria(input: {
    pageEntityType: string;
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    showcaseGapPotential: number;
    redesignMaterialFeasibility: number;
    productEconomicFit: number;
    businessEconomicFit: number;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    purchaseMode: PurchaseMode;
    businessMaturityScore: number | null;
    ownBrandSignal: number | null;
    catalogEstimate: number | null;
    showcaseReady: boolean;
}): boolean;
export declare function isStrongFinalistForEarlyStop(input: {
    businessModel: BusinessModelClass;
    heroPrice: number | null;
    catalogFocus: number | null;
    catalogEstimate: number | null;
    redesignMaterialFeasibility: number;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    showcaseGapPotential: number;
    businessEconomicFit: number;
    productEconomicFit: number;
    purchaseMode: PurchaseMode;
    preAuditGatePass: boolean;
}): boolean;
//# sourceMappingURL=highTicketGapSalesFit.d.ts.map