"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import {
  RetentionLoopIllustration,
  type RetentionStageVisual,
} from "@/components/pillars/premium/RetentionLoopIllustration";
import { PillarHubServiceList } from "@/components/pillars/premium/PillarHubServiceList";

export interface SystemService {
  name: string;
  description: string;
  href: string;
}

const SERVICE_ORDER = [
  "/diensten/email",
  "/diensten/retentie",
  "/diensten/automatisering",
  "/diensten/workflows",
  "/diensten/chatbots",
] as const;

const STAGE_META: Record<
  string,
  { label: string; emoji: string; widthPct: number; quip: string }
> = {
  "/diensten/email": {
    label: "E-mail & flows",
    emoji: "✉️",
    widthPct: 52,
    quip: "Welkom, cart recovery, win-back direct na koop. Omzet per mailreeks.",
  },
  "/diensten/retentie": {
    label: "Retentie",
    emoji: "🔁",
    widthPct: 64,
    quip: "Herhaal op het moment dat ze weer iets nodig hebben. Loyalty die werkt.",
  },
  "/diensten/automatisering": {
    label: "Automatisering",
    emoji: "⚡",
    widthPct: 76,
    quip: "Handmatig CSV's slepen terwijl je shop draait? Systemen praten met elkaar zodat jij dat niet hoeft.",
  },
  "/diensten/workflows": {
    label: "Shop workflows",
    emoji: "🛒",
    widthPct: 88,
    quip: "Order binnen, voorraad bij, mail eruit. Drie systemen, één flow.",
  },
  "/diensten/chatbots": {
    label: "AI-chatbots",
    emoji: "💬",
    widthPct: 100,
    quip: "Waar is mijn pakketje? AI antwoordt 24/7 waar het past. Uren terug voor je team.",
  },
};

const DEFAULT_QUIP =
  "Beweeg over een module. Ik laat zien waar die in je klantmotor zit en waar je LTV lekt.";

interface RetentionSystemMapProps {
  title: string;
  subtitle: string;
  services: SystemService[];
}

/**
 * Behoud-hub: lichte Meneer-stijl, klantmotor-illustratie, sync met dienstenlijst.
 */
export function RetentionSystemMap({
  title,
  subtitle,
  services,
}: RetentionSystemMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const orderedServices = useMemo(() => {
    const byHref = new Map(services.map((s) => [s.href, s]));
    return SERVICE_ORDER.map((href) => byHref.get(href)).filter(
      (s): s is SystemService => Boolean(s),
    );
  }, [services]);

  const stages: RetentionStageVisual[] = useMemo(
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
      aria-labelledby="system-map-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Klantmotor
        </p>
        <h2
          id="system-map-heading"
          className="mt-4 max-w-2xl text-balance text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl lg:text-[2.1rem]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
          <RetentionLoopIllustration
            stages={stages}
            activeHref={active}
            quip={quip}
          />

          <PillarHubServiceList
            heading="Kies je traject"
            hint="Hover = motor + Meneer-quip"
            items={listItems}
            activeHref={active}
            onActiveChange={setActive}
          />
        </div>
      </div>
    </section>
  );
}
