import type { SupabaseClient } from "@supabase/supabase-js";
import type { BrandQualificationCandidate } from "../../types/crawler.js";
export declare const PRIORITY_DOMAINS: string[];
type BrandRow = {
    id: string;
    normalized_domain: string;
    name: string;
    confirmed_google_advertiser: boolean;
    transparency_confirmed: boolean;
    last_crawled_at: string | null;
    platform: string | null;
    is_ecommerce: boolean | null;
    business_type: string;
    retailer_scale_score: number | null;
};
export declare function enrichCandidate(client: SupabaseClient, brand: BrandRow): Promise<BrandQualificationCandidate>;
export declare function loadBrandsForQualification(client: SupabaseClient, limit: number, options?: {
    forcePriorityDomains?: boolean;
}): Promise<BrandQualificationCandidate[]>;
export declare function saveBrandQualification(client: SupabaseClient, result: {
    brandId: string;
    crawlStatus: string;
    isEcommerce: boolean;
    ecommerceConfidence: number;
    platform: string;
    platformConfidence: number;
    platformCandidate: string;
    platformEvidence: Record<string, unknown>;
    shopifyConfidence: number;
    businessType: string;
    businessTypeConfidence: number;
    businessTypeReasoning: string;
    leadEligible: boolean;
    qualificationReason: string;
    qualificationEvidence: Record<string, unknown>;
    businessMaturityScore: number;
    businessMaturityComponents: Record<string, number | null>;
    retailerScaleScore: number;
    crawlMetadata: Record<string, unknown>;
}): Promise<void>;
export {};
//# sourceMappingURL=brandsQualificationRepository.d.ts.map