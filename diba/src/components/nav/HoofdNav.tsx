"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DibaLogo from "@/components/ui/DibaLogo";
import { HOOFDNAV, type NavItem } from "@/data/hoofdnavigatie";
import { DIBA_SALONIZED_BOOKING_URL } from "@/lib/site";

/**
 * De hoofdnavigatie van de site. Eén component, twee verschijningsvormen.
 *
 * `opBeeld` zet hem in wit bovenop een foto: dat is de hero-variant, waar de navigatie in
 * het beeld zweeft. Zonder die vlag staat hij op wit en blijft hij bij het scrollen boven
 * in beeld hangen, en dat is wat elke andere pagina krijgt.
 *
 * Waarom één component en geen twee: het verschil tussen die vormen is kleur en
 * verankering, en verder niets. De boom, de panelen, het mobiele scherm en de bediening
 * zijn identiek. Twee kopieën zouden binnen een maand uit elkaar lopen op precies het
 * soort detail dat niemand opmerkt tot er ergens een link ontbreekt.
 *
 * Wat de panelen bijzonder maakt: ze zijn breed en niet smal. Zeventien huidproblemen
 * passen niet in een kolommetje van 200px, en ze wegstoppen is de kans missen. Die lijst
 * mét de eerste vraag van elke pagina eronder is het beste wat deze site heeft.
 *
 * Bediening. Openen op hover, want dat hoort bij dit soort headers. Maar hover alleen is
 * niet genoeg voor WCAG 2.2 (1.4.13 wil dat je een paneel weg kunt krijgen), dus: klikken
 * opent en sluit ook, Escape sluit, en tabben opent het paneel waar je in staat. Het
 * paneel blijft staan zolang je muis erin is.
 *
 * Op mobiel geen hover maar een eigen scherm over alles heen, met de groepen in `details`
 * zodat het niet één lijst van veertig regels wordt.
 */

const PANEEL_DICHT_VERTRAGING = 120;

type Vormgeving = {
  readonly wrapper: string;
  readonly logo: "dark" | "white";
  readonly item: string;
  readonly itemOpen: string;
  readonly knop: string;
  readonly hamburger: string;
  readonly scrim: string;
  readonly paneel: string;
};

/**
 * Alles wat tussen de twee vormen verschilt staat hier bij elkaar en nergens anders in dit
 * bestand. Zo is in één oogopslag te zien wat er precies anders is aan de variant op
 * beeld, en blijft de rest van de component vrij van vertakkingen.
 */
const VORM: Record<"opBeeld" | "opWit", Vormgeving> = {
  opBeeld: {
    wrapper: "absolute inset-x-0 top-0 z-30",
    logo: "white",
    item: "text-white/85 hover:bg-white/12 hover:text-white focus-visible:outline-white",
    itemOpen: "bg-white/15 text-white",
    knop: "bg-[var(--on-dark-btn)] text-[var(--on-dark-btn-text)] hover:bg-white focus-visible:outline-white",
    hamburger:
      "border-white/40 text-white hover:bg-white/10 focus-visible:outline-white",
    scrim: "absolute inset-x-0 top-0 h-[130vh]",
    paneel: "absolute inset-x-3 top-[76px] rounded-[var(--r-lg)]",
  },
  opWit: {
    /* Zacht mint, geen wit.
       Wit op een paginavlak van var(--g-010) is bijna hetzelfde en dat maakt de balk een
       kleurloze strook. g-050 geeft hem een eigen vlak zonder dat er een lijn onder
       hoeft, en dat is precies hoe de Figma-homepage haar banden scheidt. */
    wrapper: "sticky top-0 z-40 bg-white",
    logo: "dark",
    item: "text-[var(--t-body)] hover:bg-[var(--g-050)] hover:text-[var(--t-strong)] focus-visible:outline-[var(--g-700)]",
    itemOpen: "bg-[var(--g-050)] text-[var(--t-strong)]",
    knop: "bg-[var(--g-700)] text-white hover:bg-[var(--g-800)] focus-visible:outline-[var(--g-700)]",
    hamburger:
      "border-[var(--g-100)] text-[var(--t-strong)] hover:bg-[var(--g-050)] focus-visible:outline-[var(--g-700)]",
    /* Begint onder de header en niet bovenaan het scherm: met `fixed inset-0` werd de
       topbalk erboven mee verduisterd terwijl de navigatie zelf wit bleef, en dat leest
       als een fout in plaats van als een verduistering. */
    scrim: "absolute inset-x-0 top-full h-screen",
    paneel:
      "absolute inset-x-0 top-full rounded-b-[var(--r-lg)] border-t border-[var(--g-100)]",
  },
};

