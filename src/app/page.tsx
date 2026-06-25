import type { Metadata } from "next";
import { AutomationSection } from "@/components/home/AutomationSection";
import { CasesPreviewSection } from "@/components/home/CasesPreviewSection";
import { DifferenceSection } from "@/components/home/DifferenceSection";
import { GroeiscanSection } from "@/components/home/GroeiscanSection";
import { HeroSection } from "@/components/home/HeroSection";
import { InsightsPreviewSection } from "@/components/home/InsightsPreviewSection";
import { ServicesOrigamiBento } from "@/components/home/ServicesOrigamiBento";
import { StrategicSignatureSection } from "@/components/home/StrategicSignatureSection";
import { ScrollCodeStream } from "@/components/effects/ScrollCodeStream";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Home",
  description:
    "MeneerMarketing: groei met maatwerk websites, Shopify, SEO, ads, e-mailmarketing en automatisering. Start je Groeiscan of intake. Wij bouwen het systeem achter je succes.",
  openGraph: {
    title: "MeneerMarketing. Groei, web & automatisering",
    description:
      "Strategisch partner voor webshops, sites en marketing die wél schaalbaar zijn.",
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
        <StrategicSignatureSection />
        <DifferenceSection />
        <GroeiscanSection />
        <CasesPreviewSection />
        <AutomationSection />
        <InsightsPreviewSection />
      </main>
      <SiteFooter />
    </>
  );
}
