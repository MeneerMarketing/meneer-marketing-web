/**
 * Een vertaalde zin met de getallen erin: vul(t("{0} van de {1}"), 3, 9) geeft "3 van de 9".
 *
 * WAAROM NIET {t("Je hebt")} {n} {t("vragen ingevuld")}.
 *
 * Dat knipt een zin in stukken die elk apart door het woordenboek gaan, en in het Spaans
 * of het Engels staat het getal niet op dezelfde plek als in het Nederlands. Bovendien
 * eet JSX de spatie tussen twee losse stukken op een nieuwe regel op, waardoor er
 * "5 van 9vragen" op de pagina stond. Een sleutel met een plaatshouder laat de vertaler de
 * hele zin bouwen, en de spatie staat dan in de zin zelf.
 *
 * Voor de samengestelde zinnen van het huidprofiel (met een opsomming erin) is er
 * `redenTekst` in data/huidprofiel.ts; dit is de kleine broer voor een los getal.
 */
export function vul(
  zin: string,
  ...delen: readonly (string | number)[]
): string {
  return delen.reduce<string>(
    (uit, d, i) => uit.replace("{" + i + "}", String(d)),
    zin,
  );
}
