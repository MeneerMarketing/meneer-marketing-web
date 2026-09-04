import { type ProductMerchantRelationship } from "../../config/commercialFit.js";
export interface MeneerMarketingFitInput {
    platform: string | null;
    platformCandidate: string | null;
    businessType: string | null;
    businessMaturityScore: number | null;
    retailerScaleScore: number | null;
    confirmedGoogleAdvertiser: boolean;
    paidConfirmed: boolean;
    productPrice: number | null;
    reviewCount: number | null;
    hasExactProductTarget: boolean;
    manualExcluded: boolean;
    leadEligible: boolean;
    /** M7.3 — OWN_BRAND vs RESELLER_PRODUCT affects rebuild fit. */
    productMerchantRelationship?: ProductMerchantRelationship | null;
    /** 0-100 from audit; used to temper project suitability for resellers. */
    fullRebuildPotential?: number | null;
}
export interface MeneerMarketingFitResult {
    score: number;
    components: Record<string, number>;
    formula: string;
    hardFloorApplied: boolean;
    reason: string;
}
/**
 * Deterministic Meneer Marketing Fit (0-100).
 * Separate from Opportunity Score: client-profile fit, not CRO gap size.
 */
export declare function computeMeneerMarketingFit(input: MeneerMarketingFitInput): MeneerMarketingFitResult;
//# sourceMappingURL=meneerMarketingFit.d.ts.map