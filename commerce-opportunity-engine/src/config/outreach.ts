/**
 * Milestone 8 — Outreach eligibility + priority thresholds (configurable).
 */

export const OUTREACH_ELIGIBILITY = {
  minMmFit: 70,
  minAuditConfidence: 70,
  minSupportedFindings: 2,
  /** Opportunity score soft floor — not a hard block when sales angle is strong. */
  softMinOpportunityScore: 55,
  relevantBusinessTypes: [
    "BRAND",
    "SPECIALIST_WEBSHOP",
    "DTC",
    "MULTI_BRAND_SPECIALIST",
  ] as const,
  blockedProjectTypes: ["NOT_A_GOOD_FIT"] as const,
  minContactConfidenceForDraft: 45,
} as const;

export const OUTREACH_PRIORITY_WEIGHTS = {
  opportunityScore: 0.2,
  mmFit: 0.25,
  auditConfidence: 0.15,
  supportedFindings: 0.1,
  projectFit: 0.1,
  businessMaturity: 0.08,
  sourceReliability: 0.07,
  contactability: 0.05,
} as const;

export const OUTREACH_PROMPT_VERSION = "m8.2-human-first-v1";

export type OutreachGenerationMode = "DETERMINISTIC" | "AI_PERSONALIZED";

export type EmailType =
  | "PERSONAL_BUSINESS"
  | "GENERAL_BUSINESS"
  | "SUPPORT"
  | "SALES"
  | "INFO"
  | "PRIVACY_LEGAL"
  | "UNKNOWN";

export type ContactStatus =
  | "FOUND"
  | "NOT_FOUND"
  | "SUPPORT_ONLY"
  | "SUPPRESSED";

export type OutreachMessageStatus =
  | "NO_CONTACT"
  | "READY_FOR_DRAFT"
  | "DRAFT"
  | "DRAFT_INVALID"
  | "READY_FOR_REVIEW"
  | "APPROVED"
  | "BLOCKED"
  | "APPROVAL_REVOKED"
  | "TEST_SENT"
  | "SENT"
  | "DELIVERED"
  | "REPLIED"
  | "POSITIVE_REPLY"
  | "NEGATIVE_REPLY"
  | "BOUNCED"
  | "UNSUBSCRIBED"
  | "DO_NOT_CONTACT";

export const OUTREACH_COPY_STYLES = [
  "SOFT_OBSERVATION",
  "DIRECT_IDEA",
] as const;

export const CONTACT_PATHS = [
  "/",
  "/contact",
  "/contact-us",
  "/contacteer-ons",
  "/over-ons",
  "/about",
  "/about-us",
  "/team",
  "/klantenservice",
  "/customer-service",
  "/support",
  "/privacy",
  "/privacy-policy",
  "/algemene-voorwaarden",
  "/terms",
] as const;
