/**
 * Milestone 9.2.1 — Outreach CRO coverage expansion config.
 */
export const M921_MAX_NEW_AUDITS = 8;
/** Conservative pre-call estimate per CRO audit (Sonnet + screenshots). */
export const M921_CONSERVATIVE_AUDIT_COST = 0.038;
export const CURRENT_PDP_QUALITY_BANDS = {
    WEAK_MAX: 39,
    MODERATE_MAX: 54,
    REASONABLE_MAX: 69,
    STRONG_MAX: 84,
};
/** Penalty applied to outreach fit from current PDP quality (when AUDITED). */
export const CRO_ALREADY_STRONG_FROM_QUALITY = [
    { min: 85, penalty: 35, label: "ZEER_STERK" },
    { min: 75, penalty: 28, label: "STERK" },
    { min: 65, penalty: 14, label: "REDELIJK_PLUS" },
    { min: 0, penalty: 0, label: "TRANSFORM_ROOM" },
];
export const OUTREACH_PILOT_GATE = {
    preferAudited: true,
    minAuditConfidence: 55,
    minOutreachConfidenceWhenAudited: 62,
    minOutreachConfidenceProxyException: 78,
};
//# sourceMappingURL=outreachCroCoverage.js.map