import { logger } from "../../utils/logger.js";
function asRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : null;
}
function asNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function asString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
/**
 * DataForSEO Labs: ranked keywords for a domain, paid items only.
 * @see https://docs.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live/
 */
export async function fetchPaidRankedKeywords(input) {
    const body = [
        {
            target: input.target.replace(/^www\./, ""),
            location_code: input.env.GOOGLE_SERP_LOCATION_CODE,
            language_code: input.env.GOOGLE_SERP_LANGUAGE_CODE,
            item_types: ["paid"],
            limit: input.limit,
            order_by: ["keyword_data.keyword_info.search_volume,desc"],
        },
    ];
    logger.info("DataForSEO Labs ranked_keywords paid request", {
        target: body[0].target,
        limit: input.limit,
        location: input.env.GOOGLE_SERP_LOCATION_CODE,
        language: input.env.GOOGLE_SERP_LANGUAGE_CODE,
    });
    const response = await input.client.post("/dataforseo_labs/google/ranked_keywords/live", body, { timeout: 60000 });
    const data = response.data;
    const task = data.tasks?.[0];
    const cost = task?.cost ?? data.cost ?? 0;
    if (data.status_code && data.status_code !== 20000) {
        throw new Error(`DataForSEO Labs error: ${data.status_message ?? data.status_code} (cost $${cost})`);
    }
    if (task?.status_code && task.status_code !== 20000) {
        throw new Error(`DataForSEO Labs task error: ${task.status_message ?? task.status_code} (cost $${cost})`);
    }
    const result = task?.result?.[0];
    const items = [];
    for (const row of result?.items ?? []) {
        const keywordData = asRecord(row.keyword_data);
        const keywordInfo = asRecord(keywordData?.keyword_info);
        const ranked = asRecord(row.ranked_serp_element);
        const serpItem = asRecord(ranked?.serp_item);
        const serpType = asString(serpItem?.type);
        // Only keep explicit paid SERP elements
        if (serpType && serpType !== "paid") {
            continue;
        }
        const keyword = asString(keywordData?.keyword);
        if (!keyword)
            continue;
        items.push({
            keyword,
            searchVolume: asNumber(keywordInfo?.search_volume),
            cpc: asNumber(keywordInfo?.cpc),
            title: asString(serpItem?.title),
            description: asString(serpItem?.description),
            landingUrl: asString(serpItem?.url),
            domain: asString(serpItem?.domain) ?? asString(serpItem?.main_domain),
            rankGroup: asNumber(serpItem?.rank_group),
            rankAbsolute: asNumber(serpItem?.rank_absolute),
            estimatedPaidTraffic: asNumber(serpItem?.etv),
            estimatedPaidTrafficCost: asNumber(serpItem?.estimated_paid_traffic_cost),
            serpItemType: serpType,
            raw: row,
        });
    }
    logger.info("DataForSEO Labs ranked_keywords paid response", {
        target: input.target,
        cost,
        totalCount: result?.total_count ?? 0,
        itemsCount: items.length,
    });
    return {
        target: input.target,
        cost,
        totalCount: result?.total_count ?? 0,
        itemsCount: items.length,
        items,
        rawTask: task ?? {},
    };
}
//# sourceMappingURL=rankedPaidKeywords.js.map