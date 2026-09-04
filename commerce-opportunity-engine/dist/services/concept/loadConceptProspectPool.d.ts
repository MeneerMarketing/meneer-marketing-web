/**
 * Milestone 9.2 — Load concept prospect pool from existing DB (no new discovery).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PilotCandidateRow } from "./selectPremiumDtcPilot.js";
import type { OutreachScoringInput } from "./outreachScoring.js";
export type ProspectPoolEntry = {
    pilotRow: PilotCandidateRow;
    outreachInput: OutreachScoringInput;
    pageHealthOk: boolean;
    croQualityComposite: number | null;
    categoryHint: string | null;
    adsStatus: string;
    engineeringFixture: boolean;
};
export declare function loadConceptProspectPool(supabase: SupabaseClient): Promise<ProspectPoolEntry[]>;
//# sourceMappingURL=loadConceptProspectPool.d.ts.map