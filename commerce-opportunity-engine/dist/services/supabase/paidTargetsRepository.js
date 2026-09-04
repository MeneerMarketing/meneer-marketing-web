import { freshnessLabel, scoreLabsPaidTarget, scoreShoppingPaidTarget, } from "../scoring/sourceQualityV2.js";
import { CRO_READY_MIN_SOURCE_QUALITY } from "../../config/sourceIntegrityWeights.js";
export function normalizeLandingUrl(url) {
    if (!url)
        return null;
    try {
        const parsed = new URL(url);
        parsed.hash = "";
        const drop = new Set([
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
            "gclid",
            "fbclid",
            "msclkid",
            "yclid",
            "srsltid",
            "gad_source",
            "gad_campaignid",
            "gbraid",
            "wbraid",
        ]);
        for (const key of [...parsed.searchParams.keys()]) {
            if (drop.has(key.toLowerCase()))
                parsed.searchParams.delete(key);
        }
        parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
        parsed.pathname = (parsed.pathname.replace(/\/+$/, "") || "/").toLowerCase();
        return parsed.toString();
    }
    catch {
        return url.trim();
    }
}
export async function upsertPaidSearchTargets(input) {
    let upserted = 0;
    const croReadyLandings = new Set();
    for (const item of input.items) {
        const landingUrl = normalizeLandingUrl(item.landingUrl);
        const scored = scoreLabsPaidTarget({
            landingUrl,
            title: item.title,
            keyword: item.keyword,
        });
        const dedupeKey = `${input.brandId}|SEARCH|LABS|${item.keyword.toLowerCase()}|${landingUrl ?? ""}`;
        const row = {
            brand_id: input.brandId,
            keyword: item.keyword,
            dedupe_key: dedupeKey,
            channel: "SEARCH",
            source_type: scored.sourceType,
            source_quality_score: scored.sourceQualityScore,
            ad_title: item.title,
            ad_description: item.description,
            landing_url: landingUrl,
            rank_group: item.rankGroup,
            rank_absolute: item.rankAbsolute,
            search_volume: item.searchVolume,
            cpc: item.cpc,
            estimated_paid_traffic: item.estimatedPaidTraffic,
            estimated_paid_traffic_cost: item.estimatedPaidTrafficCost,
            source_provider: "dataforseo_labs",
            source_observed_at: input.observedAt,
            source_data_freshness: freshnessLabel(input.observedAt),
            data_updated_at: input.observedAt,
            raw_payload: item.raw,
            updated_at: input.observedAt,
        };
        const { error } = await input.client.from("paid_search_targets").upsert(row, {
            onConflict: "dedupe_key",
        });
        if (error) {
            // Alternate unique index may already hold this brand+keyword+url.
            if (/duplicate key|idx_paid_search_targets_brand_kw_url/i.test(error.message)) {
                const { error: updateErr } = await input.client
                    .from("paid_search_targets")
                    .update({
                    source_quality_score: scored.sourceQualityScore,
                    ad_title: item.title,
                    ad_description: item.description,
                    rank_group: item.rankGroup,
                    rank_absolute: item.rankAbsolute,
                    search_volume: item.searchVolume,
                    cpc: item.cpc,
                    source_observed_at: input.observedAt,
                    data_updated_at: input.observedAt,
                    updated_at: input.observedAt,
                    raw_payload: item.raw,
                })
                    .eq("brand_id", input.brandId)
                    .eq("keyword", item.keyword)
                    .eq("landing_url", landingUrl);
                if (updateErr) {
                    throw new Error(`Failed to upsert paid_search_target: ${error.message}`);
                }
            }
            else {
                throw new Error(`Failed to upsert paid_search_target: ${error.message}`);
            }
        }
        upserted += 1;
        if (scored.croReady && landingUrl) {
            croReadyLandings.add(landingUrl);
        }
    }
    return { upserted, croReadyLandingCount: croReadyLandings.size };
}
export async function upsertShoppingPaidTarget(client, input) {
    const landingUrl = normalizeLandingUrl(input.landingUrl);
    const scored = scoreShoppingPaidTarget({
        landingUrl,
        title: input.title,
        keyword: input.keyword,
        resolvedAdUrl: input.resolvedAdUrl,
        domainMatched: input.domainMatched,
        itemType: input.itemType,
        shopAdAclk: input.shopAdAclk,
        adUrl: input.adUrl,
        seller: input.seller,
        productId: input.productId,
    });
    const dedupeKey = `${input.brandId}|SHOPPING|${input.itemType}|${input.keyword.toLowerCase()}|${landingUrl ?? ""}|${input.shopAdAclk ?? ""}`;
    const row = {
        brand_id: input.brandId,
        keyword: input.keyword,
        keyword_id: input.keywordId,
        dedupe_key: dedupeKey,
        channel: "SHOPPING",
        source_type: scored.sourceType,
        source_quality_score: scored.sourceQualityScore,
        listing_target_confidence: scored.listingTargetConfidence,
        paid_evidence_confidence: scored.paidEvidenceConfidence,
        cro_readiness_level: scored.croReadinessLevel,
        merchant_item_type: input.itemType,
        ad_title: input.title,
        ad_description: input.description,
        landing_url: landingUrl,
        seller: input.seller,
        seller_domain: input.sellerDomain,
        price: input.price,
        currency: input.currency,
        rank_group: input.rankGroup,
        rank_absolute: input.rankAbsolute,
        shop_ad_aclk: input.shopAdAclk,
        ad_url: input.adUrl,
        ad_url_redirects: input.adUrlRedirects,
        product_id: input.productId,
        data_docid: input.dataDocid,
        domain_match_status: input.domainMatchStatus,
        data_quality_issues: input.dataQualityIssues,
        source_provider: "dataforseo_merchant_shopping",
        source_observed_at: input.observedAt,
        source_data_freshness: freshnessLabel(input.observedAt),
        data_updated_at: input.observedAt,
        raw_payload: input.rawPayload,
        updated_at: input.observedAt,
    };
    const { data, error } = await client
        .from("paid_search_targets")
        .upsert(row, { onConflict: "dedupe_key" })
        .select("id")
        .maybeSingle();
    if (error) {
        throw new Error(`Failed to upsert shopping paid target: ${error.message}`);
    }
    return {
        id: data.id,
        croReady: scored.croReady,
        sourceQualityScore: scored.sourceQualityScore,
        sourceType: scored.sourceType,
        croReadinessLevel: scored.croReadinessLevel,
        listingTargetConfidence: scored.listingTargetConfidence ?? null,
        paidEvidenceConfidence: scored.paidEvidenceConfidence ?? null,
        domainMatched: input.domainMatched,
    };
}
async function buildSourceEvidence(client, brandId, landingUrl) {
    const { data: brand } = await client
        .from("brands")
        .select("transparency_confirmed, confirmed_google_advertiser")
        .eq("id", brandId)
        .maybeSingle();
    const { data: targets } = await client
        .from("paid_search_targets")
        .select("channel, source_type, keyword, ad_title, seller, price, currency, landing_url, source_quality_score")
        .eq("brand_id", brandId)
        .eq("landing_url", landingUrl);
    const searchHit = (targets ?? []).find((t) => t.channel === "SEARCH" &&
        (t.source_type === "LABS_PAID_KEYWORD" || t.source_type === "LIVE_PAID_SERP"));
    const shoppingHit = (targets ?? []).find((t) => t.channel === "SHOPPING" &&
        (t.source_type === "GOOGLE_SHOPPING_PAID_EXACT" ||
            t.source_type === "GOOGLE_SHOPPING_EXACT_LISTING" ||
            t.source_type === "GOOGLE_SHOPPING_FREE_LISTING"));
    const { data: discoveryOpp } = await client
        .from("opportunities")
        .select("id, source_type, ground_truth_source_type")
        .eq("brand_id", brandId)
        .or("source_type.eq.POPULAR_PRODUCTS_CANDIDATE,ground_truth_source_type.eq.POPULAR_PRODUCTS_CANDIDATE")
        .limit(1)
        .maybeSingle();
    return {
        transparency: Boolean(brand?.transparency_confirmed || brand?.confirmed_google_advertiser),
        paidSearch: searchHit
            ? {
                status: "exact",
                sourceType: searchHit.source_type,
                keyword: searchHit.keyword,
                landingUrl: searchHit.landing_url,
            }
            : { status: "not_found" },
        paidShopping: shoppingHit
            ? {
                status: shoppingHit.source_type === "GOOGLE_SHOPPING_PAID_EXACT"
                    ? "exact"
                    : shoppingHit.source_type === "GOOGLE_SHOPPING_EXACT_LISTING"
                        ? "exact_listing"
                        : shoppingHit.source_type === "GOOGLE_SHOPPING_FREE_LISTING"
                            ? "free_listing"
                            : "not_found",
                sourceType: shoppingHit.source_type,
                keyword: shoppingHit.keyword,
                productTitle: shoppingHit.ad_title,
                seller: shoppingHit.seller,
                price: shoppingHit.price,
                currency: shoppingHit.currency,
                landingUrl: shoppingHit.landing_url,
            }
            : { status: "not_found" },
        discovery: {
            popularProductsCandidate: Boolean(discoveryOpp),
        },
    };
}
/**
 * Upsert CRO-ready opportunity for an exact paid landing URL.
 * Merges Search + Shopping evidence onto one opportunity (no duplicates).
 */
