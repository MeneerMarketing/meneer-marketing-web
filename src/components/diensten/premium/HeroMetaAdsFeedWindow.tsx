"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Telefoon-feed met scroll-stop advertentie-kaart.
 */
export function HeroMetaAdsFeedWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [paused, setPaused] = useState(reduce);

  useEffect(() => {
    if (!isInView || reduce) return;
    const t = window.setTimeout(() => setPaused(true), 1000);
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
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative w-[220px] overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl"
          style={{ transform: "translateZ(35px)" }}
        >
          <div className="h-6 bg-slate-900" aria-hidden />
          <div className="max-h-[340px] space-y-2 overflow-hidden bg-slate-100 p-2">
            <div className="h-16 rounded-lg bg-white/60" aria-hidden />
            <motion.div
              animate={paused && !reduce ? { scale: [1, 1.02, 1] } : undefined}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-xl border-2 border-[#FF5722]/50 bg-white shadow-md"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-orange-100 to-sky-100 p-3">
                <p className="text-[10px] font-bold uppercase text-[#FF5722]">Ad · Sponsored</p>
                <p className="mt-2 text-xs font-extrabold text-slate-900">
                  {paused ? "Hook die stopt met scrollen" : "..."}
                </p>
                <span className="mt-3 inline-block rounded-full bg-[#FF5722] px-3 py-1 text-[9px] font-bold text-white">
                  Shop now
                </span>
              </div>
              <div className="flex gap-4 px-3 py-2 text-slate-500">
                <Heart className="size-4" aria-hidden />
                <MessageCircle className="size-4" aria-hidden />
                <Share2 className="size-4" aria-hidden />
              </div>
            </motion.div>
            <div className="h-12 rounded-lg bg-white/60" aria-hidden />
          </div>
        </motion.div>

        {paused ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -right-2 top-16 rounded-2xl border border-violet-200 bg-white px-3 py-2 shadow-lg"
            style={{ transform: "translateZ(50px)" }}
          >
            <p className="text-[9px] font-bold text-violet-600">Scroll stopped</p>
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}
