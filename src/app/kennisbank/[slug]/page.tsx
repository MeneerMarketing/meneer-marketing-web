import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/kennisbank/ArticleBody";
import {
  JsonLdScript,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { getDienstBySlug } from "@/lib/diensten";
import {
  getKennisbankArticleBySlug,
  getKennisbankCategory,
  getKennisbankSlugs,
  getRelatedArticles,
} from "@/lib/kennisbank";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return getKennisbankSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getKennisbankArticleBySlug(slug);
  if (!article) return { title: "Artikel" };
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: absoluteUrl(`/kennisbank/${article.slug}`) },
    openGraph: {
      title: article.title,
      description: article.description,
      url: absoluteUrl(`/kennisbank/${article.slug}`),
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt ?? article.publishedAt,
      locale: "nl_NL",
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function KennisbankArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getKennisbankArticleBySlug(slug);
  if (!article) notFound();

  const category = getKennisbankCategory(article.category);
  const related = getRelatedArticles(slug, 3);
  const diensten = article.dienstSlugs
    .map((s) => getDienstBySlug(s))
    .filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined);

  const url = absoluteUrl(`/kennisbank/${article.slug}`);
  const articleLd = articleJsonLd({
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    url,
    keywords: article.keywords,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Kennisbank", path: "/kennisbank" },
    {
      name:
        article.title.length > 52
          ? `${article.title.slice(0, 52)}…`
          : article.title,
      path: `/kennisbank/${article.slug}`,
    },
  ]);

  return (
    <>
      <JsonLdScript data={articleLd} />
      <JsonLdScript data={breadcrumbLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <article>
          <header className="border-b border-mm-border bg-mm-surface-elevated">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
              <nav
                className="text-sm font-semibold text-mm-muted"
                aria-label="Broodkruimel"
              >
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/" className="hover:text-mm-sky-deep">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href="/kennisbank" className="hover:text-mm-sky-deep">
                      Kennisbank
                    </Link>
                  </li>
                  {category ? (
                    <>
                      <li aria-hidden>/</li>
                      <li>
                        <Link
                          href={`/kennisbank#kb-${category.slug}`}
                          className="hover:text-mm-sky-deep"
                        >
                          {category.name}
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ol>
              </nav>
              {category ? (
                <p className="mt-6 w-fit rounded-full bg-mm-sky-subtle px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                  {category.name}
                </p>
              ) : null}
              <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-4 text-xl font-medium leading-relaxed text-mm-muted">
                {article.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-mm-muted">
                <time dateTime={article.publishedAt}>
                  Gepubliceerd {formatDate(article.publishedAt)}
                </time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {article.readMinutes} min lezen
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <ArticleBody sections={article.sections} />

            {diensten.length > 0 ? (
              <aside className="mt-14 rounded-3xl border border-mm-border bg-white p-7 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-mm-muted">
                  Diensten die hierbij horen
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {diensten.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/diensten/${d.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-mm-border bg-mm-bg px-4 py-2 text-sm font-bold text-mm-text transition hover:border-mm-sky-deep/40 hover:text-mm-sky-deep"
                      >
                        {d.name}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <footer className="mt-10 rounded-3xl border border-mm-border bg-mm-accent-subtle p-8">
              <p className="text-lg font-bold text-mm-text">
                Dit artikel toepassen op jouw situatie?
              </p>
              <p className="mt-2 text-mm-muted">
                In een Groeiscan vertalen we dit soort inzichten naar concrete
                prioriteiten voor jouw kanalen en je site.
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
              >
                {siteCtas.groeiscan.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </footer>

            {related.length > 0 ? (
              <section className="mt-14" aria-labelledby="related-heading">
                <h2
                  id="related-heading"
                  className="text-xl font-extrabold text-mm-text"
                >
                  Verder lezen
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/kennisbank/${r.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-mm-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-mm-sky/35 hover:shadow-md"
                      >
                        <span className="text-sm font-bold leading-snug text-mm-text group-hover:text-mm-sky-deep">
                          {r.title}
                        </span>
                        <span className="mt-3 text-xs font-semibold text-mm-muted">
                          {r.readMinutes} min lezen
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <Link
              href="/kennisbank"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Terug naar de kennisbank
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
