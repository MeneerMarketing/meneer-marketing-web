"use client";

import { useId, useState } from "react";

/**
 * DIBA FaqAccordion — referentie batch 1 (DIBA-RULES.md §8)
 * Salielijnen · olijf plus/min · rustige onthulling (§9: 300–400ms, ease-diba).
 * Icoon wisselt plus→min via opacity (geen rotatie — §2 verbiedt draaien).
 * Volledig toetsenbord-toegankelijk: button + aria-expanded + aria-controls.
 * Voor SEO: render FAQPage-schema apart via de SchemaMarkup-laag (§15), met dezelfde data.
 */

export type FaqItem = { question: string; answer: string };

function PlusMin({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      stroke="var(--diba-green-700)"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="shrink-0"
    >
      <path d="M2 9h14" />
      <path
        d="M9 2v14"
        className="transition-opacity duration-[var(--dur-micro)] motion-reduce:transition-none"
        style={{ opacity: open ? 0 : 1 }}
      />
    </svg>
  );
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;
        return (
          <div key={i} className="rounded-[var(--r-md)] bg-white px-6 py-5">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-12 w-full items-center justify-between gap-[var(--space-4)]
                           py-[var(--space-4)] text-left
                           text-[16px] font-medium leading-[1.4] text-[var(--ink-900)]
                           [font-family:var(--font-body)]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-[var(--diba-green-700)]"
              >
                {item.question}
                <PlusMin open={isOpen} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-[var(--dur-page)]
                         [transition-timing-function:var(--ease-diba)]
                         motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[720px] pb-[var(--space-6)] text-[16px] leading-[1.6] text-[var(--ink-600)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
