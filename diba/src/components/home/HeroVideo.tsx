"use client";

import { useSyncExternalStore } from "react";
import VideoKnop from "@/components/home/VideoKnop";

/**
 * De opname in het beeldvlak van de hero.
 *
 * YASIN, 5 september 2026: die foto pakt niet, doe er een video in.
 *
 * WAAROM DIT EEN CLIENT COMPONENT IS EN DE REST VAN DE HERO NIET. Beeld dat vanzelf
 * beweegt en dat je niet kunt stoppen is voor sommige mensen letterlijk misselijkmakend,
 * en dat is geen stijlkwestie maar een toegankelijkheidseis. Er hoort dus een knop bij, en
 * daarvoor is dit ene blokje interactief. De kop, de tekst en de cijfers eromheen blijven
 * gewoon op de server gerenderd.
 *
 * GEEN GELUID, OOIT. Dit is sfeerbeeld en geen uitleg: er valt niets te horen. Een hero
 * die uit zichzelf begint te praten is een reclameblok.
 *
 * DE POSTER IS DE OUDE HEROFOTO. Zolang de video laadt staat er dus precies wat er eerst
 * stond, en niet een grijs vlak. Op een trage verbinding is dat het verschil tussen een
 * hero en een gat.
 *
 * WIE OM MINDER BEWEGING VRAAGT KRIJGT DE POSTER. Bij `prefers-reduced-motion` start de
 * video niet vanzelf; er staat dan een afspeelknop over het stilstaande beeld. De browser
 * doet dat niet uit zichzelf voor video.
 *
 * TWEE OPNAMES, EEN STAANDE EN EEN LIGGENDE. Een staande opname over een breed vlak leggen
 * betekent hem opblazen en er het grootste deel van afsnijden; een liggende op een telefoon
 * net zo goed andersom. Met `bestandBreed` kiest de hero vanaf 768 pixels een tweede
 * opname. De keuze gebeurt in de browser en niet met `media` op de bronnen: die attributen
 * worden maar één keer gelezen, bij het laden, en kloppen daarna niet meer als je het
 * venster versleept.
 */

const QUERY = "(prefers-reduced-motion: reduce)";
const BREED = "(min-width: 768px)";

function luister(herteken: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", herteken);
  return () => mq.removeEventListener("change", herteken);
}

function lees() {
  return window.matchMedia(QUERY).matches;
}

function luisterBreed(herteken: () => void) {
  const mq = window.matchMedia(BREED);
  mq.addEventListener("change", herteken);
  return () => mq.removeEventListener("change", herteken);
}

function leesBreed() {
  return window.matchMedia(BREED).matches;
}

export default function HeroVideo({
  bestand,
  bestandBreed,
  poster,
  posterBreed,
  beschrijving,
  id = "hero-video",
  eigenKnop = true,
  knopKlasse = "top-5 right-5 sm:top-7 sm:right-7",
}: {
  bestand: string;
  /** De liggende opname, vanaf 768 pixels. Zonder deze blijft de staande overal staan. */
  bestandBreed?: string;
  poster: string;
  /** De stilstaande versie van die liggende opname. */
  posterBreed?: string;
  /** Wat er te zien is, voor wie de video niet kan zien. */
  beschrijving: string;
  /** Waaraan de pauzeknop deze video herkent. Eén video per pagina, dus één id. */
  id?: string;
  /**
   * Zet de knop zelf neer. Uit als de hero hem ergens anders plaatst, bijvoorbeeld in de
   * regel boven de kop; er hoort er altijd precies één te zijn.
   */
  eigenKnop?: boolean;
  /**
   * Waar de pauzeknop komt te staan, als plaatsingsklassen.
   *
   * In het beeldvlak op de homepage is rechtsboven vrij. In de schermvullende hero
   * staat daar de navigatie, dus daar moet de knop eronder. De knop hoort bij de video
   * en verhuist dus mee in plaats van dat hij twee keer wordt gebouwd.
   */
  knopKlasse?: string;
}) {
  const rustig = useSyncExternalStore(luister, lees, () => false);
  const breed = useSyncExternalStore(luisterBreed, leesBreed, () => false);
  const bron = breed && bestandBreed ? bestandBreed : bestand;
  const plaat = breed && posterBreed ? posterBreed : poster;

  return (
    <>
      {/* `key` op de bron: zonder dat wisselt het `src`-attribuut wel maar laadt de
          browser de nieuwe opname niet. Met een nieuwe sleutel komt er een nieuw element,
          en dat begint netjes bij de poster. */}
      <video
        key={bron}
        id={id}
        className="absolute inset-0 h-full w-full object-cover"
        poster={plaat}
        preload="metadata"
        autoPlay={!rustig}
        muted
        loop
        playsInline
        aria-label={beschrijving}
      >
        <source src={bron} type="video/mp4" />
      </video>

      {/* Rechtsboven. Linksboven zit de plaatsnaam en rechtsonder het zegel, en
          linksonder buigt het beeldvlak weg in die grote ronde hoek: een knop die daar
          staat wordt door de overflow weggeknipt. Dat gebeurde ook: hij stond binnen de
          maten van het element en toch niet in beeld. */}
      {eigenKnop ? (
        <VideoKnop doel={`#${id}`} className={`absolute ${knopKlasse}`} />
      ) : null}
    </>
  );
}
