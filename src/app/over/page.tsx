import type { Metadata } from "next";
import { OverAntiBureauSection } from "@/components/over/index/OverAntiBureauSection";
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
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { OVER_FAQ } from "@/data/over-index";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/over";
const PAGE_TITLE = "Over Meneer Marketing. Strategie, bouw en campagnes onder één dak";
const PAGE_DESCRIPTION =
  "Afgestudeerd als applicatieontwikkelaar, meer dan tien jaar webdesign en marketing. Meneer Marketing helpt bedrijven groeien en meer omzet halen. Van strategie en websites from scratch tot SEO, Google Ads en Meta Ads.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Over Meneer Marketing",
    description:
      "Van applicatieontwikkelaar naar online groeipartner. Meer dan tien jaar ervaring, focus op omzet en resultaat.",
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
          facts={getFunFactsForPage("/over")}
        />

        <OverDayTimeline />

        <OverIndexFaq />

        <OverIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
