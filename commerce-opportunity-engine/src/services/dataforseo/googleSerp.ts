import type { AxiosInstance } from "axios";
import { readFile } from "node:fs/promises";
import type { Env } from "../../config/env.js";
import type {
  GoogleSerpFetchResult,
  OrganicSerpResult,
  PaidSearchAd,
  UnresolvedShoppingAd,
} from "../../types/discovery.js";
import { normalizeDomainFromParts } from "../../utils/domainNormalizer.js";
import { inferShoppingAdvertiserDomain } from "../../utils/shoppingDomainInference.js";
import { M96_RETAILER_DOMAIN_HINTS } from "../../config/brandFirstHighTicket.js";
import { isBlacklistedDomain } from "../../config/blacklist.js";
import { titleSuggestsThirdPartyProduct } from "../prospect/productBrandExtractor.js";
import { logger } from "../../utils/logger.js";
import { withRetry } from "../../utils/retry.js";

const SERP_LIVE_ADVANCED_PATH = "/serp/google/organic/live/advanced";

interface DataForSeoTaskResponse {
  status_code?: number;
  status_message?: string;
  cost?: number;
  tasks?: Array<{
    status_code?: number;
    status_message?: string;
    cost?: number;
    result?: Array<{
      keyword?: string;
      datetime?: string;
      items?: SerpItem[];
      item_types?: string[];
    }>;
  }>;
}

interface SerpItem {
  type?: string;
  rank_group?: number;
  rank_absolute?: number;
  title?: string;
  description?: string;
  url?: string;
  domain?: string;
  breadcrumb?: string;
  website_name?: string;
  seller?: string;
  items?: SerpItem[];
  is_paid?: boolean;
}

