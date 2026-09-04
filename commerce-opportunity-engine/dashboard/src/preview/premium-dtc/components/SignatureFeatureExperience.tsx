"use client";

import { useState, type CSSProperties } from "react";
import type { FeatureRow } from "../types";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  features: FeatureRow[];
  /** Single product canvas — the same shot, explored part by part */
  canvasImage?: string | null;
  canvasAlt?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Focal points move down the product as you walk through the features. */
const FOCUS: Array<{ position: string; scale: number }> = [
  { position: "50% 12%", scale: 1.35 },
  { position: "50% 46%", scale: 1.5 },
  { position: "50% 82%", scale: 1.4 },
  { position: "50% 50%", scale: 1.2 },
];

/**
 * Signature component of PREMIUM_DTC_A: one large product canvas that zooms
 * to a different part of the product while the feature navigator is browsed.
 * No claim is made about which asset depicts which feature.
 */
export function SignatureFeatureExperience({
  kicker = "Het systeem",
  title,
  lead,
  features,
  canvasImage,
  canvasAlt,
}: Props) {
  const [active, setActive] = useState(0);
  if (!features.length) return null;

  const index = Math.min(active, features.length - 1);
  const focus = FOCUS[index % FOCUS.length]!;
  const canvasStyle: CSSProperties = {
    objectPosition: focus.position,
    transform: `scale(${focus.scale})`,
  };

  return (
    <section className="pdtc-fx" id="pdtc-features-title" aria-labelledby="pdtc-fx-title">
      <div className="pdtc-container">
        <div className="pdtc-fx-head">
          <span className="pdtc-eyebrow pdtc-eyebrow--brand">{kicker}</span>
          <h2 className="pdtc-display" id="pdtc-fx-title">
            {title}
          </h2>
          {lead ? <p className="pdtc-body-lg">{lead}</p> : null}
        </div>

        <div className="pdtc-fx-switch" role="tablist" aria-label="Functies">
          {features.map((f, i) => (
            <button
              key={`sw-${f.title}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`pdtc-fx-switch-item${i === index ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {f.title}
            </button>
          ))}
        </div>

        <div className="pdtc-fx-grid">
          <div className="pdtc-fx-stage">
            {canvasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="pdtc-fx-canvas"
                src={canvasImage}
                alt={canvasAlt || ""}
                style={canvasStyle}
                loading="lazy"
              />
            ) : null}
            <div className="pdtc-fx-stage-meta" aria-hidden="true">
              <span>{pad(index + 1)}</span>
              <i />
              <span>{pad(features.length)}</span>
            </div>
          </div>

          <ol className="pdtc-fx-nav" role="list">
            {features.map((f, i) => (
              <li key={f.title} data-source={f.source}>
                <button
                  type="button"
                  className={`pdtc-fx-item${i === index ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={i === index}
                >
                  <span className="pdtc-fx-num">{pad(i + 1)}</span>
                  <span className="pdtc-fx-copy">
                    <span className="pdtc-fx-item-title">{f.title}</span>
                    <span className="pdtc-fx-item-body">{f.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
