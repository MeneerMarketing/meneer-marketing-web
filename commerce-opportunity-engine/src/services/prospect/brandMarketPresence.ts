/**
 * Milestone 9.7 — brand market presence from independent third-party sources.
 */

import type { ThirdPartySourceType } from "../../config/thirdPartyBrandMining.js";

export type SourceObservation = {
  sourceDomain: string;
  sourceType: ThirdPartySourceType;
  sourceUrl: string | null;
  discoverySourceQuality: "HIGH" | "MEDIUM" | "LOW";
};

export function computeBrandMarketPresenceScore(observations: SourceObservation[]): {
  score: number;
  independentSourceCount: number;
  evidence: string[];
} {
  const uniqueDomains = new Set<string>();
  const uniqueTypes = new Set<ThirdPartySourceType>();
  let qualityBoost = 0;
  const evidence: string[] = [];

  for (const obs of observations) {
    uniqueDomains.add(obs.sourceDomain);
    uniqueTypes.add(obs.sourceType);
    if (obs.discoverySourceQuality === "HIGH") qualityBoost += 3;
    else if (obs.discoverySourceQuality === "MEDIUM") qualityBoost += 1;
  }

  const count = uniqueDomains.size;
  let score = 20;
  if (count >= 5) {
    score = 88;
    evidence.push("five_plus_independent_sources");
  } else if (count >= 3) {
    score = 72;
    evidence.push("three_plus_independent_sources");
  } else if (count === 2) {
    score = 55;
    evidence.push("two_independent_sources");
  } else if (count === 1) {
    score = 35;
    evidence.push("single_source");
  }

  score = Math.min(100, score + Math.min(12, qualityBoost));
  if (uniqueTypes.size >= 2) {
    score = Math.min(100, score + 6);
    evidence.push("multi_source_type");
  }

  return {
    score,
    independentSourceCount: count,
    evidence,
  };
}
