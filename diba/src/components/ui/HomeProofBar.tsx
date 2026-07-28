"use client";

import type { ProofItem } from "@/components/ui/ProofStrip";
import { figmaContainer } from "@/lib/figma-home-layout";

const nf = new Intl.NumberFormat("nl-NL");
const fmt = (item: ProofItem, n: number) =>
  item.label === "Vertrouwd sinds" ? String(n) : nf.format(n);

/** Figma Make — stats bar (exact classes uit export). */
export default function HomeProofBar({ items }: { items: ProofItem[] }) {
  return (
    <section className="border-y border-[#dce8d9] bg-white px-5 sm:px-9 lg:px-[7.5vw]">
      <div className={`${figmaContainer} grid divide-y divide-[#dce8d9] md:grid-cols-4 md:divide-x md:divide-y-0`}>
        {items.map((item) => (
          <div key={item.label} className="py-7 text-center">
            <strong className="block text-3xl tracking-[-.06em] text-[#276541]">
              {fmt(item, item.value)}
              {item.suffix ?? ""}
            </strong>
            <span className="mt-2 block text-[10px] uppercase tracking-[.13em] text-[#66806a]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
