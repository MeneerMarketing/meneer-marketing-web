"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import {
  GrowthCompassIllustration,
  type CompassStageVisual,
} from "@/components/pillars/premium/GrowthCompassIllustration";
import { PillarHubServiceList } from "@/components/pillars/premium/PillarHubServiceList";

export interface ChannelService {
  name: string;
  description: string;
  href: string;
}

const SERVICE_ORDER = [
  "/diensten/strategie",
  "/diensten/adverteren",
  "/diensten/cro",
  "/diensten/leadgeneratie",
  "/diensten/tracking",
] as const;

const STAGE_META: Record<
  string,
  { label: string; emoji: string; widthPct: number; quip: string }
> = {
  "/diensten/strategie": {
    label: "Groeiplan",
    emoji: "🧭",
    widthPct: 52,
    quip: "Eén plan, max drie kanalen tegelijk. Anders brand je budget weg aan twaalf halve pogingen.",
  },
  "/diensten/adverteren": {
    label: "Ads-strategie",
    emoji: "📊",
    widthPct: 64,
    quip: "Google en Meta op één lijn. Niet twee bureaus die elkaar tegenwerken terwijl jij betaalt.",
  },
  "/diensten/cro": {
    label: "CRO & conversie",
    emoji: "🎯",
    widthPct: 76,
    quip: "Meer omzet uit dezelfde bezoekers. Goedkoper dan nog een campagne erbij.",
  },
  "/diensten/leadgeneratie": {
    label: "Leadgeneratie",
    emoji: "📈",
    widthPct: 88,
    quip: "Pipeline vol zonder koude DM's. Funnels die werken terwijl jij met je team zit.",
  },
  "/diensten/tracking": {
    label: "Meten & data",
    emoji: "📡",
    widthPct: 100,
    quip: "Wat je niet meet, kun je niet bijsturen. Tracking staat vóór het budget erdoorheen gaat.",
  },
};

const DEFAULT_QUIP =
  "Beweeg over een laag. Ik laat zien waar die in je groeiplan zit en wat je eerst moet fixen.";

interface GrowthChannelMapProps {
  title: string;
  subtitle: string;
  services: ChannelService[];
}

/**
 * Strategie-hub: lichte Meneer-stijl, groeikompas-illustratie, sync met dienstenlijst.
 */
export function GrowthChannelMap({
  title,
  subtitle,
  services,
}: GrowthChannelMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const orderedServices = useMemo(() => {
    const byHref = new Map(services.map((s) => [s.href, s]));
    return SERVICE_ORDER.map((href) => byHref.get(href)).filter(
      (s): s is ChannelService => Boolean(s),
    );
  }, [services]);

  const stages: CompassStageVisual[] = useMemo(
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
      aria-labelledby="channel-map-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Het groeikompas
        </p>
        <h2
          id="channel-map-heading"
          className="mt-4 max-w-2xl text-balance text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl lg:text-[2.1rem]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
          <GrowthCompassIllustration
            stages={stages}
            activeHref={active}
            quip={quip}
          />

          <PillarHubServiceList
            heading="Kies je traject"
            hint="Hover = kompas + Meneer-quip"
            items={listItems}
            activeHref={active}
            onActiveChange={setActive}
          />
        </div>
      </div>
    </section>
  );
}
