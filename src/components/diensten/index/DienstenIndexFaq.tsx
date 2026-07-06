import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_FAQ } from "@/data/diensten-index";

export function DienstenIndexFaq() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2
            id="diensten-faq-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Vragen over het aanbod
          </h2>
          <p className="mt-2 text-slate-600">
            Kort en eerlijk. Geen salespraat. Staat je vraag er niet tussen?
            Stel hem via contact of de intake.
          </p>
        </Reveal>
        <div className="mt-8">
          <DienstFAQ items={[...DIENSTEN_FAQ]} idPrefix="diensten-index" />
        </div>
      </div>
    </section>
  );
}
