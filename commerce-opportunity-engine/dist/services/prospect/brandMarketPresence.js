/**
 * Milestone 9.7 — brand market presence from independent third-party sources.
 */
export function computeBrandMarketPresenceScore(observations) {
    const uniqueDomains = new Set();
    const uniqueTypes = new Set();
    let qualityBoost = 0;
    const evidence = [];
    for (const obs of observations) {
        uniqueDomains.add(obs.sourceDomain);
        uniqueTypes.add(obs.sourceType);
        if (obs.discoverySourceQuality === "HIGH")
            qualityBoost += 3;
        else if (obs.discoverySourceQuality === "MEDIUM")
            qualityBoost += 1;
    }
    const count = uniqueDomains.size;
    let score = 20;
    if (count >= 5) {
        score = 88;
        evidence.push("five_plus_independent_sources");
    }
    else if (count >= 3) {
        score = 72;
        evidence.push("three_plus_independent_sources");
    }
    else if (count === 2) {
        score = 55;
        evidence.push("two_independent_sources");
    }
    else if (count === 1) {
        score = 35;
        evidence.push("single_source");
    }
    score = Math.min(100, score + Math.min(12, qualityBoost));
    if (uniqueTypes.size >= 2) {
        score = Math.min(100, score + 6);
        evidence.push("multi_source_type");
    }
    return {
        score,
        independentSourceCount: count,
        evidence,
    };
}
//# sourceMappingURL=brandMarketPresence.js.map