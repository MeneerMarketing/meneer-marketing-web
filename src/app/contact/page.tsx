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
  localBusinessJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PartnerCredentialsStrip } from "@/components/site/PartnerCredentialsStrip";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CONTACT_FAQ } from "@/data/contact-index";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/contact";
const seo = HUB_PAGE_SEO.contact;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  ogAccent: seo.ogAccent,
});

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
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
          }),
          faqPageJsonLd([...CONTACT_FAQ]),
          localBusinessJsonLd(),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <ContactIndexHero />
        <ContactChatExperience />

        <section className="border-b border-slate-200 bg-white py-12 lg:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <PartnerCredentialsStrip variant="on-light" />
          </div>
        </section>

        <ContactIndexFaq />
        <ContactIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
