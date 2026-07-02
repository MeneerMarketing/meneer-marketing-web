"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Waar ik bij jou naar kijk": vinkjes die zichzelf aftekenen zodra je
 * scrollt, als een intake-checklist die live wordt ingevuld.
 */
export function SignalsScan({ signals }: { signals: string[] }) {
  const reduce = useReducedMotion();

  return (
    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
      {signals.map((signal, index) => (
        <motion.li
          key={signal}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.12 * index, ease: EASE }}
          className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF5722]/40 hover:shadow-[0_18px_36px_-22px_rgba(255,87,34,0.45)]"
        >
          <span
            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-[#FF5722]/10 to-transparent transition-all duration-700 group-hover:left-full"
            aria-hidden
          />
          <span
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#FF5722]/70 bg-white"
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
              <motion.path
                d="M3 8.5 6.5 12 13 4.5"
                stroke="#FF5722"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  delay: 0.25 + 0.12 * index,
                  ease: "easeOut",
                }}
              />
            </svg>
          </span>
          <span className="text-sm font-medium leading-snug text-slate-800">
            {signal}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
