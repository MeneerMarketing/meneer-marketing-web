/**
 * DIBA ReviewCard — referentie batch 1 (DIBA-RULES.md §8)
 * Crème kaart · Fraunces-italic quote · naam + behandeling + sterren klein.
 * Server component, geen client-JS. Sterren als inline SVG (geen icon-library).
 * Content komt uit echte reviews (review-mining, fase 2) — nooit verzonnen quotes.
 */

export type ReviewCardProps = {
  quote: string;
  name: string;
  treatment: string;
  /** 1 t/m 5 */
  stars: number;
  relativeDate?: string;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 20 20"
      fill={filled ? "#286943" : "none"}
      stroke="#95c592"
      strokeWidth="1.25"
    >
      <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.8z" />
    </svg>
  );
}

export default function ReviewCard({
  quote,
  name,
  treatment,
  stars,
  relativeDate,
}: ReviewCardProps) {
  const n = Math.max(1, Math.min(5, Math.round(stars)));
  return (
    <figure className="rounded-[1.5rem] border border-[#dce8d9] bg-white p-6 shadow-[0_8px_32px_rgba(15,45,28,.04)] sm:p-8">
      <blockquote>
        <p className="text-lg leading-relaxed text-[#17372a] [font-family:var(--font-accent)] italic font-light md:text-xl">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-[13px] font-medium text-[#17372a]">{name}</span>
        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full bg-[#dce8d9]"
        />
        <span className="text-[13px] text-[#5f7765]">{treatment}</span>
        {relativeDate ? (
          <>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[#dce8d9]"
            />
            <span className="text-[11px] uppercase tracking-[.1em] text-[#8aa88f]">
              {relativeDate}
            </span>
          </>
        ) : null}
        <span
          className="ml-auto inline-flex gap-[3px]"
          role="img"
          aria-label={`${n} van 5 sterren`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} filled={i < n} />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
