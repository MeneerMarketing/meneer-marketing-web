import type { Metadata } from "next";
import Pagina from "@/app/(nl)/vergoedingen/[slug]/page";
import { generateMetadata as nlMeta } from "@/app/(nl)/vergoedingen/[slug]/page";
import { generateStaticParams as nlParams } from "@/app/(nl)/vergoedingen/[slug]/page";
import { paramsNaarNederlands, paramsNaarTaal } from "@/lib/slugs";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De en versie van /vergoedingen/[slug], op het adres /en/insurance/[slug].
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
  return vertaaldeMetadata(basis, "en", "/en/insurance/[slug]");
}

export default function VertaaldePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("en");
  return (
    <Pagina {...props} params={paramsNaarNederlands(props.params, "en")} />
  );
}
