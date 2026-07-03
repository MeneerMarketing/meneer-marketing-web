"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const STEPS = [
  { id: "koop", label: "Eerste koop", angle: -90, color: "#0F172A" },
  { id: "welkom", label: "Welkom", angle: -18, color: "#38BDF8" },
  { id: "opvolg", label: "Opvolging", angle: 54, color: "#FF5722" },
  { id: "herhaal", label: "Herhaal", angle: 126, color: "#34D399" },
  { id: "loyal", label: "Loyaliteit", angle: 198, color: "#F59E0B" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const RADIUS = 108;

/**
 * Hero voor Behoud: interactieve klantreis-loop waar een dot
 * de route aflegt en elke stap oplicht.
 */
export function BehoudHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<StepId>("koop");
  const activeIndex = STEPS.findIndex((s) => s.id === active);

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none">
      <div
        className="pointer-events-none absolute -right-4 top-6 size-36 rounded-full bg-amber-200/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-6 bottom-4 size-32 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative h-[340px]">
        <svg viewBox="0 0 280 280" className="absolute inset-0 mx-auto size-[280px]" aria-hidden>
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          {STEPS.map((step, i) => {
            const next = STEPS[(i + 1) % STEPS.length];
            const rad1 = (step.angle * Math.PI) / 180;
            const rad2 = (next.angle * Math.PI) / 180;
            const x1 = 140 + Math.cos(rad1) * RADIUS;
            const y1 = 140 + Math.sin(rad1) * RADIUS;
            const x2 = 140 + Math.cos(rad2) * RADIUS;
            const y2 = 140 + Math.sin(rad2) * RADIUS;
            const isPathActive = i === activeIndex;
            return (
              <motion.line
                key={`path-${step.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isPathActive ? step.color : "#E2E8F0"}
                strokeWidth={isPathActive ? 2.5 : 1}
                animate={{ opacity: isPathActive ? 1 : 0.35 }}
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-[#FF5722]/25 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)]">
          <span className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
            LTV
          </span>
          <span className="text-lg font-extrabold text-[#FF5722]">↑ 3,2×</span>
        </div>

        {STEPS.map((step, i) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;
          const isActive = active === step.id;
          return (
            <motion.button
              key={step.id}
              type="button"
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: isActive ? 1.1 : 1 }}
              transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 18 }}
              onMouseEnter={() => setActive(step.id)}
              onFocus={() => setActive(step.id)}
              onClick={() => setActive(step.id)}
              className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border px-2.5 py-2 transition-shadow ${
                isActive
                  ? "border-transparent bg-white shadow-[0_14px_28px_-12px_rgba(15,23,42,0.35)] ring-2 ring-offset-1"
                  : "border-slate-200 bg-white/95 hover:border-slate-300"
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                ...(isActive ? { boxShadow: `0 0 0 2px ${step.color}44` } : {}),
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: step.color }}
                aria-hidden
              />
              <span className="whitespace-nowrap text-[10px] font-extrabold text-slate-800">
                {step.label}
              </span>
            </motion.button>
          );
        })}

        {!reduce ? (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722] shadow-[0_0_10px_rgba(255,87,34,0.6)]"
            animate={{
              x: [
                Math.cos((STEPS[0].angle * Math.PI) / 180) * RADIUS,
                ...STEPS.slice(1).map(
                  (s) => Math.cos((s.angle * Math.PI) / 180) * RADIUS,
                ),
                Math.cos((STEPS[0].angle * Math.PI) / 180) * RADIUS,
              ],
              y: [
                Math.sin((STEPS[0].angle * Math.PI) / 180) * RADIUS,
                ...STEPS.slice(1).map(
                  (s) => Math.sin((s.angle * Math.PI) / 180) * RADIUS,
                ),
                Math.sin((STEPS[0].angle * Math.PI) / 180) * RADIUS,
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            }}
            aria-hidden
          />
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onMouseEnter={() => setActive(step.id)}
            onClick={() => setActive(step.id)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
              active === step.id
                ? "border-[#FF5722]/40 bg-[#FF5722]/5 text-[#FF5722]"
                : "border-slate-200 text-slate-500"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <motion.div
        animate={reduce ? undefined : { y: [-4, 4] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatType: "mirror" }}
        className="absolute right-0 top-4 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Herhaal
        </p>
        <p className="text-sm font-extrabold text-emerald-500">+41%</p>
      </motion.div>
    </div>
  );
}
