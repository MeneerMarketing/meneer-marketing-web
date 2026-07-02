"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gauge, KeyRound, Wrench } from "lucide-react";
import { useState } from "react";
import type { DienstPremiumOutcome } from "@/data/dienst-premium";

const ICONS = [Gauge, Wrench, KeyRound] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Resultaten als uitklapbare panelen: het paneel waar je op hovert groeit
 * open en toont het volledige verhaal. Op mobiel staat alles open.
 */
export function OutcomePanels({ outcomes }: { outcomes: DienstPremiumOutcome[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-stretch">
      {outcomes.map((outcome, index) => {
        const Icon = ICONS[index % ICONS.length];
        const isActive = index === active;
        return (
          <motion.button
            key={outcome.title}
            type="button"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 * index, ease: EASE }}
            style={{ flexGrow: 1 }}
            className={`group relative min-w-0 cursor-pointer overflow-hidden rounded-3xl border p-6 text-left [transition:flex-grow_600ms_cubic-bezier(0.22,1,0.36,1),border-color_300ms,box-shadow_300ms] lg:basis-0 lg:p-7 ${
              isActive
                ? "border-[#FF5722]/40 bg-white shadow-[0_24px_48px_-28px_rgba(255,87,34,0.5)] lg:flex-[2.4]"
                : "border-slate-200 bg-slate-50/70 lg:flex-[1]"
            }`}
            aria-expanded={isActive}
          >
            <span
              className={`pointer-events-none absolute inset-x-0 top-0 h-1 transition-all duration-500 ${
                isActive ? "bg-[#FF5722] opacity-100" : "bg-slate-200 opacity-60"
              }`}
              aria-hidden
            />
            <span
              className={`flex size-11 items-center justify-center rounded-2xl transition-colors duration-300 ${
                isActive
                  ? "bg-[#FF5722]/10 text-[#FF5722]"
                  : "bg-white text-slate-500 ring-1 ring-slate-200"
              }`}
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 whitespace-nowrap text-lg font-extrabold tracking-tight text-slate-900 lg:text-base xl:text-lg">
              {outcome.title}
            </h3>
            {/* Mobiel: altijd zichtbaar. Desktop: alleen in het actieve paneel */}
            <p className="mt-2 text-sm leading-relaxed text-slate-600 lg:hidden">
              {outcome.detail}
            </p>
            <p
              className={`mt-2 hidden text-sm leading-relaxed text-slate-600 transition-opacity duration-500 lg:block ${
                isActive ? "opacity-100 delay-200" : "opacity-0"
              }`}
            >
              {outcome.detail}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
