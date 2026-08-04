import Image from "next/image";
import Link from "next/link";
import Topbalk from "@/components/hero-variant/Topbalk";
import DibaLogo from "@/components/ui/DibaLogo";
import Label from "@/components/ui/Label";
import { FIGMA_HOME_PORTRAIT_WIDE } from "@/data/figma-home-images";
import { DIBA_SALONIZED_BOOKING_URL } from "@/lib/site";

/**
 * Hero-variant — topbalk boven, daaronder één beeldvlak met de navigatie eróver.
 *
 * De eerste poging zette de header boven de foto op wit. Dat was de kern van het
 * voorbeeld missen: daar zweeft het menu transparant over het beeld in wit, en het beeld
 * vult bijna het hele eerste scherm. Alleen de dunne balk met de waardering staat erboven
 * op wit.
 *
 * Vandaar deze opbouw:
 *   1. topbalk op wit, dun
 *   2. één beeldvlak met ronde hoeken en witruimte eromheen, bijna schermvullend
 *   3. logo, navigatie en knop zweven daarbinnen, in wit
 *   4. de kop linksonder in het beeld
 *
 * Wat er anders is dan het voorbeeld, en met opzet:
 *
 * - De kop belooft niets over onszelf. "De best gewaardeerde kliniek" is precies het
 *   superlatief dat §11 verbiedt zolang er geen meting achter zit. Onze kop zegt wat we
 *   dóen; het cijfer staat in de topbalk mét de bron erbij.
 * - Twee verlopen over de foto en niet één: bovenaan een donkere aanzet zodat de witte
 *   navigatie leesbaar blijft op een lichte foto, onderaan een zwaardere voor de kop.
 *   Wit op een foto haalt zonder die verlopen nooit AA.
 *
 * Hoogte in `svh` en niet in `vh`: op iOS is 100vh groter dan wat je ziet, en dan valt de
 * kop onder de adresbalk.
 *
 * Staat los op /home-variant. De bestaande homepage is niet aangeraakt.
 */

const NAV = [
  { label: "Huidproblemen", href: "/huidproblemen" },
  { label: "Behandelingen", href: "/behandelingen" },
  { label: "De huidscan", href: "/#huidscan" },
  { label: "Ons verbond", href: "/ons-verbond" },
  { label: "Prijzen", href: "/prijzen" },
];

export default function HeroVariant() {
  return (
    <div className="bg-white">
      <Topbalk />

      <section className="p-2 sm:p-3">
        <div className="relative h-[calc(100svh-6.5rem)] min-h-[560px] w-full overflow-hidden rounded-[var(--r-xl)]">
          <Image
            src={FIGMA_HOME_PORTRAIT_WIDE.src}
            alt={FIGMA_HOME_PORTRAIT_WIDE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Leesbaarheid, geen sfeer. Boven voor de navigatie, onder voor de kop. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--g-900)]/55 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--g-900)]/85 via-[var(--g-900)]/35 to-transparent"
          />

          {/* ── Navigatie, zwevend in het beeld ── */}
          <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
            <Link
              href="/"
              aria-label="Diba Clinics, naar de homepage"
              className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <DibaLogo variant="white" />
            </Link>

            <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="text-[15px] text-white/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
              className="diba-label inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-5 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Afspraak maken
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
            </Link>
          </header>

          {/* ── De kop ── */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
            <div className="max-w-[46ch]">
              <Label opDonker>Behandeling nul</Label>

              <h1 className="diba-display-l mt-4 text-[var(--on-dark)]">
                Wij gokken niet.
                <br />
                <span className="diba-accent-on-dark">Wij meten.</span>
              </h1>

              <p className="mt-5 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Elke behandeling begint met een meting onder vast licht. Daarna hoor je wat
                er realistisch mogelijk is, en soms is dat niets.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                  className="diba-label inline-flex h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Plan Behandeling Nul
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
                </Link>

                <Link
                  href="/huidproblemen"
                  className="diba-label inline-flex h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Onze huidproblemen
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Klinische verantwoording ── */}
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-x-3 gap-y-1 px-5 py-6 sm:px-9 lg:px-[7.5vw]">
        <span className="text-[14px] leading-6 text-[var(--t-muted)]">
          De medische inhoud op deze site wordt nagekeken door
        </span>
        <span className="text-[14px] leading-6 font-medium text-[var(--t-strong)] underline decoration-[var(--g-300)] underline-offset-4">
          Rojda
        </span>
        <span className="diba-label text-[var(--t-muted)]">Nog vast te leggen</span>
      </div>
    </div>
  );
}
