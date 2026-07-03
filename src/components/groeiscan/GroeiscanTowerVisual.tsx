"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TOWER_FLOORS } from "@/lib/groeiscan-playground";

interface GroeiscanTowerVisualProps {
  activeFloors: boolean[];
  score: number;
  growthLabel: string;
  compact?: boolean;
}

export function GroeiscanTowerVisual({
  activeFloors,
  score,
  growthLabel,
  compact = false,
}: GroeiscanTowerVisualProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative flex flex-col items-center ${compact ? "py-4" : "py-6"}`}
      aria-hidden
    >
      <div className={`relative w-full ${compact ? "max-w-[200px]" : "max-w-[260px]"}`}>
        {/* Groeibalk boven de toren */}
        <div className="mb-4">
          <div className="flex items-end justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Groeikracht
            </span>
            <motion.span
              key={score}
              initial={reduce ? false : { opacity: 0.5, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-black tabular-nums text-[#FF5722] ${compact ? "text-2xl" : "text-4xl"}`}
            >
              {score}
            </motion.span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-orange-300"
              initial={false}
              animate={{ width: `${score}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-bold text-slate-300">{growthLabel}</p>
        </div>

        {/* Toren: van boven naar beneden */}
        <div className="flex flex-col-reverse gap-1.5">
          {TOWER_FLOORS.map((floor, index) => {
            const active = activeFloors[index];
            return (
              <motion.div
                key={floor.id}
                animate={
                  active
                    ? {
                        backgroundColor: "rgba(255, 87, 34, 0.9)",
                        borderColor: "rgba(255, 140, 100, 0.6)",
                        boxShadow: "0 0 24px -4px rgba(255, 87, 34, 0.5)",
                      }
                    : {
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        borderColor: "rgba(255,255,255,0.06)",
                        boxShadow: "none",
                      }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 200, damping: 22, delay: index * 0.05 }
                }
                className={`relative overflow-hidden rounded-lg border px-3 ${compact ? "py-2" : "py-2.5"}`}
              >
                {active ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white to-transparent"
                  />
                ) : null}
                <div className="relative flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-extrabold ${active ? "text-white" : "text-slate-500"}`}
                  >
                    {floor.label}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${active ? "text-orange-100" : "text-slate-600"}`}
                  >
                    {floor.sub}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fundering */}
        <div className="mt-1.5 h-2 rounded-b-lg bg-slate-700" />
      </div>
    </div>
  );
}
