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
 * DE MAAT, EN WAAROM HIJ TERUG IS WAAR HIJ WAS.
 *
 * Deze balk is twee keer kleiner gemaakt op verzoek, eerst naar de helft en daarna tot een
 * strook van acht pixels lucht. Dat laatste was te ver: "die balk die nu zo klein en dun is
 * vind ik niet mooi, zet hem terug in de grootte zoals je hem eerst had, dat oogde strakker"
 * (Yasin, 11 september 2026). De maten hieronder zijn dus weer die van de versie die het
 * wel deed: 32 pixels vulling boven en onder, het cijfer op 15 punten op een telefoon en 30
 * op een breed scherm. Wat uit die tussenrondes bleef is de vorm zelf: geen kaart, geen
 * rand, alleen de cijfers met drie streepjes ertussen.
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
    <div className={`px-5 py-8 sm:px-9 sm:py-10 lg:px-[7.5vw] ${className}`}>
      <dl className="mx-auto grid grid-cols-4">
        {DIBA_HOME_PROOF_ITEMS.map((item, i) => {
          const cijfer = (
            <dd className="text-[18px] leading-tight font-medium tracking-[-.03em] text-[var(--g-700)] tabular-nums sm:text-[30px] sm:tracking-[-.04em]">
              {getal(item)}
            </dd>
          );
          return (
            <div
              key={item.label}
              className={`min-w-0 px-0.5 text-center sm:px-4 ${
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
              {/* Op een telefoon een punt groter dan het was, maar met minder letterafstand:
                  `diba-label` staat op 0,13em en dan is "BEHANDELD" tachtig pixels breed
                  in een vakje van vierentachtig, en breekt het woord over twee regels.
                  Met 0,06em is het er vierenzeventig en past het met ruimte over. Vanaf 640
                  is er plek genoeg en staat de gewone letterafstand er weer. */}
              <dt className="diba-label mt-1 text-[11px] leading-tight tracking-[0.06em] text-[var(--t-muted)] sm:mt-2 sm:text-[12px] sm:tracking-[0.13em]">
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
