/**
 * Milestone 9.9.4 — validated showcase / sales lead types.
 */
import type { CurrentSiteImpression, ShowcaseOwnershipClass } from "./showcaseCandidateIntegrity.js";
import type { VisualRedesignOpportunityType } from "./visualRedesignSalesFit.js";
export type M994LeadType = "VALIDATED_SHOWCASE_PROSPECT" | "STRONG_SALES_PROSPECT" | "CRO_ONLY_OPPORTUNITY" | "REJECT";
export declare function classifyM994LeadType(input: {
    showcaseIntegrityPass: boolean;
    validatedVisualSalesFit: number;
    currentSiteImpression: CurrentSiteImpression;
    refinedBusinessModel: ShowcaseOwnershipClass;
    brandOwnershipConfidence: number;
    businessQualified: boolean;
    visualRedesignOpportunityType: VisualRedesignOpportunityType | null;
    currentVisualQualityScore: number | null;
    redesignMaterialFeasibility: number | null;
    businessModelSalesCandidate: boolean;
    visionScoreAllowed?: boolean;
    captureHealth?: string | null;
    preVisionHardReject?: boolean;
}): {
    leadType: M994LeadType;
    opportunityTier: string;
    whyNotShowcase: string | null;
};
//# sourceMappingURL=validatedShowcaseLeadClassifier.d.ts.map