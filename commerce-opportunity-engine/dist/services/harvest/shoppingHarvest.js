import { TARGET_HARVEST_DEFAULTS } from "../../config/targetHarvest.js";
import { fetchShoppingPaidListings } from "../dataforseo/shoppingProducts.js";
import { resolveShoppingAdUrl } from "../dataforseo/shoppingAdUrl.js";
import { fetchShoppingSellers, pickSellerOfferForBrandDomain, } from "../dataforseo/shoppingSellers.js";
import { validateShoppingDomainMatch } from "../shopping/domainValidation.js";
import { upsertCroReadyOpportunityFromTarget, upsertShoppingPaidTarget, } from "../supabase/paidTargetsRepository.js";
import { normalizeDomainFromUrl } from "../../utils/domainNormalizer.js";
import { logger } from "../../utils/logger.js";
export function selectShoppingSourceKeywords(keywords, max = TARGET_HARVEST_DEFAULTS.maxShoppingKeywordsPerBrand) {
    const blocked = new Set([
        "RETAILER_BRANDED",
        "REVIEW_RESEARCH",
        "INFORMATIONAL",
        "SERVICE",
    ]);
    return [...keywords]
        .filter((k) => !blocked.has((k.intent ?? "").toUpperCase()))
        .sort((a, b) => {
        const score = (k) => {
            let s = 0;
            if ((k.intent ?? "") === "NON_BRANDED_PRODUCT")
                s += 40;
            if ((k.tier ?? "") === "PRIMARY")
                s += 25;
            s += (k.prospecting ?? 50) * 0.2;
            s += (k.relevance ?? 50) * 0.2;
            s += (k.yieldScore ?? 40) * 0.15;
            return s;
        };
        return score(b) - score(a);
    })
        .slice(0, max);
}
export async function harvestShoppingTargetsForBrand(input) {
    const { client, supabase, env, brandId, brandDomain, keywords, budgetRemaining, } = input;
    let cost = 0;
    let exactPaid = 0;
    let exactListing = 0;
    let freeListing = 0;
    let candidate = 0;
    let opportunitiesUpserted = 0;
    let resolutionsUsed = 0;
    const mismatches = [];
    const examples = [];
    const sellersCache = new Map();
    const selected = selectShoppingSourceKeywords(keywords);
    const brandNorm = normalizeDomainFromUrl(brandDomain)?.normalizedDomain ??
        brandDomain.toLowerCase().replace(/^www\./, "");
    for (const kw of selected) {
        if (cost >= budgetRemaining)
            break;
        const shopping = await fetchShoppingPaidListings({
            client,
            env,
            keyword: kw.keyword,
            depth: TARGET_HARVEST_DEFAULTS.maxShoppingResultsPerKeyword,
        });
        cost += shopping.cost;
        const paidItems = [...shopping.paidItems]
            .sort((a, b) => {
            const score = (x) => (x.shopAdAclk ? 3 : 0) +
                (x.productId ? 2 : 0) +
                (x.seller ? 1 : 0) +
                (x.rankAbsolute != null ? 1 / (1 + x.rankAbsolute) : 0);
            return score(b) - score(a);
        })
            .slice(0, TARGET_HARVEST_DEFAULTS.maxShoppingResultsPerKeyword);
        for (const item of paidItems) {
            if (cost >= budgetRemaining)
                break;
            let adUrl = null;
            let redirects = [];
            let finalUrl = item.url;
            let finalDomain = item.domain
                ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
                : null;
            let resolvedViaAclk = false;
            let resolvedViaSellers = false;
            let sellerName = item.seller;
            let price = item.price;
            let currency = item.currency;
            let itemTypeForScore = item.itemType;
            // Only pursue listings that already look related to this brand (seller/domain hint).
            const listingDomain = finalDomain;
            const sellerTok = (item.seller ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
            const brandTok = brandNorm.split(".")[0] ?? "";
            const listingLooksLikeBrand = (listingDomain &&
                (listingDomain === brandNorm ||
                    listingDomain.endsWith(`.${brandNorm}`) ||
                    brandNorm.endsWith(`.${listingDomain}`))) ||
                (sellerTok &&
                    brandTok &&
                    brandTok.length >= 4 &&
                    (sellerTok.includes(brandTok) || brandTok.includes(sellerTok)));
            // Hard gate: never spend Sellers/aclk budget on unrelated Shopping noise.
            if (!listingLooksLikeBrand) {
                continue;
            }
            if (item.shopAdAclk &&
                resolutionsUsed < TARGET_HARVEST_DEFAULTS.maxShoppingResolutionsPerBrand &&
                cost < budgetRemaining) {
                try {
                    const resolved = await resolveShoppingAdUrl({
                        client,
                        shopAdAclk: item.shopAdAclk,
                    });
                    cost += resolved.cost;
                    resolutionsUsed += 1;
                    adUrl = resolved.adUrl;
                    redirects = resolved.adUrlRedirects;
                    finalUrl = resolved.finalUrl ?? item.url;
                    finalDomain =
                        resolved.finalDomain ??
                            (item.domain
                                ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
                                : null);
                    resolvedViaAclk = Boolean(resolved.finalUrl || resolved.adUrl);
                }
                catch (err) {
                    logger.warn("Shopping aclk resolve failed", {
                        brand: brandNorm,
                        keyword: kw.keyword,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            }
            if (!finalUrl &&
                item.productId &&
                cost + 0.001 <= budgetRemaining &&
                resolutionsUsed < TARGET_HARVEST_DEFAULTS.maxShoppingResolutionsPerBrand) {
                try {
                    let sellers = sellersCache.get(item.productId);
                    if (!sellers) {
                        sellers = await fetchShoppingSellers({
                            client,
                            env,
                            keyword: kw.keyword,
                            productId: item.productId,
                        });
                        cost += sellers.cost;
                        resolutionsUsed += 1;
                        sellersCache.set(item.productId, sellers);
                    }
                    const offer = pickSellerOfferForBrandDomain(sellers.offers, brandNorm);
                    if (offer?.url) {
                        finalUrl = offer.url;
                        finalDomain = offer.domain;
                        sellerName = offer.sellerName ?? item.seller;
                        price = offer.totalPrice ?? offer.price ?? item.price;
                        currency = offer.currency ?? item.currency;
                        adUrl = offer.url;
                        resolvedViaSellers = true;
                        itemTypeForScore = "shops_list";
                    }
                }
                catch (err) {
                    logger.warn("Shopping sellers resolve failed", {
                        brand: brandNorm,
                        productId: item.productId,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            }
            if (!finalUrl || !finalDomain)
                continue;
            const advertisedNorm = item.domain
                ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
                : finalDomain;
            const validation = validateShoppingDomainMatch({
                brandNormalizedDomain: brandNorm,
                advertisedDomain: advertisedNorm,
                sellerName,
                finalUrl,
                adUrlRedirects: redirects,
            });
            const observedAt = new Date().toISOString();
            if (!validation.ok) {
                mismatches.push({
                    brand: brandNorm,
                    keyword: kw.keyword,
                    productId: item.productId,
                    seller: sellerName,
                    finalUrl,
                    status: validation.status,
                    issues: validation.issues,
                });
                await upsertShoppingPaidTarget(supabase, {
                    brandId,
                    keyword: kw.keyword,
                    keywordId: kw.id,
                    itemType: itemTypeForScore,
                    title: item.title,
                    description: item.description,
                    seller: sellerName,
                    sellerDomain: advertisedNorm,
                    price,
                    currency,
                    rankGroup: item.rankGroup,
                    rankAbsolute: item.rankAbsolute,
                    shopAdAclk: item.shopAdAclk,
                    adUrl,
                    adUrlRedirects: redirects,
                    landingUrl: finalUrl,
                    productId: item.productId,
                    dataDocid: item.dataDocid,
                    domainMatchStatus: validation.status,
                    dataQualityIssues: validation.issues,
                    domainMatched: false,
                    resolvedAdUrl: resolvedViaAclk || resolvedViaSellers,
                    rawPayload: { listing: item.raw, validation, harvest: "m722" },
                    observedAt,
                });
                continue;
            }
            const saved = await upsertShoppingPaidTarget(supabase, {
                brandId,
                keyword: kw.keyword,
                keywordId: kw.id,
                itemType: itemTypeForScore,
                title: item.title,
                description: item.description,
                seller: sellerName,
                sellerDomain: advertisedNorm,
                price,
                currency,
                rankGroup: item.rankGroup,
                rankAbsolute: item.rankAbsolute,
                shopAdAclk: item.shopAdAclk,
                adUrl,
                adUrlRedirects: redirects,
                landingUrl: finalUrl,
                productId: item.productId,
                dataDocid: item.dataDocid,
                domainMatchStatus: validation.status,
                dataQualityIssues: validation.issues,
                domainMatched: true,
                resolvedAdUrl: resolvedViaAclk || resolvedViaSellers,
                rawPayload: { listing: item.raw, validation, harvest: "m722" },
                observedAt,
            });
            if (saved.sourceType === "GOOGLE_SHOPPING_PAID_EXACT")
                exactPaid += 1;
            else if (saved.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING")
                exactListing += 1;
            else if (saved.sourceType === "GOOGLE_SHOPPING_FREE_LISTING")
                freeListing += 1;
            else
                candidate += 1;
            if (saved.domainMatched &&
                (saved.sourceType === "GOOGLE_SHOPPING_PAID_EXACT" ||
                    saved.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING")) {
                await upsertCroReadyOpportunityFromTarget({
                    client: supabase,
                    brandId,
                    targetId: saved.id,
                    landingUrl: finalUrl,
                    keyword: kw.keyword,
                    keywordId: kw.id,
                    sourceType: saved.sourceType,
                    sourceQualityScore: saved.sourceQualityScore,
                    adTitle: item.title,
                    adDescription: item.description,
                    channel: "SHOPPING",
                    discoverySerpItemType: itemTypeForScore,
                    confirmationSource: "dataforseo_merchant_shopping",
                    croReadinessLevel: saved.croReadinessLevel,
                    listingTargetConfidence: saved.listingTargetConfidence ?? undefined,
                    paidEvidenceConfidence: saved.paidEvidenceConfidence ?? undefined,
                });
                opportunitiesUpserted += 1;
            }
            examples.push({
                keyword: kw.keyword,
                productId: item.productId,
                title: item.title,
                url: finalUrl,
                sourceType: saved.sourceType,
                via: resolvedViaAclk ? "aclk" : resolvedViaSellers ? "sellers" : "listing",
            });
        }
    }
    return {
        cost,
        exactPaid,
        exactListing,
        freeListing,
        candidate,
        mismatches,
        examples: examples.slice(0, 8),
        opportunitiesUpserted,
    };
}
//# sourceMappingURL=shoppingHarvest.js.map