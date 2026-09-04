/**
 * Milestone 9.2 — Outreach pilot eligibility gate.
 */
import type { PilotCandidateRow } from "./selectPremiumDtcPilot.js";
import type { OutreachScoringResult } from "./outreachScoring.js";
export type OutreachGateInput = {
    row: PilotCandidateRow;
    outreach: OutreachScoringResult;
    pageHealthOk: boolean;
    croQualityComposite: number | null;
    auditConfidence: number | null;
};
export declare function evaluateOutreachCandidateGate(input: OutreachGateInput): {
    eligible: boolean;
    blockedReasons: string[];
};
//# sourceMappingURL=outreachCandidateGate.d.ts.map