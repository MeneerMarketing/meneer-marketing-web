/**
 * Milestone 9.5.1 — raw_design_gap_opportunity (presentation-only, no business weighting).
 */

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeRawDesignGapOpportunity(input: {
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGapProxy: number | null;
  contentPresentationQuality: number | null;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  const visual = input.preauditVisualGap ?? 45;
  const purchase = input.preauditPurchaseGap ?? 45;
  const mobile = input.mobileGapProxy ?? 45;
  const presentation = input.contentPresentationQuality;

  let presentationBoost = 0;
  if (presentation != null) {
    if (presentation <= 38) {
      presentationBoost = 12;
      evidence.push("weak_presentation_boost");
    } else if (presentation <= 52) {
      presentationBoost = 6;
      evidence.push("moderate_presentation_boost");
    } else if (presentation >= 72) {
      presentationBoost = -14;
      evidence.push("strong_presentation_penalty");
    } else if (presentation >= 62) {
      presentationBoost = -6;
      evidence.push("decent_presentation_penalty");
    }
  }

  const raw = visual * 0.38 + purchase * 0.34 + mobile * 0.22 + presentationBoost;
  return { score: clamp(raw), evidence };
}
