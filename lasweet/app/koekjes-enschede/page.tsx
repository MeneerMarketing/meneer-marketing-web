import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KoekjesLanding } from "@/components/seo/koekjes-landing";
import { JsonLdScript } from "@/components/json-ld";
import {
  COOKIES_LANDING_DESCRIPTION,
  COOKIES_LANDING_TITLE,
  COOKIES_FAQS,
  breadcrumbJsonLd,
  cookieFlavourListJsonLd,
  faqPageJsonLdForPath,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: COOKIES_LANDING_TITLE },
  description: COOKIES_LANDING_DESCRIPTION,
  alternates: { canonical: "/koekjes-enschede" },
  openGraph: {
    title: COOKIES_LANDING_TITLE,
    description: COOKIES_LANDING_DESCRIPTION,
    url: "/koekjes-enschede",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/photos/cookie-halves.png",
        width: 1200,
        height: 1500,
        alt: "Crumble cookies Enschede van Lá Sweet by Ela",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COOKIES_LANDING_TITLE,
    description: COOKIES_LANDING_DESCRIPTION,
    images: ["/photos/cookie-halves.png"],
  },
  keywords: [
    "koekjes enschede",
    "cookies enschede",
    "crumble cookies enschede",
    "cookie box enschede",
    "lá sweet cookies",
  ],
};

export default function KoekjesEnschedePage() {
  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            path: "/koekjes-enschede",
            name: COOKIES_LANDING_TITLE,
            description: COOKIES_LANDING_DESCRIPTION,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Koekjes Enschede", path: "/koekjes-enschede" },
          ]),
          faqPageJsonLdForPath("/koekjes-enschede", COOKIES_FAQS),
          cookieFlavourListJsonLd(),
        ]}
      />
      <SiteHeader />
      <main>
        <KoekjesLanding />
      </main>
      <SiteFooter />
    </>
  );
}
