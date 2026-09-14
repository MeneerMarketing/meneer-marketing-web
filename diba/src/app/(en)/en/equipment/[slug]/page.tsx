import type { Metadata } from "next";
import Pagina from "@/app/(nl)/apparatuur/[slug]/page";
import { generateMetadata as nlMeta } from "@/app/(nl)/apparatuur/[slug]/page";
import { generateStaticParams as nlParams } from "@/app/(nl)/apparatuur/[slug]/page";
import { paramsNaarNederlands, paramsNaarTaal } from "@/lib/slugs";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De en versie van /apparatuur/[slug], op het adres /en/equipment/[slug].
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return nlParams().map((p) => paramsNaarTaal(p, "en"));
}

export async function generateMetadata(
  props: Parameters<typeof nlMeta>[0],
): Promise<Metadata> {
  zetTaal("en");
  const basis = await nlMeta({
    ...props,
    params: paramsNaarNederlands(props.params, "en"),
  });
  return vertaaldeMetadata(basis, "en", "/en/equipment/[slug]");
}

export default function VertaaldePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("en");
  return (
    <Pagina {...props} params={paramsNaarNederlands(props.params, "en")} />
  );
}
