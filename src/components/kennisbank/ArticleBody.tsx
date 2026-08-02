import type { ArticleSection } from "@/data/kennisbank/types";
import { BrochureOmeter } from "@/components/kennisbank/BrochureOmeter";

export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div>
      {sections.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={i}
                className="mt-6 text-lg leading-relaxed text-mm-muted first:mt-0"
              >
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="mt-14 scroll-mt-24 border-b border-mm-border pb-2 text-2xl font-bold text-mm-text first:mt-0 sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-10 scroll-mt-24 text-xl font-bold text-mm-text sm:text-2xl"
              >
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mt-7 list-none space-y-2.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="group relative flex gap-3.5 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-orange-50/40 px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#FF5722]/35 hover:shadow-[0_10px_28px_-18px_rgba(255,87,34,0.45)]"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FF5722] text-white shadow-[2px_2px_0_0_rgba(15,23,42,0.12)] transition duration-300 group-hover:rotate-12 group-hover:scale-105"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="size-3.5"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3.5 8.2 6.4 11l6.1-6.4"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 text-base leading-relaxed text-slate-700 sm:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="mt-8 rounded-2xl border border-mm-sky/30 bg-mm-sky-subtle/60 px-6 py-5 text-base font-medium leading-relaxed text-mm-text"
              >
                {block.text}
              </aside>
            );
          case "interactive":
            if (block.id === "brochure-ometer") {
              return <BrochureOmeter key={i} />;
            }
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
}
