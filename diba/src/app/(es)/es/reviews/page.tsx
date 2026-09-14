import type { Metadata } from "next";
import Pagina from "@/app/(nl)/reviews/page";
import { metadata as nlMetadata } from "@/app/(nl)/reviews/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De es versie van /reviews, op het adres /es/reviews.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("es");
  return vertaaldeMetadata(nlMetadata, "es", "/es/reviews");
}

export default function VertaaldePagina(props: Parameters<typeof Pagina>[0]) {
  zetTaal("es");
  return <Pagina {...props} />;
}
