/**
 * Milestone 9.6 — first_party_brand_confidence (0-100).
 */
import type { LightBrandCheckResult } from "./lightBrandCheck.js";
export declare function computeFirstPartyBrandConfidence(input: {
    light: LightBrandCheckResult | null;
    ownBrandSignal: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    domain: string;
}): {
    score: number;
    evidence: string[];
};
//# sourceMappingURL=firstPartyBrandConfidence.d.ts.map