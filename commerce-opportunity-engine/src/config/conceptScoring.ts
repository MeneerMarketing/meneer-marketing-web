/**
 * Milestone 9 — Concept Ready scoring weights (central config).
 * No magic numbers in scorers.
 *
 * Concept Ready = weighted blend of existing intelligence + new concept signals.
 * Does NOT double-count CRO quality as opportunity score; uses transformation + assets.
 */

export const CONCEPT_READY_WEIGHTS = {
  /** Meneer Marketing / pre-fit (client suitability) */
  mmOrPreFit: 0.14,
  businessMaturity: 0.08,
  platformFit: 0.1,
  catalogFocus: 0.12,
  ownBrandFit: 0.1,
  heroProductQuality: 0.12,
  productCommercialSignal: 0.08,
  pdpTransformationPotential: 0.12,
  conceptAssetReadiness: 0.1,
  googleAdvertiserSignal: 0.04,
} as const;

/** Applied AFTER weighted sum (subtract). */
export const CONCEPT_RETAILER_SCALE_PENALTY = {
  softStart: 50,
  hardStart: 70,
  maxPenalty: 28,
} as const;

export const CONCEPT_VERDICT_BANDS = {
  CONCEPT_READY: 90,
  STRONG_CONCEPT: 80,
  POSSIBLE_CONCEPT: 65,
  WEAK_CONCEPT_CANDIDATE: 50,
} as const;

export type ConceptVerdict =
  | "NOT_SUITABLE"
  | "WEAK_CONCEPT_CANDIDATE"
  | "POSSIBLE_CONCEPT"
  | "STRONG_CONCEPT"
  | "CONCEPT_READY";

export type BrandCommerceModel =
  | "DTC_OWN_BRAND"
  | "MOSTLY_OWN_BRAND"
  | "MIXED"
  | "SPECIALIST_RESELLER"
  | "GENERAL_RESELLER"
  | "MARKETPLACE"
  | "UNKNOWN";

export type CatalogSizeTier =
  | "MICRO"
  | "SMALL"
  | "FOCUSED"
  | "MEDIUM"
  | "LARGE"
  | "MASSIVE"
  | "UNKNOWN";

export type RecommendedConceptType =
  | "FULL_PDP_REDESIGN"
  | "BUYBLOCK_REDESIGN"
  | "DEEP_DIVE_PRODUCT_STORY"
  | "MOBILE_FIRST_PDP"
  | "SHOPIFY_REBUILD_CONCEPT"
  | "WOOCOMMERCE_MIGRATION_CONCEPT"
  | "NOT_SUITABLE";

export type ConceptStatus =
  | "NOT_EVALUATED"
  | "NOT_SUITABLE"
  | "CONCEPT_CANDIDATE"
  | "BRIEF_READY"
  | "DESIGN_PENDING"
  | "READY_FOR_PREVIEW"
  | "PREVIEW_READY"
  | "APPROVED_FOR_OUTREACH"
  | "ARCHIVED";

export type ConceptTemplateFamily =
  | "PREMIUM_DTC"
  | "PRODUCT_ENGINEERING"
  | "EDITORIAL_COMMERCE";

export const CONCEPT_SECTION_TYPES = [
  "HERO_BUY_BLOCK",
  "TRUST_BAR",
  "BENEFIT_GRID",
  "PROBLEM_SOLUTION",
  "PRODUCT_STORY",
  "HOW_IT_WORKS",
  "HOW_TO_USE",
  "FEATURE_DEEP_DIVE",
  "MATERIALS",
  "INGREDIENTS",
  "TECH_SPECS",
  "SIZE_GUIDE",
  "COMPARISON",
  "BEFORE_AFTER",
  "REVIEWS",
  "TESTIMONIALS",
  "UGC",
  "DELIVERY_RETURNS",
  "GUARANTEE",
  "FAQ",
  "STICKY_ATC",
  "RELATED_PRODUCTS",
] as const;

export type ConceptSectionType = (typeof CONCEPT_SECTION_TYPES)[number];

/** Own-brand fit score mapping for concept ready. */
export const OWN_BRAND_FIT_BY_MODEL: Record<BrandCommerceModel, number> = {
  DTC_OWN_BRAND: 100,
  MOSTLY_OWN_BRAND: 88,
  MIXED: 62,
  SPECIALIST_RESELLER: 55,
  GENERAL_RESELLER: 28,
  MARKETPLACE: 8,
  UNKNOWN: 45,
};

/** Platform fit for concept work. */
export const CONCEPT_PLATFORM_FIT: Record<string, number> = {
  SHOPIFY: 100,
  WOOCOMMERCE: 72,
  MAGENTO: 48,
  CUSTOM: 40,
  UNKNOWN: 30,
};

