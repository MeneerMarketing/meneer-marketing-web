import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchShoppingPaidListings } from "../services/dataforseo/shoppingProducts.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(scriptDir, "../../.env"), quiet: true });

async function main(): Promise<void> {
  const env = loadEnv();
  const client = createDataForSeoClient(env);
  const result = await fetchShoppingPaidListings({
    client,
    env,
    keyword: "led masker kopen",
    depth: 20,
  });

  const items = Array.isArray(result.rawResult?.items)
    ? (result.rawResult!.items as Array<Record<string, unknown>>)
    : [];

  console.log("cost", result.cost);
  console.log("item_types", result.itemTypes);
  console.log("items", items.length);
  console.log("paid extracted", result.paidItems.length);

  const byType: Record<string, number> = {};
  let aclkCount = 0;
  for (const item of items) {
    const t = String(item.type ?? "?");
    byType[t] = (byType[t] ?? 0) + 1;
    if (typeof item.shop_ad_aclk === "string" && item.shop_ad_aclk) aclkCount += 1;
  }
  console.log("type counts", byType);
  console.log("items with shop_ad_aclk", aclkCount);

  const sample = items
    .filter((i) => i.type === "google_shopping_serp")
    .slice(0, 3)
    .map((i) => ({
      type: i.type,
      title: i.title,
      seller: i.seller,
      domain: i.domain,
      url: i.url,
      shopping_url: i.shopping_url,
      price: i.price,
      currency: i.currency,
      shop_ad_aclk: i.shop_ad_aclk,
      product_id: i.product_id,
      keys: Object.keys(i),
    }));
  console.log(JSON.stringify(sample, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
