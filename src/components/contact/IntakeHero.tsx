"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { LiquidCTA } from "@/components/effects/LiquidCTA";

const INTAKE_PILLS = [
  "± 2 min invullen",
  "30 min online",
  "Vrijblijvend",
] as const;

export function IntakeHero() {
  const reduce = useReducedMotion();

  return (
    <header className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span
                className={
                  "absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75 " +
                  (reduce ? "" : "animate-ping")
                }
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5722]" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Intake
            </p>
          </div>

          <h1 className="mt-4 max-w-3xl text-balance text-[1.85rem] font-extrabold leading-[1.08] tracking-tighter text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Kort formulier.{" "}
            <span className="text-[#FF5722]">Daarna praten we echt.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed tracking-tight text-slate-600 sm:text-[1.05rem]">
            Waar je staat, wat je wilt. Ik lees het zelf en plan een gesprek van
            30 minuten. Geen verkoopcall, wel eerlijk advies over wat slim is om
            eerst aan te pakken.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {INTAKE_PILLS.map((label) => (
              <li
                key={label}
                className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-semibold tracking-tight text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-sm"
              >
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <LiquidCTA href="#formulier" label="Naar het formulier" />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
