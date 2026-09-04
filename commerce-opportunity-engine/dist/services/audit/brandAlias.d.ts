/**
 * Detect when paid keyword/ad brand tokens diverge from the canonical brand/domain.
 * Diagnostic only — does not invalidate source integrity.
 */
export interface BrandAliasMismatchResult {
    detected: boolean;
    confidence: number;
    reason: string;
    keywordBrandTokens: string[];
    canonicalBrandTokens: string[];
    suggestedAlias: string | null;
}
export declare function detectBrandAliasMismatch(input: {
    keyword: string | null;
    adHeadline: string | null;
    domain: string | null;
    brandName?: string | null;
}): BrandAliasMismatchResult;
//# sourceMappingURL=brandAlias.d.ts.map