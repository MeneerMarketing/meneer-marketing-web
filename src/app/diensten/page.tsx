import type { Metadata } from "next";

import { DienstenApproachStrip } from "@/components/diensten/index/DienstenApproachStrip";
import { DienstenBureauChaos } from "@/components/diensten/index/DienstenBureauChaos";
import { DienstenCaseProof } from "@/components/diensten/index/DienstenCaseProof";
import { DienstenDiscoverMore } from "@/components/diensten/index/DienstenDiscoverMore";
import { DienstenFiveBlocks } from "@/components/diensten/index/DienstenFiveBlocks";
import { DienstenIndexCta } from "@/components/diensten/index/DienstenIndexCta";
import { DienstenIndexFaq } from "@/components/diensten/index/DienstenIndexFaq";
import { DienstenIndexHero } from "@/components/diensten/index/DienstenIndexHero";
import { DienstenPillarExplorer } from "@/components/diensten/index/DienstenPillarExplorer";
import { DienstenVolgordeBanner } from "@/components/diensten/index/DienstenVolgordeBanner";
import { DienstenWhyOnePartner } from "@/components/diensten/index/DienstenWhyOnePartner";
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
  DIENSTEN_FAQ,
} from "@/data/diensten-index";
import { megaMenuColumns } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

const PAGE_PATH = "/diensten";
const PAGE_TITLE =
  "Diensten · strategie, bouwen, SEO, Google Ads & Shopify | MeneerMarketing";
const PAGE_DESCRIPTION =
  "Vijf dienstenblokken onder één dak: strategie, websites from scratch, vindbaarheid in Google en AI, Google Ads, Meta Ads en behoud. Gevestigd in Apeldoorn, actief in heel Nederland.";

const collectionItems = megaMenuColumns.flatMap((col) =>
  col.items.map((item) => ({
    name: item.name,
    path: item.href,
  })),
);

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  titleAbsolute: true,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "marketing diensten",
    "google ads bureau",
    "seo bureau",
    "shopify webshop laten maken",
    "website laten bouwen",
    "online marketing apeldoorn",
    "marketingbureau nederland",
  ],
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
            name: PAGE_TITLE,
            description: DIENSTEN_EXPERT_SUMMARY,
            path: PAGE_PATH,
          }),
          collectionPageJsonLd({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
            items: collectionItems,
          }),
          faqPageJsonLd([...DIENSTEN_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <DienstenIndexHero />

        <DienstenBureauChaos />

        <DienstenFiveBlocks />

        <DienstenPillarExplorer />

        <DienstenVolgordeBanner />

        <DienstenCaseProof />

        <DienstenApproachStrip />

        <DienstenWhyOnePartner />

        <DienstenDiscoverMore />

        <DienstenIndexFaq />

        <DienstenIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
