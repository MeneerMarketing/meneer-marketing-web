"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";
import {
  hubServiceLinkClass,
  hubZoneClass,
  PillarHubCanvas,
  PillarHubSection,
} from "@/components/pillars/premium/PillarHubSection";

export interface SurfaceService {
  name: string;
  description: string;
  href: string;
}

interface Zone {
  href: string;
  short: string;
  zoneLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const ZONES: Zone[] = [
  {
    href: "/diensten/seo",
    short: "SEO",
    zoneLabel: "Organische rankings",
    x: 4,
    y: 4,
    w: 92,
    h: 18,
  },
  {
    href: "/diensten/ai-zoek",
    short: "AI",
    zoneLabel: "ChatGPT · Gemini · Claude",
    x: 4,
    y: 26,
    w: 44,
    h: 28,
  },
  {
    href: "/diensten/local-seo",
    short: "Lokaal",
    zoneLabel: "Maps & Google Business",
    x: 52,
    y: 26,
    w: 44,
    h: 28,
  },
  {
    href: "/diensten/content-marketing",
    short: "Content",
    zoneLabel: "Autoriteit & kennisbank",
    x: 4,
    y: 58,
    w: 44,
    h: 26,
  },
  {
    href: "/diensten/reviews",
    short: "Reviews",
    zoneLabel: "Social proof & trust",
    x: 52,
    y: 58,
    w: 44,
    h: 26,
  },
];

const CHANNEL_PILLS = ["Google", "ChatGPT", "Gemini", "Claude", "Maps"] as const;

const MAP_STATS = [
  { label: "Zoekvlakken", value: "5" },
  { label: "AI-kanalen", value: "3+" },
  { label: "Meetbaar", value: "Ja" },
] as const;

function ZoneContent({ href, isActive }: { href: string; isActive: boolean }) {
  const dim = isActive ? "opacity-100" : "opacity-70";
  switch (href) {
    case "/diensten/seo":
      return (
        <div className={`flex h-full flex-col justify-center gap-1 px-3 py-1 ${dim}`}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`size-1.5 rounded-full ${i === 1 ? "bg-[#FF5722]" : "bg-slate-300"}`}
                aria-hidden
              />
              <span
                className={`h-1.5 rounded-full ${i === 1 ? "w-2/3 bg-emerald-400" : "w-1/2 bg-slate-200"}`}
                aria-hidden
              />
            </div>
          ))}
        </div>
      );
    case "/diensten/ai-zoek":
      return (
        <div className={`flex h-full flex-col justify-end p-2.5 ${dim}`}>
          <div className="rounded-lg border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-2 shadow-sm">
            <p className="text-[8px] font-bold text-sky-600">AI-antwoord</p>
            <p className="mt-1 text-[9px] font-semibold text-slate-700">
              MeneerMarketing bouwt...
            </p>
          </div>
        </div>
      );
    case "/diensten/local-seo":
      return (
        <div className={`flex h-full items-center justify-center p-2 ${dim}`}>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
            <span className="text-base" aria-hidden>
              📍
            </span>
            <p className="mt-0.5 text-[8px] font-bold text-emerald-700">Maps pack</p>
          </div>
        </div>
      );
    case "/diensten/content-marketing":
      return (
        <div className={`space-y-1.5 p-2.5 ${dim}`}>
          {[0.9, 0.75, 0.85].map((w, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full bg-slate-200"
              style={{ width: `${w * 100}%` }}
              aria-hidden
            />
          ))}
        </div>
      );
    case "/diensten/reviews":
      return (
        <div className={`flex h-full items-center justify-center gap-0.5 ${dim}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[10px] text-amber-400" aria-hidden>
              ★
            </span>
          ))}
          <span className="ml-1 text-[9px] font-bold text-slate-700">4,9</span>
        </div>
      );
    default:
      return null;
  }
}

interface VisibilitySurfaceMapProps {
  title: string;
  subtitle: string;
  services: SurfaceService[];
}

/**
 * Het zoeklandschap: premium interactieve kaart met grid-gloed en glas-panelen.
 */
export function VisibilitySurfaceMap({
  title,
  subtitle,
  services,
}: VisibilitySurfaceMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const zoneByHref = new Map(ZONES.map((z) => [z.href, z]));
  const activeZone = active ? zoneByHref.get(active) : null;

  return (
    <PillarHubSection aria-labelledby="surface-map-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Het zoeklandschap
        </p>
        <h2
          id="surface-map-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-300">{subtitle}</p>

        {/* Zwevende kanaal-pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CHANNEL_PILLS.map((pill, i) => (
            <motion.span
              key={pill}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-slate-200 backdrop-blur-sm"
            >
              {pill}
            </motion.span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Canvas-kolom */}
          <div className="flex flex-col">
            <PillarHubCanvas barTitle="zoeklandschap.live" barStatus="live">
              {ZONES.map((zone) => {
                const service = services.find((s) => s.href === zone.href);
                if (!service) return null;
                const isActive = active === zone.href;
                const isDimmed = active !== null && !isActive;
                return (
                  <button
                    key={zone.href}
                    type="button"
                    onMouseEnter={() => setActive(zone.href)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(zone.href)}
                    onBlur={() => setActive(null)}
                    aria-label={service.name}
                    className={hubZoneClass(isActive, isDimmed)}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.w}%`,
                      height: `${zone.h}%`,
                    }}
                  >
                    <ZoneContent href={zone.href} isActive={isActive} />
                    <AnimatePresence>
                      {isActive ? (
                        <motion.span
                          initial={reduce ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="pointer-events-none absolute -top-2.5 left-2 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold text-white shadow-md"
                        >
                          {zone.short}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </button>
                );
              })}
            </PillarHubCanvas>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {MAP_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-center backdrop-blur-sm"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeZone ? (
                <motion.p
                  key={activeZone.href}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-xs text-slate-300"
                >
                  Vlak:{" "}
                  <span className="font-bold text-white">{activeZone.zoneLabel}</span>
                </motion.p>
              ) : (
                <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Beweeg over de kaart of de lijst
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* Diensten-kolom */}
          <ul className="flex flex-col gap-2">
            {services.map((service, index) => {
              const Icon = megaMenuIconForHref(service.href);
              const zone = zoneByHref.get(service.href);
              const isActive = active === service.href;
              return (
                <motion.li
                  key={service.href}
                  initial={reduce ? false : { opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * index }}
                  className="flex flex-1"
                >
                  <Link
                    href={service.href}
                    onMouseEnter={() => setActive(service.href)}
                    onMouseLeave={() => setActive(null)}
                    className={hubServiceLinkClass(isActive)}
                  >
                    <span className="flex items-center gap-3 sm:contents">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? "bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                            : "bg-white/10 text-slate-300"
                        }`}
                        aria-hidden
                      >
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-extrabold tracking-tight ${
                            isActive ? "text-white" : "text-slate-100"
                          }`}
                        >
                          {service.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {service.description}
                        </span>
                      </span>
                    </span>
                    {zone ? (
                      <span className="hidden rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300 sm:inline">
                        {zone.short}
                      </span>
                    ) : null}
                    <ArrowUpRight
                      className={`hidden size-4 sm:block ${
                        isActive
                          ? "translate-x-0.5 -translate-y-0.5 text-[#FF5722]"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-hidden
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </PillarHubSection>
  );
}
