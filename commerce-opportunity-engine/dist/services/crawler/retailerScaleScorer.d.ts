import type { PageExtractedSignals } from "../../types/crawler.js";
/**
 * Retailer scale score: high = too large / general for ideal lead pool.
 * Independent from business maturity.
 */
export declare function computeRetailerScaleScore(input: {
    signals: PageExtractedSignals;
    secondarySignals?: PageExtractedSignals[];
    businessType: string;
}): number;
//# sourceMappingURL=retailerScaleScorer.d.ts.map