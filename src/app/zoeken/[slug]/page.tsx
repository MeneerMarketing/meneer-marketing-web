import { notFound } from "next/navigation";
import { SeoLandingPageView } from "@/components/seo-landing/SeoLandingPageView";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  buildSeoLandingMetadata,
  getAllSeoLandingSlugs,
  getSeoLandingBySlug,
  seoLandingPath,
} from "@/lib/seo-landings";

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

export default async function ZoekenLandingPage({ params }: ZoekenPageProps) {
  const { slug } = await params;
  const page = getSeoLandingBySlug(slug);
  if (!page) notFound();

  const path = seoLandingPath(slug);
  const areaServed = page.location
    ? { "@type": "City" as const, name: page.location.city }
    : "NL";

  const serviceLd = serviceJsonLd({
    name: page.primaryKeyword,
    description: page.metaDescription,
    path,
    areaServed,
  });

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Zoeken", path: "/zoeken" },
    { name: page.primaryKeyword, path },
  ]);

  const faqLd = faqPageJsonLd([...page.faq]);

  return (
    <>
      <JsonLdScript data={serviceLd} />
      <JsonLdScript data={breadcrumbLd} />
      <JsonLdScript data={faqLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <SeoLandingPageView page={page} />
      </main>
      <SiteFooter />
    </>
  );
}
