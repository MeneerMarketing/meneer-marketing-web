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

const FLOATING_BLOCKS = [
  { top: "8%", left: "-4%", w: 28, h: 18, rotate: -12, delay: 0 },
  { top: "62%", left: "88%", w: 22, h: 14, rotate: 8, delay: 0.4 },
  { top: "78%", left: "6%", w: 20, h: 12, rotate: -6, delay: 0.8 },
  { top: "18%", left: "92%", w: 16, h: 10, rotate: 14, delay: 1.2 },
] as const;

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
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#070b14]"
      aria-labelledby="surface-map-heading"
    >
      {/* Diepte: mesh + zwevende blokken */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,87,34,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_100%,rgba(56,189,248,0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
      {!reduce
        ? FLOATING_BLOCKS.map((block, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{
                top: block.top,
                left: block.left,
                width: `${block.w}%`,
                height: `${block.h}%`,
                rotate: `${block.rotate}deg`,
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: block.delay,
              }}
              aria-hidden
            />
          ))
        : null}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-[#FF5722]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full bg-sky-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722]/5 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
            <div
              className="relative flex flex-1 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-1 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.6)] backdrop-blur-sm [perspective:1200px]"
            >
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-transparent">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
                  <span className="size-2 rounded-full bg-amber-400/80" aria-hidden />
                  <span className="size-2 rounded-full bg-emerald-400/80" aria-hidden />
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-slate-400">
                    zoeklandschap.live
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">live</span>
                  </span>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(135deg,rgba(255,87,34,0.06)_0%,transparent_45%,rgba(56,189,248,0.08)_100%)]">
                  {/* Hub-lijnen naar actieve zone */}
                  <svg
                    className="pointer-events-none absolute inset-0 size-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    {activeZone ? (
                      <motion.line
                        key={activeZone.href}
                        x1="50"
                        y1="50"
                        x2={activeZone.x + activeZone.w / 2}
                        y2={activeZone.y + activeZone.h / 2}
                        stroke="url(#hub-gradient)"
                        strokeWidth="0.4"
                        strokeDasharray="2 1.5"
                        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.7 }}
                        transition={{ duration: 0.35 }}
                      />
                    ) : null}
                    <defs>
                      <linearGradient id="hub-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF5722" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Centrale hub */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
                    aria-hidden
                  >
                    <span className="relative flex size-3 items-center justify-center">
                      {!reduce ? (
                        <span className="absolute size-8 animate-ping rounded-full bg-[#FF5722]/20" />
                      ) : null}
                      <span className="relative size-2.5 rounded-full bg-gradient-to-br from-[#FF5722] to-sky-400 shadow-[0_0_12px_rgba(255,87,34,0.6)]" />
                    </span>
                  </div>

                  {/* Scan-lijn */}
                  {!reduce ? (
                    <motion.div
                      className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      aria-hidden
                    />
                  ) : null}
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
                            ? "z-10 scale-[1.02] border-[#FF5722] bg-white shadow-[0_0_0_4px_rgba(255,87,34,0.3),0_20px_40px_-12px_rgba(255,87,34,0.35)]"
                            : "border-white/20 bg-white/[0.07] backdrop-blur-sm hover:scale-[1.01] hover:border-white/35 hover:bg-white/10"
                        } ${isDimmed ? "scale-[0.96] opacity-20" : "opacity-100"}`}
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
                </div>
              </div>
            </div>

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
                    className={`group flex w-full flex-col justify-center gap-1 rounded-2xl border px-4 py-3.5 backdrop-blur-sm transition-all duration-300 sm:flex-row sm:items-center sm:gap-3.5 ${
                      isActive
                        ? "border-[#FF5722]/50 bg-white/[0.1] shadow-[inset_0_0_0_1px_rgba(255,87,34,0.2),0_16px_40px_-20px_rgba(255,87,34,0.35)]"
                        : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                    }`}
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
    </section>
  );
}
