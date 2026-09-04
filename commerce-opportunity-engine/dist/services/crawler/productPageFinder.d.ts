import type { PageExtractedSignals, PageType, ProductPageResult, ProductResolutionSource } from "../../types/crawler.js";
export interface ProductCandidate {
    url: string;
    score: number;
    source: ProductResolutionSource;
    nameHint: string | null;
    priceHint: number | null;
    currencyHint: string | null;
    reasons: string[];
}
/**
 * Classifies / scores candidates starting from an observed URL.
 * When a paid landing URL exists, callers must treat that URL as primary CRO target.
 * This helper follows redirects/canonicals and classifies PRODUCT/COLLECTION/HOME —
 * it must not invent a different brand product as the paid destination.
 */
export declare function resolveProductCandidates(input: {
    startUrl: string;
    finalUrl: string;
    signals: PageExtractedSignals;
    secondarySignals?: PageExtractedSignals[];
    keyword: string | null;
    adHeadline: string | null;
    adDescription: string | null;
}): ProductCandidate[];
export declare function selectBestProductCandidate(candidates: ProductCandidate[]): ProductCandidate | null;
export declare function emptyProductPageResult(pageType?: PageType): ProductPageResult;
/** @deprecated use resolveProductCandidates + product page crawl */
export declare function findProductPage(startUrl: string, finalUrl: string, signals: PageExtractedSignals, keyword: string | null): ProductPageResult;
//# sourceMappingURL=productPageFinder.d.ts.map