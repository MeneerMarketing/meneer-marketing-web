"use client";

import type { Review } from "@/data/reviews";
import { primaryReviewTopic, reviewTopicLabel } from "@/data/reviews";

export type FigmaReviewCardVariant = "standard" | "featured" | "spotlight";

type FigmaReviewCardProps = {
  review: Review;
  variant?: FigmaReviewCardVariant;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function Stars({
  size = 12,
  onDark = false,
}: {
  size?: number;
  onDark?: boolean;
}) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={onDark ? "var(--on-dark-accent)" : "var(--g-600)"}
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.8z" />
        </svg>
      ))}
    </span>
  );
}

function TopicPill({
  review,
  onDark = false,
}: {
  review: Review;
  onDark?: boolean;
}) {
  const topic = primaryReviewTopic(review);
  return (
    <span
      className={`diba-label rounded-[var(--r-pill)] px-3 py-1.5 ${
        onDark
          ? "diba-label-on-dark bg-white/15"
          : "bg-white text-[var(--g-700)]"
      }`}
    >
      {reviewTopicLabel(topic)}
    </span>
  );
}

function AuthorRow({
  review,
  onDark = false,
}: {
  review: Review;
  onDark?: boolean;
}) {
  return (
    <figcaption className="flex items-center gap-3">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-pill)] text-[11px] font-semibold tracking-[.04em] ${
          onDark
            ? "bg-white/20 text-white"
            : "bg-[var(--g-200)] text-[var(--g-700)]"
        }`}
        aria-hidden="true"
      >
        {initials(review.name)}
      </span>
      <div className="min-w-0">
        <span
          className={`block truncate text-[14px] font-medium ${
            onDark ? "text-white" : "text-[var(--t-strong)]"
          }`}
        >
          {review.name}
        </span>
        <span
          className={`block truncate text-[13px] ${
            onDark ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"
          }`}
        >
          {review.treatment}
        </span>
      </div>
      {review.relativeDate ? (
        <span
          className={`diba-label ml-auto hidden shrink-0 sm:inline ${
            onDark ? "text-[var(--on-dark-label)]" : "text-[var(--t-muted)]"
          }`}
        >
          {review.relativeDate}
        </span>
      ) : null}
    </figcaption>
  );
}

export default function FigmaReviewCard({
  review,
  variant = "standard",
  className = "",
}: FigmaReviewCardProps) {
  if (variant === "spotlight") {
    return (
      <figure
        className={`flex h-full flex-col justify-between gap-8 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TopicPill review={review} onDark />
          <span role="img" aria-label={`${review.stars} van 5 sterren`}>
            <Stars onDark size={13} />
          </span>
        </div>
        <blockquote>
          <p className="max-w-3xl text-[clamp(1.35rem,2.8vw,2rem)] leading-[1.2] tracking-[-.04em] text-white text-balance">
            {review.quote}
          </p>
        </blockquote>
        <AuthorRow review={review} onDark />
      </figure>
    );
  }

  if (variant === "featured") {
    return (
      <figure
        className={`group flex h-full min-w-[min(100%,28rem)] snap-center flex-col rounded-[var(--r-lg)] bg-white p-7 shadow-[0_8px_32px_rgba(15,45,28,.06)] transition-[transform,box-shadow] duration-500 [transition-timing-function:var(--ease-diba)] hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(40,105,67,.1)] sm:p-8 ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <TopicPill review={review} />
          <span role="img" aria-label={`${review.stars} van 5 sterren`}>
            <Stars size={12} />
          </span>
        </div>
        <blockquote className="mt-6 flex-1">
          <p className="diba-card-title text-[var(--t-strong)]">
            {review.quote}
          </p>
        </blockquote>
        <div className="mt-8 border-t border-[var(--g-100)] pt-6">
          <AuthorRow review={review} />
        </div>
      </figure>
    );
  }

  return (
    <figure
      className={`group flex h-full flex-col rounded-[var(--r-lg)] bg-[var(--g-050)] p-6 transition-[background-color,transform,box-shadow] duration-500 [transition-timing-function:var(--ease-diba)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_40px_rgba(40,105,67,.08)] sm:p-7 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <TopicPill review={review} />
        <span role="img" aria-label={`${review.stars} van 5 sterren`}>
          <Stars size={11} />
        </span>
      </div>
      <blockquote className="mt-5 flex-1">
        <p className="text-[15px] leading-7 text-[var(--t-body)]">
          {review.quote}
        </p>
      </blockquote>
      <div className="mt-6 border-t border-[var(--g-100)] pt-5">
        <AuthorRow review={review} />
      </div>
    </figure>
  );
}
