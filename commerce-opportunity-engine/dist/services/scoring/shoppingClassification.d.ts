import type { CroReadinessLevel, PaidSourceType } from "../../config/sourceIntegrityWeights.js";
export type ShoppingClassificationInput = {
    merchantItemType: string | null;
    shopAdAclk: string | null;
    landingUrl: string | null;
    adUrl: string | null;
    adUrlRedirects: string[] | null;
    seller: string | null;
    productId: string | null;
    title: string | null;
    keyword: string | null;
    domainMatchStatus: string | null;
    brandConfirmedAdvertiser: boolean;
    rawPayload?: Record<string, unknown> | null;
};
export type ShoppingClassificationResult = {
    sourceType: PaidSourceType;
    listingTargetConfidence: number;
    paidEvidenceConfidence: number;
    sourceQualityScore: number;
    croReadinessLevel: CroReadinessLevel;
    croReady: boolean;
    paidEvidence: string[];
    freeListingEvidence: string[];
    merchantItemType: string | null;
    reasons: string[];
};
/**
 * Classify a Shopping target from stored Merchant/Sellers evidence.
 * Exact seller URL ≠ paid advertising proof.
 */
export declare function classifyShoppingTarget(input: ShoppingClassificationInput): ShoppingClassificationResult;
//# sourceMappingURL=shoppingClassification.d.ts.map