import { Reveal } from "@/components/effects/Reveal";
import { PrincipleScenes } from "@/components/diensten/premium/PrincipleScenes";
import { OVER_PRINCIPLES } from "@/data/over-index";

export function OverPrinciplesSection() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="over-principles-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            Principes
          </p>
          <h2
            id="over-principles-heading"
            className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Drie dingen waar ik niet over onderhandel
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Hover of tik op een kaart. De animatie vertelt het verhaal sneller dan
            een PowerPoint.
          </p>
        </Reveal>
        <PrincipleScenes principles={[...OVER_PRINCIPLES]} />
      </div>
    </section>
  );
}
