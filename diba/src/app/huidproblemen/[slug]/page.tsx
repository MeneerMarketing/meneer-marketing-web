import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillarTemplate from "@/components/templates/PillarTemplate";
import { PILLARS } from "@/data/pillars";
import { publicCopy } from "@/lib/copy-flags";
import { isPaginaAf, robotsVoor } from "@/lib/pagina-af";
import { reviewsForPillar } from "@/lib/review-mining";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Slugs met een eigen, uitgebouwde pagina. Een statische route wint van deze dynamische,
 * dus die pagina's hier ook genereren levert alleen een dubbele build op die niemand ziet.
 * Haal een slug uit deze lijst zodra zijn eigen pagina er níet meer is.
 */
const EIGEN_PAGINA = new Set([
  "acne",
  "pigmentvlekken",
  "rosacea",
  "littekens",
  "huidveroudering",
  "porien",
  "donkere-kringen",
  // Doorverwijzingen: eigen statische route die de dynamische afvangt.
  "huidkanker-naevi",
  "striae",
]);

export function generateStaticParams() {
  return PILLARS.filter((p) => !EIGEN_PAGINA.has(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = PILLARS.find((p) => p.slug === slug);
  if (!pillar) return {};

  const af = isPaginaAf(pillar);

  return {
    title: pillar.titel.replace(/\*/g, ""),
    // Stond hier hardgecodeerd op "[COPY-NODIG]" — dat verscheen zo in de
    // zoekresultaten. Liever geen description dan een redactievlag: Google stelt
    // er dan zelf een samen uit de pagina.
    ...(af ? { description: publicCopy(pillar.herkenning).slice(0, 155) } : {}),
    // Zolang de pagina uit placeholders bestaat blijft hij uit de index. De sitemap
    // laat hem al weg; dit vangt de route af die Google via interne links vindt.
    ...robotsVoor(af),
  };
}

export default async function PillarPage({ params }: PageProps) {
  const { slug } = await params;
  const content = PILLARS.find((p) => p.slug === slug);
  if (!content) notFound();

  const enriched = {
    ...content,
    reviews: content.reviews.length > 0 ? content.reviews : reviewsForPillar(slug),
  };

  return (
    <PillarTemplate
      content={enriched}
      proofItems={[...DIBA_PROOF_STRIP_ITEMS]}
      whatsappHref={DIBA_WHATSAPP_URL}
      siteUrl={DIBA_SITE_URL}
    />
  );
}
