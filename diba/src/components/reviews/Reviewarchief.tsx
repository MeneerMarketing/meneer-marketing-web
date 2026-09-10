import Link from "next/link";
import Sterren from "@/components/ui/Sterren";
import Label from "@/components/ui/Label";
import {
  ONDERWERPEN,
  onderwerp as onderwerpMeta,
  type OnderwerpGroep,
} from "@/data/review-onderwerpen";
import {
  ARCHIEF_MET_TEKST,
  ARCHIEF_ZONDER_TEKST,
  archiefAantal,
  archiefBijOnderwerp,
  ONDER_VIJF,
  PER_PAGINA,
  PER_PAGINA_ZONDER,
  ZONDER_TEKST,
} from "@/data/reviews-archief";
import type { SalonizedReviewTopic } from "@/data/salonized-reviews";
import MobielInklap from "@/components/ui/MobielInklap";

/**
 * Alle reviews, gefilterd en gepagineerd via de URL.
 *
 * WAAROM GEEN KNOPPEN MAAR LINKS. De vorige muur was een client component met een filter in
 * de staat van de browser. Dat kon toen er 122 reviews stonden. Met 2.472 teksten zou dat
 * zeshonderd kilobyte naar elke bezoeker sturen om er achtenveertig te tonen.
 *
 * Nu leest de server de filter uit de URL. Dat scheelt niet alleen laadtijd: /reviews?
 * onderwerp=acne is een adres dat je kunt delen en dat Google kan indexeren, en dat is
 * precies waar iemand op zoekt die wil weten of hier mensen met acne komen.
 *
 * EEN RIJ KNOPPEN. Dit waren er twee, gescheiden naar de klacht of de behandeling en het
 * bezoek: de uitleg, de vriendelijkheid, de sfeer, of iemand terugkomt. Die tweede rij
 * verving de knop "Algemeen" met 2.133 reviews erachter (Rojda, 8 september 2026). Hoe de
 * tags aan de tekst hangen staat in `review-onderwerpen.ts`.
 *
 * GEEN OORDEEL VAN ONS IN DE VOLGORDE. Die is van de bron: nieuwste eerst, zoals Salonized
 * ze zet. Geen uitgelichte review, geen "meest behulpzaam". Dat is de enige volgorde die we
 * niet zelf bedacht hebben.
 *
 * DE BEOORDELINGEN ZONDER TEKST STAAN ONDER EEN EIGEN KOP, EN ZE STAAN ER ALLEMAAL. Okan
 * (5 september) en Rojda (8 september): niet alleen het aantal noemen, maar ze laten zien.
 * Als korte regels, want een kaart zonder tekst is veertienhonderd keer niets.
 */

type Filter = SalonizedReviewTopic | "alle";

function adres({
  onderwerp,
  pagina,
  sterren,
  anker,
}: {
  onderwerp: Filter;
  pagina: number;
  sterren: number;
  anker: "alles" | "zonder-tekst";
}) {
  const delen: string[] = [];
  if (onderwerp !== "alle") delen.push(`onderwerp=${onderwerp}`);
  if (pagina > 1) delen.push(`pagina=${pagina}`);
  if (sterren > 1) delen.push(`sterren=${sterren}`);
  return `/reviews${delen.length > 0 ? `?${delen.join("&")}` : ""}#${anker}`;
}

const KNOP =
  "diba-label inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--r-pill)] px-4 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

function Knop({
  href,
  actief,
  tekst,
  aantal,
}: {
  href: string;
  actief: boolean;
  tekst: string;
  aantal: number;
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={actief ? "page" : undefined}
        className={`${KNOP} ${
          actief
            ? "diba-pill-active"
            : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
        }`}
      >
        {tekst}
        <span
          className={`rounded-[var(--r-pill)] px-2 py-0.5 text-[10px] tabular-nums ${
            actief ? "bg-white/20" : "bg-[var(--g-025)] text-[var(--g-700)]"
          }`}
        >
          {aantal.toLocaleString("nl-NL")}
        </span>
      </Link>
    </li>
  );
}

