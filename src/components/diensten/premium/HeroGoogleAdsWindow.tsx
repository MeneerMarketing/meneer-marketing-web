"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Sponsored zoekresultaat klimt naar #1 + impression share meter.
 */
export function HeroGoogleAdsWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [promoted, setPromoted] = useState(reduce);

  useEffect(() => {
    if (!isInView || reduce) return;
    const t = window.setTimeout(() => setPromoted(true), 800);
    return () => window.clearTimeout(t);
  }, [isInView, reduce]);

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
          initial={reduce ? undefined : { opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex w-full max-w-[300px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-md"
          style={{ transform: "translateZ(40px)" }}
        >
          <Search className="size-4 text-slate-400" aria-hidden />
          <span className="text-sm font-medium text-slate-700">jouw product kopen</span>
        </motion.div>

        <div className="relative w-full max-w-[320px] space-y-2" style={{ transform: "translateZ(32px)" }}>
          <motion.div
            animate={promoted ? { y: -8, scale: 1.02 } : { y: 24, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className={`rounded-xl border px-4 py-3 shadow-lg ${
              promoted ? "border-[#FF5722]/40 bg-white ring-2 ring-[#FF5722]/15" : "border-slate-200 bg-slate-50"
            }`}
          >
            <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
              Sponsored
            </span>
            <p className={`mt-1.5 text-sm font-bold ${promoted ? "text-[#FF5722]" : "text-slate-600"}`}>
              Jouw shop · direct bestellen
            </p>
            <p className="text-[10px] text-emerald-600">jouw-site.nl/shop</p>
          </motion.div>
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white/80 px-4 py-2 opacity-50">
              <span className="text-[10px] font-bold text-sky-700">Concurrent {i}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={promoted ? { opacity: 1 } : { opacity: 0.4 }}
          className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-center"
          style={{ transform: "translateZ(45px)" }}
        >
          <p className="text-[9px] font-bold uppercase text-slate-400">Impression share</p>
          <p className="text-lg font-extrabold text-sky-600">{promoted ? "78%" : "12%"}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
