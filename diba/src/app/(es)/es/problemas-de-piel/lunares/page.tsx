import type { Metadata } from "next";
import Pagina from "@/app/(nl)/huidproblemen/moedervlekken/page";
import { metadata as nlMetadata } from "@/app/(nl)/huidproblemen/moedervlekken/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De es versie van /huidproblemen/moedervlekken, op het adres /es/problemas-de-piel/lunares.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("es");
  return vertaaldeMetadata(nlMetadata, "es", "/es/problemas-de-piel/lunares");
}

export default function VertaaldePagina() {
  zetTaal("es");
  return <Pagina />;
}
