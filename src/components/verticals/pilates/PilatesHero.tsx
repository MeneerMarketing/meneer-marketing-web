"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Rocket,
  Search,
  Sparkles,
} from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PilatesHeroPriceEntrance } from "@/components/verticals/pilates/PilatesHeroPriceEntrance";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";

const cfg = PILATES_VERTICAL;
const launchPromo = getActiveLaunchPromo(cfg.pricing);

const heroSignals = [
  { icon: MapPin, label: "Gevonden in jouw stad" },
  { icon: CalendarCheck, label: "Proefles direct boeken" },
  { icon: Sparkles, label: "Voelt als jóuw studio" },
] as const;

export function PilatesHero() {
  useEffect(() => {
    trackPilatesEvent("pilates_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden border-b border-slate-200 bg-[#0c1222] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,87,34,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: "#0c1222",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Voor boutique Pilates studio&apos;s
            </p>
            {launchPromo ? (
              <span className="rounded-full border border-[#FF5722]/40 bg-[#FF5722]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-200">
                Start nu zonder launchfee
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-[1.85rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3.05rem] lg:leading-[1.02]">
            <span className="block text-white sm:whitespace-nowrap">
              Je studio is al strak.
            </span>
            <span className="mt-1 block text-[#FF5722] sm:whitespace-nowrap">
              Pagina 1 in Google.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Je reformer staat niet stil. Waarom zou je site dat wel doen? Ik bouw
            from scratch, zorg dat je studio gevonden wordt, en stuur op
            proeflessen en leden. Jij runt de les. Ik regel het digitale stuk.
          </p>

          <PilatesHeroPriceEntrance />

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5">
            {heroSignals.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-300"
              >
                <Icon className="size-3.5 shrink-0 text-[#FF5722]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
            <Magnetic strength={12} radius={170}>
              <a
                href="#aanvraag"
                onClick={() => {
                  sessionStorage.setItem("lge-interest", "studio-edition");
                  trackPilatesEvent("pilates_package_select", {
                    location: "hero_cta",
                    package: "studio-edition",
                  });
                }}
                className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-2xl rounded-bl-sm bg-[#FF5722] px-7 py-4 text-base font-bold tracking-tight text-white shadow-[0_16px_40px_-10px_rgba(255,87,34,0.65)] transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_20px_44px_-10px_rgba(255,87,34,0.75)] sm:w-auto"
              >
                <Rocket
                  className="size-4 transition group-hover:-translate-y-0.5"
                  aria-hidden
                />
                Ik wil gelijk beginnen
                <ArrowUpRight
                  className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </Magnetic>
            <a
              href="#eerlijk-prijs"
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", {
                  location: "hero_contact",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/[0.07] px-5 py-4 text-sm font-bold tracking-tight text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/[0.12] sm:w-auto"
            >
              <MessageCircle className="size-4 text-emerald-300" aria-hidden />
              Ik wil eerst contact
            </a>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 lg:mt-auto lg:pt-4">
            Twijfel je over het pakket?{" "}
            <a
              href="#pakketten"
              className="font-semibold text-orange-200/90 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
            >
              Bekijk de drie treden
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex h-full">
          <div className="relative flex h-full w-full flex-col">
            <figure className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] border border-white/15 bg-slate-950 shadow-[0_32px_80px_rgba(0,0,0,0.45)] lg:rotate-[0.6deg]">
              <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-slate-900/95 px-3 py-2.5">
                <span className="size-2 rounded-full bg-rose-400/80" />
                <span className="size-2 rounded-full bg-amber-400/80" />
                <span className="size-2 rounded-full bg-emerald-400/80" />
                <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                  <Search className="size-3 shrink-0" aria-hidden />
                  <span className="truncate">
                    pilates apeldoorn · hillsstudio.nl
                  </span>
                </span>
              </div>
              <div className="relative min-h-[260px] flex-1 bg-slate-800 sm:min-h-[300px] lg:min-h-[320px]">
                <Image
                  src={cfg.caseStudy.imageSrc}
                  alt="Pilates studio website, Hills Pilates Apeldoorn"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute left-4 top-4 rotate-[-1deg] rounded-lg border border-white/15 bg-slate-950/85 px-2.5 py-1.5 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-300">
                    Custom build
                  </p>
                  <p className="text-[11px] font-bold text-white">
                    From scratch · Hills Pilates
                  </p>
                </div>
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 shadow-lg backdrop-blur-md">
                  <Search className="size-3.5 shrink-0 text-sky-300" aria-hidden />
                  <span className="text-xs font-bold text-white">
                    Pilates Apeldoorn · top 3
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-10 rotate-[2deg] rounded-xl border border-orange-400/35 bg-[#FF5722] px-3 py-2 text-xs font-bold text-white shadow-lg">
                  Proefles geboekt
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

            <p className="mt-3 shrink-0 text-center text-[11px] font-semibold text-slate-500 sm:text-left">
              Live case · design, techniek en boekingsflow in één lijn
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
