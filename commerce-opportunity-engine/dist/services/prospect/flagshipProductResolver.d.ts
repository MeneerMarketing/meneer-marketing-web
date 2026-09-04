/**
 * Milestone 9.4 — flagship product fallback.
 *
 * The hero resolver matches the advertised product by title. When a shop
 * advertises under a name that does not appear in its own catalog, the match
 * fails and the hero falls back to the homepage, which is useless for judging
 * a product page.
 *
 * For a high-ticket brand the most expensive product is the one the whole shop
 * is built around, so it is the honest stand-in: not the advertised product,
 * but a real product page worth looking at.
 */
export interface FlagshipProduct {
    url: string;
    title: string;
    price: number | null;
}
export declare function resolveFlagshipProduct(domain: string, timeoutMs: number, 
/** Advertised title, when known. Beats price: it points at the real hero. */
preferredTitle?: string | null, homepageProductUrls?: string[], discoveryKeywords?: string[]): Promise<FlagshipProduct | null>;
//# sourceMappingURL=flagshipProductResolver.d.ts.map