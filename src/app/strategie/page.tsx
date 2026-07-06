import type { Metadata } from "next";
import { PillarPageView } from "@/components/pillars/PillarPageView";
import { pillarPages } from "@/data/pillar-pages";
import { buildPillarMetadata } from "@/lib/seo/pillar-metadata";

const data = pillarPages.strategie;

export const metadata: Metadata = buildPillarMetadata(data);

export default function StrategiePage() {
  return <PillarPageView data={data} />;
}
