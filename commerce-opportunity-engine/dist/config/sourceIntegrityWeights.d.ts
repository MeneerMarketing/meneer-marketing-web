/**
 * Source hierarchy V2.1 — brand proof ≠ opportunity paid-target proof.
 * Shopping exact listing ≠ shopping paid proof.
 */
export declare const PAID_SOURCE_TYPES: readonly ["LIVE_PAID_SERP", "GOOGLE_SHOPPING_PAID_EXACT", "GOOGLE_SHOPPING_EXACT_LISTING", "GOOGLE_SHOPPING_FREE_LISTING", "GOOGLE_SHOPPING_CANDIDATE", "LABS_PAID_KEYWORD", "EXPLICIT_SPONSORED_SHOPPING", "TRANSPARENCY_CONFIRMED", "POPULAR_PRODUCTS_CANDIDATE"];
export type PaidSourceType = (typeof PAID_SOURCE_TYPES)[number];
export declare const CRO_READINESS_LEVELS: readonly ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET", "DISCOVERY_ONLY"];
export type CroReadinessLevel = (typeof CRO_READINESS_LEVELS)[number];
/** Deterministic base ranges for opportunity-level source quality. */
export declare const SOURCE_QUALITY_V2: {
    readonly livePaidSerpWithLanding: {
        readonly base: 95;
        readonly withStrongMatchBonus: 5;
        readonly maxScore: 100;
    };
    readonly googleShoppingPaidExact: {
        readonly base: 90;
        readonly withResolvedAdUrl: 4;
        readonly withDomainMatch: 3;
        readonly withStrongTitleMatch: 3;
        readonly maxScore: 100;
    };
    readonly labsPaidKeywordWithUrl: {
        readonly base: 88;
        readonly withStrongMatchBonus: 7;
        readonly maxScore: 95;
    };
    /** Exact seller/product URL without target-level paid proof */
    readonly googleShoppingExactListing: {
        readonly base: 72;
        readonly withDomainMatch: 6;
        readonly withStrongTitleMatch: 4;
        readonly withConfirmedAdvertiser: 4;
        readonly maxScore: 84;
    };
    readonly googleShoppingFreeListing: {
        readonly base: 48;
        readonly withDomainMatch: 6;
        readonly withStrongTitleMatch: 4;
        readonly maxScore: 69;
    };
    readonly googleShoppingCandidate: {
        readonly base: 28;
        readonly maxScore: 45;
    };
    readonly explicitSponsoredShoppingWithUrl: {
        readonly base: 86;
        readonly withStrongMatchBonus: 6;
        readonly maxScore: 95;
    };
    readonly transparencyConfirmedOnly: {
        readonly base: 55;
        readonly max: 68;
    };
    readonly popularProductsNoLanding: {
        readonly base: 22;
        readonly max: 38;
    };
    readonly unknown: {
        readonly base: 10;
        readonly max: 20;
    };
};
/** Opportunity score hard caps by ground-truth strength. */
export declare const SOURCE_TYPE_SCORE_CAPS: Record<string, number>;
/** Full CRO audit (Anthropic) only for exact paid funnels. */
export declare const CRO_AUDIT_ALLOWED_LEVELS: CroReadinessLevel[];
/** CRO audits require this minimum opportunity-level source quality for paid funnels. */
export declare const CRO_READY_MIN_SOURCE_QUALITY = 85;
/** Hard caps so weak source chains cannot become CONTACT_IMMEDIATELY. */
export declare const SOURCE_QUALITY_SCORE_CAPS: {
    readonly unrestrictedMin: 85;
    readonly softCapMaxScore: 92;
    readonly softCapMinQuality: 60;
    readonly mediumCapMaxScore: 84;
    readonly mediumCapMinQuality: 40;
    readonly hardCapMaxScore: 69;
};
/** @deprecated M5.1 legacy weights — kept for historical validation code paths */
export declare const SOURCE_QUALITY_WEIGHTS: {
    readonly confirmedSearchAdBase: 55;
    readonly transparencyOnShoppingBase: 28;
    readonly popularProductsBase: 18;
    readonly paidCandidateBase: 25;
    readonly unknownBase: 8;
    readonly hasExactLandingUrl: 20;
    readonly hasResolvedProductPage: 12;
    readonly strongAdProductTitleMatch: 18;
    readonly mediumAdProductTitleMatch: 8;
    readonly strongKeywordProductMatch: 15;
    readonly mediumKeywordProductMatch: 7;
    readonly strongKeywordHeadlineMatch: 10;
    readonly productResolutionBonusMax: 10;
};
export declare const PRIMARY_KEYWORD_WEIGHTS: {
    readonly linkedToPrimaryAd: 35;
    readonly confirmedPaidSignal: 20;
    readonly paidCandidateSignal: 8;
    readonly landingUrlPresent: 12;
    readonly productTitleOverlap: 18;
    readonly urlSlugOverlap: 12;
    readonly headlineOverlap: 15;
    readonly productResolutionConfidence: 10;
};
export type FindingValidationStatus = "SUPPORTED" | "QUESTIONABLE" | "UNSUPPORTED";
export type SourceType = PaidSourceType | "CONFIRMED_SEARCH_AD" | "TRANSPARENCY_CONFIRMED_SHOPPING" | "SHOPPING_CANDIDATE" | "PAID_CANDIDATE" | "UNKNOWN";
//# sourceMappingURL=sourceIntegrityWeights.d.ts.map