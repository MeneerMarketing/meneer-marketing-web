"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FigmaKennisbankSection from "@/components/figma/FigmaKennisbankSection";
import HeroSchermvullend from "@/components/hero-variant/HeroSchermvullend";
import HeroVariant from "@/components/hero-variant/HeroVariant";
import HomeHero from "@/components/home/HomeHero";
import Wensenrij from "@/components/home/Wensenrij";
import Reviewslider from "@/components/home/Reviewslider";
import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import type { HomeWens } from "@/data/home-intents";
import Button from "@/components/ui/Button";
import DibaIcon from "@/components/ui/DibaIcon";
import { ArrowUpRight, Close, Pulse, Vinkje } from "@/components/ui/Icon";
import { BelOfAppInline } from "@/components/ui/BelOfApp";
import SiteFooter from "@/components/ui/SiteFooter";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import FigmaSoftAccent from "@/components/figma/FigmaSoftAccent";
import MiniHuidscan from "@/components/ui/MiniHuidscan";
import WerkwijzeStepsFlow from "@/components/ui/WerkwijzeStepsFlow";
import { FIGMA_TRAJECT_TESTIMONIAL } from "@/data/figma-home-images";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import {
  FIGMA_EERLIJK_PORTRAIT,
  FIGMA_EERLIJK_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";
import { DIBA_HOME_PROOF_ITEMS, DIBA_WHATSAPP_URL } from "@/lib/site";
import MobielInklap from "@/components/ui/MobielInklap";

/**
 * De drie punten onder "Behandeld door huidtherapeuten".
 *
 * WAT HIER STOND.
 *
 * Drie beloftes over onze houding: altijd een doel, vooraf de prijs, ook het rustige
 * advies. Allemaal waar, en geen ervan na te kijken. Rojda las de site en schreef: "Ik zie
 * juist al onze sterke punten niet terug." Ze noemde er drie, en die stonden nergens op
 * deze pagina terwijl ze precies het verschil zijn met de kliniek om de hoek.
 *
 * Feiten dus, in plaats van eigenschappen. Wie ze wil controleren kan dat.
 */
const EERLIJK_ADVIES_PUNTEN = [
  {
    titel: "NVH en Kwaliteitsregister Paramedici",
    tekst:
      "Onze huidtherapeuten zijn lid van de beroepsvereniging en staan in het register. Veel aanvullende pakketten stellen dat als eis voor vergoeding.",
  },
  {
    /* [BESLUIT-OKAN] Okan: "gecontracteerd bij alle zorgverzekeraars" alleen gebruiken
       als het aantoonbaar is en jaarlijks nagekeken wordt. Tot die tijd staat er wat er
       zeker klopt: er zijn contracten, en of jouw behandeling vergoed wordt hangt af van
       je klacht en je pakket. De vlag hoort hier en niet in de zin: deze lijst gaat niet
       langs publicCopy(), dus een vlag in de tekst leest de bezoeker mee. */
    titel: "Contracten met zorgverzekeraars",
    tekst:
      "Of jouw behandeling vergoed wordt, hangt af van je klacht en je aanvullende pakket.",
  },
  {
    titel: "ANBOS en SKIN Register",
    tekst:
      "De kliniek is aangesloten bij de branchevereniging, met eisen aan opleiding, hygiëne en klachtafhandeling; onze schoonheidsspecialisten staan in het SKIN Register.",
  },
] as const;

/**
 * De homepage.
 *
 * `hero` wisselt alleen het bovenste blok om, zodat een vergelijking over de hero gaat en
 * nergens anders over:
 *
 *   "figma"        de huidige homepage: balk, navigatie, en de hero met beeld naast tekst
 *   "variant"      het beeldvlak met ronde hoeken en de navigatie erin
 *   "schermvullend" video van rand tot rand, balk en navigatie doorschijnend erover
 *
 * Sinds 11 september 2026 draait / op "schermvullend": die hero is goedgekeurd en de
 * vergelijkingsroute is weg. De andere twee standen staan er nog voor het geval er opnieuw
 * vergeleken moet worden; is dat niet meer nodig, dan mag deze prop weg en met hem
 * HeroVariant en HomeHero.
 */
export default function FigmaHomeApp({
  hero = "figma",
  wensen,
}: {
  hero?: "figma" | "variant" | "schermvullend";
  /** Van de server (lib/home-wensen): de zeven huidwensen met hun behandelingen. */
  wensen: readonly HomeWens[];
}) {
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    if (!scanOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScanOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [scanOpen]);

  return (
    <main className="figma-home min-h-screen overflow-x-clip bg-[var(--g-010)] text-[var(--t-strong)] selection:bg-[var(--on-dark-accent)]">
      {/* Het bovenste blok is het enige dat per stand verschilt. De schermvullende hero
          en HeroVariant brengen hun eigen Topbalk en HoofdNav mee, want in die ontwerpen
          zweven die over het beeld in plaats van erboven te staan. Vandaar dat ze in de
          derde tak apart staan en in de andere twee niet. */}
      {hero === "schermvullend" ? (
        <HeroSchermvullend />
      ) : hero === "variant" ? (
        <HeroVariant />
      ) : (
        <>
          <Topbalk />
          <HoofdNav />

          <HomeHero />
        </>
      )}
      {/* De cijfers staan in de hero zelf: bij "figma" in HomeHero, bij "schermvullend"
          als strook eronder. Alleen de oude variant met het beeldvlak heeft ze niet en
          krijgt hier de losse balk. */}
      {hero === "variant" ? <ProofBar items={DIBA_HOME_PROOF_ITEMS} /> : null}

      {/* De zeven wensen als rij die je opzij veegt, in plaats van zeven uitklapkaarten
          onder elkaar (Yasin, 11 september 2026). */}
      <Wensenrij wensen={wensen} />

      <section
        id="huidscan"
        className="bg-[var(--g-700)] px-5 py-12 sm:py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <Label opDonker>De huidanalyse</Label>
            <h2 className="diba-display-l mt-5">
              Zo verloopt
              <br />
              <span className="diba-accent-on-dark">een traject bij ons</span>
            </h2>
            <p className="mt-7 max-w-md text-[16px] leading-7 text-[var(--on-dark-body)]">
              Tijdens de intake bespreken we je klacht en bekijkt de behandelaar
              je huid. Helpt een huidanalyse daarbij, dan maken we opnames met
              de EVE-M. Zo kun je later zien of er iets veranderd is. Niet elke
              behandeling vraagt om zo’n analyse.
            </p>
            {/* Eén uitgang, niet twee. De link "Meer over de huidanalyse" stond hieronder
                en is eruit (Yasin, 11 september 2026): de mini-scan hiernaast is de actie
                van deze sectie, deze knop is de uitleg, en een derde route erbij maakte van
                een keuze een lijstje. */}
            <div className="mt-9">
              <Button
                variant="secundair-op-donker"
                onClick={() => setScanOpen(true)}
              >
                Wat gebeurt er in een huidanalyse?
              </Button>
            </div>
          </div>
          <MiniHuidscan />
        </div>

        {/* "Elke huid wordt serieus genomen" stond hierboven als losse strook tussen twee
            secties in. Daar was het een tussenzin zonder eigenaar: een vlak dat nergens bij
            hoorde en de overgang van "Waar wil je hulp bij?" naar de huidscan in tweeen hakte.

            Hier hoort hij wel ergens bij. De sectie erboven gaat over meten, en meten kan
            klinken als een drempel: alsof je eerst iets moet weten voordat je binnen mag.
            Deze regel is precies het tegendeel daarvan, en staat nu dus op de plek waar die
            twijfel ontstaat in plaats van ervoor.

            Op donker en niet op mintgroen: dit is nu een onderdeel van de groene sectie en
            geen los kaartje. De vulling is wit op tien procent, want een tweede
            donkergroen vlak in hetzelfde vlak leest als een fout. */}
        {/* Weg op een telefoon (Yasin, 11 september 2026). De vaste balk onderaan het
            scherm draagt WhatsApp daar al, en dit blok zei hetzelfde een scherm hoger. */}
        <div className="mx-auto mt-12 hidden flex-wrap items-center justify-between gap-5 rounded-[var(--r-lg)] bg-white/10 px-7 py-6 sm:flex sm:px-10 lg:mt-16">
          <div className="flex items-center gap-5">
            <DibaIcon variant="wit" size={52} />
            <p className="max-w-xl text-sm leading-6 text-[var(--on-dark-body)]">
              <strong className="font-medium text-[var(--on-dark)]">
                Nog geen idee waar te beginnen?
              </strong>{" "}
              Stel je vraag, dan kijken we samen welke richting past.
            </p>
          </div>
          <a
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            /* `ml-auto` voor de telefoon: de rij loopt daar om, en dan komt de knop op
               een eigen regel links te staan. Yasin, 11 september 2026: die hoort rechts.
               Op een breed scherm doet `justify-between` het al en verandert er niets. */
            className="diba-label ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-5 py-3 text-[var(--on-dark-btn-text)] transition hover:bg-white"
          >
            Stel je vraag
            <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      {scanOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[var(--g-900)]/60 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-dialog-title"
          onClick={() => setScanOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-[var(--r-lg)] bg-white p-8 text-[var(--t-strong)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setScanOpen(false)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]"
              aria-label="Sluiten"
            >
              <Close size={18} />
            </button>
            <span className="diba-label inline-block rounded-[var(--r-pill)] bg-[var(--g-050)] px-3 py-2">
              De huidanalyse
            </span>
            <h3 id="scan-dialog-title" className="diba-card-title-lg mt-6">
              Jouw huid in kaart.
            </h3>
            <p className="mt-5 max-w-md leading-7 text-[var(--t-body)]">
              De opnames laten pigment, roodheid, poriegrootte, vochtgehalte en
              huidstructuur zien, in gewoon licht en onder UV-licht. Je ziet ze
              op het scherm en de behandelaar bespreekt ze met je.
            </p>
            <Button
              href="/intake"
              onClick={() => setScanOpen(false)}
              className="mt-7"
            >
              Plan een huidconsult
            </Button>
          </div>
        </div>
      ) : null}

      <section
        id="werkwijze"
        className="px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Label>Onze werkwijze</Label>
              <h2 className="diba-display-m mt-4">
                Hoe een behandeling
                <br />
                bij ons begint
              </h2>
            </div>
            <WerkwijzeStepsFlow className="self-end" />
          </div>
        </div>
      </section>

      {/* Eerlijk advies. Kolommen 50/50 zoals in het ontwerp (stond op 40/60), beeld met
          merkgroene waas plus vestigingslabel, en rechts een witte kaart met drie rijen
          die de belofte concreet maken. Die rijen zijn het verschil: zonder hen is dit
          een claim, met hen is het na te rekenen. */}
      <section className="bg-[var(--g-050)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Het groene vlak eronder en de multiply-modus zijn allebei weg. Samen
              verfden ze de foto egaal groen; wat overbleef was een silhouet, geen opname. */}
          <div className="relative min-h-[220px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] sm:min-h-[320px] lg:min-h-[440px]">
            <Image
              src={FIGMA_EERLIJK_PORTRAIT}
              alt={FIGMA_EERLIJK_PORTRAIT_ALT}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover object-center"
            />
            {/* Leeslaag onderaan, zodat het vestigingslabel altijd leesbaar is. Neutraal
                donker en niet groen: dit is schaduw, geen tint. */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/70 via-[var(--foto-scrim)]/10 to-transparent"
              aria-hidden="true"
            />
            <span className="diba-label absolute bottom-6 left-6 text-white">
              Diba Clinics in Rotterdam
            </span>
          </div>

          <div className="rounded-[var(--r-md)] bg-white p-5 sm:p-9 lg:p-10">
            <Label>De behandelaars</Label>
            <h2 className="diba-card-title-lg mt-4">
              Behandeld door huidtherapeuten
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Bij Diba werken huidtherapeuten, orthomoleculair huidspecialisten
              en schoonheidsspecialisten. Huidtherapeut is een beschermde titel:
              daarvoor volg je een hbo-opleiding en sta je ingeschreven in het
              Kwaliteitsregister Paramedici.
            </p>

            <MobielInklap className="mt-6" label="Lees waarom dat uitmaakt">
              <ul className="space-y-2.5">
                {EERLIJK_ADVIES_PUNTEN.map((punt) => (
                  <li
                    key={punt.titel}
                    className="flex gap-3 rounded-[var(--r-sm)] bg-[var(--g-050)] px-4 py-3.5"
                  >
                    <span
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-[var(--r-pill)] bg-[var(--g-500)]"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="block text-[15px] font-medium leading-6 text-[var(--t-strong)]">
                        {punt.titel}
                      </strong>
                      <span className="mt-0.5 block text-sm leading-6 text-[var(--t-body)]">
                        {punt.tekst}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </MobielInklap>

            <Button href="/intake" variant="secundair" className="mt-7">
              Zo werkt een eerste afspraak
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        {/* Het blad stond hier rechtsboven en is weg. Deze sectie heeft er geen ruimte
            voor: de kop loopt nu over de volle kolombreedte, en dan wordt een merkteken in
            de hoek geen accent maar een obstakel. */}
        <div className="relative mx-auto">
          {/* De kop stond op twee regels omdat de kolom te smal was (.72 tegen 1.28) en
              hij brak op "meebeweegt". Nu 1.05 tegen 0.95, en `text-nowrap` op groote
              schermen zodat hij ook echt op één regel blijft in plaats van net wel of net
              niet te passen.

              De alinea staat op `items-baseline`, dus hij begint op dezelfde basislijn als
              de kop in plaats van eronder uit te zakken. */}
          {/* Een rij en geen raster.

              Met vaste kolombreedtes moest de kop in een cel passen die smaller was dan de
              zin zelf, dus hij brak of hij liep over de rand. Nu pakt de kop zijn eigen
              breedte en krijgt de alinea wat overblijft.

              `items-end` zet de onderkanten gelijk, waardoor de laatste regel van de alinea
              op de basislijn van de kop staat. Dat is wat je bedoelt met op dezelfde regel:
              niet dat ze even hoog beginnen, maar dat ze samen één regel vormen. */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="shrink-0">
              <Label>Het traject</Label>
              <h2 className="diba-display-m mt-4 lg:whitespace-nowrap">
                Hoeveel afspraken je nodig hebt.
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Dat verschilt per klacht en per behandeling. Tijdens de intake
              hoor je wat er in jouw geval nodig is.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            {/* Yasin, 10 september 2026: "dat blok mag er op mobiel uit, ik zie geen
                toegevoegde waarde." Het vertelt welke assen de meting leest, en dat staat
                op /huidanalyse en in het huidprofiel uitgebreider. Op een breed scherm
                staat het naast het andere blok en kost het niets; op een telefoon is het
                een scherm scrollen voor iets wat verderop beter staat. */}
            <div className="overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 max-lg:hidden sm:p-10">
              <div className="flex items-center justify-between">
                <span className="diba-label rounded-[var(--r-pill)] bg-white px-4 py-2 text-[var(--g-700)]">
                  Mijn Diba
                </span>
                <DibaIcon variant="groen" size={38} />
              </div>
              <h3 className="diba-display-s mt-16 max-w-lg">
                Wat we
                <br />
                vastleggen.
              </h3>
              {/* Hier stonden drie verzonnen cijfers: "Hydratatie +18%" met een balkje
                  op tweeënzeventig procent. Mooi, en het betekende niets — het getal kwam
                  nergens vandaan en het portaal waar het uit zou moeten komen bestaat nog
                  niet. Op een site die belooft dat er echt gemeten wordt is dat de ene
                  plek waar je geen cijfer mag verzinnen.

                  Wat er nu staat is wel waar: de assen die de scanner leest, en waarom
                  twee metingen naast elkaar iets zeggen. Geen getallen dus, want die zijn
                  van jou en die krijg je in de kliniek. */}
              <MobielInklap
                className="mt-8 sm:mt-12"
                label="Bekijk de drie stappen"
              >
                <ul className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Pigment",
                      zin: "Onder UV-licht wordt pigment zichtbaar dat je zelf niet ziet.",
                    },
                    {
                      label: "Roodheid",
                      zin: "We leggen vast waar de roodheid zit en hoe fel die nu is.",
                    },
                    {
                      label: "Textuur",
                      zin: "Hoe glad of oneffen je huid is, en waar dat het meest opvalt.",
                    },
                  ].map((as) => (
                    <li
                      key={as.label}
                      className="rounded-[var(--r-sm)] bg-white p-4"
                    >
                      <span className="diba-label text-[var(--t-muted)]">
                        {as.label}
                      </span>
                      <span className="mt-3 block text-[13px] leading-6 text-[var(--t-body)]">
                        {as.zin}
                      </span>
                    </li>
                  ))}
                </ul>
              </MobielInklap>
            </div>
            <div className="relative min-h-[410px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-300)]">
              <Image
                src={FIGMA_TRAJECT_TESTIMONIAL.src}
                alt={FIGMA_TRAJECT_TESTIMONIAL.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[center_30%]"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(67,79,58,.82))]"
                aria-hidden="true"
              />
              <blockquote className="absolute bottom-7 left-7 right-7 max-w-md text-2xl leading-[1.15] tracking-[-.04em] text-white sm:text-3xl">
                “Ze namen de tijd om te kijken, en ik hoorde precies wat er wel
                en niet kon.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <div>
            <Label>In de kliniek</Label>
            <h2 className="diba-display-m mt-4">
              Wat je van een afspraak kunt verwachten.
            </h2>
          </div>
          {/* De regel "je leest hier wat je voor de afspraak moet weten" stond hiernaast en
              is eruit (Yasin, 11 september 2026): hij zei wat de drie kaarten eronder zelf
              al zeggen. Het inklapblok eromheen is ook weg; deze sectie staat nu open. */}
          <div className="mt-8 sm:mt-12">
            <div className="grid gap-4 md:grid-cols-[.75fr_1.25fr_.75fr]">
              <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-6 md:min-h-[300px] md:p-7">
                <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-white text-[var(--g-500)]">
                  <Pulse size={18} />
                </span>
                <h3 className="diba-card-title-lg mt-6 md:mt-28">
                  Ervaren behandelaars
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                  We werken sinds 2017 en hebben ruim 55.000 behandelingen
                  gedaan. Die ervaring hoor je terug in het advies dat je
                  krijgt.
                </p>
                <Link
                  href="#vragen"
                  className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
                >
                  Veelgestelde vragen
                  <ArrowUpRight size={13} />
                </Link>
              </div>
              {/* Een vlak en geen foto.

                Hier stond een opname van twee collega's met een leeslaag eroverheen. Die
                foto had de leeslaag nodig om de twee regels leesbaar te houden, en daarmee
                was hij half weggewerkt: te donker om als foto te tellen, te aanwezig om
                rustig te zijn. Twee halve dingen in één vlak.

                Nu een egaal groen vlak met het blad rechtsboven, zoals het eerder was. Het
                merkteken heeft hier wel ruimte, want er staat niets achter dat eronder
                lijdt. De foto's staan elders op de pagina, waar ze foto's mogen zijn. */}
              <div className="relative min-h-[240px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-700)] md:min-h-[300px]">
                <FigmaSoftAccent variant="clinic" className="z-10" />
                <p className="diba-label absolute left-7 top-7 z-10 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
                  Diba Clinics
                </p>
                <p className="diba-display-s absolute bottom-8 left-7 z-10 max-w-[12ch] text-[var(--on-dark)]">
                  Je vindt ons in{" "}
                  <span className="diba-accent-on-dark">Rotterdam</span>
                </p>
                <Link
                  href="/contact"
                  className="absolute bottom-8 right-8 z-10 grid h-12 w-12 place-items-center rounded-[var(--r-pill)] border border-white/50 text-white transition hover:bg-white/10"
                  aria-label="Contact en route"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
              <div className="rounded-[var(--r-lg)] bg-white p-6 md:min-h-[300px] md:p-7">
                {/* Een vinkje en geen sprankeling (Yasin, 11 september 2026). Dit vak gaat
                    over wat je vooraf te horen krijgt; een vinkje zegt "afgesproken", een
                    sterretje zegt "magie". */}
                <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-500)]">
                  <Vinkje size={18} />
                </span>
                <h3 className="diba-card-title-lg mt-6 md:mt-28">
                  Een resultaat met een verwachting
                </h3>
                {/* Rojda, 7 september 2026: niet "hoeveel afspraken dat vraagt", want hoeveel
                  behandelingen er echt nodig zijn weet niemand vooraf. Wat wel vooraf
                  gezegd kan worden: wat je kunt verwachten en wat het kost. */}
                <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                  Je hoort vooraf wat je van de behandeling kunt verwachten en
                  welke kosten daarbij horen. Alle tarieven vind je transparant
                  op deze site.
                </p>
                <Link
                  href="/tarieven"
                  className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
                >
                  Bekijk tarieven
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FigmaKennisbankSection />

      {/* Het cijfer stond alleen in de topbalk, in zes punts naast de taalkiezer.
          Hier staat het op formaat, met de reviews die langsschuiven en een ingang
          naar de volledige lijst. */}
      <Reviewslider />

      <section className="bg-[var(--g-025)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Label>Goed om te weten</Label>
            <h2 className="diba-display-m mt-4" id="vragen">
              Wat mensen het vaakst vragen
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-[var(--t-body)]">
              Dit zijn de vragen die het vaakst gesteld worden voordat iemand
              een afspraak maakt. Staat die van jou er niet bij,{" "}
              <BelOfAppInline />.
            </p>
          </div>
          <div className="space-y-2">
            {/* Dezelfde vorm als elke andere uitklapvraag op de site: een wit vak op een
                  zachte ondergrond, opschrift op zestien pixels, tweeënzeventig pixels hoog
                  als hij dicht is. Yasin, 10 september 2026: "het moet overal gewoon
                  hetzelfde zijn." Hier stonden regels met haarlijnen en een opschrift van
                  twintig, dat op een telefoon over twee regels brak. */}
            {HOME_FAQ_ITEMS.map((item, i) => (
              <details
                key={item.id}
                open={i === 0}
                className="group rounded-[var(--r-md)] bg-white px-6 py-3"
              >
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-[16px] leading-[1.4] font-medium">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]">
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M2 9h14" />
                      <path d="M9 2v14" className="group-open:opacity-0" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-xl pt-4 pb-2 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="boeken"
        /* `mt` erbij: dit vlak had alleen een ondermarge en plakte daardoor tegen de
           sectie erboven (Yasin, 11 september 2026). De maat loopt mee met de zijmarge,
           zodat het blok aan alle kanten evenveel lucht heeft. */
        className="mx-5 mt-5 mb-5 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-10 text-[var(--on-dark)] sm:mx-9 sm:mt-8 sm:mb-8 sm:px-12 sm:py-14 lg:mx-[7.5vw] lg:mt-12 lg:mb-12 lg:px-16 lg:py-20"
      >
        {/* 1.35 en niet 1.2: bij die verdeling paste "Wij kijken met je mee." net niet
            in de kolom en brak de kop naar drie regels, ondanks de harde afbreking. */}
        <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <FigmaSoftAccent variant="cta" />
          <div className="relative">
            <Label opDonker>Jouw eerste afspraak</Label>
            <h2 className="diba-display-l mt-5">
              Plan een intake
              <br />
              bij ons in Rotterdam.
            </h2>
          </div>
          <div className="relative flex flex-col justify-end">
            {/* De twee manieren om te beginnen als je nog niet weet wat je nodig hebt,
                met de tijden zoals ze in de agenda staan (Yasin, 10 september 2026). */}
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Wil je alleen advies, dan duurt de afspraak dertig minuten en kost
              hij 50 euro. Boek je een behandeling op advies, dan reserveren we
              twee uur als je nieuw bent en een uur als je al klant bent; het
              bedrag van de intake vervalt zodra we behandelen.
            </p>
            <Button
              href="/afspraak"
              variant="primair-op-donker"
              className="mt-8 w-fit"
            >
              Afspraak maken
            </Button>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label diba-label-on-dark mt-4 underline underline-offset-4"
            >
              Nog niet zeker? Stel je vraag
            </a>
          </div>
        </div>
      </section>

      {/* De gedeelde voettekst.

          Hier stond een eigen kopie: dezelfde platte rij links die ook in SiteFooter
          stond, apart onderhouden. Toen die voettekst vier kolommen kreeg, veranderde
          de homepage niet mee — en dat is precies de pagina waar de meeste mensen
          binnenkomen. Eén voettekst voor de hele site, dus. */}
      <SiteFooter />
    </main>
  );
}
