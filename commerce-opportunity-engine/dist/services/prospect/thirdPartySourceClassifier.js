/**
 * Milestone 9.7 — classify third-party discovery sources (never prospects).
 */
import { isAgencyOwnedOrManagedDomain } from "../../config/agencyDomains.js";
import { isBlacklistedDomain } from "../../config/blacklist.js";
import { M96_RETAILER_DOMAIN_HINTS } from "../../config/brandFirstHighTicket.js";
const MARKETPLACE_HINTS = [
    "bol.com",
    "amazon.",
    "coolblue",
    "mediamarkt",
    "marktplaats",
    "ebay.",
    "temu.",
    "aliexpress",
    "beslist",
    "kieskeurig",
];
const EDITORIAL_HINTS = [
    "vogue.",
    "elle.",
    "glamour.",
    "cosmopolitan.",
    "libelle.",
    "fashionchick.",
    "tweakers",
    "review",
    "kieskeurig",
];
const SOCIAL_DOMAINS = [
    "youtube.com",
    "instagram.com",
    "facebook.com",
    "tiktok.com",
    "pinterest.com",
];
export function classifyThirdPartySource(input) {
    const domain = input.normalizedDomain.toLowerCase().replace(/^www\./, "");
    if (isAgencyOwnedOrManagedDomain(domain)) {
        return {
            sourceType: "BLOCKED",
            isAllowedSource: false,
            skipReason: "agency_excluded",
            prospectFit: "LOW",
            discoverySourceQuality: "LOW",
        };
    }
    if (SOCIAL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) {
        return {
            sourceType: "BLOCKED",
            isAllowedSource: false,
            skipReason: "social_platform",
            prospectFit: "LOW",
            discoverySourceQuality: "LOW",
        };
    }
    if (input.isShoppingResult) {
        return {
            sourceType: "SHOPPING_PRODUCT_RESULT",
            isAllowedSource: true,
            skipReason: null,
            prospectFit: "LOW",
            discoverySourceQuality: "HIGH",
        };
    }
    if (MARKETPLACE_HINTS.some((hint) => domain.includes(hint))) {
        return {
            sourceType: "MARKETPLACE_PRODUCT_RESULT",
            isAllowedSource: true,
            skipReason: null,
            prospectFit: "LOW",
            discoverySourceQuality: "MEDIUM",
        };
    }
    const titleLower = (input.title ?? "").toLowerCase();
    if (/review|vergelijk|beste|top \d|roundup/i.test(titleLower)) {
        return {
            sourceType: "REVIEW_ROUNDUP_PAGE",
            isAllowedSource: true,
            skipReason: null,
            prospectFit: "LOW",
            discoverySourceQuality: "HIGH",
        };
    }
    if (EDITORIAL_HINTS.some((hint) => domain.includes(hint))) {
        return {
            sourceType: "EDITORIAL_PRODUCT_PAGE",
            isAllowedSource: true,
            skipReason: null,
            prospectFit: "LOW",
            discoverySourceQuality: "MEDIUM",
        };
    }
    if (input.likelyRetailer || M96_RETAILER_DOMAIN_HINTS.some((hint) => domain.includes(hint))) {
        const isSpecialist = /specialist|fysio|medisch|pro|shop/i.test(domain) || domain.includes("shop");
        return {
            sourceType: isSpecialist ? "SPECIALIST_RETAILER" : "MULTIBRAND_RETAILER",
            isAllowedSource: true,
            skipReason: null,
            prospectFit: "LOW",
            discoverySourceQuality: isSpecialist ? "HIGH" : "MEDIUM",
        };
    }
    if (isBlacklistedDomain(domain)) {
        return {
            sourceType: "BLOCKED",
            isAllowedSource: false,
            skipReason: "blacklist",
            prospectFit: "LOW",
            discoverySourceQuality: "LOW",
        };
    }
    return {
        sourceType: "BLOCKED",
        isAllowedSource: false,
        skipReason: "organic_first_party_skip",
        prospectFit: "LOW",
        discoverySourceQuality: "LOW",
    };
}
/** Organic SERP row that is likely the brand's own site — skip for third-party mining. */
export function isOrganicFirstPartySkip(_normalizedDomain, likelyRetailer, classification) {
    if (classification.skipReason === "organic_first_party_skip")
        return true;
    if (!likelyRetailer && classification.sourceType === "BLOCKED")
        return true;
    return false;
}
//# sourceMappingURL=thirdPartySourceClassifier.js.map