import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export type ShoppingPaidItemType =
  | "google_shopping_paid"
  | "google_shopping_sponsored_carousel_element"
  | "google_shopping_serp";

export type ShoppingPaidListing = {
  itemType: ShoppingPaidItemType;
  keyword: string;
  title: string | null;
  description: string | null;
  seller: string | null;
  domain: string | null;
  price: number | null;
  currency: string | null;
  rankGroup: number | null;
  rankAbsolute: number | null;
  shopAdAclk: string | null;
  /** Deprecated by DataForSEO; may still appear in some responses */
  url: string | null;
  productId: string | null;
  dataDocid: string | null;
  raw: Record<string, unknown>;
};

export type ShoppingProductsResult = {
  keyword: string;
  taskId: string;
  cost: number;
  itemTypes: string[];
  itemsCount: number;
  paidItems: ShoppingPaidListing[];
  rawResult: Record<string, unknown> | null;
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

function parsePaidItem(
  keyword: string,
  item: Record<string, unknown>,
  itemType: ShoppingPaidItemType
): ShoppingPaidListing {
  return {
    itemType,
    keyword,
    title: asString(item.title),
    description: asString(item.description),
    seller: asString(item.seller),
    domain: asString(item.domain),
    price: asNumber(item.price),
    currency: asString(item.currency),
    rankGroup: asNumber(item.rank_group),
    rankAbsolute: asNumber(item.rank_absolute),
    shopAdAclk: asString(item.shop_ad_aclk),
    url: asString(item.url),
    productId: asString(item.product_id),
    dataDocid: asString(item.data_docid),
    raw: item,
  };
}

/**
 * Extract explicit paid Shopping evidence from Merchant Products results.
 *
 * - google_shopping_paid: always include (classic Shopping text ads)
 * - google_shopping_sponsored_carousel_element: sponsored = paid
 * - google_shopping_serp: ONLY when shop_ad_aclk is present (resolvable seller ad URL).
 *   Without aclk these are product cards without paid-URL proof.
 *
 * Never treat organic SERP popular_products as Shopping paid.
 */
export function extractPaidShoppingListings(
  keyword: string,
  items: unknown[]
): ShoppingPaidListing[] {
  const out: ShoppingPaidListing[] = [];

  for (const raw of items) {
    const item = asRecord(raw);
    if (!item) continue;
    const type = asString(item.type);
    if (!type) continue;

    if (type === "google_shopping_paid") {
      out.push(parsePaidItem(keyword, item, "google_shopping_paid"));
      continue;
    }

    if (type === "google_shopping_serp") {
      // Merchant product cards. NL often has seller+product_id but null shop_ad_aclk/url.
      // Include when we have product_id (Sellers resolve) or shop_ad_aclk (Ad URL resolve).
      if (asString(item.shop_ad_aclk) || asString(item.product_id)) {
        out.push(parsePaidItem(keyword, item, "google_shopping_serp"));
      }
      continue;
    }

    if (type === "google_shopping_sponsored_carousel") {
      const nested = Array.isArray(item.items) ? item.items : [];
      for (const child of nested) {
        const el = asRecord(child);
        if (!el) continue;
        const childType = asString(el.type);
        if (childType === "google_shopping_sponsored_carousel_element") {
          out.push(
            parsePaidItem(keyword, el, "google_shopping_sponsored_carousel_element")
          );
        }
      }
    }
  }

  return out;
}

async function postShoppingProductsTask(input: {
  client: AxiosInstance;
  env: Env;
  keyword: string;
  depth: number;
}): Promise<{ taskId: string; cost: number }> {
  const body = [
    {
      keyword: input.keyword,
      location_code: input.env.GOOGLE_SERP_LOCATION_CODE,
      language_code: input.env.GOOGLE_SERP_LANGUAGE_CODE,
      se_domain: input.env.GOOGLE_SERP_SE_DOMAIN,
      depth: input.depth,
      priority: input.env.SHOPPING_GROUND_TRUTH_PRIORITY,
      tag: `shopping_gt_${input.keyword.slice(0, 40)}`,
    },
  ];

  logger.info("DataForSEO Merchant products task_post", {
    keyword: input.keyword,
    depth: input.depth,
    location: input.env.GOOGLE_SERP_LOCATION_CODE,
    language: input.env.GOOGLE_SERP_LANGUAGE_CODE,
    priority: input.env.SHOPPING_GROUND_TRUTH_PRIORITY,
  });

  const response = await input.client.post<DfsEnvelope>(
    "/merchant/google/products/task_post",
    body,
    { timeout: 60000 }
  );

  const data = response.data;
  const task = data.tasks?.[0];
  const cost = task?.cost ?? data.cost ?? 0;

  if (data.status_code && data.status_code !== 20000) {
    throw new Error(
      `Shopping products task_post failed: ${data.status_message ?? data.status_code}`
    );
  }
  if (task?.status_code && task.status_code !== 20000 && task.status_code !== 20100) {
    throw new Error(
      `Shopping products task_post task error: ${task.status_message ?? task.status_code}`
    );
  }
  if (!task?.id) {
    throw new Error("Shopping products task_post returned no task id");
  }

  return { taskId: task.id, cost };
}

async function getShoppingProductsAdvanced(
  client: AxiosInstance,
  taskId: string
): Promise<{ ready: boolean; cost: number; result: Record<string, unknown> | null }> {
  const response = await client.get<DfsEnvelope>(
    `/merchant/google/products/task_get/advanced/${taskId}`,
    { timeout: 60000 }
  );

  const data = response.data;
  const task = data.tasks?.[0];
  const cost = task?.cost ?? data.cost ?? 0;
  const status = task?.status_code ?? data.status_code;

  // 20000 = Ok, 20100 = Task Created, 40601/40602 = still in queue / not ready
  if (status === 20000) {
    return {
      ready: true,
      cost,
      result: (task?.result?.[0] as Record<string, unknown> | undefined) ?? null,
    };
  }

  if (status === 20100 || status === 40601 || status === 40602) {
    return { ready: false, cost, result: null };
  }

  throw new Error(
    `Shopping products task_get failed: ${task?.status_message ?? data.status_message ?? status}`
  );
}

/**
 * DataForSEO Merchant Google Shopping Products (Standard POST + GET).
 * @see https://docs.dataforseo.com/v3/merchant/google/products/task_post/
 */
export async function fetchShoppingPaidListings(input: {
  client: AxiosInstance;
  env: Env;
  keyword: string;
  depth: number;
  maxWaitMs?: number;
}): Promise<ShoppingProductsResult> {
  const posted = await postShoppingProductsTask({
    client: input.client,
    env: input.env,
    keyword: input.keyword,
    depth: input.depth,
  });

  let totalCost = posted.cost;
  const maxWait = input.maxWaitMs ?? 180_000;
  const started = Date.now();
  let result: Record<string, unknown> | null = null;

  while (Date.now() - started < maxWait) {
    await sleep(3000);
    const got = await getShoppingProductsAdvanced(input.client, posted.taskId);
    totalCost += got.cost;
    if (got.ready) {
      result = got.result;
      break;
    }
    logger.info("Waiting for Shopping products task", {
      taskId: posted.taskId,
      elapsedMs: Date.now() - started,
    });
  }

  if (!result) {
    throw new Error(
      `Shopping products task ${posted.taskId} not ready within ${maxWait}ms (cost so far $${totalCost})`
    );
  }

  const items = Array.isArray(result.items) ? result.items : [];
  const itemTypes = Array.isArray(result.item_types)
    ? result.item_types.filter((t): t is string => typeof t === "string")
    : [];
  const paidItems = extractPaidShoppingListings(input.keyword, items);

  logger.info("DataForSEO Merchant products response", {
    keyword: input.keyword,
    cost: totalCost,
    itemsCount: items.length,
    itemTypes,
    paidItems: paidItems.length,
    withAclk: paidItems.filter((p) => p.shopAdAclk).length,
  });

  return {
    keyword: input.keyword,
    taskId: posted.taskId,
    cost: totalCost,
    itemTypes,
    itemsCount: items.length,
    paidItems,
    rawResult: result,
  };
}
