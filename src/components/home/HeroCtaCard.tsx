"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Compass,
  Hammer,
  Megaphone,
  RefreshCw,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Magnetic } from "@/components/effects/Magnetic";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";
import { siteCtas } from "@/lib/cta";
import type { PillarSlug } from "@/lib/navigation";

/* ------------------------------------------------------------------ */
/* Content — De Marketing-APK                                          */
/* ------------------------------------------------------------------ */

interface CheckItem {
  id: PillarSlug;
  label: string;
  micro: string;
  icon: LucideIcon;
}

const CHECKS: CheckItem[] = [
  {
    id: "strategie",
    label: "Strategie",
    micro: "Weten waar het geld zit",
    icon: Compass,
  },
  {
    id: "bouwen",
    label: "Website",
    micro: "Verkoopt, ook om 3 uur 's nachts",
    icon: Hammer,
  },
  {
    id: "vindbaarheid",
    label: "Vindbaarheid",
    micro: "Google én ChatGPT kennen je",
    icon: Search,
  },
  {
    id: "campagnes",
    label: "Campagnes",
    micro: "Ads zonder zweethanden",
    icon: Megaphone,
  },
  {
    id: "behoud",
    label: "Klantbehoud",
    micro: "Klanten die blijven plakken",
    icon: RefreshCw,
  },
];

const VERDICTS = [
  {
    min: 0,
    kicker: "Rijverbod",
    line: "Niks geregeld is ook een keuze. Een dure.",
  },
  {
    min: 1,
    kicker: "Rammelt een beetje",
    line: "Je rijdt, maar de wielen wiebelen. Daar valt wat te halen.",
  },
  {
    min: 3,
    kicker: "Bijna erdoor",
    line: "Solide basis. Die laatste puntjes zijn precies waar de winst zit.",
  },
  {
    min: 5,
    kicker: "Goedgekeurd",
    line: "Alles staat aan. Nu kijken hoeveel harder deze motor kan.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroCtaCard() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.35);
  const [checked, setChecked] = useState<Set<PillarSlug>>(() => new Set());

  const score = checked.size;
  const isApproved = score === CHECKS.length;
  const verdict = [...VERDICTS].reverse().find((v) => score >= v.min)!;

  function toggle(id: PillarSlug) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div
      className="relative w-full max-w-[440px] [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative isolate overflow-hidden rounded-[28px] bg-[#FF5722] shadow-[0_48px_90px_-28px_rgba(255,87,34,0.6)] ring-1 ring-inset ring-white/15"
      >
        <CardAtmosphere />

        <div
          className="relative z-10 p-5 sm:p-6"
          style={{ transform: "translateZ(24px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/55">
              De marketing-APK
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <span className="relative flex size-1.5">
                {!reduce ? (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                ) : null}
                <span className="relative size-1.5 rounded-full bg-white" />
              </span>
              3 plekken vrij in Q3
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-4 text-xl font-extrabold leading-snug tracking-tight text-white sm:text-[22px]">
            Komt jouw marketing door de keuring?
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            Vijf checks. Eerlijk aanvinken wat al geregeld is.
          </p>

          {/* Checklist */}
          <div className="mt-4 space-y-2">
            {CHECKS.map((item, i) => {
              const Icon = item.icon;
              const on = checked.has(item.id);
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={on}
                  initial={reduce ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
                  className={`group/row flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 ${
                    on
                      ? "border-white bg-white shadow-lg shadow-black/10"
                      : "border-white/20 bg-white/[0.08] hover:border-white/45 hover:bg-white/[0.14]"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                      on ? "bg-[#FF5722]/10 text-[#FF5722]" : "bg-white/10 text-white/80"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={2.2} aria-hidden />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13px] font-extrabold leading-tight transition-colors duration-300 ${
                        on ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`block truncate text-[11px] font-medium leading-tight transition-colors duration-300 ${
                        on ? "text-slate-500" : "text-white/55"
                      }`}
                    >
                      {item.micro}
                    </span>
                  </span>

                  {/* Check control */}
                  <span
                    className={`relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                      on
                        ? "border-[#FF5722] bg-[#FF5722]"
                        : "border-white/40 bg-transparent group-hover/row:border-white/70"
                    }`}
                    aria-hidden
                  >
                    <AnimatePresence>
                      {on ? (
                        <motion.span
                          initial={
                            reduce ? { opacity: 1 } : { scale: 1.7, rotate: -18, opacity: 0 }
                          }
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 16,
                          }}
                          className="flex"
                        >
                          <Check className="size-3.5 text-white" strokeWidth={3.5} />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Keuringsrapport */}
          <div className="relative mt-4 rounded-xl border border-white/15 bg-black/[0.08] px-3.5 py-3">
            <div className="flex items-center gap-3">
              {/* Segmented score bar */}
              <div className="flex flex-1 gap-1" aria-hidden>
                {CHECKS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                  >
                    <motion.div
                      className={`h-full w-full origin-left rounded-full ${
                        isApproved ? "bg-[#FFE9C7]" : "bg-white"
                      }`}
                      initial={false}
                      animate={{ scaleX: i < score ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    />
                  </div>
                ))}
              </div>
              <p className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-white/80">
                {score}
                <span className="text-white/40">/{CHECKS.length}</span>
              </p>
            </div>

            <div className="mt-2.5 min-h-[38px]" role="status" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={verdict.kicker}
                  initial={reduce ? undefined : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Keuringsrapport · {verdict.kicker}
                  </span>
                  <span className="mt-0.5 block pr-24 text-[13px] font-bold leading-snug text-white">
                    {verdict.line}
                  </span>
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Rubber stamp on full score */}
            <AnimatePresence>
              {isApproved ? (
                <motion.div
                  initial={
                    reduce
                      ? { opacity: 1, rotate: -8 }
                      : { opacity: 0, scale: 1.8, rotate: -20 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: -8 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="pointer-events-none absolute bottom-3 right-3 select-none rounded-md border-[2.5px] border-[#FFE9C7] px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#FFE9C7] [box-shadow:0_0_20px_rgba(255,233,199,0.35)]"
                  aria-hidden
                >
                  Goedgekeurd
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <Magnetic strength={10} radius={160} wobble={false}>
            <Link
              href={siteCtas.startIntake.href}
              className="group relative mt-4 flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl bg-white px-4 py-3.5 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              {!reduce ? (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5722]/[0.07] to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              ) : null}
              <span className="relative z-10 min-w-0">
                <span className="block truncate text-sm font-extrabold tracking-tight text-slate-900">
                  Plan de gratis keuring
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  30 min · jij praat, ik sleutel mee
                </span>
              </span>
              <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </Magnetic>

          <p className="mt-3 text-center text-[10px] font-semibold text-white/50">
            Reactie binnen 24 uur · nul verkooppraat
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Background layers                                                   */
/* ------------------------------------------------------------------ */

function CardAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_18%_-5%,rgba(255,255,255,0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_115%,rgba(154,52,18,0.5),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
    </>
  );
}