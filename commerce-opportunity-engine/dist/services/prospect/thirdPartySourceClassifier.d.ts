/**
 * Milestone 9.7 — classify third-party discovery sources (never prospects).
 */
import type { ThirdPartySourceType } from "../../config/thirdPartyBrandMining.js";
export type ThirdPartySourceClassification = {
    sourceType: ThirdPartySourceType | "BLOCKED";
    isAllowedSource: boolean;
    skipReason: string | null;
    prospectFit: "LOW";
    discoverySourceQuality: "HIGH" | "MEDIUM" | "LOW";
};
export declare function classifyThirdPartySource(input: {
    normalizedDomain: string;
    title: string | null;
    isShoppingResult: boolean;
    likelyRetailer: boolean;
}): ThirdPartySourceClassification;
/** Organic SERP row that is likely the brand's own site — skip for third-party mining. */
export declare function isOrganicFirstPartySkip(_normalizedDomain: string, likelyRetailer: boolean, classification: ThirdPartySourceClassification): boolean;
//# sourceMappingURL=thirdPartySourceClassifier.d.ts.map