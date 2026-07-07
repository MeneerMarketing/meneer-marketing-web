"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Layers } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { PillarSlug } from "@/lib/navigation";
import { megaMenuColumns } from "@/lib/navigation";
import { DienstenPillarIllustration } from "@/components/diensten/hub/DienstenPillarIllustrations";
import { DIENSTEN_FIVE_SNAP, DIENSTEN_HUB_PILLARS } from "@/data/diensten-hub";

const EASE = [0.22, 1, 0.36, 1] as const;

export function DienstenFiveSnap() {
  const reduce = useReducedMotion();
  const listId = useId();
  const [openSlug, setOpenSlug] = useState<PillarSlug | null>(null);

  const pillars = useMemo(
    () =>
      DIENSTEN_FIVE_SNAP.cards.map((card) => {
        const hub = DIENSTEN_HUB_PILLARS.find((p) => p.slug === card.slug)!;
        const menu = megaMenuColumns.find((c) => c.pillarSlug === card.slug)!;
        return { ...card, hub, services: menu.items, serviceCount: menu.items.length };
      }),
    [],
  );

  const toggle = (slug: PillarSlug) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  return (
    <section
      id="diensten-vijf"
      className="relative border-b border-slate-200 bg-white"
      aria-labelledby="diensten-vijf-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              {DIENSTEN_FIVE_SNAP.eyebrow}
            </p>
            <h2
              id="diensten-vijf-heading"
              className="mt-2 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              {DIENSTEN_FIVE_SNAP.title}
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500 sm:text-right">
            {DIENSTEN_FIVE_SNAP.quip}
          </p>
        </div>

        <ul id={listId} className="mt-8 space-y-3 sm:mt-10">
          {pillars.map((pillar, i) => {
            const isOpen = openSlug === pillar.slug;
            const panelId = `${listId}-${pillar.slug}-panel`;

            return (
              <motion.li
                key={pillar.slug}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-4%" }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
                className={`overflow-hidden rounded-2xl border bg-white shadow-[0_10px_36px_-22px_rgba(15,23,42,0.22)] transition-colors ${
                  isOpen ? "border-[#FF5722]/25" : "border-slate-200/90"
                }`}
              >
                <div className="flex items-stretch">
                  <Link
                    href={pillar.hub.pillarHref}
                    className="group/main flex min-w-0 flex-1 items-center gap-3 p-3 transition hover:bg-slate-50/80 sm:gap-4 sm:p-4"
                  >
                    <span
                      className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 p-2 sm:size-16"
                      style={{
                        background: `linear-gradient(145deg, ${pillar.accent}12 0%, white 55%)`,
                        boxShadow: `inset 0 0 0 1px ${pillar.accent}20`,
                      }}
                    >
                      <DienstenPillarIllustration slug={pillar.slug} accent={pillar.accent} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${pillar.accent}18`,
                            color: pillar.accent,
                          }}
                        >
                          {pillar.shortLabel}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200"
                        >
                          {pillar.serviceCount} subdiensten
                        </span>
                      </span>
                      <span className="mt-1.5 block text-pretty text-sm font-extrabold leading-snug tracking-tight text-slate-900 transition group-hover/main:text-[#FF5722] sm:text-base lg:text-lg">
                        {pillar.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {pillar.quip}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-600 transition group-hover/main:text-[#FF5722]">
                        Naar {pillar.shortLabel.toLowerCase()}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggle(pillar.slug)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={`${isOpen ? "Verberg" : "Toon"} subdiensten voor ${pillar.shortLabel}`}
                    className={`flex shrink-0 flex-col items-center justify-center gap-1 border-l px-3 transition sm:px-4 ${
                      isOpen
                        ? "border-[#FF5722]/20 bg-[#FF5722]/5 text-[#FF5722]"
                        : "border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-[#FF5722]"
                    }`}
                  >
                    <Layers className="size-4 sm:size-5" aria-hidden />
                    <span className="hidden text-[10px] font-bold uppercase tracking-wider sm:block">
                      {isOpen ? "Dicht" : "Open"}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 sm:size-5 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-label={`Subdiensten ${pillar.shortLabel}`}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div
                        className="border-t border-dashed border-slate-200 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3"
                        style={{
                          background: `linear-gradient(180deg, ${pillar.accent}0a 0%, transparent 60%)`,
                        }}
                      >
                        <Link
                          href={pillar.hub.pillarHref}
                          className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 transition hover:border-[#FF5722]/30 hover:shadow-sm"
                        >
                          <span className="text-xs font-bold text-slate-800 sm:text-sm">
                            Hoofdpagina {pillar.shortLabel.toLowerCase()}
                          </span>
                          <ArrowUpRight className="size-4 text-[#FF5722]" aria-hidden />
                        </Link>

                        <ul className="grid gap-2 sm:grid-cols-2">
                          {pillar.services.map((service) => (
                            <li key={service.href}>
                              <Link
                                href={service.href}
                                className="group/link flex items-start justify-between gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2.5 text-left transition hover:border-[#FF5722]/30 hover:shadow-sm"
                              >
                                <span className="min-w-0">
                                  <span className="block text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                                    {service.menuLabel ?? service.name}
                                  </span>
                                  <span className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                                    {service.menuDescription ?? service.description}
                                  </span>
                                </span>
                                <ArrowUpRight
                                  className="mt-0.5 size-3.5 shrink-0 text-slate-300 transition group-hover/link:text-[#FF5722]"
                                  aria-hidden
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 border-t border-slate-200/80 pt-3">
                          <Link
                            href={`#${pillar.anchor}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-[#FF5722]"
                          >
                            Scroll naar hoofdstuk op deze pagina
                            <ArrowUpRight className="size-3.5" aria-hidden />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
