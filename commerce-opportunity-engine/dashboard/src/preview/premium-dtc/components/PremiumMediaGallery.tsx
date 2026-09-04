"use client";

import { useEffect, useState } from "react";
import type { MediaItem } from "../types";

type Props = {
  media: MediaItem[];
  productTitle: string;
  discountBadge?: string | null;
};

function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M14 6l-6 6 6 6" /> : <path d="M10 6l6 6-6 6" />}
    </svg>
  );
}

export function PremiumMediaGallery({ media, productTitle, discountBadge }: Props) {
  const items = media.length
    ? media
    : [{ id: "placeholder", src: "", alt: productTitle, kind: "image" as const }];
  const [active, setActive] = useState(0);
  const index = Math.min(active, items.length - 1);
  const current = items[index]!;
  const hasMany = items.length > 1;

  const go = (delta: number) => {
    setActive((i) => (i + delta + items.length) % items.length);
  };

  useEffect(() => {
    setActive((i) => Math.min(i, items.length - 1));
  }, [items.length]);

  return (
    <div className="pdtc-gallery">
      <div className="pdtc-gallery-rail" role="list" aria-label="Productmedia">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className={`pdtc-thumb${i === index ? " is-active" : ""}`}
            aria-label={item.alt || `Media ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => setActive(i)}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" loading={i === 0 ? "eager" : "lazy"} />
            ) : (
              <span className="pdtc-thumb-empty" />
            )}
          </button>
        ))}
      </div>

      <div className="pdtc-stage-wrap">
        <div className="pdtc-stage">
          {items.map((item, i) =>
            item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.id}
                className={`pdtc-stage-img${i === index ? " is-active" : ""}`}
                src={item.src}
                alt={i === index ? item.alt || productTitle : ""}
                loading={i === 0 ? "eager" : "lazy"}
                aria-hidden={i !== index}
              />
            ) : (
              <div key={item.id} className="pdtc-stage-empty">
                <span>Media</span>
                <em>PLACEHOLDER_REQUIRED</em>
              </div>
            )
          )}

          {discountBadge ? (
            <div className="pdtc-stage-deal" aria-hidden="true">
              <span>{discountBadge}</span>
            </div>
          ) : null}

          {current.claim ? (
            <div className="pdtc-stage-claim" aria-hidden="true">
              {current.claim.eyebrow ? <span>{current.claim.eyebrow}</span> : null}
              {current.claim.title ? <strong>{current.claim.title}</strong> : null}
            </div>
          ) : null}
        </div>

        {hasMany ? (
          <div className="pdtc-stage-nav">
            <button
              type="button"
              className="pdtc-stage-arrow"
              aria-label="Vorige afbeelding"
              onClick={() => go(-1)}
            >
              <IconChevron dir="left" />
            </button>
            <button
              type="button"
              className="pdtc-stage-arrow"
              aria-label="Volgende afbeelding"
              onClick={() => go(1)}
            >
              <IconChevron dir="right" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function usePrimaryAtcVisible(selector = "[data-pdtc-primary-atc]") {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [selector]);

  return visible;
}
