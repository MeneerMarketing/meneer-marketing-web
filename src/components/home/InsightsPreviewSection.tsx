import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { getAllBlogArticles } from "@/lib/blog";
import { siteCtas } from "@/lib/cta";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function InsightsPreviewSection() {
  const posts = getAllBlogArticles().slice(0, 3);

  return (
    <section
      className="border-b border-mm-border bg-mm-surface-elevated"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2
                id="insights-heading"
                className="text-3xl font-extrabold tracking-tighter text-mm-text sm:text-4xl"
              >
                Insights.{" "}
                <span className="text-mm-sky-deep">Geen vulling, wel inzicht.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                Praktische artikelen over performance, SEO, conversie en
                automatisering. Geschreven om je stack en marketing scherper
                te zetten.
              </p>
            </div>
            <div className="flex flex-col gap-2 self-start sm:flex-row md:self-auto">
              <Link
                href={siteCtas.schaalOp.href}
                className="inline-flex items-center gap-1 rounded-full bg-mm-sky-deep px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-sky-700"
              >
                {siteCtas.schaalOp.label}
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 rounded-full border border-mm-border bg-white px-5 py-2.5 text-sm font-bold text-mm-sky-deep transition hover:border-mm-sky/40"
                prefetch={false}
              >
                Naar blog
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={0.06 * i}>
              <li>
                <article className="flex h-full flex-col rounded-2xl border border-mm-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex w-fit rounded-full bg-mm-sky-subtle/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                    {post.category}
                  </span>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-mm-text">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-mm-sky-deep"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mm-muted">
                    {post.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-mm-muted">
                    {formatDate(post.publishedAt)} · {post.readMinutes} min
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mm-accent"
                  >
                    Lees artikel
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </article>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
