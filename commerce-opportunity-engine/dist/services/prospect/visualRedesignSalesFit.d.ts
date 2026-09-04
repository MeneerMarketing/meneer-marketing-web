/**
 * Milestone 9.9.2 — visual_redesign_sales_fit (visual weakness primary).
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
import type { PriceConfidence } from "./highTicketGapSalesFit.js";
import type { VisualQualityBand } from "./visualQualityScore.js";
export declare function computeVisualRedesignSalesFit(input: {
    currentVisualQualityScore: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    redesignMaterialFeasibility: number | null;
    businessModel: BusinessModelClass;
    businessModelSalesCandidate: boolean;
    companyScaleFit: number | null;
    catalogFocus: number | null;
    ownBrandSignal: number | null;
    businessMaturityScore: number | null;
    contentAvailable: number | null;
    assetQualityProxy: number | null;
    contentPresentation: number | null;
    heroCandidateScore: number | null;
    rawPdpRedesignOpportunity: number | null;
    brandDistinctivenessProxy: number | null;
    heroPrice: number | null;
    priceConfidence: PriceConfidence;
    purchaseMode: PurchaseMode;
    paidAcquisitionLevel: PaidAcquisitionLevel;
}): {
    score: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    visualQualityBand: VisualQualityBand;
    evidence: string[];
};
export type VisualRedesignOpportunityType = "VISUAL_REDESIGN_OPPORTUNITY" | "CRO_ONLY_OPPORTUNITY";
export declare function classifyVisualRedesignOpportunity(input: {
    currentVisualQualityScore: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    redesignMaterialFeasibility: number | null;
    visualThreshold?: number;
}): {
    type: VisualRedesignOpportunityType;
    reason: string;
};
export declare function classifyVisualShowcaseSignal(input: {
    visualRedesignType: VisualRedesignOpportunityType;
    visualRedesignSalesFit: number;
    businessModelSalesCandidate: boolean;
    currentVisualQualityScore: number | null;
    pageEntityType: string;
}): boolean;
export declare function classifyShowcaseSalesCandidate(input: {
    visualShowcaseSignal: boolean;
    businessQualified: boolean;
    pageEntityType: string;
    businessModel: BusinessModelClass;
}): boolean;
export declare function classifyM992LeadType(input: {
    visualRedesignType: VisualRedesignOpportunityType;
    visualRedesignSalesFit: number;
    businessModelSalesCandidate: boolean;
    businessModel: BusinessModelClass;
    currentVisualQualityScore: number | null;
    redesignMaterialFeasibility: number | null;
    pageEntityType: string;
    businessQualified?: boolean;
}): {
    leadType: "VISUAL_SHOWCASE_SIGNAL" | "SHOWCASE_SALES_CANDIDATE" | "STRONG_SALES" | "CRO_ONLY" | "REJECT";
    opportunityTier: string;
    visualShowcaseSignal: boolean;
    showcaseSalesCandidate: boolean;
};
//# sourceMappingURL=visualRedesignSalesFit.d.ts.map