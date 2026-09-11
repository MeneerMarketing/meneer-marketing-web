import Link from "next/link";
import DibaLogo from "@/components/ui/DibaLogo";
import {
  DIBA_ADDRESS,
  DIBA_BOUWER,
  DIBA_SITE,
  DIBA_SOCIALS,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";
import { figmaInnerContainer } from "@/lib/figma-inner-layout";
import VoetKolommen from "@/components/ui/VoetKolommen";
import Logostrook from "@/components/ui/Logostrook";

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
  "inline-block text-[13px] leading-6 text-[var(--t-body)] transition hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

const balkTekst =
  "text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)]";

/**
 * De knopjes onder het logo: adres, telefoon, WhatsApp en Instagram.
 *
 * Een rand en geen vulling, want de voettekst werkt met ruimte en haarlijnen en niet met
 * vlakken. `min-h-11` haalt de tikmaat zonder dat het knoppen worden.
 */
const voetPil =
  "diba-label inline-flex min-h-11 items-center rounded-[var(--r-pill)] border border-[var(--g-100)] px-4 text-[var(--t-body)] transition-colors hover:border-[var(--g-700)] hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

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
      { label: "Tarieven", href: "/tarieven" },
      { label: "Vergoedingen", href: "/vergoedingen" },
    ],
  },
  {
    kop: "Over Diba",
    links: [
      { label: "Over ons", href: "/over-ons" },
      { label: "Ons verhaal", href: "/ons-verhaal" },
      { label: "Het team", href: "/team" },
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
      {
        label: "Kwaliteit en registraties",
        href: "/kwaliteit-en-registraties",
      },
      { label: "Voor verwijzende zorgverleners", href: "/verwijzers" },
    ],
  },
];

