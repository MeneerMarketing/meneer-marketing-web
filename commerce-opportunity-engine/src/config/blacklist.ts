/**
 * Advertiser blacklist for Google Ads discovery.
 * Domains and patterns listed here are excluded from lead storage.
 */

export interface AdvertiserBlacklistConfig {
  /** Exact normalized domains to exclude (lowercase, no www). */
  excludedDomains: string[];
  /**
   * Substring patterns matched against normalized domains.
   * Use sparingly; prefer exact domains when possible.
   */
  excludedDomainPatterns: string[];
}

export const advertiserBlacklist: AdvertiserBlacklistConfig = {
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

export function isBlacklistedDomain(
  normalizedDomain: string,
  config: AdvertiserBlacklistConfig = advertiserBlacklist
): boolean {
  const domain = normalizedDomain.toLowerCase();

  if (config.excludedDomains.includes(domain)) {
    return true;
  }

  return config.excludedDomainPatterns.some((pattern) => domain.includes(pattern.toLowerCase()));
}
