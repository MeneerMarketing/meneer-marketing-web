import { type ProductMerchantRelationship, type RecommendedProjectType } from "../../config/commercialFit.js";
export interface ProjectTypeInput {
    platform: string | null;
    platformCandidate: string | null;
    businessType: string | null;
    productRelationship: ProductMerchantRelationship;
    fullRebuildPotential: number | null;
    pdpImprovementPotential: number | null;
    mmFitScore: number;
    manualExcluded: boolean;
    retailerScale: number | null;
}
export interface ProjectTypeResult {
    projectType: RecommendedProjectType;
    reason: string;
}
export declare function recommendProjectType(input: ProjectTypeInput): ProjectTypeResult;
export declare function buildInternalSalesAngle(input: {
    domain: string;
    platform: string | null;
    productRelationship: ProductMerchantRelationship;
    projectType: RecommendedProjectType;
    pdpPotential: number | null;
    fullRebuildPotential: number | null;
    aiSalesAngle: string | null;
    confirmedAdvertiser: boolean;
}): string;
//# sourceMappingURL=projectType.d.ts.map