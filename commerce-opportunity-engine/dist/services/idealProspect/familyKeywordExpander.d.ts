/**
 * Milestone 9.3.3 — keyword expansion that cannot drift out of its family.
 *
 * Expansion starts from the configured family seeds and may be widened with
 * DataForSEO keyword ideas, but every candidate must still match the family's
 * own tokens and clear the pre-gate. A keyword without complete lineage never
 * reaches a SERP call.
 */
import type { AxiosInstance } from "axios";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../../config/env.js";
import { type ProductArchetypeId } from "../../config/idealProductArchetypes.js";
import type { ProductionBranch } from "../../config/productionDiscovery.js";
export type KeywordGenerationSource = "family_seed" | "dataforseo_ideas";
export interface FamilyKeyword {
    id: string | null;
    keyword: string;
    category: string;
    archetypeId: ProductArchetypeId;
    familyId: string;
    familyLabel: string;
    /** The seed this keyword descends from. */
    seed: string;
    generationSource: KeywordGenerationSource;
    archetypeFit: number;
    preGateClass: string;
    prospectingValue: number;
    searchVolume: number | null;
    cpc: number | null;
}
export interface RejectedKeyword {
    keyword: string;
    familyId: string | null;
    reason: string;
    source: KeywordGenerationSource;
}
export interface FamilyExpansionResult {
    keywords: FamilyKeyword[];
    rejected: RejectedKeyword[];
    ideasCost: number;
    ideasFetched: number;
}
export declare function expandFamilyKeywords(input: {
    branches: ProductionBranch[];
    client: AxiosInstance | null;
    env: Env | null;
    ideasLimit: number;
    /** Skip the Labs call when there is no budget headroom. */
    allowIdeas: boolean;
}): Promise<FamilyExpansionResult>;
/**
 * Ranks within each family, then interleaves families so one family cannot eat
 * the whole SERP budget. Search volume is a tiebreaker only: prospect quality
 * comes from archetype fit, never from popularity.
 */
export declare function selectProductionKeywords(keywords: FamilyKeyword[], options: {
    maxTotal: number;
    maxPerFamily: number;
    branches: ProductionBranch[];
}): FamilyKeyword[];
/** Persists lineage so a keyword can be traced back long after the run. */
export declare function persistFamilyKeywords(client: SupabaseClient, keywords: FamilyKeyword[]): Promise<FamilyKeyword[]>;
//# sourceMappingURL=familyKeywordExpander.d.ts.map