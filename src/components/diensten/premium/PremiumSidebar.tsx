"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PageTOC, type TocItem } from "@/components/diensten/premium/PageTOC";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

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

/** Lichte sticky sidebar: inhoudsopgave met scroll-spy, CTA en een meekijkende Meneer. */
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

      {/* Meneer kijkt mee */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm"
      >
        <span className="shrink-0" aria-hidden>
          <InteractiveLogo className="h-14 w-14" />
        </span>
        <p className="text-sm leading-snug text-slate-600">
          <span className="font-bold text-slate-900">Meneer kijkt met je mee.</span>{" "}
          Zijn ogen volgen je cursor. Straks volgt hij net zo scherp jouw
          cijfers.
        </p>
      </motion.div>

      {/* Gerelateerde diensten */}
      {related.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="px-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            Meer binnen {pillarName}
          </p>
          <ul className="mt-3 space-y-1">
            {related.map((item, index) => {
              const Icon = megaMenuIconForHref(`/diensten/${item.slug}`);
              return (
                <motion.li
                  key={item.slug}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.06 * index }}
                >
                  <Link
                    href={`/diensten/${item.slug}`}
                    className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-[#FF5722]"
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-[#FF5722]/10 group-hover:text-[#FF5722]"
                      aria-hidden
                    >
                      <Icon className="size-4" strokeWidth={1.8} />
                    </span>
                    <span className="flex-1">{item.name}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]" />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
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
