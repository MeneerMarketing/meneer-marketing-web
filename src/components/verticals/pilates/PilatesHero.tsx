"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowUpRight,
  MessageCircle,
  Rocket,
  Search,
} from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PilatesHeroBoostStory } from "@/components/verticals/pilates/PilatesHeroBoostStory";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";

const cfg = PILATES_VERTICAL;
const launchPromo = getActiveLaunchPromo(cfg.pricing);

export function PilatesHero() {
  useEffect(() => {
    trackPilatesEvent("pilates_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden border-b border-[#e64a19] bg-[#FF5722] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-0 size-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-x-16 lg:gap-y-8 lg:px-8 lg:py-16 xl:gap-x-20">
        <Reveal className="min-w-0 lg:max-w-[34rem]">
          <div className="flex flex-wrap items-center gap-2.5">
            <InteractiveLogo className="size-8 shrink-0" interactive={false} />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-50 sm:text-[11px]">
              Pilates & yoga studio&apos;s
            </p>
            {launchPromo ? (
              <span className="rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white sm:text-[10px]">
                Start zonder launchfee
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-[1.75rem] font-extrabold leading-[1.06] tracking-tight text-balance sm:text-[2.35rem] lg:text-[2.65rem] lg:leading-[1.04]">
            <span className="block text-white">Meer leden voor jouw studio.</span>
            <span className="mt-1 block text-white/95">
              Strak online. Hoog in Google.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-orange-50 sm:text-[15px]">
            Ik bouw je site from scratch, zorg dat je studio bovenaan staat bij Pilates
            + jouw stad, en stuur alles op proeflessen die blijven hangen. Jij geeft
            les. Ik regel het stuk dat leden binnenbrengt.
          </p>

          <PilatesHeroBoostStory />

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Magnetic strength={10} radius={160}>
              <a
                href="#aanvraag"
                onClick={() => {
                  sessionStorage.setItem("lge-interest", "studio-edition");
                  trackPilatesEvent("pilates_package_select", {
                    location: "hero_cta",
                    package: "studio-edition",
                  });
                }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#FF5722] shadow-[0_14px_36px_-12px_rgba(12,18,34,0.28)] transition hover:-translate-y-0.5 hover:bg-orange-50 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
              >
                <Rocket className="size-4" aria-hidden />
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden />
              Eerst even sparren
            </a>
          </div>

          <p className="mt-3 text-[11px] text-orange-100/85">
            <a
              href="#pakketten"
              className="font-semibold text-white underline decoration-white/35 underline-offset-2 hover:decoration-white"
            >
              Drie pakketten
            </a>{" "}
            · live binnen 5 werkdagen · maandelijks opzegbaar
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative min-w-0 lg:justify-self-end">
          <figure className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[1.25rem] border border-white/20 bg-slate-950 shadow-[0_28px_70px_rgba(12,18,34,0.42)] lg:rotate-[0.5deg]">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-900/95 px-3 py-2">
              <span className="size-1.5 rounded-full bg-rose-400/80 sm:size-2" />
              <span className="size-1.5 rounded-full bg-amber-400/80 sm:size-2" />
              <span className="size-1.5 rounded-full bg-emerald-400/80 sm:size-2" />
              <span className="ml-1.5 flex min-w-0 flex-1 items-center gap-1 truncate rounded-md bg-white/5 px-2 py-0.5 text-[9px] text-slate-400 sm:text-[10px]">
                <Search className="size-2.5 shrink-0 sm:size-3" aria-hidden />
                <span className="truncate">pilates apeldoorn · hillsstudio.nl</span>
              </span>
            </div>

            <div className="relative aspect-[4/3] max-h-[300px] bg-slate-800 sm:max-h-[320px]">
              <Image
                src={cfg.caseStudy.imageSrc}
                alt="Pilates studio website, Hills Pilates Apeldoorn"
                fill
                priority
                quality={92}
                sizes="(max-width: 1024px) 92vw, 440px"
                className="object-cover object-[center_28%]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"
                aria-hidden
              />

              <div className="absolute left-3 top-3 rounded-lg border border-white/15 bg-slate-950/85 px-2 py-1 backdrop-blur-sm">
                <p className="text-[8px] font-bold uppercase tracking-wider text-orange-300 sm:text-[9px]">
                  Custom build
                </p>
                <p className="text-[10px] font-bold text-white sm:text-[11px]">
                  Hills Pilates
                </p>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/90 px-2.5 py-1.5 backdrop-blur-md">
                <Search className="size-3 shrink-0 text-sky-300" aria-hidden />
                <span className="text-[10px] font-bold text-white sm:text-xs">
                  Top 3 · Pilates Apeldoorn
                </span>
              </div>

              <div className="absolute bottom-3 right-3 rounded-lg border border-orange-400/35 bg-[#FF5722] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg sm:text-xs">
                Proefles geboekt
              </div>
            </div>

            <figcaption className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-950/95 text-center">
              {[
                { step: "Site", hint: "Studioniveau" },
                { step: "Google", hint: "Lokaal top" },
                { step: "Boeking", hint: "Meer leden" },
              ].map((item) => (
                <div key={item.step} className="px-1.5 py-2 sm:px-2 sm:py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-300">
                    {item.step}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-white sm:text-[11px]">
                    {item.hint}
                  </p>
                </div>
              ))}
            </figcaption>
          </figure>

          <p className="mt-2 text-center text-[10px] font-semibold text-orange-50/90 sm:text-[11px] lg:text-left">
            Live case · Hills Pilates
          </p>
        </Reveal>
      </div>
    </header>
  );
}
