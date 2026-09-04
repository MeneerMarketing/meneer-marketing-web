/**
 * Milestone 9.3.1 — central prospect exclusion configuration.
 *
 * The gate itself is signal based. This file holds thresholds, pattern
 * registries used as signals, and the regression fixtures that keep the
 * classifier honest.
 */

export const PROSPECT_EXCLUSION_VERSION = "PROSPECT_PIPELINE_GATE_V1" as const;

/** Business types that can never enter the prospect pipeline. */
export const ALWAYS_EXCLUDED_BUSINESS_TYPES = [
  "GENERAL_RETAILER",
  "MASS_RETAILER",
  "MARKETPLACE",
  "COMPARISON_SITE",
] as const;

/** Business types that are not prospects but also not mass retail. */
export const NON_PROSPECT_BUSINESS_TYPES = ["NON_ECOMMERCE", "SERVICE_BUSINESS"] as const;

/**
 * Lexical signals that indicate a comparison / aggregator model.
 * Matched against the domain label, never used as the sole verdict source.
 */
export const COMPARISON_DOMAIN_PATTERNS = [
  "vergelijk",
  "kieskeurig",
  "beslist",
  "prijsvergelijk",
  "prijzen",
  "bestetest",
  "besten",
  "reviewsite",
  "topkeuze",
  "consumentenbond",
  // Shopping feed aggregators. They surface as "sellers" in shopping ads, so
  // without these they arrive looking like ordinary specialist webshops.
  "priceradar",
  "bigshopper",
  "shoparize",
  "bestegeprijs",
  "goedkoopste",
  "besteprijs",
  "kelkoo",
  "pricewise",
];

export const MARKETPLACE_DOMAIN_PATTERNS = [
  "marktplaats",
  "aliexpress",
  "amazon",
  "temu",
  "ebay",
  "etsy",
  "ubuy",
  "shein",
  "wish",
];

/**
 * Known mass / chain retail operators in NL+BE.
 * Used as ONE signal among several, and as the evidence source for the
 * regression fixtures below. The gate must also stop unlisted retailers
 * through the generic breadth and scale signals.
 */
export const MASS_RETAIL_OPERATOR_TOKENS = [
  "decathlon",
  "kruidvat",
  "trekpleister",
  "etos",
  "douglas",
  "iciparisxl",
  "notino",
  "lidl",
  "aldi",
  "action",
  "hema",
  "blokker",
  "bigbazar",
  "praxis",
  "gamma",
  "karwei",
  "hornbach",
  "ikea",
  "jysk",
  "leenbakker",
  "kwantum",
  "coolblue",
  "mediamarkt",
  "bcc",
  "expert",
  "wehkamp",
  "zalando",
  "asos",
  "aboutyou",
  "vandenassem",
  "welkoop",
  "pets place",
  "petsplace",
  "zooplus",
  "intersport",
  "perrysport",
  "scapino",
  "beterbed",
  "vente-unique",
  "home24",
  "viata",
  "lookfantastic",
  "promofarma",
  "lyko",
  "zoomalia",
  "bol",
  "albertheijn",
  "jumbo",
  "plus",
  "dirk",
];

/** Generic breadth / scale thresholds. No domain names involved. */
export const MASS_RETAIL_SIGNAL_THRESHOLDS = {
  /** Distinct product archetype categories the domain advertises in. */
  categorySpread: 3,
  /**
   * Keyword volume only counts as breadth when it spans categories. A focused
   * specialist advertising on eight keywords inside one niche is exactly the
   * prospect we want, so raw keyword count alone must never exclude.
   */
  crossCategoryMinCategories: 2,
  crossCategoryKeywordSpread: 6,
  retailerScaleScore: 65,
  estimatedProductCount: 800,
  estimatedBrandCount: 40,
  /** Very mature site combined with broad advertising is a chain signal. */
  matureBreadthMaturity: 60,
  matureBreadthCategorySpread: 2,
} as const;

export type ProspectExclusionReason =
  | "manual_excluded"
  | "blacklisted_domain"
  | "excluded_business_type"
  | "comparison_site_signal"
  | "marketplace_signal"
  | "mass_retail_operator"
  | "mass_retail_breadth"
  | "mass_retail_scale"
  | "mass_retail_catalog"
  | "reseller_brand_wall"
  | "non_ecommerce"
  | "service_business";

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

