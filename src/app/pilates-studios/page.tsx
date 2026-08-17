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
import { PilatesStudiosView } from "@/components/verticals/pilates/PilatesStudiosView";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { resolveCampaignRef } from "@/lib/verticals/campaign-ref";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

const PAGE_PATH = PILATES_VERTICAL.path;
const seo = PILATES_VERTICAL.seo;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  keywords: [...seo.keywords],
  ogAccent: PILATES_VERTICAL.themeAccent,
});

interface PageProps {
  searchParams: Promise<{
    ref?: string | string[];
    checkout?: string | string[];
    payment?: string | string[];
  }>;
}

export default async function PilatesStudiosPage({ searchParams }: PageProps) {
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
            { name: "Pilates studio's", path: PAGE_PATH },
          ]),
          webPageJsonLd({
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
            datePublished: "2026-08-12",
            dateModified: "2026-08-17",
          }),
          serviceJsonLd({
            name: "Pilates website laten maken, SEO en marketing",
            description:
              "Pilates website from scratch, lokale SEO op pilates plus jouw stad, Google Ads-beheer en boekingsflow. Studio Edition, Local Growth of Growth Partner.",
            path: PAGE_PATH,
            areaServed: "Nederland",
            serviceType: "Website laten maken voor Pilates studio's",
          }),
          faqPageJsonLd(
            PILATES_VERTICAL.faq.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          ),
        ]}
      />
      <SiteHeader />
      <PilatesStudiosView
        personalization={personalization}
        campaignRef={ref}
        checkoutPaymentId={checkoutPaymentId}
      />
      <SiteFooter />
    </>
  );
}
