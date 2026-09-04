/**
 * Milestone 9.3.1 — IDEAL_PRODUCT_ARCHETYPES_V1.
 *
 * Prospect-first discovery starts at the product archetype, not at buyer intent.
 * A keyword only enters discovery when it belongs to an enabled branch and to a
 * product family that can carry a deep-dive PDP.
 */
export declare const IDEAL_PRODUCT_ARCHETYPES_VERSION: "IDEAL_PRODUCT_ARCHETYPES_V1";
export type ProductArchetypeId = "BEAUTY_DEVICES" | "SKINCARE_DEVICES" | "HAIR_SCALP_TECH" | "WELLNESS_DEVICES" | "RECOVERY_PRODUCTS" | "PERSONAL_CARE_TECH" | "HOME_WELLNESS_TECH" | "NICHE_CONSUMER_TECH" | "SLEEP_COMFORT" | "PET_TECH" | "PREMIUM_PET" | "NICHE_HOME_COMFORT" | "FITNESS_SPECIALIST";
/** Traits that make a product type suitable for a personalized deep-dive PDP. */
export interface ArchetypeDeepDiveTraits {
    highConsideration: number;
    visualStorytelling: number;
    featureRich: number;
    heroProductPotential: number;
    premiumPrice: number;
    brandDifferentiation: number;
}
/** Traits that make a product type unsuitable, no matter the buyer intent. */
export interface ArchetypeCommodityTraits {
    commodity: number;
    priceOnlyCompetition: number;
    massRetailCategory: number;
    marketplaceDominated: number;
    simpleStandardized: number;
}
export interface ProductFamily {
    /** Stable id used as keyword lineage source. */
    id: string;
    label: string;
    /** Seed queries used for controlled keyword expansion. Never random. */
    seeds: string[];
    /** Tokens that mark a keyword as belonging to this family. */
    matchTokens: string[];
    /** Tokens that disqualify a keyword even inside this family. */
    rejectTokens: string[];
    /** Family-level adjustment on top of the archetype baseline (-30..+20). */
    fitModifier: number;
}
export interface ProductArchetype {
    id: ProductArchetypeId;
    label: string;
    enabled: boolean;
    /** Maps to the existing keyword category taxonomy. */
    keywordCategory: string;
    /** Share of the discovery budget when enabled. Normalized at runtime. */
    budgetShare: number;
    deepDive: ArchetypeDeepDiveTraits;
    commodity: ArchetypeCommodityTraits;
    families: ProductFamily[];
    notes: string;
}
export declare const IDEAL_PRODUCT_ARCHETYPES_V1: ProductArchetype[];
export declare const ARCHETYPE_BY_ID: Map<ProductArchetypeId, ProductArchetype>;
export declare function enabledArchetypes(): ProductArchetype[];
export declare function enabledArchetypeCategories(): string[];
/** Normalized budget share across enabled branches. */
export declare function normalizedBudgetShares(): Record<string, number>;
/** Minimum archetype fit required before a keyword may enter SERP discovery. */
export declare const MIN_ARCHETYPE_FIT_FOR_DISCOVERY = 62;
//# sourceMappingURL=idealProductArchetypes.d.ts.map