"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DienstenBlockVisual } from "@/components/diensten/index/DienstenBlockVisual";
import { DIENSTEN_FIVE_BLOCKS } from "@/data/diensten-index";
import type { PillarSlug } from "@/lib/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

export function DienstenFiveBlocks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="vijf-blokken"
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-white"
      aria-labelledby="diensten-blocks-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Het aanbod
          </p>
          <h2
            id="diensten-blocks-heading"
            className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Vijf blokken. Alles vooraf helder, ook achter het formulier.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Elk blok heeft een eigen landingspagina met proces, bewijs en concrete
            trajecten. Klik door. Of tik in de chat hierboven. Beide werken.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DIENSTEN_FIVE_BLOCKS.map((block, i) => {
            const isFeatured = i === 0;

            return (
              <motion.li
                key={block.slug}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.07 * i, duration: 0.45, ease: EASE }}
                className={isFeatured ? "xl:col-span-2 xl:row-span-2" : undefined}
              >
                <Link
                  href={`/${block.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_56px_-28px_rgba(15,23,42,0.22)]"
                  style={{ borderTopWidth: 4, borderTopColor: block.accent }}
                >
                  <DienstenBlockVisual
                    slug={block.slug as PillarSlug}
                    accent={block.accent}
                  />

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: block.accent }}
                    >
                      {block.tagline}
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold text-slate-900 group-hover:text-[#FF5722] sm:text-2xl">
                      {block.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {block.body}
                    </p>
                    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold leading-relaxed text-slate-700 ring-1 ring-slate-100">
                      {block.highlight}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-[#FF5722]">
                      Bekijk blok
                      <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
