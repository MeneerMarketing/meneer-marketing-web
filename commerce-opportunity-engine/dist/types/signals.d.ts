export type AdSignalType = "CONFIRMED_PAID" | "PAID_CANDIDATE" | "NON_PAID";
export type BusinessType = "BRAND" | "SPECIALIST_WEBSHOP" | "GENERAL_RETAILER" | "MASS_RETAILER" | "MARKETPLACE" | "COMPARISON_SITE" | "SERVICE_BUSINESS" | "NON_ECOMMERCE" | "UNKNOWN";
export interface SignalClassification {
    adSignalType: AdSignalType;
    paidConfidence: number;
    confirmationSource: string | null;
}
export interface BusinessClassification {
    businessType: BusinessType;
    leadEligible: boolean;
    excludedReason: string | null;
}
export interface PaidSignalWeights {
    confirmedSearchAd: number;
    transparencyConfirmation: number;
    sponsoredShopping: number;
    genericShopping: number;
    popularProducts: number;
}
export declare const DEFAULT_SIGNAL_WEIGHTS: PaidSignalWeights;
export interface TransparencyCheckResult {
    confirmedAdvertiser: boolean;
    adsFound: number;
    formats: string[];
    firstSeen: string | null;
    lastSeen: string | null;
    advertiserIds: string[];
    cost: number;
    rawResponse: Record<string, unknown>;
}
export interface GoogleAdsTransparencyResult {
    domain: string;
    confirmedAdvertiser: boolean;
    adsFound: number;
    formats: string[];
    firstSeen: string | null;
    lastSeen: string | null;
    advertiserIds: string[];
    cost: number;
    /**
     * POSITIVE = ads found.
     * EXPLICIT_NEGATIVE = API unambiguously proves no advertiser data.
     * INCONCLUSIVE = empty / no search results without negative proof.
     */
    evidenceStrength: "POSITIVE" | "EXPLICIT_NEGATIVE" | "INCONCLUSIVE";
}
//# sourceMappingURL=signals.d.ts.map