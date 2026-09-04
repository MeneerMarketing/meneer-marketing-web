export interface CommercialIntentResult {
    score: number;
    reasons: string[];
}
export declare function scoreCommercialIntent(input: {
    keyword: string;
    searchIntentMain?: string | null;
    cpc?: number | null;
    competition?: number | null;
}): CommercialIntentResult;
//# sourceMappingURL=commercialIntent.d.ts.map