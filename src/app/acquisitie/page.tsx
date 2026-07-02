import type { Metadata } from "next";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.acquisitie;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/acquisitie") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/acquisitie"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function AcquisitiePage() {
  return <PillarLandingView data={data} />;
}
