import * as cheerio from "cheerio";
import type { JsonLdProduct, PageExtractedSignals } from "../../types/crawler.js";

function parseJsonLdProduct(node: Record<string, unknown>): JsonLdProduct | null {
  const type = String(node["@type"] ?? "").toLowerCase();
  if (!type.includes("product")) {
    return null;
  }

  let price: number | undefined;
  let currency: string | undefined;

  const offers = node.offers as Record<string, unknown> | Array<Record<string, unknown>> | undefined;
  const offer = Array.isArray(offers) ? offers[0] : offers;
  if (offer) {
    const rawPrice = offer.price ?? offer.lowPrice;
    if (typeof rawPrice === "number") {
      price = rawPrice;
    } else if (typeof rawPrice === "string") {
      const parsed = Number(rawPrice.replace(",", "."));
      if (!Number.isNaN(parsed)) {
        price = parsed;
      }
    }
    if (typeof offer.priceCurrency === "string") {
      currency = offer.priceCurrency;
    }
  }

  let rating: number | undefined;
  let reviewCount: number | undefined;
  const aggregate = node.aggregateRating as Record<string, unknown> | undefined;
  if (aggregate) {
    if (typeof aggregate.ratingValue === "number") {
      rating = aggregate.ratingValue;
    } else if (typeof aggregate.ratingValue === "string") {
      rating = Number(aggregate.ratingValue);
    }
    if (typeof aggregate.reviewCount === "number") {
      reviewCount = aggregate.reviewCount;
    } else if (typeof aggregate.reviewCount === "string") {
      reviewCount = Number(aggregate.reviewCount);
    }
  }

  let brand: string | undefined;
  const brandNode = node.brand;
  if (typeof brandNode === "string") {
    brand = brandNode;
  } else if (brandNode && typeof brandNode === "object") {
    const brandName = (brandNode as Record<string, unknown>).name;
    if (typeof brandName === "string") {
      brand = brandName;
    }
  }

  return {
    name: typeof node.name === "string" ? node.name : undefined,
    url: typeof node.url === "string" ? node.url : undefined,
    price,
    currency,
    rating,
    reviewCount,
    availability: typeof offer?.availability === "string" ? offer.availability : undefined,
    brand,
    description: typeof node.description === "string" ? node.description : undefined,
  };
}

function collectJsonLd(
  node: unknown,
  products: JsonLdProduct[],
  types: string[]
): void {
  if (!node || typeof node !== "object") {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectJsonLd(item, products, types);
    }
    return;
  }

  const record = node as Record<string, unknown>;
  const typeValue = record["@type"];
  if (typeof typeValue === "string") {
    types.push(typeValue);
    const product = parseJsonLdProduct(record);
    if (product) {
      products.push(product);
    }
  } else if (Array.isArray(typeValue)) {
    for (const t of typeValue) {
      types.push(String(t));
    }
    const product = parseJsonLdProduct(record);
    if (product) {
      products.push(product);
    }
  }

  for (const value of Object.values(record)) {
    collectJsonLd(value, products, types);
  }
}

