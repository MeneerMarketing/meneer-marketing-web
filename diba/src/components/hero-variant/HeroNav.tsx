"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DibaLogo from "@/components/ui/DibaLogo";
import { HOOFDNAV, type NavItem } from "@/data/hoofdnavigatie";
import { DIBA_SALONIZED_BOOKING_URL } from "@/lib/site";

/**
 * De navigatie die in het hero-beeld zweeft.
 *
 * Drie dingen die anders zijn dan een gewone header:
 *
 * 1. Hij staat óp de foto, in wit. Vandaar de verlopen in HeroVariant; zonder die
 *    verlopen haalt wit op een foto nooit AA.
 * 2. Alles staat rechts. Logo links, en dan één blok met de menu-items en de knop tegen
 *    de rechterrand aan. Dat is wat het voorbeeld zijn rust geeft: geen items die ergens
 *    in het midden zweven.
 * 3. De panelen zijn breed en niet smal. Zeventien huidproblemen passen niet in een
 *    kolommetje van 200px, en ze wegstoppen achter "Huidproblemen" is precies de kans
 *    missen: die lijst mét de eerste vraag eronder is het beste wat deze site heeft.
 *
 * Bediening. Openen op hover, want dat hoort bij dit soort headers. Maar hover alleen is
 * niet genoeg voor WCAG 2.2 (1.4.13 wil dat je een paneel weg kunt krijgen), dus:
 * klikken opent en sluit ook, Escape sluit, en tabben opent het paneel waar je in staat.
 * Het paneel blijft staan zolang je muis erin is.
 *
 * Op mobiel geen hover maar een eigen paneel over het hele scherm, met de groepen in
 * `details` zodat het niet één lijst van veertig regels wordt.
 */

const PANEEL_DICHT_VERTRAGING = 120;

export default function HeroNav() {
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
      className="absolute inset-x-0 top-0 z-30"
      onMouseLeave={() => plan(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setOpen(null);
      }}
    >
      <header className="flex items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Diba Clinics, naar de homepage"
          className="shrink-0 rounded-[var(--r-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <DibaLogo variant="white" priority />
        </Link>

        {/* Alles rechts: menu en knop in één blok tegen de rand. */}
        <div className="flex items-center gap-2 lg:gap-6">
          <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {HOOFDNAV.map((item) => (
                <li key={item.label}>
                  <NavKnop
                    item={item}
                    open={open === item.label}
                    onOpen={() => plan(item.label)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Op mobiel staat deze knop er niet. Het logo plus de knop plus de hamburger
              passen niet op 390px, en belangrijker: de kop eronder heeft dezelfde knop al
              staan. Twee keer dezelfde primaire actie op één scherm is er één te veel. */}
          <Link
            href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
            className="diba-label hidden h-11 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-5 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
          >
            Afspraak maken
            <Pijl />
          </Link>

          <button
            type="button"
            aria-expanded={mobielOpen}
            aria-label={mobielOpen ? "Menu sluiten" : "Menu openen"}
            onClick={() => setMobielOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] border border-white/40 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
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
      </header>

      {/* Verduistering achter een open paneel, zodat het beeld het menu niet beconcurreert. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[130vh] bg-[var(--g-900)]/45 transition-opacity duration-300 [transition-timing-function:var(--ease-diba)] ${
          actief ? "opacity-100" : "opacity-0"
        }`}
      />

      {actief ? <Paneel item={actief} onSluit={() => setOpen(null)} /> : null}

      {/* Het mobiele paneel gaat naar `body` en niet hier. Deze wrapper staat op z-30 en
          maakt daarmee een eigen stapelcontext: alles daarbinnen concurreert als één
          laag op z-30, dus ook een kind met z-60 verloor het van de cookiebalk op z-50.
          Dat is precies wat er gebeurde: de afspraakknop onderin het menu zat eronder. */}
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
 */
function NavKnop({
  item,
  open,
  onOpen,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
}) {
  /**
   * Geen `diba-label` hier. Dat zet alles in kapitalen met letterafstand, en zes
   * menu-items in kapitalen leest als een waarschuwing en niet als een menu. In het
   * voorbeeld staat de navigatie gewoon in gemengd schrift.
   */
  const vorm =
    "flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] px-3 text-[15px] leading-none text-white/85 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  if (!item.kolommen) {
    return (
      <Link
        href={item.href}
        className={vorm}
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
      className={`${vorm} ${open ? "bg-white/15 text-white" : ""}`}
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
function Paneel({ item, onSluit }: { item: NavItem; onSluit: () => void }) {
  /**
   * Het aantal kolommen volgt uit de inhoud en staat niet vast. Met een vast raster van
   * vier bleef er bij Huidproblemen een lege kolom over: driehonderd pixels niets naast
   * een lijst die juist ruimte kon gebruiken.
   */
  const kolommen = item.kolommen ?? [];
  const banen = kolommen.reduce((n, k) => n + (k.breed ? 2 : 1), 0);

  return (
    <div
      className="absolute inset-x-3 top-[76px] hidden overflow-hidden rounded-[var(--r-lg)] bg-white shadow-[var(--shadow-float)] lg:block"
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
                        href={l.href}
                        onClick={onSluit}
                        className="group block rounded-[var(--r-sm)] px-3 py-2 -mx-3 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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
          <div className="col-span-3 flex flex-col justify-center bg-[var(--g-050)] p-8 xl:p-10">
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
              href={item.uitgelicht.href}
              onClick={onSluit}
              className="diba-label mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              {item.uitgelicht.knop}
              <Pijl />
            </Link>
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
 */
function MobielPaneel({ onSluit }: { onSluit: () => void }) {
  return (
    /* Boven de cookiebalk. Die staat op z-50 en dekte anders precies de afspraakknop
       onderin dit paneel af; een menu dat over het hele scherm ligt hoort bovenaan. */
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