export interface GoogleSerpClientOptions {
  client: AxiosInstance;
  env: Env;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function pickRank(item: SerpItem, parentRank?: number | null): number | null {
  if (typeof item.rank_absolute === "number") {
    return item.rank_absolute;
  }
  if (typeof item.rank_group === "number") {
    return item.rank_group;
  }
  return parentRank ?? null;
}

function buildPaidAd(
  keyword: string,
  timestamp: string,
  fields: {
    serpItemType: string;
    headline: string | null;
    description: string | null;
    displayedUrl: string | null;
    landingUrl: string | null;
    rank: number | null;
    brandName: string | null;
    domainHint?: string | null;
    rawItem: Record<string, unknown>;
  }
): PaidSearchAd | null {
  const domainParts = normalizeDomainFromParts(
    fields.landingUrl,
    fields.displayedUrl,
    fields.domainHint
  );

  if (!domainParts) {
    return null;
  }

  return {
    keyword,
    advertiserDomain: domainParts.hostname,
    normalizedDomain: domainParts.normalizedDomain,
    headline: fields.headline,
    description: fields.description,
    displayedUrl: fields.displayedUrl,
    landingUrl: fields.landingUrl,
    rank: fields.rank,
    brandName: fields.brandName,
    timestamp,
    serpItemType: fields.serpItemType,
    rawItem: fields.rawItem,
  };
}

function extractTextPaidAds(
  keyword: string,
  items: SerpItem[] | undefined,
  timestamp: string
): PaidSearchAd[] {
  const paidAds: PaidSearchAd[] = [];

  if (!items) {
    return paidAds;
  }

  for (const item of items) {
    if (item.type !== "paid") {
      continue;
    }

    const ad = buildPaidAd(keyword, timestamp, {
      serpItemType: "paid",
      headline: item.title ?? null,
      description: item.description ?? null,
      displayedUrl: item.breadcrumb ?? null,
      landingUrl: item.url ?? null,
      rank: pickRank(item),
      brandName: item.website_name ?? null,
      domainHint: item.domain,
      rawItem: asRecord(item),
    });

    if (ad) {
      paidAds.push(ad);
    }
  }

  return paidAds;
}

function isLikelyRetailerDomain(domain: string, title: string | null): boolean {
  const lower = domain.toLowerCase();
  if (M96_RETAILER_DOMAIN_HINTS.some((hint) => lower.includes(hint))) return true;
  if (isBlacklistedDomain(lower)) return true;
  const titleLower = (title ?? "").toLowerCase();
  if (/vergelijk|kopen bij|webshop met|alle merken/i.test(titleLower)) return true;
  if (titleSuggestsThirdPartyProduct(lower, title)) return true;
  return false;
}

function extractOrganicProductResults(
  keyword: string,
  items: SerpItem[] | undefined,
  timestamp: string
): OrganicSerpResult[] {
  const results: OrganicSerpResult[] = [];
  if (!items) return results;

  for (const item of items) {
    if (item.type !== "organic") continue;
    const domainParts = normalizeDomainFromParts(item.url ?? null, item.breadcrumb ?? null, item.domain);
    if (!domainParts) continue;

    const entry: OrganicSerpResult = {
      keyword,
      title: item.title ?? null,
      description: item.description ?? null,
      url: item.url ?? null,
      normalizedDomain: domainParts.normalizedDomain,
      rank: pickRank(item),
      timestamp,
      likelyRetailer: isLikelyRetailerDomain(domainParts.normalizedDomain, item.title ?? null),
      rawItem: asRecord(item),
    };
    results.push(entry);
  }

  return results;
}

function extractShoppingPaidAds(
  keyword: string,
  items: SerpItem[] | undefined,
  timestamp: string,
  unresolvedAds: UnresolvedShoppingAd[]
): PaidSearchAd[] {
  const paidAds: PaidSearchAd[] = [];

  if (!items) {
    return paidAds;
  }

  for (const item of items) {
    if (item.type !== "popular_products" && item.type !== "shopping") {
      continue;
    }

    const childItems = item.items ?? [];
    for (const child of childItems) {
      const inferredDomain = inferShoppingAdvertiserDomain({
        seller: child.seller,
        description: child.description,
        url: child.url,
      });

      const ad = buildPaidAd(keyword, timestamp, {
        serpItemType: item.type ?? "shopping",
        headline: child.title ?? null,
        description: child.description ?? child.seller ?? null,
        displayedUrl: inferredDomain ? `https://${inferredDomain}` : null,
        landingUrl: child.url ?? null,
        rank: pickRank(child, pickRank(item)),
        brandName: child.seller ?? null,
        domainHint: inferredDomain ?? child.domain,
        rawItem: asRecord(child),
      });

      if (ad) {
        paidAds.push(ad);
        continue;
      }

      const seller = child.seller?.trim();
      if (seller && !unresolvedAds.some((entry) => entry.seller === seller)) {
        unresolvedAds.push({
          keyword,
          seller,
          headline: child.title ?? null,
          description: child.description ?? seller,
          landingUrl: child.url ?? null,
          rank: pickRank(child, pickRank(item)),
          timestamp,
          serpItemType: item.type ?? "shopping",
          rawItem: asRecord(child),
        });
      }
      logger.warn("Shopping ad skipped: domain not resolved", {
        keyword,
        seller: child.seller,
        title: child.title,
      });
    }
  }

  return paidAds;
}

function extractPaidAdsFromItems(
  keyword: string,
  items: SerpItem[] | undefined,
  timestamp: string,
  includeShopping: boolean
): {
  paidAds: PaidSearchAd[];
  shoppingAdCount: number;
  otherPaidLikeCount: number;
  unresolvedShoppingAds: UnresolvedShoppingAd[];
  organicResults: OrganicSerpResult[];
} {
  const unresolvedShoppingAds: UnresolvedShoppingAd[] = [];
  const textPaidAds = extractTextPaidAds(keyword, items, timestamp);
  const shoppingPaidAds = includeShopping
    ? extractShoppingPaidAds(keyword, items, timestamp, unresolvedShoppingAds)
    : [];
  const organicResults = extractOrganicProductResults(keyword, items, timestamp);

  let shoppingAdCount = 0;
  let otherPaidLikeCount = 0;

  if (items) {
    for (const item of items) {
      if (item.type === "shopping" || item.type === "popular_products") {
        shoppingAdCount += 1;
      } else if (item.is_paid === true && item.type !== "paid") {
        otherPaidLikeCount += 1;
      }
    }
  }

  return {
    paidAds: [...textPaidAds, ...shoppingPaidAds],
    shoppingAdCount,
    otherPaidLikeCount,
    unresolvedShoppingAds,
    organicResults,
  };
}

function parseSerpResponse(
  keyword: string,
  responseData: DataForSeoTaskResponse,
  includeShopping: boolean
): Omit<GoogleSerpFetchResult, "rawResponse"> {
  const task = responseData.tasks?.[0];
  if (!task) {
    throw new Error("DataForSEO response missing tasks array");
  }

  if (task.status_code !== 20000) {
    throw new Error(task.status_message ?? "DataForSEO task failed");
  }

  const result = task.result?.[0];
  const timestamp = result?.datetime ?? new Date().toISOString();
  const { paidAds, shoppingAdCount, otherPaidLikeCount, unresolvedShoppingAds, organicResults } =
    extractPaidAdsFromItems(keyword, result?.items, timestamp, includeShopping);

  const cost = task.cost ?? responseData.cost ?? 0;

  return {
    keyword,
    paidAds,
    shoppingAdCount,
    otherPaidLikeCount,
    unresolvedShoppingSellers: unresolvedShoppingAds.map((ad) => ad.seller),
    unresolvedShoppingAds,
    organicResults,
    cost,
  };
}

export async function fetchGooglePaidAds(
  options: GoogleSerpClientOptions,
  keyword: string,
  fetchOptions?: { depth?: number }
): Promise<GoogleSerpFetchResult> {
  const { client, env } = options;

  if (env.DATAFORSEO_SERP_FIXTURE_PATH) {
    const fixtureRaw = await readFile(env.DATAFORSEO_SERP_FIXTURE_PATH, "utf8");
    const fixtureData = JSON.parse(fixtureRaw) as DataForSeoTaskResponse;
    const parsed = parseSerpResponse(
      keyword,
      fixtureData,
      env.GOOGLE_DISCOVERY_INCLUDE_SHOPPING_ADS
    );
    return {
      ...parsed,
      cost: 0,
      rawResponse: asRecord(fixtureData),
    };
  }

  const payload = [
    {
      keyword,
      location_code: env.GOOGLE_SERP_LOCATION_CODE,
      language_code: env.GOOGLE_SERP_LANGUAGE_CODE,
      device: env.GOOGLE_SERP_DEVICE,
      os: env.GOOGLE_SERP_OS,
      se_domain: env.GOOGLE_SERP_SE_DOMAIN,
      depth: fetchOptions?.depth ?? 20,
    },
  ];

  const responseData = await withRetry(
    async () => {
      const response = await client.post<DataForSeoTaskResponse>(
        SERP_LIVE_ADVANCED_PATH,
        payload
      );

      const data = response.data;
      if (data.status_code !== undefined && data.status_code !== 20000) {
        throw new Error(data.status_message ?? "DataForSEO request failed");
      }

      return data;
    },
    { maxAttempts: 3, delayMs: 1000, backoffFactor: 2 }
  );

  const parsed = parseSerpResponse(
    keyword,
    responseData,
    env.GOOGLE_DISCOVERY_INCLUDE_SHOPPING_ADS
  );

  logger.info("DataForSEO SERP fetched", {
    keyword,
    paidAdCount: parsed.paidAds.length,
    organicCount: parsed.organicResults.length,
    textPaidCount: parsed.paidAds.filter((ad) => ad.serpItemType === "paid").length,
    shoppingPaidCount: parsed.paidAds.filter((ad) => ad.serpItemType !== "paid").length,
    cost: parsed.cost,
    shoppingBlocks: parsed.shoppingAdCount,
  });

  return {
    ...parsed,
    rawResponse: asRecord(responseData),
  };
}

export async function saveSerpFixture(
  path: string,
  responseData: Record<string, unknown>
): Promise<void> {
  const { writeFile, mkdir } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(responseData, null, 2), "utf8");
}
