"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const STEPS = [
  {
    id: "shop",
    short: "Shop",
    label: "Shop / orders",
    copy: "Orders vertrekken hier. Klaar om te koppelen aan je stack.",
  },
  {
    id: "n8n",
    short: "n8n",
    label: "n8n / Make",
    copy: "Hier orkestreer je triggers: minder handwerk, minder fouten.",
  },
  {
    id: "rest",
    short: "Stack",
    label: "Boekhouding · CRM",
    copy: "Factuur, voorraad, klantmail: alles loopt door zonder spreadsheet-stress.",
  },
] as const;

export function AutomationFlowPlay() {
  const [active, setActive] = useState<(typeof STEPS)[number]["id"]>("n8n");

  return (
    <div
      className="rounded-2xl border border-mm-border bg-white p-5 shadow-md"
      aria-label="Interactieve automatisering-flow"
    >
      <p className="text-center text-xs font-bold uppercase tracking-wider text-mm-muted">
        Kies een schakel. Lees wat er gebeurt
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {STEPS.map((s) => {
          const on = active === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-pressed={on}
              whileTap={{ scale: 0.96 }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                on
                  ? "bg-mm-accent text-white shadow-md"
                  : "border border-mm-border bg-mm-bg text-mm-muted hover:border-mm-sky/40"
              }`}
            >
              {s.short}
            </motion.button>
          );
        })}
      </div>
      <div className="relative mt-6 aspect-[5/2] w-full">
        <svg
          viewBox="0 0 100 44"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <motion.path
            d="M 12 22 H 36 Q 40 22 42 18 T 48 22 H 52 Q 56 22 58 26 T 64 22 H 88"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <motion.path
            d="M 12 22 H 36 Q 40 22 42 18 T 48 22 H 52 Q 56 22 58 26 T 64 22 H 88"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={false}
            animate={{
              pathLength: active === "shop" ? 0.35 : active === "n8n" ? 0.72 : 1,
              opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
          {[
            { id: "shop" as const, cx: 12, cy: 22 },
            { id: "n8n" as const, cx: 50, cy: 22 },
            { id: "rest" as const, cx: 88, cy: 22 },
          ].map((dot) => (
            <motion.circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r={active === dot.id ? 5.5 : 4}
              fill={active === dot.id ? "#ea580c" : "#0ea5e9"}
              animate={{ scale: active === dot.id ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            />
          ))}
        </svg>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-2 min-h-[3rem] text-center"
        >
          <p className="text-sm font-semibold text-mm-text">
            {STEPS.find((s) => s.id === active)?.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-mm-muted">
            {STEPS.find((s) => s.id === active)?.copy}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
