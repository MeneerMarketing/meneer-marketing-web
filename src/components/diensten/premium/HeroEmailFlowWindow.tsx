"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Clock, Mail, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const STEPS = [
  { id: "trigger", icon: ShoppingCart, label: "Trigger", detail: "Winkelwagen verlaten" },
  { id: "wait", icon: Clock, label: "Wacht", detail: "45 min · niet pushen" },
  { id: "mail", icon: Mail, label: "Mail", detail: "Herinnering + social proof" },
  { id: "win", icon: Sparkles, label: "Resultaat", detail: "34% open · omzet terug" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

/**
 * Verticale e-mail flow: trigger → wacht → mail → resultaat.
 */
export function HeroEmailFlowWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<StepId>("trigger");

  useEffect(() => {
    if (!isInView || reduce) return;
    let idx = 0;
    const t = window.setInterval(() => {
      idx = (idx + 1) % STEPS.length;
      setActive(STEPS[idx].id);
    }, 2200);
    return () => window.clearInterval(t);
  }, [isInView, reduce]);

  const activeIndex = STEPS.findIndex((s) => s.id === active);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[300px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            klaviyo.flow
          </p>
          <p className="mt-0.5 text-xs font-extrabold text-slate-800">Cart recovery</p>

          <div className="relative mt-5 space-y-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isOn = step.id === active;
              const isPast = i < activeIndex;
              return (
                <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < STEPS.length - 1 ? (
                    <div
                      className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                        isPast || isOn ? "bg-[#FF5722]/40" : "bg-slate-100"
                      }`}
                    />
                  ) : null}
                  <motion.span
                    animate={{
                      scale: isOn ? 1.08 : 1,
                      backgroundColor: isOn ? "#FF5722" : isPast ? "#FFF3EE" : "#F8FAFC",
                    }}
                    className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${
                      isOn ? "border-[#FF5722] text-white" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </motion.span>
                  <div className="min-w-0 pt-0.5">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wide ${
                        isOn ? "text-[#FF5722]" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <AnimatePresence mode="wait">
                      {isOn ? (
                        <motion.p
                          key={step.detail}
                          initial={reduce ? undefined : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs font-semibold text-slate-800"
                        >
                          {step.detail}
                        </motion.p>
                      ) : (
                        <p className="text-xs text-slate-400">{step.detail}</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: 12 }}
          animate={active === "win" ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 8 }}
          className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 shadow-md"
          style={{ transform: "translateZ(48px)" }}
        >
          <p className="text-[9px] font-bold uppercase text-emerald-600">Recovered</p>
          <p className="text-lg font-extrabold tabular-nums text-emerald-700">€847</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
