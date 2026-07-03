import type { Metadata } from "next";
import { ServicesOfficeSection } from "@/components/home/office/ServicesOfficeSection";
import { HomeGrowthRouteMap } from "@/components/home/premium/HomeGrowthRouteMap";
import { DienstenApproachStrip } from "@/components/diensten/index/DienstenApproachStrip";
import { DienstenIndexCta } from "@/components/diensten/index/DienstenIndexCta";
import { DienstenIndexFaq } from "@/components/diensten/index/DienstenIndexFaq";
import { DienstenIndexHero } from "@/components/diensten/index/DienstenIndexHero";
import { DienstenPillarExplorer } from "@/components/diensten/index/DienstenPillarExplorer";
import { DienstenWhyOnePartner } from "@/components/diensten/index/DienstenWhyOnePartner";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DIENSTEN_FAQ } from "@/data/diensten-index";
import { megaMenuColumns } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/diensten";
const PAGE_TITLE = "Diensten. Strategie, bouwen, vindbaarheid, campagnes & behoud";
const PAGE_DESCRIPTION =
  "Het volledige aanbod van Meneer Marketing: strategie, websites from scratch, Shopify, SEO, vindbaarheid in AI, Google Ads, Meta Ads, e-mail en automatisering. Vijf blokken, één partner.";

const collectionItems = megaMenuColumns.flatMap((col) =>
  col.items.map((item) => ({
    name: item.name,
    path: item.href,
  })),
);

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Diensten | Meneer Marketing",
    description:
      "Vijf hoofdblokken, tientallen trajecten. Van Shopify en custom build tot Google Ads, SEO en e-mailflows.",
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

export default function DienstenIndexPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Diensten", path: PAGE_PATH },
          ]),
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

        <div id="kantoor">
          <ServicesOfficeSection />
        </div>

        <HomeGrowthRouteMap />

        <DienstenPillarExplorer />

        <DienstenApproachStrip />

        <DienstenWhyOnePartner />

        <DienstenIndexFaq />

        <DienstenIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
