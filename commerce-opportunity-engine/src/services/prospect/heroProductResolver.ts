/**
 * Milestone 9.3.3 — hero product resolution from the ad landing page.
 *
 * The product a shop pays to advertise is the product it believes in, so the
 * landing page is the first and best hero candidate. Only when a landing page
 * turns out to be a collection do we look at the products it links to. No
 * random PDP fallback: a domain without a defensible hero returns none.
 */

import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { detectPlatform } from "../crawler/platformDetector.js";
import { extractProductPageDetails } from "../crawler/productPageExtractor.js";
import { detectHeroProducts } from "../concept/heroProductDetector.js";
import {
  computeCurrentPdpWeaknessProxy,
  pdpWeaknessSignalsFromHtml,
} from "../idealProspect/pdpWeaknessProxy.js";

export interface ResolvedHero {
  title: string;
  url: string | null;
  brand: string | null;
  price: number | null;
  currency: string | null;
  heroScore: number;
  heroConfidence: number;
  evidence: string[];
  /**
   * Where the hero came from, strongest first. A product the shop pays to
   * advertise beats one that merely sits on the homepage.
   */
  source: "shopping_ad" | "paid_landing" | "landing_linked_product" | "homepage_prominent";
}

/** A product straight out of a paid placement: the shop's own bet. */
export interface AdProduct {
  title: string;
  url: string | null;
  price: number | null;
  currency: string | null;
  isShopping: boolean;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Shopping items carry the advertised product title and price. That is the
 * clearest hero signal available, and it costs nothing extra to read.
 */
export function extractAdProduct(ad: {
  headline: string | null;
  landingUrl: string | null;
  serpItemType: string;
  rawItem: Record<string, unknown>;
}): AdProduct | null {
  const isShopping = /shopping|product/i.test(ad.serpItemType);
  const raw = ad.rawItem ?? {};
  const title =
    (typeof raw.title === "string" ? raw.title : null) ?? ad.headline ?? null;
  if (!title?.trim()) return null;

  const priceBlock = (raw.price ?? null) as Record<string, unknown> | null;
  const price =
    readNumber(priceBlock?.current) ??
    readNumber(priceBlock?.value) ??
    readNumber(raw.price_current);
  const currency =
    (typeof priceBlock?.currency === "string" ? priceBlock.currency : null) ?? null;

  return {
    title: title.trim(),
    url: (typeof raw.url === "string" ? raw.url : null) ?? ad.landingUrl,
    price,
    currency,
    isShopping,
  };
}

export interface HeroResolutionResult {
  heroes: ResolvedHero[];
  /** Weakness of the strongest hero's page. High means much to gain. */
  pdpWeaknessScore: number | null;
  /** 0-100 proxy for usable imagery, copy and social proof already on the page. */
  assetReadinessProxy: number | null;
}

function looksLikeProductUrl(url: string): boolean {
  return /\/(products?|producten|artikel|p)\//i.test(url);
}

function isOnDomain(url: string, domain: string): boolean {
  try {
    return new URL(url).hostname.replace(/^www\./, "").endsWith(domain.replace(/^www\./, ""));
  } catch {
    return false;
  }
}

function titleTokens(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((word) => word.length >= 4);
}

function overlapScore(tokens: string[], candidate: string): number {
  const lower = candidate.toLowerCase();
  return tokens.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0);
}

/**
 * Shopping ads name the product but not its page. This finds that page cheaply:
 * a Shopify catalog feed if the shop has one, otherwise the product links the
 * homepage already exposes. Best token overlap with the advertised title wins,
 * and a weak match returns nothing rather than a random PDP.
 */
async function findHeroProductUrl(
  domain: string,
  heroTitle: string,
  timeoutMs: number
): Promise<string | null> {
  const tokens = titleTokens(heroTitle);
  if (tokens.length === 0) return null;

  try {
    const feed = await crawlWebsite(`https://${domain}/products.json?limit=100`, timeoutMs);
    if (feed.status === "success") {
      const body = feed.html.trim();
      const json = body.startsWith("{") ? (JSON.parse(body) as { products?: unknown[] }) : null;
      const products = (json?.products ?? []) as Array<{ handle?: string; title?: string }>;
      let best: { handle: string; score: number } | null = null;
      for (const product of products) {
        if (!product.handle || !product.title) continue;
        const score = overlapScore(tokens, `${product.title} ${product.handle}`);
        if (!best || score > best.score) best = { handle: product.handle, score };
      }
      if (best && best.score >= Math.min(2, tokens.length)) {
        return `https://${domain}/products/${best.handle}`;
      }
    }
  } catch {
    // Not a Shopify shop, or the feed is closed. The homepage still helps.
  }

  try {
    const home = await crawlWebsite(`https://${domain}`, timeoutMs);
    if (home.status !== "success") return null;
    const signals = extractPageSignals(home.html, home.finalUrl);
    let best: { url: string; score: number } | null = null;
    for (const link of signals.internalLinks) {
      if (!looksLikeProductUrl(link)) continue;
      const score = overlapScore(tokens, link);
      if (!best || score > best.score) best = { url: link, score };
    }
    if (best && best.score >= Math.min(2, tokens.length)) return best.url;
  } catch {
    // Nothing readable: the hero keeps its null weakness score.
  }

  return null;
}

