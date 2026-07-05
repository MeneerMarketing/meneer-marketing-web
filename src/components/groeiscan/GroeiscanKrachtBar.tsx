"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BREAKDOWN_LABELS,
  BREAKDOWN_MAX,
  type GroeikrachtBreakdown,
  type PillarProgress,
} from "@/lib/groeiscan-playground";

interface GroeiscanKrachtBarProps {
  score: number;
  growthLabel: string;
  breakdown: GroeikrachtBreakdown;
  pillarProgress: PillarProgress[];
  compact?: boolean;
  showPillarDetail?: boolean;
}

const BREAKDOWN_KEYS = ["goal", "stand", "budget", "ritme", "stack"] as const;

export function GroeiscanKrachtBar({
  score,
  growthLabel,
  breakdown,
  pillarProgress,
  compact = false,
  showPillarDetail = true,
}: GroeiscanKrachtBarProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      className={`relative w-full ${compact ? "max-w-none" : "max-w-[320px]"}`}
      aria-live="polite"
    >
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Groeikracht
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-slate-500">
            Elke stap telt mee
          </p>
        </div>
        <motion.div
          key={score}
          initial={reduce ? undefined : { scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-baseline gap-0.5"
        >
          <span
            className={`font-black tabular-nums text-[#FF5722] ${
              compact ? "text-3xl" : "text-4xl"
            }`}
          >
            {score}
          </span>
          <span className="text-sm font-bold text-slate-400">/100</span>
        </motion.div>
      </div>

      <div
        className={`relative mt-3 overflow-hidden rounded-full bg-slate-100 ${
          compact ? "h-2.5" : "h-3"
        }`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-orange-400 to-amber-300"
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      <motion.p
        key={growthLabel}
        initial={reduce ? undefined : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-2 text-center font-extrabold text-slate-800 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {growthLabel}
      </motion.p>

      <ul className={`mt-4 space-y-1.5 ${compact ? "space-y-1" : ""}`}>
        {BREAKDOWN_KEYS.map((key) => {
          const value = breakdown[key];
          const max = BREAKDOWN_MAX[key];
          const pct = max ? (value / max) * 100 : 0;
          return (
            <li key={key}>
              <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px]">
                <span className="font-bold text-slate-600">{BREAKDOWN_LABELS[key]}</span>
                <span className="font-mono font-bold text-slate-400">
                  +{value}
                  <span className="text-slate-300">/{max}</span>
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-[#FF5722]"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 24 }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {showPillarDetail ? (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Stack per blok
          </p>
          <ul className="space-y-2">
            {pillarProgress.map((pillar) => (
              <li key={pillar.pillarSlug}>
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-600">
                    {pillar.label}
                  </span>
                  <span className="font-mono text-[8px] font-bold text-slate-400">
                    {pillar.active}/{pillar.total}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: pillar.accent }}
                    initial={false}
                    animate={{ width: `${pillar.fraction * 100}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 24 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
