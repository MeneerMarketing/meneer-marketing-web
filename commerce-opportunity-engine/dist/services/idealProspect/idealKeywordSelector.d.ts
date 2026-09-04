/**
 * Milestone 9.3 — profile-aware keyword selection for ideal prospect discovery.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
export interface IdealSelectableKeyword {
    id: string;
    keyword: string;
    category: string;
    cluster: string | null;
    keyword_intent_type: string | null;
    prospecting_tier: string | null;
    prospecting_value_score: number | null;
    keyword_quality_score: number | null;
    commercial_intent_score: number | null;
    product_intent_score: number | null;
    discovery_priority_score: number;
    archetype_id: string | null;
    product_family_id: string | null;
    product_archetype_fit_score: number;
    pre_gate_class: string;
}
export interface IdealKeywordSelectionResult {
    selected: IdealSelectableKeyword[];
    byCategory: Record<string, number>;
    brandedCount: number;
    skippedCooldown: number;
    /** Keywords stopped before any SERP call, grouped by pre-gate class. */
    preGateRejected: Array<{
        keyword: string;
        preGateClass: string;
        reason: string;
    }>;
}
export declare function selectIdealProspectKeywords(client: SupabaseClient, options?: {
    maxKeywords?: number;
    cooldownDays?: number;
}): Promise<IdealKeywordSelectionResult>;
//# sourceMappingURL=idealKeywordSelector.d.ts.map