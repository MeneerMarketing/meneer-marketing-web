"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_FIVE_BLOCKS } from "@/data/diensten-index";

export function DienstenFiveBlocks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="vijf-blokken"
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50"
      aria-labelledby="diensten-blocks-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Het aanbod
          </p>
          <h2
            id="diensten-blocks-heading"
            className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Vijf blokken die samen je online groei dragen
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Elk blok heeft een eigen landingspagina met proces, bewijs en concrete
            trajecten. Klik door. Geen verrassingen achter een contactformulier.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIENSTEN_FIVE_BLOCKS.map((block, i) => (
            <motion.li
              key={block.slug}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.06 * i, type: "spring", stiffness: 220 }}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
            >
              <Link
                href={`/${block.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.2)]"
                style={{ borderTopWidth: 4, borderTopColor: block.accent }}
              >
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="text-3xl" aria-hidden>
                    {block.emoji}
                  </span>
                  <p
                    className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: block.accent }}
                  >
                    {block.tagline}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                    {block.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {block.body}
                  </p>
                  <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold leading-relaxed text-slate-700">
                    {block.highlight}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-[#FF5722]">
                    Bekijk blok
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
