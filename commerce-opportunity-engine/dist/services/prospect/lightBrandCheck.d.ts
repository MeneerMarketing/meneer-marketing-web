/**
 * Milestone 9.3.2 — cheap domain quality check.
 *
 * One homepage fetch. No secondary crawl, no catalog crawl, no hero resolution,
 * no Claude. Enough to answer: webshop, platform, business type, retail scale,
 * and a basic own-brand signal.
 */
import { type ProspectClass } from "./prospectPipelineGate.js";
export interface LightBrandCheckResult {
    domain: string;
    crawlStatus: string;
    isEcommerce: boolean;
    ecommerceConfidence: number;
    platform: string;
    platformConfidence: number;
    businessType: string;
    businessTypeConfidence: number;
    businessTypeReasoning: string;
    retailerScaleScore: number;
    /**
     * Milestone 9.3.3 — breadth measured apart from international reach, so a
     * chain is recognised by its assortment rather than by its country count.
     */
    retailerBreadthScore: number;
    categoryBreadthScore: number;
    internationalPresenceScore: number;
    /** Physical-chain evidence: store finders and branch language. */
    storeLocatorMentions: number;
    /** 0-100 proxy for "sells its own brand" based on homepage signals. */
    ownBrandSignal: number;
    ownBrandEvidence: string[];
    categoryLinks: number;
    productLinks: number;
    prospectClass: ProspectClass;
    gateEligible: boolean;
    gateReason: string | null;
    classifierVersion: string;
    title: string | null;
    error: string | null;
}
export declare function runLightBrandCheck(domain: string, timeoutMs: number): Promise<LightBrandCheckResult>;
//# sourceMappingURL=lightBrandCheck.d.ts.map