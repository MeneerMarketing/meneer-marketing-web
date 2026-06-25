interface FaqItem {
  question: string;
  answer: string;
}

export function DienstFAQ({ items, idPrefix }: { items: FaqItem[]; idPrefix: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const id = `${idPrefix}-faq-${index}`;
        return (
          <details
            key={id}
            className="group rounded-2xl border border-mm-border bg-mm-surface-elevated shadow-sm open:shadow-mm-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-mm-text marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-mm-border bg-white text-mm-sky-deep transition group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="border-t border-mm-border/80 px-5 pb-5 pt-3 text-base leading-relaxed text-mm-muted">
              {item.answer}
            </div>
          </details>
        );
      })}
    </div>
  );
}
