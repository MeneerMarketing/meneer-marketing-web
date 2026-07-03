import { Reveal } from "@/components/effects/Reveal";
import {
  CaseSpotlight,
  CasesPreviewHeader,
} from "@/components/home/cases/CaseSpotlight";

export function CasesPreviewSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="cases-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <CasesPreviewHeader />
        </Reveal>
        <CaseSpotlight />
      </div>
    </section>
  );
}
