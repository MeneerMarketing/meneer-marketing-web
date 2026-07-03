import type { Metadata } from "next";
import { PillarPageView } from "@/components/pillars/PillarPageView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.campagnes;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/campagnes") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/campagnes"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function CampagnesPage() {
  return <PillarPageView data={data} />;
}
