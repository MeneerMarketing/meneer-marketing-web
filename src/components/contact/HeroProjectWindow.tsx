"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const TYPES = [
  {
    id: "website",
    label: "Website",
    win: "Leadpagina live",
    blocks: ["nav", "hero", "cta"],
    weeks: "4-6 wkn",
  },
  {
    id: "webshop",
    label: "Webshop",
    win: "Checkout scherp",
    blocks: ["grid", "pdp", "cart"],
    weeks: "6-10 wkn",
  },
  {
    id: "webapp",
    label: "Webapp",
    win: "Eerste portal-scherm",
    blocks: ["side", "table", "panel"],
    weeks: "8-12 wkn",
  },
  {
    id: "marketing",
    label: "Marketing",
    win: "Kanaal + KPI vast",
    blocks: ["chart", "ads", "mail"],
    weeks: "2-4 wkn",
  },
  {
    id: "auto",
    label: "Autopilot",
    win: "Eerste flow live",
    blocks: ["trigger", "if", "send"],
    weeks: "2-5 wkn",
  },
  {
    id: "design",
    label: "Design",
    win: "Systeem + 1 scherm",
    blocks: ["type", "color", "comp"],
    weeks: "3-5 wkn",
  },
] as const;

type TypeId = (typeof TYPES)[number]["id"];

const PHASES = [
  { id: "brief", label: "Brief" },
  { id: "scope", label: "Scope" },
  { id: "kickoff", label: "Kickoff" },
] as const;

/**
 * Project-starten hero: tik een type, blueprint + fases klappen open.
 * Anders dan equalizer (schaal-op) en hub/spoke (content).
 */
export function HeroProjectWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.55);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<TypeId>("website");
  const [phase, setPhase] = useState(0);

  const current = TYPES.find((t) => t.id === active) ?? TYPES[0];

  useEffect(() => {
    if (!isInView) return;
    setPhase(0);
    if (reduce) {
      setPhase(2);
      return;
    }
    const t1 = window.setTimeout(() => setPhase(1), 420);
    const t2 = window.setTimeout(() => setPhase(2), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active, isInView, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute right-[6%] top-[8%] size-36 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-3"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative w-full max-w-[360px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.35)]"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Kickoff-blueprint
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  className="text-sm font-extrabold text-slate-900"
                >
                  {current.label}-traject
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`stamp-${current.id}`}
                initial={
                  reduce
                    ? false
                    : { scale: 1.4, rotate: -18, opacity: 0 }
                }
                animate={{ scale: 1, rotate: -6, opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 380, damping: 16 }}
                className="rounded-lg border-2 border-[#FF5722] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#FF5722]"
              >
                Op maat
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phase rail */}
          <div className="px-4 pt-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-3 right-3 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100" />
              <motion.div
                className="absolute left-3 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-[#FF5722]"
                animate={{ width: `${(phase / (PHASES.length - 1)) * 78}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              />
              {PHASES.map((p, i) => {
                const on = i <= phase;
                const currentPhase = i === phase;
                return (
                  <div key={p.id} className="relative z-10 flex flex-col items-center">
                    <motion.span
                      animate={{
                        scale: currentPhase ? 1.12 : 1,
                        backgroundColor: on ? "#FF5722" : "#ffffff",
                        borderColor: on ? "#FF5722" : "#e2e8f0",
                      }}
                      className={`flex size-7 items-center justify-center rounded-full border-2 text-[10px] font-black ${
                        on ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {i + 1}
                    </motion.span>
                    <p
                      className={`mt-1.5 text-[10px] font-bold ${
                        currentPhase ? "text-[#FF5722]" : on ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {p.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blueprint preview */}
          <div className="relative mx-4 my-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] p-3">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,87,34,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.08) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
              aria-hidden
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, rotateX: -12, y: 10 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative grid h-[112px] grid-cols-3 gap-2"
              >
                {current.blocks.map((block, i) => (
                  <motion.div
                    key={block}
                    initial={reduce ? false : { opacity: 0, scale: 0.7, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.08,
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                    }}
                    className={`rounded-xl border border-slate-200 bg-white shadow-sm ${
                      i === 0 ? "col-span-3 h-8" : "h-full min-h-[64px]"
                    }`}
                  >
                    <div className="flex h-full flex-col justify-between p-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {block}
                      </span>
                      <span
                        className={`rounded-md ${
                          i === 1 ? "h-3 w-2/3 bg-[#FF5722]/80" : "h-2 w-1/2 bg-slate-200"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Win + timing */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Eerste win
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`win-${current.id}`}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="truncate text-xs font-bold text-slate-800"
                >
                  {current.win}
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.div
              key={`weeks-${current.id}`}
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 16 }}
              className="shrink-0 rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-[11px] font-bold text-white"
            >
              {current.weeks}
            </motion.div>
          </div>
        </motion.div>

        {/* Type chips */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex w-full max-w-[360px] flex-wrap justify-center gap-1.5 px-1"
          style={{ transform: "translateZ(20px)" }}
        >
          {TYPES.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(t.id)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all ${
                  on
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-md shadow-orange-500/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#FF5722]/50"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </motion.div>

        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Tik een type · blueprint schuift mee
        </p>
      </motion.div>
    </div>
  );
}
