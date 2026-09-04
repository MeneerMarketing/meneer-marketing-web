/**
 * Milestone 8.2 — human-first outreach orchestration.
 */
import type { Env } from "../../config/env.js";
import { type AllowedClaim } from "./allowedClaims.js";
import { type GenerationMode, type AssembledMail, type SubjectKey } from "./mailAssembler.js";
import { validateOutreachDraft } from "./claimValidation.js";
export type HumanFirstOutreachInput = {
    env: Env;
    mode: GenerationMode;
    currentRunCost: number;
    costCap: number;
    brandDomain: string;
    brandName: string | null;
    brandLabel: string;
    contactFirstName: string | null;
    productName: string | null;
    recommendedProjectType: string | null;
    auditType: string | null;
    keyword: string | null;
    confirmedGoogleAdvertiser: boolean;
    allowedClaims: AllowedClaim[];
    includeExperienceLine?: boolean;
    subjectKey?: SubjectKey;
    usePaidFunnelOpening?: boolean;
};
export type HumanFirstOutreachResult = {
    mode: GenerationMode;
    mail: AssembledMail;
    observationClaim: AllowedClaim;
    strengthClaim: AllowedClaim | null;
    claimsUsed: string[];
    anthropicCost: number;
    model: string | null;
    promptVersion: string;
    validation: ReturnType<typeof validateOutreachDraft>;
    budgetBlocked: boolean;
    budgetBlockReason: string | null;
    /** If AI was requested but blocked/fallback, explain. */
    notes: string[];
};
export declare function buildHumanFirstOutreach(input: HumanFirstOutreachInput): Promise<HumanFirstOutreachResult>;
//# sourceMappingURL=humanFirstOutreach.d.ts.map