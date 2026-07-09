"use client";

import {
  SeoLandingAiVisual,
  SeoLandingBuildVisual,
  SeoLandingCompareVisual,
  SeoLandingContentVisual,
  SeoLandingEmailFlowVisual,
  SeoLandingGoogleAdsVisual,
  SeoLandingLocalMapsVisual,
  SeoLandingMetaAdsVisual,
  SeoLandingMetricsVisual,
  SeoLandingPortalVisual,
  SeoLandingSerpVisual,
  SeoLandingStrategyStackVisual,
  SeoLandingTrackingVisual,
  SeoLandingWebshopVisual,
} from "@/components/seo-landing/visuals/SeoLandingVisuals";
import type { SeoLandingVisual } from "@/data/seo-landings/types";

interface SeoLandingVisualPanelProps {
  visual: SeoLandingVisual;
  keyword?: string;
}

export function SeoLandingVisualPanel({
  visual,
  keyword = "",
}: SeoLandingVisualPanelProps) {
  switch (visual) {
    case "google-ads":
      return <SeoLandingGoogleAdsVisual />;
    case "meta-ads":
      return <SeoLandingMetaAdsVisual />;
    case "seo-serp":
      return <SeoLandingSerpVisual keyword={keyword} />;
    case "website-build":
      return <SeoLandingBuildVisual />;
    case "webshop":
      return <SeoLandingWebshopVisual />;
    case "b2b-portal":
      return <SeoLandingPortalVisual />;
    case "content-hub":
      return <SeoLandingContentVisual />;
    case "ai-search":
      return <SeoLandingAiVisual keyword={keyword} />;
    case "email-flow":
      return <SeoLandingEmailFlowVisual />;
    case "strategy-stack":
      return <SeoLandingStrategyStackVisual />;
    case "metrics-dashboard":
      return <SeoLandingMetricsVisual />;
    case "local-maps":
      return <SeoLandingLocalMapsVisual />;
    case "tracking-lab":
      return <SeoLandingTrackingVisual />;
    case "compare-split":
      return <SeoLandingCompareVisual />;
    default:
      return null;
  }
}
