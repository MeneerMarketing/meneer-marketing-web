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

/**
 * Creator-kaart met engagement die oploopt + code-badge.
 */
export function HeroInfluencerWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const engagement = useMotionValue(reduce ? 8.4 : 2.1);
  const [display, setDisplay] = useState(reduce ? 8.4 : 2.1);

  useMotionValueEvent(engagement, "change", (v) => setDisplay(Math.round(v * 10) / 10));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      engagement.set(8.4);
      return;
    }
    const controls = animate(engagement, 8.4, { duration: 1.4, ease: EASE, delay: 0.3 });
    return () => controls.stop();
  }, [isInView, reduce, engagement]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-4"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-[#FF5722] text-sm font-black text-white">
              SC
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-900">@skincomplete.fan</p>
              <p className="text-[10px] text-slate-500">24k · skincare niche</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 py-2">
              <p className="text-[9px] font-bold uppercase text-slate-400">Engagement</p>
              <p className="text-sm font-extrabold text-emerald-600" aria-live="polite">
                {display}%
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 py-2">
              <p className="text-[9px] font-bold uppercase text-slate-400">Reach</p>
              <p className="text-sm font-extrabold text-slate-900">18k</p>
            </div>
            <div className="rounded-xl bg-slate-50 py-2">
              <p className="text-[9px] font-bold uppercase text-slate-400">Code</p>
              <p className="text-sm font-extrabold text-[#FF5722]">SC20</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={display > 6 ? { opacity: 1 } : { opacity: 0.4 }}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-bold text-emerald-700"
          style={{ transform: "translateZ(45px)" }}
        >
          Match · meetbare deal
        </motion.div>
      </motion.div>
    </div>
  );
}
