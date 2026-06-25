import type { Metadata } from "next";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.automatiseren;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/automatiseren") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/automatiseren"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function AutomatiserenPage() {
  return <PillarLandingView data={data} />;
}
