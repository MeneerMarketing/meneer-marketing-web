"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DienstenHubVisual } from "@/components/diensten/hub/DienstenHubVisual";
import type { DienstenHubPillar } from "@/data/diensten-hub";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";
import { megaMenuColumns } from "@/lib/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

const THEME_STYLES = {
  light: {
    section: "bg-white border-slate-200",
    title: "text-slate-900",
    body: "text-slate-600",
    hotTake: "bg-slate-900/[0.04] ring-slate-200/80 text-slate-800",
    proof: "text-slate-500",
    link: "border-slate-200 bg-white hover:border-slate-300 text-slate-900",
  },
  dark: {
    section: "bg-[#0B1220] border-slate-800",
    title: "text-white",
    body: "text-slate-400",
    hotTake: "bg-white/[0.05] ring-white/[0.08] text-white/95",
    proof: "text-slate-500",
    link: "border-white/10 bg-white/[0.04] hover:border-white/20 text-white",
  },
  warm: {
    section: "bg-gradient-to-b from-[#F5F0EA] to-[#FEFCFC] border-[#8D6E63]/15",
    title: "text-[#2C2217]",
    body: "text-[#45382C]",
    hotTake: "bg-white/80 ring-[#8D6E63]/15 text-[#2C2217]",
    proof: "text-[#8D6E63]",
    link: "border-[#8D6E63]/20 bg-white hover:border-[#8D6E63]/35 text-[#2C2217]",
  },
} as const;

export function DienstenPillarHubSection({
  pillar,
  index,
}: {
  pillar: DienstenHubPillar;
  index: number;
}) {
  const reduce = useReducedMotion();
  const theme = THEME_STYLES[pillar.theme];
  const visualFirst = index % 2 === 1;
  const column = megaMenuColumns.find((c) => c.pillarSlug === pillar.slug)!;
  const diensten = column.items.slice(0, 4);

  return (
    <section
      id={pillar.anchor}
      className={`relative scroll-mt-24 border-b ${theme.section}`}
      aria-labelledby={`${pillar.anchor}-heading`}
    >
      {pillar.theme === "dark" ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.02)_1px,transparent_1px)] bg-[size:48px_48px]"
          aria-hidden
        />
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div
          className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 ${
            visualFirst ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Reveal>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: pillar.accent }}
            >
              {pillar.eyebrow}
            </p>
            <h2
              id={`${pillar.anchor}-heading`}
              className={`mt-4 text-pretty text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl ${theme.title}`}
            >
              {pillar.title}{" "}
              <span style={{ color: pillar.accent }}>{pillar.titleAccent}</span>
            </h2>
            <p className={`mt-5 max-w-lg text-pretty text-base leading-relaxed sm:text-lg ${theme.body}`}>
              {pillar.body}
            </p>

            <div
              className={`relative mt-6 overflow-hidden rounded-2xl px-4 py-4 ring-1 sm:px-5 ${theme.hotTake}`}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: pillar.accent }}
              >
                Heet take
              </p>
              <p className="mt-2 text-pretty text-sm font-bold leading-snug sm:text-base">
                {pillar.hotTake}
              </p>
            </div>

            <p className={`mt-4 text-sm font-medium ${theme.proof}`}>{pillar.proof}</p>

            <Link
              href={pillar.pillarHref}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: pillar.accent }}
            >
              {pillar.pillarCta}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <DienstenHubVisual slug={pillar.slug} />
          </motion.div>
        </div>

        <div className="mt-12">
          <p className={`text-xs font-bold uppercase tracking-[0.16em] ${theme.body}`}>
            Concrete trajecten
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {diensten.map((item, i) => {
              const Icon = megaMenuIconForHref(item.href);
              return (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className={`group flex h-full gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${theme.link}`}
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${pillar.accent}18`, color: pillar.accent }}
                    >
                      <Icon className="size-4" strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold group-hover:opacity-80">
                        {item.menuLabel ?? item.name}
                      </span>
                      <span className={`mt-0.5 block text-xs leading-relaxed ${theme.body}`}>
                        {item.menuDescription ?? item.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 opacity-40 transition group-hover:opacity-100"
                      style={{ color: pillar.accent }}
                      aria-hidden
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
