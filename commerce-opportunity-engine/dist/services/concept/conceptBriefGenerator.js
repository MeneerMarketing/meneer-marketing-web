/**
 * Milestone 9 — concept brief generator.
 * Structured brief only. NO design. NO definitive prospect copy.
 * Facts = SOURCE_CONTENT; missing = PLACEHOLDER_REQUIRED / null.
 */
import { CONCEPT_PREVIEW_BASE_HOST, CONCEPT_TEMPLATE_REGISTRY, } from "../../config/conceptScoring.js";
import { buildRecommendedSectionPlan } from "./sectionPlan.js";
function slugify(s) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}
export function suggestTemplateFamily(categoryHints, commerceModel) {
    const h = categoryHints.join(" ").toLowerCase();
    if (/skin|beauty|cosmetic|verzorging/.test(h))
        return "PREMIUM_DTC";
    if (/pet|hond|gear|sleep|matras|tech/.test(h))
        return "PRODUCT_ENGINEERING";
    if (commerceModel === "DTC_OWN_BRAND" ||
        commerceModel === "MOSTLY_OWN_BRAND") {
        return "PREMIUM_DTC";
    }
    return "EDITORIAL_COMMERCE";
}
export function generateConceptBrief(input, conceptVersion = 1) {
    const sectionPlan = buildRecommendedSectionPlan({
        categoryHints: input.categoryHints,
        hasReviews: input.hasReviews,
        hasRating: input.rating != null,
        hasIngredients: input.hasIngredients,
        hasMaterials: input.hasMaterials,
        hasSpecs: input.hasSpecs,
        hasSizeGuide: input.hasSizeGuide,
        hasBeforeAfter: input.hasBeforeAfter,
        hasHowToUse: input.hasHowToUse,
        hasHowItWorks: input.hasHowItWorks,
        hasFaq: input.hasFaq,
        hasDeliveryReturns: input.hasDeliveryReturns,
        hasGuarantee: input.hasGuarantee,
        hasLifestyle: input.hasLifestyle,
        hasDescription: input.descriptionLength > 0,
        hasBenefits: input.hasBenefits,
        hasFeatures: input.hasFeatures,
        descriptionLength: input.descriptionLength,
    });
    const registry = CONCEPT_TEMPLATE_REGISTRY.find((t) => t.template_family === input.suggestedTemplateFamily);
    const productSlug = input.productSlug || slugify(input.productTitle);
    const previewSlug = `concept/${input.brandSlug}/${productSlug}`;
    const missingContent = [];
    for (const s of sectionPlan) {
        if (s.content_source === "PLACEHOLDER_REQUIRED") {
            missingContent.push(s.section);
        }
    }
    return {
        concept_version: conceptVersion,
        source_snapshot_date: new Date().toISOString().slice(0, 10),
        brand: input.brandName,
        domain: input.domain,
        logo_asset: input.logoAssetUrl,
        brand_colors: input.brandColors,
        chosen_product: input.productTitle,
        product_relationship: input.productRelationship,
        product_title: input.productTitle,
        price: input.price,
        currency: input.currency,
        reviews: input.reviewCount,
        rating: input.rating,
        usable_images: input.usableImages,
        source_product_url: input.productUrl,
        current_screenshots: input.currentScreenshots,
        current_cro_strengths: input.croStrengths,
        current_supported_leaks: input.croLeaks,
        catalog_intelligence: input.catalog,
        hero_product_evidence: input.heroEvidence,
        asset_readiness: input.assetReadiness,
        recommended_project: input.recommendedProject,
        recommended_concept_type: input.recommendedConceptType,
        recommended_section_plan: sectionPlan,
        suggested_template_family: input.suggestedTemplateFamily,
        suggested_template_id: registry?.template_id ?? null,
        template_variant: registry?.template_variant ?? null,
        template_version: registry?.template_version ?? null,
        preview_slug: previewSlug,
        preview_url: null,
        preview_version: null,
        design_copy_slots: {
            hero_eyebrow: { value: null, source: "PLACEHOLDER_REQUIRED" },
            hero_title: input.productTitle
                ? { value: input.productTitle, source: "SOURCE_CONTENT" }
                : { value: null, source: "PLACEHOLDER_REQUIRED" },
            hero_subtitle: { value: null, source: "PLACEHOLDER_REQUIRED" },
            primary_benefits: { value: null, source: "PLACEHOLDER_REQUIRED" },
            trust_items: { value: null, source: "PLACEHOLDER_REQUIRED" },
            feature_cards: { value: null, source: "PLACEHOLDER_REQUIRED" },
            story_blocks: { value: null, source: "PLACEHOLDER_REQUIRED" },
            faq_items: { value: null, source: "PLACEHOLDER_REQUIRED" },
            cta_label: { value: null, source: "PLACEHOLDER_REQUIRED" },
        },
        content_policy: {
            reviews: input.reviewCount != null ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
            ingredients: input.hasIngredients === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
            materials: input.hasMaterials === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
            guarantee: input.hasGuarantee === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
            results: "PLACEHOLDER_REQUIRED",
        },
        missing_assets: input.missingAssets,
        missing_content: missingContent,
    };
}
/** Reserved URL pattern — do not fill preview_url until real preview exists. */
export function reservedPreviewPath(brandSlug, productSlug) {
    return `https://${CONCEPT_PREVIEW_BASE_HOST}/concept/${brandSlug}/${productSlug}`;
}
//# sourceMappingURL=conceptBriefGenerator.js.map