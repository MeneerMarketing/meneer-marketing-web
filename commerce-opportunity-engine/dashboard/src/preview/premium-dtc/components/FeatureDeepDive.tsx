"use client";

import { useEffect, useRef, useState } from "react";
import type { FeatureRow } from "../types";
import type { CSSProperties } from "react";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  chips?: string[];
  features: FeatureRow[];
  variant?: "MEDIA_FOCUS" | "DETAIL_SEQUENCE";
};

/** Deep-dive #2 — feature spectrum (SC waves layout: sticky visual + interactive rows). */
export function FeatureDeepDive({
  kicker = "Details",
  title,
  lead,
  chips,
  features,
  variant = "MEDIA_FOCUS",
}: Props) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (features.length < 2 || reducedRef.current || variant === "DETAIL_SEQUENCE") return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % features.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [features.length, variant]);

  if (!features.length) return null;

  const current = features[Math.min(active, features.length - 1)]!;
  const visualSrc =
    current.image ||
    features.find((f) => f.image)?.image ||
    null;
  const showVisual = variant === "MEDIA_FOCUS";

  return (
    <section
      className={`pdtc-section pdtc-section--alt pdtc-features pdtc-features--${variant.toLowerCase().replace(/_/g, "-")}`}
      aria-labelledby="pdtc-features-title"
      data-variant={variant}
    >
      <div className="pdtc-container">
        <div className={`pdtc-feature-layout${!showVisual ? " is-sequence" : ""}`}>
          <div className="pdtc-features-head">
            <span className="pdtc-kicker">{kicker}</span>
            <h2 className="pdtc-h2" id="pdtc-features-title">
              {title}
            </h2>
            {chips && chips.length > 0 ? (
              <ul className="pdtc-section-chips" role="list" aria-label="Kernspecificaties">
                {chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : null}
            {lead ? <p className="pdtc-lead">{lead}</p> : null}
          </div>

          {showVisual ? (
          <div className="pdtc-feature-visual" aria-hidden={!visualSrc}>
            <div className="pdtc-feature-stage">
              {visualSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={visualSrc + active}
                  className="pdtc-feature-frame is-active"
                  src={visualSrc}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="pdtc-feature-stage-empty">
                  <span>Detail visual</span>
                  <em>PLACEHOLDER_REQUIRED</em>
                </div>
              )}
              <div className="pdtc-feature-stage-meta">
                <span
                  className="pdtc-feature-stage-dot"
                  style={
                    current.accent
                      ? ({ ["--w"]: current.accent } as CSSProperties)
                      : undefined
                  }
                />
                <div>
                  <strong>{current.title}</strong>
                  {current.meta ? <em>{current.meta}</em> : null}
                </div>
              </div>
            </div>
          </div>
          ) : null}

          <div className="pdtc-feature-rows" ref={listRef} role="list">
            {features.map((f, i) => (
              <button
                key={f.title}
                type="button"
                role="listitem"
                className={`pdtc-feature-row${i === active ? " is-active" : ""}`}
                data-source={f.source}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-pressed={i === active}
              >
                <div className="pdtc-feature-id">
                  <span
                    className="pdtc-feature-dot"
                    style={f.accent ? ({ ["--w"]: f.accent } as CSSProperties) : undefined}
                    aria-hidden="true"
                  />
                  <strong>{f.title}</strong>
                  {f.meta ? <em>{f.meta}</em> : null}
                </div>
                <p>{f.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
