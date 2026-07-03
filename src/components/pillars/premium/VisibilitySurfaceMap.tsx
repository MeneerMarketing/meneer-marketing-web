"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

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
    zoneLabel: "ChatGPT & Perplexity",
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

const MAP_STATS = [
  { label: "Zoekvlakken", value: "5" },
  { label: "Focus", value: "Helder" },
  { label: "Meetbaar", value: "Ja" },
] as const;

function ZoneContent({ href }: { href: string }) {
  switch (href) {
    case "/diensten/seo":
      return (
        <div className="flex h-full flex-col justify-center gap-1 px-3 py-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`size-1.5 rounded-full ${i === 1 ? "bg-[#FF5722]" : "bg-slate-500"}`}
                aria-hidden
              />
              <span
                className={`h-1.5 rounded-full bg-slate-400 ${i === 1 ? "w-2/3 bg-emerald-400/80" : "w-1/2"}`}
                aria-hidden
              />
            </div>
          ))}
        </div>
      );
    case "/diensten/ai-zoek":
      return (
        <div className="flex h-full flex-col justify-end p-2.5">
          <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-2">
            <p className="text-[8px] font-bold text-sky-200">AI-antwoord</p>
            <p className="mt-1 text-[9px] text-white/80">
              MeneerMarketing bouwt...
            </p>
          </div>
        </div>
      );
    case "/diensten/local-seo":
      return (
        <div className="flex h-full items-center justify-center p-2">
          <div className="text-center">
            <span className="text-lg" aria-hidden>
              📍
            </span>
            <p className="mt-1 text-[8px] font-bold text-emerald-300">Maps pack</p>
          </div>
        </div>
      );
    case "/diensten/content-marketing":
      return (
        <div className="space-y-1 p-2.5">
          {[0.9, 0.75, 0.85].map((w, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full bg-slate-400/50"
              style={{ width: `${w * 100}%` }}
              aria-hidden
            />
          ))}
        </div>
      );
    case "/diensten/reviews":
      return (
        <div className="flex h-full items-center justify-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[10px] text-amber-300" aria-hidden>
              ★
            </span>
          ))}
          <span className="ml-1 text-[9px] font-bold text-white">4,9</span>
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
 * Het zoeklandschap: interactieve kaart van vijf vindbaarheidsvlakken.
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
    <section
      className="border-b border-slate-200 bg-slate-950"
      aria-labelledby="surface-map-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-sky-300">
          Het zoeklandschap
        </p>
        <h2
          id="surface-map-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">{subtitle}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="flex flex-col">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-sky-500/25 bg-slate-900/80 shadow-[0_32px_64px_-28px_rgba(2,6,23,0.9)]">
              <div className="flex items-center gap-2 border-b border-sky-500/15 px-4 py-2.5">
                <span className="size-2 rounded-full bg-sky-400/50" aria-hidden />
                <span className="font-mono text-[10px] tracking-wider text-sky-300/70">
                  zoeklandschap.map
                </span>
                <span className="ml-auto font-mono text-[10px] text-sky-400/50">
                  live SERP
                </span>
              </div>
              <div className="relative aspect-[4/3] w-full flex-1">
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
                      className={`absolute rounded-xl border transition-all duration-300 ${
                        isActive
                          ? "z-10 border-[#FF5722] bg-white shadow-[0_0_0_4px_rgba(255,87,34,0.25)]"
                          : "border-dashed border-sky-400/35 bg-slate-800/60"
                      } ${isDimmed ? "opacity-30" : "opacity-100"}`}
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.w}%`,
                        height: `${zone.h}%`,
                      }}
                    >
                      <span
                        className={`block size-full transition-opacity ${
                          isActive ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        <ZoneContent href={zone.href} />
                      </span>
                      <AnimatePresence>
                        {isActive ? (
                          <motion.span
                            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="pointer-events-none absolute -top-2.5 left-2 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold text-white"
                          >
                            {zone.short}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {MAP_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-sky-400/70">
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
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-xs text-sky-200/80"
                >
                  Vlak:{" "}
                  <span className="font-bold text-white">{activeZone.zoneLabel}</span>
                </motion.p>
              ) : (
                <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400/60">
                  Beweeg over de kaart of de lijst
                </p>
              )}
            </AnimatePresence>
          </div>

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
                    className={`group flex w-full flex-col justify-center gap-1 rounded-2xl border px-4 py-3.5 transition-all sm:flex-row sm:items-center sm:gap-3.5 ${
                      isActive
                        ? "border-[#FF5722]/60 bg-white/[0.07]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center gap-3 sm:contents">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-[#FF5722] text-white"
                            : "bg-white/10 text-sky-300"
                        }`}
                        aria-hidden
                      >
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-extrabold tracking-tight ${
                            isActive ? "text-white" : "text-slate-200"
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
                      <span className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300/80 sm:inline">
                        {zone.short}
                      </span>
                    ) : null}
                    <ArrowUpRight
                      className={`hidden size-4 sm:block ${
                        isActive ? "text-[#FF5722]" : "text-slate-500"
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
    </section>
  );
}
