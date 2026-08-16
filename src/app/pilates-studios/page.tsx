import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from "@/components/seo/JsonLd";
import { PilatesStudiosView } from "@/components/verticals/pilates/PilatesStudiosView";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { resolveCampaignRef } from "@/lib/verticals/campaign-ref";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

const PAGE_PATH = PILATES_VERTICAL.path;
const seo = PILATES_VERTICAL.seo;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  keywords: [...seo.keywords],
  ogAccent: PILATES_VERTICAL.themeAccent,
});

interface PageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

export default async function PilatesStudiosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const { ref, personalization } = await resolveCampaignRef(rawRef);

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pilates studio's", path: PAGE_PATH },
          ]),
          webPageJsonLd({
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
            dateModified: "2026-08-12",
          }),
          serviceJsonLd({
            name: "Website, SEO en marketing voor Pilates studio's",
            description:
              "High-end Pilates studio website, lokale SEO, Google Ads-beheer en boekingsflow. Studio Edition, Local Growth of Growth Partner. Één partner per stad.",
            path: PAGE_PATH,
            areaServed: "Nederland",
          }),
          faqPageJsonLd(
            PILATES_VERTICAL.faq.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          ),
        ]}
      />
      <SiteHeader />
      <PilatesStudiosView
        personalization={personalization}
        campaignRef={ref}
      />
      <SiteFooter />
    </>
  );
}
