export interface PreFitInput {
    businessType: string | null;
    platform: string | null;
    isEcommerce: boolean;
    maturity: number | null;
    retailerScale: number | null;
    confirmedAdvertiser: boolean;
    transparencyConfirmed: boolean;
    manualExcluded: boolean;
}
export interface PreFitResult {
    score: number;
    prequalified: boolean;
    reason: string;
}
export declare function computePreFit(input: PreFitInput): PreFitResult;
//# sourceMappingURL=preFit.d.ts.map