/**
 * Milestone 9.4 — company_scale_fit_score.
 *
 * Both ends of the scale are wrong for us. A hobby shop cannot pay for the
 * work and has nothing to protect; a national chain does not need it and will
 * never hand over one product page. The score peaks in the middle.
 *
 * Selling in several countries is explicitly not a retailer signal. That was
 * the M9.3.3 mistake: it excluded exactly the specialist brands we want.
 */
export interface CompanyScaleInput {
    businessType: string | null;
    isEcommerce: boolean | null;
    retailerScaleScore: number | null;
    retailerBreadthScore: number | null;
    businessMaturityScore: number | null;
    internationalPresenceScore: number | null;
    estimatedCatalogSize: number | null;
    homepageProductLinks: number;
    ownBrandSignal: number | null;
}
export interface CompanyScaleResult {
    companyScaleFitScore: number;
    band: "AMATEUR" | "SMALL_SPECIALIST" | "MID_BRAND" | "LARGE_RETAILER" | "UNKNOWN";
    evidence: string[];
}
export declare function computeCompanyScaleFit(input: CompanyScaleInput): CompanyScaleResult;
//# sourceMappingURL=companyScaleFit.d.ts.map