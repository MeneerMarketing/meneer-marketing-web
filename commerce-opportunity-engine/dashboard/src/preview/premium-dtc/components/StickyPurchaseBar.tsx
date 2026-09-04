"use client";

import { useEffect, useState } from "react";
import { getDeliveryPromiseShort } from "../deliveryPromise";

type Props = {
  title: string;
  ctaLabel: string;
  priceLabel: string;
  compareAtLabel?: string | null;
  inStock: boolean;
  image?: string | null;
  deliveryCutoffHour?: number;
  deliveryCutoffMinute?: number;
};

/**
 * Bottom purchase bar — appears only after the full buy section has scrolled past.
 * Hidden again while the final purchase CTA is on screen.
 */
export function StickyPurchaseBar({
  title,
  ctaLabel,
  priceLabel,
  compareAtLabel,
  inStock,
  image,
  deliveryCutoffHour = 23,
  deliveryCutoffMinute = 0,
}: Props) {
  const [show, setShow] = useState(false);
  const [deliveryLine, setDeliveryLine] = useState(() =>
    getDeliveryPromiseShort(deliveryCutoffHour, deliveryCutoffMinute)
  );

  useEffect(() => {
    if (!inStock) return;
    const buySection = document.querySelector(".pdtc-buy");
    if (!buySection) return;

    const update = () => {
      const rect = buySection.getBoundingClientRect();
      const scrolledPast = rect.bottom < 0;
      const final = document.querySelector("[data-pdtc-final-atc]");
      let finalVisible = false;
      if (final) {
        const fr = final.getBoundingClientRect();
        finalVisible = fr.top < window.innerHeight && fr.bottom > 0;
      }
      setShow(scrolledPast && !finalVisible);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [inStock]);

  useEffect(() => {
    const refresh = () =>
      setDeliveryLine(getDeliveryPromiseShort(deliveryCutoffHour, deliveryCutoffMinute));
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [deliveryCutoffHour, deliveryCutoffMinute]);

  useEffect(() => {
    document.body.classList.toggle("pdtc-bar-on", show);
    return () => document.body.classList.remove("pdtc-bar-on");
  }, [show]);

  return (
    <div
      className={`pdtc-purchasebar${show ? " is-visible" : ""}`}
      aria-hidden={!show}
    >
      <div className="pdtc-container pdtc-purchasebar-inner">
        {image ? (
          <div className="pdtc-purchasebar-media" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" loading="lazy" />
          </div>
        ) : null}
        <div className="pdtc-purchasebar-meta">
          <strong>{title}</strong>
          <span className="pdtc-purchasebar-price">
            {priceLabel}
            {compareAtLabel ? <em>{compareAtLabel}</em> : null}
          </span>
          <span className="pdtc-purchasebar-delivery">{deliveryLine}</span>
        </div>
        <a href="#pdtc-buy-area" className="pdtc-cta pdtc-purchasebar-cta" tabIndex={show ? 0 : -1}>
          {ctaLabel}
          <span className="pdtc-cta-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
