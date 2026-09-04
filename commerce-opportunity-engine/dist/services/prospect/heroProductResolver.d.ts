/**
 * Milestone 9.3.3 — hero product resolution from the ad landing page.
 *
 * The product a shop pays to advertise is the product it believes in, so the
 * landing page is the first and best hero candidate. Only when a landing page
 * turns out to be a collection do we look at the products it links to. No
 * random PDP fallback: a domain without a defensible hero returns none.
 */
export interface ResolvedHero {
    title: string;
    url: string | null;
    brand: string | null;
    price: number | null;
    currency: string | null;
    heroScore: number;
    heroConfidence: number;
    evidence: string[];
    /**
     * Where the hero came from, strongest first. A product the shop pays to
     * advertise beats one that merely sits on the homepage.
     */
    source: "shopping_ad" | "paid_landing" | "landing_linked_product" | "homepage_prominent";
}
/** A product straight out of a paid placement: the shop's own bet. */
export interface AdProduct {
    title: string;
    url: string | null;
    price: number | null;
    currency: string | null;
    isShopping: boolean;
}
/**
 * Shopping items carry the advertised product title and price. That is the
 * clearest hero signal available, and it costs nothing extra to read.
 */
export declare function extractAdProduct(ad: {
    headline: string | null;
    landingUrl: string | null;
    serpItemType: string;
    rawItem: Record<string, unknown>;
}): AdProduct | null;
export interface HeroResolutionResult {
    heroes: ResolvedHero[];
    /** Weakness of the strongest hero's page. High means much to gain. */
    pdpWeaknessScore: number | null;
    /** 0-100 proxy for usable imagery, copy and social proof already on the page. */
    assetReadinessProxy: number | null;
}
export declare function resolveHeroProducts(input: {
    domain: string;
    landingUrls: string[];
    /** Products read straight from this shop's paid placements. */
    adProducts: AdProduct[];
    keyword: string | null;
    /** All discovery keywords tied to this domain (stronger hero matching). */
    keywords?: string[];
    timeoutMs: number;
    maxHeroes: number;
}): Promise<HeroResolutionResult>;
//# sourceMappingURL=heroProductResolver.d.ts.map