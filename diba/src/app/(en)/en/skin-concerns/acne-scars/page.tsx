import type { Metadata } from "next";
import Pagina from "@/app/(nl)/huidproblemen/acne-littekens/page";
import { metadata as nlMetadata } from "@/app/(nl)/huidproblemen/acne-littekens/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De en versie van /huidproblemen/acne-littekens, op het adres /en/skin-concerns/acne-scars.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("en");
  return vertaaldeMetadata(nlMetadata, "en", "/en/skin-concerns/acne-scars");
}

export default function VertaaldePagina() {
  zetTaal("en");
  return <Pagina />;
}
