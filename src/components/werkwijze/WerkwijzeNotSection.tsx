"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileX, Layers, UserX } from "lucide-react";
import { WERKWIJZE_NOT } from "@/data/werkwijze-index";

const ICONS = [Layers, UserX, FileX, Ban] as const;

export function WerkwijzeNotSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="werkwijze-not-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Eerlijk
        </p>
        <h2
          id="werkwijze-not-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {WERKWIJZE_NOT.title}
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">{WERKWIJZE_NOT.subtitle}</p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {WERKWIJZE_NOT.items.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <motion.li
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
                whileHover={reduce ? undefined : { y: -3 }}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-sm transition hover:border-red-200/60 hover:shadow-md sm:p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-100">
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-slate-900">{item.title}</h3>
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
