"use client";

import Link from "next/link";
import { ArrowDown, Globe, Search, TrendingUp } from "lucide-react";

import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const launchPromo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

const BOOST_STEPS = [
  {
    icon: Globe,
    title: "Ik bouw jouw site",
    text: "From scratch in jouw branding. Lessen, tarieven, proefles. Voelt als je studio op de vloer.",
  },
  {
    icon: Search,
    title: "Google leert je kennen",
    text: "Pilates + jouw stad. Pagina's, Maps, structuur. Gevonden worden als iemand zoekt.",
  },
  {
    icon: TrendingUp,
    title: "Je rooster vult",
    text: "Van zoekopdracht naar proefles, van proefles naar lid. Daar stuur ik op. Jij runt de les.",
  },
] as const;

export function PilatesHeroBoostStory() {
  return (
    <div className="relative mt-8">
      <article className="overflow-hidden rounded-[1.35rem] border border-white/25 bg-white shadow-[0_24px_60px_-20px_rgba(12,18,34,0.35)] ring-1 ring-white/40">
        <div className="flex items-start gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-4 py-4 sm:px-5">
          <InteractiveLogo className="size-11 shrink-0" interactive={false} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C]">
              Zo boost ik jouw studio
            </p>
            <p className="mt-1 text-[15px] font-bold leading-snug text-slate-900">
              Jij focust op reformers. Ik fix online vindbaarheid, vertrouwen en
              boekingen.
            </p>
            {launchPromo ? (
              <p className="mt-2 inline-flex rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {launchPromo.badge}
              </p>
            ) : null}
          </div>
        </div>

        <ol className="divide-y divide-slate-100">
          {BOOST_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex gap-3.5 px-4 py-4 sm:px-5 sm:py-4"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722] ring-1 ring-[#FF5722]/15">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold tracking-tight text-slate-900">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-slate-600">
                    {step.text}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="border-t border-dashed border-slate-200 bg-slate-50/80 px-4 py-3.5 sm:px-5">
          <p className="text-xs leading-relaxed text-slate-600">
            Prijs, pakketten en het volledige bonnetje?{" "}
            <Link
              href="#eerlijk-prijs"
              className="inline-flex items-center gap-1 font-bold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2 hover:text-orange-600"
            >
              Eerlijk over de prijs
              <ArrowDown className="size-3" aria-hidden />
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
