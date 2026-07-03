import { Reveal } from "@/components/effects/Reveal";
import { CaseSpotlight } from "@/components/home/cases/CaseSpotlight";

export function OverCasesSection() {
  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
      aria-labelledby="over-cases-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            Bewijs
          </p>
          <h2
            id="over-cases-heading"
            className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Geen stockfoto's. Wel echte trajecten.
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            SkinComplete, BestRest en Hills Pilates laten zien hoe strategie, bouw
            en marketing in de juiste volgorde samenkomen.
          </p>
        </Reveal>
        <CaseSpotlight />
      </div>
    </section>
  );
}
