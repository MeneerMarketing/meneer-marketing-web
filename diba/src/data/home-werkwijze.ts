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
 * Nu liggen de titels op 9 tot 12 tekens en de teksten op 94 tot 100. Dat is binnen de
 * marge waarin ze op elke schermbreedte hetzelfde aantal regels vullen.
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
    body: "We kijken onder vast licht en leggen de uitkomst vast. Zo is verschil later ook echt verschil.",
  },
  {
    id: "voorstel",
    title: "Het voorstel",
    body: "Wat er kan, wat het kost en wat het niet gaat doen. Soms is het voorstel om nog niets te doen.",
  },
] as const;
