"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const launchPromo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

const BOOST_FLOW = [
  {
    kicker: "Eerst vertrouwen",
    title: "Site die verkoopt",
    text: "From scratch, jouw vibe. Bezoeker denkt meteen: dit is dé studio hier.",
    tilt: "-1.2deg",
  },
  {
    kicker: "Dan vindbaarheid",
    title: "Google stuurt ze door",
    text: "Pilates + jouw stad. Jouw pagina, niet die van de studio om de hoek.",
    tilt: "0.8deg",
  },
  {
    kicker: "Dan groei",
    title: "Nieuwe leden",
    text: "Zoekopdracht → proefles → vaste plek op de mat. Daar stuur ik op.",
    tilt: "-0.6deg",
  },
] as const;

export function PilatesHeroBoostStory() {
  return (
    <div className="relative mt-8">
      <article className="overflow-hidden rounded-[1.35rem] border border-white/30 bg-white/95 shadow-[0_24px_60px_-20px_rgba(12,18,34,0.4)] ring-1 ring-white/50 backdrop-blur-sm">
        <div className="flex items-start gap-3 border-b border-orange-100/80 bg-gradient-to-r from-[#FF5722]/10 via-orange-50 to-white px-4 py-4 sm:px-5">
          <InteractiveLogo className="size-11 shrink-0" interactive={false} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C]">
              Jouw groeiplan
            </p>
            <p className="mt-1 text-[15px] font-bold leading-snug text-slate-900">
              Ik help je studio online nieuwe leden binnenhalen. Jij lesgeeft, ik
              regel site, Google en conversie.
            </p>
            {launchPromo ? (
              <p className="mt-2 inline-flex rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {launchPromo.badge}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-2">
          {BOOST_FLOW.map((step, index) => (
            <div key={step.title} className="contents">
              <div
                className="relative flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-slate-200/90 bg-[#fffef9] p-3.5 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] sm:p-4"
                style={{ transform: `rotate(${step.tilt})` }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                  {step.kicker}
                </p>
                <div>
                  <p className="text-[15px] font-extrabold leading-tight tracking-tight text-slate-900">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-snug text-slate-600">
                    {step.text}
                  </p>
                </div>
              </div>
              {index < BOOST_FLOW.length - 1 ? (
                <div
                  className="hidden items-center justify-center text-[#FF5722] lg:flex"
                  aria-hidden
                >
                  <ArrowRight className="size-4 shrink-0" strokeWidth={2.8} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-slate-200 bg-slate-50/90 px-4 py-3.5 sm:px-5">
          <p className="text-xs leading-relaxed text-slate-600">
            Prijs en bonnetje staan bij{" "}
            <Link
              href="#eerlijk-prijs"
              className="inline-flex items-center gap-1 font-bold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2 hover:text-orange-600"
            >
              eerlijk over de prijs
              <ArrowDown className="size-3" aria-hidden />
            </Link>
            . Eerst weten wat je krijgt? Scroll daarheen.
          </p>
        </div>
      </article>
    </div>
  );
}
