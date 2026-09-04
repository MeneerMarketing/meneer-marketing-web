export type PlatformType =
  | "SHOPIFY"
  | "WOOCOMMERCE"
  | "MAGENTO"
  | "SHOPWARE"
  | "OTHER_ECOMMERCE"
  | "UNKNOWN";

/** Strict page taxonomy for M3.1+. */
export type PageType =
  | "HOME"
  | "PRODUCT"
  | "COLLECTION"
  | "CATEGORY"
  | "SEARCH"
  | "CONTENT"
  | "UNKNOWN";

export type CrawlStatus = "success" | "failed" | "blocked" | "timeout" | "skipped";

export type ProductResolutionSource =
  | "ads_landing_url"
  | "final_url"
  | "internal_link"
  | "json_ld"
  | "sitemap"
  | "collection_link"
  | "none";

export interface JsonLdProduct {
  name?: string;
  url?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
  description?: string;
}

export interface PageExtractedSignals {
  title: string | null;
  metaDescription: string | null;
  bodyTextSample: string;
  jsonLdProducts: JsonLdProduct[];
  jsonLdTypes: string[];
  internalLinks: string[];
  hasCartLink: boolean;
  hasCheckoutLink: boolean;
  hasAddToCart: boolean;
  productUrlCount: number;
  collectionUrlCount: number;
  priceMatches: string[];
  categoryLinkCount: number;
  sellerMentions: number;
  compareMentions: number;
  storeLocatorMentions: number;
  insuranceServiceMentions: number;
  ownBrandMentions: number;
  paymentSignals: string[];
  shippingText: string | null;
  returnsText: string | null;
  guaranteeText: string | null;
  socialProofSignals: string[];
  estimatedProductLinks: number;
  estimatedCategoryLinks: number;
  brandNamesInText: string[];
  shopRouteHits: number;
  productGridHints: number;
  /**
   * Number of hreflang alternates. A Dutch specialist has a handful; a global
   * manufacturer or international chain publishes dozens of country versions.
   */
  localeAlternateCount?: number;
}

export interface PlatformDetectionResult {
  /** Definitive platform only when confidence >= confirm threshold. */
  platform: PlatformType;
  platformConfidence: number;
  /** Best candidate even when below confirm threshold. */
  platformCandidate: PlatformType;
  shopifyConfidence: number;
  signals: string[];
  evidence: Record<string, unknown>;
}

export interface EcommerceDetectionResult {
  isEcommerce: boolean;
  ecommerceConfidence: number;
  signals: string[];
  secondaryPagesCrawled: number;
}

export interface BusinessClassificationResult {
  businessType: string;
  businessTypeConfidence: number;
  businessTypeReasoning: string;
  usedHaikuFallback: boolean;
  /**
   * Milestone 9.3.3 — three signals that used to be tangled into one verdict.
   *
   * International presence says how many countries a shop serves. Category
   * breadth says how many unrelated verticals it sells. Retailer breadth
   * combines assortment width with chain behaviour. Only retailer breadth may
   * produce MASS_RETAILER: a niche brand selling the same range in 20 countries
   * is an international specialist, not a department store.
   */
  internationalPresenceScore: number;
  categoryBreadthScore: number;
  retailerBreadthScore: number;
  breadthEvidence: string[];
}

export interface ProductPageResult {
  pageType: PageType;
  productUrl: string | null;
  productName: string | null;
  price: number | null;
  currency: string | null;
  reviewCount: number | null;
  rating: number | null;
  availability: string | null;
  productBrand: string | null;
  description: string | null;
  shippingText: string | null;
  returnsText: string | null;
  guaranteeText: string | null;
  paymentSignals: string[];
  productResolutionConfidence: number;
  productResolutionSource: ProductResolutionSource;
  productCandidateCount: number;
  extractionEvidence: Record<string, unknown>;
}

export interface MaturitySignals {
  productPriceSignal: number | null;
  reviewVolumeSignal: number | null;
  catalogDepthSignal: number | null;
  professionalBrandingSignal: number | null;
  paidActivitySignal: number | null;
  shippingReturnsSignal: number | null;
  paymentSignal: number | null;
  productDataQualitySignal: number | null;
  platformMaturitySignal: number | null;
  businessMaturityScore: number;
  components: Record<string, number | null>;
}

export interface CrawlResult {
  startUrl: string;
  finalUrl: string;
  html: string;
  status: CrawlStatus;
  errorMessage: string | null;
  usedPlaywright: boolean;
}

export interface BrandQualificationCandidate {
  id: string;
  normalizedDomain: string;
  name: string;
  confirmedGoogleAdvertiser: boolean;
  transparencyConfirmed: boolean;
  landingUrl: string | null;
  keyword: string | null;
  adHeadline: string | null;
  adDescription: string | null;
  paidSignalStrong: boolean;
}

export interface QualificationResult {
  brandId: string;
  normalizedDomain: string;
  crawlStatus: CrawlStatus;
  crawlStartUrl: string;
  crawlFinalUrl: string;
  pageSignals: PageExtractedSignals | null;
  isEcommerce: boolean;
  ecommerceConfidence: number;
  platform: PlatformType;
  platformConfidence: number;
  platformCandidate: PlatformType;
  platformEvidence: Record<string, unknown>;
  shopifyConfidence: number;
  businessType: string;
  businessTypeConfidence: number;
  businessTypeReasoning: string;
  leadEligible: boolean;
  qualificationReason: string;
  qualificationEvidence: Record<string, unknown>;
  businessMaturityScore: number;
  businessMaturityComponents: Record<string, number | null>;
  retailerScaleScore: number;
  productPage: ProductPageResult;
  extractedData: Record<string, unknown>;
  maturity: MaturitySignals;
  haikuCostEstimate: number;
  errors: string[];
}

export interface QualificationRunStats {
  brandsCrawled: number;
  ecommerceCount: number;
  shopifyCount: number;
  wooCommerceCount: number;
  brandTypeCounts: Record<string, number>;
  leadEligible: number;
  excluded: number;
  errors: number;
  haikuCost: number;
  productsResolved: number;
  pricesFound: number;
  results: QualificationResult[];
}
