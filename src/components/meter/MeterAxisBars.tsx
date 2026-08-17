"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { MeterAxisScore } from "@/lib/meter/types";

interface MeterAxisBarsProps {
  scores: MeterAxisScore[];
  revealIndex: number;
}

export function MeterAxisBars({ scores, revealIndex }: MeterAxisBarsProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Vier assen
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Waar het wringt
        </h2>
      </div>

      <ul className="space-y-5">
        {scores.map((axis, index) => {
          const visible = index <= revealIndex;
          return (
            <li key={axis.label}>
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm font-bold text-slate-800">{axis.label}</p>
                <motion.span
                  className="font-black tabular-nums text-lg text-[#FF5722]"
                  initial={false}
                  animate={{ opacity: visible ? 1 : 0.35 }}
                >
                  {visible ? axis.value : "—"}
                </motion.span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-[#ff8a65]"
                  initial={{ width: "0%" }}
                  animate={{ width: visible ? `${axis.value}%` : "0%" }}
                  transition={{
                    duration: reduce ? 0 : 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
              {visible ? (
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs leading-relaxed text-slate-500"
                >
                  {axis.hint}
                </motion.p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
