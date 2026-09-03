import Link from "next/link";
import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import HeroVariantVideo from "@/components/hero-variant/HeroVariantVideo";
import Label from "@/components/ui/Label";
import { DIBA_SALONIZED_BOOKING_URL } from "@/lib/site";

/**
 * Hero-variant — topbalk boven, daaronder één beeldvlak met de navigatie eróver.
 *
 * De eerste poging zette de header boven de foto op wit. Dat was de kern van het
 * voorbeeld missen: daar zweeft het menu transparant over het beeld in wit, en het beeld
 * vult bijna het hele eerste scherm. Alleen de dunne balk met de waardering staat erboven
 * op wit.
 *
 * Vandaar deze opbouw:
 *   1. topbalk op wit, dun, van rand tot rand en zonder streep eronder
 *   2. één beeldvlak met ronde hoeken en witruimte eromheen, bijna schermvullend
 *   3. logo links, navigatie en knop rechts, zwevend daarbinnen in wit
 *   4. de kop linksonder in het beeld
 *
 * De navigatie zit in HoofdNav en niet hier. Dat is dezelfde component die de rest van
 * de site draagt, hier met `opBeeld` zodat hij in wit over de foto zweeft. De rest van
 * deze hero blijft daardoor server-side.
 *
 * Wat er anders is dan het voorbeeld, en met opzet:
 *
 * - De kop belooft niets over onszelf. "De best gewaardeerde kliniek" is precies het
 *   superlatief dat §11 verbiedt zolang er geen meting achter zit. Onze kop zegt wat we
 *   dóen; het cijfer staat in de topbalk mét de bron erbij.
 * - Twee verlopen over de foto en niet één: bovenaan een donkere aanzet zodat de witte
 *   navigatie leesbaar blijft op een lichte foto, onderaan een zwaardere voor de kop.
 *   Wit op een foto haalt zonder die verlopen nooit AA.
 *
 * Hoogte in `svh` en niet in `vh`: op iOS is 100vh groter dan wat je ziet, en dan valt de
 * kop onder de adresbalk.
 *
 * Dit is de homepage-hero: schermvullend beeld met navigatie erover. De achtergrond is een
 * geluidloze YouTube-loop; bij prefers-reduced-motion valt hij terug op de shootfoto.
 * Topbalk en HoofdNav mee, want in dit ontwerp zweven die binnen het beeld in plaats van
 * erboven te staan.
 */

