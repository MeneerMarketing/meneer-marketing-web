import { logger } from "../../utils/logger.js";
import { normalizeDomainFromUrl } from "../../utils/domainNormalizer.js";
/**
 * Resolve seller landing URL from shop_ad_aclk.
 * @see https://docs.dataforseo.com/v3/merchant/google/sellers/ad_url/
 */
export async function resolveShoppingAdUrl(input) {
    const encoded = encodeURIComponent(input.shopAdAclk);
    const path = `/merchant/google/sellers/ad_url/${encoded}`;
    logger.info("DataForSEO Shopping sellers ad_url", {
        shopAdAclk: input.shopAdAclk.slice(0, 24) + "…",
    });
    const response = await input.client.get(path, { timeout: 30000 });
    const data = response.data;
    const task = data.tasks?.[0];
    const cost = task?.cost ?? data.cost ?? 0;
    if (data.status_code && data.status_code !== 20000) {
        throw new Error(`Shopping ad_url failed: ${data.status_message ?? data.status_code} (cost $${cost})`);
    }
    if (task?.status_code && task.status_code !== 20000) {
        throw new Error(`Shopping ad_url task error: ${task.status_message ?? task.status_code} (cost $${cost})`);
    }
    const row = task?.result?.[0] ?? null;
    const adUrl = row?.ad_url?.trim() || null;
    const redirects = Array.isArray(row?.ad_url_redirects)
        ? row.ad_url_redirects.filter((u) => typeof u === "string" && Boolean(u.trim()))
        : [];
    // Prefer last redirect hop that looks like a merchant page; else ad_url itself.
    const finalUrl = [...redirects].reverse().find((u) => {
        try {
            const host = new URL(u).hostname.toLowerCase();
            return (!host.includes("google.") &&
                !host.includes("doubleclick.") &&
                !host.includes("dartsearch.") &&
                !host.includes("g.doubleclick"));
        }
        catch {
            return false;
        }
    }) ?? adUrl;
    const finalDomain = finalUrl
        ? normalizeDomainFromUrl(finalUrl)?.normalizedDomain ?? null
        : null;
    return {
        shopAdAclk: input.shopAdAclk,
        adUrl,
        adUrlRedirects: redirects,
        finalUrl,
        finalDomain,
        cost,
        raw: row ? row : null,
    };
}
//# sourceMappingURL=shoppingAdUrl.js.map