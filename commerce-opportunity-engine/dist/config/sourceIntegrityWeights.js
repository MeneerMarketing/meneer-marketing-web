/**
 * Source hierarchy V2.1 — brand proof ≠ opportunity paid-target proof.
 * Shopping exact listing ≠ shopping paid proof.
 */
export const PAID_SOURCE_TYPES = [
    "LIVE_PAID_SERP",
    "GOOGLE_SHOPPING_PAID_EXACT",
    "GOOGLE_SHOPPING_EXACT_LISTING",
    "GOOGLE_SHOPPING_FREE_LISTING",
    "GOOGLE_SHOPPING_CANDIDATE",
    "LABS_PAID_KEYWORD",
    "EXPLICIT_SPONSORED_SHOPPING",
    "TRANSPARENCY_CONFIRMED",
    "POPULAR_PRODUCTS_CANDIDATE",
];
export const CRO_READINESS_LEVELS = [
    "EXACT_PAID_FUNNEL",
    "HIGH_CONFIDENCE_TARGET",
    "DISCOVERY_ONLY",
];
/** Deterministic base ranges for opportunity-level source quality. */
export const SOURCE_QUALITY_V2 = {
    livePaidSerpWithLanding: { base: 95, withStrongMatchBonus: 5, maxScore: 100 },
    googleShoppingPaidExact: {
        base: 90,
        withResolvedAdUrl: 4,
        withDomainMatch: 3,
        withStrongTitleMatch: 3,
        maxScore: 100,
    },
    labsPaidKeywordWithUrl: { base: 88, withStrongMatchBonus: 7, maxScore: 95 },
    /** Exact seller/product URL without target-level paid proof */
    googleShoppingExactListing: {
        base: 72,
        withDomainMatch: 6,
        withStrongTitleMatch: 4,
        withConfirmedAdvertiser: 4,
        maxScore: 84,
    },
    googleShoppingFreeListing: {
        base: 48,
        withDomainMatch: 6,
        withStrongTitleMatch: 4,
        maxScore: 69,
    },
    googleShoppingCandidate: { base: 28, maxScore: 45 },
    explicitSponsoredShoppingWithUrl: { base: 86, withStrongMatchBonus: 6, maxScore: 95 },
    transparencyConfirmedOnly: { base: 55, max: 68 },
    popularProductsNoLanding: { base: 22, max: 38 },
    unknown: { base: 10, max: 20 },
};
/** Opportunity score hard caps by ground-truth strength. */
export const SOURCE_TYPE_SCORE_CAPS = {
    LIVE_PAID_SERP: 100,
    GOOGLE_SHOPPING_PAID_EXACT: 100,
    LABS_PAID_KEYWORD: 95,
    EXPLICIT_SPONSORED_SHOPPING: 95,
    GOOGLE_SHOPPING_EXACT_LISTING: 84,
    GOOGLE_SHOPPING_FREE_LISTING: 69,
    GOOGLE_SHOPPING_CANDIDATE: 69,
    TRANSPARENCY_CONFIRMED: 69,
    POPULAR_PRODUCTS_CANDIDATE: 69,
};
/** Full CRO audit (Anthropic) only for exact paid funnels. */
export const CRO_AUDIT_ALLOWED_LEVELS = ["EXACT_PAID_FUNNEL"];
/** CRO audits require this minimum opportunity-level source quality for paid funnels. */
export const CRO_READY_MIN_SOURCE_QUALITY = 85;
/** Hard caps so weak source chains cannot become CONTACT_IMMEDIATELY. */
export const SOURCE_QUALITY_SCORE_CAPS = {
    unrestrictedMin: 85,
    softCapMaxScore: 92,
    softCapMinQuality: 60,
    mediumCapMaxScore: 84,
    mediumCapMinQuality: 40,
    hardCapMaxScore: 69,
};
/** @deprecated M5.1 legacy weights — kept for historical validation code paths */
export const SOURCE_QUALITY_WEIGHTS = {
    confirmedSearchAdBase: 55,
    transparencyOnShoppingBase: 28,
    popularProductsBase: 18,
    paidCandidateBase: 25,
    unknownBase: 8,
    hasExactLandingUrl: 20,
    hasResolvedProductPage: 12,
    strongAdProductTitleMatch: 18,
    mediumAdProductTitleMatch: 8,
    strongKeywordProductMatch: 15,
    mediumKeywordProductMatch: 7,
    strongKeywordHeadlineMatch: 10,
    productResolutionBonusMax: 10,
};
export const PRIMARY_KEYWORD_WEIGHTS = {
    linkedToPrimaryAd: 35,
    confirmedPaidSignal: 20,
    paidCandidateSignal: 8,
    landingUrlPresent: 12,
    productTitleOverlap: 18,
    urlSlugOverlap: 12,
    headlineOverlap: 15,
    productResolutionConfidence: 10,
};
//# sourceMappingURL=sourceIntegrityWeights.js.map