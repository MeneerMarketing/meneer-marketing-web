"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MeterAxisScore } from "@/lib/meter/types";

interface MeterAxisBarsProps {
  scores: MeterAxisScore[];
  revealIndex: number;
}

function barColor(value: number): string {
  if (value >= 72) return "#16a34a";
  if (value >= 50) return "#FF5722";
  return "#dc2626";
}

export function MeterAxisBars({ scores, revealIndex }: MeterAxisBarsProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <ul className="space-y-5">
      {scores.map((axis, index) => {
        const visible = index <= revealIndex;
        const color = barColor(axis.value);

        return (
          <motion.li
            key={axis.label}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 0 }}
            transition={{ duration: 0.35, delay: visible ? index * 0.08 : 0 }}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
                  {axis.label}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">{axis.hint}</p>
              </div>
              <motion.span
                key={axis.value}
                initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : {}}
                className="font-black tabular-nums text-3xl"
                style={{ color }}
              >
                {visible ? axis.value : "—"}
              </motion.span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: visible ? `${axis.value}%` : "0%" }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
