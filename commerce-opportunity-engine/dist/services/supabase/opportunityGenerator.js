function normalizeTargetUrl(url) {
    if (!url) {
        return null;
    }
    try {
        const parsed = new URL(url);
        parsed.hash = "";
        // Drop tracking params; keep product/variant identity
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
            if (drop.has(key.toLowerCase())) {
                parsed.searchParams.delete(key);
            }
        }
        let path = parsed.pathname.replace(/\/+$/, "") || "/";
        parsed.pathname = path.toLowerCase();
        parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
        return parsed.toString();
    }
    catch {
        return url.trim().toLowerCase();
    }
}
function isHomepageUrl(url) {
    if (!url)
        return true;
    try {
        const path = new URL(url).pathname.replace(/\/+$/, "") || "/";
        return path === "/";
    }
    catch {
        return false;
    }
}
/**
 * Group ad occurrences into opportunities:
 * same brand + same normalized landing/product target = one opportunity.
 * Homepage landings for a brand with a resolved PRODUCT page attach that page.
 */
export async function generateOpportunitiesFromAds(client) {
    const { data: ads, error: adsError } = await client
        .from("ad_occurrences")
        .select("id, brand_id, keyword_id, landing_url, headline, description, source, ad_signal_type, serp_item_type, found_at, observed_at, confirmation_source")
        .not("brand_id", "is", null)
        .order("found_at", { ascending: true });
    if (adsError) {
        throw new Error(`Failed to load ad_occurrences: ${adsError.message}`);
    }
    const { data: brands, error: brandsError } = await client
        .from("brands")
        .select("id, confirmed_google_advertiser, transparency_confirmed, manual_excluded, eligibility_status, lead_eligible");
    if (brandsError) {
        throw new Error(`Failed to load brands: ${brandsError.message}`);
    }
    const brandPaid = new Map((brands ?? []).map((b) => [
        b.id,
        Boolean(b.confirmed_google_advertiser || b.transparency_confirmed),
    ]));
    const excludedBrandIds = new Set((brands ?? [])
        .filter((b) => Boolean(b.manual_excluded) ||
        b.eligibility_status === "EXCLUDED")
        .map((b) => b.id));
    const { data: pages, error: pagesError } = await client
        .from("pages")
        .select("id, brand_id, url, final_url, product_resolution_confidence, page_type")
        .eq("page_type", "PRODUCT")
        .not("brand_id", "is", null)
        .order("product_resolution_confidence", { ascending: false });
    if (pagesError) {
        throw new Error(`Failed to load pages: ${pagesError.message}`);
    }
    const bestProductByBrand = new Map();
    for (const page of pages ?? []) {
        const brandId = page.brand_id;
        if (!bestProductByBrand.has(brandId)) {
            bestProductByBrand.set(brandId, {
                id: page.id,
                url: page.url,
                final_url: page.final_url,
                product_resolution_confidence: page.product_resolution_confidence,
                page_type: page.page_type,
            });
        }
    }
    const clusters = new Map();
    let skippedNoBrand = 0;
    let skippedExcludedBrand = 0;
    for (const raw of (ads ?? [])) {
        if (!raw.brand_id) {
            skippedNoBrand += 1;
            continue;
        }
        if (excludedBrandIds.has(raw.brand_id)) {
            skippedExcludedBrand += 1;
            continue;
        }
        const landingNorm = normalizeTargetUrl(raw.landing_url);
        const productPage = bestProductByBrand.get(raw.brand_id);
        const serp = (raw.serp_item_type ?? "").toLowerCase();
        const isShoppingCarousel = serp === "popular_products" ||
            serp === "shopping" ||
            (raw.confirmation_source ?? "").includes("popular_products") ||
            (raw.confirmation_source ?? "").includes("shopping");
        let targetKey;
        let resolvedUrl = landingNorm;
        let resolvedPageId = null;
        let productConfidence = null;
        if (landingNorm && !isHomepageUrl(landingNorm)) {
            targetKey = landingNorm;
            // Prefer matching product page if landing is itself a product URL
            if (productPage) {
                const productNorm = normalizeTargetUrl(productPage.final_url ?? productPage.url);
                if (productNorm === landingNorm) {
                    resolvedPageId = productPage.id;
                    resolvedUrl = productNorm;
                    productConfidence = productPage.product_resolution_confidence;
                }
            }
        }
        else if (isShoppingCarousel) {
            // Discovery only — never invent a CRO landing from popular_products/shopping.
            const titleKey = (raw.headline ?? "unknown-product")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 80);
            targetKey = `shopping:${raw.brand_id}:${titleKey || "unknown"}`;
            resolvedUrl = null;
            resolvedPageId = null;
            productConfidence = null;
        }
        else if (landingNorm) {
            // Paid ad landed on homepage/collection: THAT URL is the CRO target.
            // Do not swap to another product page from the same brand.
            targetKey = landingNorm;
            resolvedUrl = landingNorm;
            if (productPage) {
                const productNorm = normalizeTargetUrl(productPage.final_url ?? productPage.url);
                if (productNorm === landingNorm) {
                    resolvedPageId = productPage.id;
                    productConfidence = productPage.product_resolution_confidence;
                }
            }
        }
        else {
            // No landing URL → waiting for paid target, not CRO-ready
            targetKey = `waiting:${raw.brand_id}:${(raw.headline ?? raw.id)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .slice(0, 60)}`;
            resolvedUrl = null;
            resolvedPageId = null;
            productConfidence = null;
        }
        const clusterKey = `${raw.brand_id}::${targetKey}`;
        let cluster = clusters.get(clusterKey);
        if (!cluster) {
            cluster = {
                brandId: raw.brand_id,
                targetKey,
                landingUrl: raw.landing_url,
                resolvedUrl,
                resolvedPageId,
                productResolutionConfidence: productConfidence,
                ads: [],
                keywordIds: new Set(),
            };
            clusters.set(clusterKey, cluster);
        }
        cluster.ads.push(raw);
        if (raw.keyword_id) {
            cluster.keywordIds.add(raw.keyword_id);
        }
        if (!cluster.resolvedPageId && resolvedPageId) {
            cluster.resolvedPageId = resolvedPageId;
            cluster.resolvedUrl = resolvedUrl;
            cluster.productResolutionConfidence = productConfidence;
        }
    }
    let opportunitiesUpserted = 0;
    let linksCreated = 0;
    for (const cluster of clusters.values()) {
        const primary = pickPrimaryAd(cluster.ads);
        const paidConfirmed = brandPaid.get(cluster.brandId) === true ||
            cluster.ads.some((a) => a.ad_signal_type === "CONFIRMED_PAID" ||
                a.confirmation_source === "google_ads_transparency");
        const paidSignalType = pickStrongestSignal(cluster.ads);
        const firstSeen = minDate(cluster.ads.map((a) => a.found_at ?? a.observed_at));
        const lastSeen = maxDate(cluster.ads.map((a) => a.found_at ?? a.observed_at));
        const { data: existing } = await client
            .from("opportunities")
            .select("id, status")
            .eq("brand_id", cluster.brandId)
            .eq("target_key", cluster.targetKey)
            .maybeSingle();
        const serp = (primary.serp_item_type ?? "").toLowerCase();
        const conf = (primary.confirmation_source ?? "").toLowerCase();
        const isDiscoveryOnly = serp === "popular_products" ||
            serp === "shopping" ||
            conf.includes("popular_products") ||
            conf.includes("shopping") ||
            !cluster.landingUrl;
        const isExactPaidLanding = Boolean(cluster.landingUrl) &&
            (serp === "paid" || conf.includes("serp_paid") || conf.includes("labs"));
        const row = {
            brand_id: cluster.brandId,
            primary_ad_occurrence_id: primary.id,
            keyword_id: primary.keyword_id,
            resolved_page_id: cluster.resolvedPageId,
            landing_url: cluster.landingUrl,
            resolved_url: cluster.resolvedUrl,
            target_key: cluster.targetKey,
            ad_headline: primary.headline,
            ad_description: primary.description,
            source: primary.source,
            paid_signal_type: paidSignalType,
            paid_confirmed: paidConfirmed,
            product_resolution_confidence: cluster.productResolutionConfidence,
            supporting_keyword_count: cluster.keywordIds.size || (primary.keyword_id ? 1 : 0),
            supporting_ad_count: cluster.ads.length,
            first_seen_at: firstSeen,
            last_seen_at: lastSeen,
            cro_ready: isExactPaidLanding,
            paid_target_status: isExactPaidLanding
                ? "RESOLVED"
                : isDiscoveryOnly
                    ? "DISCOVERY"
                    : "WAITING_FOR_PAID_TARGET",
            ground_truth_source_type: isExactPaidLanding
                ? conf.includes("labs")
                    ? "LABS_PAID_KEYWORD"
                    : "LIVE_PAID_SERP"
                : isDiscoveryOnly
                    ? "POPULAR_PRODUCTS_CANDIDATE"
                    : "TRANSPARENCY_CONFIRMED",
            updated_at: new Date().toISOString(),
        };
        let opportunityId;
        if (existing?.id) {
            const { error } = await client
                .from("opportunities")
                .update(row)
                .eq("id", existing.id);
            if (error) {
                throw new Error(`Failed to update opportunity: ${error.message}`);
            }
            opportunityId = existing.id;
        }
        else {
            const { data: inserted, error } = await client
                .from("opportunities")
                .insert({ ...row, status: "NEW" })
                .select("id")
                .single();
            if (error) {
                throw new Error(`Failed to insert opportunity: ${error.message}`);
            }
            opportunityId = inserted.id;
        }
        opportunitiesUpserted += 1;
        // Refresh supporting links
        await client
            .from("opportunity_ad_occurrences")
            .delete()
            .eq("opportunity_id", opportunityId);
        await client.from("opportunity_keywords").delete().eq("opportunity_id", opportunityId);
        const adLinks = cluster.ads.map((a) => ({
            opportunity_id: opportunityId,
            ad_occurrence_id: a.id,
        }));
        if (adLinks.length > 0) {
            const { error } = await client.from("opportunity_ad_occurrences").upsert(adLinks);
            if (error) {
                throw new Error(`Failed to link ads: ${error.message}`);
            }
            linksCreated += adLinks.length;
        }
        const keywordLinks = [...cluster.keywordIds].map((keywordId) => ({
            opportunity_id: opportunityId,
            keyword_id: keywordId,
        }));
        if (keywordLinks.length > 0) {
            const { error } = await client.from("opportunity_keywords").upsert(keywordLinks);
            if (error) {
                throw new Error(`Failed to link keywords: ${error.message}`);
            }
        }
    }
    return {
        brandsProcessed: brandPaid.size,
        opportunitiesUpserted,
        linksCreated,
        skippedNoBrand,
        skippedExcludedBrand,
    };
}
function pickPrimaryAd(ads) {
    const ranked = [...ads].sort((a, b) => {
        const score = (ad) => {
            let s = 0;
            if (ad.ad_signal_type === "CONFIRMED_PAID")
                s += 3;
            else if (ad.ad_signal_type === "PAID_CANDIDATE")
                s += 1;
            if (ad.headline)
                s += 1;
            return s;
        };
        return score(b) - score(a);
    });
    return ranked[0];
}
function pickStrongestSignal(ads) {
    if (ads.some((a) => a.ad_signal_type === "CONFIRMED_PAID"))
        return "CONFIRMED_PAID";
    if (ads.some((a) => a.ad_signal_type === "PAID_CANDIDATE"))
        return "PAID_CANDIDATE";
    if (ads.some((a) => a.ad_signal_type === "NON_PAID"))
        return "NON_PAID";
    return ads[0]?.ad_signal_type ?? null;
}
function minDate(values) {
    const dates = values.filter(Boolean).sort();
    return dates[0] ?? null;
}
function maxDate(values) {
    const dates = values.filter(Boolean).sort();
    return dates[dates.length - 1] ?? null;
}
//# sourceMappingURL=opportunityGenerator.js.map