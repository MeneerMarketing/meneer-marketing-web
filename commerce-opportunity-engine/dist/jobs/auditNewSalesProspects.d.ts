/**
 * Milestone 9.3.4 — from the new M9.3.3 prospect pool to one design target.
 *
 * Flow: load strong prospects -> deterministic rank -> resolve hero products ->
 * page health -> at most six real PDP audits -> recompute transformation and
 * contrast on measured data -> true sales ranking -> top three -> screenshots.
 *
 * Stops there on purpose. No preview, no outreach, no new discovery.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { type NewProspectRecord, type PreselectionEntry } from "../services/idealProspect/newProspectPreselection.js";
import { type ResolvedHero } from "../services/prospect/heroProductResolver.js";
import { type OutreachScoringResult } from "../services/concept/outreachScoring.js";
import { type DesignTargetGateResult } from "../services/concept/trueSalesDesignScore.js";
import type { ConversionLeak } from "../types/audit.js";
interface BrandRow {
    id: string;
    name: string | null;
    normalized_domain: string;
    platform: string | null;
    business_type: string | null;
    business_maturity_score: number | null;
    retailer_scale_score: number | null;
    confirmed_google_advertiser: boolean | null;
    transparency_confirmed: boolean | null;
    manual_excluded: boolean | null;
    lead_eligible: boolean | null;
}
interface AuditReadback {
    id: string;
    status: string | null;
    audit_valid: boolean | null;
    audit_confidence: number | null;
    cro_scores: Record<string, number | null> | null;
    conversion_leaks: unknown;
    strengths: unknown;
    findings: Record<string, unknown> | null;
    page_health_status: string | null;
    page_representation: Record<string, unknown> | null;
    meneer_marketing_fit_score: number | null;
    anthropic_cost: number | null;
    screenshot_paths: Record<string, unknown> | null;
}
interface AuditedCandidate {
    domain: string;
    rank: number;
    preselectionScore: number;
    record: NewProspectRecord;
    preselection: PreselectionEntry;
    brandId: string;
    conceptId: string | null;
    opportunityId: string | null;
    hero: ResolvedHero | null;
    auditOutcome: string;
    auditSkipReason: string | null;
    pageHealth: string | null;
    auditConfidence: number | null;
    currentPdpQuality: number | null;
    subScores: {
        buyblock: number | null;
        visual: number | null;
        storytelling: number | null;
        media: number | null;
        deepDive: number | null;
        mobile: number | null;
    };
    assetReadiness: number | null;
    commercialSignal: number | null;
    transformation: number | null;
    contrastRoom: number | null;
    contrastCapability: number | null;
    conceptContrast: number | null;
    contrastBand: string | null;
    contrastCeiling: string | null;
    deepDiveFit: number | null;
    economicFit: number | null;
    salesFit: number | null;
    trueSalesDesignScore: number | null;
    measurementConfidence: number | null;
    gate: DesignTargetGateResult | null;
    leaks: ConversionLeak[];
    strengths: Array<{
        title: string;
    }>;
    anthropicCost: number;
}
export declare function resolvePrimarySalesProduct(record: NewProspectRecord): Promise<{
    hero: ResolvedHero | null;
    reason: string | null;
}>;
export declare function upsertConceptCandidate(supabase: SupabaseClient, input: {
    brandId: string;
    record: NewProspectRecord;
    preselection: PreselectionEntry;
    hero: ResolvedHero;
    brand: BrandRow | null;
}): Promise<string>;
export declare function loadLatestAudit(supabase: SupabaseClient, opportunityId: string): Promise<AuditReadback | null>;
export declare function scoreAuditedCandidate(input: {
    record: NewProspectRecord;
    preselection: PreselectionEntry;
    hero: ResolvedHero;
    brand: BrandRow | null;
    audit: AuditReadback;
}): {
    currentPdpQuality: number | null;
    subScores: AuditedCandidate["subScores"];
    assetReadiness: number;
    commercialSignal: number;
    transformation: number;
    outreach: OutreachScoringResult;
    conceptReadyScore: number;
    purchasablePage: boolean;
    leaks: ConversionLeak[];
    strengths: Array<{
        title: string;
    }>;
};
export declare function persistScores(supabase: SupabaseClient, conceptId: string, input: {
    conceptReadyScore: number;
    assetReadiness: number;
    commercialSignal: number;
    transformation: number;
    outreach: OutreachScoringResult;
}): Promise<void>;
export {};
//# sourceMappingURL=auditNewSalesProspects.d.ts.map