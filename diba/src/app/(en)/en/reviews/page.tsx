import type { Metadata } from "next";
import Pagina from "@/app/(nl)/reviews/page";
import { metadata as nlMetadata } from "@/app/(nl)/reviews/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De en versie van /reviews, op het adres /en/reviews.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("en");
  return vertaaldeMetadata(nlMetadata, "en", "/en/reviews");
}

export default function VertaaldePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("en");
  return <Pagina {...props} />;
}
