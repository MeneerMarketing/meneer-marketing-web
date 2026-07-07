import type { Metadata } from "next";

import type { PillarPageData } from "@/data/pillar-pages";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

const PILLAR_OG_ACCENT: Record<PillarPageData["slug"], string> = {
  strategie: "FF5722",
  bouwen: "0284C7",
  vindbaarheid: "00BCD4",
  campagnes: "FF5722",
  behoud: "8D6E63",
};

export function buildPillarMetadata(data: PillarPageData): Metadata {
  return buildPageMetadata({
    title: data.metaTitle,
    titleAbsolute: true,
    description: data.metaDescription,
    path: `/${data.slug}`,
    keywords: [...data.keywords],
    ogAccent: PILLAR_OG_ACCENT[data.slug],
  });
}
