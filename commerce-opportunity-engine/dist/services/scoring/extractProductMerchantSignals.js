import * as cheerio from "cheerio";
/**
 * Extract brand/product/shop signals from HTML (JSON-LD + meta + title).
 * Used for product_merchant_relationship — never hardcodes specific brands.
 */
export function extractProductMerchantSignals(html, url) {
    const evidence = [];
    const $ = cheerio.load(html);
    const pageTitle = $("title").first().text().replace(/\s+/g, " ").trim() || null;
    if (pageTitle)
        evidence.push("page_title");
    let productBrand = null;
    let productName = null;
    let shopName = null;
    $('script[type="application/ld+json"]').each((_, el) => {
        const raw = $(el).html();
        if (!raw)
            return;
        try {
            const parsed = JSON.parse(raw);
            const nodes = flattenJsonLd(parsed);
            for (const node of nodes) {
                const type = String(node["@type"] ?? "").toLowerCase();
                if (type.includes("product") || type.includes("productgroup")) {
                    if (!productName && typeof node.name === "string") {
                        productName = node.name.trim().slice(0, 200);
                        evidence.push("jsonld_product_name");
                    }
                    const brand = node.brand;
                    if (!productBrand) {
                        if (typeof brand === "string") {
                            productBrand = brand.trim().slice(0, 120);
                            evidence.push("jsonld_brand_string");
                        }
                        else if (brand && typeof brand === "object") {
                            const brandObj = brand;
                            if (typeof brandObj.name === "string") {
                                productBrand = brandObj.name.trim().slice(0, 120);
                                evidence.push("jsonld_brand_object");
                            }
                        }
                    }
                }
                if (!shopName &&
                    (type.includes("organization") || type.includes("store") || type.includes("onlinebusiness"))) {
                    if (typeof node.name === "string") {
                        shopName = node.name.trim().slice(0, 120);
                        evidence.push("jsonld_organization_name");
                    }
                }
            }
        }
        catch {
            // ignore invalid JSON-LD blocks
        }
    });
    if (!productBrand) {
        const ogBrand = $('meta[property="product:brand"]').attr("content")?.trim() ||
            $('meta[name="brand"]').attr("content")?.trim() ||
            null;
        if (ogBrand) {
            productBrand = ogBrand.slice(0, 120);
            evidence.push("meta_brand");
        }
    }
    if (!shopName) {
        const siteName = $('meta[property="og:site_name"]').attr("content")?.trim() || null;
        if (siteName) {
            shopName = siteName.slice(0, 120);
            evidence.push("og_site_name");
        }
    }
    if (!productName) {
        const h1 = $("h1").first().text().replace(/\s+/g, " ").trim();
        if (h1) {
            productName = h1.slice(0, 200);
            evidence.push("h1_product_name");
        }
    }
    // Slug fallback: /products/cerave-skin-renewing → lead token as brand hint
    if (!productBrand) {
        try {
            const path = new URL(url).pathname.toLowerCase();
            const match = path.match(/\/products?\/([a-z0-9][a-z0-9-]{2,})/i);
            if (match?.[1]) {
                const lead = match[1].split("-")[0] ?? null;
                if (lead && lead.length >= 4) {
                    productBrand = lead;
                    evidence.push("url_slug_lead_token");
                }
            }
        }
        catch {
            // ignore
        }
    }
    return { productBrand, productName, shopName, pageTitle, evidence };
}
function flattenJsonLd(value) {
    if (!value)
        return [];
    if (Array.isArray(value)) {
        return value.flatMap((item) => flattenJsonLd(item));
    }
    if (typeof value !== "object")
        return [];
    const obj = value;
    const out = [obj];
    if (Array.isArray(obj["@graph"])) {
        out.push(...flattenJsonLd(obj["@graph"]));
    }
    return out;
}
//# sourceMappingURL=extractProductMerchantSignals.js.map