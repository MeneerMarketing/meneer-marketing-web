/**
 * Milestone 9.9.5 — generic pre-vision business classification.
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
export type PreVisionBusinessType = "MARKETPLACE" | "MASS_RETAILER" | "GENERAL_RETAILER" | "GENERAL_RESELLER" | "DIRECT_BRAND_OR_SPECIALIST" | "UNKNOWN";
export type PreVisionConfidence = "HIGH" | "MEDIUM" | "LOW";
export declare function classifyPreVisionBusiness(input: {
    domain: string;
    html?: string | null;
    productUrl?: string | null;
    reportedBusinessModel?: BusinessModelClass | null;
    catalogEstimate?: number | null;
    catalogFocus?: number | null;
    retailerScaleScore?: number | null;
    ownBrandSignal?: number | null;
}): {
    businessType: PreVisionBusinessType;
    confidence: PreVisionConfidence;
    hardRejectBeforeVision: boolean;
    evidence: string[];
};
/** Backward-compatible gate used by M9.9.4 harvest path. */
export declare function evaluatePreVisionHardReject(input: {
    domain: string;
    html?: string | null;
    productUrl?: string | null;
    reportedBusinessModel?: BusinessModelClass | null;
    catalogEstimate?: number | null;
    catalogFocus?: number | null;
}): {
    rejected: boolean;
    reason: PreVisionBusinessType | null;
    evidence: string[];
};
//# sourceMappingURL=preVisionBusinessClassifier.d.ts.map