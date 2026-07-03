"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { HomeTrajectoryStage } from "@/data/home-premium";

interface TrajectoryStageVisualsProps {
  stage: HomeTrajectoryStage;
}

export function TrajectoryStageVisuals({ stage }: TrajectoryStageVisualsProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 sm:min-h-[320px] sm:p-5"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,87,34,0.12),transparent_60%)]"
          aria-hidden
        />
        {stage.scene === "discover" && <DiscoverScene reduce={!!reduce} />}
        {stage.scene === "route" && <RouteScene reduce={!!reduce} />}
        {stage.scene === "build" && <BuildScene reduce={!!reduce} />}
        {stage.scene === "scale" && <ScaleScene reduce={!!reduce} />}
      </motion.div>
    </AnimatePresence>
  );
}

function DiscoverScene({ reduce }: { reduce: boolean }) {
  const notes = [
    { text: "Doelen Q3", x: "8%", y: "12%", rot: -6, delay: 0 },
    { text: "Shopify + ads?", x: "58%", y: "8%", rot: 4, delay: 0.1 },
    { text: "Waar lekt omzet?", x: "22%", y: "52%", rot: -3, delay: 0.2 },
    { text: "Stack scan", x: "62%", y: "48%", rot: 7, delay: 0.3 },
  ];

  return (
    <div className="relative z-[1] h-full">
      <div className="absolute left-4 top-3 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
        intake.session
      </div>

      {notes.map((n) => (
        <motion.div
          key={n.text}
          initial={reduce ? false : { opacity: 0, y: 16, rotate: n.rot - 8 }}
          animate={{ opacity: 1, y: 0, rotate: n.rot }}
          transition={{ delay: n.delay, type: "spring", stiffness: 220, damping: 18 }}
          className="absolute w-[38%] rounded-lg border border-amber-200/30 bg-amber-50/95 px-2.5 py-2 shadow-md"
          style={{ left: n.x, top: n.y }}
        >
          <p className="text-[10px] font-bold text-amber-900">{n.text}</p>
        </motion.div>
      ))}

      <motion.div
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute bottom-4 left-4 max-w-[55%] rounded-2xl rounded-bl-sm border border-white/10 bg-[#FF5722] px-3 py-2 shadow-lg"
      >
        <p className="text-[11px] font-bold leading-snug text-white">
          Waar wil je over 12 maanden staan?
        </p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-14 right-4 max-w-[48%] rounded-2xl rounded-br-sm border border-white/10 bg-white px-3 py-2 shadow-lg"
      >
        <p className="text-[11px] font-bold leading-snug text-slate-800">
          Meer omzet online, zonder losse eindjes tussen bureaus.
        </p>
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-3 right-[38%] flex size-11 items-center justify-center rounded-full border-2 border-[#FF5722]/40 bg-slate-800 shadow-lg"
      >
        <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
          <circle cx="32" cy="34" r="18" fill="#FFCCBC" />
          <ellipse cx="26" cy="32" rx="3" ry="4" fill="#3E2723" />
          <ellipse cx="38" cy="32" rx="3" ry="4" fill="#3E2723" />
          <path d="M22 18h20l-4 8H26Z" fill="#5D4037" />
        </svg>
      </motion.div>
    </div>
  );
}

function RouteScene({ reduce }: { reduce: boolean }) {
  const lanes = [
    { label: "Nu", items: ["Site traag", "Geen plan"], active: false },
    { label: "Eerst", items: ["Custom build", "Tracking"], active: true },
    { label: "Later", items: ["Google Ads", "E-mail"], active: false },
  ];

  return (
    <div className="relative z-[1] grid h-full grid-cols-3 gap-2 pt-8">
      {lanes.map((lane, li) => (
        <div
          key={lane.label}
          className={`flex flex-col rounded-xl border p-2 ${
            lane.active
              ? "border-[#FF5722]/40 bg-[#FF5722]/10"
              : "border-white/[0.06] bg-white/[0.03]"
          }`}
        >
          <p
            className={`text-center text-[9px] font-bold uppercase tracking-wider ${
              lane.active ? "text-[#FF5722]" : "text-slate-500"
            }`}
          >
            {lane.label}
          </p>
          <div className="mt-2 flex flex-1 flex-col gap-1.5">
            {lane.items.map((item, ii) => (
              <motion.div
                key={item}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: li * 0.12 + ii * 0.08 }}
                className={`rounded-lg px-2 py-2 text-center text-[10px] font-bold ${
                  lane.active
                    ? "bg-[#FF5722] text-white shadow-md"
                    : "border border-dashed border-white/10 text-slate-400"
                }`}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="pointer-events-none absolute bottom-3 left-4 right-4 h-0.5 origin-left rounded-full bg-gradient-to-r from-[#FF5722] to-orange-300"
        aria-hidden
      />
      <p className="absolute left-4 top-3 font-mono text-[9px] font-bold text-slate-500">
        roadmap.sort()
      </p>
    </div>
  );
}

function BuildScene({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative z-[1] grid h-full grid-cols-2 gap-3 pt-7">
      <p className="absolute left-4 top-3 font-mono text-[9px] font-bold text-slate-500">
        deploy.pipeline
      </p>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c1220]">
        <div className="flex gap-1.5 border-b border-white/5 px-2 py-1.5">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-amber-400/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
        <div className="space-y-1.5 p-2.5 font-mono text-[8px] leading-relaxed">
          {[
            { t: "git push origin main", c: "text-slate-500" },
            { t: "✓ build passed", c: "text-emerald-400" },
            { t: "✓ lighthouse 98", c: "text-emerald-400" },
            { t: "→ deploying...", c: "text-[#FF5722]" },
          ].map((line, i) => (
            <motion.p
              key={line.t}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={line.c}
            >
              {line.t}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
        <div className="h-2 bg-slate-900" />
        <div className="p-2.5">
          <motion.div
            initial={reduce ? false : { width: "40%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-2 rounded-full bg-slate-900"
          />
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="block h-8 rounded bg-gradient-to-br from-orange-100 to-slate-100"
              />
            ))}
          </div>
          <motion.span
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live + events
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function ScaleScene({ reduce }: { reduce: boolean }) {
  const bars = [
    { label: "Test", h: 36, pct: "€400" },
    { label: "Werkt", h: 58, pct: "€1.2k" },
    { label: "Schaal", h: 88, pct: "€4.8k" },
  ];

  return (
    <div className="relative z-[1] flex h-full flex-col justify-end pt-8">
      <p className="absolute left-4 top-3 font-mono text-[9px] font-bold text-slate-500">
        roas.dashboard
      </p>

      <div className="mb-3 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
        <span className="text-[10px] font-bold text-emerald-400">ROAS stijgt</span>
        <motion.span
          key="roas"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-black tabular-nums text-white"
        >
          4,2×
        </motion.span>
      </div>

      <div className="flex items-end justify-center gap-4 px-2">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div
              initial={reduce ? false : { height: 20 }}
              animate={{ height: bar.h }}
              transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
              className="w-full rounded-t-xl bg-gradient-to-t from-[#FF5722] to-orange-300 shadow-[0_0_20px_rgba(255,87,34,0.35)]"
            />
            <span className="text-[9px] font-bold text-slate-400">{bar.label}</span>
            <span className="text-[10px] font-bold text-white">{bar.pct}</span>
          </div>
        ))}
      </div>

      {!reduce
        ? [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              transition={{ duration: 1.4, delay: 0.6 + i * 0.25, repeat: Infinity, repeatDelay: 2 }}
              className="pointer-events-none absolute size-1 rounded-full bg-[#FF5722]"
              style={{ left: `${30 + i * 22}%`, bottom: "45%" }}
              aria-hidden
            />
          ))
        : null}
    </div>
  );
}
