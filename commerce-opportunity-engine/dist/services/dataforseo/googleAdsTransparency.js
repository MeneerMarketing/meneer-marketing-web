import { logger } from "../../utils/logger.js";
import { withRetry } from "../../utils/retry.js";
const ADS_SEARCH_LIVE_ADVANCED_PATH = "/serp/google/ads_search/live/advanced";
function asRecord(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return {};
}
function parseTransparencyResponse(responseData) {
    const task = responseData.tasks?.[0];
    if (!task) {
        throw new Error("DataForSEO Ads Search response missing tasks array");
    }
    if (task.status_code !== 20000) {
        const msg = task.status_message ?? "DataForSEO Ads Search task failed";
        // "No Search Results" is inconclusive — not explicit negative proof.
        if (/no search results/i.test(msg)) {
            const cost = task.cost ?? responseData.cost ?? 0;
            return {
                confirmedAdvertiser: false,
                adsFound: 0,
                formats: [],
                firstSeen: null,
                lastSeen: null,
                advertiserIds: [],
                cost,
                evidenceStrength: "INCONCLUSIVE",
                rawResponse: asRecord(responseData),
            };
        }
        throw new Error(msg);
    }
    const items = task.result?.[0]?.items ?? [];
    const adsItems = items.filter((item) => item.type === "ads_search");
    const advertiserIds = [
        ...new Set(adsItems
            .map((item) => item.advertiser_id)
            .filter((id) => typeof id === "string" && id.length > 0)),
    ];
    const formats = [
        ...new Set(adsItems
            .map((item) => item.format)
            .filter((format) => typeof format === "string" && format.length > 0)),
    ];
    let firstSeen = null;
    let lastSeen = null;
    for (const item of adsItems) {
        if (item.first_shown && (!firstSeen || item.first_shown < firstSeen)) {
            firstSeen = item.first_shown;
        }
        if (item.last_shown && (!lastSeen || item.last_shown > lastSeen)) {
            lastSeen = item.last_shown;
        }
    }
    const cost = task.cost ?? responseData.cost ?? 0;
    const confirmed = adsItems.length > 0;
    return {
        confirmedAdvertiser: confirmed,
        adsFound: adsItems.length,
        formats,
        firstSeen,
        lastSeen,
        advertiserIds,
        cost,
        // Empty successful payload without ads is inconclusive, not NOT_CONFIRMED.
        evidenceStrength: confirmed ? "POSITIVE" : "INCONCLUSIVE",
        rawResponse: asRecord(responseData),
    };
}
export async function checkGoogleAdsTransparency(options, domain) {
    const { client, env } = options;
    const payload = [
        {
            target: domain,
            location_code: env.GOOGLE_SERP_LOCATION_CODE,
            depth: 40,
            platform: "all",
        },
    ];
    const responseData = await withRetry(async () => {
        const response = await client.post(ADS_SEARCH_LIVE_ADVANCED_PATH, payload);
        const data = response.data;
        if (data.status_code !== undefined && data.status_code !== 20000) {
            throw new Error(data.status_message ?? "DataForSEO Ads Search request failed");
        }
        return data;
    }, { maxAttempts: 2, delayMs: 1000, backoffFactor: 2 });
    const parsed = parseTransparencyResponse(responseData);
    logger.info("Google Ads Transparency checked", {
        domain,
        adsFound: parsed.adsFound,
        confirmed: parsed.confirmedAdvertiser,
        cost: parsed.cost,
    });
    return {
        domain,
        ...parsed,
    };
}
//# sourceMappingURL=googleAdsTransparency.js.map