"use client";

import { ArrowRight, CalendarCheck, Globe, TrendingUp } from "lucide-react";

import { getActiveLaunchPromo } from "@/lib/verticals/format-price";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const launchPromo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

const VALUE_STRIP = [
  {
    icon: Globe,
    title: "Strak online",
    line: "Site from scratch op studioniveau",
  },
  {
    icon: TrendingUp,
    title: "Top in Google",
    line: "Pilates + jouw stad, jouw pagina",
  },
  {
    icon: CalendarCheck,
    title: "Meer leden",
    line: "Zoekopdracht wordt proefles",
  },
] as const;

export function PilatesHeroBoostStory() {
  return (
    <div className="mt-6">
      {launchPromo ? (
        <p className="mb-3 inline-flex rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {launchPromo.badge}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {VALUE_STRIP.map((item) => (
          <article
            key={item.title}
            className="flex min-h-[5.75rem] flex-col justify-between rounded-xl border border-white/25 bg-white/10 px-2.5 py-2.5 backdrop-blur-sm sm:min-h-[6rem] sm:rounded-2xl sm:px-3 sm:py-3"
          >
            <item.icon className="size-3.5 text-orange-100 sm:size-4" aria-hidden />
            <div>
              <p className="truncate text-[13px] font-extrabold leading-none tracking-tight text-white sm:text-sm">
                {item.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-orange-50/90 sm:text-[11px]">
                {item.line}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
