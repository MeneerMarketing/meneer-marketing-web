import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { FlavourShowcase } from "@/components/flavour-showcase";
import { MenuSection } from "@/components/menu-section";
import { PressCards } from "@/components/press-cards";
import { TikTokTaste } from "@/components/tiktok-taste";
import { FollowGrid } from "@/components/follow-grid";
import { OrderSection } from "@/components/order-section";
import { SiteFooter } from "@/components/site-footer";
import { JsonLdScript } from "@/components/json-ld";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
  },
  twitter: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <JsonLdScript
        data={webPageJsonLd({
          path: "/",
          name: HOME_TITLE,
          description: HOME_DESCRIPTION,
        })}
      />
      <SiteHeader />
      <main>
        <Hero />
        <FlavourShowcase />
        <MenuSection />
        <PressCards />
        <TikTokTaste />
        <FollowGrid />
        <OrderSection />
      </main>
      <SiteFooter />
    </>
  );
}
