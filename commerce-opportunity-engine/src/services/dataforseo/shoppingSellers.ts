import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { normalizeDomainFromUrl } from "../../utils/domainNormalizer.js";

export type ShoppingSellerOffer = {
  sellerName: string | null;
  domain: string | null;
  url: string | null;
  title: string | null;
  details: string | null;
  price: number | null;
  totalPrice: number | null;
  currency: string | null;
  shopAdAclk: string | null;
  productAvailability: string | null;
  raw: Record<string, unknown>;
};

export type ShoppingSellersResult = {
  productId: string;
  cost: number;
  offers: ShoppingSellerOffer[];
};

type DfsEnvelope = {
  status_code?: number;
  status_message?: string;
  cost?: number;
  tasks?: Array<{
    id?: string;
    status_code?: number;
    status_message?: string;
    cost?: number;
    result?: Array<Record<string, unknown>>;
  }>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Google Shopping Sellers — exact merchant offers + product URLs for a product_id.
 * @see https://docs.dataforseo.com/v3/merchant/google/sellers/task_post/
 */
export async function fetchShoppingSellers(input: {
  client: AxiosInstance;
  env: Env;
  keyword: string;
  productId: string;
  depth?: number;
  maxWaitMs?: number;
}): Promise<ShoppingSellersResult> {
  const body = [
    {
      keyword: input.keyword,
      product_id: input.productId,
      location_code: input.env.GOOGLE_SERP_LOCATION_CODE,
      language_code: input.env.GOOGLE_SERP_LANGUAGE_CODE,
      se_domain: input.env.GOOGLE_SERP_SE_DOMAIN,
      depth: input.depth ?? 10,
      priority: input.env.SHOPPING_GROUND_TRUTH_PRIORITY,
      tag: `shopping_sellers_${input.productId.slice(0, 24)}`,
    },
  ];

  logger.info("DataForSEO Merchant sellers task_post", {
    keyword: input.keyword,
    productId: input.productId,
  });

  const post = await input.client.post<DfsEnvelope>(
    "/merchant/google/sellers/task_post",
    body,
    { timeout: 60000 }
  );

  const task = post.data.tasks?.[0];
  let totalCost = task?.cost ?? post.data.cost ?? 0;
  if (!task?.id) {
    throw new Error("Shopping sellers task_post returned no task id");
  }
  if (post.data.status_code && post.data.status_code !== 20000) {
    throw new Error(
      `Shopping sellers task_post failed: ${post.data.status_message ?? post.data.status_code}`
    );
  }

  const maxWait = input.maxWaitMs ?? 120_000;
  const started = Date.now();
  let result: Record<string, unknown> | null = null;

  while (Date.now() - started < maxWait) {
    await sleep(2500);
    const get = await input.client.get<DfsEnvelope>(
      `/merchant/google/sellers/task_get/advanced/${task.id}`,
      { timeout: 60000 }
    );
    const t = get.data.tasks?.[0];
    totalCost += t?.cost ?? get.data.cost ?? 0;
    const status = t?.status_code ?? get.data.status_code;
    if (status === 20000) {
      result = (t?.result?.[0] as Record<string, unknown> | undefined) ?? null;
      break;
    }
    if (status !== 20100 && status !== 40601 && status !== 40602) {
      throw new Error(
        `Shopping sellers task_get failed: ${t?.status_message ?? get.data.status_message ?? status}`
      );
    }
  }

  if (!result) {
    throw new Error(`Shopping sellers task ${task.id} not ready (cost $${totalCost})`);
  }

  const items = Array.isArray(result.items) ? result.items : [];
  const offers: ShoppingSellerOffer[] = [];

  for (const raw of items) {
    const item = asRecord(raw);
    if (!item) continue;
    if (asString(item.type) !== "shops_list") continue;

    const domainRaw = asString(item.domain);
    const url = asString(item.url);
    offers.push({
      sellerName: asString(item.seller_name) ?? asString(item.title),
      domain: domainRaw
        ? normalizeDomainFromUrl(domainRaw)?.normalizedDomain ?? domainRaw
        : url
          ? normalizeDomainFromUrl(url)?.normalizedDomain ?? null
          : null,
      url,
      title: asString(item.title),
      details: asString(item.details),
      price: asNumber(item.base_price),
      totalPrice: asNumber(item.total_price),
      currency: asString(item.currency),
      shopAdAclk: asString(item.shop_ad_aclk),
      productAvailability: asString(item.product_availability),
      raw: item,
    });
  }

  logger.info("DataForSEO Merchant sellers response", {
    productId: input.productId,
    cost: totalCost,
    offers: offers.length,
    withUrl: offers.filter((o) => o.url).length,
  });

  return { productId: input.productId, cost: totalCost, offers };
}

export function pickMatchingSellerOffer(
  offers: ShoppingSellerOffer[],
  preferredSeller: string | null
): ShoppingSellerOffer | null {
  const withUrl = offers.filter((o) => o.url && o.domain);
  if (withUrl.length === 0) return null;

  const preferred = (preferredSeller ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (preferred) {
    const hit = withUrl.find((o) => {
      const name = (o.sellerName ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
      const domainTok = (o.domain ?? "").split(".")[0] ?? "";
      return (
        name.includes(preferred) ||
        preferred.includes(name) ||
        preferred.includes(domainTok) ||
        domainTok.includes(preferred.replace(/nl$/, ""))
      );
    });
    if (hit) return hit;
  }

  // No random first-offer fallback when a preferred seller was expected but missing.
  if (preferredSeller) return null;
  return withUrl[0] ?? null;
}

/**
 * Pick seller offer that hard-matches the known brand domain.
 * Never returns a URL on a different domain.
 */
export function pickSellerOfferForBrandDomain(
  offers: ShoppingSellerOffer[],
  brandNormalizedDomain: string
): ShoppingSellerOffer | null {
  const brand = brandNormalizedDomain.toLowerCase().replace(/^www\./, "");
  const withUrl = offers.filter((o) => o.url && o.domain);
  const sameDomain = (a: string, b: string) =>
    a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);

  return (
    withUrl.find((o) => {
      const d = (o.domain ?? "").toLowerCase().replace(/^www\./, "");
      return sameDomain(d, brand);
    }) ?? null
  );
}
