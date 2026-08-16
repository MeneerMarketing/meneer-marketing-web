import type { Metadata } from "next";
import { MeterExperience } from "@/components/meter/MeterExperience";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "De Meneer Meter",
  description:
    "Scan je website in 30 seconden. Vier scores, één eindcijfer, één droog oordeel van Meneer Marketing.",
  alternates: { canonical: absoluteUrl("/meter") },
  openGraph: {
    title: `De Meneer Meter | ${BRAND_DISPLAY}`,
    description:
      "Plak je URL. Krijg design, vindbaarheid, conversie en snelheid in één eerlijk rapport.",
    url: absoluteUrl("/meter"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function MeterPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <MeterExperience />
      </main>
      <SiteFooter />
    </>
  );
}
