/**
 * Milestone 9.9.7 — compact brand showcase lead classification.
 */
import type { HumanShowcaseLikelihood } from "./humanShowcaseLikelihood.js";
import type { CatalogConfidence } from "./catalogBreadthScoring.js";
import type { CurrentSiteImpression, ShowcaseOwnershipClass } from "./showcaseCandidateIntegrity.js";
export type M997LeadType = "VALIDATED_SHOWCASE_PROSPECT" | "HUMAN_REVIEW_CANDIDATE" | "STRONG_SALES_PROSPECT" | "REJECT";
export declare function classifyM997LeadType(input: {
    showcaseIntegrityPass: boolean;
    validatedVisualSalesFit: number;
    humanShowcaseLikelihood: HumanShowcaseLikelihood;
    currentSiteImpression: CurrentSiteImpression;
    refinedBusinessModel: ShowcaseOwnershipClass;
    brandOwnershipConfidence: number;
    businessQualified: boolean;
    currentVisualQualityScore: number | null;
    redesignMaterialFeasibility: number | null;
    businessBreadthScore: number;
    catalogConfidence: CatalogConfidence;
    heroCandidateScore: number | null;
    visionScoreAllowed: boolean;
}): {
    leadType: M997LeadType;
    opportunityTier: string;
    whyNotShowcase: string | null;
};
export declare function passesShowcaseSalesCandidateM997(input: {
    pageEntityType: string;
    isValidProductDetail: boolean;
    refinedBusinessModel: ShowcaseOwnershipClass;
    brandOwnershipConfidence: number;
    businessQualified: boolean;
    companyScaleFit: number | null;
    businessMaturityScore: number | null;
    currentSiteImpression: CurrentSiteImpression;
    redesignMaterialFeasibility: number | null;
    businessBreadthScore: number;
    catalogConfidence: CatalogConfidence;
}): {
    pass: boolean;
    failures: string[];
};
//# sourceMappingURL=compactBrandLeadClassifier.d.ts.map