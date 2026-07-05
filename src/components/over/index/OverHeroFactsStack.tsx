"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { OVER_HERO_FACTS } from "@/data/over-index";

export function OverHeroFactsStack() {
  const reduce = useReducedMotion();
  const [featured, ...rest] = OVER_HERO_FACTS;

  return (
    <div className="flex flex-col gap-2.5 lg:h-full lg:justify-between">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, rotate: -0.75 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.75 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="shrink-0 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-orange-50/50 p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] sm:p-6"
      >
        <InteractiveLogo className="mx-auto size-[4.5rem] sm:size-20" interactive={false} />
        <div className="mt-3 flex justify-center">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: featured!.accent }}
          >
            {featured!.badge}
          </span>
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm font-bold leading-snug text-slate-700">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-[#FF5722]" aria-hidden />
          {featured!.text}
        </p>
      </motion.div>

      <div className="flex flex-col gap-2.5 lg:flex-1 lg:justify-between">
        {rest.map((fact, index) => (
          <motion.div
            key={fact.id}
            initial={reduce ? false : { opacity: 0, x: index % 2 === 0 ? -10 : 10, rotate: fact.tilt * 1.5 }}
            whileInView={{ opacity: 1, x: 0, rotate: fact.tilt }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.05 * index,
            }}
            whileHover={reduce ? undefined : { y: -3, rotate: 0, scale: 1.01 }}
            className={`flex flex-col justify-center rounded-2xl rounded-bl-sm border border-slate-200/90 bg-white px-3.5 py-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(15,23,42,0.16)] sm:px-4 sm:py-3.5 lg:flex-1 ${
              index % 2 === 0 ? "lg:-translate-x-0.5" : "lg:translate-x-0.5"
            }`}
            style={{ borderLeftWidth: 3, borderLeftColor: fact.accent }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.13em]"
              style={{ color: fact.accent }}
            >
              {fact.badge}
            </p>
            <p className="mt-1 text-xs font-bold leading-relaxed text-slate-700 sm:text-[13px]">
              {fact.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
