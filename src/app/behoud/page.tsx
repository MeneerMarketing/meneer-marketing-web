import type { Metadata } from "next";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.behoud;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/behoud") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/behoud"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function BehoudPage() {
  return <PillarLandingView data={data} />;
}
