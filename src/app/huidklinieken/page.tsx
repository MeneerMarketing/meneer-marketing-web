import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from "@/components/seo/JsonLd";
import { HuidkliniekenView } from "@/components/verticals/huidklinieken/HuidkliniekenView";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { resolveCampaignRef } from "@/lib/verticals/campaign-ref";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

const PAGE_PATH = HUIDKLINIEKEN_VERTICAL.path;
const seo = HUIDKLINIEKEN_VERTICAL.seo;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  keywords: [...seo.keywords],
  ogAccent: HUIDKLINIEKEN_VERTICAL.themeAccent,
});

interface PageProps {
  searchParams: Promise<{
    ref?: string | string[];
    checkout?: string | string[];
    payment?: string | string[];
  }>;
}

export default async function HuidkliniekenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const { ref, personalization } = await resolveCampaignRef(rawRef);
  const checkout = Array.isArray(params.checkout)
    ? params.checkout[0]
    : params.checkout;
  const rawPayment = Array.isArray(params.payment)
    ? params.payment[0]
    : params.payment;
  const checkoutPaymentId =
    checkout === "bedankt" && rawPayment && rawPayment !== "pending"
      ? rawPayment
      : null;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Huidklinieken", path: PAGE_PATH },
          ]),
          webPageJsonLd({
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
            dateModified: "2026-08-14",
          }),
          serviceJsonLd({
            name: "Website, Maps en intake-marketing voor huidklinieken",
            description:
              "Custom website voor huid- en cosmetische klinieken, lokale SEO, Google Business Profile en pad naar intake. Clinic Edition, Local Growth of Growth Partner. Eén partner per stad.",
            path: PAGE_PATH,
            areaServed: "Nederland",
          }),
          faqPageJsonLd(
            HUIDKLINIEKEN_VERTICAL.faq.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          ),
        ]}
      />
      <SiteHeader />
      <HuidkliniekenView
        personalization={personalization}
        campaignRef={ref}
        checkoutPaymentId={checkoutPaymentId}
      />
      <SiteFooter />
    </>
  );
}
