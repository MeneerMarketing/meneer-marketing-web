"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/effects/Magnetic";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

export interface SidebarRelatedItem {
  slug: string;
  name: string;
}

interface PremiumSidebarProps {
  ctaHref: string;
  ctaLabel: string;
  pillarName: string;
  related: SidebarRelatedItem[];
}

/** Sticky sidebar met levend beschikbaarheids-signaal en magnetische CTA. */
export function PremiumSidebar({
  ctaHref,
  ctaLabel,
  pillarName,
  related,
}: PremiumSidebarProps) {
  const reduce = useReducedMotion();

  return (
    <aside className="mt-12 min-w-0 space-y-5 lg:mt-0 lg:sticky lg:top-28">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-[0_28px_56px_-24px_rgba(15,23,42,0.55)]">
        <div
          className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#FF5722]/25 blur-2xl"
          aria-hidden
        />
        <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
          <span className="relative flex size-2.5" aria-hidden>
            {reduce ? null : (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
          Ruimte voor nieuwe projecten
        </p>
        <p className="relative mt-4 text-xl font-extrabold leading-snug tracking-tight">
          Zullen we eerst even kijken of het klikt?
        </p>
        <p className="relative mt-2 text-sm leading-relaxed text-slate-300">
          Eén gesprek, geen verplichtingen. Je krijgt sowieso een eerlijk
          antwoord op de vraag of dit nu de slimste stap is.
        </p>
        <div className="relative mt-6">
          <Magnetic strength={14} radius={130}>
            <Link
              href={ctaHref}
              className="group inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:shadow-[#FF5722]/50"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
              />
              <span className="relative z-10">{ctaLabel}</span>
              <ArrowUpRight className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
        </div>
        <p className="relative mt-3 text-center text-[11px] text-slate-400">
          Reactie binnen één werkdag
        </p>
      </div>

      {related.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Meer binnen {pillarName}
          </p>
          <ul className="mt-4 space-y-1.5">
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
    </aside>
  );
}
