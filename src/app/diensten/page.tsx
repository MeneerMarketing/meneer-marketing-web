import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getDienstenByPillar } from "@/lib/diensten";
import { ctaNav, megaMenuColumns } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diensten. Strategie, bouwen, vindbaarheid, campagnes & behoud",
  description:
    "Het volledige aanbod van MeneerMarketing: strategie, websites & webshops, SEO & AI-zoek, ads & creators en e-mail & retentie. Als één groeisysteem.",
  alternates: { canonical: absoluteUrl("/diensten") },
  openGraph: {
    title: "MeneerMarketing Diensten",
    description:
      "Vijf blokken, tientallen concrete trajecten. Van Shopify tot Google Ads, AI-zoek en e-mailflows.",
    url: absoluteUrl("/diensten"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function DienstenIndexPage() {
  const groups = getDienstenByPillar();

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-mm-border bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
              Aanbod
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
              Alles wat je nodig hebt om te{" "}
              <span className="text-mm-sky-deep">bouwen en groeien</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
              Vijf blokken met eigen verhaal. En hieronder elke dienst direct
              bereikbaar. Zo blijft overzicht en detail hand in hand.
            </p>
            <Link
              href={ctaNav.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-mm-accent px-5 py-3 text-sm font-bold text-white shadow-md shadow-mm-accent/25 hover:bg-mm-accent-hover"
            >
              {ctaNav.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="border-b border-mm-border bg-mm-sky-subtle/35">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <Reveal>
              <h2 className="text-xl font-extrabold text-mm-text sm:text-2xl">
                Kies je blok. Lees het volledige verhaal
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-mm-muted">
                Elk blok heeft een eigen pagina met proces, bewijs en alle
                gekoppelde diensten.
              </p>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {megaMenuColumns.map((col, i) => (
                <Reveal key={col.pillarSlug} delay={0.05 * i}>
                  <li>
                    <Link
                      href={`/${col.pillarSlug}`}
                      className="group flex h-full flex-col rounded-2xl border border-mm-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mm-sky/35 hover:shadow-md"
                    >
                      <span className="text-lg font-extrabold text-mm-text group-hover:text-mm-sky-deep">
                        {col.category}
                      </span>
                      <span className="mt-1 text-xs font-semibold text-mm-sky-deep">
                        {col.subtitle}
                      </span>
                      <span className="mt-3 flex-1 text-sm leading-relaxed text-mm-muted">
                        {col.featured.description}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mm-accent">
                        Blok openen
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-mm-surface/40">
          <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            {groups.map((g, gi) => (
              <Reveal key={g.pillar} delay={0.04 * gi}>
                <div>
                  <h2 className="text-2xl font-extrabold text-mm-text">
                    {g.pillar}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-mm-sky-deep">
                    {g.subtitle}
                  </p>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.diensten.map((d) => (
                      <li key={d.slug}>
                        <Link
                          href={`/diensten/${d.slug}`}
                          className="group flex h-full flex-col rounded-2xl border border-mm-border bg-white p-5 shadow-sm transition hover:border-mm-sky/35 hover:shadow-md"
                        >
                          <span className="text-base font-bold text-mm-text group-hover:text-mm-sky-deep">
                            {d.name}
                          </span>
                          <span className="mt-2 flex-1 text-sm leading-relaxed text-mm-muted">
                            {d.description}
                          </span>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mm-accent">
                            Bekijk dienst
                            <ArrowUpRight className="size-4" aria-hidden />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
