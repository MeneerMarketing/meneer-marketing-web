/**
 * Milestone 9.6 — retailer → product brand → official domain extraction.
 */
import { resolveSellerDomain } from "./sellerDomainResolver.js";
const TITLE_BRAND_PATTERNS = [
    /^([A-Z][A-Za-z0-9&+-]{2,24})\s+[-–|]/,
    /[-–|]\s*([A-Z][A-Za-z0-9&+-]{2,24})\s*$/,
    /^([A-Z][A-Za-z0-9&+-]{2,24})\s+[A-Z]/,
];
const FALSE_BRAND_TOKENS = new Set([
    "best",
    "beste",
    "low",
    "high",
    "new",
    "the",
    "werkt",
    "voorbij",
    "led",
    "betaalbaar",
    "mijn",
    "what",
    "shop",
    "webshop",
    "online",
    "premium",
    "professional",
]);
function isPlausibleProductBrand(name) {
    if (!name || name.length < 3)
        return false;
    const lower = name.toLowerCase();
    if (FALSE_BRAND_TOKENS.has(lower))
        return false;
    if (/^(nl|be|eu|com)$/i.test(lower))
        return false;
    return true;
}
export function extractProductBrandName(title) {
    if (!title?.trim())
        return null;
    const trimmed = title.trim();
    for (const pattern of TITLE_BRAND_PATTERNS) {
        const match = trimmed.match(pattern);
        const candidate = match?.[1]?.trim();
        if (candidate && candidate.length >= 3 && !/^(the|new|best)$/i.test(candidate)) {
            return candidate;
        }
    }
    const firstToken = trimmed.split(/\s+/)[0];
    if (firstToken && /^[A-Z][A-Za-z0-9'&+-]{2,}/.test(firstToken)) {
        return firstToken.replace(/['']$/g, "");
    }
    return null;
}
/** When SERP title names a product brand that does not match the merchant domain. */
export function titleSuggestsThirdPartyProduct(normalizedDomain, title) {
    const brand = extractProductBrandName(title);
    if (!isPlausibleProductBrand(brand))
        return false;
    const domainTokens = normalizedDomain
        .toLowerCase()
        .replace(/^www\./, "")
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 3);
    const brandLower = brand.toLowerCase();
    if (domainTokens.some((token) => brandLower.includes(token) || token.includes(brandLower))) {
        return false;
    }
    return true;
}
export function classifyOrganicEntitySync(input) {
    const evidence = [];
    if (!input.likelyRetailer) {
        return {
            entityRole: "OFFICIAL_BRAND_DOMAIN",
            merchantDomain: null,
            productBrandName: extractProductBrandName(input.title) ?? input.normalizedDomain,
            officialBrandDomain: input.normalizedDomain,
            evidence: ["organic_direct_brand_domain"],
        };
    }
    evidence.push("merchant_domain_detected");
    const productBrand = extractProductBrandName(input.title);
    if (!productBrand) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: null,
            officialBrandDomain: null,
            evidence: [...evidence, "no_product_brand_in_title"],
        };
    }
    if (!isPlausibleProductBrand(productBrand)) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: productBrand,
            officialBrandDomain: null,
            evidence: [...evidence, "implausible_product_brand_in_title"],
        };
    }
    const resolvedDomain = input.resolvedOfficialDomain ?? null;
    if (!resolvedDomain || resolvedDomain === input.normalizedDomain) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: productBrand,
            officialBrandDomain: null,
            evidence: [...evidence, "no_distinct_official_domain"],
        };
    }
    return {
        entityRole: "OFFICIAL_BRAND_DOMAIN",
        merchantDomain: input.normalizedDomain,
        productBrandName: productBrand,
        officialBrandDomain: resolvedDomain,
        evidence: [...evidence, `product_brand:${productBrand}`, "resolved_official_domain"],
    };
}
export async function resolveOfficialBrandDomain(brandName, timeoutMs) {
    if (!isPlausibleProductBrand(brandName)) {
        return { domain: null, evidence: ["implausible_brand_name"] };
    }
    const resolution = await resolveSellerDomain(brandName, { timeoutMs });
    if (resolution.domain) {
        return { domain: resolution.domain, evidence: [`resolved_via_${resolution.method}`] };
    }
    return { domain: null, evidence: [resolution.rejectedReason ?? "geen_official_domain"] };
}
export async function classifyOrganicEntity(input) {
    const evidence = [];
    if (!input.likelyRetailer) {
        return {
            entityRole: "OFFICIAL_BRAND_DOMAIN",
            merchantDomain: null,
            productBrandName: extractProductBrandName(input.title) ?? input.normalizedDomain,
            officialBrandDomain: input.normalizedDomain,
            evidence: ["organic_direct_brand_domain"],
        };
    }
    evidence.push("merchant_domain_detected");
    const productBrand = extractProductBrandName(input.title);
    if (!productBrand) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: null,
            officialBrandDomain: null,
            evidence: [...evidence, "no_product_brand_in_title"],
        };
    }
    if (!isPlausibleProductBrand(productBrand)) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: productBrand,
            officialBrandDomain: null,
            evidence: [...evidence, "implausible_product_brand_in_title"],
        };
    }
    const resolved = await resolveOfficialBrandDomain(productBrand, input.timeoutMs);
    if (!resolved.domain || resolved.domain === input.normalizedDomain) {
        return {
            entityRole: "MERCHANT_DOMAIN",
            merchantDomain: input.normalizedDomain,
            productBrandName: productBrand,
            officialBrandDomain: null,
            evidence: [...evidence, ...resolved.evidence],
        };
    }
    return {
        entityRole: "OFFICIAL_BRAND_DOMAIN",
        merchantDomain: input.normalizedDomain,
        productBrandName: productBrand,
        officialBrandDomain: resolved.domain,
        evidence: [...evidence, `product_brand:${productBrand}`, ...resolved.evidence],
    };
}
//# sourceMappingURL=productBrandExtractor.js.map