export const PROSPECT_GATE_FIXTURES: ProspectGateFixture[] = [
  {
    domain: "decathlon.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "SERVICE_BUSINESS", categorySpread: 3, keywordSpread: 9, businessMaturityScore: 43 },
  },
  {
    domain: "kruidvat.nl",
    expectEligible: false,
    expectReason: "excluded_business_type",
    signals: { businessType: "GENERAL_RETAILER", categorySpread: 4, keywordSpread: 8 },
  },
  {
    domain: "douglas.nl",
    expectEligible: false,
    expectReason: "excluded_business_type",
    signals: { businessType: "GENERAL_RETAILER", categorySpread: 1, keywordSpread: 2 },
  },
  {
    domain: "lidl.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "NON_ECOMMERCE", categorySpread: 4, keywordSpread: 7 },
  },
  {
    domain: "welkoop.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "SPECIALIST_WEBSHOP", retailerScaleScore: 0, categorySpread: 1, keywordSpread: 3, isEcommerce: true },
  },
  {
    domain: "coolblue.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "SPECIALIST_WEBSHOP", retailerScaleScore: 20, businessMaturityScore: 89, categorySpread: 2, keywordSpread: 3, isEcommerce: true },
  },
  {
    domain: "beslist.nl",
    expectEligible: false,
    expectReason: "excluded_business_type",
    signals: { businessType: "COMPARISON_SITE", categorySpread: 5, keywordSpread: 14 },
  },
  {
    domain: "vergelijk.nl",
    expectEligible: false,
    expectReason: "excluded_business_type",
    signals: { businessType: "COMPARISON_SITE", categorySpread: 4, keywordSpread: 7 },
  },
  {
    domain: "kieskeurig.nl",
    expectEligible: false,
    expectReason: "excluded_business_type",
    signals: { businessType: "COMPARISON_SITE", categorySpread: 5, keywordSpread: 12 },
  },
  {
    domain: "vergelijkeven.nl",
    expectEligible: false,
    expectReason: "comparison_site_signal",
    signals: { businessType: "UNKNOWN", categorySpread: 4, keywordSpread: 8 },
  },
  {
    domain: "zooplus.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "UNKNOWN", categorySpread: 1, keywordSpread: 4 },
  },
  {
    domain: "bol.com",
    expectEligible: false,
    expectReason: "blacklisted_domain",
    signals: { businessType: "MARKETPLACE", retailerScaleScore: 52 },
  },
  {
    domain: "mediamarkt.nl",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "SPECIALIST_WEBSHOP", categorySpread: 3, keywordSpread: 4, isEcommerce: true },
  },
  {
    domain: "asos.com",
    expectEligible: false,
    expectReason: "mass_retail_operator",
    signals: { businessType: "NON_ECOMMERCE", isEcommerce: false },
  },
  {
    domain: "dogsen.nl",
    expectEligible: true,
    expectReason: null,
    signals: { businessType: "SPECIALIST_WEBSHOP", retailerScaleScore: 0, categorySpread: 1, keywordSpread: 2, isEcommerce: true, businessMaturityScore: 55 },
  },
  {
    domain: "quiesco.nl",
    expectEligible: true,
    expectReason: null,
    signals: { businessType: "SPECIALIST_WEBSHOP", retailerScaleScore: 5, categorySpread: 1, keywordSpread: 1, isEcommerce: true, businessMaturityScore: 58 },
  },
  {
    domain: "nordichigh.nl",
    expectEligible: true,
    expectReason: null,
    signals: { businessType: "SPECIALIST_WEBSHOP", retailerScaleScore: 0, categorySpread: 1, keywordSpread: 2, isEcommerce: true, businessMaturityScore: 52 },
  },
  {
    domain: "onbekendespecialist.nl",
    expectEligible: false,
    expectReason: "mass_retail_breadth",
    signals: { businessType: "SPECIALIST_WEBSHOP", categorySpread: 4, keywordSpread: 11, isEcommerce: true },
  },
  {
    // Focused specialist bidding hard inside one niche: exactly our prospect.
    domain: "diepeniche.nl",
    expectEligible: true,
    expectReason: null,
    signals: { businessType: "SPECIALIST_WEBSHOP", categorySpread: 1, keywordSpread: 9, isEcommerce: true, retailerScaleScore: 12 },
  },
  {
    // Same keyword volume, but spread over categories: chain behaviour.
    domain: "breedassortiment.nl",
    expectEligible: false,
    expectReason: "mass_retail_breadth",
    signals: { businessType: "SPECIALIST_WEBSHOP", categorySpread: 2, keywordSpread: 9, isEcommerce: true },
  },
];
