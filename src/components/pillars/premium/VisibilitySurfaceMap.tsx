"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import {
  VisibilitySurfaceIllustration,
  type SurfaceStageVisual,
} from "@/components/pillars/premium/VisibilitySurfaceIllustration";
import { PillarHubServiceList } from "@/components/pillars/premium/PillarHubServiceList";

export interface SurfaceService {
  name: string;
  description: string;
  href: string;
}

const SERVICE_ORDER = [
  "/diensten/seo",
  "/diensten/ai-zoek",
  "/diensten/local-seo",
  "/diensten/content-marketing",
  "/diensten/reviews",
] as const;

const CHANNEL_PILLS = ["Google", "ChatGPT", "Gemini", "Maps"] as const;

const STAGE_META: Record<
  string,
  { label: string; emoji: string; widthPct: number; quip: string }
> = {
  "/diensten/seo": {
    label: "Google SEO",
    emoji: "🔍",
    widthPct: 100,
    quip: "Eerst organisch scoren, dan pas ads schalen. Die volgorde houdt je marge gezond.",
  },
  "/diensten/ai-zoek": {
    label: "AI-antwoorden",
    emoji: "🤖",
    widthPct: 92,
    quip: "Veel mensen vragen ChatGPT vóór ze Google openen. Als jij niet in het antwoord staat, bestaat je voor hen niet.",
  },
  "/diensten/local-seo": {
    label: "Maps & lokaal",
    emoji: "📍",
    widthPct: 84,
    quip: "Iemand zoekt in jouw regio. Jij in de Maps-pack of je concurrent op de hoek.",
  },
  "/diensten/content-marketing": {
    label: "Content & autoriteit",
    emoji: "📝",
    widthPct: 76,
    quip: "Artikelen die vragen beantwoorden vóór iemand belt. Autoriteit die verkoopt zonder korting.",
  },
  "/diensten/reviews": {
    label: "Reviews & trust",
    emoji: "⭐",
    widthPct: 68,
    quip: "4,9 sterren en de twijfel is weg. Social proof op de plekken waar mensen echt kijken.",
  },
};

const DEFAULT_QUIP =
  "Beweeg over een zoekvlak. Ik laat zien waar je gevonden wordt en waar je nog onzichtbaar bent.";

interface VisibilitySurfaceMapProps {
  title: string;
  subtitle: string;
  services: SurfaceService[];
}

/**
 * Vindbaarheid-hub: lichte Meneer-stijl, zoeklandschap-illustratie, sync met dienstenlijst.
 */
export function VisibilitySurfaceMap({
  title,
  subtitle,
  services,
}: VisibilitySurfaceMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const orderedServices = useMemo(() => {
    const byHref = new Map(services.map((s) => [s.href, s]));
    return SERVICE_ORDER.map((href) => byHref.get(href)).filter(
      (s): s is SurfaceService => Boolean(s),
    );
  }, [services]);

  const stages: SurfaceStageVisual[] = useMemo(
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
      aria-labelledby="surface-map-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Het zoeklandschap
        </p>
        <h2
          id="surface-map-heading"
          className="mt-4 max-w-2xl text-balance text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl lg:text-[2.1rem]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {CHANNEL_PILLS.map((pill, i) => (
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
          <VisibilitySurfaceIllustration
            stages={stages}
            activeHref={active}
            quip={quip}
          />

          <PillarHubServiceList
            heading="Kies je zoekvlak"
            hint="Hover = zoekvlak + Meneer-quip"
            items={listItems}
            activeHref={active}
            onActiveChange={setActive}
          />
        </div>
      </div>
    </section>
  );
}
