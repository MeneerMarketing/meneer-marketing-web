/**
 * Milestone 9.3 — ideal prospect pre-score and proxy fits (pre-Claude).
 */
import type { BrandCommerceModel } from "../../config/conceptScoring.js";
export type IdealProspectScoreInput = {
    confirmedGoogleAdvertiser: boolean;
    paidConfirmed: boolean;
    transparencyConfirmed: boolean;
    platform: string | null;
    brandCommerceModel: BrandCommerceModel | string;
    catalogFocusScore: number | null;
    estimatedProductCount: number | null;
    heroProductScore: number | null;
    productCommercialSignalScore: number | null;
    primaryProductPrice: number | null;
    productDescriptionLength: number;
    businessMaturityScore: number | null;
    retailerScaleScore: number | null;
    pdpWeaknessProxy: number;
    imageCount: number | null;
    reviewCount: number | null;
    rating: number | null;
    benefitsRichnessHint: boolean;
};
export declare function scoreCatalogSweetSpotIdeal(estimatedProducts: number | null): {
    score: number;
    label: string;
};
export declare function scoreDeepDiveFitProxy(input: IdealProspectScoreInput): {
    score: number;
    evidence: string[];
};
export declare function scoreAssetReadinessProxy(input: IdealProspectScoreInput): number;
export declare function scoreGoogleAdsSignalIdeal(input: IdealProspectScoreInput): number;
export declare function computeIdealProspectPreScore(input: IdealProspectScoreInput): {
    ideal_prospect_pre_score: number;
    components: Record<string, number>;
    evidence: string[];
};
//# sourceMappingURL=idealProspectScoring.d.ts.map