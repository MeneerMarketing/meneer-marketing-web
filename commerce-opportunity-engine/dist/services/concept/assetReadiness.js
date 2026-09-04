/**
 * Milestone 9 — concept asset readiness from public/existing audit data.
 * NULL components stay null when unknown (no invented assets).
 */
function scoreOrNull(known, yes, no = 0) {
    if (known === null)
        return null;
    return known ? yes : no;
}
export function scoreConceptAssetReadiness(input) {
    const c = {
        product_images: input.imageCount == null
            ? null
            : Math.min(100, input.imageCount >= 5 ? 90 : input.imageCount >= 3 ? 70 : input.imageCount >= 1 ? 45 : 10),
        high_res_images: scoreOrNull(input.highResImagesLikely, 80, 25),
        lifestyle_imagery: scoreOrNull(input.lifestyleImageryLikely, 75, 20),
        logo: scoreOrNull(input.hasLogo, 85, 15),
        branding_colors: scoreOrNull(input.brandColorsDetected, 70, 20),
        product_title: input.productTitle ? 90 : 0,
        price: input.price != null ? 85 : 20,
        benefits: scoreOrNull(input.benefitsPresent, 75, 25),
        features: scoreOrNull(input.featuresPresent, 70, 25),
        description: input.descriptionLength >= 200
            ? 80
            : input.descriptionLength >= 80
                ? 55
                : input.descriptionLength > 0
                    ? 30
                    : 10,
        reviews: input.reviewCount == null
            ? null
            : input.reviewCount >= 20
                ? 90
                : input.reviewCount >= 5
                    ? 65
                    : input.reviewCount > 0
                        ? 40
                        : 15,
        rating: input.rating == null ? null : input.rating >= 4 ? 80 : 40,
        faq: scoreOrNull(input.faqPresent, 70, 20),
        delivery_returns_trust: scoreOrNull(input.deliveryReturnsPresent, 65, 25),
        product_specs: scoreOrNull(input.specsPresent, 70, 20),
        video: scoreOrNull(input.videoPresent, 60, 10),
        before_after: scoreOrNull(input.beforeAfterPresent, 55, 10),
    };
    // Soft boost when we at least have audit screenshots (visual baseline)
    const knownScores = Object.values(c).filter((v) => v != null);
    let score = knownScores.length > 0
        ? knownScores.reduce((a, b) => a + b, 0) / knownScores.length
        : 25;
    if (input.hasScreenshots)
        score = Math.min(100, score + 5);
    // Penalize when core assets missing
    if (!input.productTitle)
        score -= 20;
    if (input.price == null)
        score -= 8;
    if (input.imageCount === 0)
        score -= 25;
    if (input.imageCount == null)
        score -= 5;
    const missing = [];
    if (!input.productTitle)
        missing.push("product_title");
    if (input.price == null)
        missing.push("price");
    if (input.imageCount == null || input.imageCount < 3)
        missing.push("product_images");
    if (input.hasLogo === false || input.hasLogo === null)
        missing.push("logo");
    if (input.lifestyleImageryLikely === false || input.lifestyleImageryLikely === null) {
        missing.push("lifestyle_imagery");
    }
    if (input.faqPresent !== true)
        missing.push("faq");
    if (input.reviewCount == null || input.reviewCount < 3)
        missing.push("reviews");
    if (input.benefitsPresent !== true)
        missing.push("benefits");
    if (input.videoPresent !== true)
        missing.push("video");
    return {
        concept_asset_readiness_score: Math.max(0, Math.min(100, Math.round(score))),
        asset_readiness_components: c,
        missing_assets: missing,
    };
}
//# sourceMappingURL=assetReadiness.js.map