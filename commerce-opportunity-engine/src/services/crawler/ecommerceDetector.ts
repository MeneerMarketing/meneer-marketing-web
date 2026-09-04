import type {
  EcommerceDetectionResult,
  PageExtractedSignals,
  PlatformDetectionResult,
} from "../../types/crawler.js";

export function detectEcommerce(
  signals: PageExtractedSignals,
  platform: PlatformDetectionResult,
  secondarySignals: PageExtractedSignals[] = []
): EcommerceDetectionResult {
  const allSignals = [signals, ...secondarySignals];
  const evidence = new Set<string>();
  let score = 0;

  const merged = mergeSignals(allSignals);

  if (merged.jsonLdProducts.length > 0) {
    score += 0.25;
    evidence.add("json_ld_products");
  }
  if (merged.jsonLdTypes.some((t) => t.toLowerCase().includes("product"))) {
    score += 0.1;
    evidence.add("json_ld_product_type");
  }
  if (merged.hasAddToCart) {
    score += 0.2;
    evidence.add("add_to_cart");
  }
  if (merged.hasCartLink || merged.hasCheckoutLink) {
    score += 0.15;
    evidence.add("cart_or_checkout");
  }
  if (merged.productUrlCount >= 2 || merged.estimatedProductLinks >= 2) {
    score += 0.15;
    evidence.add("product_urls");
  }
  if (merged.priceMatches.length >= 2) {
    score += 0.1;
    evidence.add("visible_prices");
  }
  if (merged.shopRouteHits >= 1) {
    score += 0.12;
    evidence.add("shop_routes");
  }
  if (merged.productGridHints >= 1) {
    score += 0.1;
    evidence.add("product_grid");
  }
  if (merged.collectionUrlCount >= 2 || merged.estimatedCategoryLinks >= 3) {
    score += 0.1;
    evidence.add("category_or_collection_nav");
  }
  if (
    platform.platform !== "UNKNOWN" ||
    (platform.platformCandidate !== "UNKNOWN" && platform.platformConfidence >= 0.5)
  ) {
    score += 0.2;
    evidence.add(
      `platform_${(platform.platform !== "UNKNOWN" ? platform.platform : platform.platformCandidate).toLowerCase()}`
    );
  }

  // Secondary crawl bonus: ecommerce routes confirmed beyond homepage
  if (secondarySignals.length > 0) {
    const secondaryHasShop =
      secondarySignals.some(
        (s) =>
          s.hasAddToCart ||
          s.hasCartLink ||
          s.jsonLdProducts.length > 0 ||
          s.productUrlCount > 0 ||
          s.shopRouteHits > 0
      );
    if (secondaryHasShop) {
      score += 0.15;
      evidence.add("secondary_shop_pages");
    }
  }

  const capped = Math.min(score, 1);
  const ecommerceConfidence = Math.round(capped * 1000) / 1000;

  return {
    isEcommerce: ecommerceConfidence >= 0.4,
    ecommerceConfidence,
    signals: [...evidence],
    secondaryPagesCrawled: secondarySignals.length,
  };
}

function mergeSignals(pages: PageExtractedSignals[]): PageExtractedSignals {
  const first = pages[0];
  if (!first) {
    throw new Error("mergeSignals requires at least one page");
  }

  return {
    ...first,
    jsonLdProducts: pages.flatMap((p) => p.jsonLdProducts),
    jsonLdTypes: pages.flatMap((p) => p.jsonLdTypes),
    internalLinks: [...new Set(pages.flatMap((p) => p.internalLinks))],
    hasCartLink: pages.some((p) => p.hasCartLink),
    hasCheckoutLink: pages.some((p) => p.hasCheckoutLink),
    hasAddToCart: pages.some((p) => p.hasAddToCart),
    productUrlCount: pages.reduce((sum, p) => sum + p.productUrlCount, 0),
    collectionUrlCount: pages.reduce((sum, p) => sum + p.collectionUrlCount, 0),
    priceMatches: pages.flatMap((p) => p.priceMatches).slice(0, 40),
    categoryLinkCount: pages.reduce((sum, p) => sum + p.categoryLinkCount, 0),
    sellerMentions: Math.max(...pages.map((p) => p.sellerMentions)),
    compareMentions: Math.max(...pages.map((p) => p.compareMentions)),
    storeLocatorMentions: Math.max(...pages.map((p) => p.storeLocatorMentions)),
    insuranceServiceMentions: Math.max(...pages.map((p) => p.insuranceServiceMentions)),
    paymentSignals: [...new Set(pages.flatMap((p) => p.paymentSignals))],
    socialProofSignals: [...new Set(pages.flatMap((p) => p.socialProofSignals))],
    estimatedProductLinks: pages.reduce((sum, p) => sum + p.estimatedProductLinks, 0),
    estimatedCategoryLinks: pages.reduce((sum, p) => sum + p.estimatedCategoryLinks, 0),
    shopRouteHits: pages.reduce((sum, p) => sum + p.shopRouteHits, 0),
    productGridHints: pages.reduce((sum, p) => sum + p.productGridHints, 0),
  };
}
