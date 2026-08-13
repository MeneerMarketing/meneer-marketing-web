"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  Globe2,
  MapPin,
  Megaphone,
  MessageCircle,
  Search,
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

const pageSummary = [
  {
    icon: Globe2,
    label: "Custom website",
    line: "From scratch, op jouw studio. Niet uit een template.",
  },
  {
    icon: MapPin,
    label: "Lokaal gevonden",
    line: "SEO op Pilates + jouw stad, zodat zoekers jou vinden.",
  },
  {
    icon: CalendarCheck,
    label: "Boekingsflow",
    line: "Van klik naar proefles of lidmaatschap, zonder gedoe.",
  },
  {
    icon: Megaphone,
    label: "Ads & groei",
    line: "Google Ads en Meta Ads als je wilt opschalen.",
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

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal>
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

          <h1 className="mt-5 text-[2.35rem] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.02]">
            Ze zoeken Pilates in jouw stad.
            <br />
            <span className="text-[#FF5722]">Ik zorg dat ze bij jou boeken.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Website from scratch, lokale SEO op Pilates + jouw stad, en een
            boekingsflow die klopt. Optioneel Google Ads of Meta Ads erbij.
            Vanaf {fromMonthly} per maand
            {launchPromo ? (
              <>
                , launch tijdelijk{" "}
                <span className="font-semibold text-orange-200">€0</span>
              </>
            ) : null}
            . Eén partner per stad. Je praat rechtstreeks met mij.
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
                Check of mijn stad vrij is
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

          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Bel, mail of WhatsApp. Meestal dezelfde dag terug.{" "}
            <a
              href={cfg.demo.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", { location: "hero" })
              }
              className="font-semibold text-orange-200/90 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
            >
              Bekijk de live demo
            </a>
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pageSummary.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-tight text-white">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {item.line}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
            <div className="absolute -left-2 top-14 z-20 hidden rotate-[-6deg] sm:block lg:-left-8 lg:top-16">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
                <Search className="size-3.5 text-sky-300" aria-hidden />
                <span className="text-xs font-semibold text-slate-100">
                  Reformer Pilates + stad
                </span>
              </div>
            </div>
            <div className="absolute -right-1 bottom-24 z-20 hidden rotate-[4deg] sm:block lg:-right-6">
              <div className="rounded-xl border border-orange-400/30 bg-[#FF5722] px-3 py-2 text-xs font-bold text-white shadow-xl">
                Proefles geboekt
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-slate-950 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-900/95 px-3 py-2.5">
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
              <div className="relative aspect-[4/3] bg-slate-800">
                <Image
                  src={cfg.caseStudy.imageSrc}
                  alt="High-end Pilates studio website"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-950/95 text-center">
                {[
                  { step: "Google", hint: "Gevonden" },
                  { step: "Website", hint: "Overtuigd" },
                  { step: "Rooster", hint: "Geboekt" },
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

            <p className="mt-4 text-center text-xs text-slate-400 sm:text-left">
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
              · 1 studio per stad
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
