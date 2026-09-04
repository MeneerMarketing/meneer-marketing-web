/**
 * Milestone 9.3.1 — SERP prospect quality test + keyword stop rule.
 *
 * One cheap sample of the advertiser landscape decides whether a keyword is
 * worth a full discovery run. Composition beats volume.
 */

import { KEYWORD_QUALITY_THRESHOLDS } from "../../config/prospectCalibration.js";
import {
  classifySerpDomain,
  structuralDomainClass,
  type ProspectClass,
} from "../prospect/prospectPipelineGate.js";

export const SERP_QUALITY_THRESHOLDS = KEYWORD_QUALITY_THRESHOLDS;

export type KeywordProspectStatus =
  | "APPROVED"
  | "MARGINAL"
  | "LOW_SPECIALIST_YIELD"
  | "RETAILER_DOMINATED"
  | "COMPARISON_DOMINATED"
  | "MARKETPLACE_DOMINATED"
  | "TOO_BROAD"
  | "NO_SAMPLE";

export interface SerpAdvertiserSample {
  domain: string;
  businessType?: string | null;
}

export interface SerpCompositionRatios {
  nicheBrandRatio: number;
  specialistRatio: number;
  generalRetailerRatio: number;
  massRetailerRatio: number;
  comparisonRatio: number;
  marketplaceRatio: number;
  nonCommerceRatio: number;
  unknownRatio: number;
  /** Cold start only: unknown domains that carry no retailer signal at all. */
  provisionalRatio: number;
  alreadyExcludedRatio: number;
}

export interface SerpProspectQualityResult {
  sampled: number;
  counts: Record<ProspectClass, number>;
  ratios: SerpCompositionRatios;
  prospectDomains: string[];
  /** Cold start only: candidates still awaiting the free homepage check. */
  provisionalDomains: string[];
  excludedDomains: string[];
  prospectSerpQualityScore: number;
  status: KeywordProspectStatus;
  stopReason: string | null;
  /** May this keyword continue to full discovery? */
  approved: boolean;
}

const EMPTY_COUNTS: Record<ProspectClass, number> = {
  NICHE_BRAND: 0,
  SPECIALIST: 0,
  GENERAL_RETAILER: 0,
  MASS_RETAILER: 0,
  MARKETPLACE: 0,
  COMPARISON_SITE: 0,
  NON_COMMERCE: 0,
  UNKNOWN: 0,
};

