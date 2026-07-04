import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CONTACT_HERO } from "@/data/contact-index";
import { siteCtas } from "@/lib/cta";

export function ContactIndexHero() {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#FF5722]/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                {CONTACT_HERO.eyebrow}
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {CONTACT_HERO.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {CONTACT_HERO.subtitle}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#formulier"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
                >
                  Naar het formulier
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
                <Link
                  href={siteCtas.startIntake.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-900"
                >
                  Plan een gesprek
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-2 border-t border-slate-200 pt-6 text-xs tracking-tight sm:gap-4 sm:text-sm">
                {CONTACT_HERO.stats.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <dt className="font-bold uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-extrabold leading-snug text-slate-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-orange-50/50 p-5 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.18)] sm:max-w-md lg:max-w-sm">
              <InteractiveLogo className="h-16 w-16 shrink-0" />
              <p className="text-sm font-bold leading-snug text-slate-800">
                {CONTACT_HERO.aside}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