export const HERO_PRODUCT_MIN_CONFIDENCE = 45;
export const BRIEF_READY_MIN_CONCEPT_SCORE = 65;
export const BRIEF_READY_MIN_ASSET_SCORE = 40;

/**
 * Soft caps: a strong brand with little PDP transformation room
 * cannot become CONCEPT_READY (90+) just on brand/assets quality.
 * Applied after weighted sum − retailer penalty.
 */
export const CONCEPT_TRANSFORM_SOFT_CAPS: Array<{
  maxTransformExclusive: number;
  maxConceptReady: number;
}> = [
  { maxTransformExclusive: 45, maxConceptReady: 74 },
  { maxTransformExclusive: 55, maxConceptReady: 82 },
  { maxTransformExclusive: 65, maxConceptReady: 87 },
];

export const CONCEPT_PREVIEW_BASE_HOST =
  process.env.CONCEPT_PREVIEW_BASE_HOST?.trim() ||
  "preview.meneermarketing.nl";

export const CONCEPT_TEMPLATE_REGISTRY: Array<{
  template_id: string;
  template_family: ConceptTemplateFamily;
  template_variant: string;
  template_version: string;
  supported_sections: ConceptSectionType[];
  required_assets: string[];
  optional_assets: string[];
  category_suitability: string[];
  design_status: "REGISTRY_ONLY" | "PARTIAL_IMPLEMENTATION";
}> = [
  {
    template_id: "premium_dtc_a",
    template_family: "PREMIUM_DTC",
    template_variant: "A",
    template_version: "0.2.0-internal",
    supported_sections: [
      "HERO_BUY_BLOCK",
      "TRUST_BAR",
      "BENEFIT_GRID",
      "PRODUCT_STORY",
      "HOW_IT_WORKS",
      "HOW_TO_USE",
      "FEATURE_DEEP_DIVE",
      "REVIEWS",
      "FAQ",
      "STICKY_ATC",
    ],
    required_assets: ["product_images", "product_title", "price"],
    optional_assets: ["logo", "lifestyle_images", "reviews", "video", "faq", "delivery_returns_trust"],
    category_suitability: ["beauty", "skincare", "wellness", "dtc", "pets"],
    design_status: "PARTIAL_IMPLEMENTATION",
  },
  {
    template_id: "premium_dtc_b",
    template_family: "PREMIUM_DTC",
    template_variant: "B",
    template_version: "0.0.0-registry",
    supported_sections: [
      "HERO_BUY_BLOCK",
      "BENEFIT_GRID",
      "BEFORE_AFTER",
      "INGREDIENTS",
      "HOW_TO_USE",
      "REVIEWS",
      "FAQ",
    ],
    required_assets: ["product_images", "product_title"],
    optional_assets: ["ingredients", "before_after", "reviews"],
    category_suitability: ["beauty", "skincare"],
    design_status: "REGISTRY_ONLY",
  },
  {
    template_id: "product_engineering_a",
    template_family: "PRODUCT_ENGINEERING",
    template_variant: "A",
    template_version: "0.0.0-registry",
    supported_sections: [
      "HERO_BUY_BLOCK",
      "FEATURE_DEEP_DIVE",
      "TECH_SPECS",
      "MATERIALS",
      "SIZE_GUIDE",
      "REVIEWS",
      "FAQ",
    ],
    required_assets: ["product_images", "product_title", "specs_or_features"],
    optional_assets: ["size_guide", "materials", "reviews"],
    category_suitability: ["pets", "home", "gear", "sleep"],
    design_status: "REGISTRY_ONLY",
  },
  {
    template_id: "editorial_commerce_a",
    template_family: "EDITORIAL_COMMERCE",
    template_variant: "A",
    template_version: "0.0.0-registry",
    supported_sections: [
      "HERO_BUY_BLOCK",
      "PRODUCT_STORY",
      "PROBLEM_SOLUTION",
      "BENEFIT_GRID",
      "REVIEWS",
      "FAQ",
    ],
    required_assets: ["product_images", "product_title", "description"],
    optional_assets: ["lifestyle_images", "reviews", "brand_story"],
    category_suitability: ["lifestyle", "fashion", "home"],
    design_status: "REGISTRY_ONLY",
  },
];

export function conceptVerdictFromScore(score: number): ConceptVerdict {
  if (score >= CONCEPT_VERDICT_BANDS.CONCEPT_READY) return "CONCEPT_READY";
  if (score >= CONCEPT_VERDICT_BANDS.STRONG_CONCEPT) return "STRONG_CONCEPT";
  if (score >= CONCEPT_VERDICT_BANDS.POSSIBLE_CONCEPT) return "POSSIBLE_CONCEPT";
  if (score >= CONCEPT_VERDICT_BANDS.WEAK_CONCEPT_CANDIDATE)
    return "WEAK_CONCEPT_CANDIDATE";
  return "NOT_SUITABLE";
}
