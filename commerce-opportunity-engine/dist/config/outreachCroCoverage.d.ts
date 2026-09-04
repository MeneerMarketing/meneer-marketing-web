/**
 * Milestone 9.2.1 — Outreach CRO coverage expansion config.
 */
export declare const M921_MAX_NEW_AUDITS = 8;
/** Conservative pre-call estimate per CRO audit (Sonnet + screenshots). */
export declare const M921_CONSERVATIVE_AUDIT_COST = 0.038;
export declare const CURRENT_PDP_QUALITY_BANDS: {
    readonly WEAK_MAX: 39;
    readonly MODERATE_MAX: 54;
    readonly REASONABLE_MAX: 69;
    readonly STRONG_MAX: 84;
};
/** Penalty applied to outreach fit from current PDP quality (when AUDITED). */
export declare const CRO_ALREADY_STRONG_FROM_QUALITY: readonly [{
    readonly min: 85;
    readonly penalty: 35;
    readonly label: "ZEER_STERK";
}, {
    readonly min: 75;
    readonly penalty: 28;
    readonly label: "STERK";
}, {
    readonly min: 65;
    readonly penalty: 14;
    readonly label: "REDELIJK_PLUS";
}, {
    readonly min: 0;
    readonly penalty: 0;
    readonly label: "TRANSFORM_ROOM";
}];
export declare const OUTREACH_PILOT_GATE: {
    readonly preferAudited: true;
    readonly minAuditConfidence: 55;
    readonly minOutreachConfidenceWhenAudited: 62;
    readonly minOutreachConfidenceProxyException: 78;
};
//# sourceMappingURL=outreachCroCoverage.d.ts.map