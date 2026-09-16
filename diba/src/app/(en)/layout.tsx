import type { Metadata } from "next";
import WoordenboekEN from "@/components/i18n/WoordenboekEN";
import Paginaschil from "@/components/ui/Paginaschil";
import { basisMetadata } from "@/lib/basis-metadata";
import { zetTaal } from "@/lib/taalcontext";
import "../globals.css";

/**
 * De wortelindeling van de Engelse site.
 *
 * Alles onder `/en` hangt hieronder. Omdat de taal in de route zelf zit hoeft niemand hem
 * uit het adres te halen: `lang="en-GB"` staat meteen goed in de HTML die de server
 * uitlevert, en `zetTaal("en")` draait hier voordat er ook maar iets onder deze indeling
 * gerenderd wordt. Daarmee is ook het JSON-LD over de kliniek Engels, wat tot vandaag niet
 * lukte omdat de enige indeling van de site boven beide talen hing.
 */
export const metadata: Metadata = basisMetadata("en");

export default function EngelseIndeling({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  zetTaal("en");
  /* `WoordenboekEN` wordt hier geïmporteerd en nergens anders: die import is wat het
     Engelse woordenboek in de chunks van /en zet, en buiten /en houdt. Hij gaat als prop
     naar de schil, die hem om de hele pagina zet — navigatie en voettekst inbegrepen.
     Zie components/i18n/Woordenboek.tsx en de toelichting in Paginaschil. */
  return (
    <Paginaschil taal="en" woordenboek={WoordenboekEN}>
      {children}
    </Paginaschil>
  );
}
