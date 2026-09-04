/**
 * Milestone 9 — product commercial signal (not revenue). Observable signals only.
 */
export type CommercialSignalInput = {
    price: number | null;
    reviewCount: number | null;
    rating: number | null;
    paidOrDiscoveryRelevant: boolean;
    heroProminenceScore: number | null;
    availability: string | null;
    descriptionLength: number;
    variantCountEstimate: number | null;
    purchaseIntentKeyword: boolean;
};
export declare function scoreProductCommercialSignal(input: CommercialSignalInput): {
    product_commercial_signal_score: number;
    evidence: string[];
};
//# sourceMappingURL=productCommercialSignal.d.ts.map