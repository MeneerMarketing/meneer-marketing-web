"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * De wachtweegschaal: wat er gebeurt als je niets doet.
 *
 * WAAROM DIT DE SIGNATUUR VAN DEZE PAGINA IS.
 *
 * Elke andere pagina hier gaat over wat een behandeling doet. Deze gaat over het
 * alternatief dat nooit wordt aangeboden: niets. Dat verdient dus ook een andere vorm dan
 * de rest van de site: geen doorsnede en geen filter maar een tijdlijn met twee sporen
 * naast elkaar, wachten en behandelen, over dezelfde maanden.
 *
 * De uitkomst is met opzet niet altijd "behandelen". Bij een deel van wat mensen hier
 * brengen is wachten het betere spoor, en dat staat er dan gewoon. Een kliniek die dat
 * nooit zegt heeft geen advies maar een aanbod.
 *
 * Wat dit NIET is: een adviesinstrument. Er komt geen aanbeveling uit en er wordt niets
 * bewaard. Het legt twee verlopen naast elkaar; wat er bij jou speelt bepaalt een mens na
 * een meting.
 *
 * [MEDISCHE-CHECK-ROJDA] Elk verloop hieronder, zonder uitzondering. Dit zijn algemene
 * beschrijvingen van een natuurlijk beloop en geen voorspelling voor een individu.
 */

type Spoor = {
  readonly maand: string;
  readonly wachten: string;
  readonly behandelen: string;
};

type Kwestie = {
  readonly id: string;
  readonly label: string;
  readonly zin: string;
  /** Het eerlijke antwoord vooraf: is wachten hier een redelijk spoor? */
  readonly wachtenKan: "vaak" | "soms" | "zelden";
  readonly korteConclusie: string;
  readonly sporen: readonly Spoor[];
};

const KWESTIES: readonly Kwestie[] = [
  {
    id: "roodheid-na-puistje",
    label: "Rode plek na een puistje",
    zin: "Een rode of donkere vlek na een puistje kan in de maanden erna vanzelf lichter worden, vooral wanneer je de huid goed tegen zon beschermt.",
    wachtenKan: "vaak",
    korteConclusie:
      "Dit is meestal het geval waarin wachten wint. De verkleuring na een ontsteking trekt in de meeste huiden vanzelf weg; behandelen versnelt het hooguit en kan bij ongeduld juist prikkelen.",
    sporen: [
      {
        maand: "Nu",
        wachten: "Een rode of bruine vlek waar het puistje zat.",
        behandelen:
          "Hetzelfde beeld. Er valt op dit moment weinig te versnellen.",
      },
      {
        maand: "Na 3 maanden",
        wachten: "Vaak duidelijk lichter, zeker als je de zon eraf houdt.",
        behandelen:
          "Iets sneller lichter, met de kosten en de hersteltijd erbij.",
      },
      {
        maand: "Na 12 maanden",
        wachten: "In veel gevallen niet meer te zien.",
        behandelen: "Vergelijkbaar eindpunt, eerder bereikt.",
      },
    ],
  },
  {
    id: "pigment-zon",
    label: "Pigmentvlekken door de zon",
    zin: "Bruine vlekken die na een zomer opkomen en niet meer weggaan.",
    wachtenKan: "soms",
    korteConclusie:
      "Wachten verandert hier weinig, maar beschermen wel. Zonder zonbescherming komt behandeld pigment terug, dus dat is geen keuze naast behandelen maar een voorwaarde ervoor.",
    sporen: [
      {
        maand: "Nu",
        wachten: "Vlekken die er zijn en blijven.",
        behandelen:
          "Eerst meten hoe diep het pigment zit; dat bepaalt de aanpak.",
      },
      {
        maand: "Na 3 maanden",
        wachten: "Ongeveer gelijk, of donkerder na zon.",
        behandelen:
          "Zichtbaar lichter bij de meeste huidtypes, mits de zon eraf blijft.",
      },
      {
        maand: "Na 12 maanden",
        wachten: "Meestal onveranderd tot iets uitgebreider.",
        behandelen:
          "Blijvend lichter zolang je beschermt. Zonder bescherming komt het terug, ook na een geslaagd traject.",
      },
    ],
  },
  {
    id: "acne-actief",
    label: "Acne die nu actief is",
    zin: "Ontstekingen die blijven komen, niet één enkel puistje.",
    wachtenKan: "zelden",
    korteConclusie:
      "Hier kost wachten iets. Actieve ontstekingen kunnen littekens achterlaten, en die zijn moeilijker en duurder aan te pakken dan de acne zelf. Dat is het argument om niet te wachten, en het is een ander argument dan een mooiere huid.",
    sporen: [
      {
        maand: "Nu",
        wachten: "Actieve ontstekingen, wisselend per week.",
        behandelen:
          "Eerst uitzoeken wat het aanjaagt; vaak speelt er van binnenuit iets mee.",
      },
      {
        maand: "Na 3 maanden",
        wachten: "Vaak hetzelfde beeld, soms met de eerste putjes erbij.",
        behandelen: "Minder nieuwe ontstekingen bij een aanpak die aanslaat.",
      },
      {
        maand: "Na 12 maanden",
        wachten:
          "De acne kan uitdoven, maar wat er aan littekens is ontstaan blijft. Die vragen daarna een eigen traject.",
        behandelen:
          "Rustiger huid, en minder schade om later nog aan te werken.",
      },
    ],
  },
  {
    id: "rimpels",
    label: "Eerste fijne lijntjes",
    zin: "Lijntjes die je vooral zelf ziet, bij bepaald licht.",
    wachtenKan: "vaak",
    korteConclusie:
      "Er is hier geen medische reden om iets te doen, en er is ook geen moment waarop het te laat wordt. Dat maakt het een keuze en geen noodzaak, en die keuze is aan jou en niet aan ons.",
    sporen: [
      {
        maand: "Nu",
        wachten: "Lijntjes die er zijn.",
        behandelen:
          "Meten wat er onder zit: lijntjes in de bovenlaag of beginnende verslapping.",
      },
      {
        maand: "Na 3 maanden",
        wachten: "Nauwelijks verschil; huidveroudering gaat langzaam.",
        behandelen:
          "Bij needling of laser komt het resultaat in deze periode op gang.",
      },
      {
        maand: "Na 12 maanden",
        wachten: "Iets meer dan nu, en dat blijft zo verlopen.",
        behandelen:
          "Zichtbaar verschil bij een reeks, en onderhoud daarna. Stoppen betekent dat het verloop weer zijn gang gaat.",
      },
    ],
  },
  {
    id: "haargroei",
    label: "Ongewenste haargroei",
    zin: "Haar dat blijft terugkomen, waar dan ook.",
    wachtenKan: "zelden",
    korteConclusie:
      "Wachten verandert hier niets: haargroei dooft niet vanzelf uit. Dit is dus geen afweging tussen wachten en behandelen maar tussen blijven scheren of eraan werken.",
    sporen: [
      {
        maand: "Nu",
        wachten: "Scheren of harsen, en dat blijft terugkomen.",
        behandelen: "Eerst je huidtype vaststellen; dat bepaalt de instelling.",
      },
      {
        maand: "Na 3 maanden",
        wachten: "Onveranderd.",
        behandelen:
          "Na een paar sessies minder en fijner haar in het behandelde gebied.",
      },
      {
        maand: "Na 12 maanden",
        wachten: "Onveranderd, met de kosten en de tijd van blijven scheren.",
        behandelen:
          "Duidelijke afname na een volledige reeks, met onderhoud daarna.",
      },
    ],
  },
];

