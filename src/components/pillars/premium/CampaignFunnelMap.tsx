"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import {
  CampaignFunnelIllustration,
  type FunnelStageVisual,
} from "@/components/pillars/premium/CampaignFunnelIllustration";
import { PillarHubServiceList } from "@/components/pillars/premium/PillarHubServiceList";

export interface FunnelService {
  name: string;
  description: string;
  href: string;
}

const SERVICE_ORDER = [
  "/diensten/google-ads",
  "/diensten/meta-ads",
  "/diensten/social-media",
  "/diensten/ugc",
  "/diensten/influencer-marketing",
  "/diensten/media",
  "/diensten/marketplaces",
] as const;

const STAGE_META: Record<
  string,
  { label: string; emoji: string; widthPct: number; quip: string }
> = {
  "/diensten/google-ads": {
    label: "Google Ads",
    emoji: "🔍",
    widthPct: 100,
    quip: "Iemand zoekt al wat jij verkoopt. Dan wil je bovenaan staan, niet op pagina twee.",
  },
  "/diensten/meta-ads": {
    label: "Meta Ads",
    emoji: "📱",
    widthPct: 92,
    quip: "Je hook heeft 0,8 seconden. Pak scrollers of verlies ze aan de volgende swipe.",
  },
  "/diensten/social-media": {
    label: "Social organisch",
    emoji: "✨",
    widthPct: 84,
    quip: "Gratis bereik bestaat. Alleen niet als je drie maanden niets post en dan boosten.",
  },
  "/diensten/ugc": {
    label: "UGC",
    emoji: "🎬",
    widthPct: 76,
    quip: "Echte mensen in je ads. Creators die je feed niet overslaat.",
  },
  "/diensten/influencer-marketing": {
    label: "Influencers",
    emoji: "⭐",
    widthPct: 68,
    quip: "Ik meet deals op wat ze opleveren. Marge telt, ego niet.",
  },
  "/diensten/media": {
    label: "Beeld & video",
    emoji: "🎥",
    widthPct: 60,
    quip: "9:16 voor Reels, 1:1 voor feed. Formats die bij het kanaal passen.",
  },
  "/diensten/marketplaces": {
    label: "Bol & Amazon",
    emoji: "📦",
    widthPct: 52,
    quip: "Extra kanaal, eigen marge. Niet je shop kopieren en hopen op magie.",
  },
};

const DEFAULT_QUIP =
  "Beweeg over een kanaal. Ik vertel je waar het in de funnel zit en waar je budget lekt.";

interface CampaignFunnelMapProps {
  title: string;
  subtitle: string;
  services: FunnelService[];
}

/**
 * Campagne-funnel hub: lichte Meneer-stijl, slakkenbuis-illustratie, sync met dienstenlijst.
 */
export function CampaignFunnelMap({
  title,
  subtitle,
  services,
}: CampaignFunnelMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const orderedServices = useMemo(() => {
    const byHref = new Map(services.map((s) => [s.href, s]));
    return SERVICE_ORDER.map((href) => byHref.get(href)).filter(
      (s): s is FunnelService => Boolean(s),
    );
  }, [services]);

  const stages: FunnelStageVisual[] = useMemo(
    () =>
      orderedServices.map((s) => {
        const meta = STAGE_META[s.href];
        return {
          href: s.href,
          label: meta?.label ?? s.name,
          emoji: meta?.emoji ?? "•",
          widthPct: meta?.widthPct ?? 70,
        };
      }),
    [orderedServices],
  );

  const quip =
    (active && STAGE_META[active]?.quip) ||
    (orderedServices[0] && STAGE_META[orderedServices[0].href]?.quip) ||
    DEFAULT_QUIP;

  const listItems = useMemo(
    () =>
      orderedServices.map((s) => ({
        href: s.href,
        name: s.name,
        description: s.description,
        tag: STAGE_META[s.href]?.label,
      })),
    [orderedServices],
  );

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="funnel-map-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Campagne-funnel
        </p>
        <h2
          id="funnel-map-heading"
          className="mt-4 max-w-2xl text-balance text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl lg:text-[2.1rem]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
          <CampaignFunnelIllustration
            stages={stages}
            activeHref={active}
            quip={quip}
          />

          <PillarHubServiceList
            heading="Kies je kanaal"
            hint="Hover = funnel + Meneer-quip"
            items={listItems}
            activeHref={active}
            onActiveChange={setActive}
          />
        </div>
      </div>
    </section>
  );
}
