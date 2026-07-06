"use client";

import { motion, useReducedMotion } from "framer-motion";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_WHY_MENEER } from "@/data/home-premium";

const PILLAR_ANGLES = [-90, -18, 54, 126, 198] as const;
const ORBIT_R = 36;
const ORBIT_C = 50;

function pillarPosition(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ORBIT_C + ORBIT_R * Math.cos(rad),
    y: ORBIT_C + ORBIT_R * Math.sin(rad),
  };
}

/** Compacte orbit-visual voor mobiele why-sectie. */
export function HomeMobileWhyOrbit() {
  const reduce = useReducedMotion();
  const pillars = HOME_WHY_MENEER.pillars;

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/10">
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl border border-white/20"
          animate={reduce ? undefined : { opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <InteractiveLogo className="size-16" />
          </motion.div>
        </div>

        {pillars.map((label, i) => {
          const { x, y } = pillarPosition(PILLAR_ANGLES[i]!);
          const tilt = i % 2 === 0 ? -2 : 2;
          return (
            <motion.span
              key={label}
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 + i * 0.05, type: "spring", stiffness: 320, damping: 22 }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl rounded-bl-sm bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-md"
              style={{ left: `${x}%`, top: `${y}%`, rotate: `${tilt}deg` }}
            >
              {label}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
