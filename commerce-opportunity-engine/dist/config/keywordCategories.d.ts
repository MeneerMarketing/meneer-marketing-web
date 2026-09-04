/**
 * Configurable ecommerce keyword categories for the Keyword Intelligence Engine.
 * Architecture supports unlimited categories; Fase A only runs active+unpaused seeds.
 */
export type KeywordCategoryId = "BEAUTY_SKINCARE" | "HAIRCARE" | "SLEEP" | "HOME_LIVING" | "PETS" | "FITNESS" | "WELLNESS" | "FASHION_ACCESSORIES";
export interface KeywordCategoryConfig {
    id: KeywordCategoryId;
    label: string;
    /** Default paused = true except beauty for Fase A. */
    defaultPaused: boolean;
    seedTopics: string[];
    /** Deterministic cluster roots: token → cluster slug. */
    clusterRoots: Record<string, string>;
}
export declare const KEYWORD_CATEGORY_CONFIGS: KeywordCategoryConfig[];
export declare function getCategoryConfig(id: string): KeywordCategoryConfig | undefined;
/** Whole-word / phrase exclusions (not naive substrings). */
export declare const KEYWORD_EXCLUSION_PHRASES: readonly ["vacature", "vacatures", "opleiding", "opleidingen", "cursus", "cursussen", "stage", "stages", "sollicitatie", "werkzaamheden", "salaris", "tweedehands", "marktplaats", "gratis download", "gratis pdf", "handleiding pdf", "zelf maken", "diy recept", "wat is", "hoe werkt", "betekenis", "wikipedia", "wiki", "ervaring opleiding", "baan", "banen", "job", "jobs", "software voor", "saas", "nieuws"];
/** Allowed exception phrases that contain otherwise risky tokens. */
export declare const KEYWORD_EXCLUSION_ALLOWLIST: readonly ["gratis verzending", "gratis retour", "gratis bezorging"];
//# sourceMappingURL=keywordCategories.d.ts.map