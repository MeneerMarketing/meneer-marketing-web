import { DIBA_HOME_PROOF_ITEMS } from "@/lib/site";

/**
 * De vier cijfers, als strook onder een hero.
 *
 * WAAROM DIT EEN EIGEN COMPONENT IS.
 *
 * De cijfers stonden in `HomeHero`, in twee standen: een compacte die over het beeld
 * hangt en een brede die eronder staat. Beide zaten in dat bestand vast, dus een hero die
 * ze eronder wil zetten kon er niet bij. Deze strook is de brede stand, losgetrokken.
 *
 * GEEN KAART, GEEN RAND, GEEN OVERLAP.
 *
 * Drie standen verder is dit de vorm die blijft (Yasin, 11 september 2026): "die vier
 * moeten niet half in de hero maar gewoon in dat witte vlak eronder, en zonder randje;
 * alleen de tekst en de afscheiders."
 *
 * Dus staat er geen vlak omheen en hangt er niets over de hero. Wat het bij elkaar houdt
 * zijn de drie verticale streepjes ertussen, en verder de witruimte eromheen. Een kaart met
 * een schaduw maakte er een object van dat over de rand van de hero viel; deze vier cijfers
 * zijn geen object maar een regel onder de kop.
 *
 * EEN DUNNE BALK.
 *
 * Yasin, 11 september 2026: "kleiner en dunner, dezelfde stijl en dezelfde afscheiders,
 * maar alles kleiner." De maten hieronder zijn daarop gezet: de vulling van 32 naar 16
 * pixels, het cijfer op een breed scherm van 30 naar 20 punten en het opschrift overal op
 * 10. Een ronde later ging de vulling naar 8 pixels en verdween die in de vakken helemaal:
 * "boven en onder nog minder witruimte, dat het echt een strook wordt." Wat er nu staat is
 * de regel zelf met acht pixels lucht eromheen.
 *
 * VIER KOLOMMEN, OOK OP EEN TELEFOON.
 *
 * Op 375 pixels is een kolom tweeëntachtig breed, en "BEHANDELINGEN" past daar niet in.
 * Vandaar het korte opschrift op een telefoon (`kort`) en de kleinere letter: dezelfde
 * maatvoering als in de oude hero, waar dit werkte.
 */

/** Het getal met zijn achtervoegsel, in Nederlandse notatie. */
function getal(item: (typeof DIBA_HOME_PROOF_ITEMS)[number]): string {
  const waarde =
    typeof item.value === "number"
      ? item.value.toLocaleString("nl-NL")
      : item.value;
  return `${waarde}${item.suffix ?? ""}`;
}

export default function Cijferstrook({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`px-5 py-2 sm:px-9 sm:py-2.5 lg:px-[7.5vw] ${className}`}>
      <dl className="mx-auto grid grid-cols-4">
        {DIBA_HOME_PROOF_ITEMS.map((item, i) => {
          const cijfer = (
            <dd className="text-[15px] leading-tight font-medium tracking-[-.03em] text-[var(--g-700)] tabular-nums sm:text-[20px] sm:tracking-[-.04em]">
              {getal(item)}
            </dd>
          );
          return (
            <div
              key={item.label}
              className={`min-w-0 px-1 text-center sm:px-4 ${
                i > 0 ? "border-l border-[var(--g-100)]" : ""
              }`}
            >
              {/* Een cijfer dat ergens anders staat dan bij ons is aanklikbaar, zodat je
                  het kunt nakijken. De Zorgkaart-score is het enige met een href; de
                  andere drie komen uit ons eigen systeem. */}
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* `py-1 -my-1`: het cijfer zelf is negentien pixels hoog en dat is een
                     tikdoel van negentien pixels. De vulling maakt er zevenentwintig van
                     en de negatieve marge haalt die ruimte weer uit de opmaak, zodat het
                     vak niet verschuift. */
                  className="-my-1 block rounded-[var(--r-sm)] py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {cijfer}
                </a>
              ) : (
                cijfer
              )}
              <dt className="diba-label mt-0.5 text-[10px] leading-tight text-[var(--t-muted)] sm:mt-1">
                <span className="sm:hidden">{item.kort ?? item.label}</span>
                <span className="max-sm:hidden">{item.label}</span>
              </dt>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
