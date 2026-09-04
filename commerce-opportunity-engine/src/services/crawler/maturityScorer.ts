import type {
  MaturitySignals,
  PageExtractedSignals,
  PlatformType,
  ProductPageResult,
} from "../../types/crawler.js";

/**
 * Maturity V2: missing signals stay null and do not invent identical mid scores.
 * Only observed components contribute to the weighted total.
 */
export function computeMaturityScore(input: {
  productPage: ProductPageResult;
  signals: PageExtractedSignals;
  paidActivityStrong: boolean;
  confirmedGoogleAdvertiser: boolean;
  platform: PlatformType;
  platformConfidence: number;
}): MaturitySignals {
  const productPriceSignal = scorePrice(input.productPage.price);
  const reviewVolumeSignal = scoreReviews(
    input.productPage.reviewCount,
    input.productPage.rating
  );
  const catalogDepthSignal = scoreCatalog(
    input.signals.estimatedProductLinks,
    input.signals.estimatedCategoryLinks
  );
  const professionalBrandingSignal = scoreBranding(input.signals);
  const paidActivitySignal = input.confirmedGoogleAdvertiser
    ? 1
    : input.paidActivityStrong
      ? 0.7
      : null;
  const shippingReturnsSignal = scoreShippingReturns(input.signals, input.productPage);
  const paymentSignal =
    input.signals.paymentSignals.length + input.productPage.paymentSignals.length > 0
      ? Math.min(
          1,
          (new Set([
            ...input.signals.paymentSignals,
            ...input.productPage.paymentSignals,
          ]).size /
            4) *
            1
        )
      : null;
  const productDataQualitySignal = scoreProductDataQuality(input.productPage);
  const platformMaturitySignal =
    input.platform !== "UNKNOWN"
      ? Math.min(1, input.platformConfidence)
      : input.platformConfidence >= 0.5
        ? input.platformConfidence * 0.6
        : null;

  const components: Record<string, number | null> = {
    productPriceSignal,
    reviewVolumeSignal,
    catalogDepthSignal,
    professionalBrandingSignal,
    paidActivitySignal,
    shippingReturnsSignal,
    paymentSignal,
    productDataQualitySignal,
    platformMaturitySignal,
  };

  const weights: Record<string, number> = {
    productPriceSignal: 12,
    reviewVolumeSignal: 14,
    catalogDepthSignal: 12,
    professionalBrandingSignal: 10,
    paidActivitySignal: 16,
    shippingReturnsSignal: 10,
    paymentSignal: 8,
    productDataQualitySignal: 12,
    platformMaturitySignal: 6,
  };

  let weightedSum = 0;
  let weightTotal = 0;
  for (const [key, value] of Object.entries(components)) {
    if (value == null) {
      continue;
    }
    const weight = weights[key] ?? 0;
    weightedSum += value * weight;
    weightTotal += weight;
  }

  // Sparse evidence: penalize instead of inventing a mid score
  const coverage = weightTotal / Object.values(weights).reduce((a, b) => a + b, 0);
  const raw = weightTotal > 0 ? (weightedSum / weightTotal) * 100 : 0;
  const businessMaturityScore = Math.round(raw * (0.55 + coverage * 0.45));

  return {
    productPriceSignal,
    reviewVolumeSignal,
    catalogDepthSignal,
    professionalBrandingSignal,
    paidActivitySignal,
    shippingReturnsSignal,
    paymentSignal,
    productDataQualitySignal,
    platformMaturitySignal,
    businessMaturityScore: Math.min(100, Math.max(0, businessMaturityScore)),
    components,
  };
}

function scorePrice(price: number | null): number | null {
  if (price == null || price <= 0) {
    return null;
  }
  if (price >= 80) return 0.95;
  if (price >= 40) return 0.8;
  if (price >= 20) return 0.65;
  if (price >= 10) return 0.5;
  return 0.35;
}

function scoreReviews(reviewCount: number | null, rating: number | null): number | null {
  if (reviewCount == null) {
    return null;
  }
  if (reviewCount >= 200) return rating && rating >= 4 ? 1 : 0.85;
  if (reviewCount >= 50) return 0.75;
  if (reviewCount >= 10) return 0.55;
  if (reviewCount >= 1) return 0.35;
  return null;
}

function scoreCatalog(productLinks: number, categoryLinks: number): number | null {
  if (productLinks === 0 && categoryLinks === 0) {
    return null;
  }
  if (productLinks >= 40) return 0.95;
  if (productLinks >= 15) return 0.75;
  if (productLinks >= 5) return 0.55;
  if (categoryLinks >= 5) return 0.45;
  if (productLinks >= 1) return 0.35;
  return 0.25;
}

function scoreBranding(signals: PageExtractedSignals): number | null {
  let observed = 0;
  let score = 0;
  if (signals.title) {
    observed += 1;
    score += 0.25;
  }
  if (signals.metaDescription) {
    observed += 1;
    score += 0.25;
  }
  if (signals.socialProofSignals.length > 0) {
    observed += 1;
    score += 0.25;
  }
  if (signals.guaranteeText) {
    observed += 1;
    score += 0.25;
  }
  if (observed === 0) {
    return null;
  }
  return Math.min(1, score);
}

function scoreShippingReturns(
  signals: PageExtractedSignals,
  product: ProductPageResult
): number | null {
  const shipping = product.shippingText ?? signals.shippingText;
  const returns = product.returnsText ?? signals.returnsText;
  if (!shipping && !returns) {
    return null;
  }
  return Math.min(1, (shipping ? 0.5 : 0) + (returns ? 0.5 : 0));
}

function scoreProductDataQuality(product: ProductPageResult): number | null {
  if (!product.productUrl) {
    return null;
  }
  let score = 0.2;
  if (product.productName) score += 0.25;
  if (product.price != null) score += 0.25;
  if (product.reviewCount != null) score += 0.15;
  if (product.description) score += 0.15;
  return Math.min(1, score);
}
