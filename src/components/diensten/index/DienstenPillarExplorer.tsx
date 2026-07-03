"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PILLAR_ACCENTS } from "@/data/diensten-index";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";
import { megaMenuColumns, type PillarSlug } from "@/lib/navigation";

export function DienstenPillarExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PillarSlug>("strategie");
  const column = megaMenuColumns.find((c) => c.pillarSlug === active)!;
  const accent = PILLAR_ACCENTS[active] ?? "#FF5722";

  return (
    <section
      id="aanbod"
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="diensten-explorer-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Volledig aanbod
        </p>
        <h2
          id="diensten-explorer-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Kies je blok. Zie elk traject.
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Vijf hoofdblokken met eigen landingspagina. Tik een blok en scroll door
          alle concrete diensten eronder.
        </p>

        {/* Pillar tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {megaMenuColumns.map((col) => {
            const isActive = active === col.pillarSlug;
            const colAccent = PILLAR_ACCENTS[col.pillarSlug] ?? "#FF5722";
            return (
              <button
                key={col.pillarSlug}
                type="button"
                onClick={() => setActive(col.pillarSlug)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span
                  className="block text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: isActive ? colAccent : undefined }}
                >
                  {col.subtitle}
                </span>
                <span className="mt-0.5 block whitespace-nowrap text-sm font-extrabold">
                  {col.category}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {/* Pillar intro */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
              <div
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                style={{ borderTopColor: accent, borderTopWidth: 3 }}
              >
                <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {column.category}: {column.subtitle}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {column.featured.description}
                </p>
                <Link
                  href={`/${column.pillarSlug}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  {column.pillarOverviewCta}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>

              <aside className="flex flex-col rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Uitgelicht
                </p>
                <p className="mt-2 text-lg font-extrabold leading-snug">
                  {column.featured.title}
                </p>
                <Link
                  href={column.featured.href}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#FF5722] hover:underline"
                >
                  Bekijk verhaal
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </aside>
            </div>

            {/* Service grid */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {column.items.map((item, i) => {
                const Icon = megaMenuIconForHref(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={item.href}
                      className="group flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.18)]"
                    >
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:text-white"
                        style={{
                          backgroundColor: `${accent}18`,
                          color: accent,
                        }}
                      >
                        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                          {item.menuLabel ?? item.name}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                          {item.menuDescription ?? item.description}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-slate-300 transition group-hover:text-[#FF5722]"
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
