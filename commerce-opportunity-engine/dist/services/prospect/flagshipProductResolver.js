/**
 * Milestone 9.4 — flagship product fallback.
 *
 * The hero resolver matches the advertised product by title. When a shop
 * advertises under a name that does not appear in its own catalog, the match
 * fails and the hero falls back to the homepage, which is useless for judging
 * a product page.
 *
 * For a high-ticket brand the most expensive product is the one the whole shop
 * is built around, so it is the honest stand-in: not the advertised product,
 * but a real product page worth looking at.
 */
import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { loadShopifyCatalogProducts, scoreCatalogProductsForHero, } from "./heroSelectionScorer.js";
/**
 * A browser renders a JSON response inside a `<pre>` block, and the crawler
 * hands back that rendered document, so the raw feed has to be dug back out.
 */
function extractJson(html) {
    const body = html.trim();
    if (body.startsWith("{"))
        return body;
    const pre = body.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    const inner = pre?.[1]?.trim();
    if (inner?.startsWith("{")) {
        return inner
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
    }
    return null;
}
const STOP_TOKENS = new Set([
    "voor",
    "van",
    "met",
    "een",
    "de",
    "het",
    "en",
    "the",
    "for",
    "and",
    "with",
    "pro",
    "plus",
]);
function tokenize(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 2 && !STOP_TOKENS.has(token));
}
export async function resolveFlagshipProduct(domain, timeoutMs, 
/** Advertised title, when known. Beats price: it points at the real hero. */
preferredTitle, homepageProductUrls, discoveryKeywords) {
    const catalog = await loadShopifyCatalogProducts(domain, timeoutMs, crawlWebsite);
    if (catalog.length > 0) {
        const scored = scoreCatalogProductsForHero({
            domain,
            products: catalog,
            discoveryKeywords: discoveryKeywords ?? [],
            homepageProductUrls: homepageProductUrls ?? [],
            preferredTitle,
        });
        if (scored) {
            return {
                url: scored.url,
                title: scored.title,
                price: scored.price,
            };
        }
    }
    try {
        const feed = await crawlWebsite(`https://${domain}/products.json?limit=100`, timeoutMs);
        if (feed.status !== "success")
            return null;
        const json = extractJson(feed.html);
        if (!json)
            return null;
        const parsed = JSON.parse(json);
        const wanted = new Set(tokenize(preferredTitle ?? ""));
        let bestByPrice = null;
        let bestByTitle = null;
        for (const product of parsed.products ?? []) {
            if (!product.handle || !product.title)
                continue;
            const price = (product.variants ?? []).reduce((max, variant) => {
                const value = Number(variant.price);
                if (!Number.isFinite(value) || value <= 0)
                    return max;
                return max == null || value > max ? value : max;
            }, null);
            if (price == null)
                continue;
            const candidate = {
                url: `https://${domain}/products/${product.handle}`,
                title: product.title,
                price,
            };
            if (!bestByPrice || (bestByPrice.price ?? 0) < price)
                bestByPrice = candidate;
            if (wanted.size > 0) {
                const overlap = tokenize(product.title).filter((token) => wanted.has(token)).length;
                if (overlap >= 2 && (!bestByTitle || bestByTitle.overlap < overlap)) {
                    bestByTitle = { product: candidate, overlap };
                }
            }
        }
        return bestByTitle?.product ?? bestByPrice;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=flagshipProductResolver.js.map