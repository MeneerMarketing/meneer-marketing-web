import type { Metadata } from "next";
import Pagina from "@/app/(nl)/huidproblemen/donkere-kringen/page";
import { metadata as nlMetadata } from "@/app/(nl)/huidproblemen/donkere-kringen/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De en versie van /huidproblemen/donkere-kringen, op het adres /en/skin-concerns/dark-circles.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("en");
  return vertaaldeMetadata(nlMetadata, "en", "/en/skin-concerns/dark-circles");
}

export default function VertaaldePagina() {
  zetTaal("en");
  return <Pagina />;
}
