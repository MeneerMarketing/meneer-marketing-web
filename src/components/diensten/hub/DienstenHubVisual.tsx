"use client";

import type { PillarSlug } from "@/lib/navigation";
import { HomeCampagnesVisual } from "@/components/home/shared/HomeCampagnesVisual";
import { HomeMobileVindbaarheidVisual } from "@/components/home/mobile/HomeMobileVindbaarheidVisual";
import { DienstenHubBehoudVisual } from "@/components/diensten/hub/DienstenHubBehoudVisual";
import { DienstenHubBouwenVisual } from "@/components/diensten/hub/DienstenHubBouwenVisual";
import { DienstenHubStrategieVisual } from "@/components/diensten/hub/DienstenHubStrategieVisual";

export function DienstenHubVisual({ slug }: { slug: PillarSlug }) {
  if (slug === "strategie") return <DienstenHubStrategieVisual />;
  if (slug === "bouwen") return <DienstenHubBouwenVisual />;
  if (slug === "vindbaarheid") return <HomeMobileVindbaarheidVisual />;
  if (slug === "campagnes") {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0B1220] p-4 sm:p-5">
        <HomeCampagnesVisual size="desktop" bubblePlacement="inline" />
      </div>
    );
  }
  return <DienstenHubBehoudVisual />;
}
