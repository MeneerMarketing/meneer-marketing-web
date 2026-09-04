import type { SupabaseClient } from "@supabase/supabase-js";
/**
 * Build retailer / marketplace / comparison brand tokens from config + live DB brands.
 * Tokens are matched as whole words / phrases inside keywords.
 */
export declare function buildRetailerNameTokens(client: SupabaseClient): Promise<Set<string>>;
export declare function buildProductBrandTokens(client: SupabaseClient): Promise<Set<string>>;
export declare function findMatchingToken(keywordNormalized: string, tokens: Set<string>): string | null;
//# sourceMappingURL=retailerNameDetector.d.ts.map