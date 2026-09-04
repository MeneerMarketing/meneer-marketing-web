/**
 * Infer advertiser domain from Google Shopping / popular_products elements.
 */
import { lookupKnownRetailerDomain } from "../config/knownRetailers.js";
const DOMAIN_IN_TEXT = /([a-z0-9][-a-z0-9]*(?:\.[a-z0-9][-a-z0-9]*)*\.(?:nl|com|eu|net|be))/i;
export function inferDomainFromSeller(seller) {
    if (!seller?.trim()) {
        return null;
    }
    const trimmed = seller.trim();
    const domainMatch = trimmed.match(DOMAIN_IN_TEXT);
    if (domainMatch) {
        return domainMatch[0].toLowerCase();
    }
    const known = lookupKnownRetailerDomain(trimmed);
    if (known) {
        return known;
    }
    return null;
}
export function inferDomainFromDescription(description) {
    if (!description?.trim()) {
        return null;
    }
    const match = description.match(DOMAIN_IN_TEXT);
    if (match) {
        return match[0].toLowerCase();
    }
    return null;
}
export function inferShoppingAdvertiserDomain(input) {
    if (input.url) {
        try {
            const host = new URL(input.url.startsWith("http") ? input.url : `https://${input.url}`).hostname.toLowerCase();
            if (host) {
                return host;
            }
        }
        catch {
            // continue
        }
    }
    const fromSeller = inferDomainFromSeller(input.seller);
    if (fromSeller) {
        return fromSeller;
    }
    return inferDomainFromDescription(input.description);
}
//# sourceMappingURL=shoppingDomainInference.js.map