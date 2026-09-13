import type { Metadata } from "next";
import Pagina from "@/app/(nl)/vergoedingen/[slug]/page";
import { generateMetadata as nlMeta } from "@/app/(nl)/vergoedingen/[slug]/page";
import { generateStaticParams as nlParams } from "@/app/(nl)/vergoedingen/[slug]/page";
import { engelseMetadata } from "@/lib/engelse-metadata";
import { zetTaal } from "@/lib/taalcontext";

/**
 * De Engelse versie van /vergoedingen/[slug].
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal. Dit bestand is gemaakt
 * door scratch/maak-en-routes.py en hoort niet met de hand aangepast te worden.
 *
 * `noindex` zolang de vertaling niet rond is: een pagina die half Nederlands is hoort
 * niet in Google te staan. Zodra de teksten er staan gaat die regel eraf.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return nlParams();
}

export async function generateMetadata(
  props: Parameters<typeof nlMeta>[0],
): Promise<Metadata> {
  zetTaal("en");
  const basis = await nlMeta(props);
  return engelseMetadata(basis, "/en/vergoedingen/[slug]");
}

export default function EngelsePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("en");
  return <Pagina {...props} />;
}
