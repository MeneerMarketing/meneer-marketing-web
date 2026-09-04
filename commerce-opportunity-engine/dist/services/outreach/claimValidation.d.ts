import { z } from "zod";
import type { AllowedClaim, EvidenceScope } from "./allowedClaims.js";
export declare const COPY_STYLES: readonly ["SOFT_OBSERVATION", "DIRECT_IDEA"];
export type CopyStyle = (typeof COPY_STYLES)[number];
export declare const OutreachDraftAiSchema: z.ZodObject<{
    subject: z.ZodString;
    body: z.ZodString;
    selected_finding_id: z.ZodString;
    selected_finding_title: z.ZodString;
    selected_strength_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    strategy: z.ZodString;
    copy_style: z.ZodOptional<z.ZodEnum<{
        SOFT_OBSERVATION: "SOFT_OBSERVATION";
        DIRECT_IDEA: "DIRECT_IDEA";
    }>>;
    personalization_used: z.ZodObject<{
        first_name: z.ZodBoolean;
        brand: z.ZodBoolean;
        product: z.ZodBoolean;
        category: z.ZodBoolean;
        platform: z.ZodBoolean;
    }, z.core.$strip>;
    claims_used: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type OutreachDraftAi = z.infer<typeof OutreachDraftAiSchema>;
export type SentenceEvidenceRow = {
    sentence: string;
    allowed: boolean;
    evidence_ids: string[];
    notes: string;
};
export type ClaimValidationResult = {
    status: "PASSED" | "FAILED";
    errors: string[];
    allowedClaimLevel: "EXACT_PAID_FUNNEL" | "HIGH_CONFIDENCE_PRODUCT_TARGET" | "GENERIC";
    wordCount: number;
    sentenceEvidence: SentenceEvidenceRow[];
};
export declare function validateOutreachDraft(input: {
    draft: OutreachDraftAi;
    auditType: string | null;
    contactFirstName: string | null;
    productName: string | null;
    brandDomain: string;
    findingTitles: string[];
    strengthTitles: string[];
    confirmedGoogleAdvertiser: boolean;
    allowedClaims?: AllowedClaim[];
    observationScope?: EvidenceScope;
    availabilityProven?: boolean;
}): ClaimValidationResult;
//# sourceMappingURL=claimValidation.d.ts.map