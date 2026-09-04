import type { Env } from "../../config/env.js";
import { type CroAuditType } from "../../config/scoringWeights.js";
import { type CroAuditAiResponse, type PageRepresentation } from "../../types/audit.js";
export declare function runCroAuditWithClaude(input: {
    env: Env;
    auditType: CroAuditType;
    representation: PageRepresentation;
    screenshots: {
        mobilePng?: Buffer;
        desktopPng?: Buffer;
    };
}): Promise<{
    ai: CroAuditAiResponse;
    estimatedCost: number;
    model: string;
    auditVersion: string;
    promptVersion: string;
    rawText: string;
}>;
//# sourceMappingURL=croAuditor.d.ts.map