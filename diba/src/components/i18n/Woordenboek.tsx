"use client";

import { createContext, useContext } from "react";

/**
 * Het woordenboek dat in de browser beschikbaar is.
 *
 * WAT ER MIS WAS. `useT` in `lib/gebruik-taal` importeerde `lib/vertaal`, en dat
 * importeert `WOORDENBOEKEN`: Engels én Spaans, statisch. Alles wat een client component
 * aanraakt gaat mee naar de browser, dus die twee woordenboeken zaten in één chunk van
 * 1996 kB — 62 tot 65 procent van álle JavaScript op elke pagina, in elke taal. Een
 * Nederlandse bezoeker haalde het complete Engelse en Spaanse woordenboek op en gebruikte
 * er geen woord van, want het Nederlands heeft er geen nodig: de sleutel ís de Nederlandse
 * zin. Gemeten op 15 september 2026, scratch/bundel-woordenboek.mjs.
 *
 * HOE HET NU ZIT. Dit is een lege context. Wie erin wil vullen doet dat met een client
 * component dat zíjn eigen woordenboek statisch importeert — `WoordenboekEN` in de Engelse
 * indeling, `WoordenboekES` in de Spaanse. Zo'n import komt alleen in de chunks van die
 * routegroep terecht. De Nederlandse indeling zet niets, en krijgt dus ook niets mee.
 *
 * Het woordenboek gaat bewust niet als prop van een server component naar een client
 * component: dan wordt het in de RSC-payload geserialiseerd en staat het alsnog in de
 * HTML van elke pagina. De import moet in de client component zelf zitten.
 */
export const WoordenboekContext = createContext<
  Readonly<Record<string, string>>
>({});

export function useWoordenboek(): Readonly<Record<string, string>> {
  return useContext(WoordenboekContext);
}
