/**
 * Milestone 9.7 — third_party_brand_opportunity_score
 */
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
export type ThirdPartyOpportunityInput = {
    brandMarketPresenceScore: number;
    independentSourceCount: number;
    firstPartyConfidence: number;
    officialDomainConfidence: number;
    brandScaleFit: number;
    catalogFocusScore: number | null;
    ownBrandSignal: number | null;
    heroPrice: number | null;
    heroConfidence: number | null;
    purchaseMode: PurchaseMode;
    thirdPartyStoryPotential: number;
    assetContentAvailability: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    contentPresentationQuality: number | null;
    paidAcquisitionLevel: PaidAcquisitionLevel;
};
export declare function computeThirdPartyBrandOpportunityScore(input: ThirdPartyOpportunityInput): {
    thirdPartyBrandOpportunityScore: number;
    confidence: "LOW" | "MEDIUM" | "HIGH";
    components: Record<string, number>;
};
export declare function manualReviewVerdictM97(input: {
    opportunityScore: number;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    presentationQuality: number | null;
    purchaseMode: PurchaseMode;
    independentSourceCount: number;
}): "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET";
//# sourceMappingURL=thirdPartyBrandOpportunityScore.d.ts.map