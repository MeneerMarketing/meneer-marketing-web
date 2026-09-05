import Link from "next/link";
import Label from "@/components/ui/Label";
import { toepassingenBijProbleem } from "@/data/toepassingen";
import { apparatenVoorBehandeling } from "@/data/apparatuur";
import { BEHANDELINGEN, prijsTekst } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Welke behandelingen horen bij dit huidprobleem, en op welk apparaat draaien ze.
 *
 * WAT ER MIS WAS.
 *
 * `npm run links` liep de site af en telde per pagina naar welke soorten hij wijst. Alle
 * eenendertig huidprobleempagina's wezen naar nul apparatuurpagina's, en tien van de
 * eenendertig ook naar geen enkele behandeling. De enige behandellink die er stond was die
 * naar de huidanalyse, en die staat op elke pagina.
 *
 * Dat is precies de verkeerde kant op. De site heeft vier ingangen naar hetzelfde
 * onderwerp — het probleem, de behandeling, het apparaat, en soms een losse pagina zoals
 * snurken — en iemand komt binnen op een willekeurige daarvan. Wie op "acne" binnenkomt
 * moest zelf raden welke behandeling daarbij hoort.
 *
 * WAAROM DIT NIETS NIEUWS BEWEERT.
 *
 * De koppeling bestond al, alleen andersom: elke behandeling noemt in `bijProblemen` bij
 * welke klachten hij hoort. Dit onderdeel keert die lijst om. Er komt dus geen nieuwe
 * medische bewering bij; er staat alleen wat de behandelpagina zelf al zegt, op de plek
 * waar de vraag gesteld wordt.
 *
 * Het apparaat volgt uit de behandeling, via hetzelfde veld dat de behandelpagina gebruikt
 * voor "Draait op". Ook daar dus een omkering en geen tweede bron.
 *
 * Staat er voor dit probleem geen enkele behandeling, dan rendert het onderdeel niets. Een
 * lege kop is erger dan geen kop.
 */
export default function BehandelingenBijProbleem({
  pad,
  kop = "Wat we hiervoor",
  accent = "inzetten",
  intro,
}: {
  /** Het pad van deze huidprobleempagina, zoals het in `bijProblemen` staat. */
  pad: string;
  kop?: string;
  accent?: string;
  intro?: string;
}) {
  const behandelingen = BEHANDELINGEN.filter((b) =>
    b.bijProblemen?.some((p) => p.href === pad),
  );

  if (behandelingen.length === 0) return null;

  const toepassingen = toepassingenBijProbleem(
    pad.replace("/huidproblemen/", ""),
  );

  return (
    <section
      id="behandelingen"
      className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto">
        <Label>Bij deze klacht</Label>
        <h2 className="diba-display-m mt-4 max-w-[24ch]">
          {kop} <span className="diba-accent">{accent}</span>
        </h2>
        {intro ? (
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            {intro}
          </p>
        ) : null}

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {behandelingen.map((b) => {
            /* Dezelfde helper als de behandelpagina gebruikt voor "Draait op", dus
               een omkering van bestaande data en geen tweede koppeling die uit de pas
               kan lopen. Een traject of een test draait op niets en krijgt hier niets. */
            const apparaat = apparatenVoorBehandeling(b.slug)[0];
            /* Bestaat er een pagina voor precies deze behandeling bij deze klacht, dan
               is dat een preciezer antwoord dan de algemene behandelpagina. */
            const toepassing = toepassingen.find(
              (t) => t.behandeling === b.slug,
            );
            return (
              <li
                key={b.slug}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="diba-card-title">{b.naam}</h3>
                  <span className="text-[15px] leading-6 text-[var(--t-muted)] tabular-nums">
                    {prijsTekst(b.prijs)}
                  </span>
                </div>

                {/* Vier regelhoogtes, zodat de kaarten in een rij gelijk blijven ook als
                    de ene omschrijving net omvalt naar een extra regel. */}
                <p className="mt-3 min-h-[4lh] grow text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(b.kort)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--g-100)] pt-5">
                  <Link
                    href={
                      toepassing
                        ? `/behandelingen/${toepassing.behandeling}/${toepassing.slug}`
                        : `/behandelingen/${b.slug}`
                    }
                    className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  >
                    {toepassing ? "Bij deze klacht" : "Wat het inhoudt"}
                  </Link>
                  {apparaat ? (
                    <Link
                      href={`/apparatuur/${apparaat.slug}`}
                      className="diba-label text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
                    >
                      Op de {apparaat.naam}
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
