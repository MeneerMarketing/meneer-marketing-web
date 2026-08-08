"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import {
  BuildBlueprintIllustration,
  type BlueprintStageVisual,
} from "@/components/pillars/premium/BuildBlueprintIllustration";
import { PillarHubServiceList } from "@/components/pillars/premium/PillarHubServiceList";

export interface BlueprintService {
  name: string;
  description: string;
  href: string;
}

const SERVICE_ORDER = [
  "/diensten/webdevelopment",
  "/diensten/shopify-enterprise",
  "/diensten/web-apps",
  "/diensten/optimalisatie",
  "/diensten/webdesign",
  "/diensten/branding",
  "/diensten/animaties",
] as const;

const BUILD_PILLS = ["From scratch", "Shopify", "Next.js", "Custom build"] as const;

const STAGE_META: Record<
  string,
  { label: string; emoji: string; widthPct: number; quip: string }
> = {
  "/diensten/webdevelopment": {
    label: "Structuur & code",
    emoji: "🏗️",
    widthPct: 100,
    quip: "Eigen code from scratch, zodat je site snel blijft en mee kan schalen.",
  },
  "/diensten/shopify-enterprise": {
    label: "Shopify shop",
    emoji: "🛒",
    widthPct: 92,
    quip: "Shopify from scratch. Custom theme, geen themeforest-trucjes die je checkout vertragen.",
  },
  "/diensten/web-apps": {
    label: "Portaal & app",
    emoji: "🔐",
    widthPct: 84,
    quip: "B2B-portaal met rollen en koppelingen. Software die je team echt gebruikt.",
  },
  "/diensten/optimalisatie": {
    label: "Snelheid",
    emoji: "⚡",
    widthPct: 76,
    quip: "Duurt je site langer dan 3 seconden? Dan is de helft al weg voordat ze iets zien.",
  },
  "/diensten/webdesign": {
    label: "UI/UX",
    emoji: "🎨",
    widthPct: 68,
    quip: "Ontwerp dat vertrouwen wekt én converteert. Mooi zonder dat het traag wordt.",
  },
  "/diensten/branding": {
    label: "Merk & huisstijl",
    emoji: "✦",
    widthPct: 60,
    quip: "Herkenning vanaf de eerste seconde. Huisstijl die online en offline klopt.",
  },
  "/diensten/animaties": {
    label: "Motion",
    emoji: "✨",
    widthPct: 52,
    quip: "Die ene laag die je site onvergetelijk maakt. Motion met een doel, geen gimmick.",
  },
};

const DEFAULT_QUIP =
  "Beweeg over een bouwblok. Ik laat zien waar dat in je site zit en waar je op moet letten.";

interface ServiceBlueprintMapProps {
  title: string;
  subtitle: string;
  services: BlueprintService[];
}

/**
 * Bouwen-hub: lichte Meneer-stijl, bouwtekening-illustratie, sync met dienstenlijst.
 */
export function ServiceBlueprintMap({
  title,
  subtitle,
  services,
}: ServiceBlueprintMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const orderedServices = useMemo(() => {
    const byHref = new Map(services.map((s) => [s.href, s]));
    return SERVICE_ORDER.map((href) => byHref.get(href)).filter(
      (s): s is BlueprintService => Boolean(s),
    );
  }, [services]);

  const stages: BlueprintStageVisual[] = useMemo(
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
      aria-labelledby="blueprint-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          De bouwtekening
        </p>
        <h2
          id="blueprint-heading"
          className="mt-4 max-w-2xl text-balance text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl lg:text-[2.1rem]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {BUILD_PILLS.map((pill, i) => (
            <motion.span
              key={pill}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i }}
              className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm"
            >
              {pill}
            </motion.span>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
          <BuildBlueprintIllustration stages={stages} activeHref={active} quip={quip} />

          <PillarHubServiceList
            heading="Kies je bouwblok"
            hint="Hover = tekening + Meneer-quip"
            items={listItems}
            activeHref={active}
            onActiveChange={setActive}
          />
        </div>
      </div>
    </section>
  );
}
