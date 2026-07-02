import type { Metadata } from "next";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { pillarPages } from "@/data/pillar-pages";
import { absoluteUrl } from "@/lib/site";

const data = pillarPages.vindbaarheid;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: absoluteUrl("/vindbaarheid") },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: absoluteUrl("/vindbaarheid"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function VindbaarheidPage() {
  return <PillarLandingView data={data} />;
}
