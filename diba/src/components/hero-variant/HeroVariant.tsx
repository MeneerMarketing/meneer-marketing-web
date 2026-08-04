import Image from "next/image";
import Link from "next/link";
import Topbalk from "@/components/hero-variant/Topbalk";
import DibaLogo from "@/components/ui/DibaLogo";
import Label from "@/components/ui/Label";
import { FIGMA_HOME_PORTRAIT_WIDE } from "@/data/figma-home-images";
import { DIBA_SALONIZED_BOOKING_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Hero-variant — topbalk, header en één groot beeldvlak.
 *
 * Naar de opzet die Yasin aanwees: een brede foto met ronde hoeken en witruimte
 * eromheen, de kop linksonder in het beeld, en daarboven een dunne balk met de
 * waardering en de taalkiezer.
 *
 * Wat er anders is dan het voorbeeld, en met opzet:
 *
 * - De kop belooft niets over onszelf. "De best gewaardeerde kliniek" is precies het
 *   soort superlatief dat §11 verbiedt zolang er geen meting achter zit. Onze kop zegt
 *   wat we dóen, en het cijfer staat erboven mét de bron erbij.
 * - Het donkere verloop over de foto is er om de tekst leesbaar te houden en niet als
 *   effect. Wit op een foto haalt zonder dat verloop nooit AA.
 * - Onder het beeld staat wie de inhoud klinisch nakijkt. In het voorbeeld staat daar
 *   een arts; bij ons hoort daar Rojda te staan zodra dat vastligt.
 *
 * Staat los op /home-variant. De bestaande homepage is niet aangeraakt, zodat
 * teruggaan niets meer is dan deze route weggooien.
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

      {/* ── Header ── */}
      <header className="mx-auto flex max-w-[1800px] items-center justify-between gap-6 px-5 py-5 sm:px-9 lg:px-[7.5vw]">
        <Link
          href="/"
          aria-label="Diba Clinics, naar de homepage"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-700)]"
        >
          <DibaLogo className="h-6 w-auto" />
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-[15px] text-[var(--t-strong)] transition-colors hover:text-[var(--g-700)]"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
          className="diba-label inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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

      {/* ── Het beeldvlak ── */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[1800px] overflow-hidden rounded-[var(--r-xl)] sm:aspect-[16/10] lg:aspect-[16/8]">
          <Image
            src={FIGMA_HOME_PORTRAIT_WIDE.src}
            alt={FIGMA_HOME_PORTRAIT_WIDE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Leesbaarheid, geen sfeer: wit op een foto haalt anders geen AA. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[var(--g-900)]/85 via-[var(--g-900)]/30 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14">
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

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                  className="diba-label inline-flex h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-btn)]"
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

                <a
                  href={DIBA_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label inline-flex h-12 items-center border-b border-white/40 text-[var(--on-dark)] transition-colors hover:border-white"
                >
                  Of stel eerst je vraag
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Klinische verantwoording ──
          Wie de inhoud nakijkt hoort onder de hero en niet in de voettekst. */}
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-x-3 gap-y-1 px-5 pb-8 sm:px-9 lg:px-[7.5vw]">
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
