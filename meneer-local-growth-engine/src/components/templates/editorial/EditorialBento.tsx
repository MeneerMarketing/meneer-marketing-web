import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialFigure } from "@/components/templates/editorial/EditorialFigure";
import {
  EditorialPose,
  posesForLabels,
} from "@/components/templates/editorial/EditorialPose";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";

interface Props {
  bento: EditorialModel["bento"];
  heading: string;
}

/** Aantal cellen volgt het aantal punten. Geen lege vakken. */
const GRID_BY_COUNT: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function EditorialBento({ bento, heading }: Props) {
  const tiles = bento.tiles;
  if (tiles.length === 0) return null;

  const gridClass = GRID_BY_COUNT[Math.min(tiles.length, 4)] ?? GRID_BY_COUNT[4]!;
  const poses = posesForLabels(tiles.map((tile) => tile.title));

  return (
    <section className="border-b border-[var(--ed-line)]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <ScrollReveal>
          <p className="ed-label text-[var(--ed-accent)]">Kenmerken</p>
          <h2 className="ed-serif ed-h2 mt-4 max-w-[34ch]">{heading}</h2>
        </ScrollReveal>

        {bento.band ? (
          <ScrollReveal delayMs={80}>
            <EditorialFigure
              image={bento.band}
              parallax
              sizes="100vw"
              className="mt-10 aspect-[16/10] md:aspect-[21/9]"
            />
          </ScrollReveal>
        ) : null}

        <div
          className={`grid gap-px bg-[var(--ed-line)] ${gridClass} ${
            bento.band ? "mt-px" : "mt-12"
          }`}
        >
          {tiles.map((tile, index) => (
            <ScrollReveal
              key={tile.id}
              delayMs={index * 90}
              className="bg-[var(--ed-bg)]"
            >
              <article className="group relative flex h-full min-h-[17rem] flex-col p-7 transition-colors duration-500 md:p-8 lg:p-9 hover:bg-[var(--ed-accent-soft)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-5 h-4 w-4 border-r border-t border-[var(--ed-line-strong)] opacity-30 transition-all duration-700 ease-[var(--ease-premium)] group-hover:right-4 group-hover:top-4 group-hover:border-[var(--ed-accent)] group-hover:opacity-100"
                />

                <EditorialPose
                  name={poses[index] ?? "boat"}
                  className="h-[4.5rem] w-[4.5rem] text-[var(--ed-accent)] opacity-80 transition-all duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:opacity-100"
                />

                <h3 className="ed-serif ed-h3 mt-7">{tile.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-[var(--ed-fg-70)]">
                  {tile.description}
                </p>

                <span
                  aria-hidden
                  className="mt-7 h-px w-full origin-left scale-x-0 bg-[var(--ed-accent-line)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100"
                />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
