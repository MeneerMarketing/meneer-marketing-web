export type OutreachPriorityInput = {
    opportunityScore: number | null;
    mmFit: number | null;
    auditConfidence: number | null;
    supportedFindingsCount: number;
    recommendedProjectType: string | null;
    businessMaturity: number | null;
    sourceQualityScore: number | null;
    contactConfidence: number | null;
    contactFound: boolean;
    pageHealthOk: boolean;
};
export declare function computeOutreachPriorityScore(input: OutreachPriorityInput): number;
//# sourceMappingURL=outreachPriority.d.ts.map