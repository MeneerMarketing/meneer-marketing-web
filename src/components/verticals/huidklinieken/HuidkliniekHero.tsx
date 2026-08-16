"use client";

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
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { whatsappHref } from "@/lib/contact";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

const cfg = HUIDKLINIEKEN_VERTICAL;
const fromMonthly = formatVerticalMoney(cfg.pricing.packages[0]!.monthly);
const launchPromo = getActiveLaunchPromo(cfg.pricing);

const whatsappLink =
  whatsappHref(
    "Hoi Meneer Marketing! Ik heb een huidkliniek en wil weten welk pakket past.",
  ) ?? "/contact";

const heroPillars = [
  {
    icon: Sparkles,
    label: "High-end design",
    hint: "Clinical editorial, from scratch",
  },
  {
    icon: Gauge,
    label: "Technisch perfect",
    hint: "Snelheid, schema, Core Web Vitals",
  },
  {
    icon: TrendingUp,
    label: "Zo hoog mogelijk",
    hint: "Kliniek + stad, Maps, pagina 1",
  },
] as const;

export function HuidkliniekHero() {
  useEffect(() => {
    trackHuidkliniekEvent("huidkliniek_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden border-b border-stone-200 bg-[#f7f8fa] text-slate-900">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(255,87,34,0.12), transparent 55%), linear-gradient(180deg, #fbfcfd 0%, #f1f3f6 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Huidkliniek · cosmetische kliniek · jouw stad
            </p>
            {launchPromo ? (
              <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {launchPromo.badge}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 max-w-[14ch] text-[2.4rem] font-extrabold leading-[1.04] tracking-tight text-slate-950 sm:max-w-none sm:text-[2.9rem] lg:text-[3.15rem] lg:leading-[1.02]">
            High-end kliniek-design.
            <br />
            <span className="text-[#FF5722]">Zo hoog mogelijk in Google.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
            Ik bouw je kliniek-site from scratch: art direction op
            behandelkamerniveau, technisch perfect voor Google (snelheid, schema,
            structuur) en lokale SEO die mikken op Maps en zo hoog mogelijk in
            de zoekresultaten. Daarna intake via jouw site. Vanaf {fromMonthly}{" "}
            per maand
            {launchPromo ? (
              <>
                , launch tijdelijk{" "}
                <span className="font-semibold text-[#FF5722]">€0</span>
              </>
            ) : null}
            , maandelijks opzegbaar. {cfg.pricing.includedInfraNote}
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {heroPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.label}
                  className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3.5 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.2)] backdrop-blur-sm"
                >
                  <Icon className="size-4 text-[#FF5722]" aria-hidden />
                  <p className="mt-2 text-sm font-bold tracking-tight text-slate-900">
                    {pillar.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                    {pillar.hint}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic strength={10} radius={160}>
              <a
                href="#aanvraag"
                onClick={() =>
                  trackHuidkliniekEvent("huidkliniek_package_select", {
                    location: "hero_cta",
                    package: "unsure",
                  })
                }
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl rounded-bl-sm bg-[#FF5722] px-7 py-4 text-base font-bold text-white shadow-[0_18px_40px_-12px_rgba(255,87,34,0.55)] transition hover:bg-orange-600 sm:w-auto"
              >
                Stuur mijn kliniek door
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
                trackHuidkliniekEvent("huidkliniek_demo_click", {
                  location: "hero_whatsapp",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:shadow-sm sm:w-auto"
            >
              <MessageCircle className="size-4 text-emerald-600" aria-hidden />
              App me even
            </a>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 lg:mt-auto lg:pt-6">
            Bel, mail of WhatsApp. Meestal dezelfde dag terug.{" "}
            <a
              href="#pakketten"
              className="font-semibold text-[#FF5722] underline decoration-[#FF5722]/35 underline-offset-2 hover:text-orange-700"
            >
              Bekijk pakketten
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative flex h-full">
          <div className="relative flex w-full flex-col justify-center">
            <div className="absolute -left-3 top-6 z-20 hidden rotate-[-5deg] sm:block lg:-left-5">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
                <Gauge className="size-3.5 text-emerald-600" aria-hidden />
                Core Web Vitals · groen
              </div>
            </div>
            <div className="absolute -left-2 top-[38%] z-20 hidden sm:block lg:-left-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
                <Search className="size-3.5 text-sky-600" aria-hidden />
                Huidkliniek Utrecht · top 3
              </div>
            </div>
            <div className="absolute -right-2 bottom-16 z-20 hidden rotate-[3deg] sm:block lg:-right-4">
              <div className="rounded-xl bg-[#FF5722] px-3 py-2 text-xs font-bold text-white shadow-lg">
                Intake gepland
              </div>
            </div>

            <figure className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)]">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Digitale voordeur
                </p>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                  jouwkliniek.nl
                </p>
              </div>
              <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 p-5 sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                    Utrecht · huidkliniek
                  </p>
                  <p className="text-2xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-[1.85rem]">
                    Clinical-grade online.
                    <span className="mt-1 block text-slate-500">
                      Google merkt het verschil.
                    </span>
                  </p>
                  <p className="max-w-[32ch] text-sm leading-relaxed text-slate-600">
                    Behandelingen, team en tarieven in één scroll. Technisch
                    schoon, visueel strak, klaar om te ranken.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-bold text-white">
                      Plan intake
                    </span>
                    <span className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-bold text-slate-700">
                      Bekijk behandelingen
                    </span>
                  </div>
                </div>
                <div className="relative min-h-[220px] bg-gradient-to-br from-slate-800 via-slate-700 to-[#FF5722]/80 p-5 sm:min-h-full sm:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
                  <div className="relative mt-auto flex h-full flex-col justify-end">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-100/90">
                      Clinic Edition
                    </p>
                    <p className="mt-1 text-base font-extrabold text-white">
                      High-end kliniek UI
                    </p>
                    <p className="mt-1 text-xs text-white/75">
                      Schema · snelheid · Maps
                    </p>
                  </div>
                </div>
              </div>
              <figcaption className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/80 text-center">
                {[
                  { k: "Design", v: "Kliniekniveau" },
                  { k: "Techniek", v: "Google-ready" },
                  { k: "Ranking", v: "Zo hoog mogelijk" },
                ].map((item) => (
                  <div key={item.k} className="px-2 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                      {item.k}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-900">
                      {item.v}
                    </p>
                  </div>
                ))}
              </figcaption>
            </figure>

            <p className="mt-3 text-center text-xs text-slate-500 sm:text-left">
              Vanaf {fromMonthly}
              {launchPromo ? (
                <>
                  {" "}
                  · launch{" "}
                  <span className="text-slate-400 line-through">
                    {formatVerticalMoney(launchPromo.was)}
                  </span>{" "}
                  <span className="font-semibold text-[#FF5722]">€0</span>
                </>
              ) : null}
              {" "}
              · maandelijks opzegbaar
              <span className="block pt-1 text-[11px] font-semibold text-slate-600">
                {cfg.pricing.includedInfraNote}
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
