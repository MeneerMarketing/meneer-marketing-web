/**
 * Milestone 9.5 — cheap pre-audit purchase / buyblock gap (0-100).
 *
 * Higher score = weaker current purchase experience, more room for CRO uplift.
 */
export type PreauditPurchaseGapInput = {
    html: string;
    hasAddToCart: boolean;
    hasPrice: boolean;
    hasReviews: boolean;
    benefitsPresent: boolean;
    faqPresent: boolean;
    variantSelectors: number;
    paymentIcons: number;
    shippingMentions: number;
    stickyAtcSignal: boolean;
    mobileAtcSignal: boolean;
};
export declare function computePreauditPurchaseGap(input: PreauditPurchaseGapInput): {
    score: number;
    evidence: string[];
};
export declare function extractPurchaseGapSignals(html: string): Omit<PreauditPurchaseGapInput, "html">;
//# sourceMappingURL=preauditPurchaseGap.d.ts.map