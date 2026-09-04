/**
 * Milestone 9.3.3 — deterministic prospect pre-scoring.
 *
 * Answers "is this worth a paid CRO audit?" from signals we already collected.
 * No Claude, no guessing: every component traces back to something observed on
 * the site or in the ad landscape.
 */
import { type ProductArchetypeId } from "../../config/idealProductArchetypes.js";
export interface PreScoreInput {
    archetypeId: ProductArchetypeId;
    catalogFocusScore: number;
    estimatedCatalogSize: number | null;
    ownBrandSignal: number | null;
    platform: string | null;
    pdpWeaknessScore: number | null;
    heroScore: number | null;
    businessMaturityScore: number | null;
    /** Assortment width plus chain behaviour, 0-100. High is bad for us. */
    retailerBreadthScore: number | null;
    /** False when the catalog could not actually be read. */
    catalogVerified: boolean;
}
export interface PreScoreResult {
    idealProspectPreScore: number;
    deepDivePdpFitProxy: number;
    isStrongProspect: boolean;
    components: Record<string, number>;
    evidence: string[];
}
/**
 * How well the product type carries a long, explanatory PDP. Comes from the
 * archetype traits, tempered by how focused this particular shop is: a great
 * product category inside a sprawling catalog still has no hero to build on.
 */
export declare function computeDeepDivePdpFitProxy(input: {
    archetypeId: ProductArchetypeId;
    catalogFocusScore: number;
    heroScore: number | null;
}): number;
export declare function computeProspectPreScore(input: PreScoreInput): PreScoreResult;
//# sourceMappingURL=prospectPreScore.d.ts.map