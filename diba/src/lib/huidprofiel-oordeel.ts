"use client";

import { useMemo } from "react";
import { maakMatches, type Match } from "@/data/huidprofiel";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * Het oordeel uit het huidprofiel, per behandeling, waar je het ook nodig hebt.
 *
 * WAAROM DIT EEN EIGEN HAAK IS EN GEEN GEKOPIEERDE REGEL.
 *
 * Twee plekken tonen nu wat er bij jou uit het profiel kwam: de behandelpagina zelf en de
 * prijslijst. Als die allebei zelf uitrekenen of het profiel is ingevuld en wat er dan
 * uitkomt, lopen ze op een dag uit elkaar. En van alle dingen die uit elkaar mogen lopen
 * is een oordeel over wat wel en niet bij iemand past de slechtste.
 *
 * Dus één plek. `maakMatches` blijft de bron; deze haak leest alleen en bepaalt wanneer er
 * niets te zeggen valt.
 *
 * WANNEER HIJ NIETS TERUGGEEFT.
 *
 * Bij een leeg profiel. Eén antwoord is genoeg om iets te zeggen, nul antwoorden niet, en
 * dan hoort een pagina eruit te zien alsof deze haak niet bestaat. Op de server bestaat
 * localStorage niet, dus daar is het altijd leeg en verschijnt er nooit iets: de pagina
 * die Google ziet is de pagina zonder oordeel.
 */
export function useOordelen(): ReadonlyMap<string, Match> | null {
  const { profiel } = useHuidprofiel();

  const ingevuld =
    profiel.doelen.length > 0 ||
    profiel.leeftijd !== null ||
    profiel.huidtype !== null ||
    profiel.herstel !== null ||
    profiel.conditie !== null ||
    profiel.gevoeligheid !== null ||
    profiel.gebruikt.length > 0 ||
    profiel.situatie.length > 0 ||
    profiel.voorgeschiedenis.length > 0;

  return useMemo(() => {
    if (!ingevuld) return null;
    const kaart = new Map<string, Match>();
    for (const m of maakMatches(profiel)) kaart.set(m.behandeling.slug, m);
    return kaart;
  }, [ingevuld, profiel]);
}
