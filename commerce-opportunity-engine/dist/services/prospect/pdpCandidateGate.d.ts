/**
 * Milestone 9.8 — early PDP harvest reject + valid PDP detection.
 */
import type { PdpHarvestSourceType } from "../../config/pdpGapFirstHarvest.js";
export type PdpEarlyRejectReason = "marketplace_blacklist" | "agency_excluded" | "social_platform" | "content_platform" | "media_publisher" | "mass_retailer" | "non_product_url" | "collection_category_url" | "editorial_url" | "lead_only_url" | "no_url" | "invalid_url";
export declare function isMassRetailerDomain(domain: string): boolean;
export declare function isLikelyNonProductUrl(url: string): boolean;
export declare function evaluatePdpHarvestEarlyReject(input: {
    normalizedDomain: string;
    productUrl: string | null;
    title: string | null;
}): {
    rejected: boolean;
    reason: PdpEarlyRejectReason | null;
};
/** Hard exclude obvious retailer/marketplace noise before cheap vision. UNKNOWN does not fail. */
export declare function evaluatePreVisionBusinessNoise(domain: string, hints?: {
    html?: string | null;
    productUrl?: string | null;
    reportedBusinessModel?: import("./businessModelClassifier.js").BusinessModelClass | null;
    catalogEstimate?: number | null;
    catalogFocus?: number | null;
}): {
    rejected: boolean;
    reason: string | null;
};
export declare function scorePdpUrlPlausibility(productUrl: string, domain: string): number;
export declare function validatePdpFromCrawl(input: {
    html: string;
    productUrl: string;
    domain: string;
}): {
    valid: boolean;
    productTitle: string | null;
    observedPrice: number | null;
    hasPurchaseCta: boolean;
    hasProductImagery: boolean;
    evidence: string[];
};
export declare function classifyHarvestSourceType(input: {
    sourceType: PdpHarvestSourceType;
    likelyRetailer: boolean;
    serpItemType?: string;
}): PdpHarvestSourceType;
//# sourceMappingURL=pdpCandidateGate.d.ts.map