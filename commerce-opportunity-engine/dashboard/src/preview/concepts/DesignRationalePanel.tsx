"use client";

import { useState } from "react";

type RationaleItem = { title: string; body: string };

export function DesignRationalePanel({
  items,
  brandName,
  mode = "INTERNAL_REVIEW",
}: {
  items: RationaleItem[];
  brandName: string;
  mode?: "INTERNAL_REVIEW" | "PROSPECT_PREVIEW";
}) {
  const [open, setOpen] = useState(false);
  const prospect = mode === "PROSPECT_PREVIEW";

  return (
    <>
      <button
        type="button"
        className={`pdtc-rationale-fab${prospect ? " is-prospect" : ""}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Waarom deze opzet?"
        title="Waarom deze opzet?"
      >
        {prospect ? (
          <span className="pdtc-rationale-fab-ico" aria-hidden="true">
            ?
          </span>
        ) : (
          "Waarom deze opzet?"
        )}
      </button>

      {open ? (
        <div className="pdtc-rationale-layer" role="presentation">
          <button
            type="button"
            className="pdtc-rationale-backdrop"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
          />
          <aside
            className="pdtc-rationale-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdtc-rationale-title"
          >
            <div className="pdtc-rationale-head">
              <div>
                <p className="pdtc-rationale-eyebrow">Concept by Meneer Marketing</p>
                <h2 id="pdtc-rationale-title">Waarom deze opzet?</h2>
                <p className="pdtc-rationale-sub">
                  Ontwerpkeuzes voor {brandName}. Gebaseerd op CRO-intelligence,
                  niet op scores.
                </p>
              </div>
              <button
                type="button"
                className="pdtc-rationale-close"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
              >
                ×
              </button>
            </div>
            <ul className="pdtc-rationale-list">
              {items.slice(0, 4).map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function ConceptPreviewMark({
  lifecycle,
  mode = "INTERNAL_REVIEW",
}: {
  lifecycle: string;
  mode?: "INTERNAL_REVIEW" | "PROSPECT_PREVIEW";
}) {
  if (mode === "PROSPECT_PREVIEW") return null;
  return (
    <div className="pdtc-concept-mark" aria-label="Concept preview">
      <span>Concept by Meneer Marketing</span>
      <em>{lifecycle}</em>
    </div>
  );
}
