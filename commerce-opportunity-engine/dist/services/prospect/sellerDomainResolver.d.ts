/**
 * Milestone 9.3.2 — resolving shopping sellers to domains.
 *
 * Google Shopping items often carry only a seller name ("Kok Bedden"), and
 * those sellers are disproportionately the small specialists we are looking
 * for. Dropping them means measuring our parser instead of the market.
 *
 * The resolver builds candidate domains from the seller name and verifies each
 * one with a single HTTP fetch. A candidate only counts when the live page
 * actually identifies itself as that seller, so no guessed domain ever enters
 * the pipeline unverified. Costs nothing at DataForSEO.
 */
export interface SellerDomainResolution {
    seller: string;
    domain: string | null;
    method: "seller_text" | "probe_verified" | "probe_host_match" | null;
    candidatesTried: string[];
    rejectedReason: string | null;
}
export interface SellerDomainCandidate {
    domain: string;
    /** Tokens this candidate was built from, used to confirm the live page. */
    stemTokens: string[];
}
export declare function buildSellerDomainCandidates(seller: string): SellerDomainCandidate[];
export declare function resolveSellerDomain(seller: string, options: {
    timeoutMs: number;
    cache?: Map<string, SellerDomainResolution>;
}): Promise<SellerDomainResolution>;
//# sourceMappingURL=sellerDomainResolver.d.ts.map