/* Vorige, stand, volgende. Voor de kaarten en voor de regels zonder tekst dezelfde. */
function Bladeren({
  huidig,
  paginas,
  naar,
  label,
}: {
  huidig: number;
  paginas: number;
  naar: (pagina: number) => string;
  label: string;
}) {
  if (paginas <= 1) return null;
  return (
    <nav
      aria-label={label}
      className="mt-12 flex flex-wrap items-center justify-between gap-4"
    >
      {huidig > 1 ? (
        <Link
          href={naar(huidig - 1)}
          className="diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          Vorige
        </Link>
      ) : (
        <span />
      )}
      <span className="diba-label text-[var(--t-muted)]">
        {huidig} / {paginas}
      </span>
      {huidig < paginas ? (
        <Link
          href={naar(huidig + 1)}
          className="diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          Volgende
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

function begrens(pagina: number, paginas: number) {
  return Math.min(Math.max(1, pagina), paginas);
}

export default function Reviewarchief({
  onderwerp,
  pagina,
  sterrenPagina,
}: {
  onderwerp: Filter;
  pagina: number;
  /** Pagina van de lijst zonder tekst; die bladert los van de kaarten. */
  sterrenPagina: number;
}) {
  const alle = archiefBijOnderwerp(onderwerp);
  const paginas = Math.max(1, Math.ceil(alle.length / PER_PAGINA));
  const huidig = begrens(pagina, paginas);
  const zichtbaar = alle.slice((huidig - 1) * PER_PAGINA, huidig * PER_PAGINA);

  const sterrenPaginas = Math.max(
    1,
    Math.ceil(ARCHIEF_ZONDER_TEKST.length / PER_PAGINA_ZONDER),
  );
  const sterrenHuidig = begrens(sterrenPagina, sterrenPaginas);
  const regels = ARCHIEF_ZONDER_TEKST.slice(
    (sterrenHuidig - 1) * PER_PAGINA_ZONDER,
    sterrenHuidig * PER_PAGINA_ZONDER,
  );

  /* Onderwerpen waar niemand over schrijft krijgen geen knop: een nul is een dood eind.
     Het aantal staat wel op elke knop die er is, ook als dat aantal tegenvalt. */
  const knoppen = (groep: OnderwerpGroep) =>
    ONDERWERPEN.filter((o) => o.groep === groep && archiefAantal(o.id) > 0);

  const meta = onderwerp === "alle" ? null : onderwerpMeta(onderwerp);

  return (
    <div>
      {/* Okan, 10 september 2026: "de filter beter uitlijnen, hij neemt een hele mobiele
          pagina in beslag, korter maken, en alles bij elkaar in plaats van gescheiden
          tussen behandeling en bezoek."

          Dus één rij met alle onderwerpen door elkaar. Op een telefoon schuift die rij
          opzij in plaats van over zes regels om te vouwen: vijftien knoppen die omvouwen
          waren vier centimeter beeld voordat je de eerste review zag. De rij loopt tot de
          schermrand door, zodat je ziet dat er meer staat. */}
      <ul className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        <Knop
          href={adres({
            onderwerp: "alle",
            pagina: 1,
            sterren: sterrenHuidig,
            anker: "alles",
          })}
          actief={onderwerp === "alle"}
          tekst="Alles"
          aantal={ARCHIEF_MET_TEKST.length}
        />
        {[...knoppen("klacht"), ...knoppen("bezoek")].map((o) => (
          <Knop
            key={o.id}
            href={adres({
              onderwerp: o.id,
              pagina: 1,
              sterren: sterrenHuidig,
              anker: "alles",
            })}
            actief={o.id === onderwerp}
            tekst={o.label}
            aantal={archiefAantal(o.id)}
          />
        ))}
      </ul>

      <p className="mt-6 max-w-[62ch] text-[15px] leading-7 text-[var(--t-muted)]">
        {`${alle.length.toLocaleString("nl-NL")} reviews ${
          meta ? meta.zin : "met tekst"
        }, in de volgorde van Salonized: nieuwste eerst. Pagina ${huidig} van ${paginas}.`}
      </p>

      {zichtbaar.length === 0 ? (
        <p className="mt-10 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          Hier schreef nog niemand over. Dat is geen gebrek van de kliniek maar
          van de reviews: mensen beoordelen het bezoek, niet elk onderwerp.
        </p>
      ) : (
        <>
          <ul className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zichtbaar.slice(0, 24).map((r) => (
              <li
                key={r.id}
                className="flex flex-col rounded-[var(--r-lg)] bg-white p-6"
              >
                <Sterren aantal={Math.round(r.sterren)} />
                <p className="mt-4 grow text-[15px] leading-7 text-[var(--g-900)]">
                  {r.tekst}
                </p>
                <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
                  <span className="truncate">{r.naam}</span>
                  <span className="shrink-0">{r.datum}</span>
                </p>
              </li>
            ))}
          </ul>
          {/* Achtenveertig kaarten is op een telefoon twaalf schermen. De tweede helft
            staat er wel, maar pas na een tik; op desktop staan ze gewoon allemaal. */}
          {zichtbaar.length > 24 ? (
            <MobielInklap
              className="mt-4"
              label={`Toon nog ${zichtbaar.length - 24} reviews`}
            >
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {zichtbaar.slice(24).map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-col rounded-[var(--r-lg)] bg-white p-6"
                  >
                    <Sterren aantal={Math.round(r.sterren)} />
                    <p className="mt-4 grow text-[15px] leading-7 text-[var(--g-900)]">
                      {r.tekst}
                    </p>
                    <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
                      <span className="truncate">{r.naam}</span>
                      <span className="shrink-0">{r.datum}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </MobielInklap>
          ) : null}
        </>
      )}

      <Bladeren
        huidig={huidig}
        paginas={paginas}
        label="Meer reviews"
        naar={(p) =>
          adres({
            onderwerp,
            pagina: p,
            sterren: sterrenHuidig,
            anker: "alles",
          })
        }
      />

      {/* Okan: de beoordelingen zonder tekst horen erbij, maar onder een eigen kopje. Ze
          tellen mee voor het gemiddelde, dus ze weglaten zou het cijfer onverklaard laten.
          Rojda: en dan ook allemaal, niet alleen het aantal. Dus als regels: naam, sterren,
          datum. Meer is er niet, en dat is precies het punt. */}
      <section
        id="zonder-tekst"
        className="mt-16 scroll-mt-[var(--anker-offset)] rounded-[var(--r-lg)] bg-white p-8 sm:p-10"
      >
        <Label>Beoordelingen zonder tekst</Label>
        <h3 className="diba-card-title mt-3 text-[var(--t-strong)]">
          {ZONDER_TEKST.toLocaleString("nl-NL")} mensen gaven wel sterren, maar
          schreven niets
        </h3>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          Ze tellen mee voor het gemiddelde en daarom staan ze hier, allemaal.
          Wat ze niet doen is iets vertellen: je weet niet waarvoor iemand kwam
          of wat er gebeurde. Reken ze dus mee in het cijfer en niet in je
          oordeel.
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          {ONDER_VIJF === 0
            ? "Alle beoordelingen staan op vijf sterren."
            : `${ONDER_VIJF.toLocaleString("nl-NL")} beoordelingen staan onder de vijf sterren. Ook die staan op deze pagina; ze zijn niet weggefilterd.`}
        </p>

        <p className="mt-8 text-[14px] leading-6 text-[var(--t-muted)]">
          {`In de volgorde van Salonized: nieuwste eerst. Pagina ${sterrenHuidig} van ${sterrenPaginas}.`}
        </p>
        <ul className="mt-3 grid gap-x-10 lg:grid-cols-2 2xl:grid-cols-3">
          {regels.map((r) => (
            /* Op een telefoon twee regels: sterren en naam, daaronder de datum. Vanaf 640
               pixels één regel met de datum rechts. Alles-op-één-regel paste niet: naast
               "ongeveer een jaar geleden" bleef er van een naam één letter over, en een rij
               die soms wel en soms niet omslaat leest als rommel. */
            <li
              key={r.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 border-b border-[var(--g-100)] py-2.5 text-[14px] leading-5 sm:flex"
            >
              <span className="sm:shrink-0">
                <Sterren aantal={Math.round(r.sterren)} maat="sm" />
              </span>
              <span className="min-w-0 truncate text-[var(--t-strong)] sm:flex-1">
                {r.naam}
              </span>
              <span className="col-start-2 text-[13px] text-[var(--t-muted)] sm:ml-auto sm:shrink-0 sm:text-[14px]">
                {r.datum}
              </span>
            </li>
          ))}
        </ul>

        <Bladeren
          huidig={sterrenHuidig}
          paginas={sterrenPaginas}
          label="Meer beoordelingen zonder tekst"
          naar={(p) =>
            adres({
              onderwerp,
              pagina: huidig,
              sterren: p,
              anker: "zonder-tekst",
            })
          }
        />
      </section>
    </div>
  );
}
