import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ZoekenIndexExplorer } from "@/components/seo-landing/ZoekenIndexExplorer";
import { JsonLdScript, collectionPageJsonLd } from "@/components/seo/JsonLd";
import { getAllSeoLandingPages } from "@/data/seo-landings/registry";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Zoeken · diensten & regio | MeneerMarketing",
  titleAbsolute: true,
  description:
    "Landingspagina's per zoekwoord en regio: Google Ads Arnhem, SEO Nijmegen, webshops Gelderland, Brabant en meer. Meneer Marketing, online groei from scratch.",
  path: "/zoeken",
  keywords: [
    "google ads arnhem",
    "seo nijmegen",
    "online marketing gelderland",
    "marketing bureau brabant",
    "zoekmachine optimalisatie regio",
  ],
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
        <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Vindbaarheid
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
              Waar mensen op zoeken. Waar jij gevonden wilt worden.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              Per zoekwoord en regio een pagina die rankt én converteert. Thuisbasis Apeldoorn,
              daarnaast Randstad, Brabant, Limburg, Gelderland en meer. Geen dun SEO-prutswerk, wel
              Meneer Marketing: scherp, eerlijk, soms een beetje droog grappig.
            </p>
          </div>
        </section>

        <section className="py-14">
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
