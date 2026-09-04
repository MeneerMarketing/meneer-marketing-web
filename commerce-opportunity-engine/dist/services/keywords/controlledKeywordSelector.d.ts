import type { SupabaseClient } from "@supabase/supabase-js";
import { type ControlledScaleCategory } from "../../config/controlledScale.js";
export interface SelectableKeyword {
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
    prospect_yield_score: number | null;
    unique_domains_found: number | null;
    retailer_ratio: number | null;
    last_scanned_at: string | null;
    discovery_priority_score: number;
}
export interface KeywordSelectionResult {
    selected: SelectableKeyword[];
    byCategory: Record<string, number>;
    byCluster: Record<string, number>;
    brandedCount: number;
    skippedCooldown: number;
    avgProspecting: number;
    avgPriority: number;
}
export declare function selectControlledScaleKeywords(client: SupabaseClient, options?: {
    maxKeywords?: number;
    maxCluster?: number;
    maxBrandedShare?: number;
    cooldownDays?: number;
}): Promise<KeywordSelectionResult>;
export declare function ensureCategoryList(): ControlledScaleCategory[];
//# sourceMappingURL=controlledKeywordSelector.d.ts.map