"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageTOC, type TocItem } from "@/components/diensten/premium/PageTOC";

export interface SidebarRelatedItem {
  slug: string;
  name: string;
}

export interface SidebarArtikel {
  slug: string;
  title: string;
  readMinutes: number;
}

interface PremiumSidebarProps {
  ctaHref: string;
  ctaLabel: string;
  pillarName: string;
  related: SidebarRelatedItem[];
  tocItems: TocItem[];
  artikelen?: SidebarArtikel[];
}

/** Lichte sticky sidebar: inhoudsopgave met scroll-spy, CTA en gerelateerde links. */
export function PremiumSidebar({
  ctaHref,
  ctaLabel,
  pillarName,
  related,
  tocItems,
  artikelen = [],
}: PremiumSidebarProps) {
  const reduce = useReducedMotion();

  return (
    <aside className="mt-12 min-w-0 space-y-5 lg:mt-0 lg:sticky lg:top-24">
      {/* Inhoudsopgave met live scroll-indicator */}
      <div className="hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Op deze pagina
        </p>
        <div className="mt-3">
          <PageTOC items={tocItems} />
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#FF5722]/10 blur-2xl"
          aria-hidden
        />
        <p className="relative inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          <span className="relative flex size-2" aria-hidden>
            {reduce ? null : (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Ruimte voor nieuwe projecten
        </p>
        <p className="relative mt-4 text-lg font-extrabold leading-snug tracking-tight text-slate-900">
          Zullen we eerst even kijken of het klikt?
        </p>
        <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
          Eén gesprek, geen verplichtingen. Je krijgt sowieso een eerlijk
          antwoord op de vraag of dit nu de slimste stap is.
        </p>
        <Link
          href={ctaHref}
          className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#FF5722]/25 transition hover:shadow-[#FF5722]/40"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
          />
          <span className="relative z-10">{ctaLabel}</span>
          <ArrowUpRight className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <p className="relative mt-3 text-center text-xs text-slate-400">
          Je hoort binnen één werkdag van me.
        </p>
      </div>

      {/* Gerelateerde diensten: compacte pills zodat de sidebar kort blijft */}
      {related.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Meer binnen {pillarName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/diensten/${item.slug}`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#FF5722]/40 hover:bg-[#FF5722]/5 hover:text-[#FF5722]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Uit de kennisbank: compact, max twee artikelen zodat de sidebar rustig blijft */}
      {artikelen.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="flex items-center justify-between px-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            Uit de kennisbank
            <Link
              href="/kennisbank"
              className="font-bold normal-case tracking-normal text-[#FF5722] transition-colors hover:text-slate-900"
            >
              Alles
            </Link>
          </p>
          <ul className="mt-3 space-y-1">
            {artikelen.slice(0, 2).map((artikel, index) => (
              <motion.li
                key={artikel.slug}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.06 * index }}
              >
                <Link
                  href={`/kennisbank/${artikel.slug}`}
                  className="group block rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <span className="block text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[#FF5722]">
                    {artikel.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {artikel.readMinutes} min lezen
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
