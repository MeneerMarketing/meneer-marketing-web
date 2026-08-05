"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DOELEN,
  FITZPATRICK_TYPES,
  HERSTELRUIMTE,
  LEEG_PROFIEL,
  type DoelId,
  type FitzpatrickId,
  type HerstelId,
  type Huidprofiel,
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

const SLEUTEL = "diba-huidprofiel-v1";

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
      huidtype: FITZPATRICK_TYPES.some((f) => f.id === p.huidtype)
        ? (p.huidtype as FitzpatrickId)
        : null,
      herstel: HERSTELRUIMTE.some((h) => h.id === p.herstel)
        ? (p.herstel as HerstelId)
        : null,
    };
  } catch {
    return LEEG_PROFIEL;
  }
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

  const zetHuidtype = useCallback((t: FitzpatrickId | null) => {
    zet({ ...huidig, huidtype: huidig.huidtype === t ? null : t });
  }, []);

  const zetHerstel = useCallback((h: HerstelId | null) => {
    zet({ ...huidig, herstel: huidig.herstel === h ? null : h });
  }, []);

  const wis = useCallback(() => zet(LEEG_PROFIEL), []);

  return { profiel, wisselDoel, zetHuidtype, zetHerstel, wis };
}
