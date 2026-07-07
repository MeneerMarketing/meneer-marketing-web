import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/cases/CaseDetailView";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  caseStudyJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllCaseSlugs, getCaseBySlug } from "@/data/cases-detail";
import { absoluteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { getCaseSeo } from "@/lib/seo/case-seo";

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

  const seo = getCaseSeo(slug);
  const title =
    seo?.title ?? `Case ${c.client} | ${c.story.punch} | Meneer Marketing`;
  const description =
    seo?.description ?? `${c.story.hook} ${c.story.meneerLine}`;

  return buildPageMetadata({
    title,
    titleAbsolute: true,
    description,
    path: `/cases/${slug}`,
    keywords: [...c.tags],
    ogAccent: c.palette.accent.replace("#", ""),
  });
}

function caseStudySchema(
  c: NonNullable<ReturnType<typeof getCaseBySlug>>,
  seo: ReturnType<typeof getCaseSeo>,
) {
  const url = absoluteUrl(`/cases/${c.id}`);
  const image = c.previewPoster ?? c.previewImage;
  return caseStudyJsonLd({
    client: c.client,
    headline: `${c.client}: ${c.title}`,
    description: seo?.description ?? c.story.punch,
    url,
    datePublished: seo?.publishedAt ?? "2025-01-01",
    dateModified: seo?.dateModified ?? seo?.publishedAt,
    image,
    keywords: c.tags,
    clientWebsite: c.website?.url,
  });
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseData = getCaseBySlug(slug);
  if (!caseData) notFound();

  const seo = getCaseSeo(slug);

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cases", path: "/cases" },
            { name: caseData.client, path: `/cases/${slug}` },
          ]),
          caseStudySchema(caseData, seo),
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
