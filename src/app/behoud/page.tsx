import type { Metadata } from "next";
import { PillarPageView } from "@/components/pillars/PillarPageView";
import { pillarPages } from "@/data/pillar-pages";
import { buildPillarMetadata } from "@/lib/seo/pillar-metadata";

const data = pillarPages.behoud;

export const metadata: Metadata = buildPillarMetadata(data);

export default function BehoudPage() {
  return <PillarPageView data={data} />;
}
