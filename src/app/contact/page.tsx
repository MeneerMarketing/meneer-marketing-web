import type { Metadata } from "next";
import { ContactFormSection } from "@/components/contact/index/ContactFormSection";
import { ContactIndexCta } from "@/components/contact/index/ContactIndexCta";
import { ContactIndexFaq } from "@/components/contact/index/ContactIndexFaq";
import { ContactIndexHero } from "@/components/contact/index/ContactIndexHero";
import { ContactTopicGuide } from "@/components/contact/index/ContactTopicGuide";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  contactPageJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CONTACT_FAQ } from "@/data/contact-index";
import { MARKETING_FUN_FACTS } from "@/data/marketing-fun-facts";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/contact";
const PAGE_TITLE = "Contact. Persoonlijk, snel en zonder CRM-automaat";
const PAGE_DESCRIPTION =
  "Neem contact op met Meneer Marketing voor strategie, websites from scratch, Shopify, SEO, Google Ads, Meta Ads en automatisering. Reactie binnen één à twee werkdagen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Contact | Meneer Marketing",
    description:
      "Plan een gesprek of stuur je vraag. Elk traject is op maat, geen standaardpakket.",
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: PAGE_PATH },
          ]),
          contactPageJsonLd({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
          faqPageJsonLd([...CONTACT_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <ContactIndexHero />

        <ContactFormSection />

        <MarketingFunFactsRow
          title="Tussendoor een feitje"
          facts={[MARKETING_FUN_FACTS[1]!, MARKETING_FUN_FACTS[3]!]}
        />

        <ContactTopicGuide />

        <ContactIndexFaq />

        <ContactIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
