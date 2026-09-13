import Paginavulling from "@/components/ui/Paginavulling";
import { LETTERKLASSEN } from "@/lib/lettertypen";
import type { Taal } from "@/lib/taal";

/**
 * Het html- en body-element van een pagina.
 *
 * Dit stond in `app/layout.tsx`, één indeling voor de hele site. Die indeling kon niet
 * weten of hij boven een Nederlandse of een Engelse pagina hing: een indeling krijgt het
 * pad niet mee, en de Engelse route zet de taal pas als de pagina aan de beurt is. Er
 * stond dus `lang="nl"` boven een pagina vol Engels, en het JSON-LD over de kliniek bleef
 * Nederlands.
 *
 * Sinds 13 september 2026 zijn er twee wortelindelingen, `(nl)` en `(en)`, die allebei dit
 * component gebruiken. De taal staat daarmee in de route zelf, dus vast bij het bouwen, en
 * hoeft niet meer uit het adres gehaald te worden.
 */
export default function Paginaschil({
  taal,
  children,
}: Readonly<{ taal: Taal; children: React.ReactNode }>) {
  return (
    <html
      lang={taal === "en" ? "en-GB" : "nl"}
      className={`${LETTERKLASSEN} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <Paginavulling taal={taal}>{children}</Paginavulling>
      </body>
    </html>
  );
}
