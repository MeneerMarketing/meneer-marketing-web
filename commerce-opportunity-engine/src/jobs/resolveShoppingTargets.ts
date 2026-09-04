import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchShoppingPaidListings } from "../services/dataforseo/shoppingProducts.js";
import { resolveShoppingAdUrl } from "../services/dataforseo/shoppingAdUrl.js";
import {
  fetchShoppingSellers,
  pickMatchingSellerOffer,
} from "../services/dataforseo/shoppingSellers.js";
import { validateShoppingDomainMatch } from "../services/shopping/domainValidation.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { upsertBrandFromAd } from "../services/supabase/brandsRepository.js";
import {
  upsertCroReadyOpportunityFromTarget,
  upsertShoppingPaidTarget,
} from "../services/supabase/paidTargetsRepository.js";
import { normalizeDomainFromUrl } from "../utils/domainNormalizer.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const DEFAULT_TEST_KEYWORDS = [
  "led masker kopen",
  "elektrische deken",
  "anti aging serum",
];

type KeywordRow = { id: string; keyword: string };

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dfs = createDataForSeoClient(env);

  const filter = env.SHOPPING_GROUND_TRUTH_KEYWORD_FILTER?.split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const preferred = filter?.length ? filter : DEFAULT_TEST_KEYWORDS;
  const maxKeywords = env.SHOPPING_GROUND_TRUTH_MAX_KEYWORDS;
  const maxCost = env.SHOPPING_GROUND_TRUTH_MAX_DATAFORSEO_COST_PER_RUN;
  const maxResults = env.SHOPPING_GROUND_TRUTH_MAX_RESULTS_PER_KEYWORD;
  const maxResolutions = env.SHOPPING_GROUND_TRUTH_MAX_AD_URL_RESOLUTIONS;

  const { data: keywords, error } = await supabase
    .from("keywords")
    .select("id, keyword")
    .eq("active", true);

  if (error) throw new Error(error.message);

  const selected: KeywordRow[] = [];
  for (const name of preferred) {
    const match = (keywords ?? []).find((k) => k.keyword.toLowerCase() === name);
    if (match) selected.push(match as KeywordRow);
  }
  const targets = selected.slice(0, maxKeywords);

  if (targets.length === 0) {
    throw new Error(`No matching active keywords for filter: ${preferred.join(", ")}`);
  }

  logger.info("Starting shopping paid target resolution", {
    keywords: targets.map((t) => t.keyword),
    maxCost,
    maxResults,
    maxResolutions,
  });

  const run = await createRun(supabase, "resolve_shopping_targets", {
    milestone: "5.3",
    keywords: targets.map((t) => t.keyword),
    maxCost,
  });

  let totalCost = 0;
  let totalPaidItems = 0;
  let totalAclk = 0;
  let totalResolved = 0;
  let totalMismatches = 0;
  let totalCroReady = 0;
  let resolutionsUsed = 0;
  const examples: Array<Record<string, unknown>> = [];
  const results: Array<Record<string, unknown>> = [];
  const sellersCache = new Map<
    string,
    Awaited<ReturnType<typeof fetchShoppingSellers>>
  >();

  try {
    for (const kw of targets) {
      if (totalCost >= maxCost) {
        logger.warn("Stopping: DataForSEO cost cap reached", { totalCost, maxCost });
        break;
      }

      const shopping = await fetchShoppingPaidListings({
        client: dfs,
        env,
        keyword: kw.keyword,
        depth: maxResults,
      });
      totalCost += shopping.cost;

      const paidItems = [...shopping.paidItems]
        .sort((a, b) => {
          const score = (x: typeof a) =>
            (x.shopAdAclk ? 3 : 0) +
            (x.productId ? 2 : 0) +
            (x.seller ? 1 : 0) +
            (x.rankAbsolute != null ? 1 / (1 + x.rankAbsolute) : 0);
          return score(b) - score(a);
        })
        .slice(0, maxResults);

      totalPaidItems += paidItems.length;
      totalAclk += paidItems.filter((p) => p.shopAdAclk).length;

      console.log("");
      console.log(`KEYWORD: ${kw.keyword}`);
      console.log(`  products cost: $${shopping.cost.toFixed(6)}`);
      console.log(`  item_types: ${shopping.itemTypes.join(", ") || "(none)"}`);
      console.log(`  shopping candidates: ${paidItems.length}`);
      console.log(`  with shop_ad_aclk: ${paidItems.filter((p) => p.shopAdAclk).length}`);
      console.log(`  with product_id: ${paidItems.filter((p) => p.productId).length}`);

      const keywordStats = {
        keyword: kw.keyword,
        productsCost: shopping.cost,
        itemTypes: shopping.itemTypes,
        paidItems: paidItems.length,
        withAclk: paidItems.filter((p) => p.shopAdAclk).length,
        resolved: 0,
        croReady: 0,
        mismatches: 0,
        examples: [] as Array<Record<string, unknown>>,
      };

      for (const item of paidItems) {
        if (totalCost >= maxCost) break;

        let adUrl: string | null = null;
        let redirects: string[] = [];
        let finalUrl: string | null = item.url;
        let finalDomain: string | null = item.domain
          ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
          : null;
        let resolvedViaAclk = false;
        let resolvedViaSellers = false;
        let sellerName = item.seller;
        let price = item.price;
        let currency = item.currency;
        let itemTypeForScore: string = item.itemType;

        // Path A: shop_ad_aclk → Sellers Ad URL
        if (item.shopAdAclk && resolutionsUsed < maxResolutions && totalCost < maxCost) {
          try {
            const resolved = await resolveShoppingAdUrl({
              client: dfs,
              shopAdAclk: item.shopAdAclk,
            });
            totalCost += resolved.cost;
            resolutionsUsed += 1;
            keywordStats.resolved += 1;
            totalResolved += 1;
            adUrl = resolved.adUrl;
            redirects = resolved.adUrlRedirects;
            finalUrl = resolved.finalUrl ?? item.url;
            finalDomain =
              resolved.finalDomain ??
              (item.domain
                ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
                : null);
            resolvedViaAclk = Boolean(resolved.finalUrl || resolved.adUrl);
          } catch (err) {
            logger.error("Failed to resolve shop_ad_aclk", {
              keyword: kw.keyword,
              error: err instanceof Error ? err.message : "unknown",
            });
          }
        }

        // Path B (NL-critical): product_id → Sellers shops_list with exact product URL
        if (
          !finalUrl &&
          item.productId &&
          totalCost + 0.001 <= maxCost
        ) {
          try {
            let sellers = sellersCache.get(item.productId);
            if (!sellers) {
              if (resolutionsUsed >= maxResolutions) {
                // budget of resolutions exhausted
              } else {
                sellers = await fetchShoppingSellers({
                  client: dfs,
                  env,
                  keyword: kw.keyword,
                  productId: item.productId,
                });
                totalCost += sellers.cost;
                resolutionsUsed += 1;
                sellersCache.set(item.productId, sellers);
              }
            }

            if (sellers) {
              const offer = pickMatchingSellerOffer(sellers.offers, item.seller);
              if (offer?.url) {
                finalUrl = offer.url;
                finalDomain = offer.domain;
                sellerName = offer.sellerName ?? item.seller;
                price = offer.totalPrice ?? offer.price ?? item.price;
                currency = offer.currency ?? item.currency;
                adUrl = offer.url;
                resolvedViaSellers = true;
                itemTypeForScore = "shops_list";
                keywordStats.resolved += 1;
                totalResolved += 1;
              }
            }
          } catch (err) {
            logger.error("Failed to resolve shopping sellers", {
              keyword: kw.keyword,
              productId: item.productId,
              error: err instanceof Error ? err.message : "unknown",
            });
          }
        }

        if (!finalUrl || !finalDomain) {
          continue;
        }

        const advertisedNorm = item.domain
          ? normalizeDomainFromUrl(item.domain)?.normalizedDomain ?? null
          : finalDomain;
        const brandDomainForUpsert = advertisedNorm ?? finalDomain;
        const brandName = sellerName ?? item.title ?? brandDomainForUpsert;

        const brand = await upsertBrandFromAd(supabase, {
          name: brandName,
          domain: brandDomainForUpsert,
          normalizedDomain: brandDomainForUpsert,
          seenAt: new Date().toISOString(),
          confirmedGoogleAdvertiser: true,
          confirmationSource: "dataforseo_merchant_shopping",
        });

        const validation = validateShoppingDomainMatch({
          brandNormalizedDomain: brand.brand.normalized_domain,
          advertisedDomain: advertisedNorm,
          sellerName,
          finalUrl,
          adUrlRedirects: redirects,
        });

        const observedAt = new Date().toISOString();

        if (!validation.ok) {
          totalMismatches += 1;
          keywordStats.mismatches += 1;
          await upsertShoppingPaidTarget(supabase, {
            brandId: brand.brand.id,
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
            rawPayload: { listing: item.raw, validation },
            observedAt,
          });
          console.log(
            `  ! mismatch ${sellerName ?? brandDomainForUpsert} → ${finalUrl} (${validation.status})`
          );
          continue;
        }

        const saved = await upsertShoppingPaidTarget(supabase, {
          brandId: brand.brand.id,
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
          rawPayload: { listing: item.raw, validation },
          observedAt,
        });

        // Upsert opportunity for paid exact OR high-confidence exact listing
        {
          const { data: targetRow } = await supabase
            .from("paid_search_targets")
            .select(
              "source_type, cro_readiness_level, listing_target_confidence, paid_evidence_confidence, source_quality_score"
            )
            .eq("id", saved.id)
            .maybeSingle();

          const srcType =
            (targetRow?.source_type as string) ?? "GOOGLE_SHOPPING_EXACT_LISTING";
          if (
            srcType === "GOOGLE_SHOPPING_PAID_EXACT" ||
            srcType === "GOOGLE_SHOPPING_EXACT_LISTING"
          ) {
            await upsertCroReadyOpportunityFromTarget({
              client: supabase,
              brandId: brand.brand.id,
              targetId: saved.id,
              keyword: kw.keyword,
              keywordId: kw.id,
              landingUrl: finalUrl,
              adTitle: item.title,
              adDescription: item.description,
              sourceType: srcType,
              sourceQualityScore: Number(
                targetRow?.source_quality_score ?? saved.sourceQualityScore
              ),
              channel: "SHOPPING",
              discoverySerpItemType: item.itemType,
              confirmationSource: "dataforseo_merchant_shopping",
              croReadinessLevel: (targetRow?.cro_readiness_level as string) ?? undefined,
              listingTargetConfidence: Number(targetRow?.listing_target_confidence ?? 0),
              paidEvidenceConfidence: Number(targetRow?.paid_evidence_confidence ?? 0),
            });
            if (srcType === "GOOGLE_SHOPPING_PAID_EXACT" || saved.croReady) {
              totalCroReady += 1;
              keywordStats.croReady += 1;
            }
          }
        }

        const example = {
          keyword: kw.keyword,
          seller: sellerName,
          domain: finalDomain,
          product: item.title,
          landingUrl: finalUrl,
          price,
          currency,
          sourceQuality: saved.sourceQualityScore,
          croReady: saved.croReady,
          itemType: itemTypeForScore,
          resolvePath: resolvedViaAclk
            ? "shop_ad_aclk"
            : resolvedViaSellers
              ? "sellers_url"
              : "direct_url",
          domainMatch: validation.status,
        };
        examples.push(example);
        keywordStats.examples.push(example);

        console.log(
          `  - ${sellerName ?? finalDomain} · ${item.title ?? "(no title)"} → ${finalUrl} · q=${saved.sourceQualityScore}${saved.croReady ? " · CRO-READY" : ""}`
        );
      }

      results.push(keywordStats);
    }

    await completeRun(supabase, run.id, "completed", {
      results,
      dataForSeoCost: totalCost,
      anthropicCost: 0,
      totals: {
        paidItems: totalPaidItems,
        withAclk: totalAclk,
        resolvedAdUrls: totalResolved,
        mismatches: totalMismatches,
        croReady: totalCroReady,
        resolutionsUsed,
      },
    });

    console.log("");
    console.log("SHOPPING TARGET RESOLUTION COMPLETE");
    console.log("--------------------------------------------");
    console.log(`Keywords tested: ${results.length}`);
    console.log(`Shopping candidates: ${totalPaidItems}`);
    console.log(`shop_ad_aclk values: ${totalAclk}`);
    console.log(`Resolved landings: ${totalResolved}`);
    console.log(`Domain mismatches: ${totalMismatches}`);
    console.log(`CRO-ready opportunities (this run): ${totalCroReady}`);
    console.log(`DataForSEO cost: $${totalCost.toFixed(6)}`);
    console.log(`Anthropic cost: $0.000000`);
    console.log("");
    for (const ex of examples.slice(0, 12)) {
      console.log(
        `EX: ${ex.keyword} → ${ex.seller ?? ex.domain} → ${ex.product} → ${ex.landingUrl} (q=${ex.sourceQuality}, ${ex.resolvePath})`
      );
    }

    process.exit(0);
  } catch (error) {
    await completeRun(supabase, run.id, "failed", {
      error: error instanceof Error ? error.message : "unknown",
      dataForSeoCost: totalCost,
    });
    logger.error("resolve:shopping-targets failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

main();
