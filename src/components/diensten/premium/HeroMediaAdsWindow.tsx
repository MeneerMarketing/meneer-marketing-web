"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const VARIANTS = [
  { id: "a", label: "Hook A", ctr: "2,1%", tone: "from-orange-200 to-amber-100" },
  { id: "b", label: "Hook B", ctr: "3,8%", tone: "from-emerald-200 to-sky-100", winner: true },
  { id: "c", label: "Hook C", ctr: "1,4%", tone: "from-slate-200 to-slate-100" },
] as const;

/**
 * Creative variant rack voor ad testing.
 */
export function HeroMediaAdsWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState("b");

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[340px]"
          style={{ transform: "translateZ(35px)" }}
        >
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Creative test · tik variant
          </p>
          <div className="flex items-end justify-center gap-2">
            {VARIANTS.map((v, i) => {
              const isOn = active === v.id;
              return (
                <motion.button
                  key={v.id}
                  type="button"
                  onClick={() => setActive(v.id)}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  animate={{
                    height: isOn ? 140 : 100,
                    scale: isOn ? 1.05 : 1,
                  }}
                  className={`relative w-[88px] overflow-hidden rounded-xl border-2 shadow-md transition-colors ${
                    isOn
                      ? "border-[#FF5722] ring-2 ring-[#FF5722]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-full bg-gradient-to-br ${v.tone} p-2`}>
                    <p className="text-[9px] font-bold text-slate-700">{v.label}</p>
                    <p
                      className={`mt-1 text-lg font-extrabold tabular-nums ${
                        "winner" in v ? "text-emerald-600" : "text-slate-500"
                      }`}
                    >
                      {v.ctr}
                    </p>
                    <p className="text-[8px] font-medium text-slate-500">CTR</p>
                  </div>
                  {"winner" in v && isOn ? (
                    <span className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[7px] font-bold text-white">
                      Win
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={reduce ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 text-sm font-extrabold text-[#FF5722]"
            style={{ transform: "translateZ(42px)" }}
          >
            Hook B wint · opschalen
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
