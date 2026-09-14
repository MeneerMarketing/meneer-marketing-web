import type { Metadata } from "next";
import Nietgevonden from "@/components/ui/Nietgevonden";
import { vertaal } from "@/lib/vertaal";

/**
 * De 404 binnen de Spaanse site.
 *
 * Zelfde pagina als aan de Nederlandse kant; hij hangt alleen in de Spaanse indeling, dus
 * met `lang="es-ES"` en de Spaanse schil eromheen. De titel gaat hier expliciet door het
 * woordenboek: metadata wordt berekend voordat er een paginaopbouw is waar een taal in
 * staat.
 */

export const metadata: Metadata = {
  title: vertaal("Deze link hoort bij de oude site", "es"),
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <Nietgevonden />;
}
