import type { Metadata } from "next";
import Link from "next/link";
import Golflengtevenster from "@/components/laser/Golflengtevenster";
import Label from "@/components/ui/Label";
import { GRENZEN, KOELING } from "@/data/gentlemax";
// KOELING.kop wordt bewust niet als kop gebruikt: die zin staat in de data omdat hij daar
// hoort, maar de kop op het scherm is opgesplitst met een accentwoord en dat gaat niet
// samen met één string.
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * GentleMax Pro.
 *
 * WAAROM DEZE PAGINA NAAST /LASERONTHARING MAG BESTAAN.
 *
 * Alleen als ze iets anders vertelt. /laserontharing gaat over de behandeling, de zones en
 * de prijs; die heeft een configurator en die is daar goed op zijn plek. Als deze pagina
 * hetzelfde verhaal in andere woorden doet, is het een dubbele pagina en dan hoort ze weg.
 *
 * Wat dit apparaat eigen is: er zitten twee lasers in, en jouw huidtype bepaalt welke van
 * de twee je krijgt. Folders schrijven "geschikt voor huidtype I tot VI" en laten weg dat
 * dat aan twee verschillende golflengtes te danken is. Dat weglaten is precies waar het
 * interessant wordt, want het is de enige technische keuze op deze site die rechtstreeks
 * over veiligheid gaat.
 *
 * DE OPBOUW IS ANDERS DAN DE REST.
 *
 * Geen opsomming van voordelen maar een natuurkundige vraag die zichzelf beantwoordt: hoe
 * raak je een haarwortel zonder de huid eromheen te raken? Daaruit volgt het verschil
 * tussen de twee golflengtes, daaruit volgt de koeling, en daaruit volgen de grenzen.
 *
 * Hier stonden vier `[COPY-NODIG]`-blokken op een ContentPageTemplate.
 *
 * [MEDISCHE-CHECK-ROJDA] alles in `gentlemax.ts`, en dan vooral de koppeling van huidtype
 * naar golflengte: dat is wat er in de behandelkamer daadwerkelijk gekozen wordt.
 * [BEELD-NODIG] een foto van het apparaat zelf.
 *
 * Twee donkergroene vlakken: het venster (in het component) en de grenzen (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/gentlemax-pro",
  /* Deze pagina heette net zo als /apparatuur/gentlemax-pro, en dan kiest een zoekmachine
     er zelf een van de twee. De rolverdeling: daar staat het apparaat, hier staat de vraag
     welke van de twee golflengtes bij jouw huidtype hoort, met de kiezer erbij. */
  titel: "Welke laser past bij jouw huidtype",
  omschrijving:
    "Twee lasers in één apparaat: 755 nm en 1064 nm. Welke van de twee je krijgt hangt af van je huidtype, en dat is een veiligheidskeuze en geen detail.",
});

export default function GentleMaxProPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "GentleMax Pro", url: `${DIBA_SITE_URL}/gentlemax-pro` },
        ])}
      />

      {/* ── Hero: de vraag ── */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">GentleMax Pro</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Twee lasers
              <br />
              <span className="diba-accent-on-dark">in één apparaat.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              Overal lees je dat dit apparaat werkt op huidtype I tot en met VI.
              Wat er zelden bij staat is waaróm: er zitten twee verschillende
              golflengtes in, en jouw huidtype bepaalt welke van de twee je
              krijgt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              Dat is geen detail voor techneuten. Het is het verschil tussen een
              goede behandeling en een brandwond.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10 text-[var(--t-strong)]">
            <Label>De vraag waar alles op neerkomt</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Hoe raak je een haarwortel zonder de huid eromheen te raken?
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              De laser mikt op pigment: dat neemt het licht op, wordt warm en
              beschadigt de wortel. Dat werkt alleen als de wortel meer opneemt
              dan de huid eromheen. Zit er ook pigment in de bovenlaag, dan
              neemt die mee op, en dan klopt de hele opzet niet meer.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Daar is die tweede golflengte voor.
            </p>
          </div>
        </div>
      </section>

      {/* ── De signatuur: het golflengtevenster ── */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>755 of 1064 nanometer</Label>
            <h2 className="diba-display-m mt-4">
              Welke laser <span className="diba-accent">krijg jij?</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Kies je huidtype en je ziet welke van de twee er dan gebruikt
              wordt, hoe diep die komt en waarom dat bij jou de juiste is.
            </p>
          </div>

          <div className="mt-10">
            <Golflengtevenster />
          </div>
        </div>
      </section>

      {/* ── De koeling ──
          Op een vlak, want het blok "Wat je gaat voelen" erin is wit en de pagina is dat
          bijna ook (Yasin, 11 september 2026). */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Het derde onderdeel</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              De koeling
              <br />
              <span className="diba-accent">hoort bij de puls.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              {KOELING.zin}
            </p>
            <LeesVerder>
              <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
                {KOELING.detail}
              </p>
            </LeesVerder>
            <div className="mt-8 rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
              <p className="diba-label text-[var(--t-label)]">
                Wat je gaat voelen
              </p>
              <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                Een korte tik met iets kouds eromheen, herhaald over de zone.
                Hoe het precies aanvoelt verschilt per plek: op een scheenbeen
                is het scherper dan op een bovenbeen, omdat er minder tussen
                zit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hier stond "Wat dit apparaat niet kan". Yasin, 10 september 2026: die sectie
          mag helemaal uit de site. */}

      {/* ── Door naar de behandeling ── */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>En dan de praktijk</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Wat het
              <br />
              <span className="diba-accent">bij jou kost.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Deze pagina gaat over het apparaat. Welke zones er zijn, wat een
              sessie kost en hoeveel sessies er in een traject gaan, staat op de
              behandelpagina. Daar reken je het zelf uit, per zone, zonder dat
              er een bedrag achterblijft tot aan de balie.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/tarieven"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bekijk de tarieven per zone
              </Link>
              <Link
                href="/laserontharing"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Alles over laserontharing
              </Link>
              {/* De rolverdeling met de apparaatpagina staat nu in de titels vast, en dan
                  hoort er ook een verwijzing heen te staan. Anders blijft het voor een
                  zoekmachine twee pagina's over hetzelfde ding. */}
              <Link
                href="/apparatuur/gentlemax-pro"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Het apparaat zelf
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
