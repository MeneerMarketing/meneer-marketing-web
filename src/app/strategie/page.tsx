import type { Metadata } from "next";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.strategie;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/strategie") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/strategie"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function StrategiePage() {
  return <PillarLandingView data={data} />;
}
