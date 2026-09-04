import type { Env } from "../../config/env.js";
import { type CopyStyle, type OutreachDraftAi, validateOutreachDraft } from "./claimValidation.js";
import { type AllowedClaim } from "./allowedClaims.js";
export type OutreachGeneratorInput = {
    brandDomain: string;
    brandName: string | null;
    contactFirstName: string | null;
    contactEmail: string;
    productName: string | null;
    category: string | null;
    platform: string | null;
    auditType: string | null;
    keyword: string | null;
    pageUrl: string | null;
    confirmedGoogleAdvertiser: boolean;
    recommendedProjectType: string;
    salesAngle: string | null;
    copyStyle: CopyStyle;
    allowedClaims: AllowedClaim[];
    /** @deprecated use allowedClaims — kept for older call sites */
    supportedFindings?: Array<{
        id: string;
        title: string;
        severity: string;
        evidence: string;
    }>;
    strengths?: Array<{
        title: string;
        evidence: string;
    }>;
};
export type OutreachGeneratorResult = {
    draft: OutreachDraftAi;
    validation: ReturnType<typeof validateOutreachDraft>;
    estimatedCost: number;
    model: string;
    promptVersion: string;
    copyStyle: CopyStyle;
    bodyHtml: string;
    wordCount: number;
    rawText: string;
    allowedClaims: AllowedClaim[];
    observation: AllowedClaim | null;
    strength: AllowedClaim | null;
};
export declare function generateOutreachDraft(input: {
    env: Env;
    data: OutreachGeneratorInput;
}): Promise<OutreachGeneratorResult>;
//# sourceMappingURL=outreachDraftGenerator.d.ts.map