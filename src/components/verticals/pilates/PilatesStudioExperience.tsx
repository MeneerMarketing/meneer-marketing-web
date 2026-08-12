"use client";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";

const YOU_BEATS = [
  "Reformers, ruimte, licht en merkgevoel",
  "Instructors die het verschil maken",
  "De ervaring op de mat",
] as const;

const ME_BEATS = [
  "Website die voelt als jouw studio",
  "Lokaal gevonden worden op Google",
  "Boeken zonder WhatsApp-chaos",
] as const;

export function PilatesStudioExperience() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-[#f3f7fb]"
      aria-labelledby="pilates-experience-heading"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Duidelijke rolverdeling
            </p>
            <h2
              id="pilates-experience-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Jij runt de studio.
              <span className="mt-1 block text-[#FF5722]">
                Ik regel het digitale stuk.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Op de vloer is het al premium. Online moet datzelfde niveau
              landen. Anders verdwijnt de klik bij iemand die wél scherp
              overkomt.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-5">
          <Reveal delay={0.05} className="h-full">
            <Magnetic strength={8} radius={220} wobble={false}>
              <article className="group flex h-full flex-col border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Dit regel jij
                  </p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Studio
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
                  De ervaring op de vloer.
                </h3>
                <ul className="mt-6 flex-1 space-y-3.5">
                  {YOU_BEATS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-slate-700 sm:text-base"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500 transition group-hover:scale-125"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-slate-100 pt-5 text-sm font-semibold text-slate-900">
                  Dat is waar jij het verschil maakt.
                </p>
              </article>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <Magnetic strength={8} radius={220} wobble={false}>
              <article className="group flex h-full flex-col border border-slate-900 bg-slate-900 p-7 text-white transition duration-300 hover:-translate-y-1 hover:border-[#FF5722] hover:shadow-[0_20px_50px_rgba(255,87,34,0.2)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
                    Dit regel ik
                  </p>
                  <span className="rounded-full bg-[#FF5722]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-200">
                    Digitaal
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">
                  Van Google naar je rooster.
                </h3>
                <ul className="mt-6 flex-1 space-y-3.5">
                  {ME_BEATS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-slate-300 sm:text-base"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5722] transition group-hover:scale-125"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-white/10 pt-5 text-sm font-semibold text-orange-200">
                  Zodat zoekverkeer ook echt bij jou boekt.
                </p>
              </article>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="mt-6 flex flex-col gap-4 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              <span className="font-bold text-slate-900">Samen:</span> jij de
              studio, ik het systeem eromheen. Dan voelt boeken logisch.
            </p>
            <a
              href="#live-design"
              className="shrink-0 text-sm font-bold text-[#FF5722] transition hover:text-orange-700"
            >
              Bekijk de art directions →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
