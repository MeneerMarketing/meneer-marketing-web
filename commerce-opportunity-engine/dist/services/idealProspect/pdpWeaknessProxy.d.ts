/**
 * Milestone 9.3 — deterministic current PDP weakness proxy (pre-Claude).
 */
import type { PageExtractedSignals } from "../../types/crawler.js";
export type PdpWeaknessProxyInput = {
    platform: string | null;
    descriptionLength: number;
    imageCount: number | null;
    hasReviews: boolean;
    hasPrice: boolean;
    hasAddToCart: boolean;
    bodyTextLength: number;
    benefitsPresent: boolean;
    faqPresent: boolean;
    featuresPresent: boolean;
    videoPresent: boolean;
    signals?: PageExtractedSignals | null;
};
export declare function computeCurrentPdpWeaknessProxy(input: PdpWeaknessProxyInput): {
    score: number;
    evidence: string[];
};
export declare function pdpWeaknessSignalsFromHtml(html: string, _url: string, platform: string | null): PdpWeaknessProxyInput;
//# sourceMappingURL=pdpWeaknessProxy.d.ts.map