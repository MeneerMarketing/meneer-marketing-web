"use client";

import dynamic from "next/dynamic";
import type { SeoLandingVisual } from "@/data/seo-landings/types";

const SeoLandingVisualSwitcher = dynamic(
  () =>
    import("@/components/seo-landing/SeoLandingVisualSwitcher").then(
      (m) => m.SeoLandingVisualSwitcher,
    ),
  { ssr: true },
);

interface SeoLandingVisualPanelProps {
  visual: SeoLandingVisual;
  keyword?: string;
}

export function SeoLandingVisualPanel({
  visual,
  keyword = "",
}: SeoLandingVisualPanelProps) {
  return <SeoLandingVisualSwitcher visual={visual} keyword={keyword} />;
}
