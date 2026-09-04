/**
 * Milestone 9 — dynamic section plan from available product data/assets only.
 * No AI. No hallucinated sections.
 */
import type { ConceptSectionType } from "../../config/conceptScoring.js";
export type SectionPlanInput = {
    categoryHints: string[];
    hasReviews: boolean;
    hasRating: boolean;
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
    hasDescription: boolean;
    hasBenefits: boolean | null;
    hasFeatures: boolean | null;
    descriptionLength: number;
};
export type SectionPlanItem = {
    section: ConceptSectionType;
    reason: string;
    content_source: "SOURCE_CONTENT" | "DERIVED_COPY" | "PLACEHOLDER_REQUIRED";
};
export declare function buildRecommendedSectionPlan(input: SectionPlanInput): SectionPlanItem[];
//# sourceMappingURL=sectionPlan.d.ts.map