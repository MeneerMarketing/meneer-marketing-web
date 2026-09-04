/**
 * Milestone 9.4.1 — design_intervention_opportunity.
 *
 * How much concrete redesign work can we point at? High when subscores are weak
 * but the business and assets give us real material to rebuild with.
 */

import type { ConversionLeak } from "../../types/audit.js";

export interface DesignInterventionInput {
  subScores: {
    buyblock: number | null;
    visual: number | null;
    storytelling: number | null;
    media: number | null;
    deepDive: number | null;
    mobile: number | null;
  };
  currentPdpQuality: number | null;
  transformation: number | null;
  assetFeasibility: number | null;
  leaks: ConversionLeak[];
  pdpImprovementPotential: number | null;
}

export interface DesignInterventionResult {
  designInterventionOpportunity: number;
  evidence: string[];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

const SUB_LABELS: Record<string, string> = {
  buyblock: "koopblok",
  visual: "visueel ontwerp",
  storytelling: "verhaal",
  media: "media",
  deepDive: "verdieping",
  mobile: "mobiel",
};

export function computeDesignInterventionOpportunity(
  input: DesignInterventionInput
): DesignInterventionResult {
  const evidence: string[] = [];
  const subs = Object.entries(input.subScores) as Array<[string, number | null]>;

  let weaknessSum = 0;
  let weaknessCount = 0;
  for (const [key, value] of subs) {
    if (value == null) continue;
    const room = 100 - value;
    weaknessSum += room;
    weaknessCount += 1;
    if (value < 55) {
      evidence.push(`${SUB_LABELS[key] ?? key} laag (${value})`);
    }
  }

  const avgWeakness =
    weaknessCount > 0 ? weaknessSum / weaknessCount : input.currentPdpQuality != null ? 100 - input.currentPdpQuality : 50;

  const leakBoost = Math.min(
    18,
    input.leaks.filter((leak) => leak.severity === "HIGH" || leak.severity === "CRITICAL").length * 6 +
      input.leaks.filter((leak) => leak.severity === "MEDIUM").length * 3
  );

  const material = input.assetFeasibility ?? 50;
  let score = avgWeakness * 0.45 + material * 0.25 + (input.transformation ?? 50) * 0.2 + leakBoost;

  if (input.pdpImprovementPotential != null) {
    score = score * 0.7 + input.pdpImprovementPotential * 0.3;
    evidence.push(`Claude PDP-potentieel ${input.pdpImprovementPotential}`);
  }

  if ((input.currentPdpQuality ?? 100) <= 45) {
    score += 6;
    evidence.push("huidige pagina laat veel ruimte");
  } else if ((input.currentPdpQuality ?? 0) >= 70) {
    score -= 12;
    evidence.push("huidige pagina al sterk");
  }

  return {
    designInterventionOpportunity: clamp(score),
    evidence,
  };
}
