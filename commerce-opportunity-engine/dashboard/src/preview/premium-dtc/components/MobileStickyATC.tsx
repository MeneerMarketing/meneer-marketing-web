"use client";

import { useEffect, useState } from "react";

type Props = {
  ctaLabel: string;
  priceLabel: string;
  inStock: boolean;
  title?: string;
};

/**
 * Sticky ATC only after primary CTA has scrolled ABOVE the viewport.
 * Not when CTA is still below the fold.
 */
export function MobileStickyATC({ ctaLabel, priceLabel, inStock, title }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const primary = document.querySelector("[data-pdtc-primary-atc]");
    if (!primary || !inStock) return;

    const update = () => {
      const rect = primary.getBoundingClientRect();
      const scrolledPast = rect.bottom < 0;
      const final = document.querySelector("[data-pdtc-final-atc]");
      const finalVisible = final
        ? (() => {
            const fr = final.getBoundingClientRect();
            return fr.top < window.innerHeight && fr.bottom > 0;
          })()
        : false;
      setShow(scrolledPast && !finalVisible);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const io = new IntersectionObserver(() => update(), {
      threshold: [0, 0.01, 1],
    });
    io.observe(primary);
    const final = document.querySelector("[data-pdtc-final-atc]");
    if (final) io.observe(final);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io.disconnect();
    };
  }, [inStock]);

  return (
    <div
      className={`pdtc-sticky-atc${show ? " is-visible" : ""}`}
      aria-hidden={!show}
      aria-label="Snel bestellen"
    >
      <div className="pdtc-sticky-atc-inner">
        <div className="pdtc-sticky-meta">
          <strong>{priceLabel}</strong>
          {title ? <span>{title}</span> : null}
        </div>
        <a href="#pdtc-buy-area" className="pdtc-btn pdtc-sticky-btn">
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
