import type { Metadata } from "next";
import { CasesPreviewSection } from "@/components/home/CasesPreviewSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeUspBar } from "@/components/home/HomeUspBar";
import { InsightsPreviewSection } from "@/components/home/InsightsPreviewSection";
import { MeneerPeek } from "@/components/home/MeneerPeek";
import { ServicesOfficeSection } from "@/components/home/office/ServicesOfficeSection";
import { HomeContextSection } from "@/components/home/premium/HomeContextSection";
import { HomeCtaSection } from "@/components/home/premium/HomeCtaSection";
import { HomeGrowthRouteMap } from "@/components/home/premium/HomeGrowthRouteMap";
import { HomeProofSection } from "@/components/home/premium/HomeProofSection";
import { HomeSituationMatcher } from "@/components/home/premium/HomeSituationMatcher";
import { HomeWorkStagesScroll } from "@/components/home/premium/HomeWorkStagesScroll";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Home",
  description:
    "MeneerMarketing: marketing, SEO, Google Ads, social media en e-mailmarketing, plus high-end websites en Shopify-webshops. Groeistrategieën die resultaat opleveren.",
  openGraph: {
    title: "MeneerMarketing. Marketing, websites & Shopify",
    description:
      "Groeistrategieën en uitvoering: SEO, ads, social, e-mail en websites en shops op topniveau.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <HeroSection />
        <HomeUspBar />
        <ServicesOfficeSection />
        <HomeContextSection />
        <HomeGrowthRouteMap />
        <HomeSituationMatcher />
        <HomeWorkStagesScroll />
        <CasesPreviewSection />
        <HomeProofSection />
        <InsightsPreviewSection />
        <MeneerPeek />
        <HomeCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