export default function HoofdNav({ opBeeld = false }: { opBeeld?: boolean }) {
  const v = VORM[opBeeld ? "opBeeld" : "opWit"];
  const [open, setOpen] = useState<string | null>(null);
  const [mobielOpen, setMobielOpen] = useState(false);
  const sluitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Openen mag meteen, sluiten met een korte vertraging: anders klapt hij dicht als je
   *  van het item naar het paneel beweegt en er een pixel tussen zit. */
  function plan(waarde: string | null) {
    if (sluitTimer.current) clearTimeout(sluitTimer.current);
    if (waarde === null) {
      sluitTimer.current = setTimeout(
        () => setOpen(null),
        PANEEL_DICHT_VERTRAGING,
      );
      return;
    }
    setOpen(waarde);
  }

  useEffect(() => {
    function opToets(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(null);
      setMobielOpen(false);
    }
    document.addEventListener("keydown", opToets);
    return () => document.removeEventListener("keydown", opToets);
  }, []);

  /** Achtergrond niet laten meescrollen zolang het mobiele paneel openstaat. */
  useEffect(() => {
    if (!mobielOpen) return undefined;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorige;
    };
  }, [mobielOpen]);

  useEffect(
    () => () => {
      if (sluitTimer.current) clearTimeout(sluitTimer.current);
    },
    [],
  );

  const actief = HOOFDNAV.find((n) => n.label === open && n.kolommen);

  return (
    <div
      className={v.wrapper}
      onMouseLeave={() => plan(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setOpen(null);
      }}
    >
      {/* Dezelfde container als elke pagina.
          Gemeten op 1440 breed stond het logo op 32px terwijl de kruimel en de H1
          eronder op 108px begonnen: de balk gebruikte px-4/sm:px-6/lg:px-8 en de rest
          van de site mx-auto px-5/sm:px-9/lg:px-[7.5vw]. Zesenzeventig
          pixels verschil is precies genoeg om scheef te ogen zonder dat je meteen ziet
          waarom. Nu vallen logo, kruimel en kop op één lijn. */}
      <header className="relative z-10 bg-inherit">
        <div className="mx-auto flex items-center justify-between gap-6 px-5 py-5 sm:px-9 lg:px-[7.5vw]">
          <Link
            prefetch={false}
            href="/"
            aria-label="Diba Clinics, naar de homepage"
            className="shrink-0 rounded-[var(--r-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <DibaLogo variant={v.logo} priority={opBeeld} />
          </Link>

          {/* Alles rechts: menu en knop in één blok tegen de rand. */}
          <div className="flex items-center gap-2 lg:gap-6">
            <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {HOOFDNAV.map((item) => (
                  <li key={item.label}>
                    <NavKnop
                      item={item}
                      vorm={v}
                      open={open === item.label}
                      onOpen={() => plan(item.label)}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Op mobiel staat deze knop er niet. Logo plus knop plus hamburger passen niet
              op 390px, en elke pagina heeft de afspraakknop verderop nog staan. Twee keer
              dezelfde primaire actie op één scherm is er één te veel. */}
            <Link
              href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
              className={`diba-label hidden h-11 shrink-0 items-center gap-2 rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex ${v.knop}`}
            >
              Afspraak maken
              <Pijl />
            </Link>

            <button
              type="button"
              aria-expanded={mobielOpen}
              aria-label={mobielOpen ? "Menu sluiten" : "Menu openen"}
              onClick={() => setMobielOpen((b) => !b)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden ${v.hamburger}`}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {mobielOpen ? (
                  <path d="M5 5l10 10M15 5 5 15" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Verduistering achter een open paneel, zodat de pagina het menu niet beconcurreert. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none bg-[var(--g-900)]/45 transition-opacity duration-300 [transition-timing-function:var(--ease-diba)] ${v.scrim} ${
          actief ? "opacity-100" : "opacity-0"
        }`}
      />

      {actief ? (
        <Paneel item={actief} vorm={v} onSluit={() => setOpen(null)} />
      ) : null}

      {/* Het mobiele paneel gaat naar `body` en niet hier. De wrapper heeft een z-index en
          maakt daarmee een eigen stapelcontext: alles daarbinnen concurreert als één laag,
          dus ook een kind met z-60 verloor het van de cookiebalk op z-50. Dat is precies
          wat er gebeurde: de afspraakknop onderin het menu zat eronder. */}
      {mobielOpen
        ? createPortal(
            <MobielPaneel onSluit={() => setMobielOpen(false)} />,
            document.body,
          )
        : null}
    </div>
  );
}

function Pijl() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  );
}

