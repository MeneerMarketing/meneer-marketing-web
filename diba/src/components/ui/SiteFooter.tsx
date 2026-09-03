import Link from "next/link";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import {
  DIBA_ADDRESS,
  DIBA_INSTAGRAM_URL,
  DIBA_SITE,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
} from "@/lib/site";
import { figmaInnerContainer } from "@/lib/figma-inner-layout";

export type SiteFooterProps = {
  instagramHref?: string;
};

/**
 * De voettekst.
 *
 * WAT ER MIS WAS.
 *
 * Eén platte rij met elf links en daaronder het adres. Dat is geen voettekst maar een
 * regel: je kunt er niets in vinden, want alles staat op één hoop en in dezelfde grootte.
 * Op een site met honderd pagina's is de voettekst de tweede navigatie, en die functie deed
 * hij niet.
 *
 * En hij plakte aan het blok erboven. De afsluitende CTA heeft `mb-5`, de voettekst had
 * `pt-4`: samen zesendertig pixels tussen een donkergroen vlak en de eerste link. Daardoor
 * las het als één geheel terwijl het twee dingen zijn.
 *
 * HOE HIJ NU WERKT.
 *
 * Vier kolommen die de site volgen zoals iemand hem in zijn hoofd heeft: waar je last van
 * hebt, wat we eraan doen, wie wij zijn, en het praktische. Daaronder een dunne balk met
 * het adres, het telefoonnummer en de juridische pagina's — die horen erbij maar niet
 * tussen de rest.
 *
 * De vorm blijft van het ontwerp: haarlijnen in plaats van vlakken, labels in kleine
 * kapitalen, en veel lucht. Geen achtergrondkleur, want dan wordt het een blok en de rest
 * van deze site werkt met ruimte.
 */

const kolomLabel =
  "text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-label)]";

const kolomLink =
  "text-[13px] leading-6 text-[var(--t-body)] transition hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

const balkLink =
  "text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)] transition hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

/**
 * De kolommen.
 *
 * Niet elke pagina staat hier: dat zouden er honderd zijn en dan vindt niemand meer iets.
 * Per kolom het overzicht plus de vier of vijf waar mensen daadwerkelijk op zoeken, en het
 * overzicht wijst door naar de rest.
 */
const KOLOMMEN: readonly {
  readonly kop: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
}[] = [
  {
    kop: "Huidproblemen",
    links: [
      { label: "Alle huidproblemen", href: "/huidproblemen" },
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
  },
  {
    kop: "Behandelingen",
    links: [
      { label: "Alle behandelingen", href: "/behandelingen" },
      { label: "Laserontharing", href: "/laserontharing" },
      { label: "Huidanalyse", href: "/behandelingen/huidanalyse" },
      { label: "Apparatuur", href: "/apparatuur" },
      { label: "Prijzen", href: "/prijzen" },
      { label: "Vergoedingen", href: "/vergoedingen" },
    ],
  },
  {
    kop: "Over Diba",
    links: [
      { label: "Over ons", href: "/over-ons" },
      { label: "Ons verhaal", href: "/ons-verhaal" },
      { label: "Het team", href: "/team" },
      { label: "Resultaten", href: "/resultaten" },
      { label: "Reviews", href: "/reviews" },
      { label: "Werken bij Diba", href: "/werken-bij" },
    ],
  },
  {
    kop: "Praktisch",
    links: [
      { label: "Contact en route", href: "/contact" },
      { label: "Je eerste afspraak", href: "/intake" },
      { label: "Nazorg", href: "/nazorg" },
      { label: "Kennisbank", href: "/kennisbank" },
      { label: "Wat wij niet doen", href: "/dit-behandelen-wij-niet" },
      { label: "Voor verwijzers", href: "/verwijzers" },
    ],
  },
];

/** De juridische pagina's. Horen erbij, maar niet tussen de rest. */
const JURIDISCH: readonly { readonly label: string; readonly href: string }[] =
  [
    { label: "Privacy", href: "/privacybeleid" },
    { label: "Cookies", href: "/cookiebeleid" },
    { label: "Voorwaarden", href: "/algemene-voorwaarden" },
    { label: "Klachten", href: "/klachten" },
  ];

export default function SiteFooter({ instagramHref }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const instagram = instagramHref ?? DIBA_INSTAGRAM_URL;

  return (
    /* pt-20 in plaats van pt-4. Het blok erboven is donkergroen en heeft lucht nodig,
       anders leest het als één geheel met de voettekst. */
    <footer className={`${figmaInnerContainer} pb-12 pt-20 lg:pt-28`}>
      <div className="mx-auto border-t border-[var(--g-100)] pt-12 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.6fr] lg:gap-16">
          {/* Het merk, met het blad uit de huisstijl. Kort: de voettekst is om verder te
              komen, niet om nog een keer te vertellen wie we zijn. */}
          <div>
            <DibaLeafMark
              aria-hidden="true"
              className="h-9 w-9 text-[var(--g-700)]"
            />
            <p className="mt-5 max-w-[26ch] text-[13px] leading-6 text-[var(--t-body)]">
              Huidkliniek in {DIBA_SITE.neighborhood}. We meten je huid voordat
              we iets voorstellen, en zeggen het ook als afwachten verstandiger
              is.
            </p>
          </div>

          <nav
            aria-label="Voettekst"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {KOLOMMEN.map((kolom) => (
              <div key={kolom.kop}>
                <h2 className={kolomLabel}>{kolom.kop}</h2>
                <ul className="mt-5 space-y-2.5">
                  {kolom.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        prefetch={false}
                        href={l.href}
                        className={kolomLink}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* De onderste balk. Adres en telefoon staan hier en niet in een kolom: het zijn
            geen pagina's maar gegevens, en je zoekt ze onderaan. */}
        <div className="mt-14 flex flex-col gap-5 border-t border-[var(--g-100)] pt-7 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)]">
              © {year} {DIBA_SITE.name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)]">
              {DIBA_ADDRESS.street} · {DIBA_ADDRESS.postalCode}{" "}
              {DIBA_ADDRESS.city}
            </span>
            <a href={DIBA_TELEFOON_HREF} className={balkLink}>
              {DIBA_TELEFOON}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {JURIDISCH.map((l) => (
              <Link
                key={l.href}
                prefetch={false}
                href={l.href}
                className={balkLink}
              >
                {l.label}
              </Link>
            ))}
            {instagram ? (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={balkLink}
              >
                Instagram
              </a>
            ) : (
              <span className={`${balkLink} opacity-50`}>Instagram</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
