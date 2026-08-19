"use client";

import Link from "next/link";
import { publicCopy } from "@/lib/copy-flags";
import { useOordelen } from "@/lib/huidprofiel-oordeel";

/**
 * Wat er bij jou uit het huidprofiel kwam, op de pagina van deze behandeling zelf.
 *
 * HET GAT DAT DIT DICHT.
 *
 * Het huidprofiel rekent al uit welke behandelingen passen, welke afvallen en om welke
 * reden. Die uitkomst bleef alleen op /huidprofiel staan. Klikte je daarna door naar een
 * behandeling, dan deed die pagina alsof je nooit iets had ingevuld, ook als hij een
 * minuut eerder was afgevallen op je hersteltijd.
 *
 * Dat is precies de plek waar iemand de vraag stelt. Niet op de overzichtspagina, maar op
 * de pagina van het ding dat hij overweegt.
 *
 * WAAROM DIT NIETS VERZINT.
 *
 * De redenen komen letterlijk uit `maakMatches`, dezelfde functie die de uitkomstpagina
 * voedt. Er is geen tweede oordeel en geen tweede formulering; als Rojda daar iets
 * verandert, verandert het hier mee. Deze component leest alleen voor.
 *
 * WAAROM ER NIETS VERSTUURD WORDT.
 *
 * Het profiel staat in localStorage en nergens anders. Deze component draait in de
 * browser, leest daar, en rendert. Op de server bestaat het profiel niet, dus daar valt
 * hij terug op leeg en verschijnt er niets. Dat is meteen de reden dat de pagina zonder
 * profiel exact blijft zoals hij was: geen verschuiving, geen lege plek.
 *
 * WANNEER HIJ ZWIJGT.
 *
 * Bij een leeg profiel. Een enkel antwoord is genoeg om iets te zeggen, maar nul
 * antwoorden betekent dat er niets te zeggen valt, en dan is een balk met "we weten nog
 * niets van je" alleen maar ruis.
 */

export default function ProfielOordeel({ slug }: { slug: string }) {
  const oordelen = useOordelen();
  const match = oordelen?.get(slug);

  if (!match) return null;

  /* De kop zegt waarom, niet alleen wat.

     Hier stond eerst "Dit viel bij jou af" boven elk oordeel dat geen "past" was. Dat is
     bij een contra-indicatie waar, en bij verreweg de meeste gevallen niet: wie acne
     opgeeft en op een rimpelbehandeling terechtkomt, krijgt dan te lezen dat hij ergens
     voor is afgekeurd terwijl de behandeling gewoon over iets anders gaat.

     De kleur volgt dezelfde scheiding. Alleen een echte grens (zwangerschap, medicatie,
     huidtype, hersteltijd) krijgt de waarschuwingskleur. Een verschil in onderwerp is
     gewoon informatie en hoort er ook zo uit te zien. */
  const HARD = match.grond === "blokkade" || match.grond === "herstel";

  const KOPPEN: Record<typeof match.grond, string> = {
    blokkade: "Dit kan bij jou nu niet",
    herstel: "Dit vraagt meer hersteltijd dan je aangaf",
    "ander-doel": "Dit gaat over iets anders dan jij zoekt",
    zijdelings: "Dit kan, met een kanttekening",
    raak: "Dit past bij je profiel",
    "geen-doel": "Je hebt nog niet gezegd wat je wil veranderen",
  };

  const vlak = HARD ? "bg-[var(--g-075)]" : "bg-[var(--g-050)]";
  const kop = KOPPEN[match.grond];
  const koptint = HARD ? "text-[var(--warn-text)]" : "text-[var(--t-label)]";
  return (
    <div className={`mt-8 rounded-[var(--r-md)] p-6 sm:p-7 ${vlak}`}>
      <p className={`diba-label ${koptint}`}>{kop}</p>
      <p className="mt-2 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
        {publicCopy(match.reden)}
      </p>

      {match.letOp.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {match.letOp.map((l) => (
            <li
              key={l}
              className="max-w-[64ch] text-[15px] leading-7 text-[var(--t-muted)]"
            >
              {publicCopy(l)}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Altijd de uitweg erbij. Een oordeel dat je niet kunt herzien is een oordeel dat
          je moet geloven, en dat is precies wat deze site niet vraagt. */}
      <Link
        href="/huidprofiel"
        className="diba-label mt-5 inline-block text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
      >
        Op je huidprofiel aanpassen
      </Link>
    </div>
  );
}
