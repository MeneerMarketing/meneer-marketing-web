import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/effects/Reveal";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/components/seo/JsonLd";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import {
  getAllKennisbankArticles,
  getArticlesByCategory,
  kennisbankCategories,
} from "@/lib/kennisbank";
import { siteCtas } from "@/lib/cta";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";

const seo = HUB_PAGE_SEO.kennisbank;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: "/kennisbank",
  ogAccent: seo.ogAccent,
});

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function KennisbankPage() {
  const allArticles = getAllKennisbankArticles();
  const categoriesWithArticles = kennisbankCategories
    .map((category) => ({
      category,
      articles: getArticlesByCategory(category.slug),
    }))
    .filter((entry) => entry.articles.length > 0);

  const collectionLd = collectionPageJsonLd({
    name: `Kennisbank ${BRAND_DISPLAY}`,
    description:
      "Praktische artikelen over strategie, bouwen, vindbaarheid, campagnes en behoud.",
    path: "/kennisbank",
    items: allArticles.map((a) => ({
      name: a.title,
      path: `/kennisbank/${a.slug}`,
    })),
  });

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank" },
        ])}
      />
      <JsonLdScript data={collectionLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-hidden border-b border-mm-border bg-mm-sky-subtle">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-mm-sky/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                <GraduationCap className="size-4" aria-hidden />
                Kennisbank
              </p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                Alles wat ik weet.
                <br />
                Gratis na te lezen.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
                Open kennis, niet achter een e-mailmuur. Praktijk waar ik zelf
                mee werk. Georganiseerd langs dezelfde vijf blokken als het
                aanbod, zodat je van lezen direct naar doen kunt.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <nav
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Categorieën"
              >
                {categoriesWithArticles.map(({ category, articles }) => (
                  <a
                    key={category.slug}
                    href={`#kb-${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-mm-border bg-white px-4 py-2 text-sm font-bold text-mm-text transition hover:border-mm-sky-deep/40 hover:text-mm-sky-deep"
                  >
                    {category.name}
                    <span className="rounded-full bg-mm-sky-subtle px-2 py-0.5 text-[11px] font-bold text-mm-sky-deep">
                      {articles.length}
                    </span>
                  </a>
                ))}
              </nav>
            </Reveal>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-16">
            {categoriesWithArticles.map(({ category, articles }, index) => (
              <section
                key={category.slug}
                id={`kb-${category.slug}`}
                className="scroll-mt-28"
                aria-labelledby={`kb-heading-${category.slug}`}
              >
                <Reveal delay={index * 0.03}>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h2
                        id={`kb-heading-${category.slug}`}
                        className="text-2xl font-extrabold tracking-tight text-mm-text sm:text-3xl"
                      >
                        {category.name}
                      </h2>
                      <p className="mt-1.5 text-mm-muted">{category.tagline}</p>
                    </div>
                    <Link
                      href={`/${category.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
                    >
                      Bekijk het blok {category.name}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </Reveal>

                <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article, i) => (
                    <Reveal key={article.slug} delay={0.05 * i}>
                      <li className="h-full">
                        <article className="group flex h-full flex-col rounded-3xl border border-mm-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-mm-sky/35 hover:shadow-mm-float">
                          <span className="w-fit rounded-full bg-mm-sky-subtle px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                            {category.name}
                          </span>
                          <h3 className="mt-4 text-lg font-bold leading-snug text-mm-text group-hover:text-mm-sky-deep">
                            <Link href={`/kennisbank/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-mm-muted">
                            {article.description}
                          </p>
                          <div className="mt-5 flex items-center justify-between text-xs font-semibold text-mm-muted">
                            <time dateTime={article.publishedAt}>
                              {formatDate(article.publishedAt)}
                            </time>
                            <span>{article.readMinutes} min lezen</span>
                          </div>
                        </article>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-16">
            <MarketingFunFactsRow
              facts={getFunFactsForPage("/kennisbank")}
              variant="inline"
            />
          </div>

          <Reveal delay={0.06}>
            <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl border border-mm-border bg-mm-accent-subtle/60 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-lg font-extrabold text-mm-text">
                  Liever dat ik dit voor je regel?
                </p>
                <p className="mt-1 text-sm text-mm-muted">
                  Lezen is gratis, uitvoeren doe ik dagelijks. Vul de intake in
                  en we bespreken waar voor jou de winst zit.
                </p>
              </div>
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-mm-accent/25 transition hover:bg-mm-accent-hover"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
