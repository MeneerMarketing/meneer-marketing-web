import type { Metadata } from "next";
import Link from "next/link";
import VoorNaSchuif from "@/components/resultaten/VoorNaSchuif";
import { VOOR_NA_PAREN } from "@/data/voor-na";
import Fotocheck from "@/components/resultaten/Fotocheck";
import Label from "@/components/ui/Label";
import { FOTOVARIABELEN } from "@/data/fotobewijs";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * Resultaten.
 *
 * HET PROBLEEM: ER ZIJN GEEN FOTO'S.
 *
 * Op deze pagina horen voor-en-na-beelden te staan en die zijn er nog niet. Stockbeeld en
 * gegenereerde huid mogen niet, en dat is terecht: een resultaatfoto die niet van een echte
 * klant is, is een leugen met een bijschrift. Hier stonden drie dev-placeholders met
 * `[COPY-NODIG]` in de bijschriften, wat het probleem alleen maar zichtbaar maakte.
 *
 * DE OPLOSSING: GEEF DE BEZOEKER IETS BETERS DAN DRIE FOTO'S.
 *
 * Namelijk het gereedschap om elk voor-en-na-beeld te beoordelen. Dat van een andere
 * kliniek, en straks dat van ons. Zeven variabelen bepalen wat je op zo'n foto ziet, en bij
 * de meeste beelden op internet is er niet één van gelijk gehouden.
 *
 * Daarmee wordt het gebrek de sterkste pagina van de site: wie hier klaar is, gelooft geen
 * enkele resultaatfoto meer op zijn blauwe ogen, en weet precies wat hij van ons mag eisen
 * zodra we onze eigen beelden publiceren.
 *
 * DE BELOFTE STAAT ER OOK, EN DIE IS TE CONTROLEREN.
 *
 * Onder de Fotocheck staat het protocol waar we ons aan binden. Dat is geen sier: het is de
 * lijst waarop jullie mij mogen afrekenen als er straks beelden komen die er niet aan
 * voldoen.
 *
 * [BEELD-NODIG] echte voor-en-na van eigen klanten, mét toestemming, geschoten volgens het
 * protocol hieronder. Zodra die er zijn komt er een galerij onder de Fotocheck, en niet
 * ervoor: de uitleg blijft bovenaan staan.
 *
 * Eén donkergroen vlak: het protocol (§5).
 */

export const metadata: Metadata = {
  title: "Resultaten",
  description:
    "Waarom je vrijwel geen enkele voor-en-na-foto kunt vertrouwen, en onder welke voorwaarden dat wel kan. Met een check waarmee je elk resultaatbeeld zelf beoordeelt.",
};

