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

const PROOF_POINTS = [
  "High-end · jouw branding",
  "Salonized · intake in één klik",
  "Technisch perfect · snel en veilig",
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

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-x-16 lg:px-8 lg:py-20">
        <Reveal className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 ring-1 ring-white/10">
              <InteractiveLogo className="size-7 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight text-white">
                Meneer Marketing
              </span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200/80 sm:text-[11px]">
              Voor huidklinieken &amp; cosmetische klinieken
            </span>
          </div>

          <h1 className="mt-6 text-[1.65rem] font-extrabold leading-[1.08] tracking-tighter sm:text-[2.2rem] lg:text-[2.65rem] lg:leading-[1.06]">
            <span className="block text-white">Huidkliniek website.</span>
            <span className="mt-1 block text-[#FF8A5B] sm:mt-1.5">
              High-end. Jouw stijl. Intakes die boeken.
            </span>
          </h1>

          <p className="mt-4 text-[15px] leading-snug text-slate-300 sm:text-base">
            From scratch in jouw merk. Salonized erop. Klaar om te laten zien wie jij bent.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {PROOF_POINTS.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-200 sm:text-[13px]"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
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
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-7 py-4 text-sm font-bold tracking-tight text-white shadow-[0_18px_44px_-14px_rgba(255,87,34,0.75)] transition hover:-translate-y-0.5 hover:bg-[#ff6a3d] sm:w-auto sm:text-base"
              >
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
                trackHuidkliniekEvent("huidkliniek_demo_click", {
                  location: "hero_contact",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold tracking-tight text-white backdrop-blur-sm transition hover:border-white/45 hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden />
              Eerst even sparren
            </a>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 sm:text-xs">
            Live binnen 5 werkdagen · vanaf €89/m ex. btw · incl. hosting &amp;
            domein · maandelijks opzegbaar
            {launchPromo ? ` · ${launchPromo.badge.toLowerCase()}` : ""}
          </p>

          <Link
            href="/over"
            className="group mt-8 flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#FF5722]/45 hover:bg-white/[0.07]"
          >
            <InteractiveLogo className="size-10 shrink-0" interactive={false} />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200/70">
                Wie dit voor je bouwt
              </span>
              <span className="mt-1 block text-[13px] font-semibold leading-snug text-slate-200">
                Eén vast aanspreekpunt. Ik bouw je site, ik regel je Google, en ik neem
                zelf op als je belt.
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#FF8A5B]">
                Lees wie ik ben
                <ArrowRight
                  className="size-3.5 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 lg:justify-self-end">
          <div className="mx-auto w-full max-w-[430px]">
            <HuidkliniekHeroSearchStory />

            <p className="mt-4 w-full text-[14px] leading-relaxed text-slate-300 sm:text-[15px]">
              Ik bouw een Google-technisch perfecte kliniekwebsite in jouw stijl. Clinical-grade,
              snel, premium. Patiënten vinden jou, vertrouwen wat ze zien, en boeken intake via
              Salonized. Jij krijgt een site die voelt als jouw kliniek, en een agenda die voller
              loopt.
            </p>

            <p className="mt-3 w-full text-[12px] leading-relaxed text-slate-400">
              Zo ziet het eruit als het klopt.
              {caseStudy.enabled ? (
                <>
                  {" "}
                  Dit draait live bij{" "}
                  <Link
                    href={caseStudy.href}
                    className="font-bold text-white underline decoration-white/30 underline-offset-2 transition hover:decoration-[#FF5722]"
                  >
                    {caseStudy.client} in {caseStudy.city}
                  </Link>
                  .
                </>
              ) : (
                " Premium design, direct boeken, techniek die meegroeit."
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
