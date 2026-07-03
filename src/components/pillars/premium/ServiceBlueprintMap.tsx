"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

export interface BlueprintService {
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
    href: "/diensten/webdevelopment",
    short: "Site",
    zoneLabel: "Navigatie & structuur",
    x: 0,
    y: 0,
    w: 100,
    h: 11,
  },
  {
    href: "/diensten/webdesign",
    short: "UI/UX",
    zoneLabel: "Hero & conversie",
    x: 3,
    y: 15,
    w: 45,
    h: 30,
  },
  {
    href: "/diensten/shopify-enterprise",
    short: "Shopify",
    zoneLabel: "Productgrid & checkout",
    x: 52,
    y: 15,
    w: 45,
    h: 36,
  },
  {
    href: "/diensten/web-apps",
    short: "Portal",
    zoneLabel: "Dashboard & data",
    x: 3,
    y: 49,
    w: 45,
    h: 29,
  },
  {
    href: "/diensten/optimalisatie",
    short: "Snelheid",
    zoneLabel: "Performance",
    x: 52,
    y: 55,
    w: 21,
    h: 26,
  },
  {
    href: "/diensten/animaties",
    short: "Motion",
    zoneLabel: "Micro-interacties",
    x: 76,
    y: 55,
    w: 21,
    h: 26,
  },
  {
    href: "/diensten/branding",
    short: "Merk",
    zoneLabel: "Footer & identiteit",
    x: 3,
    y: 82,
    w: 30,
    h: 13,
  },
];

const BLUEPRINT_STATS = [
  { label: "Zones", value: "7" },
  { label: "Diensten", value: "7" },
  { label: "Schaal", value: "1:1" },
] as const;

