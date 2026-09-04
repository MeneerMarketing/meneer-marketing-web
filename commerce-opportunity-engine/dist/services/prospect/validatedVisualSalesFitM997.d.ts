/**
 * Milestone 9.9.7 — validated visual sales fit with compact-brand emphasis.
 */
import type { CatalogBreadthMetrics } from "./catalogBreadthScoring.js";
import type { HumanShowcaseLikelihood } from "./humanShowcaseLikelihood.js";
import type { CurrentSiteImpression, ShowcaseOwnershipClass } from "./showcaseCandidateIntegrity.js";
export declare function computeValidatedVisualSalesFitM997(input: {
    currentVisualQualityScore: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    brandOwnershipConfidence: number;
    companyScaleFit: number | null;
    redesignMaterialFeasibility: number | null;
    businessMaturityScore: number | null;
    refinedBusinessModel: ShowcaseOwnershipClass;
    currentSiteImpression: CurrentSiteImpression;
    catalogBreadth: CatalogBreadthMetrics;
    heroCandidateScore: number | null;
    humanShowcaseLikelihood: HumanShowcaseLikelihood;
}): number;
//# sourceMappingURL=validatedVisualSalesFitM997.d.ts.map