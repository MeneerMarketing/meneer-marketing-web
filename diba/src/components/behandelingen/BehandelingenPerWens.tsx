import Link from "next/link";
import {
  behandelingenBijWens,
  HUIDWENSEN,
  prijsTekst,
  type Behandeling,
  type HuidwensId,
} from "@/data/behandelingen";
import Label from "@/components/ui/Label";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De behandelingen, gegroepeerd op waarvoor je komt.
 *
 * OKAN, 5 SEPTEMBER 2026. Deze pagina deelde in op techniek en op diepte, en dat is de
 * indeling van de behandelaar. De bezoeker denkt niet "ik wil iets tot in mijn bovenste
 * lederhuid"; die denkt "ik heb acne" of "mijn huid wordt slapper". Daardoor verdwenen zes
 * Fotona-behandelingen achter één kaartje en waren Cosmelan en Dermamelan één regel,
 * terwijl het verschillende trajecten met verschillende prijzen zijn.
 *
 * De diepte is niet weg: die staat lager op de pagina, waar hij hoort. Interessant om te
 * weten, geen manier om te kiezen.
 *
 * WAAROM DIT GEEN FILTER IS. Er staat al een filter op deze pagina, en dat werkt op
 * hersteltijd en op je huidprofiel. Een filter verbergt; dit toont. Iemand met acne mag
 * best zien dat er ook iets voor pigment is, want dat is precies het gesprek dat tijdens
 * de intake gevoerd wordt.
 */

function Kaart({ b }: { b: Behandeling }) {
  return (
    <li>
      <Link
        href={`/behandelingen/${b.slug}`}
        className="group flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
      >
        <p className="diba-card-title text-[var(--t-strong)]">{b.naam}</p>
        <p className="mt-3 min-h-[3lh] text-[15px] leading-7 text-[var(--t-body)]">
          {publicCopy(b.kort)}
        </p>
        {/* Hier stond het aantal sessies, maar dat is bij eenenveertig van de
            vierenveertig kaarten een hele zin en die werd afgekapt. Een halve zin die je
            niet kunt uitlezen is slechter dan geen zin. Nu staat er het apparaat, want
            dat is kort en het zegt meteen waar de behandeling op draait.

            publicCopy haalt de redactievlaggen eruit; die staan in de data omdat Rojda en
            Okan nog dingen nakijken, en zonder deze functie staan ze in beeld. */}
        <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
          <span className="truncate" title={b.apparaat}>
            {b.apparaat ?? ""}
          </span>
          <span className="shrink-0 text-[var(--g-700)]">
            {b.prijs === 0 ? "Op aanvraag" : `vanaf ${prijsTekst(b.prijs)}`}
          </span>
        </p>
      </Link>
    </li>
  );
}

/** De zeven keuzes, als eerste wat je op de pagina ziet. */
export function Wenskiezer() {
  return (
    <ul className="flex flex-wrap gap-2">
      {HUIDWENSEN.filter((w) => w.id !== "overig").map((w) => (
        <li key={w.id}>
          <a
            href={`#wens-${w.id}`}
            className="diba-label inline-flex min-h-11 items-center rounded-[var(--r-pill)] bg-white px-5 text-[var(--t-strong)] transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            {w.knop}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function BehandelingenPerWens() {
  return (
    <div className="space-y-16">
      {HUIDWENSEN.map((wens) => {
        const behandelingen = behandelingenBijWens(wens.id as HuidwensId);
        if (behandelingen.length === 0) return null;

        return (
          <section
            key={wens.id}
            id={`wens-${wens.id}`}
            className="scroll-mt-[var(--anker-offset)]"
          >
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-12">
              <div>
                <Label>{behandelingen.length} behandelingen</Label>
                <h3 className="diba-display-s mt-3 max-w-[18ch]">
                  {wens.label}
                </h3>
              </div>
              <div className="lg:pb-1">
                <p className="max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
                  {wens.kort}
                </p>
                <Link
                  href={wens.pad}
                  className="diba-label mt-3 inline-block text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                >
                  Eerst lezen wat het is
                </Link>
              </div>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {behandelingen.map((b) => (
                <Kaart key={b.slug} b={b} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
