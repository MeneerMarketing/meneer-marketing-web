/**
 * Milestone 8.2 — deterministic human-first mail assembler.
 * Assembler owns structure. AI only supplies optional personalisation snippets.
 */
import type { AllowedClaim } from "./allowedClaims.js";
export type GenerationMode = "DETERMINISTIC" | "AI_PERSONALIZED";
export type SubjectKey = "EVEN_IETS" | "EEN_IDEE" | "IETS_OPGEVALLEN";
export declare const SUBJECT_POOL: Record<SubjectKey, (brand: string) => string>;
export type MailAssemblerInput = {
    brandLabel: string;
    contactFirstName: string | null;
    verifiedObservation: string;
    verifiedStrength: string | null;
    recommendedProjectType: string | null;
    includeExperienceLine?: boolean;
    subjectKey?: SubjectKey;
    /** Optional paid-funnel opening override (only when caller proves EXACT_PAID_FUNNEL). */
    openingOverride?: string | null;
    kvkNumber?: string;
};
export type AssembledMailParts = {
    greeting: string;
    opening: string;
    observation: string;
    strength: string | null;
    positioning: string;
    experience: string | null;
    cta: string;
    signature: string;
};
export type AssembledMail = {
    subject: string;
    bodyText: string;
    bodyHtml: string;
    parts: AssembledMailParts;
    fixedCopy: string;
    personalisationCopy: string;
    wordCount: number;
    claimsUsed: string[];
};
export declare function normalizeBrandLabel(brandName: string | null, domain: string): string;
/**
 * Deterministic first-touch assembly. ~80-90% fixed human copy.
 */
export declare function assembleHumanFirstMail(input: MailAssemblerInput): AssembledMail;
export declare function deterministicPersonalisationFromClaims(input: {
    observation: AllowedClaim;
    strength: AllowedClaim | null;
}): {
    observation: string;
    strength: string | null;
    claimsUsed: string[];
};
//# sourceMappingURL=mailAssembler.d.ts.map