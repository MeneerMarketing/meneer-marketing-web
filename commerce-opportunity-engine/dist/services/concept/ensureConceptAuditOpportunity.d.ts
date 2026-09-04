/**
 * Milestone 9.2.1 — ensure opportunity exists for concept hero PDP audit.
 * Uses existing brand/page data only. No keyword discovery.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
export declare function ensureConceptAuditOpportunity(supabase: SupabaseClient, input: {
    conceptId: string;
    brandId: string;
    productUrl: string;
    pageId?: string | null;
}): Promise<string>;
//# sourceMappingURL=ensureConceptAuditOpportunity.d.ts.map