export async function upsertCroReadyOpportunityFromTarget(input) {
    const client = input.client;
    const landingUrl = normalizeLandingUrl(input.landingUrl);
    if (!landingUrl) {
        throw new Error("Cannot create CRO opportunity without landing URL");
    }
    const isExactPaid = input.sourceType === "LIVE_PAID_SERP" ||
        input.sourceType === "LABS_PAID_KEYWORD" ||
        input.sourceType === "GOOGLE_SHOPPING_PAID_EXACT";
    const isHighConfTarget = input.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING";
    if (isExactPaid && input.sourceQualityScore < CRO_READY_MIN_SOURCE_QUALITY) {
        throw new Error("Source quality below CRO-ready threshold");
    }
    if (!isExactPaid && !isHighConfTarget) {
        throw new Error("Source type not eligible for target opportunity upsert");
    }
    const croReadinessLevel = input.croReadinessLevel ??
        (isExactPaid ? "EXACT_PAID_FUNNEL" : "HIGH_CONFIDENCE_TARGET");
    const croReady = croReadinessLevel === "EXACT_PAID_FUNNEL";
    const targetKey = `paid:${landingUrl}`;
    const now = new Date().toISOString();
    const evidence = await buildSourceEvidence(client, input.brandId, landingUrl);
    if (input.channel === "SHOPPING") {
        evidence.paidShopping = {
            status: isExactPaid
                ? "exact"
                : isHighConfTarget
                    ? "exact_listing"
                    : "not_found",
            sourceType: input.sourceType,
            keyword: input.keyword,
            productTitle: input.adTitle ?? undefined,
            landingUrl,
        };
    }
    else {
        evidence.paidSearch = {
            status: "exact",
            sourceType: input.sourceType,
            keyword: input.keyword,
            landingUrl,
        };
    }
    const { data: pages } = await client
        .from("pages")
        .select("id, final_url, url, product_resolution_confidence")
        .eq("brand_id", input.brandId);
    const page = (pages ?? []).find((p) => normalizeLandingUrl(p.final_url) === landingUrl ||
        normalizeLandingUrl(p.url) === landingUrl) ?? null;
    const { data: existing } = await client
        .from("opportunities")
        .select("id, source_evidence, supporting_ad_count, source_quality_score, ground_truth_source_type")
        .eq("brand_id", input.brandId)
        .eq("target_key", targetKey)
        .maybeSingle();
    const prevEvidence = (existing?.source_evidence ?? {});
    const mergedEvidence = {
        transparency: evidence.transparency || Boolean(prevEvidence.transparency),
        paidSearch: evidence.paidSearch.status === "exact"
            ? evidence.paidSearch
            : prevEvidence.paidSearch?.status === "exact"
                ? prevEvidence.paidSearch
                : { status: "not_found" },
        paidShopping: evidence.paidShopping.status !== "not_found"
            ? evidence.paidShopping
            : prevEvidence.paidShopping && prevEvidence.paidShopping.status !== "not_found"
                ? prevEvidence.paidShopping
                : { status: "not_found" },
        discovery: {
            popularProductsCandidate: evidence.discovery.popularProductsCandidate ||
                Boolean(prevEvidence.discovery?.popularProductsCandidate),
        },
    };
    const prevQuality = Number(existing?.source_quality_score ?? 0);
    const bestQuality = Math.max(prevQuality, input.sourceQualityScore);
    const hierarchyRank = {
        LIVE_PAID_SERP: 100,
        GOOGLE_SHOPPING_PAID_EXACT: 95,
        LABS_PAID_KEYWORD: 90,
        GOOGLE_SHOPPING_EXACT_LISTING: 70,
        GOOGLE_SHOPPING_FREE_LISTING: 40,
    };
    const prevGround = existing?.ground_truth_source_type ?? "";
    const groundTruth = (hierarchyRank[input.sourceType] ?? 0) >= (hierarchyRank[prevGround] ?? 0)
        ? input.sourceType
        : prevGround || input.sourceType;
    const row = {
        brand_id: input.brandId,
        paid_search_target_id: input.targetId,
        keyword_id: input.keywordId,
        landing_url: landingUrl,
        resolved_url: landingUrl,
        resolved_page_id: page?.id ?? null,
        target_key: targetKey,
        ad_headline: input.adTitle,
        ad_description: input.adDescription,
        source: input.channel === "SHOPPING"
            ? "dataforseo_merchant_shopping"
            : "dataforseo_labs_ranked_keywords",
        paid_signal_type: isExactPaid ? "CONFIRMED_PAID" : "PAID_CANDIDATE",
        paid_confirmed: isExactPaid || Boolean(prevEvidence.transparency),
        product_resolution_confidence: page?.product_resolution_confidence ?? null,
        supporting_ad_count: Number(existing?.supporting_ad_count ?? 0) + (existing ? 0 : 1),
        source_quality_score: bestQuality,
        source_type: groundTruth,
        ground_truth_source_type: groundTruth,
        discovery_serp_item_type: input.discoverySerpItemType,
        discovery_confirmation_source: input.confirmationSource,
        primary_keyword_confidence: Math.min(100, bestQuality),
        primary_keyword_reason: input.channel === "SHOPPING"
            ? isExactPaid
                ? "google_shopping_paid_exact_landing"
                : "google_shopping_exact_listing"
            : "labs_paid_keyword_exact_landing",
        cro_ready: croReady,
        cro_readiness_level: croReadinessLevel,
        listing_target_confidence: input.listingTargetConfidence ?? null,
        paid_evidence_confidence: input.paidEvidenceConfidence ?? null,
        paid_target_status: croReady
            ? "RESOLVED"
            : croReadinessLevel === "HIGH_CONFIDENCE_TARGET"
                ? "EXACT_LISTING"
                : "DISCOVERY",
        source_evidence: mergedEvidence,
        last_seen_at: now,
        source_validated_at: now,
        updated_at: now,
    };
    let opportunityId;
    let created = false;
    if (existing?.id) {
        const { error } = await client.from("opportunities").update(row).eq("id", existing.id);
        if (error)
            throw new Error(error.message);
        opportunityId = existing.id;
    }
    else {
        const { data: inserted, error } = await client
            .from("opportunities")
            .insert({ ...row, status: "NEW", first_seen_at: now })
            .select("id")
            .maybeSingle();
        if (error)
            throw new Error(error.message);
        opportunityId = inserted.id;
        created = true;
    }
    if (input.keywordId) {
        await client.from("opportunity_keywords").upsert({
            opportunity_id: opportunityId,
            keyword_id: input.keywordId,
        });
        await client
            .from("opportunities")
            .update({ keyword_id: input.keywordId })
            .eq("id", opportunityId);
    }
    return { opportunityId, created };
}
/**
 * Build CRO-ready opportunities from paid_search_targets with concrete landing URLs.
 * Does NOT attach arbitrary brand products. Does NOT run Claude.
 */
