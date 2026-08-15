"use client";

import Link from "next/link";
import {
  SALONIZED_REVIEWS_URL,
  SALONIZED_REVIEW_SUMMARY,
} from "@/data/salonized-reviews";

type SalonizedScorePanelProps = {
  className?: string;
  /** compact = één regel naast CTA */
  variant?: "hero" | "compact";
};

function Stars({ size = 14 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="var(--g-700)"
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.8z" />
        </svg>
      ))}
    </span>
  );
}

/** 5,0 · 3.883 reviews — gekoppeld aan Salonized. */
export default function SalonizedScorePanel({
  className = "",
  variant = "hero",
}: SalonizedScorePanelProps) {
  const { rating, countFormatted } = SALONIZED_REVIEW_SUMMARY;

  if (variant === "compact") {
    return (
      <a
        href={SALONIZED_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex flex-wrap items-center gap-3 rounded-full border border-[var(--g-100)] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[.12em] text-[var(--g-700)] transition hover:border-[var(--g-700)] hover:bg-[var(--g-050)] ${className}`}
      >
        <Stars size={11} />
        <span>
          {rating.toFixed(1).replace(".", ",")} · {countFormatted} reviews
        </span>
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-[var(--g-100)] bg-[linear-gradient(145deg,var(--g-050),#fff_55%)] p-8 sm:p-10 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(181,223,157,.45),transparent_70%)] blur-2xl"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[var(--t-label)]">
            Salonized · live
          </p>
          <p className="mt-3 flex items-baseline gap-3">
            <span className="text-6xl font-medium tracking-[-.08em] text-[var(--g-700)] sm:text-7xl">
              {rating.toFixed(1).replace(".", ",")}
            </span>
            <Stars size={18} />
          </p>
          <p className="mt-2 text-[15px] text-[var(--t-muted)]">
            Gebaseerd op{" "}
            <strong className="font-medium text-[var(--g-900)]">
              {countFormatted} reviews
            </strong>
          </p>
        </div>
        <Link
          href={SALONIZED_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#b8d0b9] px-5 py-3 text-[11px] font-medium uppercase tracking-[.13em] text-[var(--g-700)] transition hover:border-[var(--g-700)] hover:bg-white"
        >
          Alle reviews op Salonized ↗
        </Link>
      </div>
    </div>
  );
}
