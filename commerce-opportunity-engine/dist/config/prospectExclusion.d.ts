/**
 * Milestone 9.3.1 — central prospect exclusion configuration.
 *
 * The gate itself is signal based. This file holds thresholds, pattern
 * registries used as signals, and the regression fixtures that keep the
 * classifier honest.
 */
export declare const PROSPECT_EXCLUSION_VERSION: "PROSPECT_PIPELINE_GATE_V1";
/** Business types that can never enter the prospect pipeline. */
export declare const ALWAYS_EXCLUDED_BUSINESS_TYPES: readonly ["GENERAL_RETAILER", "MASS_RETAILER", "MARKETPLACE", "COMPARISON_SITE"];
/** Business types that are not prospects but also not mass retail. */
export declare const NON_PROSPECT_BUSINESS_TYPES: readonly ["NON_ECOMMERCE", "SERVICE_BUSINESS"];
/**
 * Lexical signals that indicate a comparison / aggregator model.
 * Matched against the domain label, never used as the sole verdict source.
 */
export declare const COMPARISON_DOMAIN_PATTERNS: string[];
export declare const MARKETPLACE_DOMAIN_PATTERNS: string[];
/**
 * Known mass / chain retail operators in NL+BE.
 * Used as ONE signal among several, and as the evidence source for the
 * regression fixtures below. The gate must also stop unlisted retailers
 * through the generic breadth and scale signals.
 */
export declare const MASS_RETAIL_OPERATOR_TOKENS: string[];
/** Generic breadth / scale thresholds. No domain names involved. */
export declare const MASS_RETAIL_SIGNAL_THRESHOLDS: {
    /** Distinct product archetype categories the domain advertises in. */
    readonly categorySpread: 3;
    /**
     * Keyword volume only counts as breadth when it spans categories. A focused
     * specialist advertising on eight keywords inside one niche is exactly the
     * prospect we want, so raw keyword count alone must never exclude.
     */
    readonly crossCategoryMinCategories: 2;
    readonly crossCategoryKeywordSpread: 6;
    readonly retailerScaleScore: 65;
    readonly estimatedProductCount: 800;
    readonly estimatedBrandCount: 40;
    /** Very mature site combined with broad advertising is a chain signal. */
    readonly matureBreadthMaturity: 60;
    readonly matureBreadthCategorySpread: 2;
};
export type ProspectExclusionReason = "manual_excluded" | "blacklisted_domain" | "excluded_business_type" | "comparison_site_signal" | "marketplace_signal" | "mass_retail_operator" | "mass_retail_breadth" | "mass_retail_scale" | "mass_retail_catalog" | "reseller_brand_wall" | "non_ecommerce" | "service_business";
/**
 * Regression fixtures. These are tests for the classifier, not a hardcoded
 * blocklist: the gate must reach the same verdict from the supplied signals.
 */
export interface ProspectGateFixture {
    domain: string;
    expectEligible: boolean;
    expectReason: ProspectExclusionReason | null;
    signals: {
        businessType?: string | null;
        retailerScaleScore?: number | null;
        estimatedProductCount?: number | null;
        estimatedBrandCount?: number | null;
        businessMaturityScore?: number | null;
        categorySpread?: number;
        keywordSpread?: number;
        isEcommerce?: boolean | null;
    };
}
export declare const PROSPECT_GATE_FIXTURES: ProspectGateFixture[];
//# sourceMappingURL=prospectExclusion.d.ts.map