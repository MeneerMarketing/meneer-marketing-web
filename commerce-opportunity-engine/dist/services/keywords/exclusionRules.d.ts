export interface ExclusionHit {
    excluded: boolean;
    reason: string | null;
    matchedPhrase: string | null;
}
export declare function evaluateKeywordExclusion(keyword: string): ExclusionHit;
//# sourceMappingURL=exclusionRules.d.ts.map