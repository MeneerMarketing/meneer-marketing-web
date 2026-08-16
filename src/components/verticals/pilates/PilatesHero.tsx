"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
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
    "Hoi! Ik heb een Pilates studio en wil weten of jullie mijn stad nog vrij hebben.",
  ) ?? "/contact";

const studioWins = [
  {
    icon: Sparkles,
    label: "Voelt als jouw studio",
    hint: "Logo, kleuren en sfeer. Geen standaard template.",
  },
  {
    icon: MapPin,
    label: "Gevonden in jouw stad",
    hint: "Mensen zoeken Pilates bij jou in de buurt. Jij staat bovenaan.",
  },
  {
    icon: CalendarCheck,
    label: "Boeken zonder gedoe",
    hint: "Van je site naar je rooster. Geen eindeloos appen.",
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
              Voor Pilates studio&apos;s
            </p>
            {launchPromo ? (
              <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {launchPromo.badge}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-balance text-[2.35rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3rem] lg:leading-[1.06]">
            Ze zoeken Pilates in jouw stad.
            <span className="mt-1 block text-[#FF5722]">
              Jij wilt dat ze bij jou boeken.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-200 sm:text-base">
            Ik bouw je website, zorg dat je studio gevonden wordt en koppel je
            boekingssysteem. Jij runt de les. Ik regel het digitale stuk. Geen
            technisch gedoe, geen template-winkel.
          </p>

          <ul className="mt-6 space-y-3.5">
            {studioWins.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#FF5722]">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-300">
                      {item.hint}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-slate-200">
            <span className="font-bold text-white">Vanaf {fromMonthly}/maand</span>
            {launchPromo ? (
              <>
                {" "}
                · start nu{" "}
                <span className="font-semibold text-orange-300">gratis</span>
                <span className="text-slate-400 line-through">
                  {" "}
                  ({formatVerticalMoney(launchPromo.was)} launch)
                </span>
              </>
            ) : null}
            <span className="text-slate-400"> · één studio per stad</span>
          </p>

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
                Ik wil graag starten
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
              Eerst even overleggen
            </a>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400 lg:mt-auto lg:pt-4">
            Bel, mail of WhatsApp. Meestal dezelfde dag terug.{" "}
            <a
              href="#pakketten"
              className="font-semibold text-orange-200/90 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
            >
              Bekijk pakketten
            </a>
            {" · "}
            <a
              href={cfg.demo.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", { location: "hero" })
              }
              className="font-semibold text-orange-200/90 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
            >
              Live demo
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex h-full">
          <div className="relative flex h-full w-full flex-col">
            <div className="absolute -left-2 top-[14%] z-20 hidden flex-col gap-3 sm:flex lg:-left-6">
              <div className="flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
                <Search className="size-3.5 shrink-0 text-sky-300" aria-hidden />
                <span className="text-xs font-semibold text-slate-100">
                  Pilates studio · jouw stad
                </span>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-400/25 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
                <span
                  className="size-2 shrink-0 rounded-full bg-emerald-400"
                  aria-hidden
                />
                <span className="text-xs font-semibold text-slate-100">
                  Supersnel op mobiel
                </span>
              </div>
            </div>
            <div className="absolute -right-1 bottom-[26%] z-20 hidden rotate-[4deg] sm:block lg:-right-4">
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
                    jouwstudio.nl · lessen · boeken
                  </span>
                </span>
              </div>
              <div className="relative min-h-[240px] flex-1 bg-slate-800 sm:min-h-[280px] lg:min-h-0">
                <Image
                  src={cfg.caseStudy.imageSrc}
                  alt="Voorbeeld van een Pilates studio website"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="grid shrink-0 grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-950/95 text-center">
                {[
                  { step: "Gevonden", hint: "In Google & Maps" },
                  { step: "Vertrouwen", hint: "Jouw studio-sfeer" },
                  { step: "Geboekt", hint: "Proefles in rooster" },
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
              Live voorbeeld · Hills Pilates · website, boeken en app in één lijn
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
