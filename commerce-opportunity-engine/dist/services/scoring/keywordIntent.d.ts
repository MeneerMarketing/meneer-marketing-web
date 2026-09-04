import type { KeywordIntent } from "../../config/scoringWeights.js";
export interface KeywordIntentInput {
    keyword: string | null;
    domain: string | null;
    brandName?: string | null;
    productName?: string | null;
}
export interface KeywordIntentResult {
    intent: KeywordIntent;
    confidence: number;
    reason: string;
}
export declare function classifyKeywordIntent(input: KeywordIntentInput): KeywordIntentResult;
//# sourceMappingURL=keywordIntent.d.ts.map