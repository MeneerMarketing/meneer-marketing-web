/**
 * Milestone 9.3.1 — product_archetype_fit_score.
 *
 * Answers one question before any keyword expansion happens:
 * is this product type suitable for our personalized deep-dive CRO proposition?
 */
import { type ProductArchetypeId } from "../../config/idealProductArchetypes.js";
export interface ArchetypeMatch {
    archetypeId: ProductArchetypeId | null;
    archetypeLabel: string | null;
    familyId: string | null;
    familyLabel: string | null;
    matchedToken: string | null;
    enabled: boolean;
}
export interface ArchetypeFitResult extends ArchetypeMatch {
    /** 0-100. Suitability of this product type for deep-dive CRO. */
    productArchetypeFitScore: number;
    deepDiveProductPotential: number;
    commodityPenalty: number;
    positiveSignals: string[];
    negativeSignals: string[];
    /** May this keyword continue toward SERP discovery? */
    passesArchetypeGate: boolean;
    rejectReason: string | null;
}
/** Resolve which branch and product family a keyword belongs to. */
export declare function matchArchetype(keyword: string): ArchetypeMatch;
export declare function scoreProductArchetypeFit(keyword: string): ArchetypeFitResult;
/** Full lineage record, so no keyword exists without a traceable origin. */
export interface KeywordLineage {
    keyword: string;
    source: "ARCHETYPE_SEED" | "SEED_EXPANSION" | "LEGACY_IMPORT";
    archetypeId: ProductArchetypeId | null;
    familyId: string | null;
    seed: string | null;
    productArchetypeFitScore: number;
    generatedAt: string;
}
export declare function buildKeywordLineage(keyword: string, source: KeywordLineage["source"], seed: string | null): KeywordLineage;
//# sourceMappingURL=productArchetypeFit.d.ts.map