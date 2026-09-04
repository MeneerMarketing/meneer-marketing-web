/**
 * Milestone 9.5.1 — normalized hero target fields for reports and scoring audit.
 */
import type { ResolvedHero } from "./heroProductResolver.js";
export type HeroPriceConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export interface HeroTargetRecord {
    heroProductId: string | null;
    heroProductUrl: string | null;
    heroTitle: string | null;
    heroPrice: number | null;
    heroCurrency: string | null;
    heroScore: number | null;
    heroConfidence: number | null;
    heroPriceConfidence: HeroPriceConfidence;
    heroResolutionSource: ResolvedHero["source"] | "catalog_flagship" | "unknown";
    heroResolutionEvidence: string[];
    matchedKeywords: string[];
    heroSelectionEvidence: string[];
}
export declare function heroProductIdFromUrl(url: string | null): string | null;
export declare function heroPriceConfidenceFromSource(source: HeroTargetRecord["heroResolutionSource"], price: number | null): HeroPriceConfidence;
export declare function buildHeroTargetRecord(input: {
    hero: ResolvedHero | null;
    keywords: string[];
    resolutionSource?: HeroTargetRecord["heroResolutionSource"];
    heroSelectionEvidence?: string[];
}): HeroTargetRecord;
//# sourceMappingURL=heroTargetMetadata.d.ts.map