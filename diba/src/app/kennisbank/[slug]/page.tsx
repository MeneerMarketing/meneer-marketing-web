import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPagina from "@/components/kennisbank/LandingPagina";
import { LANDINGS, landingVoorSlug } from "@/data/landings";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De landingspagina's van de kennisbank: /kennisbank/hydrafacial-rotterdam en de rest.
 *
 * Eén route voor allemaal, gevoed uit het register in `data/landings`. Een pagina toevoegen
 * is daar een databestand bijzetten; de route, de sitemap, de kennisbank en de verwijzingen
 * tussen de landingspagina's volgen vanzelf.
 *
 * `dynamicParams` staat uit: een adres dat niet in het register staat is een 404 en geen
 * lege pagina met de opmaak van een landingspagina.
 */

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const l = landingVoorSlug(slug);
  if (!l) return {};
  return zoekmachineVelden({
    pad: `/kennisbank/${l.slug}`,
    titel: l.titel,
    omschrijving: l.omschrijving,
    gewijzigd: l.gewijzigd,
    beeld: { url: l.beeld.src, alt: l.beeld.alt },
  });
}

export default async function LandingRoute({ params }: PageProps) {
  const { slug } = await params;
  const l = landingVoorSlug(slug);
  if (!l) notFound();
  return <LandingPagina landing={l} />;
}
