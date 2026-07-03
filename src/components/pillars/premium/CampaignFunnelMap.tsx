"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

export interface FunnelService {
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
    href: "/diensten/google-ads",
    short: "Google",
    zoneLabel: "Zoek & shopping",
    x: 2,
    y: 2,
    w: 46,
    h: 16,
  },
  {
    href: "/diensten/meta-ads",
    short: "Meta",
    zoneLabel: "Facebook & Instagram",
    x: 52,
    y: 2,
    w: 46,
    h: 16,
  },
  {
    href: "/diensten/adverteren",
    short: "Strategie",
    zoneLabel: "Budget & schaalpad",
    x: 8,
    y: 20,
    w: 84,
    h: 12,
  },
  {
    href: "/diensten/social-media",
    short: "Social",
    zoneLabel: "Organisch bereik",
    x: 2,
    y: 34,
    w: 23,
    h: 22,
  },
  {
    href: "/diensten/ugc",
    short: "UGC",
    zoneLabel: "Creator content",
    x: 27,
    y: 34,
    w: 23,
    h: 22,
  },
  {
    href: "/diensten/influencer-marketing",
    short: "Influencer",
    zoneLabel: "Samenwerkingen",
    x: 52,
    y: 34,
    w: 23,
    h: 22,
  },
  {
    href: "/diensten/media",
    short: "Beeld",
    zoneLabel: "Foto & video-ads",
    x: 77,
    y: 34,
    w: 21,
    h: 22,
  },
  {
    href: "/diensten/marketplaces",
    short: "Bol",
    zoneLabel: "Bol & Amazon",
    x: 22,
    y: 60,
    w: 56,
    h: 18,
  },
];

const CHANNEL_PILLS = ["Google", "Meta", "UGC", "Creators", "Bol"] as const;

const FLOATING_BLOCKS = [
  { top: "6%", left: "-3%", w: 24, h: 16, rotate: -10, delay: 0 },
  { top: "70%", left: "90%", w: 20, h: 12, rotate: 8, delay: 0.5 },
] as const;

const MAP_STATS = [
  { label: "Campagnevlakken", value: "8" },
  { label: "Paid + creators", value: "Ja" },
  { label: "Meetbaar", value: "ROAS" },
] as const;

function ZoneContent({ href, isActive }: { href: string; isActive: boolean }) {
  const dim = isActive ? "opacity-100" : "opacity-70";
  switch (href) {
    case "/diensten/google-ads":
      return (
        <div className={`flex h-full items-center gap-2 px-3 ${dim}`}>
          <span className="text-[10px] font-bold text-[#4285F4]">G</span>
          {[0.9, 0.7, 0.5].map((w, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full ${i === 0 ? "bg-[#4285F4]" : "bg-slate-200"}`}
              style={{ width: `${w * 40}px` }}
              aria-hidden
            />
          ))}
        </div>
      );
    case "/diensten/meta-ads":
      return (
        <div className={`flex h-full items-center justify-center gap-1 p-2 ${dim}`}>
          <span className="size-6 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]" aria-hidden />
          <span className="text-[9px] font-bold text-slate-600">Reels ad</span>
        </div>
      );
    case "/diensten/adverteren":
      return (
        <div className={`flex h-full items-center justify-center gap-2 px-3 ${dim}`}>
          {["Google", "Meta", "Budget"].map((l, i) => (
            <span
              key={l}
              className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                i === 2 ? "bg-[#FF5722] text-white" : "bg-white/80 text-slate-600"
              }`}
            >
              {l}
            </span>
          ))}
        </div>
      );
    case "/diensten/ugc":
      return (
        <div className={`flex h-full flex-col justify-end p-2 ${dim}`}>
          <div className="rounded-lg border border-[#FF5722]/30 bg-[#FF5722]/10 p-1.5">
            <span className="text-[8px] font-bold text-[#FF5722]">UGC · 15s</span>
          </div>
        </div>
      );
    case "/diensten/influencer-marketing":
      return (
        <div className={`flex h-full items-center justify-center ${dim}`}>
          <span className="text-lg" aria-hidden>
            ★
          </span>
          <span className="ml-1 text-[9px] font-bold text-amber-500">Creator</span>
        </div>
      );
    case "/diensten/social-media":
      return (
        <div className={`space-y-1 p-2 ${dim}`}>
          {[0.85, 0.65].map((w, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full bg-slate-200"
              style={{ width: `${w * 100}%` }}
              aria-hidden
            />
          ))}
        </div>
      );
    case "/diensten/media":
      return (
        <div className={`flex h-full items-center justify-center ${dim}`}>
          <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold text-slate-600">
            9:16
          </span>
        </div>
      );
    case "/diensten/marketplaces":
      return (
        <div className={`flex h-full items-center justify-center gap-2 ${dim}`}>
          <span className="rounded bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-white">
            Bol
          </span>
          <span className="rounded bg-slate-700 px-2 py-0.5 text-[8px] font-bold text-white">
            Amazon
          </span>
        </div>
      );
    default:
      return null;
  }
}

interface CampaignFunnelMapProps {
  title: string;
  subtitle: string;
  services: FunnelService[];
}

/**
 * Campagne-funnel: interactieve kaart van paid tot creators en marketplaces.
 */
export function CampaignFunnelMap({
  title,
  subtitle,
  services,
}: CampaignFunnelMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const zoneByHref = new Map(ZONES.map((z) => [z.href, z]));
  const activeZone = active ? zoneByHref.get(active) : null;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#070b14]"
      aria-labelledby="funnel-map-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_0%,rgba(255,87,34,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_95%_100%,rgba(66,133,244,0.1),transparent_50%)]"
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
              className="pointer-events-none absolute rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent"
              style={{
                top: block.top,
                left: block.left,
                width: `${block.w}%`,
                height: `${block.h}%`,
                rotate: `${block.rotate}deg`,
              }}
              animate={{ y: [0, -8, 0] }}
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
        className="pointer-events-none absolute -left-16 top-1/3 size-64 rounded-full bg-[#FF5722]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-0 size-56 rounded-full bg-[#4285F4]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          De campagne-funnel
        </p>
        <h2
          id="funnel-map-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-300">{subtitle}</p>

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
          <div className="flex flex-col">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-1 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-transparent">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
                  <span className="size-2 rounded-full bg-[#4285F4]/80" aria-hidden />
                  <span className="size-2 rounded-full bg-[#E1306C]/80" aria-hidden />
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-slate-400">
                    funnel.live
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-emerald-400">ROAS 4,2×</span>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(66,133,244,0.05)_0%,transparent_40%,rgba(255,87,34,0.06)_100%)]">
                  <svg
                    className="pointer-events-none absolute inset-0 size-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M 50 8 L 25 24 L 50 32 L 75 24 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.3"
                    />
                    <path
                      d="M 25 56 L 50 78 L 75 56"
                      fill="none"
                      stroke="rgba(255,87,34,0.15)"
                      strokeWidth="0.3"
                      strokeDasharray="2 2"
                    />
                  </svg>

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
                  Beweeg over de funnel of de lijst
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
                  transition={{ delay: 0.03 * index }}
                  className="flex flex-1"
                >
                  <Link
                    href={service.href}
                    onMouseEnter={() => setActive(service.href)}
                    onMouseLeave={() => setActive(null)}
                    className={`group flex w-full flex-col justify-center gap-1 rounded-2xl border px-4 py-3 backdrop-blur-sm transition-all duration-300 sm:flex-row sm:items-center sm:gap-3.5 ${
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
