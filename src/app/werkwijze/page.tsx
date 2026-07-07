import type { Metadata } from "next";
import { WerkwijzeClientPathsSection } from "@/components/werkwijze/WerkwijzeClientPathsSection";
import {
  WerkwijzeCtaSection,
  WerkwijzeFaqSection,
} from "@/components/werkwijze/WerkwijzeFaqCta";
import { WerkwijzeHero } from "@/components/werkwijze/WerkwijzeHero";
import { WerkwijzeInboxSection } from "@/components/werkwijze/WerkwijzeInboxSection";
import { WerkwijzeNotSection } from "@/components/werkwijze/WerkwijzeNotSection";
import { WerkwijzeProcessSection } from "@/components/werkwijze/WerkwijzeProcessSection";
import { WerkwijzeSprintSection } from "@/components/werkwijze/WerkwijzeSprintSection";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { WERKWIJZE_FAQ } from "@/data/werkwijze-index";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/werkwijze";
const seo = HUB_PAGE_SEO.werkwijze;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  ogAccent: seo.ogAccent,
});

export default function WerkwijzePage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Werkwijze", path: PAGE_PATH },
          ]),
          faqPageJsonLd([...WERKWIJZE_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <WerkwijzeHero />

        <WerkwijzeProcessSection />

        <WerkwijzeSprintSection />

        <WerkwijzeClientPathsSection />

        <WerkwijzeInboxSection />

        <WerkwijzeNotSection />

        <MarketingFunFactsRow
          title="Tussendoor: feitjes die je route scherper maken"
          facts={getFunFactsForPage("/werkwijze")}
        />

        <WerkwijzeFaqSection />

        <WerkwijzeCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
