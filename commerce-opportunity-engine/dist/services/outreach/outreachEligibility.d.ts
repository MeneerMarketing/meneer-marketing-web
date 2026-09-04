export type OutreachEligibilityInput = {
    manualExcluded: boolean;
    doNotContact: boolean;
    /** Harvest/operator eligibility — EXCLUDED blocks outreach. */
    eligibilityStatus?: string | null;
    leadEligible?: boolean | null;
    businessType: string | null;
    croAuditStatus: string | null;
    auditValid: boolean;
    auditConfidence: number | null;
    supportedFindingsCount: number;
    mmFit: number | null;
    opportunityScore: number | null;
    recommendedProjectType: string | null;
    fullRebuildPotential?: number | null;
    pdpImprovementPotential?: number | null;
    websiteReachable: boolean;
    suppressed: boolean;
    firstTouchSent: boolean;
    /** Milestone 9 architecture: CONCEPT_FIRST_OUTREACH requires preview later. */
    outreachStrategy?: string | null;
    conceptStatus?: string | null;
    conceptPreviewUrl?: string | null;
};
export type OutreachEligibilityResult = {
    eligible: boolean;
    reason: string;
    blockers: string[];
};
export declare function evaluateOutreachEligibility(input: OutreachEligibilityInput): OutreachEligibilityResult;
//# sourceMappingURL=outreachEligibility.d.ts.map