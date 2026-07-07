import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ZoekenIndexExplorer } from "@/components/seo-landing/ZoekenIndexExplorer";
import { JsonLdScript, collectionPageJsonLd } from "@/components/seo/JsonLd";
import { getAllSeoLandingPages } from "@/data/seo-landings/registry";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";

const seo = HUB_PAGE_SEO.zoeken;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: "/zoeken",
  keywords: seo.keywords ? [...seo.keywords] : undefined,
  ogAccent: seo.ogAccent,
});

export default function ZoekenIndexPage() {
  const pages = getAllSeoLandingPages();

  const toListItem = (page: (typeof pages)[number]) => ({
    slug: page.slug,
    primaryKeyword: page.primaryKeyword,
    city: page.location?.city,
    region: page.location?.region,
  });

  const national = pages.filter((p) => !p.location).map(toListItem);
  const local = pages.filter((p) => p.location).map(toListItem);

  const collectionLd = collectionPageJsonLd({
    name: "Zoeken per dienst en regio",
    description:
      "SEO-landingspagina's van Meneer Marketing per zoekwoord, stad en regio in Nederland.",
    path: "/zoeken",
    items: pages.slice(0, 50).map((p) => ({
      name: p.primaryKeyword,
      path: `/zoeken/${p.slug}`,
    })),
  });

  return (
    <>
      <JsonLdScript data={collectionLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-slate-200 bg-white py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Vindbaarheid
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Zoek per dienst of regio.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Elke pagina is een antwoord op een echte zoekvraag. Google Ads, SEO, Shopify,
              webshops. Landelijk of met stad erbij. Apeldoorn is thuisbasis.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-50/80 to-white py-12 lg:py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Suspense fallback={<p className="text-slate-500">Pagina&apos;s laden…</p>}>
              <ZoekenIndexExplorer national={national} local={local} />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
