import type { PageExtractedSignals } from "../../types/crawler.js";
import type { CrawlResult } from "../../types/crawler.js";
export interface SecondaryCrawlResult {
    pages: Array<{
        url: string;
        crawl: CrawlResult;
        signals: PageExtractedSignals;
    }>;
    errors: string[];
}
/**
 * Limited secondary crawl of ecommerce-relevant internal routes.
 * Used when homepage signals are insufficient for ecommerce detection.
 */
export declare function crawlSecondaryEcommercePages(input: {
    domain: string;
    homepageUrl: string;
    homepageSignals: PageExtractedSignals;
    timeoutMs: number;
    maxPages: number;
}): Promise<SecondaryCrawlResult>;
//# sourceMappingURL=secondaryCrawl.d.ts.map