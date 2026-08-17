import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { VerticalThankYouView } from "@/components/verticals/VerticalThankYouView";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo/robots-policy";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { parseThankYouSearchParams } from "@/lib/verticals/thank-you-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Bedankt voor je aanvraag",
  titleAbsolute: true,
  description: "Je aanvraag is ontvangen. Meneer Marketing neemt binnen 24 uur contact op.",
  path: "/pilates-studios/bedankt",
  robots: NOINDEX_FOLLOW_ROBOTS,
  ogAccent: PILATES_VERTICAL.themeAccent,
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PilatesThankYouPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const payload = parseThankYouSearchParams(params);

  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[60vh] bg-mm-bg">
        <VerticalThankYouView source="pilates-studios" payload={payload} />
      </main>
      <SiteFooter />
    </>
  );
}
