export type DomainMatchStatus = "MATCH" | "SELLER_DOMAIN_MATCH" | "REDIRECT_MISMATCH" | "NO_BRAND_DOMAIN" | "NO_FINAL_DOMAIN" | "MISMATCH";
export type DomainValidationResult = {
    status: DomainMatchStatus;
    brandDomain: string | null;
    sellerDomain: string | null;
    finalDomain: string | null;
    advertisedDomain: string | null;
    issues: string[];
    ok: boolean;
};
/**
 * Shopping ad URL must belong to the seller/brand domain.
 * Mismatch → do not auto-link as CRO target.
 */
export declare function validateShoppingDomainMatch(input: {
    brandNormalizedDomain: string | null;
    advertisedDomain: string | null;
    sellerName: string | null;
    finalUrl: string | null;
    adUrlRedirects: string[];
}): DomainValidationResult;
//# sourceMappingURL=domainValidation.d.ts.map