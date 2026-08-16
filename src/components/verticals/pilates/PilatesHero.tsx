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
  Users,
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

const heroSignals = [
  { icon: MapPin, label: "Lokaal gevonden" },
  { icon: CalendarCheck, label: "Proefles boeken" },
  { icon: Users, label: "Meer leden" },
] as const;

export function PilatesHero() {
  useEffect(() => {
    trackPilatesEvent("pilates_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden border-b border-[#e64a19] bg-[#FF5722] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-20 top-10 size-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-50">
              Voor boutique Pilates studio&apos;s
            </p>
            {launchPromo ? (
              <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Start nu zonder launchfee
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-[1.85rem] font-extrabold leading-[1.08] tracking-tight text-balance sm:text-[2.75rem] lg:text-[3.05rem] lg:leading-[1.02]">
            <span className="block text-white drop-shadow-sm sm:whitespace-nowrap">
              Je studio is al strak.
            </span>
            <span className="mt-1 block text-white drop-shadow-[0_2px_12px_rgba(12,18,34,0.35)] sm:whitespace-nowrap">
              Ik zorg voor{" "}
              <span className="underline decoration-white/40 decoration-[3px] underline-offset-[6px]">
                nieuwe leden
              </span>
              .
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-orange-50 sm:text-base">
            Minder lege reformers, meer proeflessen uit Google. Ik bouw je site
            from scratch, zorg dat je studio lokaal scoort, en stuur op boekingen.
            Jij runt de les. Ik regel het stuk dat leden binnenbrengt.
          </p>

          <PilatesHeroBoostStory />

          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/20 pt-5">
            {heroSignals.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-bold text-white"
              >
                <Icon className="size-3.5 shrink-0 text-orange-100" aria-hidden />
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
                className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-2xl rounded-bl-sm bg-white px-7 py-4 text-base font-bold tracking-tight text-[#FF5722] shadow-[0_16px_40px_-10px_rgba(12,18,34,0.25)] transition hover:-translate-y-0.5 hover:bg-orange-50 sm:w-auto"
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-4 text-sm font-bold tracking-tight text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden />
              Ik wil eerst contact
            </a>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-orange-100/90 lg:mt-auto lg:pt-4">
            Twijfel je over het pakket?{" "}
            <a
              href="#pakketten"
              className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              Bekijk de drie treden
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex h-full">
          <div className="relative flex h-full w-full flex-col">
            <figure className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] border border-white/20 bg-slate-950 shadow-[0_32px_80px_rgba(12,18,34,0.45)] lg:rotate-[0.6deg]">
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
              <div className="relative min-h-[280px] flex-1 bg-slate-800 sm:min-h-[320px] lg:min-h-[360px]">
                <Image
                  src={cfg.caseStudy.imageSrc}
                  alt="Pilates studio website, Hills Pilates Apeldoorn"
                  fill
                  priority
                  quality={92}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover object-[center_28%]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent"
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
                  { step: "Leden", hint: "Meer proeflessen" },
                  { step: "Google", hint: "Lokaal scoren" },
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

            <p className="mt-3 shrink-0 text-center text-[11px] font-semibold text-orange-50/90 sm:text-left">
              Live case · Hills Pilates · site, vindbaarheid en boekingen
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
