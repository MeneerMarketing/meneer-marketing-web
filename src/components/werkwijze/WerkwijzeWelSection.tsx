"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WERKWIJZE_WEL } from "@/data/werkwijze-index";

export function WerkwijzeWelSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="werkwijze-wel-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Belofte
        </p>
        <h2
          id="werkwijze-wel-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl"
        >
          {WERKWIJZE_WEL.title}
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">{WERKWIJZE_WEL.subtitle}</p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {WERKWIJZE_WEL.items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/90 p-5 shadow-sm transition hover:border-[#FF5722]/30 hover:shadow-[0_20px_40px_-24px_rgba(255,87,34,0.35)] sm:p-6"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <h3 className="mt-3 text-base font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {item.body}
              </p>
              <p className="mt-4 rounded-xl border border-[#FF5722]/15 bg-[#FF5722]/5 px-3 py-2 text-xs font-bold leading-snug text-[#C2410C] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                {item.quip}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
