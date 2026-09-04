/**
 * Category relevance allow/deny concepts for Milestone 7.2.1.
 * Deterministic, no Claude.
 */
export interface CategoryRelevanceConfig {
    /** Strong positive product/category tokens. */
    allowTokens: string[];
    /** Phrases that strongly indicate this category. */
    allowPhrases: string[];
    /** Tokens that should not appear alone / push out of category. */
    denyTokens: string[];
    /** Multi-word deny patterns. */
    denyPhrases: string[];
    /**
     * For compound seeds like "elektrische deken": require an allow-token
     * companion when a weak/ambiguous stem is present.
     */
    requireAllowWhenTokens: string[];
}
export declare const CATEGORY_RELEVANCE_CONFIG: Record<string, CategoryRelevanceConfig>;
/** Tokens that count as product context for PETS (with kat/hond). */
export declare const PETS_PRODUCT_CONTEXT_TOKENS: string[];
//# sourceMappingURL=categoryRelevance.d.ts.map