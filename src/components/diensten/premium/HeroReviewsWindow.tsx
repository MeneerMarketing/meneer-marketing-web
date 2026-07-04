"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;
const TARGET = 4.9;

const REVIEWS = [
  { name: "Lisa", text: "Supersnel geholpen", delay: 0.3 },
  { name: "Mark", text: "Precies wat ik zocht", delay: 0.55 },
  { name: "Sanne", text: "Aanrader!", delay: 0.8 },
] as const;

function Stars({ filled }: { filled: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-4 ${
            i <= Math.floor(filled)
              ? "fill-amber-400 text-amber-400"
              : i - 0.5 <= filled
                ? "fill-amber-400/60 text-amber-400"
                : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Score-meter + inkomende review-notificaties. Geen statisch sterrenblok.
 */
export function HeroReviewsWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const score = useMotionValue(reduce ? TARGET : 3.2);
  const [display, setDisplay] = useState(reduce ? TARGET : 3.2);
  const [visibleReviews, setVisibleReviews] = useState(reduce ? 3 : 0);

  useMotionValueEvent(score, "change", (v) => setDisplay(Math.round(v * 10) / 10));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      score.set(TARGET);
      setVisibleReviews(3);
      return;
    }
    const controls = animate(score, TARGET, { duration: 1.4, ease: EASE });
    const timers = REVIEWS.map((r, i) =>
      window.setTimeout(() => setVisibleReviews(i + 1), 400 + r.delay * 1000),
    );
    return () => {
      controls.stop();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [isInView, reduce, score]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-12 size-56 -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-5"
      >
        {/* Score ring */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-10 py-8 shadow-xl"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Google score
          </p>
          <motion.p
            className="mt-1 text-5xl font-extrabold tabular-nums tracking-tighter text-slate-900"
            aria-live="polite"
          >
            {display.toFixed(1)}
          </motion.p>
          <div className="mt-2">
            <Stars filled={display} />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: display >= 4.8 ? 1 : 0 }}
            className="mt-3 text-xs font-bold text-emerald-600"
          >
            +12 reviews deze maand
          </motion.p>
        </motion.div>

        {/* Inkomende reviews */}
        <div
          className="relative h-[140px] w-full max-w-[300px]"
          style={{ transform: "translateZ(35px)" }}
        >
          {REVIEWS.map((r, i) =>
            i < visibleReviews ? (
              <motion.div
                key={r.name}
                initial={reduce ? undefined : { opacity: 0, x: 40, y: 10 }}
                animate={{ opacity: 1, x: 0, y: i * 44 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="absolute right-0 flex w-[88%] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                  {r.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-2.5 fill-amber-400 text-amber-400" aria-hidden />
                    ))}
                  </div>
                  <p className="truncate text-[11px] font-bold text-slate-700">{r.text}</p>
                </div>
                <span className="shrink-0 text-[9px] font-bold text-emerald-500">Nieuw</span>
              </motion.div>
            ) : null,
          )}
        </div>
      </motion.div>
    </div>
  );
}
