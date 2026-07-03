"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileX, Megaphone, Shuffle } from "lucide-react";
import { OVER_ANTI } from "@/data/over-index";

const ICONS = [Ban, FileX, Megaphone, Shuffle] as const;

export function OverAntiBureauSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-slate-50/80"
      aria-labelledby="over-anti-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            Eerlijk
          </p>
          <h2
            id="over-anti-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {OVER_ANTI.title}
          </h2>
          <p className="mt-3 text-slate-600">{OVER_ANTI.subtitle}</p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OVER_ANTI.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.li
                key={item.label}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.06 * i }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(255,87,34,0.35)]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-400 transition group-hover:bg-[#FF5722]/10 group-hover:text-[#FF5722]">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <p className="mt-4 text-sm font-extrabold text-slate-900">{item.label}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
