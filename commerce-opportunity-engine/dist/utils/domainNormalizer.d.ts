/**
 * Normalizes a URL or hostname for advertiser deduplication.
 * Preserves meaningful subdomains (e.g. shop.example.nl stays shop.example.nl).
 * Strips www. prefix only; does not collapse subdomains to root domains.
 */
export interface NormalizedDomainResult {
    /** Hostname with www stripped, lowercase. */
    normalizedDomain: string;
    /** Raw hostname from URL, lowercase. */
    hostname: string;
    /** Whether www was stripped during normalization. */
    strippedWww: boolean;
}
export declare function normalizeDomainFromUrl(urlOrHost: string): NormalizedDomainResult | null;
export declare function normalizeDomainFromParts(landingUrl?: string | null, displayedUrl?: string | null, domainField?: string | null): NormalizedDomainResult | null;
//# sourceMappingURL=domainNormalizer.d.ts.map