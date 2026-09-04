/**
 * Milestone 8.2 — tiny personalisation snippet generator.
 * Claude writes ONLY observation (+ optional strength). Never the full mail.
 */
import type { Env } from "../../config/env.js";
import type { AllowedClaim } from "./allowedClaims.js";
export type PersonalisationSnippets = {
    observation: string;
    strength: string | null;
    estimatedCost: number;
    model: string;
    promptVersion: string;
    rawText: string;
    budgetBlocked: false;
};
export type PersonalisationBlocked = {
    budgetBlocked: true;
    status: "BUDGET_BLOCKED";
    reason: string;
    estimatedCost: 0;
};
export declare const PERSONALISATION_PROMPT_VERSION = "m8.2-personalisation-v1";
export declare function generatePersonalisationSnippets(input: {
    env: Env;
    currentRunCost: number;
    costCap: number;
    brandLabel: string;
    productName: string | null;
    observation: AllowedClaim;
    strength: AllowedClaim | null;
}): Promise<PersonalisationSnippets | PersonalisationBlocked>;
//# sourceMappingURL=personalisationGenerator.d.ts.map