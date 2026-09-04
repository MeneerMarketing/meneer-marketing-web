/**
 * Milestone 5.4.1 — deterministic page health gate.
 * Prevents Cloudflare/error/challenge pages from becoming fake CRO gaps.
 */
export type PageHealthStatus = "HEALTHY" | "PARTIAL" | "BLOCKED" | "ERROR" | "EMPTY" | "CHALLENGE" | "UNKNOWN";
export type ScreenshotQuality = "VALID" | "PARTIAL" | "INVALID";
export type CroAuditLifecycleStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED_TECHNICAL" | "BLOCKED" | "NEEDS_RETRY" | "INVALID" | "STALE";
export interface PageHealthInput {
    html: string;
    finalUrl: string;
    httpStatus: number | null;
    captureErrors: string[];
    hasMobileScreenshot: boolean;
    hasDesktopScreenshot: boolean;
}
export interface PageHealthResult {
    status: PageHealthStatus;
    confidence: number;
    reason: string;
    evidence: Record<string, unknown>;
    screenshotQuality: ScreenshotQuality;
    /** True when Claude CRO audit is allowed. */
    allowClaudeAudit: boolean;
    /** Suggested cro_audit_status when gate fails. */
    failureAuditStatus: CroAuditLifecycleStatus | null;
    signatures: string[];
}
export declare function assessPageHealth(input: PageHealthInput): PageHealthResult;
export declare function auditConfidenceFromHealth(health: PageHealthResult, baseConfidence: number): number;
/** Map failure status to opportunity verdict when no CRO score is set. */
export declare function verdictForFailedAudit(status: CroAuditLifecycleStatus): "NEEDS_RETRY" | "NOT_AUDITED";
//# sourceMappingURL=pageHealth.d.ts.map