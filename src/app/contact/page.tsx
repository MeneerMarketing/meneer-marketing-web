import type { Metadata } from "next";
import { ContactChatExperience } from "@/components/contact/index/ContactChatExperience";
import { ContactIndexCta } from "@/components/contact/index/ContactIndexCta";
import { ContactIndexFaq } from "@/components/contact/index/ContactIndexFaq";
import { ContactIndexHero } from "@/components/contact/index/ContactIndexHero";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  contactPageJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CONTACT_FAQ } from "@/data/contact-index";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/contact";
const PAGE_TITLE = "Contact. Gewoon praten, geen formulier-gevoel";
const PAGE_DESCRIPTION =
  "Neem contact op met Meneer Marketing via een chat-achtig gesprek. Marketing, je site, Shopify, SEO, ads of gewoon sparren. Reactie binnen één à twee werkdagen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Contact | Meneer Marketing",
    description:
      "Typ alsof je me app't. Geen chatbot, geen CRM-automaat. Direct bij mij.",
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
        <ContactChatExperience />
        <ContactIndexFaq />
        <ContactIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
