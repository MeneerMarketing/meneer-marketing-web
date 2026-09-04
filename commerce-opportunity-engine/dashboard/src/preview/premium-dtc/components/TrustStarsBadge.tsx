import type { CSSProperties } from "react";

type Props = {
  score: number;
  size?: "sm" | "md";
  brandLabel?: string;
  href?: string | null;
  className?: string;
};

const STAR_PATH =
  "M12 2l2.9 6.9 7.1.6-5.4 4.6 1.7 7-6.3-3.9-6.3 3.9 1.7-7-5.4-4.6 7.1-.6z";

/** Trustpilot-style green star boxes (SC sc-trustpilot-badge pattern). */
export function TrustStarsBadge({
  score,
  size = "sm",
  brandLabel = "Trustpilot",
  href,
  className = "",
}: Props) {
  const clamped = Math.max(0, Math.min(5, score));
  const full = Math.floor(clamped);
  const partial = clamped - full;
  const partialPct = Math.round(partial * 100);
  const label = `${clamped.toFixed(1)} op ${brandLabel}`;

  const stars = (
    <span className="pdtc-tp-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const isFull = i < full;
        const isPartial = i === full && partialPct > 0;
        return (
          <span
            key={i}
            className={`pdtc-tp-star-box${isPartial ? " is-partial" : ""}${
              !isFull && !isPartial ? " is-empty" : ""
            }`}
            style={
              isPartial
                ? ({ ["--tp-partial"]: `${partialPct}%` } as CSSProperties)
                : undefined
            }
          >
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d={STAR_PATH} />
            </svg>
          </span>
        );
      })}
    </span>
  );

  const inner = (
    <>
      {stars}
      <span className="pdtc-tp-score">{clamped.toFixed(1)}</span>
      <span className="pdtc-tp-brand" aria-hidden="true">
        <svg className="pdtc-tp-brand-star" viewBox="0 0 24 24" focusable="false">
          <path fill="#00b67a" d={STAR_PATH} />
        </svg>
        <span className="pdtc-tp-brand-name">{brandLabel}</span>
      </span>
    </>
  );

  const cls = `pdtc-tp-badge pdtc-tp-badge--${size}${className ? ` ${className}` : ""}`;

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {inner}
      </a>
    );
  }

  return (
    <span className={cls} aria-label={label}>
      {inner}
    </span>
  );
}

/** Compact star row for review cards (filled cacao, not Trustpilot green). */
export function ReviewStarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  const clamped = Math.max(0, Math.min(max, rating));
  return (
    <span className="pdtc-review-stars" aria-label={`${clamped} van ${max} sterren`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={i < Math.round(clamped) ? "is-on" : ""}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}
