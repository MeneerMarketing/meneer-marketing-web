import * as cheerio from "cheerio";
import { parseEuropeanMoneyAmount } from "../prospect/priceConsistencyCheck.js";
import { extractPageSignals } from "./pageExtractor.js";
/**
 * Extract product details from a dedicated product page crawl.
 * Rejects shipping/returns amounts as product prices.
 */
export function extractProductPageDetails(input) {
    const signals = extractPageSignals(input.html, input.productUrl);
    const $ = cheerio.load(input.html);
    const jsonProduct = signals.jsonLdProducts.find((p) => p.url === input.productUrl) ??
        signals.jsonLdProducts[0] ??
        null;
    const name = jsonProduct?.name ??
        ($("h1").first().text().trim() ||
            $("meta[property='og:title']").attr("content")?.trim() ||
            null);
    // Never use homepage-style site titles as product name without product evidence
    const productName = sanitizeProductName(name, signals.title);
    const priceFromJson = jsonProduct?.price ?? null;
    const currencyFromJson = jsonProduct?.currency ?? null;
    const priceFromDom = extractValidatedPrice($, signals);
    const price = priceFromJson ?? priceFromDom.price;
    const currency = currencyFromJson ?? priceFromDom.currency;
    return {
        pageType: "PRODUCT",
        productUrl: input.productUrl,
        productName,
        price,
        currency,
        reviewCount: jsonProduct?.reviewCount ?? null,
        rating: jsonProduct?.rating ?? null,
        availability: jsonProduct?.availability ?? null,
        productBrand: jsonProduct?.brand ?? null,
        description: jsonProduct?.description ??
            $("meta[name='description']").attr("content")?.trim() ??
            null,
        shippingText: signals.shippingText,
        returnsText: signals.returnsText,
        guaranteeText: signals.guaranteeText,
        paymentSignals: signals.paymentSignals,
        productResolutionConfidence: Math.round(input.candidate.score * 1000) / 1000,
        productResolutionSource: input.candidate.source,
        productCandidateCount: input.candidateCount,
        extractionEvidence: {
            reasons: input.candidate.reasons,
            usedJsonLd: Boolean(jsonProduct),
            priceSource: priceFromJson != null ? "json_ld" : priceFromDom.price != null ? "dom" : null,
            title: signals.title,
            hasAddToCart: signals.hasAddToCart,
        },
    };
}
function sanitizeProductName(candidate, pageTitle) {
    if (!candidate) {
        return null;
    }
    const trimmed = candidate.trim();
    if (trimmed.length < 3) {
        return null;
    }
    // Reject obvious homepage titles when they look like brand slogans
    if (pageTitle &&
        trimmed === pageTitle &&
        (trimmed.includes("|") || trimmed.includes(" - ") || trimmed.length > 80)) {
        return null;
    }
    return trimmed.slice(0, 300);
}
function extractValidatedPrice($, signals) {
    const metaPrice = $('meta[property="product:price:amount"]').attr("content") ??
        $('meta[itemprop="price"]').attr("content") ??
        null;
    if (metaPrice) {
        const parsed = parsePriceString(metaPrice);
        if (parsed && isPlausibleProductPrice(parsed, "")) {
            return { price: parsed, currency: "EUR" };
        }
    }
    // Prefer price elements near product UI, exclude shipping/returns contexts
    const priceSelectors = [
        "[itemprop='price']",
        ".price",
        ".product-price",
        "[class*='product-price']",
        "[data-product-price]",
    ];
    for (const selector of priceSelectors) {
        const el = $(selector).first();
        if (el.length === 0) {
            continue;
        }
        const text = el.text().trim();
        const context = `${el.parent().text()} ${el.attr("class") ?? ""}`.toLowerCase();
        if (isShippingOrFeeContext(context)) {
            continue;
        }
        const parsed = parsePriceString(text);
        if (parsed && isPlausibleProductPrice(parsed, context)) {
            return { price: parsed, currency: text.includes("€") || text.includes("EUR") ? "EUR" : null };
        }
    }
    for (const match of signals.priceMatches.slice(0, 5)) {
        const parsed = parsePriceString(match);
        if (parsed && isPlausibleProductPrice(parsed, signals.bodyTextSample.slice(0, 400))) {
            // Only accept body price matches if not shipping-context adjacent
            const idx = signals.bodyTextSample.indexOf(match.toLowerCase().replace("€", "").trim());
            const window = idx >= 0
                ? signals.bodyTextSample.slice(Math.max(0, idx - 40), idx + 40)
                : "";
            if (!isShippingOrFeeContext(window)) {
                return { price: parsed, currency: "EUR" };
            }
        }
    }
    return { price: null, currency: null };
}
function parsePriceString(raw) {
    return parseEuropeanMoneyAmount(raw);
}
function isShippingOrFeeContext(text) {
    return /verzending|shipping|bezorg|retourkosten|admin.?fee|transactiekosten|pakkosten|vanaf\s*€?\s*\d/i.test(text);
}
function isPlausibleProductPrice(price, context) {
    if (price < 1) {
        return false;
    }
    // Very common NL shipping amounts
    if ([4.95, 5.95, 6.95, 3.95, 2.95].includes(Number(price.toFixed(2)))) {
        if (isShippingOrFeeContext(context) || context.length === 0) {
            return false;
        }
    }
    if (price > 50000) {
        return false;
    }
    return true;
}
//# sourceMappingURL=productPageExtractor.js.map