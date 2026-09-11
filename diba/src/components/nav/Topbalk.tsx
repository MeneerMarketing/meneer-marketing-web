import Link from "next/link";
import MijnDiba from "@/components/nav/MijnDiba";
import Taalkiezer from "@/components/nav/Taalkiezer";
import { TOPBALK_LINKS } from "@/data/hoofdnavigatie";
import {
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEW_COUNT,
  DIBA_SALONIZED_REVIEWS_URL,
} from "@/lib/site";

/**
 * De topbalk boven het hero-beeld — variant, nog niet in gebruik op de live homepage.
 *
 * Over de rand: deze balk loopt van rand tot rand en zit niet in de inhoudskolom van de
 * rest van de site. Het cijfer staat links helemaal buiten, de rest rechts helemaal
 * buiten, en er zit geen streep onder. Die streep maakte er een tweede header van terwijl
 * het een strook boven het beeld hoort te zijn; het beeld eronder zet de grens al.
 *
 * De linkerkant is één link naar de openbare reviewpagina. Het woord "Salonized" stond
 * er eerst bij omdat §11 een cijfer zonder herkomst verbiedt. Dat woord is er nu af op
 * verzoek, maar de herkomst niet: het hele blok linkt naar de openbare lijst en de
 * voorleesnaam noemt de bron voluit. Wie het cijfer wil natrekken is één klik verder.
 *
 * Rechts de praktische links, dan Mijn Diba en de taalkiezer. Op mobiel valt alles weg
 * behalve het cijfer en de taal: die balk mag niet de helft van het eerste scherm opeten.
 */

export type TopbalkProps = {
  /**
   * Doorschijnend over een beeld, in plaats van op een eigen vlak.
   *
   * Yasin, 11 september 2026: "ik wil een hero waarbij de header en de topbalk
   * transparant zijn en de video de volle hoogte vult." Deze balk stond op --g-050 met
   * donkere letters; op een beeld verdwijnt dat. In deze stand valt het vlak weg en gaan
   * de letters naar wit, met dezelfde donkere aanzet van bovenaf die de navigatie eronder
   * ook gebruikt.
   */
  opBeeld?: boolean;
};

export default function Topbalk({ opBeeld = false }: TopbalkProps) {
  const cijfer = DIBA_SALONIZED_RATING.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
  });
  const aantal = DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL");

  return (
    /* Dezelfde container als de hoofdbalk en als elke pagina.
       Deze strook liep op px-4/sm:px-6/lg:px-8 en begon dus tachtig pixels eerder dan
       het logo eronder. Twee balken boven elkaar die geen van beide op de inhoud
       uitlijnen valt niet op als fout, maar het is precies waarom een kop scheef oogt. */
    <div
      className={`mx-auto flex w-full items-center justify-between gap-4 px-5 py-2.5 sm:px-9 lg:px-[7.5vw] ${
        /* Niet volledig doorzichtig maar een groen vlak met doorzicht (Yasin, 11
           september 2026). Zo blijft de balk een balk in plaats van vier zwevende
           elementen, en de video schemert er nog doorheen. */
        opBeeld ? "bg-[var(--g-800)]/45 backdrop-blur-sm" : "bg-[var(--g-050)]"
      }`}
    >
      <a
        href={DIBA_SALONIZED_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Waardering ${cijfer} op basis van ${aantal} reviews, bekijk ze op Salonized. Opent in een nieuw tabblad.`}
        className={`-mx-2 flex min-h-9 items-center gap-2 rounded-[var(--r-pill)] px-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          opBeeld
            ? "hover:bg-white/15 focus-visible:outline-white"
            : "hover:bg-[var(--g-100)] focus-visible:outline-[var(--g-700)]"
        }`}
      >
        <span aria-hidden="true" className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className={`h-3.5 w-3.5 ${opBeeld ? "text-white" : "text-[var(--g-600)]"}`}
              fill="currentColor"
            >
              <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85z" />
            </svg>
          ))}
        </span>

        <span
          aria-hidden="true"
          className={`text-[13px] leading-none font-semibold tabular-nums ${opBeeld ? "text-white" : "text-[var(--t-strong)]"}`}
        >
          {cijfer}
        </span>
        <span
          aria-hidden="true"
          className={`hidden text-[13px] leading-none sm:inline ${opBeeld ? "text-white/80" : "text-[var(--t-muted)]"}`}
        >
          gebaseerd op <span className="tabular-nums">{aantal}</span> reviews
        </span>
        <span
          aria-hidden="true"
          className={`text-[13px] leading-none sm:hidden ${opBeeld ? "text-white/80" : "text-[var(--t-muted)]"}`}
        >
          <span className="tabular-nums">{aantal}</span> reviews
        </span>
      </a>

      <div className="flex items-center gap-1 sm:gap-3">
        <nav aria-label="Snelle links" className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {TOPBALK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  prefetch={false}
                  href={l.href}
                  className={`text-[13px] leading-none transition-colors ${opBeeld ? "text-white/80 hover:text-white" : "text-[var(--t-muted)] hover:text-[var(--g-700)]"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden sm:block">
          <MijnDiba opBeeld={opBeeld} />
        </div>
        <Taalkiezer opBeeld={opBeeld} />
      </div>
    </div>
  );
}
