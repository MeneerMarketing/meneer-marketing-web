"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";

import { Magnetic } from "@/components/effects/Magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HuidkliniekHeroSearchStory } from "@/components/verticals/huidklinieken/HuidkliniekHeroSearchStory";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";

const cfg = HUIDKLINIEKEN_VERTICAL;
const launchPromo = getActiveLaunchPromo(cfg.pricing);
const caseStudy = cfg.caseStudy;

const PROOF_POINTS = ["From scratch", "Salonized erop", "5 dagen live"] as const;

const TRUST_POINTS = [
  "€89/m ex. btw",
  "Hosting incl.",
  "Opzegbaar per maand",
] as const;

export function HuidkliniekHero() {
  useEffect(() => {
    trackHuidkliniekEvent("huidkliniek_page_view");
  }, []);

  return (
    <header className="relative isolate overflow-hidden bg-[#0A0F1C] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 -top-32 size-[30rem] rounded-full bg-[#FF5722]/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 size-[26rem] rounded-full bg-orange-500/10 blur-[110px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-x-14 lg:px-8 lg:py-20">
        <Reveal className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 ring-1 ring-white/10">
              <InteractiveLogo className="size-7 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight text-white">
                Meneer Marketing
              </span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200/80 sm:text-[11px]">
              Voor huidklinieken
            </span>
          </div>

          <h1 className="mt-5 text-[clamp(1.55rem,4.2vw,2.55rem)] font-extrabold leading-[1.08] tracking-tighter">
            <span className="block text-white">Huidkliniek website.</span>
            <span className="mt-1 block text-[#FF8A5B]">
              Premium. Jouw stijl. Intakes die boeken.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Ik ben Meneer Marketing. Ik bouw high-end kliniekwebsites in jouw stijl, koppel
            Salonized, en maak alles technisch perfect. Jij krijgt één aanspreekpunt. Patiënten
            krijgen een site waar ze vertrouwen en direct intake plannen.
          </p>

          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3">
            {PROOF_POINTS.map((point) => (
              <li
                key={point}
                className="inline-flex items-center justify-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-slate-100 sm:justify-center sm:px-2 sm:text-[11px] lg:text-[12px]"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Magnetic strength={10} radius={160}>
              <a
                href="#aanvraag"
                onClick={() => {
                  sessionStorage.setItem("lge-interest", "studio-edition");
                  trackHuidkliniekEvent("huidkliniek_package_select", {
                    location: "hero_cta",
                    package: "studio-edition",
                  });
                }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-6 py-3.5 text-sm font-bold tracking-tight text-white shadow-[0_18px_44px_-14px_rgba(255,87,34,0.75)] transition hover:-translate-y-0.5 hover:bg-[#ff6a3d] sm:w-auto sm:px-7 sm:py-4"
              >
                Start intake
                <ArrowUpRight
                  className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </Magnetic>
            <a
              href="#eerlijk-prijs"
              onClick={() =>
                trackHuidkliniekEvent("huidkliniek_demo_click", {
                  location: "hero_contact",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold tracking-tight text-white backdrop-blur-sm transition hover:border-white/45 hover:bg-white/10 sm:w-auto sm:py-4"
            >
              <MessageCircle className="size-4" aria-hidden />
              Even sparren
            </a>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:flex lg:flex-nowrap lg:items-center lg:gap-x-4">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="text-[11px] font-medium text-slate-400 sm:text-xs">
                {point}
              </li>
            ))}
            {launchPromo ? (
              <li className="text-[11px] font-bold text-[#FF8A5B] sm:text-xs">
                {launchPromo.badge}
              </li>
            ) : null}
          </ul>

          <Link
            href="/over"
            className="group mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:border-[#FF5722]/45 hover:bg-white/[0.07] sm:mt-7"
          >
            <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-orange-200/70">
                Wie ik ben
              </span>
              <span className="mt-0.5 block text-[13px] font-semibold leading-snug text-slate-200">
                Eén persoon. Site, Google, Salonized. Ik neem zelf op als je belt.
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-[#FF8A5B] transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 lg:justify-self-end">
          <div className="mx-auto w-full max-w-[430px]">
            <HuidkliniekHeroSearchStory />

            <p className="mt-4 w-full text-center text-[12px] leading-relaxed text-slate-400 lg:text-left">
              Zo ziet het eruit: gevonden, vertrouwd, geboekt.
              {caseStudy.enabled ? (
                <>
                  {" "}
                  Live bij{" "}
                  <Link
                    href={caseStudy.href}
                    className="font-bold text-slate-200 underline decoration-white/25 underline-offset-2 transition hover:text-white hover:decoration-[#FF5722]"
                  >
                    {caseStudy.client}
                  </Link>
                  .
                </>
              ) : null}
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
