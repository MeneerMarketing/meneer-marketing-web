import { publicCopy } from "@/lib/copy-flags";

export type FigmaFaqItem = {
  question: string;
  answer: string;
};

/** FAQ-lijst in homepage-stijl (details/summary). */
export default function FigmaFaqList({ items }: { items: FigmaFaqItem[] }) {
  return (
    <div className="divide-y divide-[#dce8d9] border-t border-[#dce8d9]">
      {items.map((item) => (
        <details key={item.question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-[-.035em] text-[#17372a] sm:text-xl">
            <span>{publicCopy(item.question)}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf6e8] text-[#367544] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-2xl pt-4 text-[15px] leading-7 text-[#5f7765]">
            {publicCopy(item.answer)}
          </p>
        </details>
      ))}
    </div>
  );
}
