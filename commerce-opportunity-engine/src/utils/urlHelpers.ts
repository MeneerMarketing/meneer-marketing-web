import type { PageType } from "../types/crawler.js";

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function domainHomepage(domain: string): string {
  return `https://${domain.replace(/^www\./, "")}`;
}

export function isSameHost(url: string, domain: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    const target = domain.toLowerCase().replace(/^www\./, "");
    return host === target || host.endsWith(`.${target}`);
  } catch {
    return false;
  }
}

export function classifyUrlPageType(url: string): PageType {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();

    if (path === "/" || path === "") {
      return "HOME";
    }
    if (
      path.includes("/search") ||
      path.includes("/zoek") ||
      search.includes("q=") ||
      search.includes("s=")
    ) {
      return "SEARCH";
    }
    if (
      path.includes("/products/") ||
      path.includes("/product/") ||
      path.includes("/p/") ||
      /\/[a-z0-9-]+-\d+\.html$/i.test(path) ||
      /\/[a-z0-9-]+\/p\d+/i.test(path)
    ) {
      return "PRODUCT";
    }
    if (path.includes("/collections/") || path.includes("/collection/")) {
      return "COLLECTION";
    }
    if (
      path.includes("/category/") ||
      path.includes("/categorie/") ||
      path.includes("/categories/") ||
      path.includes("/shop/") ||
      path.includes("/webwinkel/") ||
      path.includes("/winkel/") ||
      path.includes("/c/")
    ) {
      return "CATEGORY";
    }
    if (
      path.includes("/blog") ||
      path.includes("/nieuws") ||
      path.includes("/over-ons") ||
      path.includes("/about") ||
      path.includes("/contact") ||
      path.includes("/faq") ||
      path.includes("/klantenservice")
    ) {
      return "CONTENT";
    }
    return "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

export function isEcommerceRoute(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return (
      path.includes("/products/") ||
      path.includes("/product/") ||
      path.includes("/collections/") ||
      path.includes("/category/") ||
      path.includes("/categorie/") ||
      path.includes("/shop/") ||
      path.includes("/webwinkel/") ||
      path.includes("/winkel/") ||
      path.includes("/cart") ||
      path.includes("/checkout") ||
      path.includes("/winkelwagen") ||
      path.includes("/afrekenen")
    );
  } catch {
    return false;
  }
}

export function keywordTokens(keyword: string | null): string[] {
  if (!keyword) {
    return [];
  }
  return keyword
    .toLowerCase()
    .split(/[^a-z0-9àáäâèéëêìíïîòóöôùúüûñç]+/i)
    .filter((token) => token.length > 2)
    .filter((token) => !STOP_WORDS.has(token));
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "voor",
  "van",
  "een",
  "met",
  "het",
  "de",
  "bij",
  "kopen",
  "bestel",
  "bestellen",
  "online",
  "shop",
]);

export function scoreKeywordMatch(text: string, keyword: string | null): number {
  const tokens = keywordTokens(keyword);
  if (tokens.length === 0) {
    return 0;
  }
  const lower = text.toLowerCase();
  let hits = 0;
  for (const token of tokens) {
    if (lower.includes(token)) {
      hits += 1;
    }
  }
  return hits / tokens.length;
}

export function slugifyTokens(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
