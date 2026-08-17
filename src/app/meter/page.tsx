import type { Metadata } from "next";
import { Suspense } from "react";
import { MeterExperience } from "@/components/meter/MeterExperience";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { JsonLdScript, breadcrumbJsonLd, webPageJsonLd } from "@/components/seo/JsonLd";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "De Meneer Meter",
  description:
    "Gratis website-scan: canonical tags, JSON-LD, render stack, lazyload, OG tags en conversie hooks in één technisch rapport.",
  alternates: { canonical: absoluteUrl("/meter") },
  openGraph: {
    title: `De Meneer Meter | ${BRAND_DISPLAY}`,
    description:
      "Plak je URL. Krijg een technische snapshot van je HTML response, render stack en indexeringssignalen.",
    url: absoluteUrl("/meter"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function MeterPage() {
  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "De Meneer Meter", path: "/meter" },
        ])}
      />
      <JsonLdScript
        data={webPageJsonLd({
          path: "/meter",
          name: "De Meneer Meter",
          description:
            "Gratis technische website-scan met canonical, structured data, performance stack en conversie signalen.",
          dateModified: "2026-08-17",
        })}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Suspense fallback={null}>
          <MeterExperience />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
