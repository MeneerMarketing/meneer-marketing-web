import { normalizeDomainFromUrl } from "../../utils/domainNormalizer.js";
function normalizeSellerToken(value) {
    return (value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .trim();
}
/**
 * Shopping ad URL must belong to the seller/brand domain.
 * Mismatch → do not auto-link as CRO target.
 */
export function validateShoppingDomainMatch(input) {
    const issues = [];
    const brandDomain = input.brandNormalizedDomain
        ? normalizeDomainFromUrl(input.brandNormalizedDomain)?.normalizedDomain ??
            input.brandNormalizedDomain.toLowerCase().replace(/^www\./, "")
        : null;
    const advertisedDomain = input.advertisedDomain
        ? normalizeDomainFromUrl(input.advertisedDomain)?.normalizedDomain ?? null
        : null;
    const finalDomain = input.finalUrl
        ? normalizeDomainFromUrl(input.finalUrl)?.normalizedDomain ?? null
        : null;
    const sellerDomain = advertisedDomain;
    if (!finalDomain) {
        issues.push("missing_final_domain");
        return {
            status: "NO_FINAL_DOMAIN",
            brandDomain,
            sellerDomain,
            finalDomain,
            advertisedDomain,
            issues,
            ok: false,
        };
    }
    if (!brandDomain) {
        issues.push("missing_brand_domain");
        return {
            status: "NO_BRAND_DOMAIN",
            brandDomain,
            sellerDomain,
            finalDomain,
            advertisedDomain,
            issues,
            ok: false,
        };
    }
    const sameDomain = (a, b) => a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
    if (sameDomain(finalDomain, brandDomain)) {
        return {
            status: "MATCH",
            brandDomain,
            sellerDomain,
            finalDomain,
            advertisedDomain,
            issues,
            ok: true,
        };
    }
    if (advertisedDomain && sameDomain(advertisedDomain, brandDomain)) {
        // Advertised domain matches brand but final redirect went elsewhere
        issues.push("final_domain_differs_from_brand_after_redirect");
        return {
            status: "REDIRECT_MISMATCH",
            brandDomain,
            sellerDomain,
            finalDomain,
            advertisedDomain,
            issues,
            ok: false,
        };
    }
    // Soft seller-name overlap with brand domain token (e.g. CurrentBody ↔ currentbody.nl)
    const sellerTok = normalizeSellerToken(input.sellerName);
    const brandTok = normalizeSellerToken(brandDomain.split(".")[0] ?? "");
    if (sellerTok && brandTok && (sellerTok.includes(brandTok) || brandTok.includes(sellerTok))) {
        if (advertisedDomain && sameDomain(finalDomain, advertisedDomain)) {
            return {
                status: "SELLER_DOMAIN_MATCH",
                brandDomain,
                sellerDomain,
                finalDomain,
                advertisedDomain,
                issues: [...issues, "matched_via_seller_name_and_advertised_domain"],
                ok: true,
            };
        }
    }
    issues.push(`domain_mismatch:brand=${brandDomain};final=${finalDomain};advertised=${advertisedDomain ?? "n/a"}`);
    return {
        status: "MISMATCH",
        brandDomain,
        sellerDomain,
        finalDomain,
        advertisedDomain,
        issues,
        ok: false,
    };
}
//# sourceMappingURL=domainValidation.js.map