/**
 * Milestone 9 — concept asset readiness from public/existing audit data.
 * NULL components stay null when unknown (no invented assets).
 */
export type AssetReadinessInput = {
    productTitle: string | null;
    price: number | null;
    descriptionLength: number;
    reviewCount: number | null;
    rating: number | null;
    hasLogo: boolean | null;
    brandColorsDetected: boolean | null;
    imageCount: number | null;
    highResImagesLikely: boolean | null;
    lifestyleImageryLikely: boolean | null;
    benefitsPresent: boolean | null;
    featuresPresent: boolean | null;
    faqPresent: boolean | null;
    deliveryReturnsPresent: boolean | null;
    specsPresent: boolean | null;
    videoPresent: boolean | null;
    beforeAfterPresent: boolean | null;
    hasScreenshots: boolean;
};
export type AssetReadinessComponents = {
    product_images: number | null;
    high_res_images: number | null;
    lifestyle_imagery: number | null;
    logo: number | null;
    branding_colors: number | null;
    product_title: number | null;
    price: number | null;
    benefits: number | null;
    features: number | null;
    description: number | null;
    reviews: number | null;
    rating: number | null;
    faq: number | null;
    delivery_returns_trust: number | null;
    product_specs: number | null;
    video: number | null;
    before_after: number | null;
};
export declare function scoreConceptAssetReadiness(input: AssetReadinessInput): {
    concept_asset_readiness_score: number;
    asset_readiness_components: AssetReadinessComponents;
    missing_assets: string[];
};
//# sourceMappingURL=assetReadiness.d.ts.map