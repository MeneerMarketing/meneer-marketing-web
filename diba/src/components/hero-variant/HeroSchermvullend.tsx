import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import HeroVideo from "@/components/home/HeroVideo";
import { FIGMA_HOME_PORTRAIT_WIDE } from "@/data/figma-home-images";
import {
  FIGMA_HERO_PORTRAIT,
  FIGMA_HERO_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";
import { DIBA_PROOF } from "@/lib/site";
import Button from "@/components/ui/Button";
import Cijferstrook from "@/components/home/Cijferstrook";

/**
 * De schermvullende hero: video van rand tot rand, alles erover.
 *
 * WAT YASIN VROEG, OP 11 SEPTEMBER 2026.
 *
 * "Een transparante header en topbalk, de video op volle hoogte in de hero, onderin een
 * verloop van ongeveer twintig procent in het donkergroen, en daar de titel met afspraak
 * maken. De vier cijfers zet je onder de hero."
 *
 * WAT DAT ANDERS MAAKT DAN DE VORIGE VARIANT.
 *
 * Die zette het beeld in een vlak met ronde hoeken en witruimte eromheen, met een balk op
 * zacht groen erboven. Twee dingen die je hier niet hebt: het beeld raakt alle vier de
 * randen, en er staat niets boven het beeld. De balk en de navigatie zweven erin.
 *
 * WAAROM HET VERLOOP GEEN SFEER IS.
 *
 * Wit op een videobeeld haalt zonder verloop nooit AA, en een videoloop is per beeldje
 * anders licht: je kunt niet op de uitsnede vertrouwen zoals bij een foto. Het verloop is
 * daarom onderaan bijna dicht (`--g-900` zonder doorzicht) en dooft uit over ruim de helft
 * van de hoogte. Wat je ziet is een groene onderrand van ongeveer een vijfde; de rest van
 * het verloop doet het werk dat je niet ziet, namelijk voorkomen dat er een rand ontstaat
 * waar het uitdooft.
 *
 * Bovenaan een tweede, veel lichtere aanzet. Die is er alleen voor de balk en de
 * navigatie, die in wit over het beeld staan.
 *
 * HOOGTE IN SVH.
 *
 * Op iOS is `100vh` groter dan wat je ziet, want de adresbalk telt niet mee. Met `vh` valt
 * de kop dus onder die balk. `svh` is de kleinste stand, en dat is de enige waarde waarbij
 * de knop altijd in beeld staat.
 */

export default function HeroSchermvullend() {
  return (
    <>
      <section
        id="top"
        /* `data-hero`: zolang dit vlak in beeld staat blijft de bladknop rechtsonder weg
           (Yasin, 11 september 2026: "die wil ik niet zien in de hero, pas als je de hero
           voorbij bent"). Zie HuidprofielKnop. */
        data-hero
        className="relative min-h-svh w-full overflow-hidden bg-[var(--g-800)]"
      >
        {/* Twee opnames. Op een telefoon de staande van de homepage (Yasin: "je hebt
            opeens een andere video dan die in de hero op home"), vanaf 768 de liggende, want
            576 bij 1024 over een vlak van 1440 bij 900 is drie keer opblazen en tachtig
            procent afsnijden. De liggende is opnieuw gecodeerd op 1440 breed: van 24,7 naar
            5,8 megabyte, want een hero die tien seconden laadt is geen hero.

            Dezelfde component draagt beide, dus de pauzeknop komt mee: bewegend beeld dat je
            niet kunt stoppen is voor sommige mensen misselijkmakend.

            Zonder pauzeknop, op verzoek (Yasin, 11 september 2026, nadat ik hem op de
            regel had gewezen). Dat wijkt af van §9 en van WCAG 2.2.2; zie de toelichting
            onderaan dit bestand. `prefers-reduced-motion` blijft wel werken: wie dat aan
            heeft staan krijgt de stilstaande shootfoto.

            Zolang de video laadt staat de shootfoto er als poster, en wie om minder
            beweging vraagt krijgt die foto met een afspeelknop erover. */}
        <div className="absolute inset-0">
          <HeroVideo
            bestand="/videos/home-hero.mp4"
            bestandBreed="/videos/hero-breed.mp4"
            poster={FIGMA_HERO_PORTRAIT}
            posterBreed={FIGMA_HOME_PORTRAIT_WIDE.src}
            beschrijving={FIGMA_HERO_PORTRAIT_ALT}
            eigenKnop={false}
          />
        </div>

        {/* Bovenaan: alleen genoeg om de witte balk leesbaar te houden. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--g-900)]/55 to-transparent"
        />

        {/* Onderaan: de groene voet waar de kop in staat. Dicht tot een vijfde, daarna
            uitdovend tot ruim over de helft zodat er geen zichtbare rand valt. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--g-800)] from-0% via-[var(--g-800)]/94 via-42% to-transparent to-100%"
        />

        {/* Alles wat je leest ligt erboven, in één kolom van boven naar onder. `mt-auto`
            duwt de kop naar de voet, zodat hij in het dichte deel van het verloop staat. */}
        <div className="relative z-10 flex min-h-svh flex-col">
          <Topbalk opBeeld />

          {/* De navigatie staat in deze stand op `absolute top-0`, want in de vorige
              variant zweeft ze binnen het beeldvlak. Hier staat er een balk boven, dus ze
              krijgt een eigen doos van de hoogte die ze inneemt; anders klimt ze over de
              balk heen. */}
          <div className="relative h-[var(--nav-h)] shrink-0">
            <HoofdNav opBeeld />
          </div>

          <div className="mt-auto px-5 pb-10 sm:px-9 sm:pb-14 lg:px-[7.5vw] lg:pb-20">
            {/* Kop en zegel op één regel, het zegel rechts en verticaal in het midden van
                de kop (Yasin, 11 september 2026). `items-center` op de rij doet dat: de kop
                is twee regels hoog, het zegel staat op de helft daarvan.

                Zonder `justify-between`: het zegel staat direct naast de kop en niet tegen
                de rechtermarge (Yasin, 11 september 2026: "meer naar links, tegen de titel
                aan"). De kop breekt zelf af met een `<br />`, dus hij is precies zo breed
                als zijn langste regel en het zegel sluit daarop aan. `shrink-0` houdt de
                cirkel rond als de kop breed wordt. */}
            <div className="flex items-center gap-4 sm:gap-6">
              <h1 className="diba-display-l text-[var(--on-dark)] max-[359px]:text-[2.25rem]">
                Dé huidkliniek
                <br />
                <span className="diba-accent-on-dark">in Rotterdam</span>
              </h1>

              <span className="diba-label grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] text-center text-[10px] leading-4 text-[var(--on-dark-btn-text)] sm:h-24 sm:w-24 sm:text-[11px]">
                Sinds
                <br />
                {DIBA_PROOF.activeSince}
              </span>
            </div>

            {/* Eén regel, op elke maat (Yasin, 11 september 2026: "doe toch wel een korte,
                strakke, pakkende subtekst onder de titel"). Hier stond de opsomming van zes
                klachten in drie regels; dat is een inhoudsopgave en geen belofte. Dit is wat
                de kliniek anders doet dan de rest, in vier woorden, en het is de zin waar de
                hele site op gebouwd is.

                Niet "Eerst meten, dan pas behandelen": dat is precies het patroon dat de
                stijlgids verbiedt, twee halve zinnen als slogan, en de controle ving het
                meteen. Deze zegt hetzelfde als hele zin. */}
            <p className="mt-4 text-[17px] leading-8 text-[var(--on-dark-body)] sm:mt-5 sm:text-[19px]">
              Elke behandeling begint met een meting.
            </p>

            <div className="mt-7 diba-knoprij sm:mt-8">
              {/* Op een telefoon "Afspraak": gemeten heeft "Afspraak maken" met het
                  pijltje 192 pixels nodig en is een halve rij 169 breed op 390, dus stapelde
                  het opschrift over twee regels (Yasin, 11 september 2026). Het hele
                  opschrift staat onderaan het scherm al in de vaste actiebalk. */}
              <Button
                href="/afspraak"
                variant="primair-op-donker"
                kort="Afspraak"
              >
                Afspraak maken
              </Button>
              <Button
                href="/behandelingen"
                variant="secundair-op-donker"
                kort="Behandelingen"
              >
                Bekijk de behandelingen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* De vier cijfers staan onder de hero en niet erover (Yasin, 11 september 2026).
          Erover betekende een kaart die half over de rand hangt, en dat kan alleen als de
          hero een eigen ondermarge houdt; deze vult het scherm tot de rand. */}
      <Cijferstrook />
    </>
  );
}
