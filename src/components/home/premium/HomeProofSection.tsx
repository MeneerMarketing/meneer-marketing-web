import { Reveal } from "@/components/effects/Reveal";
import { PillarProofPanel } from "@/components/pillars/premium/PillarProofPanel";
import { HOME_PROOF } from "@/data/home-premium";

export function HomeProofSection() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <PillarProofPanel
            title={HOME_PROOF.title}
            body={HOME_PROOF.body}
            metrics={[...HOME_PROOF.metrics]}
            featuredHref={HOME_PROOF.featuredHref}
            featuredLabel={HOME_PROOF.featuredLabel}
          />
        </Reveal>
      </div>
    </section>
  );
}
