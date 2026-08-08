import { Layers, Sparkles, Target } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import {
  STRATEGY_MANIFESTO,
  type DienstStrategicContent,
} from "@/data/dienst-strategic";

interface DienstStrategyBlocksProps {
  dienstName: string;
  strategic: DienstStrategicContent & { pillarLens: string };
}

export function DienstStrategyBlocks({
  dienstName,
  strategic,
}: DienstStrategyBlocksProps) {
  return (
    <>
      <Reveal>
        <div className="rounded-3xl border border-mm-accent/25 bg-mm-accent-subtle/50 p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-mm-accent">
            <Sparkles className="size-4" aria-hidden />
            Hoe ik werk
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-mm-text sm:text-3xl">
            {STRATEGY_MANIFESTO.title}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-mm-muted">
            {STRATEGY_MANIFESTO.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 rounded-3xl border border-mm-sky/30 bg-mm-sky-subtle/40 p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-mm-sky-deep">
            <Layers className="size-4" aria-hidden />
            Lens op dit blok
          </p>
          <p className="mt-4 text-lg leading-relaxed text-mm-text">
            {strategic.pillarLens}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="mt-14" aria-labelledby="deep-dive-heading">
          <h2
            id="deep-dive-heading"
            className="text-2xl font-extrabold text-mm-text sm:text-3xl"
          >
            {strategic.deepTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-mm-text">
            {strategic.deepLead}
          </p>
          <p className="mt-4 text-base leading-relaxed text-mm-muted">
            {strategic.deepExtended}
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-14" aria-labelledby="signals-heading">
          <h2
            id="signals-heading"
            className="flex items-center gap-2 text-2xl font-extrabold text-mm-text"
          >
            <Target className="size-7 text-mm-sky-deep" aria-hidden />
            Waar ik bij jou naar kijk
          </h2>
          <p className="mt-2 text-sm text-mm-muted">
            Echte vragen. De dingen die bepalen welke route voor{" "}
            <span className="font-semibold text-mm-text">{dienstName}</span> het
            slimst is.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {strategic.signals.map((s) => (
              <li
                key={s}
                className="rounded-2xl border border-mm-border bg-mm-surface-elevated px-4 py-4 text-sm font-medium leading-snug text-mm-text shadow-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="mt-14" aria-labelledby="scenarios-heading">
          <h2
            id="scenarios-heading"
            className="text-2xl font-extrabold text-mm-text sm:text-3xl"
          >
            Typische situaties. Elke uitwerking anders
          </h2>
          <p className="mt-2 text-mm-muted">
            Drie voorbeelden van context; jouw mix is zelden identiek. In een
            gesprek vertaal ik dit naar jouw niche, team en tempo.
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {strategic.scenarios.map((sc) => (
              <li
                key={sc.title}
                className="flex flex-col rounded-2xl border border-mm-border bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-mm-text">{sc.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mm-muted">
                  {sc.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </>
  );
}
