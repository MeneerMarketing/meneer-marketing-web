import { publicCopy } from "@/lib/copy-flags";

export type FigmaFaqItem = {
  question: string;
  answer: string;
};

/** FAQ-lijst in homepage-stijl (details/summary). */
export default function FigmaFaqList({ items }: { items: FigmaFaqItem[] }) {
  return (
    <div className="divide-y divide-[var(--g-100)] border-t border-[var(--g-100)]">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-[var(--r-md)] bg-white px-6 py-3"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-[16px] leading-[1.4] font-medium text-[var(--t-strong)]">
            <span>{publicCopy(item.question)}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--g-050)] text-[var(--g-700)]">
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 9h14" />
                <path d="M9 2v14" className="group-open:opacity-0" />
              </svg>
            </span>
          </summary>
          <p className="max-w-2xl pt-4 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(item.answer)}
          </p>
        </details>
      ))}
    </div>
  );
}
