import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_HUB_FAQ } from "@/data/diensten-hub";

export function DienstenIndexFaq() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="diensten-faq-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            FAQ
          </p>
          <h2
            id="diensten-faq-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Kort antwoord. Geen salespraat.
          </h2>
          <p className="mt-2 text-slate-600">
            Staat je vraag er niet tussen? Stel hem via contact of de intake.
          </p>
        </Reveal>
        <div className="mt-8">
          <DienstFAQ items={[...DIENSTEN_HUB_FAQ]} idPrefix="diensten-index" />
        </div>
      </div>
    </section>
  );
}
