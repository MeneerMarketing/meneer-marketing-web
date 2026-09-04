/**
 * Milestone 9.3.2 — traceable archetype keyword seeding.
 *
 * Every keyword that enters discovery carries its origin: branch, product
 * family, seed and archetype fit. No keyword without lineage.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { type ProductArchetypeId } from "../../config/idealProductArchetypes.js";
export interface SeededArchetypeKeyword {
    id: string;
    keyword: string;
    category: string;
    archetypeId: ProductArchetypeId;
    familyId: string;
    familyLabel: string;
    archetypeFit: number;
    preGateClass: string;
    prospectingValue: number;
    searchVolume: number | null;
    cpc: number | null;
    lastScannedAt: string | null;
}
/**
 * Upserts the configured family seeds for the given branches and returns them
 * with their database ids. Seeds that fail their own pre-gate are skipped, so a
 * misconfigured family cannot smuggle a bad keyword into a run.
 */
export declare function seedArchetypeKeywords(client: SupabaseClient, archetypeIds: ProductArchetypeId[]): Promise<{
    seeded: SeededArchetypeKeyword[];
    skipped: Array<{
        keyword: string;
        reason: string;
    }>;
}>;
/**
 * Picks the calibration set: spread across product families first, then the
 * strongest remaining keyword per branch. Never selects on search volume.
 */
export declare function selectCalibrationKeywords(seeded: SeededArchetypeKeyword[], options: {
    maxPerBranch: number;
    maxPerFamily: number;
    maxTotal: number;
}): SeededArchetypeKeyword[];
//# sourceMappingURL=archetypeKeywordSeeder.d.ts.map