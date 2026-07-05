"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Bell, ShoppingBag, Users, Workflow, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const FLOW = [
  {
    id: "shopify",
    label: "Shopify",
    detail: "Nieuwe order binnen",
    icon: ShoppingBag,
  },
  {
    id: "engine",
    label: "Workflow",
    detail: "Regels · timing · checks",
    icon: Workflow,
  },
  {
    id: "crm",
    label: "CRM",
    detail: "Klant automatisch bij",
    icon: Users,
  },
  {
    id: "alert",
    label: "Team alert",
    detail: "Slack · direct op de hoogte",
    icon: Bell,
  },
] as const;

const LIVE_TICKS = [
  "Order #4821 doorgestuurd naar CRM",
  "Voorraad gesynced · geen handwerk",
  "Team alert verstuurd · alles groen",
] as const;

/**
 * Autopilot workflow rail: horizontale keten met live console.
 */
export function HeroAutomationNodesWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [step, setStep] = useState(reduce ? 3 : 0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const stepTimer = window.setInterval(() => {
      setStep((s) => (s + 1) % FLOW.length);
    }, 1800);
    const tickTimer = window.setInterval(() => {
      setTick((t) => (t + 1) % LIVE_TICKS.length);
    }, 2600);
    return () => {
      window.clearInterval(stepTimer);
      window.clearInterval(tickTimer);
    };
  }, [isInView, reduce]);

  const progress = step / (FLOW.length - 1);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-5"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_60px_-36px_rgba(15,23,42,0.28)]"
          style={{ transform: "translateZ(38px)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:20px_20px]"
            aria-hidden
          />

          <div className="relative border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Autopilot actief
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
                  Order binnen · stack werkt zelf
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <motion.span
                  animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                Live
              </span>
            </div>
          </div>

          <div className="relative px-4 pb-4 pt-5">
            <div className="relative flex items-start justify-between gap-1">
              <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-slate-100" />
              <motion.div
                className="absolute left-[10%] top-5 h-0.5 origin-left bg-gradient-to-r from-[#FF5722] to-orange-400"
                animate={{ width: `${progress * 80}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />

              {!reduce ? (
                <motion.span
                  className="absolute top-[18px] size-2.5 rounded-full bg-[#FF5722] shadow-[0_0_12px_rgba(255,87,34,0.55)]"
                  animate={{ left: `${10 + progress * 80}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  aria-hidden
                />
              ) : null}

              {FLOW.map((item, i) => {
                const Icon = item.icon;
                const done = i <= step;
                const current = i === step;
                const isHub = item.id === "engine";

                return (
                  <div key={item.id} className="relative z-10 flex flex-1 flex-col items-center">
                    <motion.span
                      animate={{
                        scale: current ? 1.1 : 1,
                        backgroundColor: current
                          ? "#FF5722"
                          : done
                            ? "#FFF3EE"
                            : "#F8FAFC",
                      }}
                      className={`flex size-10 items-center justify-center rounded-full border-2 ${
                        current
                          ? "border-[#FF5722] text-white shadow-[0_0_20px_rgba(255,87,34,0.35)]"
                          : done
                            ? "border-[#FF5722]/30 text-[#FF5722]"
                            : "border-slate-200 text-slate-400"
                      } ${isHub && current ? "ring-4 ring-[#FF5722]/15" : ""}`}
                    >
                      <Icon className="size-4" aria-hidden />
                    </motion.span>
                    <p
                      className={`mt-2 text-center text-[9px] font-bold leading-tight ${
                        current ? "text-[#FF5722]" : done ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="mt-0.5 min-h-[2rem] text-center text-[8px] leading-snug text-slate-400">
                      {current ? item.detail : "\u00A0"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-950 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Zap className="size-3 shrink-0 text-[#FF5722]" aria-hidden />
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Console
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={tick}
                  initial={reduce ? undefined : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="mt-1.5 font-mono text-[11px] leading-relaxed text-emerald-400"
                >
                  <span className="text-slate-500">{">"}</span> {LIVE_TICKS[tick]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#FF5722]/20 bg-gradient-to-br from-orange-50 to-white px-5 py-3 shadow-lg"
          style={{ transform: "translateZ(48px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
            Tijd terug per week
          </p>
          <p className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-900">
            6 uur minder copy-paste
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
