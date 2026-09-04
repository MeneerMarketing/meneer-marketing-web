import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReviewsBijOnderwerp from "@/components/reviews/ReviewsBijOnderwerp";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  HuidanalyseAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import ProofBar from "@/components/ui/ProofBar";
import Onderarmtest from "@/components/veroudering/Onderarmtest";
import WatBegintWanneer from "@/components/veroudering/WatBegintWanneer";
import { FIGMA_INTENT_VEROUDERING } from "@/data/figma-home-images";
import {
  VEROUDERING_FAQ,
  VEROUDERING_SOORTEN,
  VEROUDERING_WEL_NIET,
} from "@/data/veroudering";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Huidveroudering — vijfde eigen pagina, met een eigen uitblinker.
 *
 * De kernvraag per pagina blijft verschillen. Acne: waar. Pigment: wanneer in het jaar.
 * Rosacea: wat zet het aan. Littekens: hoe oud is het. Hier: is dit tijd of is dit zon.
 *
 * Dat onderscheid is de hele pagina. Het deel dat door tijd komt heeft geen knop, het
 * deel dat door zon komt wel, en bijna niemand vertelt je welk deel je in de spiegel
 * ziet. De onderarmtest maakt dat argument in één beweging, zonder één cijfer.
 *
 * Deze pagina zegt ook het duidelijkste "nee" van alle vijf: wij doen geen volume en
 * geen jaren terug. Dat is geen bescheidenheid maar de grens van een huidkliniek.
 *
 * Twee donkergroene vlakken, niet meer (§5). Geen italic accentwoorden, geen leeftijd
 * als belofte. Staat op noindex tot Rojda en de prijzen er zijn.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/huidveroudering",
  titel: "Huidveroudering behandelen in Rotterdam",
  omschrijving:
    "Huidveroudering behandelen met peelings, needling en laser. Het meeste komt door zon en niet door leeftijd, en juist dat is aan te pakken.",
});

const PAD = "/huidproblemen/huidveroudering";

const ANKERS = [
  { id: "tijd-of-zon", label: "Tijd of zon" },
  { id: "wanneer", label: "Wat begint wanneer" },
  { id: "welke", label: "Wat je ziet" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = VEROUDERING_SOORTEN.map((s) => ({
  id: s.id,
  naam: s.naam,
  klanttaal: s.klanttaal,
  vakterm: s.vakterm,
  velden: [
    ["Wat je ziet", s.watJeZiet],
    ["Wat het betekent", s.watHetBetekent],
    ["Wat wij doen", s.aanpak],
  ] as const,
  uitgelicht: {
    label: "Wat mensen hier vaak verkeerd hebben",
    tekst: s.verwarring,
  },
}));

export default function HuidverouderingPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Huidveroudering", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Huidveroudering</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Huidveroudering
              <br />
              <span className="diba-accent">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het grootste deel van wat je huid ouder maakt, komt door zonlicht
              en niet door je leeftijd. Juist dat deel is goed te behandelen. De
              huidtherapeut kiest uit medische peelings, microneedling met de{" "}
              <Link
                href="/behandelingen/skinpen"
                className="font-medium text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                SkinPen
              </Link>
              , fractionele laser op de{" "}
              <Link
                href="/apparatuur/fotona"
                className="font-medium text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Fotona
              </Link>
              , IPL bij pigment en vaatjes, en mesotherapie.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat het bij jou wordt hangt af van je huid en van wat er precies
              speelt; meestal is het een combinatie over een aantal maanden.
              Tijdens de intake stelt de huidtherapeut vast wat door de zon komt
              en wat bij je leeftijd hoort.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#tijd-of-zon">Doe de onderarmtest</Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src={FIGMA_INTENT_VEROUDERING.src}
              alt={FIGMA_INTENT_VEROUDERING.alt}
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De onderarmtest: de uitblinker ─────────────────────────────── */}
      <section
        id="tijd-of-zon"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            // Twee gelijke helften eronder, dus de introzin volgt die indeling.
            raster="gelijk"
            kop="Zon of"
            accent="leeftijd"
            intro="De behandelaar vergelijkt een stuk huid dat weinig zon zag met je gezicht. Dat verschil laat zien welk deel door zonschade komt."
          />
          <Onderarmtest />
        </div>
      </section>

      {/* ── Wat begint wanneer ─────────────────────────────────────────── */}
      <section
        id="wanneer"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vijf sporen"
            kop="Wat er bij veroudering"
            accent="in je huid verandert"
            intro="Huidveroudering is geen schakelaar die op een leeftijd omgaat. Er lopen meerdere dingen naast elkaar, ze beginnen niet tegelijk en ze hebben niet dezelfde oorzaak. Kies een levensfase en kijk wat er dan speelt."
          />
          <WatBegintWanneer />
        </div>
      </section>

      {/* ── Wat je ziet ────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Herkenning"
            kop="Wat mensen"
            accent="veroudering noemen"
            intro="Drie ervan behandelen we. Bij de vierde zeggen we nee, en dat staat er met dezelfde nadruk bij. Kies wat het dichtst bij jou komt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=huidveroudering&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je? Dan kijken we er samen naar."
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-white p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Gaat het je vooral om vlekken en niet om lijnen? Dan begint het
              verhaal ergens anders, want daar speelt het seizoen een grote rol
              in wanneer je moet beginnen.
            </p>
            <Link
              href="/huidproblemen/pigmentvlekken"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de pigmentpagina
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={VEROUDERING_WEL_NIET.wel}
        niet={VEROUDERING_WEL_NIET.niet}
        intro="De eerste regel links is de goedkoopste behandeling op deze hele site, en de enige die aan alle vijf de sporen tegelijk werkt."
      />

      <HuidanalyseAssen
        kop="Veroudering vraagt om een beginpunt."
        alineas={[
          "Dit is het onderwerp waarbij je oog je het hardst voor de gek houdt. De verandering gaat over jaren en je kijkt elke dag in dezelfde spiegel, dus je ziet het verschil niet, in geen van beide richtingen.",
          "We leggen de beginsituatie vast, zodat we na verloop van tijd beter kunnen beoordelen of er iets is veranderd.",
        ]}
        assen={[
          ["Kleur", "Vlekken, egaliteit en verwijde vaatjes"],
          ["Structuur", "Hoe de huid licht weerkaatst en aanvoelt"],
          ["Lijnen", "Waar ze staan en of ze in rust blijven"],
        ]}
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/huidveroudering" />

      {/* Wat anderen over dit onderwerp schreven. Het onderdeel rendert niets
          als er te weinig reviews over zijn; zie het component. */}
      <ReviewsBijOnderwerp
        onderwerp="huidveroudering"
        intro="Deze komen uit Salonized en zijn niet door ons uitgekozen op inhoud. Ze gaan over trajecten die maanden lopen, dus let op wat er over het verloop wordt gezegd."
        achtergrond="zacht"
      />

      <PillarFaq items={VEROUDERING_FAQ} onderwerp="huidveroudering" />

      <PillarCta
        kop="Begin bij weten"
        accent="wat er speelt."
        tekst="We meten kleur, structuur en lijnen, en vertellen je welk deel door zon komt en welk deel niet. Daarna beslis jij of je iets wilt doen, en wat."
        topic="huidveroudering"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
