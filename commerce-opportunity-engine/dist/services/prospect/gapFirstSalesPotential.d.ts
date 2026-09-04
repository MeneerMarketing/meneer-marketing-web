/**
 * Milestone 9.8 — business_economic_fit + gap_first_sales_potential.
 */
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
export declare function computeBusinessEconomicFit(input: {
    brandScaleFit: number | null;
    firstPartyConfidence: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    ownBrandSignal: number | null;
    businessMaturityScore: number | null;
    heroPrice: number | null;
    heroConfidence: number | null;
    purchaseMode: PurchaseMode;
    paidAcquisitionLevel: PaidAcquisitionLevel;
}): {
    score: number;
    evidence: string[];
};
export declare function computeMaterialQualityScore(input: {
    contentAvailableScore: number | null;
    assetQualityProxy: number | null;
    contentPresentationQuality: number | null;
    materialSweetSpot: boolean;
}): number;
export declare function computeGapFirstSalesPotential(input: {
    rawPdpRedesignOpportunity: number;
    materialQualityScore: number;
    businessEconomicFit: number;
    heroEconomicsComponent: number;
}): {
    score: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    profile: string;
};
export declare function manualReviewVerdictM98(input: {
    gapFirstSalesPotential: number;
    rawPdpRedesignOpportunity: number;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    materialQualityScore: number;
    businessEconomicFit: number;
    purchaseMode: PurchaseMode;
    profile: string;
}): string;
//# sourceMappingURL=gapFirstSalesPotential.d.ts.map