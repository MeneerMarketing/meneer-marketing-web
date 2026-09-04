/**
 * Milestone 9.5.1 — rehydrate the M9.5 prospect pool from a stored run (no SERP spend).
 */
import type { ProductArchetypeId } from "../../config/idealProductArchetypes.js";
import type { createSupabaseServerClient } from "../supabase/client.js";
import { type AdProduct } from "./heroProductResolver.js";
import type { BrandFirstCandidateLineage } from "../../config/brandFirstDiscovery.js";
export type DesignGapPoolDomain = {
    domain: string;
    brandId: string | null;
    brandName: string;
    archetypeId: ProductArchetypeId;
    familyId: string;
    familyLabel: string;
    keywords: string[];
    landingUrls: string[];
    adProducts: AdProduct[];
    discoveryRoute: BrandFirstCandidateLineage["discoveryRoute"];
    discoverySource: BrandFirstCandidateLineage["discoverySource"];
    sourceQuery: string | null;
    sourceEvidence: string[];
    businessType: string | null;
    platform: string | null;
    isEcommerce: boolean | null;
    retailerScaleScore: number | null;
    businessMaturityScore: number | null;
    ownBrandSignal: number | null;
    prospectClass: string;
    gateEligible: boolean;
    gateReason: string | null;
};
type KeywordMeta = {
    keyword: string;
    archetypeId: ProductArchetypeId;
    familyId: string;
    familyLabel: string;
};
export declare function loadDesignGapPoolFromRun(supabase: ReturnType<typeof createSupabaseServerClient>, runId: string): Promise<DesignGapPoolDomain[]>;
export declare function loadKeywordMeta(supabase: ReturnType<typeof createSupabaseServerClient>, runId: string): Promise<Map<string, KeywordMeta>>;
export {};
//# sourceMappingURL=designGapPoolLoader.d.ts.map