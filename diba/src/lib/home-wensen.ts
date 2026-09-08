import {
  behandelingenBijWens,
  HUIDWENSEN,
  prijsTekst,
  type HuidwensId,
} from "@/data/behandelingen";
import { HOME_WENS_BEELD, type HomeWens } from "@/data/home-intents";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De data voor "Waar wil je hulp bij?" op de homepage, samengesteld op de server.
 *
 * WAAROM OP DE SERVER. De kiezer is een client component (hij onthoudt welke wens je
 * aanklikt), maar de behandelingen erachter zijn drieduizend regels data met
 * redactievlaggen erin. Die horen niet in de browser en niet in de broncode van de
 * pagina. Hier wordt per wens alleen overgehouden wat het paneel toont, met de vlaggen
 * eruit en de prijs al als tekst.
 *
 * MAXIMAAL VIJF PER WENS. Huidverjonging heeft er veertien; een paneel met veertien
 * regels is een lijst, geen keuze. Wie meer wil ziet het aantal en een link naar het
 * volledige overzicht op /behandelingen, onder hetzelfde kopje.
 *
 * PRIJS EERST. Binnen een wens staan behandelingen met een prijs vóór die "op aanvraag".
 * Niet omdat de laatste minder zijn, maar omdat een paneel dat opent met drie keer
 * "op aanvraag" precies het tegendeel zegt van "alle tarieven staan op de site".
 */
export const MAX_IN_PANEEL = 5;

export function homeWensen(): readonly HomeWens[] {
  return HUIDWENSEN.filter((w) => w.id !== "overig").map((w) => {
    const alle = behandelingenBijWens(w.id as HuidwensId);
    const gesorteerd = [...alle].sort((a, b) => {
      if ((a.prijs === 0) === (b.prijs === 0)) return 0;
      return a.prijs === 0 ? 1 : -1;
    });
    const beeld = HOME_WENS_BEELD[w.id as Exclude<HuidwensId, "overig">];
    return {
      id: w.id,
      label: w.label,
      knop: w.knop,
      kort: w.kort,
      pad: w.pad,
      icoon: beeld.icoon,
      image: beeld.image,
      imageAlt: beeld.imageAlt,
      behandelingen: gesorteerd.slice(0, MAX_IN_PANEEL).map((b) => ({
        slug: b.slug,
        naam: publicCopy(b.naam),
        apparaat: b.apparaat ? publicCopy(b.apparaat) : undefined,
        prijsLabel:
          b.prijs === 0 ? "Op aanvraag" : `vanaf ${prijsTekst(b.prijs)}`,
      })),
      totaal: alle.length,
    };
  });
}
