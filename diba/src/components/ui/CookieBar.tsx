"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import {
  acceptCookieConsent,
  isGevraagd,
  refuseCookieConsent,
} from "@/lib/cookie-consent";

/**
 * De cookiekeuze.
 *
 * WAT HIER EERDER NIET KLOPTE.
 *
 * Er stond één knop: Akkoord. Daarnaast een link met het woord "Instellingen" die naar
 * /cookiebeleid ging, en dat was een tekstpagina zonder enige instelling. Weigeren kon dus
 * niet, en wie niet klikte kreeg de balk elk bezoek opnieuw. De enige manier om ervan af te
 * komen was ja zeggen. Sinds die ronde staan er twee knoppen, even groot en even bereikbaar,
 * en schrijft de weigerknop een echte "nee" weg.
 *
 * WAT ER NU VERANDERT, EN WAAROM.
 *
 * Yasin, 11 september 2026: "die cookiebalk vind ik nog niet high end, modern en speels, en
 * hij is moeilijk te skippen."
 *
 * Het was een balk over de volle breedte onderaan het scherm. Dat is de vorm die elke site
 * heeft, hij legt een streep onder je pagina, en hij is precies zo groot dat je hem niet
 * kunt negeren maar ook niet wegkrijgt zonder te lezen. Nu is het een kaart die in de hoek
 * komt aanzweven: klein, met ronde hoeken en een schaduw, en met het blad erop zodat het
 * van deze kliniek is en niet van een plug-in.
 *
 * WAT "MAKKELIJKER TE SKIPPEN" HIER BETEKENT, EN WAT HET NIET MAG BETEKENEN.
 *
 * Wel: een kleinere kaart die minder van het scherm inneemt, twee knoppen die allebei in
 * één tik raak zijn, en Escape als uitweg. Escape kiest "alleen noodzakelijk", want dat is
 * de stand waarin er niets bijkomt; wegklikken mag nooit stilzwijgend ja betekenen.
 *
 * Niet: een kruisje dat de kaart wegstuurt zonder keuze, of een weigerknop die kleiner of
 * grijzer is dan de andere. Toestemming is alleen iets waard als nee zeggen net zo makkelijk
 * is als ja zeggen, en dat is hier letterlijk zo: dezelfde hoogte, dezelfde breedte,
 * dezelfde plek.
 *
 * DE MAAT EN DE PLEK. Op een telefoon was de oude balk 144 pixels hoog, een vijfde van het
 * scherm. Deze kaart is ongeveer even hoog maar staat los van de randen, dus de pagina
 * eronder loopt zichtbaar door en je ziet dat het iets is dat weggaat.
 *
 * Op een breed scherm staat hij rechtsonder en niet linksonder: links staat de kop van de
 * hero met de twee knoppen eronder, en die dekte hij precies af.
 *
 * Let op de schrijfwijze van die plek, want daar zit een val in. Hier stond `left-3 right-3`
 * als basis met `sm:left-auto` eroverheen. Zijn allebei de randen gezet en past de breedte
 * niet tussen die twee, dan wint links en wordt rechts genegeerd; viel die ene `sm:`-regel
 * weg, dan stond de kaart linksonder over de hero. Nu staat rechts in de basis en geldt de
 * linkerrand alleen onder de 768 pixels, waar de kaart zo breed is als het scherm. Er is geen
 * enkele stand meer waarin hij linksonder uitkomt.
 *
 * Die 768 en niet 640: tussen 640 en 767 is het scherm net te smal voor allebei. De kop van
 * de hero loopt daar tot voorbij de helft en de zwevende kaart begint op 216, dus hij kwam er
 * alsnog overheen. Onder de 768 is het daarom de volle-breedte kaart onderaan, die de pagina
 * afsluit in plaats van er middenin te hangen.
 *
 * WAT ER NIET IN DE TEKST STAAT. Er stond "geen advertentie-tracking". Dat is waar zolang er
 * alleen statistiek laadt, maar het is een belofte, en de kliniek gaat advertenties draaien
 * (Yasin, 11 september 2026). Een belofte die volgende maand niet meer klopt hoort er nu al
 * niet te staan. De balk zegt daarom wat er is en wijst naar het cookiebeleid voor de
 * volledige lijst; dat beleid is de plek die meeverandert als er iets bij komt.
 */

export default function CookieBar() {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    if (isGevraagd()) return;
    /* Eén beeldje wachten: anders staat de kaart er al voordat de pagina getekend is en
       zie je hem niet aankomen. */
    const t = window.setTimeout(() => setZichtbaar(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const weiger = useCallback(() => {
    refuseCookieConsent();
    setZichtbaar(false);
  }, []);

  /* Escape is de uitweg, en hij kiest de stand waarin er niets bijkomt. */
  useEffect(() => {
    if (!zichtbaar) return undefined;
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") weiger();
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [zichtbaar, weiger]);

  if (!zichtbaar) return null;

  const knop =
    "inline-flex h-11 flex-1 items-center justify-center rounded-[var(--r-pill)] px-4 " +
    "text-[13px] leading-none font-medium whitespace-nowrap transition-colors " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-[var(--g-700)]";

  return (
    <div
      role="dialog"
      aria-label="Cookievoorkeuren"
      data-cookiebalk=""
      className="diba-koekkaart fixed right-3 bottom-3 z-50 rounded-[var(--r-lg)] bg-white p-4 shadow-[var(--shadow-float)] max-md:left-3 sm:p-5 md:right-6 md:bottom-6 md:max-w-[25rem]"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-start gap-3">
        {/* Het blad. Eén merkteken maakt het verschil tussen een mededeling van deze
            kliniek en een mededeling van een cookiebanner-leverancier. */}
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]"
        >
          <DibaLeafMark className="h-4 w-4" />
        </span>
        <p className="text-[13px] leading-6 text-[var(--t-body)] sm:text-[14px]">
          Cookies om de site te laten werken en om te meten hoe hij gebruikt
          wordt. In het{" "}
          <Link
            href="/cookiebeleid"
            className="text-[var(--g-700)] underline underline-offset-2 hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            cookiebeleid
          </Link>{" "}
          staat precies wat er laadt.
        </p>
      </div>

      {/* De weigerknop staat vooraan in de bron, want de schermafdrukscripts en de
          toetsenbordvolgorde komen daar als eerste langs. Op het scherm zijn ze even zwaar. */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={weiger}
          className={`${knop} bg-[var(--g-050)] text-[var(--g-900)] hover:bg-[var(--g-100)]`}
        >
          Alleen noodzakelijk
        </button>
        <button
          type="button"
          onClick={() => {
            acceptCookieConsent();
            setZichtbaar(false);
          }}
          className={`${knop} bg-[var(--g-700)] text-white hover:bg-[var(--g-800)]`}
        >
          Akkoord
        </button>
      </div>
    </div>
  );
}
