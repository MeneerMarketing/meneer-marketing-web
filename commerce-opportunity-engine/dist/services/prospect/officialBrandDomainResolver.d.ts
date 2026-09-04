/**
 * Milestone 9.7 — official brand domain resolution with confidence scoring.
 */
export type OfficialDomainResolution = {
    officialDomain: string | null;
    officialDomainConfidence: number;
    status: "RESOLVED" | "UNRESOLVED_BRAND_DOMAIN";
    evidence: string[];
};
export declare function resolveOfficialBrandDomainWithConfidence(input: {
    productBrand: string;
    productModel?: string | null;
    productTitle?: string | null;
    timeoutMs: number;
}): Promise<OfficialDomainResolution>;
//# sourceMappingURL=officialBrandDomainResolver.d.ts.map