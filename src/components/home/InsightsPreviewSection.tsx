import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { ArticleCardIllustration } from "@/components/kennisbank/ArticleCardIllustration";
import { siteCtas } from "@/lib/cta";
import {
  getAllKennisbankArticles,
  getKennisbankCategory,
} from "@/lib/kennisbank";
import type { KennisbankArticle } from "@/data/kennisbank/articles";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function InsightArticleCard({ article }: { article: KennisbankArticle }) {
  const category = getKennisbankCategory(article.category);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mm-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/kennisbank/${article.slug}`}
        className="relative block overflow-hidden border-b border-mm-border/80"
      >
        <ArticleCardIllustration
          slug={article.slug}
          category={article.category}
          className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="inline-flex w-fit rounded-full bg-mm-sky-subtle/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
          {category?.name ?? "Kennisbank"}
        </span>
        <h3 className="mt-3 text-lg font-bold leading-snug text-mm-text sm:mt-4">
          <Link href={`/kennisbank/${article.slug}`} className="hover:text-mm-sky-deep">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mm-muted line-clamp-3 sm:line-clamp-none">
          {article.description}
        </p>
        <span className="mt-3 text-xs font-semibold text-mm-muted sm:mt-4">
          {formatDate(article.publishedAt)} · {article.readMinutes} min
        </span>
        <Link
          href={`/kennisbank/${article.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-mm-accent sm:mt-4"
        >
          Lees artikel
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function InsightsPreviewSection() {
  const articles = getAllKennisbankArticles().slice(0, 3);

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2
                id="insights-heading"
                className="text-3xl font-extrabold leading-[1.06] tracking-tighter text-balance text-mm-text sm:text-4xl"
              >
                De kennisbank.
                <span className="mt-2 block text-mm-sky-deep">
                  Alles wat ik weet,&nbsp;gratis.
                </span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                Van vindbaarheid in ChatGPT tot B2B verkopen via Shopify.
                Geschreven in gewone taal, zodat je er morgen iets mee kunt.
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
                href="/kennisbank"
                className="inline-flex items-center gap-1 rounded-full border border-mm-border bg-white px-5 py-2.5 text-sm font-bold text-mm-sky-deep transition hover:border-mm-sky/40"
                prefetch={false}
              >
                Naar de kennisbank
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="-mx-4 mt-8 sm:mx-0 sm:mt-12">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
            {articles.map((article, i) => (
              <li
                key={article.slug}
                className="w-[min(88vw,340px)] shrink-0 snap-center md:w-auto"
              >
                <Reveal delay={0.06 * i}>
                  <InsightArticleCard article={article} />
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-3 flex items-center justify-center gap-1 px-4 text-xs font-semibold text-mm-muted md:hidden">
            Swipe voor meer artikelen
            <ChevronRight className="size-3.5" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}
