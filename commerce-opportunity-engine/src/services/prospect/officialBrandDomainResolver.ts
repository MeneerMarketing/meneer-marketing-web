/**
 * Milestone 9.7 — official brand domain resolution with confidence scoring.
 */

import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { resolveSellerDomain } from "./sellerDomainResolver.js";
import { isPlausibleMinedBrand } from "./thirdPartyProductExtractor.js";

export type OfficialDomainResolution = {
  officialDomain: string | null;
  officialDomainConfidence: number;
  status: "RESOLVED" | "UNRESOLVED_BRAND_DOMAIN";
  evidence: string[];
};

function brandTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

export async function resolveOfficialBrandDomainWithConfidence(input: {
  productBrand: string;
  productModel?: string | null;
  productTitle?: string | null;
  timeoutMs: number;
}): Promise<OfficialDomainResolution> {
  const evidence: string[] = [];
  if (!isPlausibleMinedBrand(input.productBrand)) {
    return {
      officialDomain: null,
      officialDomainConfidence: 0,
      status: "UNRESOLVED_BRAND_DOMAIN",
      evidence: ["implausible_brand_name"],
    };
  }

  const resolution = await resolveSellerDomain(input.productBrand, {
    timeoutMs: input.timeoutMs,
  });
  if (!resolution.domain) {
    return {
      officialDomain: null,
      officialDomainConfidence: 0,
      status: "UNRESOLVED_BRAND_DOMAIN",
      evidence: [resolution.rejectedReason ?? "no_domain_resolved"],
    };
  }

  evidence.push(`resolved_via_${resolution.method ?? "probe"}`);
  let confidence = 55;

  const tokens = brandTokens(input.productBrand);
  const domainLower = resolution.domain.toLowerCase();
  if (tokens.some((token) => domainLower.includes(token))) {
    confidence += 18;
    evidence.push("brand_token_in_domain");
  }

  try {
    const home = await crawlWebsite(`https://${resolution.domain}`, input.timeoutMs);
    if (home.status === "success") {
      const signals = extractPageSignals(home.html, home.finalUrl);
      const bodySample = (signals.bodyTextSample ?? "").toLowerCase();
      const titleLower = (signals.title ?? "").toLowerCase();
      const tokenHits = tokens.filter(
        (token) => bodySample.includes(token) || titleLower.includes(token)
      ).length;
      if (tokenHits >= 2) {
        confidence += 15;
        evidence.push("homepage_brand_match");
      } else if (tokenHits === 1) {
        confidence += 8;
        evidence.push("partial_homepage_match");
      }

      if (input.productModel) {
        const modelLower = input.productModel.toLowerCase();
        if (bodySample.includes(modelLower) || titleLower.includes(modelLower)) {
          confidence += 12;
          evidence.push("model_cross_validation");
        }
      } else if (input.productTitle) {
        const titleTokens = input.productTitle
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length > 4)
          .slice(0, 4);
        const overlap = titleTokens.filter((t) => bodySample.includes(t)).length;
        if (overlap >= 2) {
          confidence += 8;
          evidence.push("product_title_overlap");
        }
      }
    }
  } catch {
    evidence.push("homepage_crawl_failed");
  }

  const finalConfidence = Math.max(0, Math.min(100, confidence));
  if (finalConfidence < 58) {
    return {
      officialDomain: null,
      officialDomainConfidence: finalConfidence,
      status: "UNRESOLVED_BRAND_DOMAIN",
      evidence,
    };
  }

  return {
    officialDomain: resolution.domain,
    officialDomainConfidence: finalConfidence,
    status: "RESOLVED",
    evidence,
  };
}
