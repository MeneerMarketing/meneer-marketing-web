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
        <details key={item.question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-[-.035em] text-[var(--t-strong)] sm:text-xl">
            <span>{publicCopy(item.question)}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--g-050)] text-[var(--g-700)] transition group-open:rotate-45">
              +
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
