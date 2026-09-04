import type { ContentFormatId } from "@/services/types";
import { getTemplateForFormat } from "@/lib/templates/registry";
import { DeRekening } from "@/components/templates/DeRekening";
import { MeneerZegt } from "@/components/templates/MeneerZegt";
import { MeneerFixt } from "@/components/templates/MeneerFixt";
import { MeneerMeter } from "@/components/templates/MeneerMeter";
import { MeneerOntleedt } from "@/components/templates/MeneerOntleedt";
import { DeOfferte } from "@/components/templates/DeOfferte";
import { BureauBingo } from "@/components/templates/BureauBingo";
import { CaseBuild } from "@/components/templates/CaseBuild";
import type {
  BureauBingoData,
  CaseBuildData,
  DeOfferteData,
  DeRekeningData,
  MeneerFixtData,
  MeneerMeterData,
  MeneerOntleedtData,
  MeneerZegtData,
} from "@/services/types";

interface TemplateRendererProps {
  formatId: ContentFormatId;
  templateData: Record<string, unknown>;
  slideIndex?: number;
}

export function TemplateRenderer({
  formatId,
  templateData,
  slideIndex = 0,
}: TemplateRendererProps) {
  if (!getTemplateForFormat(formatId)) {
    return (
      <div className="flex h-[1350px] w-[1080px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-2xl text-gray-500">
        Nog geen template voor {formatId}
      </div>
    );
  }

  switch (formatId) {
    case "DE_REKENING":
      return (
        <DeRekening
          data={templateData as unknown as DeRekeningData}
          slideIndex={slideIndex}
        />
      );
    case "MENEER_ZEGT":
      return (
        <MeneerZegt
          data={templateData as unknown as MeneerZegtData}
          slideIndex={slideIndex}
        />
      );
    case "MENEER_FIXT":
      return <MeneerFixt data={templateData as unknown as MeneerFixtData} />;
    case "MENEER_METER":
      return (
        <MeneerMeter
          data={templateData as unknown as MeneerMeterData}
          slideIndex={slideIndex}
        />
      );
    case "MENEER_ONTLEEDT":
      return (
        <MeneerOntleedt
          data={templateData as unknown as MeneerOntleedtData}
          slideIndex={slideIndex}
        />
      );
    case "DE_OFFERTE":
      return (
        <DeOfferte
          data={templateData as unknown as DeOfferteData}
          slideIndex={slideIndex}
        />
      );
    case "BUREAU_BINGO":
      return (
        <BureauBingo
          data={templateData as unknown as BureauBingoData}
          slideIndex={slideIndex}
        />
      );
    case "CASE_BUILD":
      return <CaseBuild data={templateData as unknown as CaseBuildData} />;
    default:
      return null;
  }
}

/** Echte voorbeeldcopy, geen invulplaatsen. Dit is wat er in de previews staat. */
export const DEMO_TEMPLATE_DATA: Partial<
  Record<ContentFormatId, Record<string, unknown>>
> = {
  DE_REKENING: {
    amount: "€840",
    period: "per maand",
    hook: "Deze knop kost je",
    problem: "Je belangrijkste knop staat onder de vouw, in dezelfde kleur als de rest.",
    why: "Bezoekers scannen het eerste scherm in ongeveer drie seconden. Wat ze daar niet zien, bestaat niet. Je betaalt wel voor het bezoek, maar je vraagt nergens om de klik.",
    calculation: [
      { label: "Bezoekers per maand", value: "2.400" },
      { label: "Klikt nu door", value: "1,4%" },
      { label: "Realistisch haalbaar", value: "3,2%" },
      { label: "Gemiddelde orderwaarde", value: "€78" },
    ],
    fix: "Knop boven de vouw, in je accentkleur, met een werkwoord erop. Eén knop, geen drie.",
    meneerNote: "Je hebt het verkeer al betaald. Zonde om het bij de deur te laten staan.",
  },
  MENEER_ZEGT: {
    everyoneSays: "Je moet iedere dag posten.",
    meneerSays: "Je moet iets posten dat iemand wil bekijken.",
    explanation:
      "Drie keer per week iets goeds verslaat zeven keer per week iets middelmatigs. Het algoritme meet of mensen blijven kijken, niet of jij hard hebt gewerkt.",
    verdict: "Kwaliteit wint van kwantiteit. Elke keer weer.",
  },
  MENEER_FIXT: {
    hook: "Deze hero krijgt vijftien minuten van me.",
    problemLabel: "Drie knoppen, geen duidelijke belofte",
    timeLabel: "Vijftien minuten later",
    resultLabel: "Eén belofte, één knop, sneller geladen",
    clientName: "BestRest",
  },
  MENEER_METER: {
    siteName: "een webshop die me deze week werd gestuurd",
    scores: [
      { label: "Design", value: 82 },
      { label: "Vindbaarheid", value: 54 },
      { label: "Conversie", value: 41 },
      { label: "Snelheid", value: 76 },
    ],
    total: 68,
    verdict: "Kan beter",
    oneLiner: "Mooi gemaakt. Alleen verdient Google er op dit moment meer aan dan jij.",
  },
  MENEER_ONTLEEDT: {
    brand: "Coolblue",
    hook: "Coolblue doet dit slim. Jij mag het jatten.",
    observation:
      "Bij elk product staat precies wanneer het bezorgd wordt. Niet een termijn, maar een dag en een tijdvak.",
    whyItWorks:
      "Twijfel is de duurste emotie in een webshop. Eén concrete zin haalt de vraag weg die anders tot een afgebroken bestelling leidt.",
    stealThis:
      "Vervang alles wat op je site 'meestal' of 'doorgaans' zegt door een getal. Dat kost je een uur.",
  },
  DE_OFFERTE: {
    hook: "Iemand stuurde me deze offerte. Ik werd even stil.",
    lineItems: [
      { label: "Websiteontwerp", price: "€1.850", verdict: "duur" },
      { label: "Bouw op bestaand thema", price: "€1.400", verdict: "onzin" },
      { label: "Zoekmachineoptimalisatie", price: "€650", verdict: "duur" },
      { label: "Hosting per jaar", price: "€600", verdict: "onzin" },
    ],
    total: "€4.500",
    meneerVerdict:
      "Het ontwerp mag wat kosten. Maar veertienhonderd euro voor een thema installeren dat honderdveertig kostte, dat is geen prijs. Dat is een gok of jij het doorhebt.",
  },
  BUREAU_BINGO: {
    cells: [
      "Groei",
      "Datagedreven",
      "Full service",
      "Synergie",
      "Gratis strategiecall",
      "Maatwerk",
      "360° aanpak",
      "Passie",
      "Resultaatgericht",
    ],
    punchline: "Bingo? Gefeliciteerd, je hebt een marketingbureau gevonden.",
    selfAware:
      "Ja, technisch gezien ben ik er ook één. Alleen doe ik het werk zelf en krijg je mij aan de telefoon.",
  },
  CASE_BUILD: {
    clientName: "SkinComplete",
    eyebrow: "B2B-portaal · SEO · Campagnes",
    title: "Salons bestellen nu zelf, ook om half twaalf 's nachts",
    metric: "24/7",
    metricHint: "eigen B2B-portaal in Shopify",
    tags: ["Shopify", "B2B-portaal", "SEO", "Google Ads", "Meta Ads"],
  },
};
