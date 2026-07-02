import type { ArticleSection } from "@/data/kennisbank/articles";

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
              <ul
                key={i}
                className="mt-6 list-none space-y-3 border-l-2 border-mm-sky/40 pl-6"
              >
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="relative text-lg leading-relaxed text-mm-muted"
                  >
                    <span
                      className="absolute -left-4 top-2.5 size-1.5 -translate-x-px rounded-full bg-mm-accent"
                      aria-hidden
                    />
                    {item}
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
          default:
            return null;
        }
      })}
    </div>
  );
}
