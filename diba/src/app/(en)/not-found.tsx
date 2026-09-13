import type { Metadata } from "next";
import Nietgevonden from "@/components/ui/Nietgevonden";
import { vertaal } from "@/lib/vertaal";

/**
 * De 404 binnen de Engelse site.
 *
 * Zelfde pagina als aan de Nederlandse kant; hij hangt alleen in de Engelse indeling, dus
 * met `lang="en-GB"` en de Engelse schil eromheen. De titel gaat hier expliciet door het
 * woordenboek: metadata wordt berekend voordat er een paginaopbouw is waar een taal in
 * staat.
 */

export const metadata: Metadata = {
  title: vertaal("Deze link hoort bij de oude site", "en"),
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <Nietgevonden />;
}
