import { EditorialCount } from "@/components/templates/editorial/EditorialCount";
import {
  EditorialPose,
  posesForLabels,
} from "@/components/templates/editorial/EditorialPose";
import type { EditorialFact } from "@/components/templates/editorial/editorialModel";

interface Props {
  facts: EditorialFact[];
}

const GRID_BY_COUNT: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** Een score staat altijd op vijf, dus dat mag erbij. Verder geen toevoegingen. */
const SUFFIX: Record<string, string> = {
  rating: "/5",
};

/**
 * Espresso-band die uit de hero doorloopt. Het cijfer leidt, het label legt uit,
 * en de lijn ertussen tekent zichzelf terwijl je scrollt. Alleen cijfers die
 * echt in de snapshot staan; de 1px gap op een lijn-gekleurde ondergrond levert
 * de scheidingen, zodat er op geen enkele breedte een losse rand overblijft.
 */
export function EditorialFacts({ facts }: Props) {
  if (facts.length < 2) return null;

  const gridClass = GRID_BY_COUNT[Math.min(facts.length, 4)] ?? GRID_BY_COUNT[4]!;
  const poses = posesForLabels(facts.map((fact) => fact.label));

  return (
    <section className="ed-deep relative overflow-hidden">
      <span
        aria-hidden
        className="ed-glow-left pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <dl className={`grid gap-px bg-[var(--ed-line)] ${gridClass}`}>
          {facts.map((fact, index) => (
            <div
              key={fact.id}
              className="group relative flex flex-col overflow-hidden bg-[var(--ed-bg)] px-5 py-11 transition-colors duration-500 md:px-8 md:py-14 hover:bg-[var(--ed-bg-raised)]"
            >
              <EditorialPose
                name={poses[index] ?? "boat"}
                className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 text-[var(--ed-fg)] opacity-[0.06] transition-all duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:opacity-[0.15] md:h-32 md:w-32"
              />

              <dd className="ed-serif relative order-1 flex items-baseline gap-2 text-[clamp(2.8rem,4.2vw,4rem)] leading-[0.88] tracking-[-0.022em] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1">
                <EditorialCount value={fact.value} />
                {SUFFIX[fact.id] ? (
                  <span className="pb-1.5 text-[0.85rem] font-medium tracking-[0.1em] text-[var(--ed-accent)]">
                    {SUFFIX[fact.id]}
                  </span>
                ) : null}
              </dd>

              <div className="relative order-2 mt-7 h-px w-full overflow-hidden">
                <span
                  aria-hidden
                  className="ed-draw absolute inset-0 origin-left bg-[var(--ed-line-strong)]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-[var(--ed-accent)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100"
                />
              </div>

              <dt className="ed-label relative order-3 mt-5 text-[var(--ed-fg-52)] transition-colors duration-500 group-hover:text-[var(--ed-accent)]">
                {fact.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
