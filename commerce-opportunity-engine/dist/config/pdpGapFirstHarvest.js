/**
 * Milestone 9.8 — PDP-GAP-FIRST ECOMMERCE HARVEST configuration.
 */
export const M98_DISCOVERY_VERSION = "PDP_GAP_FIRST_V1";
export const M98_DISCOVERY_ROUTE = "pdp_gap_first";
/** High-consideration product queries across device + adjacent niches. */
export const M98_PRODUCT_FAMILIES = [
    {
        id: "HAIR_SCALP_TECH",
        label: "Hair & scalp tech",
        archetypeId: "HAIR_SCALP_TECH",
        queries: [
            "laser haargroei helm kopen",
            "LLLT hoofdhuid apparaat kopen",
        ],
    },
    {
        id: "RECOVERY_TECH",
        label: "Recovery tech",
        archetypeId: "WELLNESS_DEVICES",
        queries: [
            "compressie recovery boots kopen",
            "percussie massage gun premium kopen",
        ],
    },
    {
        id: "PERSONAL_CARE_TECH",
        label: "Personal care tech",
        archetypeId: "PERSONAL_CARE_TECH",
        queries: [
            "waterflosser premium kopen",
            "sonic tandenborstel premium kopen",
        ],
    },
    {
        id: "BODY_WELLNESS",
        label: "Body wellness",
        archetypeId: "WELLNESS_DEVICES",
        queries: [
            "rood licht therapie paneel kopen",
            "infrarood sauna blanket kopen",
        ],
    },
    {
        id: "PORTABLE_THERAPY",
        label: "Portable therapy",
        archetypeId: "WELLNESS_DEVICES",
        queries: ["EMS spier stimulator kopen", "portable percussion massager kopen"],
    },
    {
        id: "PREMIUM_KITCHEN",
        label: "Premium kitchen",
        archetypeId: "PERSONAL_CARE_TECH",
        queries: ["premium espressomachine kopen", "specialist koffiemachine kopen"],
    },
    {
        id: "WATER_AIR_TREATMENT",
        label: "Water & air treatment",
        archetypeId: "WELLNESS_DEVICES",
        queries: ["waterfilter onder aanrecht kopen", "luchtreiniger premium kopen"],
    },
];
export const M98_DISCOVERY = {
    milestone: "M9.8",
    maxSourceQueries: 14,
    serpDepth: 50,
    estimatedSerpCostPerKeyword: 0.006,
    maxRawCandidates: 60,
    maxValidPdpScreens: 40,
    maxHighGapBusinessQual: 12,
    maxPaidValidation: 8,
    maxManualReview: 5,
    maxVisionScreens: 40,
    minPriceSoftFilter: 100,
    priceSweetSpotMin: 150,
    priceSweetSpotMax: 750,
    highGapRawThreshold: 58,
    minSufficientMaterials: 55,
    crawlTimeoutMs: 18_000,
    screenshotDir: "m9.8-screenshots",
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
    screenshotTimeoutMs: 30_000,
    paidValidationKeywordsPerDomain: 2,
};
export function buildM98HarvestQueries() {
    const rows = [];
    for (const family of M98_PRODUCT_FAMILIES) {
        for (const query of family.queries) {
            rows.push({
                query,
                familyId: family.id,
                familyLabel: family.label,
                archetypeId: family.archetypeId,
            });
            if (rows.length >= M98_DISCOVERY.maxSourceQueries)
                return rows;
        }
    }
    return rows;
}
//# sourceMappingURL=pdpGapFirstHarvest.js.map