function isHomepageUrl(url: string): boolean {
  try {
    return new URL(url).pathname.replace(/\/$/, "") === "";
  } catch {
    return true;
  }
}

function scoreAssetReadiness(input: {
  imageCount: number;
  bodyTextLength: number;
  hasReviews: boolean;
  hasVideo: boolean;
  hasPrice: boolean;
}): number {
  let score = 20;
  if (input.imageCount >= 12) score += 30;
  else if (input.imageCount >= 6) score += 22;
  else if (input.imageCount >= 3) score += 12;

  if (input.bodyTextLength >= 4000) score += 22;
  else if (input.bodyTextLength >= 1800) score += 14;
  else if (input.bodyTextLength >= 800) score += 7;

  if (input.hasReviews) score += 14;
  if (input.hasVideo) score += 10;
  if (input.hasPrice) score += 4;

  return Math.max(0, Math.min(100, score));
}

export async function resolveHeroProducts(input: {
  domain: string;
  landingUrls: string[];
  /** Products read straight from this shop's paid placements. */
  adProducts: AdProduct[];
  keyword: string | null;
  /** All discovery keywords tied to this domain (stronger hero matching). */
  keywords?: string[];
  timeoutMs: number;
  maxHeroes: number;
}): Promise<HeroResolutionResult> {
  // Paid landing pages first, product URLs before collection URLs. Without a
  // landing URL the homepage still shows what the shop puts forward.
  const targets = [...new Set(input.landingUrls)]
    .sort((a, b) => Number(looksLikeProductUrl(b)) - Number(looksLikeProductUrl(a)))
    .slice(0, 2);
  if (targets.length === 0) targets.push(`https://${input.domain}`);

  const candidates: Array<{
    title: string;
    url: string;
    brand: string | null;
    price: number | null;
    currency: string | null;
    reviewCount: number | null;
    rating: number | null;
    descriptionLength: number;
    imageCount: number;
    source: ResolvedHero["source"];
  }> = [];

  let bestPageWeakness: number | null = null;
  let bestAssetReadiness: number | null = null;

  for (const adProduct of input.adProducts.slice(0, input.maxHeroes)) {
    candidates.push({
      title: adProduct.title,
      url: adProduct.url ?? `https://${input.domain}`,
      brand: null,
      price: adProduct.price,
      currency: adProduct.currency,
      reviewCount: null,
      rating: null,
      descriptionLength: 0,
      imageCount: 0,
      source: adProduct.isShopping ? "shopping_ad" : "paid_landing",
    });
  }

  for (const target of targets) {
    let crawl;
    try {
      crawl = await crawlWebsite(target, input.timeoutMs);
    } catch {
      continue;
    }
    if (crawl.status !== "success") continue;

    const signals = extractPageSignals(crawl.html, crawl.finalUrl);
    const platform = detectPlatform(crawl.html, crawl.finalUrl);
    const isProductPage =
      looksLikeProductUrl(crawl.finalUrl) || signals.jsonLdTypes.includes("Product");

    if (isProductPage) {
      const details = extractProductPageDetails({
        html: crawl.html,
        productUrl: crawl.finalUrl,
        candidate: { url: crawl.finalUrl, score: 100, source: "PAID_LANDING", evidence: [] } as never,
        candidateCount: 1,
      });

      if (details.productName) {
        const imageCount = (crawl.html.match(/<img[\s>]/gi) ?? []).length;
        candidates.push({
          title: details.productName,
          url: crawl.finalUrl,
          brand: details.productBrand,
          price: details.price,
          currency: details.currency,
          reviewCount: details.reviewCount,
          rating: details.rating,
          descriptionLength: details.description?.length ?? 0,
          imageCount,
          source: "paid_landing",
        });

        const weaknessInput = pdpWeaknessSignalsFromHtml(
          crawl.html,
          crawl.finalUrl,
          platform.platform
        );
        const weakness = computeCurrentPdpWeaknessProxy({ ...weaknessInput, signals });
        if (bestPageWeakness === null) bestPageWeakness = weakness.score;
        if (bestAssetReadiness === null) {
          bestAssetReadiness = scoreAssetReadiness({
            imageCount,
            bodyTextLength: weaknessInput.bodyTextLength,
            hasReviews: weaknessInput.hasReviews,
            hasVideo: weaknessInput.videoPresent,
            hasPrice: weaknessInput.hasPrice,
          });
        }
      }
      continue;
    }

    // A collection or homepage: take the products it puts forward, since those
    // are what the shop is pushing. Structured data before raw links.
    const isHomepage = new URL(crawl.finalUrl).pathname.replace(/\/$/, "") === "";
    for (const product of signals.jsonLdProducts.slice(0, input.maxHeroes)) {
      if (!product.name) continue;
      candidates.push({
        title: product.name,
        url: product.url ?? crawl.finalUrl,
        brand: product.brand ?? null,
        price: product.price ?? null,
        currency: product.currency ?? null,
        reviewCount: null,
        rating: null,
        descriptionLength: 0,
        imageCount: 0,
        source: isHomepage ? "homepage_prominent" : "landing_linked_product",
      });
    }
  }

  if (candidates.length === 0) {
    return { heroes: [], pdpWeaknessScore: bestPageWeakness, assetReadinessProxy: bestAssetReadiness };
  }

  // The hero deserves a real page reading, so the strongest ad product gets one
  // crawl of its own when the landing pages did not already provide it.
  let heroPageUrl =
    candidates
      .map((candidate) => candidate.url)
      .find((url) => url && isOnDomain(url, input.domain) && !isHomepageUrl(url)) ?? null;

  // Shopping placements name the product but not its page, so look it up.
  if (!heroPageUrl && candidates[0]) {
    heroPageUrl = await findHeroProductUrl(input.domain, candidates[0].title, input.timeoutMs);
    if (heroPageUrl) candidates[0].url = heroPageUrl;
  }

  if (bestPageWeakness === null && heroPageUrl) {
    try {
      const crawl = await crawlWebsite(heroPageUrl, input.timeoutMs);
      if (crawl.status === "success") {
        const signals = extractPageSignals(crawl.html, crawl.finalUrl);
        const platform = detectPlatform(crawl.html, crawl.finalUrl);
        const weaknessInput = pdpWeaknessSignalsFromHtml(
          crawl.html,
          crawl.finalUrl,
          platform.platform
        );
        bestPageWeakness = computeCurrentPdpWeaknessProxy({ ...weaknessInput, signals }).score;
        bestAssetReadiness = scoreAssetReadiness({
          imageCount: (crawl.html.match(/<img[\s>]/gi) ?? []).length,
          bodyTextLength: weaknessInput.bodyTextLength,
          hasReviews: weaknessInput.hasReviews,
          hasVideo: weaknessInput.videoPresent,
          hasPrice: weaknessInput.hasPrice,
        });
      }
    } catch {
      // A hero without a readable page keeps its null weakness score.
    }
  }

  const detection = detectHeroProducts(
    candidates.map((candidate) => ({
      productTitle: candidate.title,
      productUrl: candidate.url,
      productBrand: candidate.brand,
      price: candidate.price,
      currency: candidate.currency,
      reviewCount: candidate.reviewCount,
      rating: candidate.rating,
      availability: null,
      adHeadline: null,
      keyword: input.keyword,
      keywords: input.keywords ?? (input.keyword ? [input.keyword] : []),
      paidConfirmed: candidate.source === "shopping_ad" || candidate.source === "paid_landing",
      isResolvedPage: candidate.source === "paid_landing",
      hasScreenshots: false,
      descriptionLength: candidate.descriptionLength,
      imageCountEstimate: candidate.imageCount,
    }))
  );

  const bySource = new Map(candidates.map((candidate) => [candidate.title, candidate.source]));

  return {
    heroes: detection.candidates.slice(0, input.maxHeroes).map((hero) => ({
      title: hero.product_title,
      url: hero.product_url,
      brand: hero.product_brand,
      price: hero.price,
      currency: hero.currency,
      heroScore: hero.hero_product_score,
      heroConfidence: hero.hero_product_confidence,
      evidence: hero.hero_product_evidence,
      source: bySource.get(hero.product_title) ?? "landing_linked_product",
    })),
    pdpWeaknessScore: bestPageWeakness,
    assetReadinessProxy: bestAssetReadiness,
  };
}
