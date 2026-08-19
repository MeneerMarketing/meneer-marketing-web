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

export const metadata: Metadata = {
  title: "GentleMax Pro",
  description:
    "Twee lasers in één apparaat: 755 nm en 1064 nm. Welke van de twee je krijgt hangt af van je huidtype, en dat is een veiligheidskeuze en geen detail.",
};

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
              <span className="text-[var(--t-muted)]">GentleMax Pro</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Twee lasers
              <br />
              <span className="diba-accent">in één apparaat.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Overal lees je dat dit apparaat werkt op huidtype I tot en met VI.
              Wat er zelden bij staat is waaróm: er zitten twee verschillende
              golflengtes in, en jouw huidtype bepaalt welke van de twee je
              krijgt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dat is geen detail voor techneuten. Het is het verschil tussen een
              goede behandeling en een brandwond.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
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
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>755 of 1064 nanometer</Label>
            <h2 className="diba-display-m mt-4">
              Welke laser
              <span className="diba-accent">krijg jij?</span>
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

      {/* ── De koeling ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
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
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              {KOELING.detail}
            </p>
            <div className="mt-8 rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
              <p className="diba-label text-[var(--t-label)]">
                Wat je gaat voelen
              </p>
              <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                Een korte tik met iets kouds eromheen, herhaald over de zone.
                Hoe het precies aanvoelt verschilt per plek: op een scheenbeen
                is het scherper dan op een bovenbeen, omdat er minder tussen zit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── De grenzen ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Wat dit apparaat niet kan</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                De eerste hiervan
                <span className="diba-accent-on-dark">
                  {" "}
                  staat nergens in een folder.
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                En hij is voor een deel van de mensen doorslaggevend, want dan
                heeft de hele behandeling geen zin. Dat hoor je liever nu dan na
                de eerste sessie.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {GRENZEN.map((g) => (
                <li
                  key={g.kop}
                  className="rounded-[var(--r-lg)] bg-white/10 p-7 sm:p-8"
                >
                  <p className="text-[18px] leading-7 font-medium">{g.kop}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {g.zin}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[62ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
              Twijfel je of jouw haar genoeg pigment heeft, dan is dat bij de
              intake in één blik te zien. Dat kost je een afspraak en geen
              traject.
            </p>
          </div>
        </div>
      </section>

      {/* ── Door naar de behandeling ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
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
              behandelpagina. Daar reken je het zelf uit, per zone, zonder dat er
              een bedrag achterblijft tot aan de balie.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/laserontharing/configurator"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bereken je laserprijs
              </Link>
              <Link
                href="/laserontharing"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Alles over laserontharing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
