import type { Metadata } from "next";
import Pagina from "@/app/(nl)/behandeling-op-advies/page";
import { metadata as nlMetadata } from "@/app/(nl)/behandeling-op-advies/page";
import { zetTaal } from "@/lib/taalcontext";
import { vertaaldeMetadata } from "@/lib/vertaalde-metadata";

/**
 * De es versie van /behandeling-op-advies, op het adres /es/tratamiento-con-asesoramiento.
 *
 * Dezelfde pagina, dezelfde gegevens, alleen een andere taal en een eigen adres.
 * Dit bestand is gemaakt door scratch/maak-taalroutes.py en hoort niet met de hand
 * aangepast te worden.
 */

export async function generateMetadata(): Promise<Metadata> {
  zetTaal("es");
  return vertaaldeMetadata(
    nlMetadata,
    "es",
    "/es/tratamiento-con-asesoramiento",
  );
}

export default function VertaaldePagina() {
  zetTaal("es");
  return <Pagina />;
}
