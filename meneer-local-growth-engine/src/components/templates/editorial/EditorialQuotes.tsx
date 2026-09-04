import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { EditorialStars } from "@/components/templates/editorial/EditorialStars";
import type {
  EditorialQuote,
  EditorialStyle,
} from "@/components/templates/editorial/editorialModel";

interface Props {
  quotes: EditorialQuote[];
  rating: string | null;
  ratingValue: number;
  reviewCount: number;
  studioName: string;
  /** True als de kaarten uit benefits/services komen i.p.v. echte reviews. */
  highlightsOnly?: boolean;
}

function initials(author: string): string {
  const parts = author.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "\u2605";
}

/**
 * Kaarten staan om en om iets lager en een halve graad gedraaid, en trekken
 * recht als je erover gaat. De onderkanten blijven op één lijn omdat het spoor
 * de hoogtes uitrekt, dus alleen de bovenrand golft.
 */
function QuoteCard({
  quote,
  variant,
  dupe = false,
}: {
  quote: EditorialQuote;
  variant: number;
  dupe?: boolean;
}) {
  const lowered = variant === 1;

  return (
    <figure
      aria-hidden={dupe || undefined}
      className={`group relative flex w-[19rem] shrink-0 flex-col rounded-[28px] bg-[var(--ed-surface)] p-7 shadow-[0_22px_60px_-38px_rgba(42,33,26,0.55)] transition-all duration-700 ease-[var(--ease-premium)] md:p-8 hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_34px_74px_-32px_rgba(42,33,26,0.6)] ${
        lowered
          ? "mt-9 rotate-[0.9deg] md:w-[20.5rem]"
          : "-rotate-[0.7deg] md:w-[23rem]"
      } ${dupe ? "ed-marquee-dupe" : ""}`}
    >
      <EditorialStars rating={quote.rating} size="sm" />

      <blockquote className="ed-serif mt-5 flex-1 text-[1.06rem] leading-[1.46] md:text-[1.14rem]">
        {quote.text}
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ed-accent-soft)] text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--ed-accent)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-105"
        >
          {initials(quote.author)}
        </span>
        <span className="min-w-0">
          <cite className="ed-label block truncate not-italic">{quote.author}</cite>
          {quote.meta ? (
            <span className="ed-label mt-1 block text-[var(--ed-fg-52)]">
              {quote.meta}
            </span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Reviews als doorlopende lint. Het spoor bevat twee identieke helften en
 * schuift naar -50%, dus de lus is naadloos. Hover en focus zetten hem stil,
 * zodat lezen altijd kan. Zonder bruikbare quotes blijft alleen de score over.
 */
export function EditorialQuotes({
  quotes,
  rating,
  ratingValue,
  reviewCount,
  studioName,
  highlightsOnly = false,
}: Props) {
  if (quotes.length === 0 && !rating) return null;

  const sectionTitle = highlightsOnly
    ? "Wat deze studio onderscheidt"
    : "Wat leden over de studio zeggen";
  const sectionLabel = highlightsOnly ? "Studio in het kort" : "Ervaringen";

  const score = rating ? (
    <div className="flex items-center gap-5 rounded-full bg-[var(--ed-surface)] py-4 pl-7 pr-8 shadow-[0_18px_48px_-34px_rgba(42,33,26,0.5)]">
      <p className="ed-serif text-[2.5rem] leading-none tracking-tight md:text-[2.8rem]">
        {rating}
      </p>
      <div>
        <EditorialStars rating={ratingValue} size="lg" />
        <p className="ed-label mt-2 text-[var(--ed-fg-52)]">
          {reviewCount > 0 ? `${reviewCount} beoordelingen` : "Openbare score"}
        </p>
      </div>
    </div>
  ) : null;

  if (quotes.length === 0) {
    return (
      <section className="ed-tint relative border-y border-[var(--ed-line)]">
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-7 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
          {score}
          <div className="md:text-right">
            <p className="ed-label text-[var(--ed-accent)]">Openbare beoordelingen</p>
            <p className="ed-serif mt-2 text-[1.5rem] leading-snug">{studioName}</p>
          </div>
        </div>
      </section>
    );
  }

  // Genoeg kaarten in één helft, anders is de lus te kort en valt de sprong op.
  const loop: EditorialQuote[] = [];
  while (loop.length < 6) loop.push(...quotes);

  const style: EditorialStyle = {
    "--ed-marquee-duration": `${loop.length * 10}s`,
  };

  return (
    <section className="ed-tint relative border-y border-[var(--ed-line)] py-20 md:py-24 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="flex flex-col gap-9 md:flex-row md:items-end md:justify-between md:gap-12">
          <ScrollReveal>
            <p className="ed-label text-[var(--ed-accent)]">{sectionLabel}</p>
            <h2 className="ed-serif ed-h2 mt-4 max-w-[24ch]">{sectionTitle}</h2>
          </ScrollReveal>

          {score ? <ScrollReveal delayMs={90}>{score}</ScrollReveal> : null}
        </div>
      </div>

      <div className="ed-marquee-hold ed-marquee-mask relative mt-10">
        <div className="ed-marquee items-stretch" style={style}>
          {loop.map((quote, index) => (
            <QuoteCard
              key={`a-${quote.id}-${index}`}
              quote={quote}
              variant={index % 2}
            />
          ))}
          {loop.map((quote, index) => (
            <QuoteCard
              key={`b-${quote.id}-${index}`}
              quote={quote}
              variant={index % 2}
              dupe
            />
          ))}
        </div>
      </div>

      <p className="ed-hint-hover relative mx-auto mt-8 flex w-fit items-center gap-2.5 text-[var(--ed-fg-52)]">
        <span className="ed-label">Beweeg over een kaart om te pauzeren</span>
        <EditorialIcon name="arrow" className="h-3.5 w-3.5" />
      </p>
    </section>
  );
}
