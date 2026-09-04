import type { Env } from "../../config/env.js";
import type { BusinessClassificationResult, PageExtractedSignals } from "../../types/crawler.js";
export declare function classifyBusinessWithHaiku(env: Env, domain: string, signals: PageExtractedSignals): Promise<{
    classification: BusinessClassificationResult;
    estimatedCost: number;
}>;
//# sourceMappingURL=haikuClassifier.d.ts.map