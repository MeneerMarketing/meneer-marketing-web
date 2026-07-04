"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Navigation, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const PACK = [
  { name: "Concurrent A", stars: 4.1, reviews: 89, you: false },
  { name: "Concurrent B", stars: 4.3, reviews: 142, you: false },
  { name: "Jouw bedrijf", stars: 4.9, reviews: 218, you: true },
] as const;

/**
 * Maps-local pack: pin pulse + drie kaarten, jouw bedrijf schuift omhoog.
 */
export function HeroLocalWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [highlightYou, setHighlightYou] = useState(reduce);

  useEffect(() => {
    if (!isInView || reduce) return;
    const t = window.setTimeout(() => setHighlightYou(true), 1200);
    return () => window.clearTimeout(t);
  }, [isInView, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute right-0 top-10 size-52 rounded-full bg-emerald-200/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        {/* Mini map */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative h-36 w-full max-w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-100 shadow-lg"
          style={{ transform: "translateZ(25px)" }}
        >
          <div
            className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:18px_18px]"
            aria-hidden
          />
          <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
            <path d="M0 80 Q80 40 160 90 T320 70" fill="none" stroke="#94a3b8" strokeWidth="3" />
          </svg>
          <motion.div
            animate={reduce ? undefined : { scale: [1, 1.2, 1], y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
          >
            <MapPin className="size-10 fill-[#FF5722] text-[#FF5722] drop-shadow-md" aria-hidden />
          </motion.div>
          <span className="absolute bottom-2 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm">
            <Navigation className="size-3 text-sky-500" aria-hidden />
            1,2 km
          </span>
        </motion.div>

        {/* Local pack */}
        <div
          className="relative mt-5 w-full max-w-[320px] space-y-2"
          style={{ transform: "translateZ(40px)" }}
        >
          {PACK.map((biz, i) => (
            <motion.div
              key={biz.name}
              initial={reduce ? undefined : { opacity: 0, x: biz.you ? 20 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              animate={
                biz.you && highlightYou && !reduce
                  ? { y: -8, scale: 1.02 }
                  : { y: 0, scale: 1 }
              }
              transition={{
                delay: 0.15 + i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-md ${
                biz.you && highlightYou
                  ? "border-[#FF5722]/40 bg-white ring-2 ring-[#FF5722]/15"
                  : "border-slate-200/80 bg-white/95"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                  biz.you ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-bold ${
                    biz.you ? "text-[#FF5722]" : "text-slate-800"
                  }`}
                >
                  {biz.name}
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="text-[10px] font-bold text-slate-600">
                    {biz.stars} · {biz.reviews} reviews
                  </span>
                </div>
              </div>
              {biz.you && highlightYou ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600"
                >
                  Jij
                </motion.span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
