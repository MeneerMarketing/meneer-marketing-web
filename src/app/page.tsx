import type { Metadata } from "next";
import { AutomationSection } from "@/components/home/AutomationSection";
import { CasesPreviewSection } from "@/components/home/CasesPreviewSection";
import { DifferenceSection } from "@/components/home/DifferenceSection";
import { FunFactsSection } from "@/components/home/FunFactsSection";
import { GroeiscanSection } from "@/components/home/GroeiscanSection";
import { HeroSection } from "@/components/home/HeroSection";
import { InsightsPreviewSection } from "@/components/home/InsightsPreviewSection";
import { MeneerPeek } from "@/components/home/MeneerPeek";
import { ServicesOrigamiBento } from "@/components/home/ServicesOrigamiBento";
import { StrategicSignatureSection } from "@/components/home/StrategicSignatureSection";
import { ScrollCodeStream } from "@/components/effects/ScrollCodeStream";
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
        <ScrollCodeStream height={180} className="py-4" />
        <ServicesOrigamiBento />
        <FunFactsSection />
        <StrategicSignatureSection />
        <DifferenceSection />
        <MeneerPeek />
        <GroeiscanSection />
        <CasesPreviewSection />
        <AutomationSection />
        <InsightsPreviewSection />
      </main>
      <SiteFooter />
    </>
  );
}
