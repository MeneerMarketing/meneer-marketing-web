"use client";

import { useState } from "react";
import {
  DIBA_EMAIL,
  DIBA_REACTIETIJDEN,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * De ingangkiezer: welke vraag hoort bij welk kanaal.
 *
 * WAAROM DIT DE SIGNATUUR VAN DEZE PAGINA IS.
 *
 * Een contactpagina zet meestal drie iconen naast elkaar en laat jou raden welke van de
 * drie het snelst antwoord geeft. Dat is niet neutraal: wie het verkeerde kanaal kiest
 * wacht twee dagen op iets wat via WhatsApp in tien minuten klaar was, of belt over iets
 * wat aan de telefoon niet te beantwoorden valt.
 *
 * Dus staat het er gewoon. Per soort vraag: waar je moet zijn, waarom, en wat we via dat
 * kanaal níet kunnen. Dat laatste is het stuk dat nergens staat en dat de meeste tijd
 * scheelt: over je huid kunnen we op afstand niets beslissen, hoe goed de foto ook is.
 *
 * Geen formulier. Een contactformulier belooft dat er iets aankomt en zegt niet wanneer
 * er iemand kijkt; de kanalen hieronder zijn van de kliniek zelf en daar is dat wel te
 * zeggen, en dat staat er nu ook: per kanaal hoe snel je antwoord krijgt. Dat is de
 * tweede vraag na "waar moet ik zijn", en zonder dat antwoord kies je alsnog op gevoel.
 * De tijden komen uit DIBA_REACTIETIJDEN in site.ts.
 * [GEGEVEN-NODIG: bevestiging van de reactietijden, Okan]
 */

type Ingang = {
  readonly id: string;
  readonly vraag: string;
  readonly kanaal: "whatsapp" | "bellen" | "mail" | "afspraak";
  readonly waarom: string;
  readonly nietHier?: string;
};

const INGANGEN: readonly Ingang[] = [
  {
    id: "afspraak",
    vraag: "Ik wil een afspraak maken",
    kanaal: "afspraak",
    waarom:
      "Elk traject begint met een meting, dus dat is ook de afspraak die je maakt. Wat daarna volgt hangt af van wat eruit komt.",
  },
  {
    id: "verzetten",
    vraag: "Ik wil mijn afspraak verzetten of afzeggen",
    kanaal: "bellen",
    waarom:
      "Bellen gaat het snelst, want dan kijkt er meteen iemand in de agenda mee. Ben je te laat om nog te bellen, stuur dan een bericht.",
  },
  {
    id: "kan-dit",
    vraag: "Kan deze behandeling bij mijn huid?",
    kanaal: "whatsapp",
    waarom:
      "Voor de meeste van dit soort vragen is een bericht genoeg: we kunnen zeggen wat er meespeelt en waar je op moet letten.",
    nietHier:
      "Wat we niet kunnen is beslissen. Of iets bij jouw huid past hangt af van wat een meting laat zien, en dat is aan een foto niet te zien.",
  },
  {
    id: "prijs",
    vraag: "Wat gaat dit mij kosten?",
    kanaal: "whatsapp",
    waarom:
      "De tarieven staan al op de prijzenpagina, per sessie en per zone. Wat daar niet staat is hoeveel sessies jij nodig hebt, en dat hoor je na de meting.",
  },
  {
    id: "klacht",
    vraag: "Ik ben ergens niet tevreden over",
    kanaal: "mail",
    waarom:
      "Op de mail, zodat het schriftelijk staat en er iemand op terugkomt. Een klacht hoort niet tussen de berichten door.",
  },
  {
    id: "zakelijk",
    vraag: "Ik heb een zakelijke of pers-vraag",
    kanaal: "mail",
    waarom: "De mail komt bij de juiste persoon terecht.",
  },
];

/* `hoeSnel` hangt aan het kanaal en niet aan de vraag: hoe lang je op een mail wacht is
   niet afhankelijk van waar die mail over gaat. De tijden staan in site.ts, want ze zijn
   een afspraak van de kliniek en geen tekst van deze component. */
const KANALEN = {
  whatsapp: {
    label: "WhatsApp",
    actie: "Stuur een bericht",
    href: DIBA_WHATSAPP_URL,
    extern: true,
    hoeSnel: DIBA_REACTIETIJDEN.whatsapp,
  },
  bellen: {
    label: "Bellen",
    actie: DIBA_TELEFOON,
    href: DIBA_TELEFOON_HREF,
    extern: false,
    hoeSnel: DIBA_REACTIETIJDEN.telefoon,
  },
  mail: {
    label: "E-mail",
    actie: DIBA_EMAIL,
    href: `mailto:${DIBA_EMAIL}`,
    extern: false,
    hoeSnel: DIBA_REACTIETIJDEN.email,
  },
  afspraak: {
    label: "Online plannen",
    actie: "Plan een huidconsult",
    href: "/intake",
    extern: false,
    hoeSnel:
      "Meteen. Je kiest zelf een moment en de bevestiging komt direct binnen.",
  },
} as const;

export default function Ingangkiezer() {
  const [gekozen, setGekozen] = useState<string>(INGANGEN[0].id);
  const ingang = INGANGEN.find((i) => i.id === gekozen) ?? INGANGEN[0];
  const kanaal = KANALEN[ingang.kanaal];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <ul className="space-y-2.5" role="list">
        {INGANGEN.map((i) => {
          const aan = i.id === gekozen;
          return (
            <li key={i.id}>
              <button
                type="button"
                aria-pressed={aan}
                onClick={() => setGekozen(i.id)}
                className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-[var(--r-md)] px-6 py-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-white text-[var(--t-strong)] hover:bg-[var(--g-100)]"
                }`}
              >
                <span className="text-[16px] leading-6 font-medium">
                  {i.vraag}
                </span>
                {/* Stond op --g-300: 1,97 op wit, en dat is te bleek om te zien. Deze
                    pijl wijst aan welke vraag je kunt aantikken, dus zichtbaarheid is
                    hier geen versiering. --t-label haalt 4,54. */}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[18px] leading-none transition-transform duration-200 ${
                    aan ? "translate-x-1 text-white" : "text-[var(--t-label)]"
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 sm:p-9 lg:p-10">
        <p className="diba-label text-[var(--g-800)]">Dan kom je hier uit</p>
        <p className="diba-display-s mt-4">{kanaal.label}</p>

        <p className="mt-5 max-w-[46ch] text-[16px] leading-8 text-[var(--g-900)]">
          {ingang.waarom}
        </p>

        {/* Hoe snel je antwoord krijgt. Dat is de tweede vraag na "waar moet ik zijn",
            en zonder dat antwoord kies je alsnog op gevoel welk kanaal het snelst is. */}
        <p className="mt-5 max-w-[46ch] rounded-[var(--r-md)] bg-white p-5">
          <span className="diba-label block text-[var(--t-label)]">
            Wanneer je antwoord hebt
          </span>
          <span className="mt-2 block text-[15px] leading-7 text-[var(--t-body)]">
            {kanaal.hoeSnel}
          </span>
        </p>

        {/* Wat er via dit kanaal níet kan. Dit is de regel die de meeste tijd bespaart
            en die op geen enkele contactpagina staat. */}
        {ingang.nietHier ? (
          <p className="mt-5 max-w-[46ch] rounded-[var(--r-md)] bg-white p-5 text-[15px] leading-7 text-[var(--t-body)]">
            {ingang.nietHier}
          </p>
        ) : null}

        <a
          href={kanaal.href}
          {...(kanaal.extern
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-7 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          {kanaal.actie}
          {kanaal.extern ? <span aria-hidden="true">↗</span> : null}
        </a>
      </div>
    </div>
  );
}
