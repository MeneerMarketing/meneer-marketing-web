import type { ProductPageResult } from "../../types/crawler.js";
import type { ProductCandidate } from "./productPageFinder.js";
/**
 * Extract product details from a dedicated product page crawl.
 * Rejects shipping/returns amounts as product prices.
 */
export declare function extractProductPageDetails(input: {
    html: string;
    productUrl: string;
    candidate: ProductCandidate;
    candidateCount: number;
}): ProductPageResult;
//# sourceMappingURL=productPageExtractor.d.ts.map