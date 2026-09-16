import type { Taal } from "@/lib/taal";

/**
 * "23 dagen geleden" in de taal van de pagina.
 *
 * WAAROM DIT GEEN WOORDENBOEKREGELS ZIJN.
 *
 * De reviews dragen hun datum als tekst, zoals Salonized hem levert, en dat levert
 * vijfendertig verschillende zinnen op: van "ongeveer 12 uur geleden" tot "meer dan 7 jaar
 * geleden". Die allemaal in het woordenboek zetten werkt tot de volgende review binnenkomt
 * met een vorm die er nog niet in staat, en dan staat er ineens Nederlands tussen het
 * Engels. Dit zijn regels in plaats van losse regels, dus elke nieuwe vorm gaat vanzelf mee.
 *
 * De reviewtekst zelf vertalen we niet: die is door een klant geschreven en een vertaalde
 * review is een verzonnen review. De datum eromheen is van ons, en die staat dus in de
 * taal van de pagina, ook naast een Nederlandse review.
 */

type Vorm = {
  /** Per eenheid: het Nederlandse patroon, enkelvoud, meervoud en het woord voor "een". */
  readonly eenheden: readonly (readonly [RegExp, string, string, string])[];
  /** De bepaling vooraf: "ongeveer", "bijna", "meer dan". */
  readonly vooraf: {
    readonly ongeveer: string;
    readonly bijna: string;
    readonly meerDan: string;
  };
  /** Zet de delen in de volgorde van de taal: "2 months ago" tegenover "hace 2 meses". */
  readonly zin: (vooraf: string, aantal: string, woord: string) => string;
};

const VORMEN: Readonly<Record<Exclude<Taal, "nl">, Vorm>> = {
  en: {
    eenheden: [
      [/\buur\b/, "hour", "hours", "an"],
      [/\bdag(en)?\b/, "day", "days", "a"],
      [/\bweken?\b/, "week", "weeks", "a"],
      [/\bmaand(en)?\b/, "month", "months", "a"],
      [/\bjaar|jaren\b/, "year", "years", "a"],
    ],
    vooraf: { ongeveer: "about ", bijna: "almost ", meerDan: "over " },
    zin: (vooraf, aantal, woord) => `${vooraf}${aantal} ${woord} ago`,
  },
  es: {
    eenheden: [
      [/\buur\b/, "hora", "horas", "una"],
      [/\bdag(en)?\b/, "día", "días", "un"],
      [/\bweken?\b/, "semana", "semanas", "una"],
      [/\bmaand(en)?\b/, "mes", "meses", "un"],
      [/\bjaar|jaren\b/, "año", "años", "un"],
    ],
    vooraf: {
      ongeveer: "aproximadamente ",
      bijna: "casi ",
      meerDan: "más de ",
    },
    zin: (vooraf, aantal, woord) => `hace ${vooraf}${aantal} ${woord}`,
  },
};

export function relatieveDatum(nl: string, taal: Taal): string {
  if (taal === "nl") return nl;
  const vorm = VORMEN[taal];

  const tekst = nl.toLowerCase();

  const eenheid = vorm.eenheden.find(([patroon]) => patroon.test(tekst));
  if (!eenheid) return nl;

  const getal = tekst.match(/\d+/)?.[0];
  const isEen = /\been\b/.test(tekst);
  const aantal = getal ?? (isEen ? eenheid[3] : "");
  const woord = getal && getal !== "1" ? eenheid[2] : eenheid[1];

  let vooraf = "";
  if (tekst.startsWith("ongeveer")) vooraf = vorm.vooraf.ongeveer;
  else if (tekst.startsWith("bijna")) vooraf = vorm.vooraf.bijna;
  else if (tekst.startsWith("meer dan")) vooraf = vorm.vooraf.meerDan;

  const kern = vorm.zin(vooraf, aantal, woord).replace(/\s+/g, " ").trim();
  return kern.charAt(0).toUpperCase() + kern.slice(1);
}
