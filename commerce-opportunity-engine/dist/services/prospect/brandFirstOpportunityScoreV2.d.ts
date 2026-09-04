/**
 * Milestone 9.6.1 — brand_first_opportunity_score_v2 with purchase mode.
 */
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
export type BrandFirstOpportunityV2Input = {
    brandScaleFit: number | null;
    firstPartyConfidence: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    ownBrandSignal: number | null;
    heroPrice: number | null;
    heroConfidence: number | null;
    purchaseMode: PurchaseMode;
    productStoryPotential: number | null;
    assetContentAvailability: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    contentPresentationQuality: number | null;
    paidAcquisitionLevel: PaidAcquisitionLevel;
};
export type BrandFirstOpportunityV2Result = {
    brandFirstOpportunityScoreV2: number;
    components: {
        brandQuality: number;
        companyScaleFit: number;
        catalogFocus: number;
        ownBrand: number;
        heroEconomics: number;
        purchaseModeFit: number;
        assetContentAvailability: number;
        visualGap: number;
        purchaseGap: number;
        mobileGap: number;
        paidEvidenceBonus: number;
    };
    sweetSpotProfile: "IDEAL" | "STRONG_BUSINESS_WEAK_GAP" | "STRONG_GAP_WEAK_BUSINESS" | "MIXED";
    evidence: string[];
};
export declare function computeBrandFirstOpportunityScoreV2(input: BrandFirstOpportunityV2Input): BrandFirstOpportunityV2Result;
export declare function manualReviewVerdict(input: {
    opportunityScoreV2: number | null;
    sweetSpotProfile: string | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    purchaseMode: PurchaseMode;
    presentationQuality: number | null;
}): "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET";
//# sourceMappingURL=brandFirstOpportunityScoreV2.d.ts.map