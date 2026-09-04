/**
 * Milestone 9.9.2 — current_visual_quality_score bands.
 */
export function visualQualityBand(score) {
    if (score == null || !Number.isFinite(score))
        return "UNKNOWN";
    if (score < 30)
        return "VERY_WEAK";
    if (score < 45)
        return "WEAK";
    if (score < 60)
        return "MODERATE";
    if (score < 75)
        return "GOOD";
    return "STRONG";
}
export function isVisuallyUnderdesigned(currentVisualQuality, threshold = 55) {
    if (currentVisualQuality == null)
        return false;
    return currentVisualQuality < threshold;
}
export function serpPositionBandExtended(rank) {
    if (rank == null || !Number.isFinite(rank))
        return "UNKNOWN";
    if (rank <= 10)
        return "TOP_10";
    if (rank <= 20)
        return "11_20";
    if (rank <= 50)
        return "21_50";
    if (rank <= 100)
        return "51_100";
    return "101_PLUS";
}
//# sourceMappingURL=visualQualityScore.js.map