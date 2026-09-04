/**
 * Milestone 9 — Concept Ready scoring weights (central config).
 * No magic numbers in scorers.
 *
 * Concept Ready = weighted blend of existing intelligence + new concept signals.
 * Does NOT double-count CRO quality as opportunity score; uses transformation + assets.
 */
export declare const CONCEPT_READY_WEIGHTS: {
    /** Meneer Marketing / pre-fit (client suitability) */
    readonly mmOrPreFit: 0.14;
    readonly businessMaturity: 0.08;
    readonly platformFit: 0.1;
    readonly catalogFocus: 0.12;
    readonly ownBrandFit: 0.1;
    readonly heroProductQuality: 0.12;
    readonly productCommercialSignal: 0.08;
    readonly pdpTransformationPotential: 0.12;
    readonly conceptAssetReadiness: 0.1;
    readonly googleAdvertiserSignal: 0.04;
};
/** Applied AFTER weighted sum (subtract). */
export declare const CONCEPT_RETAILER_SCALE_PENALTY: {
    readonly softStart: 50;
    readonly hardStart: 70;
    readonly maxPenalty: 28;
};
export declare const CONCEPT_VERDICT_BANDS: {
    readonly CONCEPT_READY: 90;
    readonly STRONG_CONCEPT: 80;
    readonly POSSIBLE_CONCEPT: 65;
    readonly WEAK_CONCEPT_CANDIDATE: 50;
};
export type ConceptVerdict = "NOT_SUITABLE" | "WEAK_CONCEPT_CANDIDATE" | "POSSIBLE_CONCEPT" | "STRONG_CONCEPT" | "CONCEPT_READY";
export type BrandCommerceModel = "DTC_OWN_BRAND" | "MOSTLY_OWN_BRAND" | "MIXED" | "SPECIALIST_RESELLER" | "GENERAL_RESELLER" | "MARKETPLACE" | "UNKNOWN";
export type CatalogSizeTier = "MICRO" | "SMALL" | "FOCUSED" | "MEDIUM" | "LARGE" | "MASSIVE" | "UNKNOWN";
export type RecommendedConceptType = "FULL_PDP_REDESIGN" | "BUYBLOCK_REDESIGN" | "DEEP_DIVE_PRODUCT_STORY" | "MOBILE_FIRST_PDP" | "SHOPIFY_REBUILD_CONCEPT" | "WOOCOMMERCE_MIGRATION_CONCEPT" | "NOT_SUITABLE";
export type ConceptStatus = "NOT_EVALUATED" | "NOT_SUITABLE" | "CONCEPT_CANDIDATE" | "BRIEF_READY" | "DESIGN_PENDING" | "READY_FOR_PREVIEW" | "PREVIEW_READY" | "APPROVED_FOR_OUTREACH" | "ARCHIVED";
export type ConceptTemplateFamily = "PREMIUM_DTC" | "PRODUCT_ENGINEERING" | "EDITORIAL_COMMERCE";
export declare const CONCEPT_SECTION_TYPES: readonly ["HERO_BUY_BLOCK", "TRUST_BAR", "BENEFIT_GRID", "PROBLEM_SOLUTION", "PRODUCT_STORY", "HOW_IT_WORKS", "HOW_TO_USE", "FEATURE_DEEP_DIVE", "MATERIALS", "INGREDIENTS", "TECH_SPECS", "SIZE_GUIDE", "COMPARISON", "BEFORE_AFTER", "REVIEWS", "TESTIMONIALS", "UGC", "DELIVERY_RETURNS", "GUARANTEE", "FAQ", "STICKY_ATC", "RELATED_PRODUCTS"];
export type ConceptSectionType = (typeof CONCEPT_SECTION_TYPES)[number];
/** Own-brand fit score mapping for concept ready. */
export declare const OWN_BRAND_FIT_BY_MODEL: Record<BrandCommerceModel, number>;
/** Platform fit for concept work. */
export declare const CONCEPT_PLATFORM_FIT: Record<string, number>;
export declare const HERO_PRODUCT_MIN_CONFIDENCE = 45;
export declare const BRIEF_READY_MIN_CONCEPT_SCORE = 65;
export declare const BRIEF_READY_MIN_ASSET_SCORE = 40;
/**
 * Soft caps: a strong brand with little PDP transformation room
 * cannot become CONCEPT_READY (90+) just on brand/assets quality.
 * Applied after weighted sum − retailer penalty.
 */
export declare const CONCEPT_TRANSFORM_SOFT_CAPS: Array<{
    maxTransformExclusive: number;
    maxConceptReady: number;
}>;
export declare const CONCEPT_PREVIEW_BASE_HOST: string;
export declare const CONCEPT_TEMPLATE_REGISTRY: Array<{
    template_id: string;
    template_family: ConceptTemplateFamily;
    template_variant: string;
    template_version: string;
    supported_sections: ConceptSectionType[];
    required_assets: string[];
    optional_assets: string[];
    category_suitability: string[];
    design_status: "REGISTRY_ONLY" | "PARTIAL_IMPLEMENTATION";
}>;
export declare function conceptVerdictFromScore(score: number): ConceptVerdict;
//# sourceMappingURL=conceptScoring.d.ts.map