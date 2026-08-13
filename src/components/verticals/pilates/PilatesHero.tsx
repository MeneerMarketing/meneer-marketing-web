"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ArrowUpRight, Mail, MessageCircle, Phone, Search } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import {
  businessEmailDisplay,
  getContactChannels,
  mailtoHref,
  telHref,
  whatsappHref,
} from "@/lib/contact";
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
const phoneLink = telHref();
const mailLink = mailtoHref({
  subject: "Pilates studio · intake",
  body: "Hoi,\n\nIk wil graag even sparren over mijn Pilates studio.\n\n",
});

export function PilatesHero() {
  useEffect(() => {
    trackPilatesEvent("pilates_page_view");
  }, []);

  const channels = getContactChannels();

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

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
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

          <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-[3.45rem] lg:leading-[1.0]">
            Ze zoeken Pilates.
            <br />
            <span className="text-[#FF5722]">Jij vangt de boeking.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Website, lokale vindbaarheid en boekingsflow in één traject. Jij
            praat rechtstreeks met mij. Remote buddy, meestal dezelfde dag
            terug. Bel, mail of WhatsApp: jij kiest.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold tracking-tight text-white backdrop-blur-md transition hover:border-emerald-300/50 hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="size-4 text-emerald-300" aria-hidden />
              Of app me. Ik zit klaar.
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Eerst even rondkijken?{" "}
            <a
              href={cfg.demo.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", { location: "hero" })
              }
              className="font-semibold text-orange-200 underline decoration-orange-200/40 underline-offset-2 hover:text-white"
            >
              Open de live Pilates demo
            </a>
            .
          </p>

          {/* Buddy contact strip */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
              Jouw remote marketing maatje
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Ik werk remote en reageer snel. Jij kiest hoe we schakelen. Ik
              regel wat jij nodig hebt.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={mailLink}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <Mail className="size-3.5 text-sky-300" aria-hidden />
                {businessEmailDisplay}
              </a>
              {phoneLink ? (
                <a
                  href={phoneLink}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  <Phone className="size-3.5 text-orange-300" aria-hidden />
                  {channels.find((c) => c.id === "phone")?.action ?? "Bel me"}
                </a>
              ) : null}
              <a
                href={whatsappLink}
                target={whatsappLink.startsWith("http") ? "_blank" : undefined}
                rel={
                  whatsappLink.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-white transition hover:border-emerald-300/50 hover:bg-emerald-500/15"
              >
                <MessageCircle className="size-3.5 text-emerald-300" aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-5">
            {[
              { label: "Ervaring", value: "12+ jaar" },
              { label: "Reactie", value: "Meestal snel" },
              { label: "Stack", value: "Site · SEO · Ads" },
              { label: "Model", value: "1 studio / stad" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-sm font-extrabold tracking-tight text-white sm:text-base">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
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
                  <span className="truncate">jouwstudio.nl · lessen · boeken</span>
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
              .
            </p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
