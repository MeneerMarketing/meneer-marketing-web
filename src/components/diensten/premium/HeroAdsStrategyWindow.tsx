"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNELS = [
  { id: "google", label: "Google Ads", color: "bg-sky-500", pct: 58 },
  { id: "meta", label: "Meta Ads", color: "bg-violet-500", pct: 42 },
] as const;

/**
 * Budget-split tussen Google en Meta met animerende balken + ROAS-badge.
 */
export function HeroAdsStrategyWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<"google" | "meta">("google");

  const roas = useMotionValue(reduce ? 3.8 : 1.2);
  const [displayRoas, setDisplayRoas] = useState(reduce ? 3.8 : 1.2);

  useMotionValueEvent(roas, "change", (v) => setDisplayRoas(Math.round(v * 10) / 10));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      roas.set(3.8);
      return;
    }
    const controls = animate(roas, 3.8, { duration: 1.8, ease: EASE, delay: 0.4 });
    return () => controls.stop();
  }, [isInView, reduce, roas]);

  const googlePct = active === "google" ? 72 : 58;
  const metaPct = active === "meta" ? 52 : 42;

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-5 px-4"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="w-full max-w-[320px] rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Budget split · tik kanaal
          </p>

          <div className="mt-4 space-y-4">
            {CHANNELS.map((ch) => {
              const pct = ch.id === "google" ? googlePct : metaPct;
              const isOn = active === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActive(ch.id)}
                  className={`block w-full text-left transition ${isOn ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
                >
                  <div className="mb-1.5 flex justify-between text-[11px] font-bold">
                    <span className={isOn ? "text-slate-900" : "text-slate-600"}>{ch.label}</span>
                    <span className={isOn ? "text-[#FF5722]" : "text-slate-500"}>{pct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.span
                      className={`block h-full rounded-full ${ch.color}`}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ROAS</p>
              <p className="text-2xl font-extrabold tabular-nums text-emerald-600" aria-live="polite">
                {displayRoas.toFixed(1)}×
              </p>
            </div>
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600"
            >
              Schaal klaar
            </motion.span>
          </div>
        </motion.div>

        {/* Funnel mini */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-end gap-1"
          style={{ transform: "translateZ(28px)" }}
          aria-hidden
        >
          {["Koud", "Warm", "Hot"].map((stage, i) => (
            <div
              key={stage}
              className="flex flex-col items-center"
            >
              <span
                className="rounded-t-lg bg-gradient-to-t from-[#FF5722]/80 to-[#FF5722]/40"
                style={{ width: 56 - i * 12, height: 28 + i * 14 }}
              />
              <span className="mt-1 text-[9px] font-bold text-slate-500">{stage}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