function ZoneContent({ href }: { href: string }) {
  switch (href) {
    case "/diensten/webdevelopment":
      return (
        <div className="flex h-full items-center gap-2 px-3">
          <span className="size-3.5 rounded bg-slate-800" aria-hidden />
          <span className="h-1.5 w-8 rounded-full bg-slate-300" aria-hidden />
          <span className="h-1.5 w-6 rounded-full bg-slate-300" aria-hidden />
          <span className="ml-auto h-3.5 w-10 rounded-full bg-[#FF5722]/80" aria-hidden />
        </div>
      );
    case "/diensten/webdesign":
      return (
        <div className="space-y-1.5 p-3">
          <span className="block h-2.5 w-4/5 rounded-full bg-slate-800" aria-hidden />
          <span className="block h-2 w-3/5 rounded-full bg-slate-300" aria-hidden />
          <span className="mt-1 inline-block h-4 w-14 rounded-full bg-[#FF5722]/70" aria-hidden />
        </div>
      );
    case "/diensten/shopify-enterprise":
      return (
        <div className="grid h-full grid-cols-3 gap-1.5 p-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-md border border-slate-200/80 bg-white/70 p-1.5"
            >
              <span className="block flex-1 rounded bg-slate-200/90" aria-hidden />
              <span className="block h-1 w-4/5 rounded-full bg-slate-300" aria-hidden />
              <span className="block h-1.5 w-3/5 rounded-full bg-slate-800" aria-hidden />
            </div>
          ))}
        </div>
      );
    case "/diensten/web-apps":
      return (
        <div className="flex h-full gap-1.5 p-2.5">
          <div className="w-1/4 space-y-1 rounded-md bg-slate-200/70 p-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-1 rounded-full bg-slate-400/60" aria-hidden />
            ))}
          </div>
          <div className="flex-1 space-y-1.5 pt-1">
            {[0.9, 0.75, 0.85].map((w) => (
              <span
                key={w}
                className="block h-2 rounded-full bg-slate-200"
                style={{ width: `${w * 100}%` }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      );
    case "/diensten/optimalisatie":
      return (
        <div className="flex h-full items-center justify-center">
          <svg viewBox="0 0 60 34" className="w-4/5" aria-hidden>
            <path
              d="M8 30 A 24 24 0 0 1 52 30"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M8 30 A 24 24 0 0 1 42 12"
              fill="none"
              stroke="#34D399"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="30"
              x2="42"
              y2="14"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case "/diensten/animaties":
      return (
        <div className="relative flex h-full items-center justify-center">
          <span className="text-lg" aria-hidden>
            ✨
          </span>
          <svg
            viewBox="0 0 24 24"
            className="absolute bottom-2 right-3 size-4 text-slate-700"
            fill="currentColor"
            aria-hidden
          >
            <path d="M5 3l14 8-6 1.5L11 19z" />
          </svg>
        </div>
      );
    case "/diensten/branding":
      return (
        <div className="flex h-full items-center gap-1.5 px-3">
          {["#FF5722", "#38BDF8", "#0F172A"].map((c) => (
            <span
              key={c}
              className="size-3.5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: c }}
              aria-hidden
            />
          ))}
          <span className="ml-1 font-serif text-[10px] font-bold text-slate-500">Aa</span>
        </div>
      );
    default:
      return null;
  }
}

interface ServiceBlueprintMapProps {
  title: string;
  subtitle: string;
  services: BlueprintService[];
}

export function ServiceBlueprintMap({
  title,
  subtitle,
  services,
}: ServiceBlueprintMapProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const zoneByHref = new Map(ZONES.map((z) => [z.href, z]));
  const activeZone = active ? zoneByHref.get(active) : null;

  return (
    <section
      className="border-b border-slate-200 bg-slate-950"
      aria-labelledby="blueprint-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-sky-300">
          De bouwtekening
        </p>
        <h2
          id="blueprint-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">{subtitle}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Canvas-kolom */}
          <div className="flex flex-col">
            <div className="relative flex flex-1 flex-col">
              <div
                className="pointer-events-none absolute -inset-3 rounded-3xl bg-[linear-gradient(to_right,rgba(56,189,248,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] bg-[size:26px_26px]"
                aria-hidden
              />

              <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-sky-500/25 bg-slate-900/80 shadow-[0_32px_64px_-28px_rgba(2,6,23,0.9)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-sky-500/15 px-4 py-2.5">
                  <span className="size-2 rounded-full bg-sky-400/40" aria-hidden />
                  <span className="size-2 rounded-full bg-sky-400/40" aria-hidden />
                  <span className="size-2 rounded-full bg-sky-400/40" aria-hidden />
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-sky-400/70">
                    bouwtekening-v2.plan
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-sky-400/50">
                    schaal 1:1
                  </span>
                </div>

                <div className="relative aspect-[16/11] w-full flex-1">
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
                        onClick={() =>
                          setActive((prev) =>
                            prev === zone.href ? null : zone.href,
                          )
                        }
                        aria-label={`${service.name}: ${zone.zoneLabel}`}
                        className={`absolute rounded-lg border transition-all duration-300 ${
                          isActive
                            ? "z-10 border-[#FF5722] bg-white shadow-[0_0_0_4px_rgba(255,87,34,0.25),0_16px_40px_-12px_rgba(255,87,34,0.4)]"
                            : "border-dashed border-sky-400/40 bg-slate-800/60"
                        } ${isDimmed ? "opacity-30" : "opacity-100"}`}
                        style={{
                          left: `${zone.x}%`,
                          top: `${zone.y}%`,
                          width: `${zone.w}%`,
                          height: `${zone.h}%`,
                        }}
                      >
                        <span
                          className={`pointer-events-none block size-full transition-opacity duration-300 ${
                            isActive ? "opacity-100" : "opacity-45"
                          }`}
                        >
                          <ZoneContent href={zone.href} />
                        </span>

                        <AnimatePresence>
                          {isActive ? (
                            <motion.span
                              initial={
                                reduce ? false : { opacity: 0, y: 6, scale: 0.9 }
                              }
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 22,
                              }}
                              className="pointer-events-none absolute -top-3 left-2 z-20 whitespace-nowrap rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md"
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

            {/* Footer onder canvas: stats + actieve zone */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {BLUEPRINT_STATS.map((stat) => (
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
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-xs text-sky-300/80"
                >
                  Zone:{" "}
                  <span className="font-bold text-white">{activeZone.zoneLabel}</span>
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400/60"
                >
                  Beweeg over de tekening of de lijst
                </motion.p>
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
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.04 * index }}
                  className="flex flex-1"
                >
                  <Link
                    href={service.href}
                    onMouseEnter={() => setActive(service.href)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(service.href)}
                    onBlur={() => setActive(null)}
                    className={`group flex w-full flex-col justify-center gap-1 rounded-2xl border px-4 py-3 transition-all duration-300 sm:flex-row sm:items-center sm:gap-3.5 sm:py-3.5 ${
                      isActive
                        ? "border-[#FF5722]/60 bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,87,34,0.2)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center gap-3 sm:contents">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 sm:size-10 ${
                          isActive
                            ? "bg-[#FF5722] text-white"
                            : "bg-white/10 text-sky-300"
                        }`}
                        aria-hidden
                      >
                        <Icon className="size-[18px] sm:size-5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-extrabold tracking-tight transition-colors ${
                            isActive ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {service.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-400">
                          {service.description}
                        </span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 items-center gap-2 sm:flex">
                      {zone ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300/80">
                          {zone.short}
                        </span>
                      ) : null}
                      <ArrowUpRight
                        className={`size-4 transition-all ${
                          isActive
                            ? "translate-x-0.5 -translate-y-0.5 text-[#FF5722]"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                        aria-hidden
                      />
                    </span>
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
