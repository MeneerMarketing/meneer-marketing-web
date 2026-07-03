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

export interface ChannelService {
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
    href: "/diensten/strategie",
    short: "Plan",
    zoneLabel: "Groeiplan & prioriteit",
    x: 8,
    y: 4,
    w: 84,
    h: 22,
  },
  {
    href: "/diensten/cro",
    short: "CRO",
    zoneLabel: "Conversie & UX",
    x: 4,
    y: 32,
    w: 44,
    h: 28,
  },
  {
    href: "/diensten/leadgeneratie",
    short: "Leads",
    zoneLabel: "Pipeline & funnels",
    x: 52,
    y: 32,
    w: 44,
    h: 28,
  },
  {
    href: "/diensten/tracking",
    short: "Data",
    zoneLabel: "Meten & dashboards",
    x: 8,
    y: 66,
    w: 84,
    h: 28,
  },
];

const MAP_STATS = [
  { label: "Kanalen", value: "4" },
  { label: "Focus", value: "Max. 3" },
  { label: "Ritme", value: "Maandelijks" },
] as const;

function ZoneContent({ href }: { href: string }) {
  switch (href) {
    case "/diensten/strategie":
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 px-4 py-2">
          <div className="flex gap-1.5">
            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
              <span
                key={q}
                className="flex-1 rounded-md border border-sky-400/40 bg-sky-500/10 py-1 text-center text-[8px] font-bold text-sky-200"
              >
                {q}
              </span>
            ))}
          </div>
          <span className="block h-1.5 w-2/3 rounded-full bg-sky-300/60" aria-hidden />
        </div>
      );
    case "/diensten/cro":
      return (
        <div className="flex h-full items-center justify-center p-3">
          <div className="w-full space-y-1.5">
            <span className="block h-2 w-4/5 rounded-full bg-white/80" aria-hidden />
            <span className="inline-block h-5 w-14 rounded-full bg-[#FF5722]/80" aria-hidden />
            <div className="flex justify-between text-[8px] font-bold text-emerald-300">
              <span>Conv.</span>
              <span>+28%</span>
            </div>
          </div>
        </div>
      );
    case "/diensten/leadgeneratie":
      return (
        <div className="flex h-full items-end gap-1 px-3 pb-2 pt-4">
          {[40, 65, 50, 80, 72].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t bg-sky-400/50"
              style={{ height: `${h}%` }}
              aria-hidden
            />
          ))}
        </div>
      );
    case "/diensten/tracking":
      return (
        <div className="grid h-full grid-cols-3 gap-2 p-3">
          {["GTM", "Clarity", "Dash"].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/10"
            >
              <span className="text-[8px] font-bold uppercase text-emerald-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

interface GrowthChannelMapProps {
  title: string;
  subtitle: string;
  services: ChannelService[];
}

/**
 * Het groeikompas: funnel-achtige kaart waarin elk vlak een strategie-dienst is.
 */
export function GrowthChannelMap({
  title,
  subtitle,
  services,
}: GrowthChannelMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const zoneByHref = new Map(ZONES.map((z) => [z.href, z]));
  const activeZone = active ? zoneByHref.get(active) : null;

  return (
    <PillarHubSection aria-labelledby="channel-map-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-sky-300">
          Het groeikompas
        </p>
        <h2
          id="channel-map-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">{subtitle}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="flex flex-col">
            <PillarHubCanvas barTitle="groeikompas.map" barStatus="funnel">
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
                    <span
                      className={`block size-full transition-opacity ${
                        isActive ? "opacity-100" : "opacity-60"
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
            </PillarHubCanvas>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {MAP_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-sky-300/70">
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
                  Laag:{" "}
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
                  transition={{ delay: 0.05 * index }}
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
    </PillarHubSection>
  );
}
