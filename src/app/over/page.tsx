import type { Metadata } from "next";
import { OverAntiBureauSection } from "@/components/over/index/OverAntiBureauSection";
import { OverDayTimeline } from "@/components/over/index/OverDayTimeline";
import { OverIndexCta } from "@/components/over/index/OverIndexCta";
import { OverIndexFaq } from "@/components/over/index/OverIndexFaq";
import { OverIndexHero } from "@/components/over/index/OverIndexHero";
import { OverImpactSection } from "@/components/over/index/OverImpactSection";
import { OverPrinciplesSection } from "@/components/over/index/OverPrinciplesSection";
import { OverStackExplorer } from "@/components/over/index/OverStackExplorer";
import { OverStorySection } from "@/components/over/index/OverStorySection";
import {
  JsonLdScript,
  aboutPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  personJsonLd,
} from "@/components/seo/JsonLd";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { OVER_FAQ } from "@/data/over-index";
import { FOUNDER_EXPERIENCE, organizationTrustLine } from "@/lib/seo/e-e-a-t";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/over";
const seo = HUB_PAGE_SEO.over;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  ogAccent: seo.ogAccent,
});

export default function OverPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Over", path: PAGE_PATH },
          ]),
          aboutPageJsonLd({
            name: seo.title,
            description: seo.description,
            path: PAGE_PATH,
          }),
          personJsonLd({
            url: absoluteUrl(PAGE_PATH),
          }),
          faqPageJsonLd([...OVER_FAQ]),
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <OverIndexHero />

        <div className="border-b border-slate-200 bg-slate-50 py-4">
          <p className="mx-auto max-w-6xl px-4 text-center text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">
            {organizationTrustLine} · {FOUNDER_EXPERIENCE} · één aanspreekpunt, geen postbus-bureau
          </p>
        </div>

        <OverStorySection />

        <OverPrinciplesSection />

        <OverAntiBureauSection />

        <OverStackExplorer />

        <OverImpactSection />

        <MarketingFunFactsRow
          title="Tussendoor een feitje"
          facts={getFunFactsForPage("/over")}
        />

        <OverDayTimeline />

        <OverIndexFaq />

        <OverIndexCta />
      </main>
      <SiteFooter />
    </>
  );
}
