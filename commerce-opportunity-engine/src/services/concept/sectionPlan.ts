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

function hintsInclude(hints: string[], ...tokens: string[]): boolean {
  const h = hints.map((x) => x.toLowerCase()).join(" ");
  return tokens.some((t) => h.includes(t));
}

export function buildRecommendedSectionPlan(
  input: SectionPlanInput
): SectionPlanItem[] {
  const plan: SectionPlanItem[] = [];
  const beauty = hintsInclude(
    input.categoryHints,
    "beauty",
    "skin",
    "skincare",
    "cosmetic",
    "verzorging"
  );
  const pets = hintsInclude(
    input.categoryHints,
    "pet",
    "hond",
    "kat",
    "dier",
    "dog",
    "cat"
  );
  const sleep = hintsInclude(
    input.categoryHints,
    "sleep",
    "matras",
    "slaap",
    "bedding"
  );

  plan.push({
    section: "HERO_BUY_BLOCK",
    reason: "Always required for concept PDP",
    content_source: "SOURCE_CONTENT",
  });
  plan.push({
    section: "TRUST_BAR",
    reason: "Trust near buy intent",
    content_source:
      input.hasDeliveryReturns || input.hasGuarantee || input.hasReviews
        ? "SOURCE_CONTENT"
        : "PLACEHOLDER_REQUIRED",
  });

  if (input.hasBenefits === true || input.descriptionLength >= 80) {
    plan.push({
      section: "BENEFIT_GRID",
      reason: "Benefits or description available",
      content_source:
        input.hasBenefits === true ? "SOURCE_CONTENT" : "DERIVED_COPY",
    });
  }

  if (input.hasDescription && input.descriptionLength >= 120) {
    plan.push({
      section: "PRODUCT_STORY",
      reason: "Enough description for storytelling frame",
      content_source: "DERIVED_COPY",
    });
  }

  if (input.hasHowItWorks === true || beauty) {
    plan.push({
      section: "HOW_IT_WORKS",
      reason: beauty
        ? "Skincare/beauty category often needs mechanism"
        : "How-it-works content detected",
      content_source:
        input.hasHowItWorks === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
    });
  }

  if (input.hasHowToUse === true || beauty || pets) {
    plan.push({
      section: "HOW_TO_USE",
      reason: "Usage guidance relevant for category or detected",
      content_source:
        input.hasHowToUse === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
    });
  }

  if (input.hasIngredients === true || (beauty && input.hasIngredients !== false)) {
    plan.push({
      section: "INGREDIENTS",
      reason: "Ingredients present or beauty category",
      content_source:
        input.hasIngredients === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
    });
  }

  if (input.hasMaterials === true || pets || sleep) {
    plan.push({
      section: "MATERIALS",
      reason: "Materials relevant for pets/sleep or detected",
      content_source:
        input.hasMaterials === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
    });
  }

  if (input.hasSpecs === true || input.hasFeatures === true) {
    plan.push({
      section: "FEATURE_DEEP_DIVE",
      reason: "Features/specs available",
      content_source: "SOURCE_CONTENT",
    });
  }
  if (input.hasSpecs === true) {
    plan.push({
      section: "TECH_SPECS",
      reason: "Specs detected",
      content_source: "SOURCE_CONTENT",
    });
  }

  if (input.hasSizeGuide === true || pets || sleep) {
    plan.push({
      section: "SIZE_GUIDE",
      reason: "Size guide relevant",
      content_source:
        input.hasSizeGuide === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
    });
  }

  if (input.hasBeforeAfter === true) {
    plan.push({
      section: "BEFORE_AFTER",
      reason: "Before/after assets available",
      content_source: "SOURCE_CONTENT",
    });
  }

  if (input.hasReviews || input.hasRating) {
    plan.push({
      section: "REVIEWS",
      reason: "Reviews/rating available",
      content_source: "SOURCE_CONTENT",
    });
  }

  if (input.hasDeliveryReturns === true) {
    plan.push({
      section: "DELIVERY_RETURNS",
      reason: "Delivery/returns content available",
      content_source: "SOURCE_CONTENT",
    });
  }
  if (input.hasGuarantee === true) {
    plan.push({
      section: "GUARANTEE",
      reason: "Guarantee content available",
      content_source: "SOURCE_CONTENT",
    });
  }

  plan.push({
    section: "FAQ",
    reason: "FAQ always useful; source only if present",
    content_source: input.hasFaq === true ? "SOURCE_CONTENT" : "PLACEHOLDER_REQUIRED",
  });

  plan.push({
    section: "STICKY_ATC",
    reason: "Mobile CRO sticky ATC",
    content_source: "DERIVED_COPY",
  });

  // Deduplicate by section
  const seen = new Set<string>();
  return plan.filter((p) => {
    if (seen.has(p.section)) return false;
    seen.add(p.section);
    return true;
  });
}
