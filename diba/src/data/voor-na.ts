import type { VoorNaPaar } from "@/components/resultaten/VoorNaSchuif";

/**
 * De voor-en-na-paren op /resultaten.
 *
 * [BEELD-NODIG] de opnamen zelf. Ze staan hier al wel als plek, met de behandeling en het
 * traject erbij, zodat de pagina zijn vorm heeft voordat de beelden er zijn. Zolang `voor`
 * en `na` ontbreken toont de schuif een leeg vak; er wordt dus nooit een resultaat getoond
 * dat er niet is.
 *
 * [MEDISCHE-CHECK-ROJDA] de trajecten per paar: aantal sessies en doorlooptijd moeten
 * kloppen met wat er werkelijk gedaan is, en niet met wat gebruikelijk is.
 *
 * WAT ER BIJ ELK PAAR MOET STAAN VOORDAT HET LIVE MAG.
 *
 * 1. Vastgelegde toestemming van de persoon, per beeld, intrekbaar.
 * 2. Zelfde licht, zelfde hoek, zelfde afstand. Anders vergelijk je twee foto's en geen
 *    twee momenten.
 * 3. Het traject erbij: hoeveel sessies en over hoeveel tijd. Zonder dat getal is een
 *    voor-en-na een belofte zonder prijs.
 * 4. Het huidtype. Wat er kan hangt daarvan af, en dat weglaten wekt de indruk dat dit
 *    voor iedereen zo werkt.
 *
 * De volgorde hieronder is de volgorde waarin ze op de pagina komen. Negen plekken, omdat
 * dat drie volle rijen is; er kunnen er zonder meer bij.
 */
export const VOOR_NA_PAREN: readonly VoorNaPaar[] = [
  {
    id: "acne-traject",
    behandeling: "Acnetraject",
    traject: "Zes sessies over vier maanden",
    huidtype: "III",
  },
  {
    id: "pigment-melasma",
    behandeling: "Pigment en melasma",
    traject: "Cosmelan, traject van zes maanden",
    huidtype: "IV",
  },
  {
    id: "littekens",
    behandeling: "Littekentherapie",
    traject: "Vier sessies microneedling over vijf maanden",
    huidtype: "II",
  },
  {
    id: "roodheid",
    behandeling: "Roodheid en vaatjes",
    traject: "Drie sessies Nordlys IPL over tien weken",
    huidtype: "I",
  },
  {
    id: "textuur",
    behandeling: "Huidtextuur en poriën",
    traject: "Vier sessies SkinPen over drie maanden",
    huidtype: "III",
  },
  {
    id: "veroudering",
    behandeling: "Verslapping en fijne lijnen",
    traject: "Fotona 4D, drie sessies over drie maanden",
    huidtype: "II",
  },
  {
    id: "laserontharing",
    behandeling: "Laserontharing onderbenen",
    traject: "Acht sessies over veertien maanden",
    huidtype: "IV",
  },
  {
    id: "droge-huid",
    behandeling: "Droge en gevoelige huid",
    traject: "Drie maanden met aangepaste verzorging",
    huidtype: "II",
  },
  {
    id: "jongeren-acne",
    behandeling: "Jongerentraject acne",
    traject: "Drie maanden begeleiding met controles",
    huidtype: "III",
  },
];
