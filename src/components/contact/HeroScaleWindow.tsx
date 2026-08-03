"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const LEVERS = [
  { id: "leads", label: "Leads", x: 18, y: 24, lift: 72 },
  { id: "conversie", label: "Conversie", x: 82, y: 22, lift: 84 },
  { id: "verkeer", label: "Verkeer", x: 88, y: 58, lift: 68 },
  { id: "ads", label: "Paid", x: 50, y: 84, lift: 76 },
  { id: "auto", label: "Autopilot", x: 14, y: 64, lift: 80 },
] as const;

type LeverId = (typeof LEVERS)[number]["id"];

/**
 * Schaal-op hero: tik één hefboom. Rest dimt, meter loopt omhoog.
 * Uniek t.o.v. content-hub en groeikompas (max 3).
 */
export function HeroScaleWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<LeverId>("conversie");

  const current = LEVERS.find((l) => l.id === active) ?? LEVERS[1];

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative h-[340px] w-full max-w-[360px]"
          style={{ transform: "translateZ(30px)" }}
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            {LEVERS.map((lever) => (
              <line
                key={lever.id}
                x1={50}
                y1={48}
                x2={lever.x}
                y2={lever.y}
                stroke={active === lever.id ? "#FF5722" : "#cbd5e1"}
                strokeWidth={active === lever.id ? 1.3 : 0.55}
                strokeDasharray="2 2"
                opacity={active === lever.id ? 1 : 0.35}
              />
            ))}
          </svg>

          {/* Center: hoofdfocus + lift meter */}
          <motion.div
            initial={reduce ? undefined : { scale: 0 }}
            animate={isInView ? { scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="absolute left-1/2 top-[44%] z-10 w-[9.5rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-slate-900 bg-slate-900 px-3 py-3.5 text-center text-white shadow-xl"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
              Hoofdfocus
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-0.5 text-sm font-extrabold"
              >
                {current.label}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/15">
              <motion.div
                key={`bar-${current.id}`}
                className="h-full rounded-full bg-[#FF5722]"
                initial={reduce ? { width: `${current.lift}%` } : { width: "8%" }}
                animate={{ width: `${current.lift}%` }}
                transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold tabular-nums text-[#FFAB91]">
              +{current.lift}% hefboom
            </p>
          </motion.div>

          {LEVERS.map((lever, i) => {
            const on = active === lever.id;
            return (
              <motion.button
                key={lever.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(lever.id)}
                initial={reduce ? undefined : { scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : undefined}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 20,
                  delay: 0.18 + i * 0.06,
                }}
                style={{ left: `${lever.x}%`, top: `${lever.y}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2 shadow-md transition-all ${
                  on
                    ? "border-[#FF5722] bg-white ring-2 ring-[#FF5722]/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#FF5722]/45"
                }`}
              >
                <p
                  className={`whitespace-nowrap text-[11px] font-bold ${
                    on ? "text-[#FF5722]" : "text-slate-800"
                  }`}
                >
                  {lever.label}
                </p>
              </motion.button>
            );
          })}

          <motion.p
            initial={reduce ? undefined : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ delay: 0.85 }}
            className="absolute inset-x-0 bottom-0 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
          >
            Tik één hefboom · rest wacht
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
