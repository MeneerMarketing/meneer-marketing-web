import type { Metadata } from "next";
import Pagina from "@/app/(nl)/behandeling-op-advies/page";
import { metadata as nlMetadata } from "@/app/(nl)/behandeling-op-advies/page";
import { engelseMetadata } from "@/lib/engelse-metadata";
import { zetTaal } from "@/lib/taalcontext";

/**
 * De Engelse versie van /behandeling-op-advies.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal. Dit bestand is gemaakt
 * door scratch/maak-en-routes.py en hoort niet met de hand aangepast te worden.
 *
 * `noindex` zolang de vertaling niet rond is: een pagina die half Nederlands is hoort
 * niet in Google te staan. Zodra de teksten er staan gaat die regel eraf.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("en");
  return engelseMetadata(nlMetadata, "/en/behandeling-op-advies");
}

export default function EngelsePagina() {
  zetTaal("en");
  return <Pagina />;
}
