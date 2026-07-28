"use client";

import { useId, useState, type ReactNode } from "react";
import type { HomeFaqItem } from "@/data/home-faq";

function highlightQuestion(question: string, highlight?: string): ReactNode {
  if (!highlight || !question.includes(highlight)) return question;
  const [before, after] = question.split(highlight);
  return (
    <>
      {before}
      <span className="text-[var(--diba-faq-highlight)]">{highlight}</span>
      {after}
    </>
  );
}

function PlusCircle() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--diba-mint-bar)] text-[var(--diba-green-700)]"
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M7 2v10M2 7h10" />
      </svg>
    </span>
  );
}

function MinusCircle() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--diba-mint-bar)] text-[var(--diba-green-700)]"
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 7h10" />
      </svg>
    </span>
  );
}

export default function HomeFaqAccordion({ items }: { items: readonly HomeFaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;
        return (
          <div
            key={item.id}
            className="border-b border-[var(--diba-green-200)]/80 first:border-t first:border-[var(--diba-green-200)]/80"
          >
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-[var(--space-4)] py-4 text-left diba-hp-faq-q transition-colors hover:text-[var(--diba-green-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--diba-green-700)] md:py-5"
              >
                <span>{highlightQuestion(item.question, item.highlight)}</span>
                {isOpen ? <MinusCircle /> : <PlusCircle />}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-[var(--dur-page)] [transition-timing-function:var(--ease-diba)] motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="diba-hp-body max-w-[640px] pb-[var(--space-6)]">
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
