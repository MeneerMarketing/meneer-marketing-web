/**
 * Milestone 9 — outreach strategy architecture only.
 * CONCEPT_FIRST_OUTREACH requires PREVIEW_READY + preview_url later.
 * No new mail copy in this milestone.
 */
export declare const OUTREACH_STRATEGIES: readonly ["STANDARD_OBSERVATION", "CONCEPT_FIRST_OUTREACH"];
export type OutreachStrategy = (typeof OUTREACH_STRATEGIES)[number];
export declare const CONCEPT_FIRST_OUTREACH_REQUIREMENTS: {
    readonly concept_status: "PREVIEW_READY";
    readonly preview_url_required: true;
    /** Mail copy is NOT generated until a real personal preview exists. */
    readonly mail_copy_status: "NOT_IMPLEMENTED_UNTIL_PREVIEW";
};
export declare function isConceptFirstStrategy(strategy: string | null | undefined): boolean;
//# sourceMappingURL=outreachStrategies.d.ts.map