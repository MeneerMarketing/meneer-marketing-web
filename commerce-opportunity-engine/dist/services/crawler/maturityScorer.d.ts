import type { MaturitySignals, PageExtractedSignals, PlatformType, ProductPageResult } from "../../types/crawler.js";
/**
 * Maturity V2: missing signals stay null and do not invent identical mid scores.
 * Only observed components contribute to the weighted total.
 */
export declare function computeMaturityScore(input: {
    productPage: ProductPageResult;
    signals: PageExtractedSignals;
    paidActivityStrong: boolean;
    confirmedGoogleAdvertiser: boolean;
    platform: PlatformType;
    platformConfidence: number;
}): MaturitySignals;
//# sourceMappingURL=maturityScorer.d.ts.map