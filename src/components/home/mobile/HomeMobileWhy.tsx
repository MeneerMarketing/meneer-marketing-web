"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_MOBILE_WHY } from "@/data/home-mobile";
import { siteCtas } from "@/lib/cta";

/** Compacte oranje why-sectie voor mobiel. */
export function HomeMobileWhy() {
  return (
    <section
      aria-labelledby="mobile-why-heading"
      className="border-b border-[#E64A19] bg-[#FF5722] py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-start gap-3">
          <InteractiveLogo className="size-11 shrink-0" interactive={false} />
          <div>
            <h2
              id="mobile-why-heading"
              className="text-xl font-extrabold leading-snug tracking-tight text-white"
            >
              {HOME_MOBILE_WHY.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Strategie, build, SEO, ads en e-mail. Ik doe het zelf. Jij hoeft niemand
              achterna te bellen.
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5">
          {HOME_MOBILE_WHY.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 rounded-xl bg-white/12 px-3.5 py-3"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              <span className="text-sm font-bold leading-snug text-white">{point}</span>
            </li>
          ))}
        </ul>

        <Link
          href={siteCtas.startIntake.href}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          Plan een gesprek
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
