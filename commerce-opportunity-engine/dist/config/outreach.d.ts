/**
 * Milestone 8 — Outreach eligibility + priority thresholds (configurable).
 */
export declare const OUTREACH_ELIGIBILITY: {
    readonly minMmFit: 70;
    readonly minAuditConfidence: 70;
    readonly minSupportedFindings: 2;
    /** Opportunity score soft floor — not a hard block when sales angle is strong. */
    readonly softMinOpportunityScore: 55;
    readonly relevantBusinessTypes: readonly ["BRAND", "SPECIALIST_WEBSHOP", "DTC", "MULTI_BRAND_SPECIALIST"];
    readonly blockedProjectTypes: readonly ["NOT_A_GOOD_FIT"];
    readonly minContactConfidenceForDraft: 45;
};
export declare const OUTREACH_PRIORITY_WEIGHTS: {
    readonly opportunityScore: 0.2;
    readonly mmFit: 0.25;
    readonly auditConfidence: 0.15;
    readonly supportedFindings: 0.1;
    readonly projectFit: 0.1;
    readonly businessMaturity: 0.08;
    readonly sourceReliability: 0.07;
    readonly contactability: 0.05;
};
export declare const OUTREACH_PROMPT_VERSION = "m8.2-human-first-v1";
export type OutreachGenerationMode = "DETERMINISTIC" | "AI_PERSONALIZED";
export type EmailType = "PERSONAL_BUSINESS" | "GENERAL_BUSINESS" | "SUPPORT" | "SALES" | "INFO" | "PRIVACY_LEGAL" | "UNKNOWN";
export type ContactStatus = "FOUND" | "NOT_FOUND" | "SUPPORT_ONLY" | "SUPPRESSED";
export type OutreachMessageStatus = "NO_CONTACT" | "READY_FOR_DRAFT" | "DRAFT" | "DRAFT_INVALID" | "READY_FOR_REVIEW" | "APPROVED" | "BLOCKED" | "APPROVAL_REVOKED" | "TEST_SENT" | "SENT" | "DELIVERED" | "REPLIED" | "POSITIVE_REPLY" | "NEGATIVE_REPLY" | "BOUNCED" | "UNSUBSCRIBED" | "DO_NOT_CONTACT";
export declare const OUTREACH_COPY_STYLES: readonly ["SOFT_OBSERVATION", "DIRECT_IDEA"];
export declare const CONTACT_PATHS: readonly ["/", "/contact", "/contact-us", "/contacteer-ons", "/over-ons", "/about", "/about-us", "/team", "/klantenservice", "/customer-service", "/support", "/privacy", "/privacy-policy", "/algemene-voorwaarden", "/terms"];
//# sourceMappingURL=outreach.d.ts.map