/**
 * Milestone 9.9.3 — showcase sales candidate integrity (entity, ownership, cross-domain).
 */
import type { BusinessModelClass } from "./businessModelClassifier.js";
export type ShowcaseOwnershipClass = BusinessModelClass | "FOCUSED_PRIVATE_LABEL_BRAND" | "MANUFACTURER_DTC";
export type ShowcasePageEntityType = "PRODUCT_DETAIL" | "CATEGORY" | "COLLECTION" | "PRODUCT_LISTING" | "BRAND_OVERVIEW" | "GUIDE" | "OTHER";
export type EvidenceProvenance = "MEASURED" | "INFERRED" | "DEFAULT" | "UNKNOWN";
export type CrossDomainProductMatch = "NONE" | "POSSIBLE" | "LIKELY" | "CONFIRMED";
export type SameProductVerdict = "SAME_PRODUCT" | "LIKELY_SAME_PRODUCT" | "DIFFERENT_PRODUCT" | "INSUFFICIENT_EVIDENCE";
export type CurrentSiteImpression = "CLEARLY_UNDERDESIGNED" | "BASIC_BUT_ACCEPTABLE" | "MODERN_ENOUGH" | "PREMIUM";
export interface FieldWithProvenance<T> {
    value: T;
    provenance: EvidenceProvenance;
}
export interface ProductIdentityFingerprint {
    domain: string;
    productUrl: string;
    normalizedTitle: string;
    productBrand: string | null;
    sku: string | null;
    gtin: string | null;
    manufacturer: string | null;
    primaryImageUrl: string | null;
    descriptionSnippet: string | null;
}
export declare function extractProductIdentityFingerprint(html: string, productUrl: string, domain: string, productTitle: string | null): ProductIdentityFingerprint;
export declare function hardenShowcasePageEntity(input: {
    productUrl: string;
    domain: string;
    html: string;
    productTitle: string | null;
    observedPrice: number | null;
}): {
    pageEntityType: ShowcasePageEntityType;
    isValidProductDetail: boolean;
    rejectReason: string | null;
    evidence: string[];
};
export declare function compareProductIdentity(a: ProductIdentityFingerprint, b: ProductIdentityFingerprint): {
    verdict: SameProductVerdict;
    similarity: number;
    evidence: string[];
};
export declare function assessCrossDomainMatches(fingerprints: ProductIdentityFingerprint[]): Map<string, {
    match: CrossDomainProductMatch;
    peers: string[];
    evidence: string[];
}>;
export declare function assessBrandOwnership(input: {
    domain: string;
    productTitle: string | null;
    productBrand: string | null;
    manufacturer: string | null;
    catalogEstimate: number | null;
    ownBrandSignal: number | null;
    businessModel: BusinessModelClass;
    crossDomainMatch: CrossDomainProductMatch;
    productUrl: string;
}): {
    refinedBusinessModel: ShowcaseOwnershipClass;
    brandOwnershipConfidence: number;
    brandOwnershipEvidence: string[];
    externalBrandBreadth: FieldWithProvenance<number>;
};
export declare function deriveCurrentSiteImpression(currentVisualQualityScore: number | null): CurrentSiteImpression;
export declare function computeValidatedVisualSalesFit(input: {
    currentVisualQualityScore: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    brandOwnershipConfidence: number;
    companyScaleFit: number | null;
    redesignMaterialFeasibility: number | null;
    catalogFocus: number | null;
    businessMaturityScore: number | null;
    refinedBusinessModel: ShowcaseOwnershipClass;
    currentSiteImpression: CurrentSiteImpression;
}): number;
export declare function passesShowcaseSalesCandidate(input: {
    pageEntityType: ShowcasePageEntityType;
    isValidProductDetail: boolean;
    refinedBusinessModel: ShowcaseOwnershipClass;
    brandOwnershipConfidence: number;
    businessQualified: boolean;
    companyScaleFit: number | null;
    businessMaturityScore: number | null;
    currentSiteImpression: CurrentSiteImpression;
    redesignMaterialFeasibility: number | null;
    visualRedesignOpportunityType: string | null;
    crossDomainMatch: CrossDomainProductMatch;
}): {
    pass: boolean;
    failures: string[];
};
export declare function withProvenance<T>(value: T | null | undefined, inferredDefault?: T | null): FieldWithProvenance<T | null>;
//# sourceMappingURL=showcaseCandidateIntegrity.d.ts.map