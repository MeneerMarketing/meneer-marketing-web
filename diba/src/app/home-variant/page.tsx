import type { Metadata } from "next";
import Link from "next/link";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import Label from "@/components/ui/Label";

/**
 * De homepage met de hero-variant.
 *
 * WAAROM HIER DE HELE PAGINA STAAT EN NIET ALLEEN DE HERO.
 *
 * Deze route liet eerst alleen HeroVariant zien met een toelichting eronder. Daarmee kon
 * je twee heroes vergelijken maar geen twee homepages, en dat is niet hetzelfde: een hero
 * werkt of hij werkt niet in verhouding tot wat eronder komt. Wie hier alleen het bovenste
 * scherm ziet, beoordeelt een plaatje.
 *
 * Daarom draait deze pagina nu dezelfde FigmaHomeApp als `/`, met één schakelaar om. Alles
 * onder de hero is dus letterlijk identiek, en het verschil dat je ziet is het enige
 * verschil dat er is.
 *
 * De beoordelingsnotitie staat onderaan en niet bovenaan. Bovenaan zou hij het eerste
 * scherm indrukken, en juist dat scherm is waar het over gaat.
 *
 * Deze route staat op noindex: het is een keuzemoment, geen pagina voor bezoekers. Valt de
 * keuze op deze hero, dan gaat `heroVariant` op de homepage aan en kan deze map weg.
 */

export const metadata: Metadata = {
  title: "Homepage met hero-variant (voorbeeld)",
  robots: { index: false, follow: false },
};

export default function HomeVariantPage() {
  return (
    <>
      <FigmaHomeApp heroVariant />

      <section className="bg-[var(--g-010)] px-5 pb-24 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
          <Label>Alleen ter beoordeling</Label>
          <h2 className="diba-display-s mt-4 max-w-[24ch]">
            Twee keuzes,
            <br />
            <span className="diba-accent">verder dezelfde pagina.</span>
          </h2>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            Deze pagina is de homepage met een andere hero. Alles onder het
            eerste scherm draait op dezelfde component, dus wat je hieronder
            ziet is precies wat je op de huidige homepage ook ziet.
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <Label>Deze variant</Label>
              <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[var(--t-body)]">
                <li>
                  Eén beeldvlak dat bijna het hele eerste scherm vult, met het
                  menu er in wit overheen.
                </li>
                <li>
                  De foto toont de huidscan die samen bekeken wordt. Dat is waar
                  de kop over gaat.
                </li>
                <li>
                  De topbalk en de ruimte om het beeld staan op dezelfde tint,
                  zodat het beeldvlak erin drijft.
                </li>
              </ul>
            </div>

            <div>
              <Label>De huidige homepage</Label>
              <ul className="mt-4 space-y-2 text-[15px] leading-7 text-[var(--t-body)]">
                <li>
                  Tekst links, beeld rechts, met de afgeronde hoek linksonder in
                  de foto.
                </li>
                <li>
                  Het menu staat als eigen balk boven het beeld in plaats van
                  erin.
                </li>
                <li>
                  De hero is ongeveer 730 pixels hoog en niet schermvullend, dus
                  de eerste sectie eronder komt eerder in beeld.
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
    </>
  );
}
