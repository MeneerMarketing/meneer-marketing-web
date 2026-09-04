import type { SupabaseClient } from "@supabase/supabase-js";
import { type KeywordCategoryId } from "../../config/keywordCategories.js";
export declare const KEYWORD_LOCALE = "nl-NL";
export type KeywordDiscoveryStatus = "DISCOVERED" | "QUALIFIED" | "APPROVED" | "REJECTED" | "SCANNED" | "PAUSED";
export interface KeywordIntelligenceRow {
    id?: string;
    keyword: string;
    locale: string;
    category: string;
    cluster: string | null;
    seed_keyword: string | null;
    normalized_keyword: string;
    search_volume: number | null;
    cpc: number | null;
    competition: number | null;
    competition_index: number | null;
    competition_level: string | null;
    commercial_intent_score: number | null;
    product_intent_score: number | null;
    keyword_quality_score: number | null;
    volume_tier: string | null;
    keyword_source: string | null;
    discovery_status: KeywordDiscoveryStatus;
    active: boolean;
    approved: boolean;
    rejected: boolean;
    paused: boolean;
    rejection_reason: string | null;
    manual_review_override: boolean;
    last_metrics_update: string | null;
    monthly_searches: unknown;
    dfs_categories: unknown;
    search_intent_main: string | null;
    search_metrics: Record<string, unknown>;
    estimated_serp_cost: number | null;
    updated_at: string;
}
export declare function ensureKeywordCategories(client: SupabaseClient): Promise<void>;
export declare function loadActiveCategorySeeds(client: SupabaseClient, categoryId: KeywordCategoryId, maxSeeds: number): Promise<{
    label: string;
    seeds: string[];
    paused: boolean;
    active: boolean;
}>;
export declare function upsertKeywordIntelligenceRows(client: SupabaseClient, rows: KeywordIntelligenceRow[]): Promise<{
    upserted: number;
    skippedManual: number;
}>;
export declare function loadApprovedKeywordsForDiscovery(client: SupabaseClient, limit: number): Promise<Array<{
    id: string;
    keyword: string;
    locale: string | null;
    category: string | null;
}>>;
export declare function loadKeywordsByIds(client: SupabaseClient, keywordIds: string[]): Promise<Array<{
    id: string;
    keyword: string;
    locale: string | null;
    category: string | null;
}>>;
export declare function markKeywordsScanned(client: SupabaseClient, keywordIds: string[], scannedAt: string): Promise<void>;
export declare function setKeywordOperatorStatus(client: SupabaseClient, keywordId: string, action: "approve" | "reject" | "pause", reason?: string): Promise<void>;
//# sourceMappingURL=keywordIntelligenceRepository.d.ts.map