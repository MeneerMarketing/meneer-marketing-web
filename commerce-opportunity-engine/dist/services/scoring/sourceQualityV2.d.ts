import type { PaidSourceType } from "../../config/sourceIntegrityWeights.js";
export declare function scoreLabsPaidTarget(input: {
    landingUrl: string | null;
    title: string | null;
    keyword: string | null;
}): {
    sourceType: PaidSourceType;
    sourceQualityScore: number;
    croReady: boolean;
};
/** @deprecated Prefer classifyShoppingTarget — kept for resolveShoppingTargets bridge */
export declare function scoreShoppingPaidTarget(input: {
    landingUrl: string | null;
    title: string | null;
    keyword: string | null;
    resolvedAdUrl: boolean;
    domainMatched: boolean;
    itemType: string | null;
    shopAdAclk?: string | null;
    adUrl?: string | null;
    seller?: string | null;
    productId?: string | null;
    brandConfirmedAdvertiser?: boolean;
}): {
    sourceType: PaidSourceType;
    sourceQualityScore: number;
    croReady: boolean;
    listingTargetConfidence: number;
    paidEvidenceConfidence: number;
    croReadinessLevel: string;
};
export declare function scoreBrandLevelOnly(source: PaidSourceType): number;
export declare function maxScoreForSourceType(sourceType: string | null | undefined): number;
export declare function daysSince(iso: string | null | undefined): number | null;
export declare function freshnessLabel(iso: string | null | undefined): string;
//# sourceMappingURL=sourceQualityV2.d.ts.map