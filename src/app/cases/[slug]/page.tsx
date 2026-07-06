import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/cases/CaseDetailView";
import {
  JsonLdScript,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllCaseSlugs, getCaseBySlug } from "@/data/cases-detail";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return { title: "Case" };

  const title = `Case ${c.client} · ${c.story.punch} | MeneerMarketing`;
  return buildPageMetadata({
    title,
    titleAbsolute: true,
    description: `${c.story.hook} ${c.story.meneerLine}`,
    path: `/cases/${slug}`,
    keywords: [...c.tags],
    ogAccent: c.palette.accent.replace("#", ""),
  });
}

function caseStudyJsonLd(c: NonNullable<ReturnType<typeof getCaseBySlug>>) {
  const url = absoluteUrl(`/cases/${c.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.client}: ${c.title}`,
    description: c.story.punch,
    url,
    author: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    about: {
      "@type": "Organization",
      name: c.client,
      ...(c.website ? { url: c.website.url } : {}),
    },
    inLanguage: "nl-NL",
  };
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseData = getCaseBySlug(slug);
  if (!caseData) notFound();

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cases", path: "/cases" },
            { name: caseData.client, path: `/cases/${slug}` },
          ]),
          caseStudyJsonLd(caseData),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <CaseDetailView caseData={caseData} />
      </main>
      <SiteFooter />
    </>
  );
}
