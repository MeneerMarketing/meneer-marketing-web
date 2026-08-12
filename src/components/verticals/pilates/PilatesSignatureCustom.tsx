"use client";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import { formatVerticalMoney } from "@/lib/verticals/format-price";

const sig = PILATES_VERTICAL.pricing.signatureCustom;

export function PilatesSignatureCustom() {
  return (
    <section
      id="signature-custom"
      className="relative overflow-hidden border-b border-slate-200 bg-[#0c1222] text-white"
      aria-labelledby="pilates-signature-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(115deg, rgba(255,87,34,0.18) 0%, transparent 42%), radial-gradient(ellipse 40% 60% at 100% 50%, rgba(14,165,233,0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                {sig.name}
              </p>
              <h2
                id="pilates-signature-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]"
              >
                Past je studio niet in een vakje?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                {sig.lead}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {sig.bullets.map((b) => (
                  <li
                    key={b}
                    className="border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 border border-white/15 bg-white/5 p-6 backdrop-blur-sm lg:min-w-[240px] lg:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vanaf
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">
                {formatVerticalMoney({
                  ...sig.fromPrice,
                  prefix: undefined,
                })}
              </p>
              <p className="mt-1 text-sm text-slate-400">eenmalig · from scratch</p>
              <a
                href="#aanvraag"
                onClick={() => trackPilatesEvent("pilates_custom_click")}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-orange-50 lg:w-auto"
              >
                {sig.ctaLabel}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
