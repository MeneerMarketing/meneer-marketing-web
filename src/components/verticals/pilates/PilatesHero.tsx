"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowUpRight,
  Gauge,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { whatsappHref } from "@/lib/contact";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

const cfg = PILATES_VERTICAL;
const fromMonthly = formatVerticalMoney(cfg.pricing.packages[0]!.monthly);
const launchPromo = getActiveLaunchPromo(cfg.pricing);

const whatsappLink =
  whatsappHref(
    "Hoi Meneer Marketing! Ik heb een Pilates studio en wil graag even schakelen.",
  ) ?? "/contact";

const heroPillars = [
  {
    icon: Sparkles,
    label: "High-end design",
    hint: "Pilates op studioniveau, from scratch",
  },
  {
    icon: Gauge,
    label: "Technisch perfect",
    hint: "Snelheid, schema, Core Web Vitals",
  },
  {
    icon: TrendingUp,
    label: "Zo hoog mogelijk",
    hint: "Pilates + stad, Maps, pagina 1",
  },
] as const;

export function PilatesHero() {
  useEffect(() => {
    trackPilatesEvent("pilates_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden border-b border-slate-200 bg-[#0c1222] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(255,87,34,0.22), transparent 55%), linear-gradient(180deg, #0c1222 0%, #111827 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay">
        <LivingCloudGrid />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Voor boutique Pilates studio&apos;s
            </p>
            {launchPromo ? (
              <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {launchPromo.badge}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-[14ch] text-[2.4rem] font-extrabold leading-[1.04] tracking-tight sm:max-w-none sm:text-[2.85rem] lg:text-[3.1rem] lg:leading-[1.02]">
            High-end Pilates-design.
            <br />
            <span className="text-[#FF5722]">Zo hoog mogelijk in Google.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Ik bouw je site from scratch: art direction op studioniveau, code
            die Google écht snapt, en lokale SEO die mikken op Maps en zo hoog
            mogelijk in de zoekresultaten. Daarna boeken ze via jouw site. Vanaf{" "}
            {fromMonthly}/m
            {launchPromo ? (
              <>
                , launch{" "}
                <span className="font-semibold text-orange-200">€0</span>
              </>
            ) : null}
            , maandelijks opzegbaar.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {heroPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.label}
                  className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm"
                >
                  <Icon className="size-4 text-[#FF5722]" aria-hidden />
                  <p className="mt-2 text-sm font-bold tracking-tight text-white">
                    {pillar.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
                    {pillar.hint}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic strength={12} radius={170}>
              <a
                href="#aanvraag"
                onClick={() =>
                  trackPilatesEvent("pilates_package_select", {
                    location: "hero_cta",
                    package: "unsure",
                  })
                }
                className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-2xl rounded-bl-sm bg-[#FF5722] px-7 py-4 text-base font-bold tracking-tight text-white shadow-[0_16px_40px_-10px_rgba(255,87,34,0.65)] transition hover:bg-orange-600 sm:w-auto"
              >
                Stuur mijn studio door
                <ArrowUpRight
                  className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </Magnetic>
            <a
              href={whatsappLink}
              target={whatsappLink.startsWith("http") ? "_blank" : undefined}
              rel={
                whatsappLink.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", {
                  location: "hero_whatsapp",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold tracking-tight text-white transition hover:border-white/35 hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="size-4 text-emerald-300" aria-hidden />
              App me even
            </a>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400 lg:mt-auto lg:pt-6">
            Bel, mail of WhatsApp. Meestal dezelfde dag terug.{" "}
            <a
              href="#pakketten"
              className="font-semibold text-orange-200/90 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
            >
              Bekijk pakketten
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex h-full">
          <div className="relative flex h-full w-full flex-col">
            <div className="absolute -left-2 top-[12%] z-20 hidden rotate-[-6deg] sm:block lg:-left-6">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                <Gauge className="size-3.5 text-emerald-300" aria-hidden />
                <span className="text-xs font-semibold text-slate-100">
                  Core Web Vitals · groen
                </span>
              </div>
            </div>
            <div className="absolute -left-1 top-[42%] z-20 hidden sm:block lg:-left-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
                <Search className="size-3.5 text-sky-300" aria-hidden />
                <span className="text-xs font-semibold text-slate-100">
                  Pilates Utrecht · top 3
                </span>
              </div>
            </div>
            <div className="absolute -right-1 bottom-[28%] z-20 hidden rotate-[4deg] sm:block lg:-right-4">
              <div className="rounded-xl border border-orange-400/30 bg-[#FF5722] px-3 py-2 text-xs font-bold text-white shadow-xl">
                Proefles geboekt
              </div>
            </div>

            <figure className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] border border-white/15 bg-slate-950 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
              <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-slate-900/95 px-3 py-2.5">
                <span className="size-2 rounded-full bg-rose-400/80" />
                <span className="size-2 rounded-full bg-amber-400/80" />
                <span className="size-2 rounded-full bg-emerald-400/80" />
                <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                  <Search className="size-3 shrink-0" aria-hidden />
                  <span className="truncate">
                    pilates studio utrecht · jouwstudio.nl
                  </span>
                </span>
              </div>
              <div className="relative min-h-[240px] flex-1 bg-slate-800 sm:min-h-[280px] lg:min-h-0">
                <Image
                  src={cfg.caseStudy.imageSrc}
                  alt="High-end Pilates studio website"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"
                  aria-hidden
                />
                <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-slate-950/80 px-2.5 py-1.5 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-300">
                    Studio Edition
                  </p>
                  <p className="text-[11px] font-bold text-white">
                    High-end Pilates UI
                  </p>
                </div>
              </div>
              <figcaption className="grid shrink-0 grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-950/95 text-center">
                {[
                  { step: "Design", hint: "Studioniveau" },
                  { step: "Techniek", hint: "Google-ready" },
                  { step: "Ranking", hint: "Zo hoog mogelijk" },
                ].map((item) => (
                  <div key={item.step} className="px-2 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                      {item.step}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white">
                      {item.hint}
                    </p>
                  </div>
                ))}
              </figcaption>
            </figure>

            <p className="mt-3 shrink-0 text-center text-xs text-slate-400 sm:text-left">
              Vanaf {fromMonthly}
              {launchPromo ? (
                <>
                  {" "}
                  · launch{" "}
                  <span className="text-slate-500 line-through">
                    {formatVerticalMoney(launchPromo.was)}
                  </span>{" "}
                  <span className="font-semibold text-orange-300">€0</span>
                </>
              ) : (
                " + launch"
              )}
              {" "}
              · maandelijks opzegbaar
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
