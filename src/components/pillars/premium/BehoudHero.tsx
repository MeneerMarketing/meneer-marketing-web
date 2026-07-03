"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, ShoppingBag, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const STEPS = [
  {
    id: "trigger",
    icon: ShoppingBag,
    label: "Trigger",
    title: "Nieuwe aankoop",
    detail: "Order bevestigd in Shopify",
  },
  {
    id: "wait",
    icon: Clock,
    label: "Wacht",
    title: "2 dagen",
    detail: "Timing op basis van klantgedrag",
  },
  {
    id: "email",
    icon: Mail,
    label: "E-mail",
    title: "Opvolging + review",
    detail: "Persoonlijk, geen spam",
  },
  {
    id: "repeat",
    icon: Sparkles,
    label: "Herhaal",
    title: "Win-back na 30 dagen",
    detail: "Alleen wie niet terugkwam",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const AUTO_MS = 8000;

/**
 * Hero voor Behoud: verticale automatisering-flow (trigger → wacht → mail → herhaal).
 */
export function BehoudHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<StepId>("trigger");
  const userTouched = useRef(false);

  const cycle = useCallback(() => {
    setActive((prev) => {
      const idx = STEPS.findIndex((s) => s.id === prev);
      return STEPS[(idx + 1) % STEPS.length].id;
    });
  }, []);

  useEffect(() => {
    if (reduce || userTouched.current) return;
    const t = window.setInterval(cycle, AUTO_MS);
    return () => window.clearInterval(t);
  }, [cycle, reduce]);

  function selectStep(id: StepId) {
    userTouched.current = true;
    setActive(id);
  }

  const activeIndex = STEPS.findIndex((s) => s.id === active);

  return (
    <div className="relative mx-auto w-full max-w-[400px] select-none">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_56px_-24px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              flow.builder
            </p>
            <p className="text-xs font-extrabold text-slate-800">Klant na de koop</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            Automatisch
          </span>
        </div>

        <div className="relative p-4">
          <div
            className="pointer-events-none absolute left-[2.15rem] top-8 bottom-8 w-px bg-slate-200"
            aria-hidden
          />

          <ul className="space-y-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = active === step.id;
              const isPast = index < activeIndex;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => selectStep(step.id)}
                    className={`relative flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722]/35 bg-[#FF5722]/5 shadow-[0_8px_24px_-16px_rgba(255,87,34,0.4)]"
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#FF5722] text-white"
                          : isPast
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-white text-slate-400 shadow-sm"
                      }`}
                      aria-hidden
                    >
                      <Icon className="size-4" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                        {step.label}
                      </span>
                      <span className="mt-0.5 block text-sm font-extrabold text-slate-900">
                        {step.title}
                      </span>
                      <span
                        className={`mt-0.5 block text-[11px] text-slate-500 ${
                          isActive ? "opacity-100" : "opacity-70"
                        }`}
                      >
                        {step.detail}
                      </span>
                    </span>
                    {isActive && !reduce ? (
                      <motion.span
                        layoutId="flow-pulse"
                        className="absolute inset-0 rounded-xl ring-2 ring-[#FF5722]/20"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center text-[11px] text-slate-600"
            >
              Stap {activeIndex + 1} van {STEPS.length} · draait zonder handwerk
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="border-t border-slate-100 px-4 py-2 text-center text-[10px] text-slate-400">
          Tik een stap · zie de flow
        </p>
      </div>
    </div>
  );
}
