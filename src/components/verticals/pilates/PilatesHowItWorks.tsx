"use client";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const steps = PILATES_VERTICAL.howItWorks;

export function PilatesHowItWorks() {
  return (
    <section
      className="border-b border-slate-200 bg-[#f7fafc]"
      aria-labelledby="pilates-how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Werkwijze
          </p>
          <h2
            id="pilates-how-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Snel. Persoonlijk. Duidelijk.
          </h2>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Intake past op één koffie. Daarna bouw ik door. Jij weet waar je
            aan toe bent.
          </p>
        </Reveal>

        <ol className="mt-12">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.04}>
                <div className="group grid gap-3 border-t border-slate-200 py-7 transition hover:bg-white/70 sm:grid-cols-[2.5rem_minmax(0,1fr)_1.3fr] sm:gap-6 sm:py-8">
                  <span
                    className="font-extrabold text-[#FF5722]/80"
                    aria-hidden
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
