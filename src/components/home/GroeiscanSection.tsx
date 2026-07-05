import Link from "next/link";
import { ArrowUpRight, Compass, Radar, Route } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { GroeiscanPreview } from "@/components/home/GroeiscanPreview";
import { siteCtas } from "@/lib/cta";

const HIGHLIGHTS = [
  {
    icon: Radar,
    title: "Groeikracht live",
    body: "Doel, stand, budget, ritme en stack. Elk antwoord telt mee in je score.",
  },
  {
    icon: Route,
    title: "Route zichtbaar",
    body: "Zie welk blok eerst logisch is: strategie, bouwen, vindbaarheid, campagnes of behoud.",
  },
  {
    icon: Compass,
    title: "Geen verplichting",
    body: "Snel beginnen, serieus eindigen. Wil je dieper? Plan daarna een echte sessie.",
  },
] as const;

export function GroeiscanSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white"
      aria-labelledby="groeiscan-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#FF5722]/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
                Groeiscan
              </p>
              <h2
                id="groeiscan-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
              >
                Waar zit jouw groei?{" "}
                <span className="text-[#FF5722]">Meet je groeikracht.</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
                Geen intake-formulier met twintig velden. Zes stappen, een score die oploopt
                en welke route logisch is. Gratis scan, daarna plan je een sessie.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={0.05 * index}>
                    <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
                        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                      </span>
                      <span>
                        <p className="text-sm font-extrabold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
                      </span>
                    </li>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={siteCtas.groeiscan.href}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF5722] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:shadow-[#FF5722]/40"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
                  />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-900">
                    Start de Groeiscan
                  </span>
                  <ArrowUpRight
                    className="relative z-10 size-5 transition-colors duration-300 group-hover:text-slate-900"
                    aria-hidden
                  />
                </Link>
                <Link
                  href={siteCtas.startIntake.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-900 transition hover:border-slate-900"
                >
                  {siteCtas.startIntake.label}
                  <ArrowUpRight className="size-5" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <GroeiscanPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
