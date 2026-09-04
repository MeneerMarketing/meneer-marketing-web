import Link from "next/link";
import Label from "@/components/ui/Label";
import type { Apparaat } from "@/data/apparatuur";
import { BEHANDELINGEN, prijsTekst } from "@/data/behandelingen";

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
export default function HuidproblemenBijApparaat({
  apparaat,
}: {
  apparaat: Apparaat;
}) {
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

  const klachten = [...perKlacht.values()];
  if (klachten.length === 0) return null;

  return (
    <section
      id="waarvoor"
      className="scroll-mt-[var(--anker-offset)] px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24"
    >
      <div className="mx-auto">
        <Label>Waarvoor we het inzetten</Label>
        <h2 className="diba-display-m mt-4 max-w-[24ch]">
          Welke klachten we{" "}
          <span className="diba-accent">hiermee behandelen</span>
        </h2>
        <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          Per klacht staat erbij welke behandeling op dit apparaat daarvoor
          wordt gebruikt. Welke bij jou past, stelt de huidtherapeut tijdens de
          intake vast.
        </p>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  {k.label}
                </Link>
              </h3>

              {/* De behandelingen die hier op dit apparaat voor worden ingezet. Drie
                  regelhoogtes gereserveerd, zodat de kaarten in een rij gelijk blijven
                  ook als de ene klacht er twee heeft en de andere een. */}
              <ul className="mt-4 min-h-[3lh] grow space-y-2">
                {k.behandelingen.map((b) => (
                  <li
                    key={b.slug}
                    className="flex items-baseline justify-between gap-x-4"
                  >
                    <Link
                      href={`/behandelingen/${b.slug}`}
                      className="text-[15px] leading-6 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                    >
                      {b.naam}
                    </Link>
                    <span className="shrink-0 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                      {prijsTekst(b.prijs)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={k.href}
                className="diba-label mt-5 border-t border-[var(--g-100)] pt-5 text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
              >
                Over {k.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
