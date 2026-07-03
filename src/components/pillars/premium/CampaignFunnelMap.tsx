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
    <PillarHubSection aria-labelledby="funnel-map-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
            <PillarHubCanvas barTitle="funnel.live" barStatus="ROAS 4,2×">
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
                    className={`${hubServiceLinkClass(isActive)} group`}
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
