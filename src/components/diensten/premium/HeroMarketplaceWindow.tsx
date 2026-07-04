"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const STORES = [
  { id: "bol", label: "Bol.com", color: "border-blue-400 bg-blue-50", badge: "Bol" },
  { id: "amazon", label: "Amazon", color: "border-amber-400 bg-amber-50", badge: "Prime" },
] as const;

/**
 * Bol + Amazon productkaarten, tik om Buy Box te highlighten.
 */
export function HeroMarketplaceWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<"bol" | "amazon">("bol");

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-3"
      >
        <div className="flex gap-3" style={{ transform: "translateZ(35px)" }}>
          {STORES.map((store) => {
            const isOn = active === store.id;
            return (
              <motion.button
                key={store.id}
                type="button"
                onClick={() => setActive(store.id as "bol" | "amazon")}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={isOn ? { scale: 1.04, y: -4 } : { scale: 1, y: 0 }}
                className={`w-[140px] rounded-2xl border p-3 text-left shadow-lg transition ${
                  isOn ? `${store.color} ring-2 ring-[#FF5722]/25` : "border-slate-200 bg-white"
                }`}
              >
                <span
                  className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${
                    store.id === "bol" ? "bg-blue-600 text-white" : "bg-amber-500 text-slate-900"
                  }`}
                >
                  {store.badge}
                </span>
                <div className="mt-2 aspect-square rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" aria-hidden />
                <p className="mt-2 line-clamp-2 text-[10px] font-bold text-slate-900">
                  Jouw product · premium editie
                </p>
                <div className="mt-1 flex items-center gap-0.5">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="text-[9px] font-bold text-slate-600">4,8 · 124 reviews</span>
                </div>
                {isOn ? (
                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700">
                    Buy Box
                  </span>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={reduce ? undefined : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          className="text-[11px] font-bold text-slate-500"
          style={{ transform: "translateZ(28px)" }}
        >
          Tik platform · listings + reviews
        </motion.p>
      </motion.div>
    </div>
  );
}
