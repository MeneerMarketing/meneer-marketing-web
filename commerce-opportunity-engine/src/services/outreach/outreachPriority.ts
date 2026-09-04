import { OUTREACH_PRIORITY_WEIGHTS } from "../../config/outreach.js";

export type OutreachPriorityInput = {
  opportunityScore: number | null;
  mmFit: number | null;
  auditConfidence: number | null;
  supportedFindingsCount: number;
  recommendedProjectType: string | null;
  businessMaturity: number | null;
  sourceQualityScore: number | null;
  contactConfidence: number | null;
  contactFound: boolean;
  pageHealthOk: boolean;
};

export function computeOutreachPriorityScore(
  input: OutreachPriorityInput
): number {
  const w = OUTREACH_PRIORITY_WEIGHTS;

  const supportedNorm = clamp((input.supportedFindingsCount / 5) * 100);
  const projectFit = scoreProjectFit(input.recommendedProjectType);
  const contactability = input.contactFound
    ? clamp(input.contactConfidence ?? 50)
    : 15;
  const sourceReliability = clamp(input.sourceQualityScore ?? 50);
  const maturity = clamp(input.businessMaturity ?? 50);

  let score =
    clamp(input.opportunityScore ?? 0) * w.opportunityScore +
    clamp(input.mmFit ?? 0) * w.mmFit +
    clamp(input.auditConfidence ?? 0) * w.auditConfidence +
    supportedNorm * w.supportedFindings +
    projectFit * w.projectFit +
    maturity * w.businessMaturity +
    sourceReliability * w.sourceReliability +
    contactability * w.contactability;

  if (!input.pageHealthOk) score *= 0.4;
  if (!input.contactFound) score *= 0.7;

  return Math.round(clamp(score));
}

function scoreProjectFit(projectType: string | null): number {
  switch (projectType) {
    case "CUSTOM_SHOPIFY_REBUILD":
      return 95;
    case "WOOCOMMERCE_TO_SHOPIFY":
      return 90;
    case "SHOPIFY_CRO_REDESIGN":
      return 85;
    case "PDP_OPTIMIZATION":
      return 75;
    case "DESIGN_UPGRADE":
      return 45;
    case "NOT_A_GOOD_FIT":
      return 5;
    default:
      return 30;
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}
