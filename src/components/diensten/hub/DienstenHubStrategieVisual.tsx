"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const SCENARIOS = [
  { id: "plan", label: "Groeiplan", kpi: "3 focuspunten", note: "geen 40 slides" },
  { id: "ads", label: "Ads-route", kpi: "ROAS 4.2×", note: "pas na CRO" },
  { id: "track", label: "Tracking", kpi: "GTM live", note: "meten vóór schalen" },
] as const;

export function DienstenHubStrategieVisual() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof SCENARIOS)[number]["id"]>("plan");
  const scenario = SCENARIOS.find((s) => s.id === active)!;

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-orange-50/40 p-5 shadow-[0_24px_56px_-32px_rgba(15,23,42,0.18)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
        Tik een scenario
      </p>
      <div className="mt-3 flex gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`flex-1 rounded-xl px-2 py-2 text-center text-[10px] font-bold transition ${
              active === s.id
                ? "bg-[#FF5722] text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: EASE }}
        className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"
      >
        <p className="font-mono text-[10px] text-slate-400">route.{active}.json</p>
        <p className="mt-2 text-2xl font-black tabular-nums text-slate-900">{scenario.kpi}</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">{scenario.note}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-[#FF5722]"
            initial={{ width: "0%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
      </motion.div>
    </div>
  );
}
