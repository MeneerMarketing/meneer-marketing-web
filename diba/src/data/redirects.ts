/**
 * 301-redirects van oude URL's naar nieuwe routes.
 * Uitbreiden zodra Okan de oude sitemap levert.
 */
export const LEGACY_REDIRECTS: readonly {
  source: string;
  destination: string;
}[] = [
  { source: "/over", destination: "/over-ons" },
  { source: "/about", destination: "/over-ons" },
  { source: "/prijs", destination: "/prijzen" },
  { source: "/afspraak", destination: "/intake" },
  { source: "/boeken", destination: "/intake" },
  { source: "/laser", destination: "/laserontharing" },
  { source: "/laserontharing/prijzen", destination: "/laserontharing" },
  /* De Lumi 8 staat niet meer in de kliniek; het LED-werk gebeurt nu op het Precision
     Photonic System van Skin Complete. De behandeling heet daarbij naar wat het is en
     niet naar de kast waar het op draait. */
  {
    source: "/apparatuur/lumi-8",
    destination: "/apparatuur/precision-photonic-system",
  },
  {
    source: "/behandelingen/lumi-8-led",
    destination: "/behandelingen/led-therapie",
  },
  /* CooLift Cryo Therapy staat niet meer in de kliniek (Yasin, 5 september 2026). Wie de
     pagina nog in zijn geschiedenis heeft of via Google binnenkomt hoort niet op een 404
     te landen. CooLift bracht werkzame stoffen in de huid met kou en druk; de skinboosters
     doen dat met een naald, en dat is de dichtstbijzijnde behandeling die we wel hebben. */
  {
    source: "/behandelingen/coolift",
    destination: "/behandelingen/skinboosters",
  },
  { source: "/apparatuur/coolifting", destination: "/apparatuur/u225" },
  /* Tijdelijk dicht (Yasin, 5 september 2026). Voor allebei moet eerst inhoud verzameld
     worden: voor-en-na-materiaal voor de resultaten, en de zones en tarieven voor de
     configurator. De pagina's blijven staan; alleen de ingangen zijn dicht. Terugzetten is
     een kwestie van deze twee regels weghalen. */
  { source: "/resultaten", destination: "/reviews" },
  { source: "/laserontharing/configurator", destination: "/laserontharing" },
  /* De pagina heet tarieven (Yasin, 5 september 2026). De oude URL stond in de sitemap,
     dus er kan al naar gelinkt zijn. */
  { source: "/prijzen", destination: "/tarieven" },
  /* Cellulitis behandelen we niet; de pagina die uitlegde waarom is weg. Wie er nog op
     uitkomt hoort waar we wel voor zijn. */
  { source: "/huidproblemen/cellulitis", destination: "/huidproblemen" },
  /* Het apparaat heet GentleMax Pro (Yasin, 5 september 2026). De oude naam stond nog in
     de slug, dus die URL kan gedeeld zijn. */
  {
    source: "/apparatuur/gentle-laser-pro-u",
    destination: "/apparatuur/gentlemax-pro",
  },
  /* Gesplitst op 5 september 2026 (Okan): het waren verschillende trajecten met
     verschillende prijzen achter een kaartje, en een apparaat dat als behandeling in de
     lijst stond. */
  {
    source: "/behandelingen/cosmelan-dermamelan",
    destination: "/behandelingen/cosmelan",
  },
  {
    source: "/behandelingen/nordlys-ipl",
    destination: "/apparatuur/nordlys-ipl",
  },
  /* De klachtenpagina is uit de site (Yasin, 5 september 2026). De wettelijke uitleg
     staat op /kwaliteit-en-registraties; wie de oude URL heeft komt bij contact uit. */
  { source: "/klachten", destination: "/contact" },
] as const;
