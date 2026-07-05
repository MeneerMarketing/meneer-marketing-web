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
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/werkwijze";
const PAGE_TITLE = "Werkwijze. Van intake tot opschalen, zonder standaardpakket";
const PAGE_DESCRIPTION =
  "Hoe Meneer Marketing werkt: eerst snappen, dan routekaart, bouwen from scratch, meten en sturen. Twaalf jaar ervaring, menselijke communicatie, SkinComplete en BestRest als voorbeeld.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Werkwijze | MeneerMarketing",
    description:
      "Geen copy-paste traject. Wel een proces met intake, routekaart, custom build en maandelijks sturen.",
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

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
