"use client";

import { useEffect, useRef, useState } from "react";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { EditorialStars } from "@/components/templates/editorial/EditorialStars";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";

interface Props {
  studioName: string;
  links: EditorialModel["navLinks"];
  booking: EditorialModel["booking"];
  /** True wanneer de hero een fullscreen beeld is: header start transparant. */
  overlay: boolean;
  rating: string | null;
  ratingValue: number;
  reviewCount: number;
  usps: string[];
  phone: string | null;
  instagram: string | null;
}

function TopBarUsps({ usps }: { usps: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (usps.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % usps.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [usps.length]);

  if (usps.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="relative hidden h-4 min-w-0 flex-1 items-center justify-center overflow-hidden lg:flex"
    >
      {usps.map((usp, index) => (
        <span
          key={usp}
          className={`ed-label-xs absolute inset-x-0 text-center transition-all duration-700 ease-[var(--ease-premium)] ${
            index === active
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          } text-[var(--ed-fg-70)]`}
        >
          {usp}
        </span>
      ))}
    </div>
  );
}

/**
 * Top bar en navigatie in één sticky shell. Zo ontstaat er geen witte haarlijn
 * tussen twee siblings. De balk klapt dicht bij scrollen, de nav blijft vast.
 */
export function EditorialNav({
  studioName,
  links,
  booking,
  overlay,
  rating,
  ratingValue,
  reviewCount,
  usps,
  phone,
  instagram,
}: Props) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry?.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMedia = overlay && !condensed;
  const hasActions = Boolean(phone || instagram);
  const hasTopBar = Boolean(rating || usps.length > 0 || hasActions);

  return (
    <>
      <div className="relative h-0">
        <div
          ref={sentinel}
          aria-hidden
          className={`absolute top-0 left-0 w-px ${overlay ? "h-[55vh]" : "h-px"}`}
        />
      </div>

      <header
        className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          condensed
            ? "border-b border-[var(--ed-line)] bg-[var(--ed-bg-veil)] backdrop-blur-md"
            : "border-b-0"
        }`}
      >
        {hasTopBar ? (
          <div
            className={`ed-deep overflow-hidden transition-[max-height,opacity] duration-500 ease-[var(--ease-premium)] ${
              condensed ? "max-h-0 opacity-0" : "max-h-11 opacity-100"
            }`}
          >
            <div className="mx-auto grid h-10 max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-5 md:h-11 md:px-10 lg:grid-cols-[1fr_minmax(12rem,28rem)_1fr] lg:gap-6 lg:px-16">
              {rating ? (
                <div className="flex min-w-0 items-center gap-2.5">
                  <EditorialStars rating={ratingValue} size="xs" />
                  <span className="ed-label-xs truncate text-[var(--ed-fg-70)] sm:hidden">
                    {reviewCount > 0 ? `${rating} (${reviewCount})` : rating}
                  </span>
                  <span className="ed-label-xs hidden truncate text-[var(--ed-fg-70)] sm:block">
                    {reviewCount > 0
                      ? `${rating} uit ${reviewCount} beoordelingen`
                      : `${rating} van 5`}
                  </span>
                </div>
              ) : (
                <span />
              )}

              <TopBarUsps usps={usps} />

              <div className="flex items-center justify-end gap-1 justify-self-end">
                {instagram ? (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center text-[var(--ed-fg-70)] transition-colors duration-500 hover:text-[var(--ed-fg)]"
                  >
                    <EditorialIcon name="instagram" className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    aria-label={`Bel ${phone}`}
                    className="flex h-8 w-8 items-center justify-center text-[var(--ed-fg-70)] transition-colors duration-500 hover:text-[var(--ed-fg)]"
                  >
                    <EditorialIcon name="phone" className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={`relative mx-auto flex h-16 max-w-[1440px] items-center px-5 md:h-[74px] md:px-10 lg:px-16 ${
            onMedia
              ? "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#1a140f]/75 before:via-[#1a140f]/25 before:to-transparent"
              : ""
          }`}
        >
          <a
            href="#top"
            className={`ed-serif relative z-10 min-w-0 truncate text-[1.35rem] tracking-tight transition-colors duration-500 md:text-[1.6rem] ${
              onMedia ? "text-white" : "text-[var(--ed-fg)]"
            }`}
          >
            {studioName}
          </a>

          <nav
            aria-label="Hoofdmenu"
            className="absolute left-1/2 z-10 hidden -translate-x-1/2 items-center gap-8 md:flex lg:gap-10"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`ed-label ed-link transition-colors duration-500 ${
                  onMedia
                    ? "text-white/80 hover:text-white"
                    : "text-[var(--ed-fg-70)] hover:text-[var(--ed-fg)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={booking.href}
            {...(booking.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`ed-label ed-btn relative z-10 ml-auto shrink-0 whitespace-nowrap px-4 py-2.5 transition-colors duration-500 hover:text-white md:px-5 ${
              onMedia
                ? "bg-white text-[#2a211a]"
                : "bg-[var(--ed-fg)] text-[var(--ed-bg)]"
            }`}
          >
            {booking.label}
          </a>
        </div>
      </header>
    </>
  );
}
