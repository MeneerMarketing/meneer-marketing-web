/**
 * Milestone 9.2 — Outreach concept fit scoring.
 * Optimizes for "where does a redesign preview create convincing contrast?"
 */
import type { BrandCommerceModel } from "../../config/conceptScoring.js";
import { type ConceptContrastResult } from "./conceptContrastPotential.js";
export type CroDataSource = "AUDITED" | "PROXY" | "MISSING";
export type OutreachScoringInput = {
    domain: string;
    brandCommerceModel: BrandCommerceModel | string;
    platform: string | null;
    businessMaturityScore: number | null;
    retailerScaleScore: number | null;
    confirmedGoogleAdvertiser: boolean;
    paidConfirmed: boolean;
    transparencyConfirmed: boolean;
    exactPaidFunnelLikely: boolean;
    pdpTransformationPotential: number | null;
    conceptAssetReadinessScore: number | null;
    catalogFocusScore: number | null;
    estimatedProductCount: number | null;
    estimatedBrandCount: number | null;
    heroProductScore: number | null;
    productCommercialSignalScore: number | null;
    primaryProductPrice: number | null;
    croQualityComposite: number | null;
    currentPdpQualityScore: number | null;
    croDataSource: CroDataSource;
    auditConfidence: number | null;
    productStorytellingQuality: number | null;
    aboveFoldQuality: number | null;
    productPresentationQuality: number | null;
    trustNearBuyblockQuality: number | null;
    /** M9.3.4 — how premium the current page already looks and reads. */
    visualDesignQuality: number | null;
    deepDiveQuality: number | null;
    /** M9.3.4 — the purchase moment and the phone, the two loudest before/after surfaces. */
    buyblockQuality?: number | null;
    mobilePurchaseQuality?: number | null;
    conversionLeakCount: number;
    strengthCount: number;
    siteTechnicallyBroken: boolean;
    mmFitScore: number | null;
    reviewCount: number | null;
    rating: number | null;
    productDescriptionLength: number;
    benefitsRichnessHint: boolean;
};
export type OutreachComponentScores = {
    pdpTransformation: number;
    currentPdpWeakness: number;
    conceptContrast: number;
    conceptAssetReadiness: number;
    catalogFocus: number;
    catalogSweetSpot: number;
    ownBrandFit: number;
    heroProductQuality: number;
    commercialSignal: number;
    googleAdsConfirmation: number;
    businessMaturity: number;
    platformFit: number;
    projectEconomicFit: number;
    deepDivePdpFit: number;
};
export type OutreachPenaltyBreakdown = {
    croAlreadyStrong: number;
    hugeCatalog: number;
    generalRetailer: number;
    resellerHeavy: number;
    weakAssets: number;
    tinyBusiness: number;
    technicalFailure: number;
    lowProductValue: number;
    decentPdpWithoutAudit: number;
    total: number;
};
export type OutreachScoringResult = {
    outreachConceptFitScore: number;
    engineeringScore: number;
    outreachScoreConfidence: number;
    croDataSource: CroDataSource;
    components: OutreachComponentScores;
    penalties: OutreachPenaltyBreakdown;
    contrast: ConceptContrastResult;
    evidence: string[];
    formula: string;
};
/** M9.3.4 — the before/after question, answered from whatever we already know. */
export declare function scoreConceptContrast(input: OutreachScoringInput): ConceptContrastResult;
export declare function scoreCatalogSweetSpot(estimatedProducts: number | null): {
    score: number;
    label: string;
};
export declare function scoreCurrentPdpWeakness(input: OutreachScoringInput): number;
export declare function scoreCroAlreadyStrongPenalty(croComposite: number | null, currentPdpQuality: number | null, croDataSource: CroDataSource): number;
export declare function scoreDeepDivePdpFit(input: OutreachScoringInput): {
    score: number;
    evidence: string[];
};
export declare function scoreProjectEconomicFit(input: OutreachScoringInput): {
    score: number;
    evidence: string[];
};
export declare function scoreGoogleAdsConfirmation(input: OutreachScoringInput): number;
export declare function computeOutreachScoreConfidence(input: OutreachScoringInput): number;
export declare function scoreOutreachConceptFit(input: OutreachScoringInput, engineeringScore: number): OutreachScoringResult;
//# sourceMappingURL=outreachScoring.d.ts.map