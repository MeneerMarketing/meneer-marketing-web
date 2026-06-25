import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import {
  JsonLdScript,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getBlogArticleBySlug, getBlogSlugs } from "@/lib/blog";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogArticleBySlug(slug);
  if (!post) return { title: "Artikel" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt ?? post.publishedAt,
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

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogArticleBySlug(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const articleLd = articleJsonLd({
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    url,
    keywords: post.keywords,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    {
      name:
        post.title.length > 52
          ? `${post.title.slice(0, 52)}…`
          : post.title,
      path: `/blog/${post.slug}`,
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
                    <Link href="/blog" className="hover:text-mm-sky-deep">
                      Blog
                    </Link>
                  </li>
                </ol>
              </nav>
              <p className="mt-6 w-fit rounded-full bg-mm-sky-subtle px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                {post.category}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-xl font-medium leading-relaxed text-mm-muted">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-mm-muted">
                <time dateTime={post.publishedAt}>
                  Gepubliceerd {formatDate(post.publishedAt)}
                </time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {post.readMinutes} min lezen
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <ArticleBody sections={post.sections} />

            <footer className="mt-16 rounded-3xl border border-mm-border bg-mm-accent-subtle p-8">
              <p className="text-lg font-bold text-mm-text">
                Dit artikel toepassen op jouw situatie?
              </p>
              <p className="mt-2 text-mm-muted">
                In een Groeiscan vertalen we dit soort inzichten naar concrete
                prioriteiten voor jouw stack en kanalen.
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
              >
                {siteCtas.groeiscan.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </footer>

            <Link
              href="/blog"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Terug naar alle artikelen
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
