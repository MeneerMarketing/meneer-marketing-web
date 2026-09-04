import { classifyUrlPageType, isEcommerceRoute, isSameHost } from "../../utils/urlHelpers.js";
import { crawlWebsite } from "./websiteCrawler.js";
import { extractPageSignals } from "./pageExtractor.js";
/**
 * Limited secondary crawl of ecommerce-relevant internal routes.
 * Used when homepage signals are insufficient for ecommerce detection.
 */
export async function crawlSecondaryEcommercePages(input) {
    const errors = [];
    const candidates = pickSecondaryUrls(input);
    const pages = [];
    for (const url of candidates.slice(0, input.maxPages)) {
        try {
            const crawl = await crawlWebsite(url, input.timeoutMs);
            if (crawl.status !== "success") {
                errors.push(`${url}: ${crawl.errorMessage ?? crawl.status}`);
                continue;
            }
            pages.push({
                url,
                crawl,
                signals: extractPageSignals(crawl.html, crawl.finalUrl),
            });
        }
        catch (error) {
            errors.push(`${url}: ${error instanceof Error ? error.message : "secondary crawl failed"}`);
        }
    }
    return { pages, errors };
}
function pickSecondaryUrls(input) {
    const { domain, homepageUrl, homepageSignals } = input;
    const ranked = [];
    const seen = new Set();
    const add = (url, score) => {
        try {
            const normalized = new URL(url).href.split("#")[0];
            if (!isSameHost(normalized, domain)) {
                return;
            }
            if (normalized === homepageUrl || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            ranked.push({ url: normalized, score });
        }
        catch {
            // ignore
        }
    };
    // Prefer known ecommerce path patterns from internal links
    for (const link of homepageSignals.internalLinks) {
        const type = classifyUrlPageType(link);
        if (type === "PRODUCT") {
            add(link, 90);
        }
        else if (type === "COLLECTION") {
            add(link, 80);
        }
        else if (type === "CATEGORY") {
            add(link, 75);
        }
        else if (isEcommerceRoute(link)) {
            add(link, 60);
        }
    }
    // Common Dutch ecommerce probe paths if links were scarce
    const probes = [
        "/shop/",
        "/webwinkel/",
        "/winkel/",
        "/products/",
        "/collections/",
        "/categorie/",
        "/category/",
        "/cart",
        "/checkout",
    ];
    for (const path of probes) {
        try {
            const url = new URL(path, homepageUrl).href;
            add(url, 40);
        }
        catch {
            // ignore
        }
    }
    ranked.sort((a, b) => b.score - a.score);
    return ranked.map((r) => r.url);
}
//# sourceMappingURL=secondaryCrawl.js.map