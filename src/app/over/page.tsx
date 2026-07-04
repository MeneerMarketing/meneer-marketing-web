import type { Metadata } from "next";
import { OverAntiBureauSection } from "@/components/over/index/OverAntiBureauSection";
import { OverCasesSection } from "@/components/over/index/OverCasesSection";
import { OverDayTimeline } from "@/components/over/index/OverDayTimeline";
import { OverIndexCta } from "@/components/over/index/OverIndexCta";
import { OverIndexFaq } from "@/components/over/index/OverIndexFaq";
import { OverIndexHero } from "@/components/over/index/OverIndexHero";
import { OverPrinciplesSection } from "@/components/over/index/OverPrinciplesSection";
import { OverStackExplorer } from "@/components/over/index/OverStackExplorer";
import { OverStorySection } from "@/components/over/index/OverStorySection";
import {
  JsonLdScript,
  aboutPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { MARKETING_FUN_FACTS } from "@/data/marketing-fun-facts";
import { OVER_FAQ } from "@/data/over-index";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/over";
const PAGE_TITLE = "Over Meneer Marketing. Strategie, bouw en campagnes onder één dak";
const PAGE_DESCRIPTION =
  "Wie Meneer Marketing is, hoe we werken en waarom groei een systeem is van strategie, websites from scratch, SEO, Google Ads, Meta Ads en automatisering. Eén partner, geen losse eindjes.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Over Meneer Marketing",
    description:
      "Geen groot bureau met lagen. Wel strategie, code en campagnes vanuit één brein.",
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

export default function OverPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Over", path: PAGE_PATH },
          ]),
          aboutPageJsonLd({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
          faqPageJsonLd([...OVER_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <OverIndexHero />

        <OverStorySection />

        <OverPrinciplesSection />

        <OverAntiBureauSection />

        <OverStackExplorer />

        <MarketingFunFactsRow
          title="Tussendoor een feitje"
          facts={[MARKETING_FUN_FACTS[2]!, MARKETING_FUN_FACTS[0]!]}
        />

        <OverDayTimeline />

        <OverCasesSection />

        <OverIndexFaq />

        <OverIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
