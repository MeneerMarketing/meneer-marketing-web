import type { BusinessClassificationResult, PageExtractedSignals } from "../../types/crawler.js";
import type { EcommerceDetectionResult } from "../../types/crawler.js";
/**
 * Bump this whenever the classification logic changes. Brands carrying an older
 * version are picked up by the recompute job instead of being patched by hand.
 *
 * v2-prospect-aware: consults the structural domain verdict before any website
 * heuristic, so chains and comparison sites can no longer be scored as
 * specialist webshops on the strength of a clean homepage.
 * v2.1: breadth only counts across categories, so a focused specialist bidding
 * on many keywords in one niche is no longer mistaken for a chain.
 * v2.2: hreflang breadth marks international operators.
 * v2.3: corporate-division language marks enterprises, and vertical matching
 * uses word boundaries so "automatisch" no longer counts as the auto vertical.
 * v2.4: international reach, category breadth and retailer breadth are measured
 * separately. Only assortment width produces MASS_RETAILER, so an international
 * specialist keeps its brand or specialist classification.
 */
export declare const BUSINESS_CLASSIFIER_VERSION = "v2.4-breadth-aware";
export declare function classifyBusinessFromWebsite(domain: string, signals: PageExtractedSignals, ecommerce: EcommerceDetectionResult): BusinessClassificationResult;
export declare function needsHaikuFallback(classification: BusinessClassificationResult): boolean;
//# sourceMappingURL=businessClassifier.d.ts.map