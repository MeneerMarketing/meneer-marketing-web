/**
 * Milestone 9.3.1 — one central prospect gate.
 *
 * Every downstream job (ideal prospects, qualification queue, paid verification,
 * hero resolution, CRO audit, concept scoring, contact discovery, outreach) must
 * call passesProspectPipelineGate. Excluded domains may still be stored as raw
 * ad intelligence, but never travel further.
 */
import { type ProspectExclusionReason } from "../../config/prospectExclusion.js";
export interface ProspectGateSignals {
    domain: string;
    businessType?: string | null;
    brandCommerceModel?: string | null;
    isEcommerce?: boolean | null;
    manualExcluded?: boolean | null;
    retailerScaleScore?: number | null;
    estimatedProductCount?: number | null;
    estimatedBrandCount?: number | null;
    businessMaturityScore?: number | null;
    /** Distinct product archetype categories this domain advertises in. */
    categorySpread?: number | null;
    /** Distinct keywords this domain advertises on. */
    keywordSpread?: number | null;
}
export interface ProspectGateVerdict {
    eligible: boolean;
    reason: ProspectExclusionReason | null;
    /** Human readable evidence, used in dashboard and reports. */
    evidence: string[];
    /** Coarse class used for SERP composition scoring. */
    prospectClass: ProspectClass;
    version: string;
}
export type ProspectClass = "NICHE_BRAND" | "SPECIALIST" | "GENERAL_RETAILER" | "MASS_RETAILER" | "MARKETPLACE" | "COMPARISON_SITE" | "NON_COMMERCE" | "UNKNOWN";
/**
 * Deterministic mass-retail detection. Domain tokens are one signal; breadth,
 * scale and catalog signals catch operators that are not in the registry.
 */
export declare function classifyProspectExclusion(signals: ProspectGateSignals): ProspectGateVerdict;
/** The single boolean every downstream job must respect. */
export declare function passesProspectPipelineGate(signals: ProspectGateSignals): boolean;
/**
 * Cheap classification for SERP composition scoring, where only the domain and
 * (optionally) a known business type are available.
 */
export declare function classifySerpDomain(domain: string, businessType?: string | null): ProspectClass;
export interface StructuralDomainVerdict {
    businessType: "MASS_RETAILER" | "COMPARISON_SITE" | "MARKETPLACE";
    matchedSignal: string;
}
/**
 * Domain-level structural verdict, independent of any crawl.
 * The website classifier consults this first so a chain can never be scored as
 * a specialist webshop on the strength of a clean-looking homepage.
 */
export declare function structuralDomainClass(domain: string): StructuralDomainVerdict | null;
//# sourceMappingURL=prospectPipelineGate.d.ts.map