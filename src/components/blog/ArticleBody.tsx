import type { ArticleSection } from "@/data/blog-articles";

export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-mm-text prose-p:text-mm-muted prose-p:leading-relaxed prose-li:text-mm-muted prose-strong:text-mm-text">
      {sections.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="mt-6 text-lg first:mt-0">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="mt-14 border-b border-mm-border pb-2 text-2xl text-mm-text first:mt-0 sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 text-xl text-mm-text sm:text-2xl">
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
                  <li key={item} className="relative text-lg text-mm-muted">
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
