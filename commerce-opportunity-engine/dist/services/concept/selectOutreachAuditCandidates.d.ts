/**
 * Milestone 9.2.1 — deterministic pre-audit ranking for outreach CRO coverage.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditCandidate } from "../audit/auditRunner.js";
import { type ProspectPoolEntry } from "./loadConceptProspectPool.js";
export type OutreachAuditCandidate = {
    entry: ProspectPoolEntry;
    preAuditRank: number;
    rankEvidence: string[];
    opportunityId: string;
    productUrl: string;
    skipReason?: string;
};
export declare function buildConceptAuditCandidate(supabase: SupabaseClient, opportunityId: string, productUrl: string): Promise<AuditCandidate | null>;
export declare function selectOutreachAuditCandidates(supabase: SupabaseClient, maxAudits?: number): Promise<{
    selected: OutreachAuditCandidate[];
    skipped: OutreachAuditCandidate[];
}>;
//# sourceMappingURL=selectOutreachAuditCandidates.d.ts.map