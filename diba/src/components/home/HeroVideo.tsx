"use client";

import { useRef, useState, useSyncExternalStore } from "react";

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
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function luister(herteken: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", herteken);
  return () => mq.removeEventListener("change", herteken);
}

function lees() {
  return window.matchMedia(QUERY).matches;
}

export default function HeroVideo({
  bestand,
  poster,
  beschrijving,
}: {
  bestand: string;
  poster: string;
  /** Wat er te zien is, voor wie de video niet kan zien. */
  beschrijving: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const rustig = useSyncExternalStore(luister, lees, () => false);
  const [speelt, setSpeelt] = useState(true);

  function wissel() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setSpeelt(true);
    } else {
      el.pause();
      setSpeelt(false);
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        preload="metadata"
        autoPlay={!rustig}
        muted
        loop
        playsInline
        aria-label={beschrijving}
        onPlay={() => setSpeelt(true)}
        onPause={() => setSpeelt(false)}
      >
        <source src={bestand} type="video/mp4" />
      </video>

      {/* Rechtsboven. Linksboven zit de plaatsnaam en rechtsonder het zegel, en
          linksonder buigt het beeldvlak weg in die grote ronde hoek: een knop die daar
          staat wordt door de overflow weggeknipt. Dat gebeurde ook: hij stond binnen de
          maten van het element en toch niet in beeld. */}
      <button
        type="button"
        onClick={wissel}
        aria-label={speelt ? "Beeld pauzeren" : "Beeld afspelen"}
        className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-white/85 text-[var(--g-700)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-7 sm:right-7"
      >
        {speelt ? (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="ml-0.5 h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}
