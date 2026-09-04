"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { BenefitItem } from "../types";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  chips?: string[];
  asideImage?: string | null;
  asideAlt?: string;
  benefits: BenefitItem[];
  variant?: "SPLIT_EDITORIAL" | "LARGE_MEDIA_STATEMENT";
};

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-pdtc-reveal]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Deep-dive #1 — editorial benefit band (SC indications rhythm, prospect content). */
export function EditorialBenefitSection({
  kicker = "Voordelen",
  title,
  lead,
  chips,
  asideImage,
  asideAlt,
  benefits,
  variant = "SPLIT_EDITORIAL",
}: Props) {
  const ref = useReveal();
  if (!benefits.length) return null;

  return (
    <section
      ref={ref}
      id="pdtc-benefits"
      className={`pdtc-section pdtc-section--cream pdtc-benefits pdtc-benefits--${variant.toLowerCase().replace(/_/g, "-")}`}
      aria-labelledby="pdtc-benefits-title"
      data-variant={variant}
    >
      <div className="pdtc-container">
        <div className="pdtc-benefits-layout">
          <div className="pdtc-benefits-intro" data-pdtc-reveal>
            <span className="pdtc-kicker">{kicker}</span>
            <h2 className="pdtc-h2" id="pdtc-benefits-title">
              {title}
            </h2>
            {lead ? <p className="pdtc-lead">{lead}</p> : null}
            {chips && chips.length > 0 ? (
              <ul className="pdtc-section-chips" role="list" aria-label="Kernpunten">
                {chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : null}

            {asideImage ? (
              <div className="pdtc-benefits-aside">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asideImage} alt={asideAlt || ""} loading="lazy" />
                <div className="pdtc-benefits-aside-caption" aria-hidden="true">
                  <span>Product</span>
                  <strong>{asideAlt || title}</strong>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pdtc-benefit-grid">
            {benefits.map((b, i) => {
              const inner = (
                <>
                  <span
                    className="pdtc-benefit-dot"
                    style={b.accent ? ({ ["--w"]: b.accent } as CSSProperties) : undefined}
                    aria-hidden="true"
                  />
                  <div className="pdtc-benefit-copy">
                    <h3>{b.title}</h3>
                    {b.meta ? <em className="pdtc-benefit-meta">{b.meta}</em> : null}
                    <p>{b.body}</p>
                    {b.ctaLabel ? <span className="pdtc-benefit-go">{b.ctaLabel}</span> : null}
                  </div>
                  {b.image ? (
                    <div className="pdtc-benefit-thumb" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.image} alt="" loading="lazy" />
                    </div>
                  ) : null}
                </>
              );

              const className = `pdtc-benefit-card${b.image ? " has-media" : ""}`;
              const style = { ["--i"]: String(i) } as CSSProperties;

              if (b.href) {
                return (
                  <a
                    key={b.title}
                    href={b.href}
                    className={className}
                    style={style}
                    data-pdtc-reveal
                    data-source={b.source}
                  >
                    {inner}
                  </a>
                );
              }

              return (
                <article
                  key={b.title}
                  className={className}
                  style={style}
                  data-pdtc-reveal
                  data-source={b.source}
                >
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
