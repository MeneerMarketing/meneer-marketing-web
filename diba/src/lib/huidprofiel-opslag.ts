"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DOELEN,
  FITZPATRICK_TYPES,
  GEBRUIK,
  GEVOELIGHEID,
  HERSTELRUIMTE,
  HUIDCONDITIES,
  LEEFTIJD,
  LEEG_PROFIEL,
  SCAN_ASSEN,
  SITUATIE,
  VOORGESCHIEDENIS,
  type AsId,
  type ConditieId,
  type DoelId,
  type FitzpatrickId,
  type GebruikId,
  type LeeftijdId,
  type GevoeligheidId,
  type HerstelId,
  type Huidprofiel,
  type Huidscan,
  type SituatieId,
  type VoorgeschiedenisId,
} from "@/data/huidprofiel";

/**
 * Het huidprofiel bewaren.
 *
 * In `localStorage` van de bezoeker en nergens anders. Geen account, geen server, geen
 * cookie die iemand volgt. Dat is geen technische luiheid maar de afspraak: een kliniek
 * die zegt dat jouw gegevens van jou zijn, hoort ze niet stilletjes op te slaan omdat het
 * kan.
 *
 * Er staat ook niets gevoeligs in. Drie keuzes uit een lijstje, geen naam, geen mail, geen
 * foto. Dat is met opzet: dit is de plek waar de verleiding het grootst is om alvast een
 * mailadres te vragen, en precies daarom doen we het niet.
 *
 * WAAROM EEN STORE EN GEEN useState-MET-EFFECT. De eerste versie las de opslag in een
 * effect en zette daarna state. Dat werkt, maar het zet twee renders achter elkaar in gang
 * en het houdt twee componenten die hetzelfde profiel tonen niet gelijk. `useSyncExternal-
 * Store` is precies voor dit geval gemaakt: lezen uit iets dat op de server niet bestaat.
 * De servermomentopname is altijd het lege profiel, dus de eerste render is overal
 * hetzelfde en er valt bij de hydratie niets te ontsporen.
 *
 * Bijvangst: elke component die deze hook gebruikt ziet dezelfde waarde en verandert
 * tegelijk mee.
 */

/* v3: het uitgebreide profiel kwam erbij. Een oude v1-sleutel laten we gewoon staan en negeren we;
   opruimen zou betekenen dat we in andermans opslag gaan wissen. */
const SLEUTEL = "diba-huidprofiel-v3";

let huidig: Huidprofiel = LEEG_PROFIEL;
let gelezen = false;
const luisteraars = new Set<() => void>();

function meld() {
  for (const l of luisteraars) l();
}

/**
 * Alles wat uit de opslag komt is verdacht: de bezoeker kan het aangepast hebben en een
 * oudere versie van de site kan er iets anders in hebben gezet. Dus filteren op wat we
 * vandaag kennen, en de rest weggooien.
 */
function lees(): Huidprofiel {
  try {
    const ruw = window.localStorage.getItem(SLEUTEL);
    if (!ruw) return LEEG_PROFIEL;
    const p = JSON.parse(ruw) as Partial<Huidprofiel>;
    return {
      doelen: Array.isArray(p.doelen)
        ? p.doelen.filter((d): d is DoelId => DOELEN.some((x) => x.id === d))
        : [],
      /* Profielen van vóór de leeftijdsvraag missen dit veld. Die komen hier op null
         uit en blijven verder gewoon werken; de vraag staat dan open. */
      leeftijd: LEEFTIJD.some((l) => l.id === p.leeftijd)
        ? (p.leeftijd as LeeftijdId)
        : null,
      huidtype: FITZPATRICK_TYPES.some((f) => f.id === p.huidtype)
        ? (p.huidtype as FitzpatrickId)
        : null,
      herstel: HERSTELRUIMTE.some((h) => h.id === p.herstel)
        ? (p.herstel as HerstelId)
        : null,
      scan: leesScan(p.scan),
      conditie: HUIDCONDITIES.some((c) => c.id === p.conditie)
        ? (p.conditie as ConditieId)
        : null,
      gevoeligheid: GEVOELIGHEID.some((g) => g.id === p.gevoeligheid)
        ? (p.gevoeligheid as GevoeligheidId)
        : null,
      gebruikt: filterOp(p.gebruikt, GEBRUIK) as GebruikId[],
      situatie: filterOp(p.situatie, SITUATIE) as SituatieId[],
      voorgeschiedenis: filterOp(
        p.voorgeschiedenis,
        VOORGESCHIEDENIS,
      ) as VoorgeschiedenisId[],
    };
  } catch {
    return LEEG_PROFIEL;
  }
}

/** Houdt alleen de ids over die we vandaag kennen. */
function filterOp(
  waarde: unknown,
  lijst: readonly { readonly id: string }[],
): string[] {
  if (!Array.isArray(waarde)) return [];
  return waarde.filter(
    (x): x is string => typeof x === "string" && lijst.some((l) => l.id === x),
  );
}

/** Een scan uit de opslag: elke as moet een getal van 0 tot 100 zijn, anders weg ermee. */
function leesScan(s: unknown): Huidscan | null {
  if (!s || typeof s !== "object") return null;
  const r = s as Partial<Huidscan>;
  if (!r.assen || typeof r.assen !== "object") return null;
  const assen = {} as Record<AsId, number>;
  for (const as of SCAN_ASSEN) {
    const w = (r.assen as Record<string, unknown>)[as.id];
    if (typeof w !== "number" || !Number.isFinite(w)) return null;
    assen[as.id] = Math.min(100, Math.max(0, w));
  }
  return {
    assen,
    focusLabel: typeof r.focusLabel === "string" ? r.focusLabel : "",
    pillar: typeof r.pillar === "string" ? r.pillar : null,
    kort: typeof r.kort === "string" ? r.kort : null,
    op: typeof r.op === "string" ? r.op : new Date().toISOString(),
  };
}