/**
 * Een item met een paneel is een knop en geen link: klikken hoort het paneel te openen.
 * De link naar de overzichtspagina staat onderin het paneel, waar je hem verwacht.
 * Een item zonder paneel is gewoon een link.
 *
 * De items dragen `diba-label`: kapitalen met letterafstand, zoals de labels boven elke
 * sectiekop. Hier heeft eerder het omgekeerde gestaan, met als reden dat vijf items in
 * kapitalen als een waarschuwing zouden lezen. Dat was een smaakoordeel van mij en niet
 * iets dat gemeten was; Yasin kiest de kapitalen, en dat is zijn merk.
 *
 * Wat er wél aan gemeten moet worden is de breedte. Kapitalen met letterafstand nemen
 * meer ruimte dan gewone tekst, dus na elke wijziging aan de menu-items controleren dat
 * de balk niet omslaat op de smalste desktopbreedte.
 */
function NavKnop({
  item,
  vorm,
  open,
  onOpen,
}: {
  item: NavItem;
  vorm: Vormgeving;
  open: boolean;
  onOpen: () => void;
}) {
  /* Krapper op de smalste desktopmaat. Met kapitalen groeide de balk zo ver dat de knop
     "Afspraak maken" bij 1024 breed tot 1046 liep, dus tweeëntwintig pixels buiten beeld.
     Precies bij het breekpunt waarop deze navigatie verschijnt. Van px-3 naar px-2 scheelt
     acht pixels per item, over vijf items veertig; vanaf xl is er ruimte genoeg. */
  const basis = `diba-label flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] px-2 leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 xl:px-3 ${vorm.item}`;

  if (!item.kolommen) {
    return (
      <Link
        prefetch={false}
        href={item.href}
        className={basis}
        onMouseEnter={onOpen}
        onFocus={onOpen}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={open}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
      className={`${basis} ${open ? vorm.itemOpen : ""}`}
    >
      {item.label}
      <svg
        viewBox="0 0 12 12"
        className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </button>
  );
}

/**
 * Het uitklappaneel. Negen kolommen lijst, drie kolommen uitgelicht.
 *
 * De knop in het uitgelichte vak staat direct onder zijn eigen tekst en niet onderaan de
 * kolom: bij een paneel van zeshonderd pixels hoog valt daar anders een gat waar niets in
 * staat.
 */
function Paneel({
  item,
  vorm,
  onSluit,
}: {
  item: NavItem;
  vorm: Vormgeving;
  onSluit: () => void;
}) {
  /**
   * Het aantal kolommen volgt uit de inhoud en staat niet vast. Met een vast raster van
   * vier bleef er bij Huidproblemen een lege kolom over: driehonderd pixels niets naast
   * een lijst die juist ruimte kon gebruiken.
   */
  const kolommen = item.kolommen ?? [];
  const banen = kolommen.reduce((n, k) => n + (k.breed ? 2 : 1), 0);

  return (
    <div
      className={`hidden overflow-hidden bg-white shadow-[var(--shadow-float)] lg:block ${vorm.paneel}`}
      style={{ animation: "diba-paneel-in .28s var(--ease-diba) both" }}
    >
      <div className="grid grid-cols-12">
        <div className="col-span-9 p-8 xl:p-10">
          <div
            className="grid gap-x-10 gap-y-10"
            style={{ gridTemplateColumns: `repeat(${banen}, minmax(0, 1fr))` }}
          >
            {kolommen.map((kolom) => (
              <div
                key={kolom.kop}
                style={kolom.breed ? { gridColumn: "span 2" } : undefined}
              >
                <p className="diba-label text-[var(--t-muted)]">{kolom.kop}</p>
                <ul
                  className={`mt-4 gap-x-6 ${kolom.breed ? "grid grid-cols-2" : "flex flex-col"}`}
                >
                  {kolom.items.map((l) => (
                    <li key={l.href}>
                      <Link
                        prefetch={false}
                        href={l.href}
                        onClick={onSluit}
                        className="group -mx-3 block rounded-[var(--r-sm)] px-3 py-2 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                      >
                        <span className="block text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                          {l.label}
                        </span>
                        {l.zin ? (
                          <span className="mt-0.5 block text-[13px] leading-5 text-[var(--t-muted)]">
                            {l.zin}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-[var(--g-100)] pt-5">
            <Link
              prefetch={false}
              href={item.href}
              onClick={onSluit}
              className="diba-label inline-flex items-center gap-2 text-[var(--g-700)] transition-colors hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Alles onder {item.label.toLowerCase()}
              <Pijl />
            </Link>
          </div>
        </div>

        {item.uitgelicht ? (
          <div className="col-span-3 flex flex-col bg-[var(--g-050)]">
            {/* Het beeld vult de bovenkant tot de randen. De kolom was voor twee derde
                leeg; nu draagt hij waar je terechtkomt. */}
            {item.uitgelicht.foto ? (
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                  src={item.uitgelicht.foto.src}
                  alt={item.uitgelicht.foto.alt}
                  fill
                  sizes="30vw"
                  className="object-cover object-center"
                />
              </div>
            ) : null}

            <div className="flex flex-1 flex-col justify-center p-8 xl:p-10">
            <p className="diba-label text-[var(--t-muted)]">
              {item.uitgelicht.label}
            </p>
            <p className="diba-card-title mt-3 text-[var(--t-strong)]">
              {item.uitgelicht.kop}
            </p>
            <p className="mt-3 text-[14px] leading-6 text-[var(--t-body)]">
              {item.uitgelicht.zin}
            </p>
            <Link
              prefetch={false}
              href={item.uitgelicht.href}
              onClick={onSluit}
              className="diba-label mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              {item.uitgelicht.knop}
              <Pijl />
            </Link>

            {/* De tweede ingang. Bewust een tekstlink en geen tweede knop: twee knoppen
                naast elkaar maken er een keuze van, en dan sta je alsnog stil. */}
            {item.uitgelicht.tweede ? (
              <Link
                prefetch={false}
                href={item.uitgelicht.tweede.href}
                onClick={onSluit}
                className="mt-4 inline-flex w-fit text-[14px] leading-6 text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                {item.uitgelicht.tweede.tekst}
              </Link>
            ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Mobiel. Geen hover, dus geen paneel dat meeschuift: één scherm over alles heen met de
 * groepen ingeklapt. `details` in plaats van state, zodat er niets kan ontsporen als er
 * halverwege een link wordt aangetikt.
 *
 * Boven de cookiebalk. Die staat op z-50 en dekte anders precies de afspraakknop onderin
 * dit paneel af; een menu dat over het hele scherm ligt hoort bovenaan.
 */
function MobielPaneel({ onSluit }: { onSluit: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--g-100)] px-4 py-4">
        <DibaLogo />
        <button
          type="button"
          onClick={onSluit}
          aria-label="Menu sluiten"
          className="flex h-11 w-11 items-center justify-center rounded-[var(--r-pill)] border border-[var(--g-100)] text-[var(--t-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 5l10 10M15 5 5 15" />
          </svg>
        </button>
      </div>

      <nav
        aria-label="Hoofdnavigatie"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-2"
      >
        <ul className="divide-y divide-[var(--g-100)]">
          {HOOFDNAV.map((item) =>
            item.kolommen ? (
              <li key={item.label}>
                <details className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-[17px] font-medium text-[var(--t-strong)] [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 text-[var(--t-muted)] transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                  </summary>
                  <ul className="pb-3">
                    {item.kolommen.map((kolom) => (
                      <li key={kolom.kop} className="mt-2">
                        <p className="diba-label px-3 py-2 text-[var(--t-muted)]">
                          {kolom.kop}
                        </p>
                        <ul>
                          {kolom.items.map((l) => (
                            <li key={l.href}>
                              <Link
                                prefetch={false}
                                href={l.href}
                                onClick={onSluit}
                                className="flex min-h-12 items-center rounded-[var(--r-sm)] px-3 text-[15px] text-[var(--t-body)] active:bg-[var(--g-050)]"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                    <li className="mt-2">
                      <Link
                        prefetch={false}
                        href={item.href}
                        onClick={onSluit}
                        className="diba-label flex min-h-12 items-center px-3 text-[var(--g-700)]"
                      >
                        Alles onder {item.label.toLowerCase()}
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  prefetch={false}
                  href={item.href}
                  onClick={onSluit}
                  className="flex min-h-14 items-center text-[17px] font-medium text-[var(--t-strong)]"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-[var(--g-100)] p-4">
        <Link
          href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
          onClick={onSluit}
          className="diba-label flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] text-white"
        >
          Afspraak maken
          <Pijl />
        </Link>
      </div>
    </div>
  );
}
