"use client";

import { MeneerImpactPanels } from "@/components/shared/MeneerImpactPanels";
import { OVER_IMPACT } from "@/data/meneer-impact-panels";

export function OverImpactSection() {
  return <MeneerImpactPanels content={OVER_IMPACT} />;
}