export default function ResultatenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Resultaten", url: `${DIBA_SITE_URL}/resultaten` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Resultaten</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Hier staan nog geen
              <br />
              <span className="diba-accent">voor-en-na-foto&apos;s.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              We tonen alleen resultaatfoto&apos;s van eigen klanten die
              daarvoor toestemming hebben gegeven. Zolang geschikte beelden
              ontbreken, plaatsen we geen voorbeeldfoto&apos;s van anderen.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              In plaats daarvan krijg je iets wat je aan drie foto&apos;s niet
              hebt: de reden waarom je vrijwel geen enkel voor-en-na-beeld op
              internet kunt vertrouwen.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>De kern in één zin</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Verplaats de lamp en je verplaatst elke schaduw, terwijl de huid
              geen millimeter veranderd is.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Textuur zie je alleen doordat er schaduw in zit. Dat is de reden
              dat licht op deze lijst dubbel weegt, en dat klinische fotografie
              er protocollen voor kent.
            </p>
          </div>
        </div>
      </section>

      {/* ── De Fotocheck: de signatuur ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Zeven variabelen</Label>
            <h2 className="diba-display-m mt-4">
              Beoordeel zelf{" "}
              <span className="diba-accent">elk resultaatbeeld.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Dit werkt op elke kliniekwebsite, ook die van de buren en straks
              op die van ons. Zet aan wat er tussen de voorfoto en de nafoto
              gelijk is gehouden, en kijk wat het oordeel doet.
            </p>
          </div>

          <div className="mt-10">
            <Fotocheck />
          </div>
        </div>
      </section>

      {/* ── Het protocol ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Waar je ons aan mag houden</Label>
              <h2 className="diba-display-m mt-4 max-w-[22ch]">
                Hoe we resultaatfoto&apos;s{" "}
                <span className="diba-accent-on-dark">maken</span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Zeven regels, één per variabele hierboven. Verschijnt er straks
                een beeld op deze site dat er niet aan voldoet, dan mag je ons
                daarop aanspreken.
              </p>
            </div>

            {/* Geen "01, 02, 03" boven deze kaarten. Deze zeven regels hebben geen
                volgorde, dus zo'n nummer draagt niets: het is opmaak die doet alsof er
                een stappenplan staat waar een lijst staat. De regel zelf is de kop. */}
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {FOTOVARIABELEN.map((v) => (
                <li
                  key={v.id}
                  className="rounded-[var(--r-lg)] bg-[var(--g-800)] p-7 sm:p-8"
                >
                  <p className="text-[17px] leading-7 font-medium">{v.label}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {v.onzeRegel}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[62ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
              Bij elk beeld komen bovendien de gegevens te staan die je nodig
              hebt om het te wegen: welke behandeling, hoeveel sessies, hoeveel
              weken ertussen, welk huidtype en hoeveel weken na de laatste
              sessie de nafoto gemaakt is.
            </p>
          </div>
        </div>
      </section>

      {/* ── Wat we nu al wel kunnen laten zien ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat wel meetbaar is</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Getallen liegen
              <br />
              <span className="diba-accent">minder dan licht.</span>
            </h2>
          </div>
          <div>
            <p className="max-w-[58ch] text-[17px] leading-8 text-[var(--t-body)]">
              De EVE-M gebruikt vaste opnameomstandigheden. Daardoor is een
              latere meting beter vergelijkbaar dan een losse telefoonfoto onder
              ander licht.
            </p>
            <p className="mt-4 max-w-[58ch] text-[17px] leading-8 text-[var(--t-body)]">
              Wat er dan uit komt zijn geen mooie plaatjes maar waardes:
              pigment, vocht, poriestructuur, tekenen van veroudering. Jouw
              eigen nulpunt, en het enige eerlijke vergelijkingsmateriaal dat er
              bestaat.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  kop: "Jouw eigen nulpunt",
                  zin: "Je vergelijkt met je eigen huid van drie maanden geleden, niet met iemand anders.",
                },
                {
                  kop: "Dezelfde omstandigheden",
                  zin: "Vast licht, vaste afstand. De variabelen hierboven liggen allemaal vast.",
                },
                {
                  kop: "Ook wat niet werkte",
                  zin: "Een meting die geen verbetering laat zien is even bruikbaar. Dan gaan we iets anders proberen.",
                },
                {
                  kop: "Geen voorspelling",
                  zin: "De scan legt vast wat er nu is. Wat een behandeling gaat opleveren, kan hij niet zeggen.",
                },
              ].map((k) => (
                <li
                  key={k.kop}
                  className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
                >
                  <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                    {k.kop}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                    {k.zin}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/apparatuur/eve-m"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Zo werkt de huidscan
              </Link>
              <Link
                href="/huidprofiel"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stel eerst je huidprofiel samen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier komt te staan</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Zodra ze er zijn,
              <br />
              <span className="diba-accent">staan ze hieronder.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              We tonen alleen voor- en nafoto&apos;s van eigen klanten die
              toestemming hebben gegeven en waarbij de foto&apos;s onder
              vergelijkbare omstandigheden zijn gemaakt.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Ben je klant en wil je dat jouw beelden meedoen, dan hoor je van
              tevoren waar ze te zien zullen zijn en kun je die toestemming op
              elk moment weer intrekken.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Neem contact op
              </Link>
              <Link
                href="/reviews"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Wat klanten schrijven
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── De plekken zelf ──

          Het raster staat er al voordat de beelden er zijn, en dat is met opzet. Negen
          plekken laten zien hoeveel er komen te staan en waar; een pagina die pas vorm
          krijgt als de inhoud er is, wordt op het laatste moment ontworpen.

          Elk vak toont nu "Nog geen beeld". Er staat dus nergens een voorbeeldfoto uit een
          andere shoot: dat zou een resultaat tonen dat niemand behaald heeft, en precies
          daar gaat de uitleg hierboven over. */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <Label>De vergelijkingen</Label>
            <p className="text-[15px] leading-7 text-[var(--t-muted)]">
              Schuif over een beeld om het verschil te zien. Bij elk paar staat
              wat ervoor nodig was.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {VOOR_NA_PAREN.map((paar) => (
              <VoorNaSchuif key={paar.id} paar={paar} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
