/**
 * Milestone 9.3.4 — deterministic preselection of the new M9.3.3 prospects.
 *
 * Runs before any Claude call. Everything here comes from the cheap discovery
 * signals, so ranking sixteen prospects costs nothing. The goal is not to find
 * the worst page: it is to find a strong business whose page is the weak part.
 */
export interface NewProspectRecord {
    domain: string;
    siteUrl: string;
    branch: string;
    branchLabel: string;
    sourceKeyword: string | null;
    allKeywords: string[];
    familyId: string;
    familyLabel: string;
    platform: string | null;
    businessType: string | null;
    commerceModel: string | null;
    estimatedCatalogSize: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    catalogEvidence: string[];
    retailerBreadthScore: number | null;
    internationalPresenceScore: number | null;
    ownBrandSignal: number | null;
    ownBrandEvidence: string[];
    googleAdsEvidence: {
        keywords: string[];
        landingUrls: string[];
        sellerResolution: string | null;
    };
    heroProduct: string | null;
    heroProductUrl: string | null;
    heroPrice: number | null;
    heroCurrency: string | null;
    additionalHeroes: Array<{
        title: string;
        url: string | null;
        price: number | null;
    }>;
    assetReadinessProxy: number | null;
    deepDivePdpFitProxy: number | null;
    currentPdpWeaknessProxy: number | null;
    idealProspectPreScore: number | null;
    preScoreEvidence: string[];
}
export interface PreselectionEntry {
    record: NewProspectRecord;
    rank: number;
    preselectionScore: number;
    components: Record<string, number>;
    penalties: Array<{
        reason: string;
        points: number;
    }>;
    reasons: string[];
    derivedCommerceModel: string;
    catalogBandLabel: string;
    /** The discovery run already found a real product page for this domain. */
    heroUrlFromReport: boolean;
    /** Engineering fixtures never compete for the design target. */
    excluded: boolean;
    selected: boolean;
    skipReason: string | null;
}
/**
 * A hero URL only counts when it points at an actual product page on the same
 * domain. The resolver falls back to the homepage, and auditing a homepage
 * would score the wrong page.
 */
export declare function isUsableHeroUrl(url: string | null, domain: string): boolean;
export declare function scoreNewProspect(record: NewProspectRecord): {
    score: number;
    components: Record<string, number>;
    penalties: Array<{
        reason: string;
        points: number;
    }>;
    reasons: string[];
    derivedCommerceModel: string;
    catalogBandLabel: string;
};
/**
 * Ranking only. Hero resolution and the audit limit decide which of these
 * actually reach Claude, so that a skip is backed by a real resolution attempt
 * instead of a missing field in the report.
 */
export declare function preselectNewProspects(records: NewProspectRecord[]): PreselectionEntry[];
//# sourceMappingURL=newProspectPreselection.d.ts.map