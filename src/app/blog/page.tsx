import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/effects/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllBlogArticles } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog. Insights over web, SEO, marketing & automatisering",
  description:
    "Artikelen van MeneerMarketing over Shopify-performance, semantische SEO, n8n-workflows, CRO en branding. Geschreven om je stack en groei scherper te maken.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    title: "MeneerMarketing Blog",
    description:
      "Praktische insights over web, SEO, conversie en automatisering.",
    url: absoluteUrl("/blog"),
    locale: "nl_NL",
    type: "website",
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  const posts = getAllBlogArticles();

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-sky-subtle">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
              <BookOpen className="size-4" aria-hidden />
              Insights
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
              Blog voor builders &amp; groeiers
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
              Geen vage lijstjes: stukken die je helpen beslissen. Over
              performance, SEO, conversie, design en automatisering.
            </p>
          </div>
        </header>

        <section className="bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <ul className="grid gap-8 lg:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={0.05 * i}>
                  <li>
                    <article className="group flex h-full flex-col rounded-3xl border border-mm-border bg-white p-8 shadow-mm-card transition duration-300 hover:-translate-y-1 hover:shadow-mm-float">
                      <span className="w-fit rounded-full bg-mm-sky-subtle px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                        {post.category}
                      </span>
                      <h2 className="mt-4 text-xl font-bold leading-snug text-mm-text group-hover:text-mm-sky-deep sm:text-2xl">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="mt-3 flex-1 text-mm-muted">{post.description}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-mm-muted">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span aria-hidden>·</span>
                        <span>{post.readMinutes} min lezen</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-mm-accent"
                      >
                        Artikel lezen
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </article>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
