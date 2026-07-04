"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const HUB = { id: "hub", label: "Hoofdgids", x: 50, y: 48, size: "lg" as const };
const SATELLITES = [
  { id: "s1", label: "Vraag 1", x: 18, y: 22 },
  { id: "s2", label: "Vergelijk", x: 78, y: 18 },
  { id: "s3", label: "How-to", x: 82, y: 58 },
  { id: "s4", label: "FAQ", x: 22, y: 72 },
  { id: "s5", label: "Case", x: 50, y: 82 },
] as const;

/**
 * Topic cluster: hub + satellites met verbindende lijnen. Hover/tik op nodes.
 */
export function HeroContentWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/20 blur-3xl"
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
          {/* Verbindingslijnen */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            {SATELLITES.map((sat) => (
              <line
                key={sat.id}
                x1={HUB.x}
                y1={HUB.y}
                x2={sat.x}
                y2={sat.y}
                stroke={active === sat.id || active === "hub" ? "#FF5722" : "#cbd5e1"}
                strokeWidth={active === sat.id ? 1.2 : 0.6}
                strokeDasharray="2 2"
                opacity={active === sat.id ? 1 : 0.5}
              />
            ))}
          </svg>

          {/* Hub */}
          <motion.button
            type="button"
            onMouseEnter={() => setActive("hub")}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive((a) => (a === "hub" ? null : "hub"))}
            initial={reduce ? undefined : { scale: 0 }}
            animate={isInView ? { scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className={`absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 px-4 py-3 text-center shadow-lg transition-colors ${
              active === "hub"
                ? "border-[#FF5722] bg-[#FF5722] text-white"
                : "border-slate-900 bg-slate-900 text-white"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Hub</p>
            <p className="text-sm font-extrabold">{HUB.label}</p>
          </motion.button>

          {/* Satellites */}
          {SATELLITES.map((sat, i) => (
            <motion.button
              key={sat.id}
              type="button"
              onMouseEnter={() => setActive(sat.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((a) => (a === sat.id ? null : sat.id))}
              initial={reduce ? undefined : { scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : undefined}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
                delay: 0.2 + i * 0.07,
              }}
              style={{ left: `${sat.x}%`, top: `${sat.y}%` }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2 shadow-md transition-all ${
                active === sat.id
                  ? "border-[#FF5722] bg-white ring-2 ring-[#FF5722]/25"
                  : "border-slate-200 bg-white hover:border-sky-300"
              }`}
            >
              <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">{sat.label}</p>
            </motion.button>
          ))}

          <motion.p
            initial={reduce ? undefined : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ delay: 0.9 }}
            className="absolute inset-x-0 bottom-0 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
          >
            Beweeg · tik een node
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
