/**
 * Milestone 9.8.1 — redesign material feasibility + validated gap sales fit.
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
export declare function computeRedesignMaterialFeasibility(input: {
    contentAvailable: number | null;
    contentPresentation: number | null;
    assetQualityProxy: number | null;
    materialSweetSpot: boolean;
}): {
    score: number;
    band: "HIGH" | "MEDIUM" | "LOW";
    evidence: string[];
};
export declare function computeHeroCandidateScore(input: {
    heroPrice: number | null;
    heroConfidence: number | null;
    heroProductUrl: string | null;
    discoveredProductUrl: string;
    isValidProductDetail: boolean;
    assetContentAvailability: number | null;
    productFamilyRelevance: boolean;
}): {
    score: number;
    confidence: number;
    evidence: string[];
};
export declare function computeValidatedGapSalesFit(input: {
    rawPdpRedesignOpportunity: number;
    redesignMaterialFeasibility: number;
    businessModel: BusinessModelClass;
    businessModelSalesCandidate: boolean;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    catalogBandScore: number;
    ownBrandSignal: number | null;
    heroCandidateScore: number;
    heroEconomicsScore: number;
    paidAcquisitionLevel: PaidAcquisitionLevel;
}): {
    score: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    evidence: string[];
};
export declare function passesPreAuditGate(input: {
    isValidProductDetail: boolean;
    rawPdpRedesignOpportunity: number;
    redesignMaterialFeasibility: number;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    heroCandidateScore: number;
    heroEconomicsScore: number;
    businessMaturityScore: number | null;
    heroPrice: number | null;
    ownBrandSignal: number | null;
    catalogEstimate: number | null;
}): {
    pass: boolean;
    failures: string[];
};
//# sourceMappingURL=validatedGapSalesFit.d.ts.map