/**
 * Milestone 9.8.2 — HIGH-TICKET PDP-GAP-FIRST (secondary preset since M9.9).
 *
 * Primary commercial acquisition preset: FOCUSED_BRAND_GAP_FIRST_V1.
 * This config keeps high-ticket price gates for optional high-ticket-only runs.
 */
export const M982_DISCOVERY_VERSION = "HIGH_TICKET_PDP_GAP_FIRST_V1";
export const M982_DISCOVERY_ROUTE = "high_ticket_pdp_gap_first";
export const HIGH_TICKET_GAP_FIRST_TARGET_V1 = "HIGH_TICKET_GAP_FIRST_TARGET_V1";
/** Parked for M9.8.2 — not removed from architecture. */
export const M982_PARKED_FAMILIES = [
    "LOW_TICKET_ORAL_CARE",
    "SLEEP_COMFORT",
    "PET_PRODUCTS",
    "GENERIC_LED_FACE_MASK",
];
export const M982_PRODUCT_QUERIES = [
    {
        query: "laser haargroei helm kopen",
        familyId: "HAIR_SCALP_TECH",
        familyLabel: "Hair & scalp tech",
        archetypeId: "HAIR_SCALP_TECH",
        productArchetype: "laser_hair_growth_helmet",
        expectedPriceBand: "750_2500",
        deepDiveRationale: "High-ticket LLLT helmet, strong storytelling and clinical narrative.",
        lineage: "M982_HAIR_SCALP",
    },
    {
        query: "LLLT hoofdhuid therapie apparaat kopen",
        familyId: "HAIR_SCALP_TECH",
        familyLabel: "Hair & scalp tech",
        archetypeId: "HAIR_SCALP_TECH",
        productArchetype: "lllt_scalp_device",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Mechanism-led scalp tech query, avoids generic category intent.",
        lineage: "M982_HAIR_SCALP",
    },
    {
        query: "laser cap haarverlies kopen",
        familyId: "HAIR_SCALP_TECH",
        familyLabel: "Hair & scalp tech",
        archetypeId: "HAIR_SCALP_TECH",
        productArchetype: "laser_cap",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Compact hero-product format with premium price potential.",
        lineage: "M982_HAIR_SCALP",
    },
    {
        query: "compressie recovery boots kopen",
        familyId: "RECOVERY_TECH",
        familyLabel: "Recovery tech",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "compression_recovery_boots",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Premium recovery device, clear PDP transformation story.",
        lineage: "M982_RECOVERY",
    },
    {
        query: "premium percussie massage gun kopen",
        familyId: "RECOVERY_TECH",
        familyLabel: "Recovery tech",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "percussion_massager",
        expectedPriceBand: "100_149",
        deepDiveRationale: "Upper-tier massage guns often €150+; filters commodity listings.",
        lineage: "M982_RECOVERY",
    },
    {
        query: "warm koud therapie apparaat kopen",
        familyId: "RECOVERY_TECH",
        familyLabel: "Recovery tech",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "heat_cold_therapy",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Contrast therapy systems support high-consideration PDPs.",
        lineage: "M982_RECOVERY",
    },
    {
        query: "rood licht therapie paneel full body kopen",
        familyId: "BODY_WELLNESS",
        familyLabel: "Body wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "red_light_body_panel",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Full-body panels are premium, visual, and content-rich.",
        lineage: "M982_BODY_WELLNESS",
    },
    {
        query: "infrarood wellness lamp therapie kopen",
        familyId: "BODY_WELLNESS",
        familyLabel: "Body wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "infrared_wellness_lamp",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Specialist infrared systems, not commodity bulbs.",
        lineage: "M982_BODY_WELLNESS",
    },
    {
        query: "nabij infrarood sauna blanket kopen",
        familyId: "BODY_WELLNESS",
        familyLabel: "Body wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "infrared_sauna_blanket",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Premium home wellness with strong before/after visuals.",
        lineage: "M982_BODY_WELLNESS",
    },
    {
        query: "RF huidverstrakking apparaat kopen",
        familyId: "BEAUTY_PERSONAL_TECH",
        familyLabel: "Beauty personal tech",
        archetypeId: "PERSONAL_CARE_TECH",
        productArchetype: "rf_skin_tightening",
        expectedPriceBand: "150_750",
        deepDiveRationale: "RF devices are high-ticket with feature-heavy PDP potential.",
        lineage: "M982_BEAUTY_TECH",
    },
    {
        query: "microcurrent gezicht apparaat kopen",
        familyId: "BEAUTY_PERSONAL_TECH",
        familyLabel: "Beauty personal tech",
        archetypeId: "PERSONAL_CARE_TECH",
        productArchetype: "microcurrent_facial",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Microcurrent systems support deep-dive education PDPs.",
        lineage: "M982_BEAUTY_TECH",
    },
    {
        query: "professional huidbehandeling device kopen",
        familyId: "BEAUTY_PERSONAL_TECH",
        familyLabel: "Beauty personal tech",
        archetypeId: "PERSONAL_CARE_TECH",
        productArchetype: "professional_treatment_device",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Pro-grade treatment tech, avoids consumer commodity masks.",
        lineage: "M982_BEAUTY_TECH",
    },
    {
        query: "premium waterfilter onder aanrecht kopen",
        familyId: "HOME_WELLNESS",
        familyLabel: "Home wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "under_sink_water_filter",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Installed premium filters are high-consideration ecommerce.",
        lineage: "M982_HOME_WELLNESS",
    },
    {
        query: "luchtreiniger premium kopen",
        familyId: "HOME_WELLNESS",
        familyLabel: "Home wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "premium_air_purifier",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Premium air systems with spec-heavy PDP opportunity.",
        lineage: "M982_HOME_WELLNESS",
    },
    {
        query: "ozon water generator kopen",
        familyId: "HOME_WELLNESS",
        familyLabel: "Home wellness",
        archetypeId: "WELLNESS_DEVICES",
        productArchetype: "ozone_water_system",
        expectedPriceBand: "150_750",
        deepDiveRationale: "Niche premium water-treatment device category.",
        lineage: "M982_HOME_WELLNESS",
    },
];
export const M982_DISCOVERY = {
    milestone: "M9.8.2",
    targetProfile: HIGH_TICKET_GAP_FIRST_TARGET_V1,
    maxSourceQueries: 16,
    serpDepth: 50,
    estimatedSerpCostPerKeyword: 0.006,
    maxRawCandidates: 70,
    maxValidPdpScreens: 50,
    maxHighGapBusinessQual: 14,
    maxPaidValidation: 8,
    maxPreAuditFinalists: 5,
    maxVisionScreens: 12,
    priceHardRejectBelow: 60,
    priceSoftMin: 100,
    priceSweetSpotMin: 150,
    priceSweetSpotMax: 750,
    pricePremiumMax: 2500,
    highGapVisualOrPurchase: 60,
    highGapPurchaseMobile: 65,
    showcaseVisualMin: 50,
    showcaseSecondaryMin: 60,
    showcaseGapFinalistMin: 70,
    materialFinalistMin: 65,
    earlySuccessCount: 3,
    maxCroOnlyOpportunities: 5,
    crawlTimeoutMs: 18_000,
    screenshotDir: "m9.8-screenshots",
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
    screenshotTimeoutMs: 30_000,
    paidValidationKeywordsPerDomain: 2,
};
export function buildM982HarvestQueries() {
    return M982_PRODUCT_QUERIES.slice(0, M982_DISCOVERY.maxSourceQueries);
}
export const M983_DISCOVERY_VERSION = "HIGH_TICKET_GAP_COMPLETION_V1";
export const HAIR_SCALP_M983_STATUS = "CALIBRATED_PURCHASE_HEAVY_LOW_VISUAL";
export const M983_DISCOVERY = {
    ...M982_DISCOVERY,
    milestone: "M9.8.3",
    maxRawCandidates: 50,
    maxValidPdpScreens: 50,
    maxCroOnlyOpportunities: 5,
};
export function inferExecutedQueriesFromCount(count) {
    return M982_PRODUCT_QUERIES.slice(0, count).map((q) => q.query);
}
export function buildM983CompletionQueries(executedQueries) {
    return M982_PRODUCT_QUERIES.filter((q) => !executedQueries.has(q.query) &&
        q.familyId !== "HAIR_SCALP_TECH");
}
//# sourceMappingURL=highTicketPdpGapFirst.js.map