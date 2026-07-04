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

export interface SystemService {
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
    href: "/diensten/email",
    short: "E-mail",
    zoneLabel: "Mails & nieuwsbrief",
    x: 8,
    y: 4,
    w: 84,
    h: 20,
  },
  {
    href: "/diensten/retentie",
    short: "Retentie",
    zoneLabel: "Loyalty & herhaal",
    x: 4,
    y: 28,
    w: 44,
    h: 26,
  },
  {
    href: "/diensten/automatisering",
    short: "Auto",
    zoneLabel: "Processen koppelen",
    x: 52,
    y: 28,
    w: 44,
    h: 26,
  },
  {
    href: "/diensten/workflows",
    short: "Automatisering",
    zoneLabel: "Order & shop sync",
    x: 4,
    y: 58,
    w: 44,
    h: 26,
  },
  {
    href: "/diensten/chatbots",
    short: "AI",
    zoneLabel: "Chat & support",
    x: 52,
    y: 58,
    w: 44,
    h: 26,
  },
];

const CHANNEL_PILLS = ["E-mail", "SMS", "Mailreeksen", "Klaviyo", "AI"] as const;

const MAP_STATS = [
  { label: "Trajecten", value: "5" },
  { label: "Handwerk", value: "Eruit" },
  { label: "Omzet", value: "Per mailreeks" },
] as const;

function ZoneContent({ href, isActive }: { href: string; isActive: boolean }) {
  const dim = isActive ? "opacity-100" : "opacity-70";
  switch (href) {
    case "/diensten/email":
      return (
        <div className={`flex h-full items-center gap-2 px-4 ${dim}`}>
          {["Welkom", "Opvolg", "Win-back"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                i === 1 ? "bg-[#FF5722] text-white" : "bg-white/80 text-slate-600"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      );
    case "/diensten/retentie":
      return (
        <div className={`flex h-full flex-col justify-center gap-1 px-3 ${dim}`}>
          <span className="text-[9px] font-bold text-amber-400">★ Loyalty</span>
          <span className="h-1.5 w-2/3 rounded-full bg-emerald-400/60" aria-hidden />
        </div>
      );
    case "/diensten/automatisering":
      return (
        <div className={`flex h-full items-center justify-center gap-1.5 p-2 ${dim}`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${i === 1 ? "bg-sky-400" : "bg-slate-300"}`}
              aria-hidden
            />
          ))}
          <span className="text-[8px] text-slate-500">→</span>
          {[3, 4].map((i) => (
            <span key={i} className="size-2 rounded-full bg-[#FF5722]/60" aria-hidden />
          ))}
        </div>
      );
    case "/diensten/workflows":
      return (
        <div className={`space-y-1 p-2.5 ${dim}`}>
          {["Order", "Voorraad", "Mail"].map((l) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-emerald-400" aria-hidden />
              <span className="text-[8px] font-semibold text-slate-600">{l}</span>
            </div>
          ))}
        </div>
      );
    case "/diensten/chatbots":
      return (
        <div className={`flex h-full flex-col justify-end p-2 ${dim}`}>
          <div className="rounded-lg border border-sky-200/50 bg-sky-500/10 px-2 py-1.5">
            <p className="text-[8px] font-bold text-sky-300">AI-antwoord</p>
            <p className="text-[9px] text-slate-300">Hoe volg ik mijn order?</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

interface RetentionSystemMapProps {
  title: string;
  subtitle: string;
  services: SystemService[];
}

/**
 * Het behoud-ecosysteem: interactieve systeemkaart met stromende koppellijnen.
 */
export function RetentionSystemMap({
  title,
  subtitle,
  services,
}: RetentionSystemMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const zoneByHref = new Map(ZONES.map((z) => [z.href, z]));
  const activeZone = active ? zoneByHref.get(active) : null;

  return (
    <PillarHubSection aria-labelledby="system-map-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Het behoud-ecosysteem
        </p>
        <h2
          id="system-map-heading"
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
            <PillarHubCanvas barTitle="behoud.sync" barStatus="sync">
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
                  Module:{" "}
                  <span className="font-bold text-white">{activeZone.zoneLabel}</span>
                </motion.p>
              ) : (
                <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Beweeg over het ecosysteem of de lijst
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
