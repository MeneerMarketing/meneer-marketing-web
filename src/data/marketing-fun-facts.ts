export interface MarketingFunFact {
  stat: string;
  teaser: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  accent: string;
}

/** Feitjes verspreid over de site, niet als blok op de homepage */
export const MARKETING_FUN_FACTS: MarketingFunFact[] = [
  {
    stat: "44%",
    teaser: "klikte op de allereerste banner-ad ooit",
    title: "Aandacht slijt",
    body: "In 1994 kocht AT&T de eerste banner-ad op internet. 44 procent van de bezoekers klikte erop. Vandaag is een half procent al een feestje. Originaliteit is dus geen luxe, het is overleven.",
    href: "/campagnes",
    linkLabel: "Campagnes die opvallen",
    accent: "#FF5722",
  },
  {
    stat: "40",
    teaser: "tinten blauw testte Microsoft voor één linkkleur",
    title: "Design is omzet",
    body: "Bing testte tientallen tinten blauw voor de links in de zoekresultaten. De winnende tint leverde zo'n 80 miljoen dollar extra per jaar op. Kleur is geen kwestie van smaak, kleur is een kwestie van omzet.",
    href: "/diensten/cro",
    linkLabel: "Conversie-optimalisatie",
    accent: "#0284c7",
  },
  {
    stat: "50 ms",
    teaser: "en je bezoeker heeft zijn oordeel al klaar",
    title: "Sneller dan een knipoog",
    body: "Bezoekers vormen hun eerste oordeel over een website binnen 50 milliseconden. Een knipoog duurt zes keer zo lang. Daarom bouwen wij sites waar dat oordeel meteen goed zit.",
    href: "/bouwen",
    linkLabel: "Websites from scratch",
    accent: "#0F172A",
  },
  {
    stat: "15%",
    teaser: "van alle Google-zoekopdrachten is gloednieuw",
    title: "Er valt altijd wat te winnen",
    body: "Van alles wat mensen dagelijks in Google typen is 15 procent nog nooit eerder gezocht. Er ligt dus altijd onontgonnen vindbaarheid klaar. Zeker nu AI-zoekmachines de kaarten opnieuw schudden.",
    href: "/vindbaarheid",
    linkLabel: "Vindbaarheid & content",
    accent: "#00BCD4",
  },
];
