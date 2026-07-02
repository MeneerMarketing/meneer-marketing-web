"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gauge, ShieldCheck, Wrench } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const OUTCOME_ICONS = [Gauge, ShieldCheck, Wrench] as const;

/** Resultaten als drie kaarten met eigen kleuraccent in plaats van een stapel. */
export function OutcomeCards({ outcomes }: { outcomes: string[] }) {
  const reduce = useReducedMotion();
  const accents = [
    "from-[#FF5722]/12 to-transparent border-[#FF5722]/25",
    "from-sky-200/40 to-transparent border-sky-300/50",
    "from-slate-200/60 to-transparent border-slate-300/60",
  ];
  const iconColors = ["text-[#FF5722]", "text-sky-600", "text-slate-700"];

  return (
    <ul className="mt-7 grid gap-4 md:grid-cols-3">
      {outcomes.map((outcome, index) => {
        const Icon = OUTCOME_ICONS[index % OUTCOME_ICONS.length];
        return (
          <motion.li
            key={outcome}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 * index, ease: EASE }}
            className={`group flex h-full flex-col rounded-2xl border bg-gradient-to-br p-5 transition-transform duration-300 hover:-translate-y-1 ${accents[index % accents.length]}`}
          >
            <span
              className={`flex size-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-transform duration-300 group-hover:scale-110 ${iconColors[index % iconColors.length]}`}
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <p className="mt-4 text-[15px] font-semibold leading-snug text-slate-900">
              {outcome}
            </p>
          </motion.li>
        );
      })}
    </ul>
  );
}