export function extractPageSignals(html: string, baseUrl: string): PageExtractedSignals {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const bodyTextSample = bodyText.slice(0, 8000).toLowerCase();

  const jsonLdProducts: JsonLdProduct[] = [];
  const jsonLdTypes: string[] = [];

  $("script[type='application/ld+json']").each((_, el) => {
    const raw = $(el).text();
    try {
      const parsed = JSON.parse(raw);
      collectJsonLd(parsed, jsonLdProducts, jsonLdTypes);
    } catch {
      // ignore invalid JSON-LD
    }
  });

  const internalLinks: string[] = [];
  let productUrlCount = 0;
  let collectionUrlCount = 0;
  let categoryLinkCount = 0;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }
    try {
      const absolute = new URL(href, baseUrl).href;
      internalLinks.push(absolute);
      const path = new URL(absolute).pathname.toLowerCase();
      if (
        path.includes("/products/") ||
        path.includes("/product/") ||
        path.includes("/p/") ||
        /\/[a-z0-9-]+-\d+\.html$/i.test(path)
      ) {
        productUrlCount += 1;
      }
      if (path.includes("/collections/") || path.includes("/collection/")) {
        collectionUrlCount += 1;
      }
      if (
        path.includes("/c/") ||
        path.includes("/shop/") ||
        path.includes("/category/") ||
        path.includes("/categorie/") ||
        path.includes("/webwinkel/") ||
        path.includes("/winkel/")
      ) {
        categoryLinkCount += 1;
      }
    } catch {
      // ignore bad URLs
    }
  });

  const htmlLower = html.toLowerCase();
  const hasCartLink =
    htmlLower.includes("/cart") ||
    htmlLower.includes("winkelwagen") ||
    htmlLower.includes("cart.js") ||
    htmlLower.includes("mini-cart");
  const hasCheckoutLink =
    htmlLower.includes("/checkout") || htmlLower.includes("afrekenen");
  const hasAddToCart =
    htmlLower.includes("add-to-cart") ||
    htmlLower.includes("add to cart") ||
    htmlLower.includes("addtocart") ||
    htmlLower.includes("in winkelwagen") ||
    htmlLower.includes("in mijn winkelwagen") ||
    htmlLower.includes("toevoegen aan") ||
    $("button, input, a").filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return (
        text.includes("winkelwagen") ||
        text.includes("add to cart") ||
        text.includes("bestel") ||
        text.includes("koop")
      );
    }).length > 0;

  let shopRouteHits = 0;
  for (const pathHint of [
    "/shop/",
    "/webwinkel/",
    "/winkel/",
    "/products/",
    "/product/",
    "/collections/",
    "/category/",
    "/categorie/",
  ]) {
    if (htmlLower.includes(pathHint)) {
      shopRouteHits += 1;
    }
  }

  const productGridHints =
    ($(".product-grid, .product-list, .products-grid, [class*='product-card'], [class*='product-item'], [data-product-id]").length > 0
      ? 1
      : 0) +
    (htmlLower.includes("product-item") || htmlLower.includes("productcard") ? 1 : 0);

  const priceMatches = bodyText.match(/€\s?\d+[\d.,]*/g) ?? [];

  const compareMentions = countMentions(bodyTextSample, [
    "vergelijk",
    "prijzen vergelijken",
    "compare prices",
    "goedkoop bij",
    "bekijk bij",
  ]);
  const sellerMentions = countMentions(bodyTextSample, [
    "seller",
    "verkoper",
    "marketplace",
    "aanbieder",
    "externe winkel",
    "sold by",
  ]);
  const storeLocatorMentions = countMentions(bodyTextSample, [
    "winkel zoeken",
    "store locator",
    "find a store",
    "vestigingen",
    "filialen",
  ]);
  const insuranceServiceMentions = countMentions(bodyTextSample, [
    "verzekering",
    "insurance",
    "pechhulp",
    "membership",
    "lid worden",
    "roadside",
    "polis",
    "zorgverzekering",
  ]);

  const paymentSignals: string[] = [];
  if (bodyTextSample.includes("ideal")) paymentSignals.push("ideal");
  if (bodyTextSample.includes("paypal")) paymentSignals.push("paypal");
  if (bodyTextSample.includes("klarna")) paymentSignals.push("klarna");
  if (bodyTextSample.includes("creditcard") || bodyTextSample.includes("credit card")) {
    paymentSignals.push("card");
  }

  const socialProofSignals: string[] = [];
  if (bodyTextSample.includes("review") || bodyTextSample.includes("beoordeling")) {
    socialProofSignals.push("reviews");
  }
  if (bodyTextSample.includes("klant") || bodyTextSample.includes("customer")) {
    socialProofSignals.push("customers");
  }

  return {
    title: $("title").first().text().trim() || null,
    metaDescription: $("meta[name='description']").attr("content") ?? null,
    bodyTextSample,
    jsonLdProducts,
    jsonLdTypes,
    internalLinks: [...new Set(internalLinks)].slice(0, 500),
    hasCartLink,
    hasCheckoutLink,
    hasAddToCart,
    productUrlCount,
    collectionUrlCount,
    priceMatches: priceMatches.slice(0, 20),
    categoryLinkCount,
    sellerMentions,
    compareMentions,
    storeLocatorMentions,
    insuranceServiceMentions,
    ownBrandMentions: 0,
    paymentSignals,
    shippingText: extractSnippet(bodyText, ["verzending", "bezorg", "shipping"]),
    returnsText: extractSnippet(bodyText, ["retour", "terugsturen", "returns"]),
    guaranteeText: extractSnippet(bodyText, ["garantie", "guarantee"]),
    socialProofSignals,
    estimatedProductLinks: productUrlCount,
    estimatedCategoryLinks: categoryLinkCount + collectionUrlCount,
    brandNamesInText: [],
    shopRouteHits,
    productGridHints,
    localeAlternateCount: $("link[rel='alternate'][hreflang]").length,
  };
}

function countMentions(text: string, phrases: string[]): number {
  let count = 0;
  for (const phrase of phrases) {
    if (text.includes(phrase)) {
      count += 1;
    }
  }
  return count;
}

function extractSnippet(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  for (const keyword of keywords) {
    const idx = lower.indexOf(keyword);
    if (idx >= 0) {
      return text.slice(Math.max(0, idx - 20), idx + 80).trim();
    }
  }
  return null;
}
