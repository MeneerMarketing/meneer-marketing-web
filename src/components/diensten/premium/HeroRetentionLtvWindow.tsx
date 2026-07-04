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

const ORBIT = [
  { label: "1e koop", angle: 0, color: "bg-slate-200" },
  { label: "2e koop", angle: 90, color: "bg-orange-200" },
  { label: "3e koop", angle: 180, color: "bg-[#FF5722]" },
  { label: "VIP", angle: 270, color: "bg-emerald-400" },
] as const;

/**
 * Orbit van herhaalaankopen met oplopende LTV-meter.
 */
export function HeroRetentionLtvWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const ltv = useMotionValue(reduce ? 312 : 89);
  const [display, setDisplay] = useState(reduce ? 312 : 89);
  const [orbitStep, setOrbitStep] = useState(reduce ? 3 : 0);

  useMotionValueEvent(ltv, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      ltv.set(312);
      setOrbitStep(3);
      return;
    }
    const ltvCtrl = animate(ltv, 312, { duration: 2.2, ease: EASE, delay: 0.4 });
    const orbitTimer = window.setInterval(() => {
      setOrbitStep((s) => (s + 1) % ORBIT.length);
    }, 1800);
    return () => {
      ltvCtrl.stop();
      window.clearInterval(orbitTimer);
    };
  }, [isInView, reduce, ltv]);

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
        <div
          className="relative size-[220px]"
          style={{ transform: "translateZ(35px)" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200" />
          {ORBIT.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 42;
            const y = 50 + Math.sin(rad) * 42;
            const lit = i <= orbitStep;
            return (
              <motion.div
                key={node.label}
                animate={{
                  scale: lit && i === orbitStep ? 1.15 : lit ? 1 : 0.85,
                  opacity: lit ? 1 : 0.35,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-full border-2 text-[9px] font-bold ${
                    lit
                      ? `${node.color} border-white shadow-md text-slate-800`
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <p
                  className={`mt-1 whitespace-nowrap text-center text-[8px] font-bold ${
                    lit ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {node.label}
                </p>
              </motion.div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <p className="text-[9px] font-bold uppercase text-slate-400">LTV</p>
            <p className="text-2xl font-extrabold tabular-nums text-[#FF5722]" aria-live="polite">
              €{display}
            </p>
          </div>
        </div>

        <motion.p
          initial={reduce ? undefined : { opacity: 0 }}
          animate={display > 200 ? { opacity: 1 } : { opacity: 0.4 }}
          className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[10px] font-bold text-[#FF5722]"
          style={{ transform: "translateZ(45px)" }}
        >
          Herhaalaankoop · geen extra ad spend
        </motion.p>
      </motion.div>
    </div>
  );
}
