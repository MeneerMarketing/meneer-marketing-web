"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * De knop die een video op de pagina stopt en weer start.
 *
 * WAAROM DIT LOS STAAT VAN DE VIDEO ZELF.
 *
 * Beeld dat vanzelf beweegt en dat je niet kunt stoppen is voor sommige mensen letterlijk
 * misselijkmakend. Er hoort dus altijd een knop bij (§9). Maar waar die knop hoort te
 * staan hangt af van de hero: in het beeldvlak op de homepage is rechtsboven vrij, in de
 * schermvullende hero staat daar de navigatie en hoort de knop in de regel boven de kop,
 * naast het zegel.
 *
 * Een knop die binnen de video-component zit kan alleen staan waar die component staat, en
 * dat is de laag onder de verlopen. Daarom wijst deze knop zijn video aan met een selector
 * en mag hij verder overal in de pagina hangen.
 *
 * HIJ LEEST ZIJN STAND UIT DE VIDEO.
 *
 * Niet uit een eigen geheugen: pauzeert de browser de video zelf, of stopt iemand hem op
 * een andere manier, dan klopt het pictogram nog steeds. Vandaar useSyncExternalStore en
 * geen useState, want de waarheid zit in het DOM en niet in React. Op de server, en tot de
 * hydratie, staat hij op "speelt": dat is wat autoplay doet.
 */

export default function VideoKnop({
  doel,
  className = "",
}: {
  /** CSS-selector van de video die deze knop bedient, bijvoorbeeld "#hero-video". */
  doel: string;
  className?: string;
}) {
  const abonneer = useCallback(
    (herteken: () => void) => {
      const el = document.querySelector<HTMLVideoElement>(doel);
      if (!el) return () => {};
      el.addEventListener("play", herteken);
      el.addEventListener("pause", herteken);
      return () => {
        el.removeEventListener("play", herteken);
        el.removeEventListener("pause", herteken);
      };
    },
    [doel],
  );

  const lees = useCallback(
    () => !(document.querySelector<HTMLVideoElement>(doel)?.paused ?? true),
    [doel],
  );

  const speelt = useSyncExternalStore(abonneer, lees, () => true);

  function wissel() {
    const el = document.querySelector<HTMLVideoElement>(doel);
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  return (
    <button
      type="button"
      onClick={wissel}
      aria-label={speelt ? "Beeld pauzeren" : "Beeld afspelen"}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-pill)] bg-white/85 text-[var(--g-700)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
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
  );
}
