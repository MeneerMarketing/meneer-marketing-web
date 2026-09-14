import type { Metadata } from "next";
import Paginaschil from "@/components/ui/Paginaschil";
import { basisMetadata } from "@/lib/basis-metadata";
import { zetTaal } from "@/lib/taalcontext";
import "../globals.css";

/**
 * De wortelindeling van de Spaanse site.
 *
 * Alles onder `/es` hangt hieronder. Omdat de taal in de route zelf zit hoeft niemand hem
 * uit het adres te halen: `lang="es-ES"` staat meteen goed in de HTML die de server
 * uitlevert, en `zetTaal("es")` draait hier voordat er ook maar iets onder deze indeling
 * gerenderd wordt. Daarmee is ook het JSON-LD over de kliniek Spaans.
 *
 * Zie `src/app/(en)/layout.tsx`: dit is dezelfde indeling met een andere taal, en dat is
 * met opzet het enige verschil.
 */
export const metadata: Metadata = basisMetadata("es");

export default function SpaanseIndeling({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  zetTaal("es");
  return <Paginaschil taal="es">{children}</Paginaschil>;
}
