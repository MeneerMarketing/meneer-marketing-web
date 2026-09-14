import type { Metadata } from "next";
import Pagina from "@/app/(nl)/behandelingen/[slug]/[toepassing]/page";
import { generateMetadata as nlMeta } from "@/app/(nl)/behandelingen/[slug]/[toepassing]/page";
import { generateStaticParams as nlParams } from "@/app/(nl)/behandelingen/[slug]/[toepassing]/page";
import { paramsNaarNederlands, paramsNaarTaal } from "@/lib/slugs";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De es versie van /behandelingen/[slug]/[toepassing], op het adres /es/tratamientos/[slug]/[toepassing].
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return nlParams().map((p) => paramsNaarTaal(p, "es"));
}

export async function generateMetadata(
  props: Parameters<typeof nlMeta>[0],
): Promise<Metadata> {
  zetTaal("es");
  const basis = await nlMeta({
    ...props,
    params: paramsNaarNederlands(props.params, "es"),
  });
  return vertaaldeMetadata(basis, "es", "/es/tratamientos/[slug]/[toepassing]");
}

export default function VertaaldePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("es");
  return (
    <Pagina {...props} params={paramsNaarNederlands(props.params, "es")} />
  );
}