export default function HeroVariant() {
  return (
    /* De ondergrond is dezelfde tint als de topbalk (--g-050) en niet wit.

       De balk stond op zacht groen en de randen om het beeldvlak op wit. Dat leest als
       twee vlakken die toevallig boven elkaar staan: langs de foto zie je een lichtgrijze
       rand waar niets hoort te zijn. Nu loopt de tint door van de balk, langs de zijkanten
       en onder het beeld, tot en met de verantwoordingsregel. Het beeldvlak drijft daarin
       in plaats van eruit te steken.

       De tint staat op deze component en niet op de pagina, zodat hij zijn eigen grond
       meebrengt waar hij ook geplaatst wordt. */
    <div className="bg-[var(--g-050)]">
      <Topbalk />

      <section className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative h-[calc(100svh-5.5rem)] min-h-[560px] w-full overflow-hidden rounded-[var(--r-xl)]">
          {/* quality 92 en niet de standaard 75. Dat is hier geen luxe: dit beeld vult
              het hele eerste scherm, dus elk artefact staat meteen op tachtig centimeter
              van iemands ogen. Bij een kaartje van 400 pixels ziet niemand het verschil
              en daar blijft de standaard dus staan.

              De uitsnede staat links, en dat is een gemeten keuze.

              De foto is 3:2. Op een telefoon is dit vlak ongeveer 1:2, dus er blijft maar
              32% van de breedte over. Haar gezicht zit op 20-28% van de breedte, de tablet
              op 37-57%: in een venster van 32% passen die twee nooit samen. Elke uitsnede
              is dus een keuze tussen de behandelaar of het scherm.

              Op 47% stond de scan er mooi middenin, en precies daar sneuvelde de
              leesbaarheid: het label en de kop kwamen op het lichte tabletscherm te staan.
              Op 10%, om de lichte wand aan de linkerrand kwijt te raken, hielp het op 320px
              maar zakte het label op 375px van 8,2 naar 2,3 omdat het daar juist zijn
              donkere ondergrond verloor. Geen enkele uitsnede is over de volle hoogte
              donker; dit is niet met de uitsnede op te lossen maar met de scrim hieronder.

              Links uitgelijnd staat ze in donkere Diba-kleding over de volle hoogte. De
              huidscan is daarmee een desktopdetail: vanaf ongeveer 1024 pixels is het vlak
              breder dan 3:2, wordt er horizontaal niets meer weggesneden en staat de hele
              foto in beeld.

              Een apart staand bestand voor de telefoon zou allebei kunnen geven, maar de
              staande opnamen uit de shoot zijn allemaal 1334x2000 web-exports. Een
              1:2-uitsnede daaruit is 1000 pixels breed, terwijl een telefoon met
              pixeldichtheid 3 er 1125 vraagt. Dat kost dus zichtbaar scherpte. */}
          <HeroVariantVideo />

          {/* Leesbaarheid, geen sfeer. Boven voor de navigatie, onder voor de kop.

              De onderste laag was /85 aflopend via /35, en dat was te licht. Gemeten op de
              werkelijke letterpixels: de kop valt over haar blote onderarm en over de lichte
              wand links, en daar bleef de ondergrond op een helderheid van 0,39 tot 0,51
              steken. Wit haalde 1,8 en de accentregel 1,6, terwijl grote tekst 3,0 moet
              halen. Dat het met het blote oog meeviel komt door de lettergrootte, niet door
              het contrast. Nu /95 aflopend via /62, over drie kwart zodat de overgang lang
              genoeg is om niet te banden. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--g-900)]/55 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[var(--g-900)]/95 via-[var(--g-900)]/62 to-transparent"
          />

          {/* ── Navigatie, zwevend in het beeld ── */}
          <HoofdNav opBeeld />

          {/* ── De kop ──

              Het tekstblok draagt onder lg zijn eigen scrim, en dat is de kern van de
              oplossing. Een scrim die aan het beeld hangt heeft een vaste hoogte, terwijl
              het tekstblok juist meegroeit: op een iPhone SE loopt de alinea over vier
              regels en breken de knoppen naar twee rijen, waardoor het blok 75% van de hero
              vult en bovenaan buiten de scrim steekt. Precies daar stond wit op 1,4.

              Deze laag hangt aan het blok zelf en dekt dus altijd exact de tekst, ongeacht
              hoe hoog die uitvalt. De pt-28 is de aanloop waarin hij naar niets uitdooft,
              zodat je geen rand ziet; het tussenpunt staat op 88% en niet halverwege, want
              anders begint het uitdoven al onder het label. Met 85% aanloop bleef het label
              op de SE op 4,07 steken tegen de eis van 4,5. Vanaf lg staat de tekst laag
              genoeg en gaat de laag uit (`lg:bg-none`), want daar is verduisteren alleen
              verlies. */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--g-900)]/88 via-[var(--g-900)]/74 via-88% to-transparent px-5 pt-28 pb-8 sm:px-8 sm:pb-10 lg:bg-none lg:px-10 lg:pt-0 lg:pb-14">
            <div className="max-w-[46ch]">
              <Label opDonker>Behandeling nul</Label>

              {/* Onder 360px stapt de kop terug naar 36px. Op 48px past "Wij gokken niet."
                  niet in een kolom van 280px en breekt hij over drie regels, wat de tweede
                  regel van het rijm losscheurt. Dit staat hier en niet op .diba-display-l:
                  die schaal komt uit het ontwerp en geldt voor de hele site. */}
              <h1 className="diba-display-l mt-4 text-[var(--on-dark)] max-[359px]:text-[2.25rem]">
                Wij gokken niet.
                <br />
                <span className="diba-accent-on-dark">Wij meten.</span>
              </h1>

              <p className="mt-5 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Elke behandeling begint met een meting onder vast licht. Daarna
                hoor je wat er realistisch mogelijk is, en soms is dat niets.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                  className="diba-label inline-flex h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Plan Behandeling Nul
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                  </svg>
                </Link>

                <Link
                  href="/huidproblemen"
                  className="diba-label inline-flex h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Onze huidproblemen
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Klinische verantwoording ── */}
      <div className="mx-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-6 sm:px-9 lg:px-[7.5vw]">
        <span className="text-[14px] leading-6 text-[var(--t-muted)]">
          De medische inhoud op deze site wordt nagekeken door
        </span>
        <span className="text-[14px] leading-6 font-medium text-[var(--t-strong)] underline decoration-[var(--g-300)] underline-offset-4">
          Rojda
        </span>
        <span className="diba-label text-[var(--t-muted)]">
          Nog vast te leggen
        </span>
      </div>
    </div>
  );
}