/** De juridische pagina's. Horen erbij, maar niet tussen de rest. */
const JURIDISCH: readonly { readonly label: string; readonly href: string }[] =
  [
    { label: "Privacy", href: "/privacybeleid" },
    { label: "Cookies", href: "/cookiebeleid" },
    { label: "Voorwaarden", href: "/algemene-voorwaarden" },
  ];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    /* De ruimte boven de voettekst zit hier en niet in de sectie erboven, zodat het op
       elke pagina hetzelfde is. Eerst was het vier pixels en plakte de voettekst aan het
       groene vlak; toen achtentwintig en was het te veel.
       Op 11 september 2026 nog een keer bijgesteld: er stond een tweede marge binnenin, en
       samen maakten ze er 112 tot 136 pixels van. Dat las als een gat tussen het
       afsluitblok en het logo. Nu één marge van 40 op een telefoon en 56 daarboven; met de
       ondermarge van het afsluitblok erbij komt dat op 60 en 104. */
    <footer className={`${figmaInnerContainer} pt-10 pb-12 lg:pt-14`}>
      {/* De lijn boven de voettekst is eraf (Yasin, 11 september 2026). De ruimte erboven
          doet het werk al; een streep erbij maakt er een vak van. */}
      {/* Geen tweede marge hier: `pt-16 lg:pt-20` hierboven is de ruimte boven de
          voettekst. Die twee stapelden en maakten er 112 tot 136 pixels van, wat als
          een gat leest tussen het afsluitblok en het logo (Yasin, 11 september 2026). */}
      <div className="mx-auto">
        {/* Het merk, in het midden.

            Hier stond het logo links met een zin van drie regels ernaast, in een kolom van
            zesentwintig tekens. Dat leest als een restje (Yasin: "droog en lelijk"). Nu
            staat het logo boven de kolommen in het midden, met één regel eronder en de
            manieren om ons te bereiken als knopjes daaronder: adres, telefoon, WhatsApp en
            de drie profielen. Dat is waarvoor iemand naar een voettekst scrolt. */}
        <div className="text-center">
          <DibaLogo maat="groot" className="mx-auto" />
          <p className="mx-auto mt-6 max-w-[48ch] text-[15px] leading-7 text-[var(--t-body)]">
            Huidkliniek in {DIBA_SITE.neighborhood}, sinds 2017. Acne, pigment,
            littekens, huidverbetering en ongewenste haargroei, door
            huidtherapeuten die eerst meten en daarna pas behandelen.
          </p>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <li>
              <Link href="/contact" className={voetPil}>
                {DIBA_ADDRESS.street}, {DIBA_ADDRESS.city}
              </Link>
            </li>
            <li>
              <a href={DIBA_TELEFOON_HREF} className={voetPil}>
                {DIBA_TELEFOON}
              </a>
            </li>
            <li>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={voetPil}
              >
                WhatsApp
              </a>
            </li>
            {/* Instagram, TikTok en Facebook, uit de lijst in site.ts. Ze staan hier
                naast het adres, het nummer en WhatsApp, want dit rijtje is "hoe je ons
                vindt" en niet "welke apps we hebben". */}
            {DIBA_SOCIALS.map((kanaal) => (
              <li key={kanaal.naam}>
                <a
                  href={kanaal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={voetPil}
                >
                  {kanaal.naam}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 lg:mt-16">
          <VoetKolommen
            kolommen={KOLOMMEN}
            kopKlasse={kolomLabel}
            linkKlasse={kolomLink}
          />
        </div>

        {/* De registers en verenigingen, met logo. Onder de kolommen en boven het adres:
            het is geen navigatie, maar wel iets wat je onderaan een zorgsite zoekt. */}
        {/* De kop staat in het midden sinds de logo's dat doen: een gecentreerde rij
            onder een linkse regel hangt scheef. */}
        {/* Geen tweede lijn op een telefoon. De kolommenlijst sluit daar al af met een
            rand (`border-y` op de nav), en een `border-t` hier zette daar achtenveertig
            punten onder met nog een lijn: twee strepen met lucht ertussen leest als een
            leeg vak. Yasin, 10 september 2026: "waarom staat er onder Praktisch nog een
            leeg vak?" Op desktop staat die rand er wel, want daar heeft de nav hem niet. */}
        <div className="mt-8 pt-0 text-center lg:mt-12 lg:border-t lg:border-[var(--g-100)] lg:pt-8">
          <p className={kolomLabel}>Aangesloten bij en geregistreerd in</p>
          <Logostrook className="mt-6" />
        </div>

        {/* De onderste balk, in twee lagen.

            De juridische pagina's stonden op één rij met Instagram, en dat is het verschil
            tussen een voorwaarde en een kanaal (Yasin, 11 september 2026). Instagram staat
            nu bovenin bij de andere manieren om ons te bereiken; hier staan alleen de drie
            pagina's die je onderaan een site verwacht, in het midden.

            Daaronder de regel die elke site heeft: links van wie de site is, rechts wie
            hem gebouwd heeft. Adres en telefoon stonden hier ook; die zijn naar boven
            verhuisd, want het zijn gegevens en geen kleine lettertjes. */}
        <div className="mt-14 border-t border-[var(--g-100)] pt-7 lg:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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
          </div>

          {/* Gecentreerd, met een streepje ertussen (Yasin, 11 september 2026). Alleen de
              naam is onderstreept en niet de woorden "website door": onderstrepen betekent
              dat je erop kunt klikken, en dat geldt voor de naam. */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span className={balkTekst}>
              &copy; {year} {DIBA_SITE.name}
            </span>
            {/* Op een telefoon past de regel niet op een regel en breekt hij achter het
                streepje af; dat streepje bungelt dan aan het eind van de bovenste regel.
                Twee regels onder elkaar en geen streepje is daar het nettere beeld. */}
            {/* Een gewoon streepje en geen kastlijntje: dat laatste staat in de
                huisregels als verboden teken en de controle ving het bij de eerste run. */}
            <span aria-hidden="true" className={`${balkTekst} max-sm:hidden`}>
              &ndash;
            </span>
            <span className={balkTekst}>
              Website door{" "}
              <a
                href={DIBA_BOUWER.url}
                target="_blank"
                rel="noopener"
                className={`${balkLink} underline decoration-[var(--g-200)] underline-offset-4 hover:decoration-[var(--g-700)]`}
              >
                {DIBA_BOUWER.naam}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
