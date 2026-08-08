import type { Metadata } from "next";
import Link from "next/link";
import HeroVariant from "@/components/hero-variant/HeroVariant";
import Label from "@/components/ui/Label";

/**
 * Voorbeeldroute voor de hero-variant.
 *
 * Staat los van `/` zodat de bestaande homepage onaangeroerd blijft. Bevalt deze opzet,
 * dan verhuist HeroVariant naar de homepage; bevalt hij niet, dan gaat deze map weg en is
 * er niets veranderd.
 *
 * Alleen het bovenste deel van de pagina staat hier. De rest van de homepage zit in
 * FigmaHomeApp en hoort daar; die eerst uit elkaar trekken zou precies het risico
 * introduceren dat deze route juist vermijdt.
 */

export const metadata: Metadata = {
  title: "Hero-variant (voorbeeld)",
  robots: { index: false, follow: false },
};

export default function HomeVariantPage() {
  return (
    <main className="figma-home bg-white text-[var(--t-strong)]">
      <HeroVariant />

      <section className="mx-auto px-5 pb-24 sm:px-9 lg:px-[7.5vw]">
        <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
          <Label>Alleen ter beoordeling</Label>
          <h2 className="diba-display-s mt-4 max-w-[24ch]">
            Dit is een voorbeeld,
            <br />
            <span className="diba-accent">geen vervanging.</span>
          </h2>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            De bestaande homepage staat er nog precies zoals hij was. Vind je
            deze opzet beter, dan zetten we hem daar neer; vind je van niet, dan
            gaat deze pagina weg en is er niets gebeurd.
          </p>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            Het menu is gebouwd voor de site zoals hij straks is en niet zoals
            hij nu is. Alle bestemmingen bestaan als route, dus er zit geen dode
            link in, maar achter de meeste staat nog geen inhoud. Die staan
            hieronder.
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <Label>Wat er nieuw is</Label>
              <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[var(--t-body)]">
                <li>
                  De topbalk loopt van rand tot rand en heeft geen streep meer
                  onder zich.
                </li>
                <li>
                  De waardering staat linksboven zonder het woord Salonized; het
                  hele blok linkt naar de openbare lijst en de voorleesnaam
                  noemt de bron voluit.
                </li>
                <li>
                  Logo links, menu en knop samen rechts tegen de rand, precies
                  zoals in het voorbeeld dat je stuurde.
                </li>
                <li>
                  Achter Huidproblemen, Behandelingen en Over Diba klapt een
                  breed paneel uit. De zeventien huidproblemen staan er
                  gegroepeerd in, elk met de vraag waarmee die pagina begint.
                </li>
                <li>
                  Mijn Diba staat in de balk als uitklapje: het vertelt wat het
                  portaal wordt en doet nog niets, want er is nog niets.
                </li>
              </ul>
            </div>

            <div>
              <Label>Wat er nog niet is</Label>
              <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[var(--t-body)]">
                <li>
                  Behandelingen, Laserontharing, Prijzen, Resultaten, Over ons,
                  Team, Nazorg, Voor wie en Contact bestaan als pagina maar zijn
                  nog leeg.
                </li>
                <li>Alle prijzen staan op nul tot jij de echte aanlevert.</li>
                <li>
                  De taalkiezer toont vier talen; alleen Nederlands is er, de
                  rest staat als &quot;straks&quot; aangemerkt.
                </li>
                <li>
                  Het Salonized-beeldmerk ontbreekt nog, dus staat er nu alleen
                  de link.
                </li>
                <li>
                  Wie de medische inhoud nakijkt moet nog worden vastgelegd.
                </li>
              </ul>
            </div>
          </div>
          <Link
            href="/"
            className="diba-label mt-8 inline-block text-[var(--g-700)] underline underline-offset-4"
          >
            Naar de huidige homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
