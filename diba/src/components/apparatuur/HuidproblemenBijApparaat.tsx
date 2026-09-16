import Link from "@/components/ui/Linktaal";
import Label from "@/components/ui/Label";
import type { Apparaat } from "@/data/apparatuur";
import { BEHANDELINGEN, prijsTekst } from "@/data/behandelingen";
import { t, tc } from "@/lib/vertaal";
import { taalNu } from "@/lib/taalcontext";

/**
 * Welke huidklachten we met dit apparaat behandelen.
 *
 * WAT HIER STOND.
 *
 * Een doorsnede van de huid met een animatie die liet zien tot welke laag het apparaat
 * komt, onder de kop "Hoe dit apparaat op de huid werkt". Yasin, 5 september: de site legt
 * te veel nadruk op diepte. Hij heeft gelijk dat het de verkeerde vraag beantwoordt. Wie op
 * een apparatuurpagina belandt vraagt zich niet af tot hoeveel millimeter het komt, maar of
 * het iets doet aan wat hij in de spiegel ziet.
 *
 * WAAR DE INHOUD VANDAAN KOMT.
 *
 * Nergens nieuw. Het apparaat weet welke behandelingen erop draaien, en elke behandeling
 * weet bij welke klachten hij hoort. Twee keer omkeren geeft de lijst klachten per apparaat,
 * en per klacht de behandeling waarmee dat hier gebeurt. Er komt dus geen medische bewering
 * bij die niet al op de behandelpagina staat.
 *
 * Dat de klacht de kop is en de behandeling eronder, is met opzet. De bezoeker zoekt op zijn
 * klacht en niet op een merknaam; de merknaam is het antwoord, niet de vraag.
 */
/**
 * De klachten waarvoor dit apparaat wordt ingezet, met de behandelingen erbij.
 *
 * Los van het onderdeel en geëxporteerd, want de pagina eromheen moet dezelfde vraag kunnen
 * stellen: staat dit blok er, of niet? Daar hangt namelijk de bovenruimte van de sectie
 * eronder van af. Twee keer dezelfde afleiding opschrijven is precies hoe die twee na de
 * volgende wijziging uit elkaar gaan lopen.
 */
export function klachtenVoorApparaat(apparaat: Apparaat) {
  const behandelingen = BEHANDELINGEN.filter((b) =>
    apparaat.behandelingen.includes(b.slug),
  );

  /* Klacht -> de behandelingen op dit apparaat die daarvoor worden ingezet. Een Map houdt
     de volgorde aan waarin de klachten voorkomen, en dat is de volgorde van de
     behandelingenlijst: van de meest gebruikte naar de rest. */
  const perKlacht = new Map<
    string,
    { label: string; href: string; behandelingen: typeof behandelingen }
  >();

  for (const b of behandelingen) {
    for (const p of b.bijProblemen ?? []) {
      if (!p.href.startsWith("/huidproblemen/")) continue;
      const gevonden = perKlacht.get(p.href);
      if (gevonden) gevonden.behandelingen.push(b);
      else
        perKlacht.set(p.href, {
          label: p.label,
          href: p.href,
          behandelingen: [b],
        });
    }
  }

  return [...perKlacht.values()];
}

export default function HuidproblemenBijApparaat({
  apparaat,
}: {
  apparaat: Apparaat;
}) {
  const klachten = klachtenVoorApparaat(apparaat);
  if (klachten.length === 0) return null;

  /**
   * WAAROM HIER WEL BOVENRUIMTE STAAT EN BIJ DE BUURSECTIE NIET.
   *
   * De apparatuurpagina wisselt witte en zachtgroene secties af. Bij zo'n kleurwissel mogen
   * beide hun eigen lucht meebrengen: je ziet dan geen gat van 192 pixels maar twee blokken
   * met een naad ertussen. Twee witte secties naast elkaar hebben die naad niet, en daar
   * zou dubbele lucht wél als een gat lezen. Vandaar dat de witte secties op deze pagina
   * alleen onderruimte dragen.
   *
   * Die redenering klopt overal behalve op de eerste. Boven deze sectie staat de
   * donkergroene hero, en diens onderruimte zit bínnen dat groene vlak. Er stond dus nul,
   * en het label plakte tegen de rand (Yasin, 15 september 2026: "tekst zit geplakt aan de
   * bovenkant van de sectie"). Deze sectie krijgt daarom als enige witte ook bovenruimte,
   * in dezelfde maat als de rest van de pagina. `npm run secties` bewaakt het.
   */
  return (
    <section
      id="waarvoor"
      className="scroll-mt-[var(--anker-offset)] px-5 pt-10 pb-10 sm:pt-16 sm:pb-16 sm:px-9 lg:px-[7.5vw] lg:pt-24 lg:pb-24"
    >
      <div className="mx-auto">
        <Label>{t("Waarvoor we het inzetten")}</Label>
        <h2 className="diba-display-m mt-4 max-w-[24ch]">
          {t("Welke klachten we")}{" "}
          <span className="diba-accent">{t("hiermee behandelen")}</span>
        </h2>
        <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          {t(
            "Per klacht staat erbij welke behandeling hiervoor wordt ingezet. Welke bij jou past, stelt de huidtherapeut tijdens de intake vast.",
          )}
        </p>

        <ul className="mt-8 sm:mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {klachten.map((k) => (
            <li
              key={k.href}
              className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
            >
              <h3 className="diba-card-title">
                <Link
                  href={k.href}
                  className="underline decoration-[var(--g-200)] underline-offset-4 transition-colors hover:decoration-[var(--g-700)]"
                >
                  {tc(k.label)}
                </Link>
              </h3>

              {/* De behandelingen die hier op dit apparaat voor worden ingezet. Geen
                  reservering: `grow` vangt het verschil al op, dus wat hieronder staat ligt
                  in elke kaart op de onderrand. Zie `huidproblemen/striae/page.tsx`. */}
              <ul className="mt-4 grow space-y-2">
                {k.behandelingen.map((b) => (
                  <li
                    key={b.slug}
                    className="flex items-baseline justify-between gap-x-4"
                  >
                    <Link
                      href={`/behandelingen/${b.slug}`}
                      className="text-[15px] leading-6 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                    >
                      {tc(b.naam)}
                    </Link>
                    <span className="shrink-0 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                      {tc(prijsTekst(b.prijs, taalNu()))}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={k.href}
                className="diba-label mt-5 border-t border-[var(--g-100)] pt-5 text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
              >
                {t("Over")} {tc(k.label).toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
