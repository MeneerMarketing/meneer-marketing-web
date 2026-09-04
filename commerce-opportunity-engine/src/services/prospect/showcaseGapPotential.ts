/**
 * Milestone 9.8.2 — showcase_gap_potential for visible before/after preview potential.
 */

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function norm(v: number | null, fallback = 45): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return clamp(v);
}

export function computeShowcaseGapPotential(input: {
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentAvailable: number | null;
  contentPresentation: number | null;
  assetQualityProxy: number | null;
}): { score: number; evidence: string[]; showcaseReady: boolean } {
  const evidence: string[] = [];
  const visual = norm(input.preauditVisualGap);
  const purchase = norm(input.preauditPurchaseGap);
  const mobile = norm(input.mobileGap);
  const available = norm(input.contentAvailable);
  const presentation = norm(input.contentPresentation, 55);
  const assets = norm(input.assetQualityProxy);

  const presentationGap = clamp(100 - presentation);
  const visualTransform = visual * 0.38 + presentationGap * 0.12;
  const purchaseTransform = purchase * 0.22 + mobile * 0.18;
  const materialLever = available * 0.14 + assets * 0.08;

  let score = visualTransform + purchaseTransform + materialLever;

  if (visual >= 55 && presentation <= 50) {
    score += 8;
    evidence.push("visual_vs_presentation_gap");
  }
  if (available >= 65 && presentation <= 55) {
    score += 6;
    evidence.push("content_underpresented");
  }
  if (assets >= 60 && visual >= 45) {
    score += 5;
    evidence.push("assets_ready_for_redesign");
  }
  if (visual < 35 && purchase < 55) {
    score -= 12;
    evidence.push("weak_showcase_signal");
  }

  const final = clamp(score);
  const showcaseReady =
    visual >= 50 && (purchase >= 60 || mobile >= 60) && final >= 55;

  if (showcaseReady) evidence.push("showcase_ready_profile");

  return { score: final, evidence, showcaseReady };
}

export function isHighGapCandidate(input: {
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  rawPdpRedesignOpportunity: number | null;
}): boolean {
  const visual = input.preauditVisualGap ?? 0;
  const purchase = input.preauditPurchaseGap ?? 0;
  const mobile = input.mobileGap ?? 0;
  const raw = input.rawPdpRedesignOpportunity ?? 0;
  return (
    visual >= 60 ||
    purchase >= 65 ||
    mobile >= 65 ||
    raw >= 58
  );
}
