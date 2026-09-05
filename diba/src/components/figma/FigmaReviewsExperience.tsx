"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FigmaReviewCard from "@/components/figma/FigmaReviewCard";
import FigmaSoftAccent from "@/components/figma/FigmaSoftAccent";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import {
  REVIEW_TOPICS,
  reviewCountForTopic,
  reviewsForTopic,
  type Review,
  type ReviewTopic,
} from "@/data/reviews";
import {
  SALONIZED_REVIEWS_URL,
  SALONIZED_REVIEW_SUMMARY,
} from "@/data/salonized-reviews";

const PAGE_SIZE = 12;

function pickFeaturedReviews(reviews: readonly Review[]): Review[] {
  return [...reviews]
    .sort((a, b) => b.quote.length - a.quote.length)
    .slice(0, 5);
}

type FigmaReviewsExperienceProps = {
  className?: string;
};

export default function FigmaReviewsExperience({
  className = "",
}: FigmaReviewsExperienceProps) {
  const [topic, setTopic] = useState<ReviewTopic>("alle");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = useMemo(() => reviewsForTopic(topic), [topic]);
  const featured = useMemo(() => pickFeaturedReviews(filtered), [filtered]);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  /**
   * Wisselt het onderwerp, dan begint de lijst weer bovenaan. Dat gebeurt tijdens de
   * render en niet in een effect: een effect zou een tweede render uitlokken waarin de
   * bezoeker heel even de oude telling ziet. Dit is het patroon dat React zelf aanraadt
   * voor state die op een wijziging moet reageren.
   */
  const [vorigOnderwerp, setVorigOnderwerp] = useState(topic);
  if (vorigOnderwerp !== topic) {
    setVorigOnderwerp(topic);
    setVisibleCount(PAGE_SIZE);
    setActiveFeatured(0);
  }

  const advanceFeatured = useCallback(() => {
    if (featured.length <= 1) return;
    setActiveFeatured((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    if (paused || featured.length <= 1) return undefined;
    timerRef.current = setInterval(advanceFeatured, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advanceFeatured, paused, featured.length]);

  return (
    <div className={`space-y-16 lg:space-y-24 ${className}`}>
      {/* Filter */}
      <div>
        <Label>Onderwerp</Label>
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Review-onderwerp"
        >
          {REVIEW_TOPICS.map((item) => {
            const active = topic === item.id;
            const count = reviewCountForTopic(item.id);
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTopic(item.id)}
                className={`diba-label inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] px-4 transition-[background-color,color,border-color] duration-300 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  active
                    ? "diba-pill-active"
                    : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-100)]"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-[var(--r-pill)] px-2 py-0.5 text-[10px] tabular-nums ${
                    active ? "bg-white/20" : "bg-white text-[var(--g-700)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotlight — homepage testimonial stijl */}
      {featured.length > 0 ? (
        <section
          className="relative overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-700)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
          aria-label="Uitgelichte review"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(216,239,200,.12),transparent_50%,rgba(67,79,58,.25))]"
          />
          <FigmaSoftAccent variant="cta" className="opacity-60" />

          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Label opDonker>Salonized · live</Label>
                <p className="mt-3 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-.08em] text-white tabular-nums">
                  {SALONIZED_REVIEW_SUMMARY.rating.toFixed(1).replace(".", ",")}
                </p>
                <p className="mt-2 text-[15px] text-[var(--on-dark-body)]">
                  {SALONIZED_REVIEW_SUMMARY.countFormatted} reviews · echt en
                  openbaar
                </p>
              </div>
              <div className="flex items-center gap-2">
                {featured.map((review, i) => (
                  <button
                    key={review.id}
                    type="button"
                    aria-label={`Review ${i + 1}: ${review.name}`}
                    aria-current={i === activeFeatured}
                    onClick={() => setActiveFeatured(i)}
                    className={`h-1.5 rounded-[var(--r-pill)] transition-all duration-500 [transition-timing-function:var(--ease-diba)] ${
                      i === activeFeatured
                        ? "w-10 bg-[var(--on-dark-accent)]"
                        : "w-1.5 bg-white/35 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-10 min-h-[220px] sm:min-h-[200px]">
              {featured.map((review, i) => (
                <div
                  key={review.id}
                  className={`transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                    i === activeFeatured
                      ? "relative opacity-100 translate-y-0"
                      : "pointer-events-none absolute inset-0 opacity-0 translate-y-3"
                  }`}
                  aria-hidden={i !== activeFeatured}
                >
                  <FigmaReviewCard review={review} variant="spotlight" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Horizontale scroll — korte highlights */}
      {topic === "alle" && filtered.length > 3 ? (
        <section aria-label="Meer highlights">
          <Label>Meer highlights</Label>
          <div className="relative mt-5 -mx-1">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pickFeaturedReviews(filtered)
                .slice(0, 4)
                .map((review) => (
                  <FigmaReviewCard
                    key={`hi-${review.id}`}
                    review={review}
                    variant="featured"
                  />
                ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Grid */}
      {visible.length > 0 ? (
        <section aria-label="Alle reviews">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>Alle reviews</Label>
              <p className="mt-2 text-[15px] text-[var(--t-body)]">
                {filtered.length} quote{filtered.length === 1 ? "" : "s"} op
                deze pagina
              </p>
            </div>
            <Link
              href={SALONIZED_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 transition hover:text-[var(--g-800)]"
            >
              Volledige lijst op Salonized
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {visible.map((review) => (
              <FigmaReviewCard
                key={review.id}
                review={review}
                variant="standard"
              />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-12 flex justify-center">
              <Button
                variant="secundair"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Meer laden ({filtered.length - visibleCount})
              </Button>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="text-[15px] leading-7 text-[var(--t-body)]">
          Nog geen gelabelde reviews voor dit onderwerp. Bekijk alle{" "}
          <Link
            href={SALONIZED_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--g-700)] underline underline-offset-4"
          >
            {SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op Salonized
          </Link>
          .
        </p>
      )}
    </div>
  );
}
