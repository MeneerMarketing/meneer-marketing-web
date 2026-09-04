/**
 * Milestone 8.1.1 — structured allowed claims with evidence scope.
 * Claude may only use these facts; never expand beyond scope.
 */
export declare const EVIDENCE_SCOPES: readonly ["PAGE_SPECIFIC", "MULTI_PAGE", "SITE_WIDE", "BRAND_LEVEL"];
export type EvidenceScope = (typeof EVIDENCE_SCOPES)[number];
export type AllowedClaimType = "OBSERVATION" | "STRENGTH" | "CONTEXT";
export type AllowedClaim = {
    id: string;
    type: AllowedClaimType;
    scope: EvidenceScope;
    page_url: string | null;
    product_name: string | null;
    subject: string;
    source_title: string;
    allowed_fact: string;
    /** Ready-to-use Dutch sentence for deterministic assembler (PAGE_SPECIFIC safe). */
    external_sentence_nl: string;
    forbidden_expansions: string[];
    evidence_excerpt: string;
    validation_status: string;
};
export type FindingInput = {
    id: string;
    title: string;
    severity: string;
    evidence: string;
    validationStatus?: string | null;
};
export type StrengthInput = {
    title: string;
    evidence: string;
};
export type BuildClaimsInput = {
    pageUrl: string | null;
    productName: string | null;
    brandName: string | null;
    findings: FindingInput[];
    strengths: StrengthInput[];
    /** Default true: only SUPPORTED findings. Set false to allow QUESTIONABLE with PAGE_SPECIFIC facts. */
    supportedOnly?: boolean;
};
/**
 * Build the only claims Claude is allowed to use in outreach copy.
 */
export declare function buildAllowedClaims(input: BuildClaimsInput): AllowedClaim[];
export declare function pickPrimaryObservation(claims: AllowedClaim[]): AllowedClaim | null;
export declare function pickPrimaryStrength(claims: AllowedClaim[]): AllowedClaim | null;
/** Attach validation status from finding_validations array onto findings. */
export declare function attachValidationStatus(findings: Array<{
    id: string;
    title: string;
    severity: string;
    evidence: string;
}>, validations: unknown): FindingInput[];
//# sourceMappingURL=allowedClaims.d.ts.map