function abonneer(luisteraar: () => void) {
  luisteraars.add(luisteraar);

  /* Eén keer, bij de eerste abonnee: wat er in de browser stond ophalen. React vraagt na
     het abonneren opnieuw om de momentopname, dus deze wijziging komt vanzelf aan. */
  if (!gelezen) {
    gelezen = true;
    huidig = lees();
  }

  return () => {
    luisteraars.delete(luisteraar);
  };
}

const momentopname = () => huidig;
const serverMomentopname = () => LEEG_PROFIEL;

function zet(volgende: Huidprofiel) {
  huidig = volgende;
  try {
    window.localStorage.setItem(SLEUTEL, JSON.stringify(volgende));
  } catch {
    /* Opslag vol of geweigerd. Dan werkt het profiel deze sessie gewoon en onthoudt de
       browser het niet; er valt hier niets zinnigs te herstellen en de bezoeker merkt er
       verder niets van. */
  }
  meld();
}

/**
 * De mini-scan schrijft hier haar uitkomst naartoe, waar hij ook staat.
 *
 * Behalve het spinnenweb zet hij ook meteen twee van de drie vragen: het doel volgt uit
 * wat je als eerste opgaf, het huidtype uit hoe je huid op de zon reageert. Hersteltijd
 * vraagt de scan niet, en die blijft dus open; dat is precies de vraag die je op de
 * behandelingenpagina nog zelf zet.
 *
 * Wat er al stond wordt niet overschreven. Wie zijn doelen daar heeft bijgesteld en
 * daarna de scan opnieuw doet, houdt zijn eigen keuzes.
 */
export function bewaarScan(
  scan: Huidscan,
  afgeleid: { doel?: DoelId; huidtype?: FitzpatrickId | null },
) {
  zet({
    ...huidig,
    scan,
    doelen:
      huidig.doelen.length > 0
        ? huidig.doelen
        : afgeleid.doel
          ? [afgeleid.doel]
          : [],
    huidtype: huidig.huidtype ?? afgeleid.huidtype ?? null,
  });
}

/** Zet een id aan of uit, waarbij het "niets"-antwoord de rest uitsluit en andersom. */
function wisselMetGeen<T extends string>(
  huidigeLijst: readonly T[],
  id: T,
  geen: string,
): T[] {
  if (huidigeLijst.includes(id)) return huidigeLijst.filter((x) => x !== id);
  if (id === geen) return [id];
  return [...huidigeLijst.filter((x) => x !== geen), id];
}

export function useHuidprofiel() {
  const profiel = useSyncExternalStore(
    abonneer,
    momentopname,
    serverMomentopname,
  );

  const wisselDoel = useCallback((id: DoelId) => {
    zet({
      ...huidig,
      doelen: huidig.doelen.includes(id)
        ? huidig.doelen.filter((d) => d !== id)
        : [...huidig.doelen, id],
    });
  }, []);

  const zetLeeftijd = useCallback((l: LeeftijdId) => {
    zet({ ...huidig, leeftijd: huidig.leeftijd === l ? null : l });
  }, []);

  const zetHuidtype = useCallback((t: FitzpatrickId | null) => {
    zet({ ...huidig, huidtype: huidig.huidtype === t ? null : t });
  }, []);

  const zetHerstel = useCallback((h: HerstelId | null) => {
    zet({ ...huidig, herstel: huidig.herstel === h ? null : h });
  }, []);

  const zetConditie = useCallback((c: ConditieId) => {
    zet({ ...huidig, conditie: huidig.conditie === c ? null : c });
  }, []);

  const zetGevoeligheid = useCallback((g: GevoeligheidId) => {
    zet({ ...huidig, gevoeligheid: huidig.gevoeligheid === g ? null : g });
  }, []);

  /**
   * De meerkeuzelijsten met een "niets van dit alles". Dat antwoord sluit de rest uit en
   * andersom, want "ik gebruik niets" naast "ik gebruik retinol" is geen antwoord maar een
   * fout die later een afspraak kost.
   */
  const wisselGebruik = useCallback((id: GebruikId) => {
    zet({ ...huidig, gebruikt: wisselMetGeen(huidig.gebruikt, id, "niets") });
  }, []);

  const wisselSituatie = useCallback((id: SituatieId) => {
    zet({ ...huidig, situatie: wisselMetGeen(huidig.situatie, id, "geen") });
  }, []);

  const wisselVoorgeschiedenis = useCallback((id: VoorgeschiedenisId) => {
    zet({
      ...huidig,
      voorgeschiedenis: wisselMetGeen(huidig.voorgeschiedenis, id, "geen"),
    });
  }, []);

  const wis = useCallback(() => zet(LEEG_PROFIEL), []);

  return {
    profiel,
    wisselDoel,
    zetLeeftijd,
    zetHuidtype,
    zetHerstel,
    zetConditie,
    zetGevoeligheid,
    wisselGebruik,
    wisselSituatie,
    wisselVoorgeschiedenis,
    wis,
    bewaarScan,
  };
}
