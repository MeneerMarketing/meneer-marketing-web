"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, MapPin, Route } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_DISCOVER } from "@/data/diensten-index";

const ICONS = {
  Kennisbank: BookOpen,
  "Zoeken per regio": MapPin,
  Werkwijze: Route,
} as const;

export function DienstenDiscoverMore() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-discover-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Verder lezen
          </p>
          <h2
            id="diensten-discover-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {DIENSTEN_DISCOVER.title}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {DIENSTEN_DISCOVER.items.map((item, i) => {
            const Icon = ICONS[item.label as keyof typeof ICONS] ?? BookOpen;
            return (
              <motion.li
                key={item.href}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.08 * i }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_48px_-28px_rgba(15,23,42,0.18)]"
                  style={{ borderTopWidth: 3, borderTopColor: item.accent }}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: item.accent }}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                    {item.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                    Bekijk
                    <ArrowUpRight className="size-4 text-[#FF5722] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
