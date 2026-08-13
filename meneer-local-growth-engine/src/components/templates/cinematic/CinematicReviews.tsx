import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

/**
 * Ervaringen als openingsquote van een artikel: de eerste review staat groot in
 * cursieve serif, de rest volgt als kolommen onder een haarlijn. Het cijfer
 * hangt als los blok in de marge.
 */
export function CinematicReviews({ model }: Props) {
  const { reviews, city } = model;
  const [lead, ...others] = reviews.quotes;
  const rest = others.slice(0, 3);

  if (!lead) return null;

  // Kolommen volgen het aantal quotes, anders eindigt de haarlijn halverwege.
  const columns =
    rest.length >= 3 ? "lg:grid-cols-3" : rest.length === 2 ? "sm:grid-cols-2" : "";

  return (
    <section id="ervaringen" className="bg-[var(--cn-cream-2)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="lg:order-2 lg:shrink-0 lg:pt-2">
              {reviews.rating ? (
                <div className="flex items-baseline gap-4 lg:flex-col lg:items-end lg:gap-1">
                  <p className="cine-display text-[3.5rem] leading-none tabular-nums text-[var(--cn-oxblood)]">
                    {reviews.rating}
                  </p>
                  <p className="cine-label text-[var(--cn-muted)] lg:text-right">
                    {reviews.count > 0
                      ? `${reviews.count} reviews`
                      : "beoordeling"}
                    {city ? ` · ${city.toLowerCase()}` : ""}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="lg:order-1">
              <p className="cine-label text-[var(--cn-muted)]">Ervaringen</p>
              <blockquote className="mt-6">
                <p className="cine-display cine-italic text-[1.75rem] leading-[1.18] text-[var(--cn-oxblood)] sm:text-[2.4rem] lg:max-w-[26ch] lg:text-[2.9rem]">
                  {lead.text}
                </p>
                <footer className="cine-label mt-6 text-[var(--cn-muted)]">
                  {lead.author}
                  {lead.meta ? ` · ${lead.meta}` : ""}
                </footer>
              </blockquote>
            </div>
          </div>
        </ScrollReveal>

        {rest.length > 0 ? (
          <div
            className={`mt-12 grid gap-x-10 border-t border-[var(--cn-line)] sm:mt-16 sm:grid-cols-2 ${columns}`}
          >
            {rest.map((quote, index) => (
              <ScrollReveal key={quote.id} delayMs={index * 90} className="h-full">
                <figure className="flex h-full flex-col border-b border-[var(--cn-line)] py-8">
                  <p className="text-[14px] leading-7 text-[var(--cn-body)]">
                    {quote.text}
                  </p>
                  <figcaption className="cine-label mt-auto pt-6 text-[var(--cn-clay)]">
                    {quote.author}
                    {quote.meta ? (
                      <span className="text-[var(--cn-muted)]">
                        {` · ${quote.meta}`}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
