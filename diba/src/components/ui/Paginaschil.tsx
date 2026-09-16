import Paginavulling from "@/components/ui/Paginavulling";
import { LETTERKLASSEN } from "@/lib/lettertypen";
import { TAALCODES, type Taal } from "@/lib/taal";

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
/** Zonder woordenboek: de kinderen gaan ongewijzigd door. Het Nederlands heeft er geen. */
function ZonderWoordenboek({ children }: { children: React.ReactNode }) {
  return children;
}

export default function Paginaschil({
  taal,
  woordenboek: Woordenboek = ZonderWoordenboek,
  children,
}: Readonly<{
  taal: Taal;
  /**
   * De provider die het woordenboek van deze taal in de browser zet.
   *
   * Komt als prop uit de taalindeling — `WoordenboekEN` uit `(en)/layout.tsx`,
   * `WoordenboekES` uit `(es)/layout.tsx` — en wordt hier niet zelf geïmporteerd. Dat is
   * geen omslachtigheid: de import is precies wat bepaalt in welke chunks een woordenboek
   * terechtkomt, en hij hoort daarom in de indeling van die ene taal te staan en niet in
   * een schil die alle drie de talen delen.
   *
   * Hij staat óm `Paginavulling` en niet om de kinderen alleen. De eerste versie deed
   * dat laatste, en toen stonden navigatie, voettekst, cookiebalk en actiebalk — alles
   * wat `Paginavulling` om de inhoud heen zet — op /en in het Nederlands: 2015 woorden,
   * gemeten met `npm run vreemdetaal en`.
   */
  woordenboek?: (props: { children: React.ReactNode }) => React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang={TAALCODES[taal].html} className={`${LETTERKLASSEN} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Woordenboek>
          <Paginavulling taal={taal}>{children}</Paginavulling>
        </Woordenboek>
      </body>
    </html>
  );
}