export function computeSerpProspectQuality(
  advertisers: SerpAdvertiserSample[],
  options: {
    archetypeTooBroad?: boolean;
    /**
     * A brand new product family has no classified advertisers yet, so demanding
     * positive proof of specialists rejects every keyword by construction. In
     * cold start an unknown domain without any retailer, marketplace or
     * comparison signal counts as a candidate. It still has to survive the
     * central gate and the free homepage check afterwards; this only decides
     * whether the keyword itself is worth keeping.
     */
    coldStart?: boolean;
  } = {}
): SerpProspectQualityResult {
  const seen = new Set<string>();
  const counts: Record<ProspectClass, number> = { ...EMPTY_COUNTS };
  const prospectDomains: string[] = [];
  const provisionalDomains: string[] = [];
  const excludedDomains: string[] = [];

  for (const advertiser of advertisers) {
    const domain = advertiser.domain.toLowerCase().replace(/^www\./, "");
    if (!domain || seen.has(domain)) continue;
    seen.add(domain);
    const cls = classifySerpDomain(domain, advertiser.businessType);
    counts[cls] += 1;

    if (cls === "NICHE_BRAND" || cls === "SPECIALIST") {
      prospectDomains.push(domain);
      continue;
    }

    const unclassified =
      !advertiser.businessType || advertiser.businessType.toUpperCase() === "UNKNOWN";
    if (
      options.coldStart &&
      cls === "UNKNOWN" &&
      unclassified &&
      structuralDomainClass(domain) === null
    ) {
      provisionalDomains.push(domain);
      continue;
    }

    excludedDomains.push(domain);
  }

  const sampled = seen.size;
  if (sampled === 0) {
    return {
      sampled: 0,
      counts,
      ratios: {
        nicheBrandRatio: 0,
        specialistRatio: 0,
        generalRetailerRatio: 0,
        massRetailerRatio: 0,
        comparisonRatio: 0,
        marketplaceRatio: 0,
        nonCommerceRatio: 0,
        unknownRatio: 0,
        provisionalRatio: 0,
        alreadyExcludedRatio: 0,
      },
      prospectDomains,
      provisionalDomains,
      excludedDomains,
      prospectSerpQualityScore: 0,
      status: "NO_SAMPLE",
      stopReason: "geen advertisers in sample",
      approved: false,
    };
  }

  const ratio = (value: number) => Math.round((value / sampled) * 1000) / 1000;
  const ratios: SerpCompositionRatios = {
    nicheBrandRatio: ratio(counts.NICHE_BRAND),
    specialistRatio: ratio(counts.SPECIALIST),
    generalRetailerRatio: ratio(counts.GENERAL_RETAILER),
    massRetailerRatio: ratio(counts.MASS_RETAILER),
    comparisonRatio: ratio(counts.COMPARISON_SITE),
    marketplaceRatio: ratio(counts.MARKETPLACE),
    nonCommerceRatio: ratio(counts.NON_COMMERCE),
    unknownRatio: ratio(counts.UNKNOWN),
    provisionalRatio: ratio(provisionalDomains.length),
    alreadyExcludedRatio: ratio(excludedDomains.length),
  };

  const prospectRatio =
    ratios.nicheBrandRatio + ratios.specialistRatio + ratios.provisionalRatio;
  const retailerRatio = ratios.generalRetailerRatio + ratios.massRetailerRatio;
  const unsuitableRatio = retailerRatio + ratios.comparisonRatio + ratios.marketplaceRatio;

  // Monotone in prospect richness: 100 means every advertiser is a niche brand,
  // 0 means the landscape holds nothing we can sell to. Comparison sites carry
  // an extra penalty because they signal a research query, not a buying query.
  // A provisional candidate is worth less than a verified specialist and more
  // than a domain we know nothing about.
  const plainUnknownRatio = Math.max(0, ratios.unknownRatio - ratios.provisionalRatio);
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ratios.nicheBrandRatio * 100 +
          ratios.specialistRatio * 85 +
          ratios.provisionalRatio * 62 +
          plainUnknownRatio * 25 -
          ratios.comparisonRatio * 25
      )
    )
  );

  const t = SERP_QUALITY_THRESHOLDS;
  const smallSample = sampled < t.smallSampleSize;
  const candidateCount = prospectDomains.length + provisionalDomains.length;

  let status: KeywordProspectStatus = "APPROVED";
  let stopReason: string | null = null;

  // Which unsuitable class carries the sample, so the label names the real
  // problem instead of blaming whichever rule happened to fire first.
  const dominantExcluded = [
    { status: "RETAILER_DOMINATED" as const, ratio: retailerRatio, label: "retailers" },
    { status: "COMPARISON_DOMINATED" as const, ratio: ratios.comparisonRatio, label: "vergelijkers" },
    { status: "MARKETPLACE_DOMINATED" as const, ratio: ratios.marketplaceRatio, label: "marketplaces" },
  ].sort((a, b) => b.ratio - a.ratio)[0];

  if (options.archetypeTooBroad) {
    status = "TOO_BROAD";
    stopReason = "producttype te breed voor deep-dive PDP";
  } else if (unsuitableRatio > t.maxUnsuitableRatio) {
    // Name the keyword after one class only when that class actually carries
    // the sample. A landscape that is a bit of everything is a yield problem.
    const dominated = dominantExcluded.ratio >= t.singleClassDominanceRatio;
    status = dominated ? dominantExcluded.status : "LOW_SPECIALIST_YIELD";
    stopReason = dominated
      ? `${Math.round(dominantExcluded.ratio * 100)}% ${dominantExcluded.label} in de sample`
      : `${Math.round(unsuitableRatio * 100)}% retailers, marketplaces en vergelijkers, geen enkele partij dominant`;
  } else if (prospectRatio < t.marginalSpecialistRatio) {
    status = "LOW_SPECIALIST_YIELD";
    stopReason = `slechts ${candidateCount} van ${sampled} advertisers is merk of specialist`;
  } else if (
    prospectRatio < t.minSpecialistRatio ||
    candidateCount < t.minProspectCount ||
    score < t.minQualityScore
  ) {
    // Between the marginal floor and the approval bar: worth keeping in view,
    // not worth a full discovery budget yet.
    status = "MARGINAL";
    if (candidateCount < t.minProspectCount) {
      stopReason = `${candidateCount} prospect(s) in de sample, te weinig om op te sturen`;
    } else if (prospectRatio < t.minSpecialistRatio) {
      stopReason = `specialist ratio ${Math.round(prospectRatio * 100)}% onder de ${Math.round(t.minSpecialistRatio * 100)}% drempel`;
    } else {
      stopReason = `kwaliteitsscore ${score} onder de ${t.minQualityScore}, landschap te gemengd`;
    }
  }

  // Small samples are noisy: a clean two-domain SERP is not proof.
  if (status === "APPROVED" && smallSample) {
    status = "MARGINAL";
    stopReason = `sample van ${sampled} advertisers is te klein voor een hard oordeel`;
  }

  return {
    sampled,
    counts,
    ratios,
    prospectDomains,
    provisionalDomains,
    excludedDomains,
    prospectSerpQualityScore: score,
    status,
    stopReason,
    approved: status === "APPROVED",
  };
}

export function isKeywordProspectingRejected(status: KeywordProspectStatus): boolean {
  return status !== "APPROVED";
}
