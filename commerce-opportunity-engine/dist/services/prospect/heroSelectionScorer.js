/**
 * Milestone 9.6.1 — hero selection without defaulting to highest catalog price.
 */
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
    "merk",
]);
function tokenize(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 2 && !STOP_TOKENS.has(token));
}
function keywordOverlap(tokens, candidate) {
    const lower = candidate.toLowerCase();
    return tokens.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0);
}
export function scoreCatalogProductsForHero(input) {
    if (input.products.length === 0)
        return null;
    const keywordTokens = tokenize(input.discoveryKeywords.join(" "));
    const preferredTokens = tokenize(input.preferredTitle ?? "");
    const homepageUrls = new Set(input.homepageProductUrls.map((url) => url.toLowerCase()));
    let best = null;
    for (const [index, product] of input.products.entries()) {
        if (!product.handle || !product.title)
            continue;
        const url = `https://${input.domain}/products/${product.handle}`;
        const evidence = [];
        let score = 20;
        const overlapKw = keywordOverlap(keywordTokens, `${product.title} ${product.handle}`);
        if (overlapKw >= 3) {
            score += 28;
            evidence.push(`keyword_overlap:${overlapKw}`);
        }
        else if (overlapKw >= 2) {
            score += 18;
            evidence.push(`keyword_overlap:${overlapKw}`);
        }
        else if (overlapKw === 1) {
            score += 8;
        }
        const overlapPreferred = keywordOverlap(preferredTokens, product.title);
        if (overlapPreferred >= 2) {
            score += 22;
            evidence.push(`preferred_title_overlap:${overlapPreferred}`);
        }
        if (homepageUrls.has(url.toLowerCase())) {
            score += 24;
            evidence.push("homepage_product_link");
        }
        const tags = (product.tags ?? []).map((tag) => tag.toLowerCase());
        if (tags.some((tag) => /bestseller|featured|hero|flagship|popular/i.test(tag))) {
            score += 16;
            evidence.push("featured_or_bestseller_tag");
        }
        const position = product.position ?? index;
        if (position <= 2) {
            score += 10;
            evidence.push("catalog_early_position");
        }
        else if (position <= 5) {
            score += 5;
        }
        const price = product.price;
        if (price != null) {
            if (price >= 150 && price <= 750) {
                score += 12;
                evidence.push("sweet_spot_price");
            }
            else if (price >= 120) {
                score += 8;
                evidence.push("premium_price");
            }
            else if (price > 3000) {
                score -= 8;
                evidence.push("very_high_price_penalty");
            }
        }
        const confidence = Math.max(25, Math.min(95, score));
        const candidate = {
            handle: product.handle,
            title: product.title,
            price,
            url,
            score,
            confidence,
            evidence,
        };
        if (!best || candidate.score > best.score)
            best = candidate;
    }
    return best;
}
export async function loadShopifyCatalogProducts(domain, timeoutMs, crawlWebsite) {
    try {
        const feed = await crawlWebsite(`https://${domain}/products.json?limit=100`, timeoutMs);
        if (feed.status !== "success")
            return [];
        const body = feed.html.trim();
        const json = body.startsWith("{")
            ? JSON.parse(body)
            : null;
        const products = json?.products ?? [];
        return products.map((product, index) => {
            const variants = product.variants ?? [];
            const price = variants.reduce((max, variant) => {
                const value = Number(variant.price);
                if (!Number.isFinite(value) || value <= 0)
                    return max;
                return max == null || value > max ? value : max;
            }, null);
            return {
                handle: String(product.handle ?? ""),
                title: String(product.title ?? ""),
                price,
                tags: Array.isArray(product.tags)
                    ? product.tags.map((tag) => String(tag))
                    : typeof product.tags === "string"
                        ? product.tags.split(",").map((tag) => tag.trim())
                        : [],
                productType: typeof product.product_type === "string" ? product.product_type : null,
                position: index,
            };
        });
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=heroSelectionScorer.js.map