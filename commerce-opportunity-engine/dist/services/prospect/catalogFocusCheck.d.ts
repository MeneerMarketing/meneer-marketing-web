/**
 * Milestone 9.3.3 — cheap catalog focus check.
 *
 * One extra fetch of the widest collection page. Enough to estimate catalog
 * size and judge whether the assortment is focused enough for a hero-product
 * deep dive. No full catalog crawl, no pagination walking, no Claude.
 */
export interface CatalogFocusResult {
    domain: string;
    collectionUrl: string | null;
    /** Rough product count. A proxy, deliberately not presented as exact. */
    estimatedCatalogSize: number | null;
    /** 0-100. High means one clear product story, low means a broad range. */
    catalogFocusScore: number;
    /** True when the range sits in the sweet spot for a deep-dive PDP. */
    inSweetSpot: boolean;
    /**
     * False when the listing was unreadable or too thin to trust. An unverified
     * catalog must never pass for a focused one: a consent wall that yields six
     * links would otherwise make a chain look like a boutique.
     */
    verified: boolean;
    evidence: string[];
    error: string | null;
}
export declare function runCatalogFocusCheck(domain: string, timeoutMs: number, homepageProductLinks: number, homepageCategoryLinks: number): Promise<CatalogFocusResult>;
//# sourceMappingURL=catalogFocusCheck.d.ts.map