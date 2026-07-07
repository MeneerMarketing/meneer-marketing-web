import type { Metadata } from "next";

import { DienstenCaseProof } from "@/components/diensten/index/DienstenCaseProof";
import { DienstenIndexCta } from "@/components/diensten/index/DienstenIndexCta";
import { DienstenIndexFaq } from "@/components/diensten/index/DienstenIndexFaq";
import { DienstenIndexHero } from "@/components/diensten/index/DienstenIndexHero";
import { DienstenFiveSnap } from "@/components/diensten/hub/DienstenFiveSnap";
import { DienstenHubJumpNav } from "@/components/diensten/hub/DienstenHubJumpNav";
import { DienstenHubPillars } from "@/components/diensten/hub/DienstenHubPillars";
import { DienstenSkinCompleteBeat } from "@/components/diensten/hub/DienstenSkinCompleteBeat";
import { DienstenWakeUpCall } from "@/components/diensten/hub/DienstenWakeUpCall";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  DIENSTEN_EXPERT_SUMMARY,
  DIENSTEN_HUB_FAQ,
} from "@/data/diensten-hub";
import { megaMenuColumns } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";

const PAGE_PATH = "/diensten";
const seo = HUB_PAGE_SEO.diensten;

const collectionItems = megaMenuColumns.flatMap((col) =>
  col.items.map((item) => ({
    name: item.name,
    path: item.href,
  })),
);

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  keywords: seo.keywords ? [...seo.keywords] : undefined,
  ogAccent: seo.ogAccent,
});

export default function DienstenIndexPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Diensten", path: PAGE_PATH },
          ]),
          webPageJsonLd({
            name: seo.title,
            description: DIENSTEN_EXPERT_SUMMARY,
            path: PAGE_PATH,
          }),
          collectionPageJsonLd({
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
            items: collectionItems,
          }),
          faqPageJsonLd([...DIENSTEN_HUB_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1 overflow-x-clip">
        <DienstenIndexHero />
        <DienstenFiveSnap />
        <DienstenHubJumpNav />
        <DienstenWakeUpCall />
        <DienstenHubPillars />
        <DienstenSkinCompleteBeat />
        <DienstenCaseProof />
        <DienstenIndexFaq />
        <DienstenIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
