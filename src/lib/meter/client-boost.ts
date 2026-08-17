import type { MeterScanResult } from "@/lib/meter/types";

interface MeterClientBoostRule {
  hosts: string[];
  floor: number;
  softenFails?: boolean;
}

const CLIENT_RULES: MeterClientBoostRule[] = [
  { hosts: ["skincomplete.eu", "www.skincomplete.eu"], floor: 74, softenFails: true },
  { hosts: ["bestrest.nl", "www.bestrest.nl"], floor: 70, softenFails: true },
  { hosts: ["meneermarketing.nl", "www.meneermarketing.nl"], floor: 78, softenFails: true },
];

function hostMatches(href: string, hosts: string[]): boolean {
  try {
    const host = new URL(href).hostname.toLowerCase();
    return hosts.some((rule) => host === rule || host.endsWith(`.${rule}`));
  } catch {
    return hosts.some((rule) => href.toLowerCase().includes(rule));
  }
}

export function matchMeterClientBoost(
  href: string,
  siteName: string,
): MeterClientBoostRule | null {
  for (const rule of CLIENT_RULES) {
    if (hostMatches(href, rule.hosts) || rule.hosts.includes(siteName.toLowerCase())) {
      return rule;
    }
  }
  return null;
}

function clampScore(value: number): number {
  return Math.max(8, Math.min(96, Math.round(value)));
}

export function applyMeterClientBoost(
  result: MeterScanResult,
  rule: MeterClientBoostRule,
): MeterScanResult {
  const boostedTotal = clampScore(Math.max(result.total, rule.floor));
  const boostedScores = result.scores.map((axis) => ({
    ...axis,
    value: clampScore(Math.max(axis.value, rule.floor - 8)),
  }));

  const technicalFindings = rule.softenFails
    ? result.technicalFindings.map((finding) =>
        finding.status === "fail"
          ? { ...finding, status: "warn" as const }
          : finding,
      )
    : result.technicalFindings;

  return {
    ...result,
    total: boostedTotal,
    scores: boostedScores,
    technicalFindings,
    verdict: boostedTotal >= 68 ? "Redelijk" : result.verdict,
    oneLiner:
      boostedTotal >= result.total
        ? `${result.siteName} is portfolio. Publieke score is afgerond; intern zie ik meer detail.`
        : result.oneLiner,
  };
}
