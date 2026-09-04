import { DEFAULT_SIGNAL_WEIGHTS } from "../types/signals.js";
export function loadSignalWeights() {
    return {
        confirmedSearchAd: parseWeight(process.env.SIGNAL_WEIGHT_CONFIRMED_SEARCH_AD, DEFAULT_SIGNAL_WEIGHTS.confirmedSearchAd),
        transparencyConfirmation: parseWeight(process.env.SIGNAL_WEIGHT_TRANSPARENCY, DEFAULT_SIGNAL_WEIGHTS.transparencyConfirmation),
        sponsoredShopping: parseWeight(process.env.SIGNAL_WEIGHT_SPONSORED_SHOPPING, DEFAULT_SIGNAL_WEIGHTS.sponsoredShopping),
        genericShopping: parseWeight(process.env.SIGNAL_WEIGHT_GENERIC_SHOPPING, DEFAULT_SIGNAL_WEIGHTS.genericShopping),
        popularProducts: parseWeight(process.env.SIGNAL_WEIGHT_POPULAR_PRODUCTS, DEFAULT_SIGNAL_WEIGHTS.popularProducts),
    };
}
function parseWeight(value, fallback) {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
//# sourceMappingURL=signalWeights.js.map