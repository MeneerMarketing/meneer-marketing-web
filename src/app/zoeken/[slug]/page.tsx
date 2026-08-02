import { notFound } from "next/navigation";

import { SeoLandingPageView } from "@/components/seo-landing/SeoLandingPageView";
import { JsonLdScript, seoLandingPageGraph } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  buildSeoLandingMetadata,
  getAllSeoLandingSlugs,
  getSeoLandingBySlug,
  seoLandingPath,
} from "@/lib/seo-landings";
import { resolveSeoLandingNav } from "@/lib/seo-landing-nav";

interface ZoekenPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSeoLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ZoekenPageProps) {
  const { slug } = await params;
  const page = getSeoLandingBySlug(slug);
  if (!page) return {};
  return buildSeoLandingMetadata(page);
}

const SERVICE_TYPE_BY_CATEGORY: Record<string, string> = {
  "google-ads": "Google Ads beheer",
  seo: "Zoekmachine optimalisatie",
  website: "Website ontwikkeling",
  shopify: "Shopify webshop",
  content: "Contentmarketing",
  "b2b-portal": "B2B automatisering",
};

export default async function ZoekenLandingPage({ params }: ZoekenPageProps) {
  const { slug } = await params;
  const page = getSeoLandingBySlug(slug);
  if (!page) notFound();

  const path = seoLandingPath(slug);
  const nav = resolveSeoLandingNav(page);
  const areaServed = page.location
    ? { "@type": "City" as const, name: page.location.city }
    : "NL";

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Zoeken", path: "/zoeken" },
    ...(page.location
      ? [
          {
            name: page.location.city,
            path: `/zoeken?stad=${encodeURIComponent(page.location.city.toLowerCase())}`,
          },
        ]
      : []),
    { name: page.primaryKeyword, path },
  ];

  const graphLd = seoLandingPageGraph({
    name: page.primaryKeyword,
    headline: `${page.headline}${page.headlineAccent ? ` ${page.headlineAccent}` : ""}`,
    description: page.metaDescription,
    path,
    breadcrumbs,
    faqs: [...page.schemaFaqs],
    areaServed,
    serviceType: SERVICE_TYPE_BY_CATEGORY[page.category],
    isApeldoornHQ: page.location?.city === "Apeldoorn",
  });

  return (
    <>
      <JsonLdScript data={graphLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <SeoLandingPageView page={page} {...nav} />
      </main>
      <SiteFooter />
    </>
  );
}
