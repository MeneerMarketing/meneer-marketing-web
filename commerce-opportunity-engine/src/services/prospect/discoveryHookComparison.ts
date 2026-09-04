/**
 * Milestone 9.8 — compare all discovery hooks including PDP-gap-first.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type HookMetrics = {
  milestone: string;
  brandsDiscovered: number;
  firstPartyDtcRate: number | null;
  economicQualifiedRate: number | null;
  designGapScreenRate: number | null;
  highGapRate: number | null;
  trueManualReview: number;
};

export type PdpGapFirstHookMetrics = {
  milestone: string;
  validPdpsScreened: number;
  highGapCount: number;
  highGapRate: number | null;
  goodBusinessAfterGap: number;
  goodBusinessAfterGapRate: number | null;
  potentialTargets: number;
  potentialTargetRate: number | null;
  trueManualReview: number;
};

export type DiscoveryHookComparison = {
  adsFirst: HookMetrics | null;
  organicFirstParty: HookMetrics | null;
  organicBalanced: HookMetrics | null;
  thirdPartyMining: HookMetrics | null;
  pdpGapFirst: PdpGapFirstHookMetrics | null;
  note: string;
};

async function loadJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pct(n: number, d: number): number | null {
  if (d <= 0) return null;
  return Math.round((n / d) * 100);
}

function highGapFromCandidates(
  candidates: Array<{
    preauditVisualGap?: number | null;
    preauditPurchaseGap?: number | null;
    rawPdpRedesignOpportunity?: number | null;
    designGapScreened?: boolean;
  }>,
  visualMin = 45,
  purchaseMin = 45,
  rawMin = 58
): number {
  return candidates.filter((c) => {
    if (c.designGapScreened === false) return false;
    const raw = c.rawPdpRedesignOpportunity;
    if (raw != null && raw >= rawMin) return true;
    return (c.preauditVisualGap ?? 0) >= visualMin || (c.preauditPurchaseGap ?? 0) >= purchaseMin;
  }).length;
}

function metricsFromBrandReport(report: Record<string, unknown>): HookMetrics {
  const funnel = (report.funnel as Record<string, number>) ?? {};
  const milestone = String(report.milestone ?? "?");
  const brands =
    funnel.brands_mined ?? funnel.brands_discovered ?? funnel.candidate_brands ?? 0;
  const firstParty =
    funnel.dtc_ecommerce ?? funnel.first_party_passed ?? funnel.validated_first_party ?? 0;
  const economic = funnel.economic_qualified ?? 0;
  const screened = funnel.design_gap_screened ?? 0;

  const allCandidates = (report.allCandidates as Array<Record<string, unknown>>) ?? [];
  const top10 = (report.top10 as Array<Record<string, unknown>>) ?? [];
  const gapPool = allCandidates.length > 0 ? allCandidates : top10;
  const highGap = highGapFromCandidates(
    gapPool.map((c) => ({
      preauditVisualGap: c.preauditVisualGap as number | null,
      preauditPurchaseGap: c.preauditPurchaseGap as number | null,
      designGapScreened: c.designGapScreened as boolean,
    }))
  );

  const dtcRate =
    funnel.dtc_ecommerce != null && brands > 0
      ? pct(funnel.dtc_ecommerce, brands)
      : firstParty > 0 && brands > 0
        ? pct(firstParty, brands)
        : null;

  return {
    milestone,
    brandsDiscovered: brands,
    firstPartyDtcRate: dtcRate,
    economicQualifiedRate: pct(economic, brands),
    designGapScreenRate: pct(screened, brands),
    highGapRate: screened > 0 ? pct(highGap, screened) : null,
    trueManualReview: funnel.true_manual_review ?? 0,
  };
}

function metricsFromAdsFirstReport(report: Record<string, unknown>): HookMetrics {
  const funnel = (report.funnel as Record<string, number>) ?? {};
  const milestone = String(report.milestone ?? "M9.5");
  const brands = funnel.raw_advertisers ?? funnel.prospect_eligible ?? 0;
  const screened = funnel.design_gap_screened ?? 0;
  const economic = funnel.economic_prequalified ?? 0;

  const candidates = (report.candidates as Array<Record<string, unknown>>) ?? [];
  const highGap = highGapFromCandidates(
    candidates.map((c) => ({
      preauditVisualGap: c.preauditVisualGap as number | null,
      preauditPurchaseGap: c.preauditPurchaseGap as number | null,
      designGapScreened: c.designGapScreened as boolean,
    }))
  );

  return {
    milestone,
    brandsDiscovered: brands,
    firstPartyDtcRate: null,
    economicQualifiedRate: pct(economic, brands),
    designGapScreenRate: pct(screened, brands),
    highGapRate: screened > 0 ? pct(highGap, screened) : null,
    trueManualReview: funnel.design_gap_candidate ?? 0,
  };
}

function metricsFromPdpGapFirstReport(report: Record<string, unknown>): PdpGapFirstHookMetrics {
  const funnel = (report.funnel as Record<string, number>) ?? {};
  const milestone = String(report.milestone ?? "M9.8");
  const screened = funnel.valid_pdps_screened ?? funnel.design_gap_screened ?? 0;
  const highGap = funnel.high_gap_shortlist ?? 0;
  const goodBusiness = funnel.professional_ecommerce_after_gap ?? funnel.business_qualified ?? 0;
  const potential =
    funnel.potential_targets ??
    funnel.true_manual_review ??
    0;

  return {
    milestone,
    validPdpsScreened: screened,
    highGapCount: highGap,
    highGapRate: screened > 0 ? pct(highGap, screened) : null,
    goodBusinessAfterGap: goodBusiness,
    goodBusinessAfterGapRate: highGap > 0 ? pct(goodBusiness, highGap) : null,
    potentialTargets: potential,
    potentialTargetRate: screened > 0 ? pct(potential, screened) : null,
    trueManualReview: funnel.true_manual_review ?? 0,
  };
}

export async function buildDiscoveryHookComparison(projectRoot: string): Promise<DiscoveryHookComparison> {
  const m95 = await loadJson(resolve(projectRoot, "reports/design-gap-discovery-report.json"));
  const m96 = await loadJson(resolve(projectRoot, "reports/brand-first-discovery-report.json"));
  const m961 = await loadJson(resolve(projectRoot, "reports/brand-first-balanced-report.json"));
  const m97 = await loadJson(resolve(projectRoot, "reports/third-party-brand-mining-report.json"));
  const m98 = await loadJson(resolve(projectRoot, "reports/pdp-gap-first-report.json"));

  return {
    adsFirst: m95 ? metricsFromAdsFirstReport(m95) : null,
    organicFirstParty: m96 ? metricsFromBrandReport(m96) : null,
    organicBalanced: m961 ? metricsFromBrandReport(m961) : null,
    thirdPartyMining: m97 ? metricsFromBrandReport(m97) : null,
    pdpGapFirst: m98 ? metricsFromPdpGapFirstReport(m98) : null,
    note: "Vergelijkt hooks op screened yield, high-gap rate, en targets — niet alleen absolute volumes.",
  };
}
