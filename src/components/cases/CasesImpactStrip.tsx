"use client";

import { MeneerImpactPanels } from "@/components/shared/MeneerImpactPanels";
import { CASES_PAGE_IMPACT } from "@/data/meneer-impact-panels";

export function CasesImpactStrip() {
  return <MeneerImpactPanels content={CASES_PAGE_IMPACT} />;
}
