/**
 * Milestone 9.6.1 — hero selection without defaulting to highest catalog price.
 */
export interface CatalogProductRow {
    handle: string;
    title: string;
    price: number | null;
    tags?: string[];
    productType?: string | null;
    position?: number;
}
export interface HeroSelectionInput {
    domain: string;
    products: CatalogProductRow[];
    discoveryKeywords: string[];
    homepageProductUrls: string[];
    preferredTitle?: string | null;
}
export interface HeroSelectionResult {
    handle: string;
    title: string;
    price: number | null;
    url: string;
    score: number;
    confidence: number;
    evidence: string[];
}
export declare function scoreCatalogProductsForHero(input: HeroSelectionInput): HeroSelectionResult | null;
export declare function loadShopifyCatalogProducts(domain: string, timeoutMs: number, crawlWebsite: (url: string, timeoutMs: number) => Promise<{
    status: string;
    html: string;
}>): Promise<CatalogProductRow[]>;
//# sourceMappingURL=heroSelectionScorer.d.ts.map