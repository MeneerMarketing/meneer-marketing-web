/**
 * Milestone 9 — outreach strategy architecture only.
 * CONCEPT_FIRST_OUTREACH requires PREVIEW_READY + preview_url later.
 * No new mail copy in this milestone.
 */
export const OUTREACH_STRATEGIES = [
    "STANDARD_OBSERVATION",
    "CONCEPT_FIRST_OUTREACH",
];
export const CONCEPT_FIRST_OUTREACH_REQUIREMENTS = {
    concept_status: "PREVIEW_READY",
    preview_url_required: true,
    /** Mail copy is NOT generated until a real personal preview exists. */
    mail_copy_status: "NOT_IMPLEMENTED_UNTIL_PREVIEW",
};
export function isConceptFirstStrategy(strategy) {
    return strategy === "CONCEPT_FIRST_OUTREACH";
}
//# sourceMappingURL=outreachStrategies.js.map