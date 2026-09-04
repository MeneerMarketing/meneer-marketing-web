import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactPage } from "@/components/contact-page";
import { JsonLdScript } from "@/components/json-ld";
import {
  CONTACT_DESCRIPTION,
  CONTACT_TITLE,
  breadcrumbJsonLd,
  contactPageJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: CONTACT_TITLE,
  },
  description: CONTACT_DESCRIPTION,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    url: "/contact",
  },
  twitter: {
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
  },
};

export default function Contact() {
  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            path: "/contact",
            name: CONTACT_TITLE,
            description: CONTACT_DESCRIPTION,
          }),
          contactPageJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <SiteHeader />
      <main>
        <ContactPage />
      </main>
      <SiteFooter />
    </>
  );
}
