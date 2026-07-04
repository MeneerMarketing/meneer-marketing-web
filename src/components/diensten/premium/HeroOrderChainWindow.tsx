"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Package, Truck, CreditCard, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const CHAIN = [
  { id: "paid", icon: CreditCard, label: "Betaald", sub: "Order #4821" },
  { id: "pack", icon: Package, label: "Ingepakt", sub: "Magazijn A" },
  { id: "ship", icon: Truck, label: "Verzonden", sub: "Track & trace" },
  { id: "review", icon: Star, label: "Review mail", sub: "Na levering" },
] as const;

/**
 * Horizontale order-keten met oplichtende stappen.
 */
export function HeroOrderChainWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [step, setStep] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const t = window.setInterval(() => {
      setStep((s) => (s + 1) % CHAIN.length);
    }, 1600);
    return () => window.clearInterval(t);
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
        className="relative flex h-full flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[340px]"
          style={{ transform: "translateZ(38px)" }}
        >
          <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            E-commerce keten · live sync
          </p>
          <div className="relative flex items-start justify-between gap-1">
            <div className="absolute left-[12%] right-[12%] top-5 h-0.5 bg-slate-100" />
            <motion.div
              className="absolute left-[12%] top-5 h-0.5 origin-left bg-[#FF5722]"
              animate={{ width: `${(step / (CHAIN.length - 1)) * 76}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            {CHAIN.map((item, i) => {
              const Icon = item.icon;
              const done = i <= step;
              const current = i === step;
              return (
                <div key={item.id} className="relative z-10 flex flex-1 flex-col items-center">
                  <motion.span
                    animate={{
                      scale: current ? 1.12 : 1,
                      backgroundColor: done ? "#FF5722" : "#F1F5F9",
                    }}
                    className={`flex size-10 items-center justify-center rounded-full border-2 ${
                      done ? "border-[#FF5722] text-white" : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {done && i < step ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      <Icon className="size-4" aria-hidden />
                    )}
                  </motion.span>
                  <p
                    className={`mt-2 text-center text-[9px] font-bold ${
                      current ? "text-[#FF5722]" : done ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-center text-[8px] text-slate-400">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          animate={step >= 2 ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 6 }}
          className="w-full max-w-[280px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
          style={{ transform: "translateZ(45px)" }}
        >
          <p className="text-[9px] font-bold uppercase text-slate-400">Klantmail</p>
          <p className="mt-1 text-xs font-semibold text-slate-800">
            {step >= 2
              ? "Je pakket is onderweg · track hier"
              : "We pakken je order in"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
