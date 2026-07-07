import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomeEvenRechtzettenSection } from "@/components/home/premium/HomeEvenRechtzettenSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeUspBar } from "@/components/home/HomeUspBar";
import { InsightsPreviewSection } from "@/components/home/InsightsPreviewSection";
import { HomeMobileEditorialFlow } from "@/components/home/mobile/HomeMobileEditorialFlow";
import { HomeMobileStickyCta } from "@/components/home/mobile/HomeMobileStickyCta";
import { HomeAboutMeneerSection } from "@/components/home/premium/HomeAboutMeneerSection";
import { HomeCtaSection } from "@/components/home/premium/HomeCtaSection";
import { HomePillarsStrip } from "@/components/home/HomePillarsStrip";
import { HomeProofSection } from "@/components/home/premium/HomeProofSection";
import { HomeWhyMeneerSection } from "@/components/home/premium/HomeWhyMeneerSection";
import { JsonLdScript, webPageJsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
} from "@/lib/seo/site-metadata";
import { INDEXABLE_ROBOTS } from "@/lib/seo/robots-policy";

const HomeDesktopBouwenSection = dynamic(
  () =>
    import("@/components/home/desktop/HomeDesktopBouwenSection").then(
      (m) => m.HomeDesktopBouwenSection,
    ),
  { ssr: true },
);

const HomeDesktopAiBillboard = dynamic(
  () =>
    import("@/components/home/desktop/HomeDesktopAiBillboard").then(
      (m) => m.HomeDesktopAiBillboard,
    ),
  { ssr: true },
);

export const metadata: Metadata = {
  title: {
    absolute: HOME_PAGE_TITLE,
  },
  description: HOME_PAGE_DESCRIPTION,
  alternates: buildAlternates("/"),
  robots: INDEXABLE_ROBOTS,
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

        {/* Desktop: lichtere secties, geen zwaar kantoor of scroll-route */}
        <div className="hidden lg:block">
          <HomeDesktopBouwenSection />
          <HomeAboutMeneerSection />
          <HomeDesktopAiBillboard />
          <HomeProofSection />
          <HomePillarsStrip />
          <HomeWhyMeneerSection />
          <HomeEvenRechtzettenSection />
          <InsightsPreviewSection />
          <HomeCtaSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