export async function generateOpportunitiesFromPaidTargets(client, brandId) {
    const { data: targets, error } = await client
        .from("paid_search_targets")
        .select("*")
        .eq("brand_id", brandId)
        .in("source_type", [
        "LABS_PAID_KEYWORD",
        "GOOGLE_SHOPPING_PAID_EXACT",
        "LIVE_PAID_SERP",
    ])
        .not("landing_url", "is", null)
        .gte("source_quality_score", CRO_READY_MIN_SOURCE_QUALITY);
    if (error)
        throw new Error(error.message);
    const byLanding = new Map();
    for (const t of targets ?? []) {
        const url = t.landing_url;
        const list = byLanding.get(url) ?? [];
        list.push(t);
        byLanding.set(url, list);
    }
    let opportunitiesUpserted = 0;
    let croReady = 0;
    for (const [landingUrl, group] of byLanding) {
        const primary = [...group].sort((a, b) => {
            const rank = (s) => s === "LIVE_PAID_SERP"
                ? 3
                : s === "GOOGLE_SHOPPING_PAID_EXACT"
                    ? 2
                    : s === "LABS_PAID_KEYWORD"
                        ? 1
                        : 0;
            const r = rank(String(b.source_type)) - rank(String(a.source_type));
            if (r !== 0)
                return r;
            return Number(b.source_quality_score ?? 0) - Number(a.source_quality_score ?? 0);
        })[0];
        const channel = primary.channel === "SHOPPING" ? "SHOPPING" : "SEARCH";
        await upsertCroReadyOpportunityFromTarget({
            client,
            brandId,
            targetId: primary.id,
            keyword: primary.keyword,
            keywordId: primary.keyword_id ?? null,
            landingUrl,
            adTitle: primary.ad_title ?? null,
            adDescription: primary.ad_description ?? null,
            sourceType: primary.source_type,
            sourceQualityScore: Number(primary.source_quality_score ?? 0),
            channel,
            discoverySerpItemType: channel === "SHOPPING" ? "google_shopping_paid" : "paid",
            confirmationSource: channel === "SHOPPING"
                ? "dataforseo_merchant_shopping"
                : "dataforseo_labs_ranked_keywords",
        });
        opportunitiesUpserted += 1;
        croReady += 1;
    }
    return { opportunitiesUpserted, croReady };
}
export async function markBrandWaitingForPaidTarget(client, brandId, paidTargetsCount) {
    const now = new Date().toISOString();
    await client
        .from("brands")
        .update({
        paid_target_status: paidTargetsCount > 0 ? "PARTIAL" : "NOT_RESOLVED",
        paid_targets_count: paidTargetsCount,
        paid_targets_resolved_at: now,
        updated_at: now,
    })
        .eq("id", brandId);
}
//# sourceMappingURL=paidTargetsRepository.js.map