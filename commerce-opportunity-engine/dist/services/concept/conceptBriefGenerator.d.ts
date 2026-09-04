/**
 * Milestone 9 — concept brief generator.
 * Structured brief only. NO design. NO definitive prospect copy.
 * Facts = SOURCE_CONTENT; missing = PLACEHOLDER_REQUIRED / null.
 */
import { type ConceptTemplateFamily } from "../../config/conceptScoring.js";
import type { SectionPlanItem } from "./sectionPlan.js";
export type ConceptBriefInput = {
    brandName: string;
    domain: string;
    brandSlug: string;
    logoAssetUrl: string | null;
    brandColors: string[] | null;
    productTitle: string;
    productSlug: string;
    productUrl: string | null;
    productRelationship: string | null;
    price: number | null;
    currency: string | null;
    reviewCount: number | null;
    rating: number | null;
    usableImages: Array<{
        url: string;
        kind: string;
        source: "SOURCE_CONTENT";
    }>;
    currentScreenshots: Array<{
        url: string;
        kind: string;
    }>;
    croStrengths: string[];
    croLeaks: string[];
    catalog: Record<string, unknown>;
    heroEvidence: string[];
    assetReadiness: Record<string, unknown>;
    missingAssets: string[];
    recommendedProject: string | null;
    recommendedConceptType: string;
    categoryHints: string[];
    suggestedTemplateFamily: ConceptTemplateFamily;
    hasReviews: boolean;
    hasIngredients: boolean | null;
    hasMaterials: boolean | null;
    hasSpecs: boolean | null;
    hasSizeGuide: boolean | null;
    hasBeforeAfter: boolean | null;
    hasHowToUse: boolean | null;
    hasHowItWorks: boolean | null;
    hasFaq: boolean | null;
    hasDeliveryReturns: boolean | null;
    hasGuarantee: boolean | null;
    hasLifestyle: boolean | null;
    descriptionLength: number;
    hasBenefits: boolean | null;
    hasFeatures: boolean | null;
};
export type DesignCopySlots = {
    hero_eyebrow: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    hero_title: {
        value: string;
        source: "SOURCE_CONTENT";
    } | {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    hero_subtitle: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    primary_benefits: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    trust_items: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    feature_cards: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    story_blocks: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    faq_items: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
    cta_label: {
        value: null;
        source: "PLACEHOLDER_REQUIRED";
    };
};
export type ConceptBrief = {
    concept_version: number;
    source_snapshot_date: string;
    brand: string;
    domain: string;
    logo_asset: string | null;
    brand_colors: string[] | null;
    chosen_product: string;
    product_relationship: string | null;
    product_title: string;
    price: number | null;
    currency: string | null;
    reviews: number | null;
    rating: number | null;
    usable_images: ConceptBriefInput["usableImages"];
    source_product_url: string | null;
    current_screenshots: ConceptBriefInput["currentScreenshots"];
    current_cro_strengths: string[];
    current_supported_leaks: string[];
    catalog_intelligence: Record<string, unknown>;
    hero_product_evidence: string[];
    asset_readiness: Record<string, unknown>;
    recommended_project: string | null;
    recommended_concept_type: string;
    recommended_section_plan: SectionPlanItem[];
    suggested_template_family: ConceptTemplateFamily;
    suggested_template_id: string | null;
    template_variant: string | null;
    template_version: string | null;
    preview_slug: string;
    /** Intentionally null until real preview exists */
    preview_url: null;
    preview_version: null;
    design_copy_slots: DesignCopySlots;
    content_policy: {
        reviews: "SOURCE_CONTENT" | "PLACEHOLDER_REQUIRED";
        ingredients: "SOURCE_CONTENT" | "PLACEHOLDER_REQUIRED";
        materials: "SOURCE_CONTENT" | "PLACEHOLDER_REQUIRED";
        guarantee: "SOURCE_CONTENT" | "PLACEHOLDER_REQUIRED";
        results: "PLACEHOLDER_REQUIRED";
    };
    missing_assets: string[];
    missing_content: string[];
};
export declare function suggestTemplateFamily(categoryHints: string[], commerceModel: string): ConceptTemplateFamily;
export declare function generateConceptBrief(input: ConceptBriefInput, conceptVersion?: number): ConceptBrief;
/** Reserved URL pattern — do not fill preview_url until real preview exists. */
export declare function reservedPreviewPath(brandSlug: string, productSlug: string): string;
//# sourceMappingURL=conceptBriefGenerator.d.ts.map