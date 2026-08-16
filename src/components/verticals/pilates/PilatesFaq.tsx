"use client";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

/**
 * Native <details>: alle antwoorden in de SSR-HTML (schema + crawl match).
 * Geen client-only mount van antwoorden achter state.
 */
export function PilatesFaq() {
  const faqs = PILATES_VERTICAL.faq;

  return (
    <section
      id="faq"
      className="border-b border-slate-200 bg-white"
      aria-labelledby="pilates-faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            FAQ
          </p>
          <h2
            id="pilates-faq-heading"
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tighter text-slate-900 sm:text-4xl"
          >
            Vragen die studio-eigenaren écht stellen
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-x-6">
          {faqs.map((item, i) => (
            <Reveal key={item.question} delay={Math.min(i, 6) * 0.03}>
              <details
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 open:border-[#FF5722]/30 open:bg-white open:shadow-[0_12px_32px_-20px_rgba(255,87,34,0.35)]"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className="mt-1 shrink-0 text-lg font-light text-[#FF5722] transition group-open:hidden"
                    aria-hidden
                  >
                    +
                  </span>
                  <span
                    className="mt-1 hidden shrink-0 text-lg font-light text-[#FF5722] group-open:inline"
                    aria-hidden
                  >
                    −
                  </span>
                </summary>
                <p className="border-t border-slate-100 px-5 pb-5 pt-3 pr-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
