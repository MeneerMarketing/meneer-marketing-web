/**
 * Advertiser blacklist for Google Ads discovery.
 * Domains and patterns listed here are excluded from lead storage.
 */
export const advertiserBlacklist = {
    excludedDomains: [
        "bol.com",
        "amazon.nl",
        "amazon.com",
        "temu.com",
        "aliexpress.com",
        "zalando.nl",
        "marktplaats.nl",
        "ebay.com",
    ],
    excludedDomainPatterns: [],
};
export function isBlacklistedDomain(normalizedDomain, config = advertiserBlacklist) {
    const domain = normalizedDomain.toLowerCase();
    if (config.excludedDomains.includes(domain)) {
        return true;
    }
    return config.excludedDomainPatterns.some((pattern) => domain.includes(pattern.toLowerCase()));
}
//# sourceMappingURL=blacklist.js.map