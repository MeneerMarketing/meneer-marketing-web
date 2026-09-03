"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FigmaKennisbankSection from "@/components/figma/FigmaKennisbankSection";
import HeroVariant from "@/components/hero-variant/HeroVariant";
import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import FigmaVoorJouSection from "@/components/figma/FigmaVoorJouSection";
import Button from "@/components/ui/Button";
import DibaIcon from "@/components/ui/DibaIcon";
import {
  ArrowUpRight,
  Close,
  PlusMinus,
  Pulse,
  Sparkle,
} from "@/components/ui/Icon";
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
  FIGMA_HERO_PORTRAIT,
  FIGMA_HERO_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";
import { DIBA_HOME_PROOF_ITEMS, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De drie punten onder "Eerlijk advies". Concepttekst, overgenomen uit het ontwerp.
 *
 * Eén ding bewust anders dan het ontwerp: daar staat bij kosten "Geen verrassingen
 * achteraf — tarieven staan openbaar." Gedachtestreepjes zijn verboden in copy (§10),
 * dus dat is een punt geworden.
 */
const EERLIJK_ADVIES_PUNTEN = [
  {
    titel: "Altijd een doel",
    tekst:
      "We beginnen met een huidmeting en een plan dat je mee naar huis krijgt.",
  },
  {
    titel: "Vooraf de prijs",
    tekst:
      "Je weet wat het kost voordat je gaat liggen. Alle tarieven staan online.",
  },
  {
    titel: "Ook het rustige advies",
    tekst: "Heeft je huid eerst rust nodig, dan hoor je dat van ons.",
  },
] as const;

/**
 * De homepage.
 *
 * `heroVariant` wisselt alleen het bovenste blok om. /  draait hem uit en
 * /home-variant draait hem aan, zodat die twee routes verder letterlijk dezelfde
 * pagina zijn en een vergelijking dus over de hero gaat en nergens anders over.
 */
export default function FigmaHomeApp({
  heroVariant = false,
}: {
  heroVariant?: boolean;
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
      {/* De hero is het enige verschil tussen deze pagina en /home-variant.

          Die route liet eerst alleen de hero zien met een toelichting eronder. Dat is
          geen vergelijking: je zag twee heroes maar maar één pagina, en juist hoe een
          hero doorloopt naar de rest bepaalt of hij werkt. Nu draaien beide routes deze
          hele component en verschilt alleen dit blok.

          HeroVariant brengt zijn eigen Topbalk en HoofdNav mee, want in dat ontwerp
          zweven die binnen het beeld in plaats van erboven te staan. Vandaar dat ze in
          de andere tak apart staan en hier niet. */}
      {heroVariant ? (
        <HeroVariant />
      ) : (
        <>
          <Topbalk />
          <HoofdNav />

          <section
            id="top"
            className="relative mx-auto px-5 sm:px-9 lg:px-[7.5vw]"
          >
            <div className="grid min-h-[730px] lg:grid-cols-[1.18fr_.82fr]">
              {/* De linkerkolom is de binnenkomer. Eén blok, verticaal gecentreerd tegenover
                  het beeld — geen `justify-between` meer. Dat duwde de slogan tegen de
                  bovenrand en de knoppen tegen de onderrand, met gaten ertussen die per
                  schermhoogte verschilden; daardoor stond die eerste regel los te zweven.

                  Ook nog maar één introregel. Er stonden er twee boven elkaar ("Trust the
                  green touch." én "Huidzorg die klopt"), die om dezelfde plek vochten. De
                  groene punt is meeverhuisd naar de overgebleven regel: dat is de Green
                  Touch als merkteken, niet als losse zin. De slogan zelf staat al in de
                  topbalk en in de footer. */}
              <div className="flex flex-col justify-center py-16 lg:py-24">
                {/* max-w in ch: de kop breekt op de bedoelde plek en raakt de foto nooit. */}
                <h1 className="diba-display-xl mt-6 max-w-[13ch]">
                  Huidkliniek
                  <br />
                  <span className="diba-accent">in Rotterdam</span>
                </h1>

                <p className="mt-7 max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
                  Kom met je klacht, dan zoeken wij de behandeling erbij. We
                  luisteren, meten je huid en leggen uit wat er in jouw geval
                  mogelijk is en wat dat oplevert. Alle prijzen staan vooraf
                  online.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Button href="/intake">Plan een eerste afspraak</Button>
                  <Button href="/behandelingen" variant="ghost">
                    Bekijk de behandelingen
                  </Button>
                </div>
              </div>

              <div className="relative min-h-[440px] overflow-hidden rounded-bl-[9rem] bg-[var(--g-200)] lg:rounded-bl-[14rem]">
                <Image
                  src={FIGMA_HERO_PORTRAIT}
                  alt={FIGMA_HERO_PORTRAIT_ALT}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
                {/* Geen groene waas meer over de foto.

                    Hier lag een verloop van mintgroen naar donkergroen over het hele beeld.
                    Het trok de huid van de behandelaar en van de client naar olijf, en dat
                    is bij een huidkliniek nogal wat: de kleur van iemands huid is hier het
                    onderwerp. Beide chips dragen bovendien hun eigen vlak, dus er was ook
                    niets dat die laag nodig had.

                    Wat er nu staat is een vignet en geen kleur: neutraal donker, alleen
                    onderin, net genoeg om de ronde hoek diepte te geven. Boven de helft van
                    het beeld gebeurt er niets. */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/30 via-transparent to-transparent"
                  aria-hidden="true"
                />
                {/* Stond op "Huidzorg, zonder hype". Sinds de kop "Geen hypes. Wel
                    huidzorg." is geworden, stonden dezelfde twee woorden twee keer naast
                    elkaar in beeld. Dit label zegt nu waar de foto over gaat in plaats van
                    de kop na te praten. */}
                <span className="diba-label absolute left-7 top-7 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
                  Rotterdam
                </span>
                <span className="diba-label absolute bottom-7 right-7 grid h-24 w-24 place-items-center rounded-[var(--r-pill)] bg-[var(--g-700)] text-center leading-4 text-white">
                  Eerlijk
                  <br />
                  advies
                </span>
              </div>
            </div>
          </section>
        </>
      )}
      <ProofBar items={DIBA_HOME_PROOF_ITEMS} />

      <FigmaVoorJouSection />

      <section
        id="huidscan"
        className="bg-[var(--g-700)] px-5 py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Label opDonker>De Diba huidscan</Label>
            <h2 className="diba-display-l mt-5">
              Zo verloopt
              <br />
              <span className="diba-accent-on-dark">een traject bij ons</span>
            </h2>
            <p className="mt-7 max-w-md text-[16px] leading-7 text-[var(--on-dark-body)]">
              Met de EVE-M huidanalyse maken we een objectieve nulmeting. Zo
              zien we wat jouw huid nodig heeft en volgen we jouw voortgang in
              beeld.
            </p>
            {/* items-center en niet items-start. De wikkel is `w-fit`, dus precies zo
                breed als de knop; met links uitlijnen begon de link daaronder aan de
                linkerrand van die knop in plaats van eronder te staan. Nu hangt hij
                gecentreerd onder de knop, en dat blijft kloppen als de knoptekst verandert. */}
            <div className="mt-9 flex w-fit flex-col items-center gap-4">
              {/* De mini-scan in de kaart hiernaast is de primaire actie van deze
                  sectie. Deze knop is de uitleg-route en blijft dus secundair. */}
              <Button
                variant="secundair-op-donker"
                onClick={() => setScanOpen(true)}
              >
                Hoe werkt de huidscan?
              </Button>
              <Link
                href="/behandelingen/huidanalyse"
                className="diba-label diba-label-on-dark inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                Meer over De Nulmeting
                <ArrowUpRight size={13} />
              </Link>
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
        <div className="mx-auto mt-12 flex flex-wrap items-center justify-between gap-5 rounded-[var(--r-lg)] bg-white/10 px-7 py-6 sm:px-10 lg:mt-16">
          <div className="flex items-center gap-5">
            <DibaIcon variant="wit" size={52} />
            <p className="max-w-xl text-sm leading-6 text-[var(--on-dark-body)]">
              <strong className="font-medium text-[var(--on-dark)]">
                Elke huid wordt serieus genomen.
              </strong>{" "}
              Ook als je nog niet weet waar je moet beginnen.
            </p>
          </div>
          <a
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="diba-label inline-flex shrink-0 items-center gap-1.5 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-5 py-3 text-[var(--on-dark-btn-text)] transition hover:bg-white"
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
              EVE-M huidanalyse
            </span>
            <h3 id="scan-dialog-title" className="diba-card-title-lg mt-6">
              Jouw huid in kaart.
            </h3>
            <p className="mt-5 max-w-md leading-7 text-[var(--t-body)]">
              Tijdens je intake bekijken we onder meer hydratatie, pigment,
              poriën en huidstructuur. De huidscan geeft ons een objectieve
              start. Jouw wensen blijven altijd leidend.
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
        className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
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
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Het groene vlak eronder en de multiply-modus zijn allebei weg. Samen
              verfden ze de foto egaal groen; wat overbleef was een silhouet, geen opname. */}
          <div className="relative min-h-[320px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] lg:min-h-[440px]">
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
              Diba Clinics · Rotterdam
            </span>
          </div>

          <div className="rounded-[var(--r-md)] bg-white p-7 sm:p-9 lg:p-10">
            <Label>Eerlijk advies</Label>
            <h2 className="diba-card-title-lg mt-4">
              We zeggen je eerlijk wat je huid nu nodig heeft.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Soms is dat een behandeling, soms is dat tijd. Elke behandeling
              heeft hier een reden die je zelf kunt navertellen: passend bij
              jouw huid, jouw doel en jouw veiligheid.
            </p>

            <ul className="mt-6 space-y-2.5">
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

            <Button href="/intake" variant="secundair" className="mt-7">
              Zo werkt een eerste afspraak
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
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
              <Label>Niet zomaar een afspraak</Label>
              <h2 className="diba-display-m mt-4 lg:whitespace-nowrap">
                Een traject dat met je meebeweegt.
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Een mooie huid is zelden één moment. Daarom bekijken we samen wat
              er speelt, wat haalbaar is en hoe we jouw voortgang kunnen volgen,
              zonder dat je vastzit aan een pakket.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <div className="overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="diba-label rounded-[var(--r-pill)] bg-white px-4 py-2 text-[var(--g-700)]">
                  Mijn Diba
                </span>
                <DibaIcon variant="groen" size={38} />
              </div>
              <h3 className="diba-display-s mt-16 max-w-lg">
                Zie wat je huid
                <br />
                je vertelt.
              </h3>
              {/* Hier stonden drie verzonnen cijfers: "Hydratatie +18%" met een balkje
                  op tweeënzeventig procent. Mooi, en het betekende niets — het getal kwam
                  nergens vandaan en het portaal waar het uit zou moeten komen bestaat nog
                  niet. Op een site die belooft dat er echt gemeten wordt is dat de ene
                  plek waar je geen cijfer mag verzinnen.

                  Wat er nu staat is wel waar: de assen die de scanner leest, en waarom
                  twee metingen naast elkaar iets zeggen. Geen getallen dus, want die zijn
                  van jou en die krijg je in de kliniek. */}
              <ul className="mt-12 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Pigment",
                    zin: "Ook wat onder UV zichtbaar wordt en dieper zit.",
                  },
                  {
                    label: "Roodheid",
                    zin: "Waar het zit, hoe fel, en of het meebeweegt.",
                  },
                  {
                    label: "Textuur",
                    zin: "Poriën, oneffenheden en hoe de huid het licht breekt.",
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
              <p className="mt-5 text-[13px] leading-6 text-[var(--t-muted)]">
                Elke meting gaat onder hetzelfde licht en vanaf dezelfde
                afstand, zodat je die van vandaag naast die van acht weken
                geleden kunt leggen.
              </p>
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
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(25,82,46,.82))]"
                aria-hidden="true"
              />
              <blockquote className="absolute bottom-7 left-7 right-7 max-w-md text-2xl leading-[1.15] tracking-[-.04em] text-white sm:text-3xl">
                “Ik voelde me voor het eerst niet als een probleem dat opgelost
                moest worden.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>In de kliniek</Label>
              <h2 className="diba-display-m mt-4">
                Een groene pauze in je dag.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-7 text-[var(--t-body)]">
              Van de eerste kop thee tot je nazorg: we hebben aandacht voor de
              hele ervaring.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-[.75fr_1.25fr_.75fr]">
            <div className="min-h-[300px] rounded-[var(--r-lg)] bg-[var(--g-200)] p-7">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-white text-[var(--g-500)]">
                <Pulse size={18} />
              </span>
              <h3 className="diba-card-title-lg mt-28">
                Jij bepaalt wanneer we beginnen
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                Kies je het huidconsult, dan gaat het advies met de prijs erbij
                mee naar huis. Boek je een behandeling op advies, dan hoor je
                eerst wat we voorstellen en wat het kost, en pas daarna gaan we
                door.
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
            <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-700)]">
              <FigmaSoftAccent variant="clinic" className="z-10" />
              <p className="diba-label absolute left-7 top-7 z-10 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
                Diba Clinics
              </p>
              <p className="diba-card-title absolute bottom-7 left-7 z-10 text-[var(--on-dark)]">
                Je vindt ons in
                <br />
                Rotterdam.
              </p>
              <Link
                href="/contact"
                className="absolute bottom-8 right-8 z-10 grid h-12 w-12 place-items-center rounded-[var(--r-pill)] border border-white/50 text-white transition hover:bg-white/10"
                aria-label="Contact en route"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
            <div className="min-h-[300px] rounded-[var(--r-lg)] bg-white p-7">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-500)]">
                <Sparkle size={18} />
              </span>
              <h3 className="diba-card-title-lg mt-28">
                Je weet vooraf wat het kost
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                We vertellen welke behandelingen mogelijk zijn, wat ze kosten en
                wat je ervan kunt verwachten. Ook als het antwoord is dat
                afwachten verstandiger is.
              </p>
              <Link
                href="/prijzen"
                className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
              >
                Bekijk prijzen
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FigmaKennisbankSection />

      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
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
          <div className="border-t border-[var(--g-100)]">
            {HOME_FAQ_ITEMS.map((item) => (
              <details
                key={item.id}
                className="group border-b border-[var(--g-100)] py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)] transition group-open:rotate-180">
                    <PlusMinus size={16} />
                  </span>
                </summary>
                <p className="max-w-xl pt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="boeken"
        className="mx-5 mb-5 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20"
      >
        {/* 1.35 en niet 1.2: bij die verdeling paste "Wij kijken met je mee." net niet
            in de kolom en brak de kop naar drie regels, ondanks de harde afbreking. */}
        <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <FigmaSoftAccent variant="cta" />
          <div className="relative">
            <Label opDonker>Jouw eerste afspraak</Label>
            <h2 className="diba-display-l mt-5">
              Kom zoals je bent.
              <br />
              Wij kijken met je mee.
            </h2>
          </div>
          <div className="relative flex flex-col justify-end">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Plan een intake in onze kliniek in Rotterdam. We nemen de tijd
              voor jouw vragen, je huidmeting en een behandelvoorstel dat je
              zelf kunt navertellen.
            </p>
            <Button
              href="/intake"
              variant="primair-op-donker"
              className="mt-8 w-fit"
            >
              Plan een huidconsult
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
