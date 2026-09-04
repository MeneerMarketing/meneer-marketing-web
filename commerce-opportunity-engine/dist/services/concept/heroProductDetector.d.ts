/**
 * Milestone 9 — hero product detector (existing opportunity/page signals only).
 */
export type HeroCandidateInput = {
    productTitle: string | null;
    productUrl: string | null;
    productBrand: string | null;
    price: number | null;
    currency: string | null;
    reviewCount: number | null;
    rating: number | null;
    availability: string | null;
    adHeadline: string | null;
    keyword: string | null;
    /** When multiple discovery keywords exist, overlap against any of them. */
    keywords?: string[] | null;
    paidConfirmed: boolean;
    isResolvedPage: boolean;
    hasScreenshots: boolean;
    descriptionLength: number;
    imageCountEstimate: number | null;
};
export type HeroCandidate = {
    product_title: string;
    product_url: string | null;
    product_brand: string | null;
    price: number | null;
    currency: string | null;
    hero_product_score: number;
    hero_product_confidence: number;
    hero_product_reasoning: string;
    hero_product_evidence: string[];
};
export type HeroDetectionResult = {
    candidates: HeroCandidate[];
    primary: HeroCandidate | null;
};
export declare function scoreHeroCandidate(input: HeroCandidateInput): HeroCandidate | null;
export declare function selectPrimaryHero(candidates: HeroCandidate[]): HeroCandidate | null;
export declare function detectHeroProducts(inputs: HeroCandidateInput[]): HeroDetectionResult;
//# sourceMappingURL=heroProductDetector.d.ts.map