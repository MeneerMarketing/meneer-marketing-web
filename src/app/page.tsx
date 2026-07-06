import type { Metadata } from "next";
import { FunFactsSection } from "@/components/home/FunFactsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeUspBar } from "@/components/home/HomeUspBar";
import { InsightsPreviewSection } from "@/components/home/InsightsPreviewSection";
import { HomeMobileEditorialFlow } from "@/components/home/mobile/HomeMobileEditorialFlow";
import { HomeMobileStickyCta } from "@/components/home/mobile/HomeMobileStickyCta";
import { ServicesOfficeSection } from "@/components/home/office/ServicesOfficeSection";
import { HomeAboutMeneerSection } from "@/components/home/premium/HomeAboutMeneerSection";
import { HomeCtaSection } from "@/components/home/premium/HomeCtaSection";
import { HomeProofSection } from "@/components/home/premium/HomeProofSection";
import { HomeWhyMeneerSection } from "@/components/home/premium/HomeWhyMeneerSection";
import { HomeWorkStagesScroll } from "@/components/home/premium/HomeWorkStagesScroll";
import { JsonLdScript, webPageJsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  buildOpenGraph,
  buildTwitter,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
} from "@/lib/seo/site-metadata";

export const metadata: Metadata = {
  title: {
    absolute: HOME_PAGE_TITLE,
  },
  description: HOME_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOpenGraph({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    path: "/",
  }),
  twitter: buildTwitter({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  }),
};

export default function HomePage() {
  return (
    <>
      <JsonLdScript
        data={webPageJsonLd({
          name: HOME_PAGE_TITLE,
          description: HOME_PAGE_DESCRIPTION,
          path: "/",
        })}
      />
      <SiteHeader />
      <main id="main" className="flex-1 overflow-x-clip">
        <HeroSection />
        <HomeUspBar />
        <HomeMobileStickyCta />

        {/* Mobiel: editorial flow (< lg) */}
        <div className="lg:hidden">
          <HomeMobileEditorialFlow />
        </div>

        {/* Desktop: volledige homepage (>= lg) */}
        <div className="hidden lg:block">
          <ServicesOfficeSection />
          <HomeWorkStagesScroll />
          <HomeProofSection />
          <HomeWhyMeneerSection />
          <FunFactsSection />
          <InsightsPreviewSection />
          <HomeAboutMeneerSection />
          <HomeCtaSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
