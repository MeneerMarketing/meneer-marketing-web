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
 * A/B split: variant B wint, conversie loopt op.
 */
export function HeroCroWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [winner, setWinner] = useState<"a" | "b">(reduce ? "b" : "a");

  const convA = useMotionValue(2.1);
  const convB = useMotionValue(2.1);
  const [displayA, setDisplayA] = useState(2.1);
  const [displayB, setDisplayB] = useState(reduce ? 3.4 : 2.1);

  useMotionValueEvent(convA, "change", (v) => setDisplayA(Math.round(v * 10) / 10));
  useMotionValueEvent(convB, "change", (v) => setDisplayB(Math.round(v * 10) / 10));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      convB.set(3.4);
      setWinner("b");
      return;
    }
    const t = window.setTimeout(() => {
      setWinner("b");
      animate(convB, 3.4, { duration: 1.2, ease: EASE });
    }, 900);
    return () => window.clearTimeout(t);
  }, [isInView, reduce, convB]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center gap-3 px-2"
      >
        {(["a", "b"] as const).map((variant, i) => {
          const isWinner = winner === variant;
          const conv = variant === "a" ? displayA : displayB;
          return (
            <motion.div
              key={variant}
              initial={reduce ? undefined : { opacity: 0, y: 20, rotate: i === 0 ? -4 : 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -3 : 3 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
              animate={
                isWinner && !reduce
                  ? { scale: 1.04, y: -6, rotate: i === 0 ? -2 : 2 }
                  : { scale: 1, y: 0 }
              }
              className={`relative w-[46%] overflow-hidden rounded-2xl border shadow-lg ${
                isWinner
                  ? "border-emerald-400/60 bg-white ring-2 ring-emerald-400/30"
                  : "border-slate-200 bg-slate-50"
              }`}
              style={{ transform: "translateZ(35px)" }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Variant {variant.toUpperCase()}
                </span>
                {isWinner ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                    Winnaar
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 p-3">
                <span className="block h-2 w-3/4 rounded-full bg-slate-300" aria-hidden />
                <span className="block h-8 rounded-lg bg-slate-100" aria-hidden />
                <span
                  className={`inline-block h-6 rounded-full px-4 ${
                    isWinner ? "bg-[#FF5722]" : "bg-slate-400"
                  }`}
                  aria-hidden
                />
              </div>
              <div className="border-t border-slate-100 px-3 py-2.5 text-center">
                <p className="text-[9px] font-bold uppercase text-slate-400">Conversie</p>
                <p
                  className={`text-lg font-extrabold tabular-nums ${
                    isWinner ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {conv}%
                </p>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
          animate={winner === "b" ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-bold text-slate-600 shadow-md"
          style={{ transform: "translateZ(50px)" }}
        >
          +62% meer conversies
        </motion.div>
      </motion.div>
    </div>
  );
}
