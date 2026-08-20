export type WerkwijzeStep = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

/**
 * De drie stappen van een eerste afspraak.
 *
 * TITELS EN TEKSTEN ZIJN OP LENGTE GESCHREVEN, EN DAT IS GEEN PIETLUTTIGHEID.
 *
 * Ze staan naast elkaar in drie even brede kaarten. Een titel van negen tekens naast een
 * van zeventien laat de tweede kolom scheef ogen, en een tekst die in de ene kaart twee
 * regels loopt en in de andere vier trekt de hele rij uit het lood. Dat is precies wat er
 * mis was: het waren drie losse zinnen in een raster in plaats van drie kaarten die
 * samen een rij vormen.
 *
 * Nu liggen de titels op 9 tot 12 tekens en de teksten op 89 tot 101. Dat is binnen de
 * marge waarin ze op elke schermbreedte hetzelfde aantal regels vullen.
 *
 * De teksten bij "De meting" en "Het voorstel" zijn in augustus 2026 herschreven op
 * aanwijzing van Rojda: de meting hoort te benoemen dat het in een professioneel
 * huidanalysesysteem gebeurt, en bij het voorstel moest "wat het niet gaat doen" en "soms
 * is het voorstel om nog niets te doen" eruit. Dat laatste hoort volgens haar in het
 * consult thuis en niet op een homepage.
 *
 * "Luisteren / Kijken & meten / Een plan dat past" is vervangen door drie zelfstandige
 * naamwoorden. Werkwoorden beschrijven wat wij doen; zelfstandige naamwoorden benoemen
 * de drie momenten die jij meemaakt, en dat is waar deze sectie over gaat.
 */
export const HOME_WERKWIJZE_STEPS: readonly WerkwijzeStep[] = [
  {
    id: "gesprek",
    title: "Het gesprek",
    body: "Je vertelt wat je dwarszit en wat je al probeerde. Wij vragen door, ook naar wat je niet wilt.",
  },
  {
    id: "meting",
    title: "De meting",
    body: "De meting doen we in een professioneel huidanalysesysteem, zodat verschil later ook echt verschil is.",
  },
  {
    id: "voorstel",
    title: "Het voorstel",
    body: "Wat er kan, wat het kost en wat je kunt verwachten. Daarna beslis jij, in je eigen tempo.",
  },
] as const;
