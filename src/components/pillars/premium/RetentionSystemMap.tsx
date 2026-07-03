"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

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
    zoneLabel: "Flows & nieuwsbrief",
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
    short: "Flows",
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

const FLOW_PULSES = [
  { from: { x: 50, y: 14 }, to: { x: 26, y: 41 }, delay: 0 },
  { from: { x: 50, y: 14 }, to: { x: 74, y: 41 }, delay: 0.8 },
  { from: { x: 26, y: 71 }, to: { x: 74, y: 71 }, delay: 1.6 },
] as const;

const CHANNEL_PILLS = ["E-mail", "SMS", "Flows", "Klaviyo", "AI"] as const;

const MAP_STATS = [
  { label: "Trajecten", value: "5" },
  { label: "Handwerk", value: "Eruit" },
  { label: "Omzet", value: "Per flow" },
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
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#0a0d12]"
      aria-labelledby="system-map-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_10%_0%,rgba(255,87,34,0.12),transparent_50%),radial-gradient(ellipse_65%_45%_at_95%_100%,rgba(52,211,153,0.08),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
      {!reduce
        ? FLOW_PULSES.map((pulse, i) => (
            <svg
              key={i}
              className="pointer-events-none absolute inset-0 size-full opacity-30"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.line
                x1={pulse.from.x}
                y1={pulse.from.y}
                x2={pulse.to.x}
                y2={pulse.to.y}
                stroke="url(#flow-pulse)"
                strokeWidth="0.25"
                strokeDasharray="1.5 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: pulse.delay,
                  ease: "easeInOut",
                }}
              />
              <defs>
                <linearGradient id="flow-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF5722" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF5722" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ))
        : null}
      <div
        className="pointer-events-none absolute -left-16 top-1/4 size-64 rounded-full bg-[#FF5722]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-0 size-56 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-1 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
                  <span className="size-2 rounded-full bg-emerald-400/80" aria-hidden />
                  <span className="size-2 rounded-full bg-sky-400/80" aria-hidden />
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-slate-400">
                    behoud.sync
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">sync</span>
                  </span>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(160deg,rgba(255,87,34,0.05)_0%,transparent_50%,rgba(52,211,153,0.06)_100%)]">
                  {!reduce ? (
                    <motion.div
                      className="pointer-events-none absolute inset-x-0 z-20 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
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
