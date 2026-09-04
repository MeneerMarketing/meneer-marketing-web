/**
 * Milestone 9.3.2 — recovering shopping ads that lost their domain.
 *
 * Google Shopping items frequently carry a seller name and nothing else. Those
 * sellers skew heavily towards the small specialists we want, so silently
 * dropping them means the calibration measures our parser instead of the
 * market. This turns verified sellers back into normal PaidSearchAd records so
 * the rest of the pipeline treats them like any other advertiser.
 *
 * Costs nothing at DataForSEO: verification is a single HTTP probe per
 * candidate domain.
 */

import type { PaidSearchAd, UnresolvedShoppingAd } from "../../types/discovery.js";
import { resolveSellerDomain, type SellerDomainResolution } from "./sellerDomainResolver.js";
import { logger } from "../../utils/logger.js";

export interface ShoppingSellerRecoveryResult {
  recovered: PaidSearchAd[];
  /** Sellers we still could not tie to a live domain, with the reason. */
  stillUnresolved: Array<{ seller: string; reason: string }>;
  resolutions: SellerDomainResolution[];
}

export interface ShoppingSellerRecoveryOptions {
  timeoutMs: number;
  /** Shared across keywords so a repeated seller is probed only once. */
  cache?: Map<string, SellerDomainResolution>;
  /** Guards runtime when a SERP dumps a long tail of sellers. */
  maxSellers?: number;
}

export async function recoverShoppingSellerAds(
  unresolvedAds: UnresolvedShoppingAd[],
  options: ShoppingSellerRecoveryOptions
): Promise<ShoppingSellerRecoveryResult> {
  const result: ShoppingSellerRecoveryResult = {
    recovered: [],
    stillUnresolved: [],
    resolutions: [],
  };

  const limit = options.maxSellers ?? unresolvedAds.length;
  let processed = 0;

  for (const ad of unresolvedAds) {
    if (processed >= limit) {
      result.stillUnresolved.push({ seller: ad.seller, reason: "limiet per keyword bereikt" });
      continue;
    }
    processed += 1;

    const resolution = await resolveSellerDomain(ad.seller, {
      timeoutMs: options.timeoutMs,
      cache: options.cache,
    });
    result.resolutions.push(resolution);

    if (!resolution.domain) {
      result.stillUnresolved.push({
        seller: ad.seller,
        reason: resolution.rejectedReason ?? "geen domein gevonden",
      });
      continue;
    }

    result.recovered.push({
      keyword: ad.keyword,
      advertiserDomain: resolution.domain,
      normalizedDomain: resolution.domain,
      headline: ad.headline,
      description: ad.description,
      displayedUrl: `https://${resolution.domain}`,
      landingUrl: ad.landingUrl,
      rank: ad.rank,
      brandName: ad.seller,
      timestamp: ad.timestamp,
      serpItemType: ad.serpItemType,
      rawItem: {
        ...ad.rawItem,
        seller_domain_resolution: resolution.method,
        seller_domain_candidates: resolution.candidatesTried,
      },
    });

    logger.info("Shopping seller resolved to domain", {
      seller: ad.seller,
      domain: resolution.domain,
      method: resolution.method,
    });
  }

  return result;
}
