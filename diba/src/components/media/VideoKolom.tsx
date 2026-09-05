"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Label from "@/components/ui/Label";
import { type Videoblok } from "@/data/videos";

/**
 * Een video naast een even hoge tekstkolom.
 *
 * YASIN, 5 SEPTEMBER 2026: links tekst en details, rechts de video in een blok. De
 * verhouding is 9:16, want dat is wat er uit een reel komt; een staande video in een liggend
 * kader wordt aan twee kanten afgesneden of zwevend in zwarte balken gezet.
 *
 * TWEE GEDRAGINGEN.
 *
 * "sfeer" speelt vanzelf, geluidloos en in herhaling. Er valt niets te missen, dus er is
 * ook niets te bedienen. Wel een knop om te pauzeren: beweging die je niet kunt stoppen is
 * voor sommige mensen letterlijk misselijkmakend, en dat is geen stijlkwestie.
 *
 * "uitleg" speelt niet vanzelf. Er wordt gepraat, dus geluid hoort erbij, en geluid dat
 * vanzelf begint is een reclameblok. Je ziet een stilstaand beeld met een afspeelknop en
 * vanaf dat moment de gewone bediening.
 *
 * WIE VRAAGT OM MINDER BEWEGING KRIJGT MINDER BEWEGING. Bij `prefers-reduced-motion` start
 * ook de sfeervideo niet vanzelf en verschijnt er een afspeelknop. De browser doet dat niet
 * uit zichzelf voor video; dat moet hier gebeuren.
 */
/* De mediaquery als externe bron. Op de server luidt het antwoord "nee", want daar is geen
   voorkeur bekend en beweging is de standaard; de browser corrigeert dat bij de eerste
   render. */
const QUERY = "(prefers-reduced-motion: reduce)";

function luister(herteken: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", herteken);
  return () => mq.removeEventListener("change", herteken);
}

function lees() {
  return window.matchMedia(QUERY).matches;
}

export default function VideoKolom({
  video,
  achtergrond = "wit",
  kant = "rechts",
}: {
  video: Videoblok;
  achtergrond?: "wit" | "zacht";
  /** Aan welke kant de video staat. Standaard rechts, zoals gevraagd. */
  kant?: "rechts" | "links";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const sfeer = video.soort === "sfeer";
  const rustig = useSyncExternalStore(luister, lees, () => false);
  const [speelt, setSpeelt] = useState(sfeer);

  function wissel() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      /* Bij uitleg hoort geluid; dat mag pas na een klik, en dat is precies wat dit is. */
      if (!sfeer) el.muted = false;
      void el.play();
      setSpeelt(true);
    } else {
      el.pause();
      setSpeelt(false);
    }
  }

  const vanzelf = sfeer && !rustig;

  return (
    <section
      className={`px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24 ${
        achtergrond === "zacht" ? "bg-[var(--g-050)]" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 ${
          kant === "links" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Tekst */}
        <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-050)] p-8 sm:p-10 lg:p-12">
          <Label>{sfeer ? "Zonder uitleg" : "Met uitleg"}</Label>
          <h2 className="diba-display-m mt-4 max-w-[16ch]">
            {video.kop} <span className="diba-accent">{video.accent}</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
            {video.intro}
          </p>

          <ul className="mt-7 space-y-3">
            {video.punten.map((p) => (
              <li key={p} className="flex gap-3">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="mt-1 shrink-0"
                  fill="none"
                  stroke="var(--g-700)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 9.5 7 13l7.5-8" />
                </svg>
                <span className="text-[15px] leading-7 text-[var(--t-body)]">
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <p className="diba-label mt-8 text-[var(--t-muted)]">
            {sfeer
              ? "Eigen opname · zonder geluid"
              : "Eigen opname · met geluid en ondertiteling"}
          </p>
        </div>

        {/* Video */}
        <div className="relative overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-100)]">
          <video
            ref={ref}
            className="h-full max-h-[70vh] w-full object-cover"
            poster={video.poster}
            preload={sfeer ? "auto" : "metadata"}
            autoPlay={vanzelf}
            muted={sfeer}
            loop={sfeer}
            playsInline
            controls={!sfeer && speelt}
            aria-label={video.beschrijving}
            onPlay={() => setSpeelt(true)}
            onPause={() => setSpeelt(false)}
          >
            <source src={video.bestand} type="video/mp4" />
            {video.ondertiteling ? (
              <track
                kind="captions"
                srcLang="nl"
                label="Nederlands"
                src={video.ondertiteling}
                default
              />
            ) : null}
          </video>

          {/* De knop. Bij sfeer een klein pauzeknopje in de hoek, bij uitleg een grote
              afspeelknop over het stilstaande beeld zolang er niets speelt. */}
          {!speelt && !sfeer ? (
            <button
              type="button"
              onClick={wissel}
              aria-label="Video afspelen met geluid"
              className="absolute inset-0 flex items-center justify-center bg-[var(--g-900)]/25 transition-colors hover:bg-[var(--g-900)]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-[var(--shadow-float)]">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1 h-8 w-8"
                  fill="var(--g-700)"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={wissel}
              aria-label={speelt ? "Video pauzeren" : "Video afspelen"}
              className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--g-700)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {speelt ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
