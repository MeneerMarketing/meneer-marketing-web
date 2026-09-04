import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MatchaLanding } from "@/components/seo/matcha-landing";
import { JsonLdScript } from "@/components/json-ld";
import {
  MATCHA_LANDING_DESCRIPTION,
  MATCHA_LANDING_TITLE,
  MATCHA_FAQS,
  breadcrumbJsonLd,
  faqPageJsonLdForPath,
  matchaOfferListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: MATCHA_LANDING_TITLE },
  description: MATCHA_LANDING_DESCRIPTION,
  alternates: { canonical: "/matcha-enschede" },
  openGraph: {
    title: MATCHA_LANDING_TITLE,
    description: MATCHA_LANDING_DESCRIPTION,
    url: "/matcha-enschede",
    type: "website",
    locale: "nl_NL",
    images: [{ url: "/photos/hero-pour.png", width: 1200, height: 1500, alt: "Strawberry matcha Enschede bij Lá Sweet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: MATCHA_LANDING_TITLE,
    description: MATCHA_LANDING_DESCRIPTION,
    images: ["/photos/hero-pour.png"],
  },
  keywords: [
    "matcha enschede",
    "strawberry matcha enschede",
    "iced matcha enschede",
    "matcha bestellen enschede",
    "lá sweet matcha",
  ],
};

export default function MatchaEnschedePage() {
  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            path: "/matcha-enschede",
            name: MATCHA_LANDING_TITLE,
            description: MATCHA_LANDING_DESCRIPTION,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matcha Enschede", path: "/matcha-enschede" },
          ]),
          faqPageJsonLdForPath("/matcha-enschede", MATCHA_FAQS),
          matchaOfferListJsonLd(),
        ]}
      />
      <SiteHeader />
      <main>
        <MatchaLanding />
      </main>
      <SiteFooter />
    </>
  );
}