const OORDEEL = {
  vaak: {
    label: "Wachten kan vaak",
    kleur: "bg-[var(--g-200)] text-[var(--g-900)]",
  },
  soms: {
    label: "Wachten kan soms",
    kleur: "bg-[var(--g-100)] text-[var(--g-900)]",
  },
  zelden: {
    label: "Wachten kost hier iets",
    kleur: "bg-[var(--g-700)] text-white",
  },
} as const;

export default function Wachtweegschaal() {
  const [gekozen, setGekozen] = useState(KWESTIES[0].id);
  const k = KWESTIES.find((x) => x.id === gekozen) ?? KWESTIES[0];
  const oordeel = OORDEEL[k.wachtenKan];

  return (
    <div>
      <ul className="flex flex-wrap gap-2" role="list">
        {KWESTIES.map((x) => {
          const aan = x.id === gekozen;
          return (
            <li key={x.id}>
              <button
                type="button"
                aria-pressed={aan}
                onClick={() => setGekozen(x.id)}
                className={`diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] px-5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
                }`}
              >
                {x.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`diba-label rounded-[var(--r-pill)] px-4 py-2 ${oordeel.kleur}`}
          >
            {oordeel.label}
          </span>
          <p className="text-[16px] leading-7 text-[var(--t-muted)]">{k.zin}</p>
        </div>

        <p className="mt-6 max-w-[68ch] text-[17px] leading-8 text-[var(--t-body)]">
          {k.korteConclusie}
        </p>

        {/* Twee sporen over dezelfde maanden. Deze vorm komt nergens anders op de site
            voor, en dat is de bedoeling: dit is de enige pagina die het alternatief
            naast het aanbod legt. */}
        <div className="mt-10 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[7rem_1fr_1fr] gap-x-6">
              <span className="diba-label text-[var(--t-label)]">Wanneer</span>
              <span className="diba-label text-[var(--t-label)]">
                Als je niets doet
              </span>
              <span className="diba-label text-[var(--t-label)]">
                Als je behandelt
              </span>
            </div>

            <ul className="mt-3">
              {k.sporen.map((s) => (
                <li
                  key={s.maand}
                  className="grid grid-cols-[7rem_1fr_1fr] items-stretch gap-x-6 gap-y-2 py-2"
                >
                  <span className="flex items-center text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                    {s.maand}
                  </span>
                  <span className="rounded-[var(--r-md)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
                    {s.wachten}
                  </span>
                  <span className="rounded-[var(--r-md)] bg-[var(--g-100)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
                    {s.behandelen}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 max-w-[68ch] text-[14px] leading-7 text-[var(--t-muted)]">
          Dit is een algemeen beloop en geen voorspelling voor jouw huid. Er
          wordt hier niets bewaard en er komt geen advies uit. Wat er bij jou
          speelt blijkt uit een meting, en dat gesprek voeren we liever dan dat
          een pagina het voor je invult.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/huidprofiel"
            className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
          >
            Maak je huidprofiel
          </Link>
          <Link
            href="/dit-behandelen-wij-niet"
            className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            Wat we sowieso niet behandelen
          </Link>
        </div>
      </div>
    </div>
  );
}
