import type { SupabaseClient } from "@supabase/supabase-js";
/** Keyword → category map for seed/development keywords. */
export declare const KEYWORD_CATEGORIES: Record<string, string>;
export declare const SEED_KEYWORDS: string[];
export declare function seedDevelopmentKeywords(client: SupabaseClient): Promise<number>;
export declare function loadActiveKeywords(client: SupabaseClient, limit: number, keywordFilter?: string): Promise<Array<{
    id: string;
    keyword: string;
    locale: string | null;
    category: string | null;
    active: boolean;
    last_scanned_at: string | null;
}>>;
export declare function updateKeywordLastScanned(client: SupabaseClient, keywordId: string, scannedAt: string): Promise<void>;
//# sourceMappingURL=keywordsRepository.d.ts.map