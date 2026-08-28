/**
 * Inhoud van de pagina over een onzuivere huid en mee-eters.
 *
 * WAAROM DIT EEN PAGINA IS EN GEEN TWEE.
 *
 * Okan had "mee-eters / verstopte poriën" en "onzuivere huid" als losse ingangen. Het zijn
 * twee woorden voor dezelfde onderliggende zaak: verstopte poriën, met of zonder ontsteking.
 * Twee pagina's zouden hetzelfde vertellen en elkaar wegdrukken, precies zoals bij striae
 * en littekens. Beide woorden staan hier wel, want daar zoekt men op.
 *
 * WAAROM DEZE PAGINA NAAST /huidproblemen/acne STAAT.
 *
 * Omdat de meeste mensen die hier komen zichzelf niet als acnepatiënt zien. Ze hebben geen
 * ontstoken plekken maar een huid die glimt, poriën die vollopen en af en toe een puistje.
 * Wie dat intikt en op een acnepagina belandt, herkent zich daar niet in en klikt weg.
 *
 * DE CORRECTIE DIE DEZE PAGINA MOET MAKEN.
 *
 * Talgfilamenten zijn geen mee-eters. Iedereen heeft ze, ze horen bij een werkende porie,
 * en ze komen altijd terug omdat ze horen terug te komen. Een halve industrie van
 * poriestrips en zuigapparaten bestaat bij de gratie van die verwarring. Wie dat weet,
 * stopt met een gevecht dat niet te winnen is en houdt tijd over voor wat wél verandert.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda.
 */

export type PorieBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const PORIE_BEELDEN: readonly PorieBeeld[] = [
  {
    id: "filamenten",
    naam: "Grijze puntjes op je neus",
    klanttaal: "Kleine grijze stipjes in bijna elke porie van je neus",
    vakterm: "talgfilamenten",
    zelfcheck:
      "Zit het gelijkmatig verdeeld over vrijwel elke porie, in plaats van hier en daar? En komt er bij zachte druk een kort, lichtgrijs draadje uit?",
    watHetIs:
      "Geen mee-eter maar de normale inhoud van een werkende porie: talg met wat cellen. Iedereen heeft ze, en ze zijn binnen weken terug omdat ze horen terug te komen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier zeggen we vooral wat je moet laten. Ze zijn tijdelijk minder zichtbaar te maken, niet weg te halen, en dat verschil scheelt mensen jaren vechten.",
    binnenBereik: false,
  },
  {
    id: "open",
    naam: "Zwarte puntjes",
    klanttaal: "Losse donkere stipjes die er echt in vast lijken te zitten",
    vakterm: "open comedo, mee-eter",
    zelfcheck:
      "Zitten ze verspreid en niet in elke porie, zijn ze duidelijk donkerder dan de rest, en zitten ze er al maanden op dezelfde plek?",
    watHetIs:
      "Een porie die is volgelopen en waarvan de inhoud aan de lucht is verkleurd. Het donker is geoxideerde talg en geen vuil; poetsen doet er niets aan. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier valt wel iets te doen. De poriën ontlasten, de verhoorning aanpakken en kijken wat het opnieuw laat vollopen.",
    binnenBereik: true,
  },
  {
    id: "gesloten",
    naam: "Bultjes zonder kopje",
    klanttaal:
      "Kleine oneffenheden die je meer voelt dan ziet, vaak op je voorhoofd",
    vakterm: "gesloten comedo",
    zelfcheck:
      "Voelt je huid in zijlicht of onder je vingers hobbelig, terwijl er in de spiegel weinig te zien is en er geen rood bij zit?",
    watHetIs:
      "Een volgelopen porie die dicht is gebleven, waardoor de inhoud niet verkleurt. Dit is het beeld dat mensen het langst zelf proberen op te lossen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Geleidelijk de bovenlaag laten vernieuwen zodat de poriën weer opengaan, in stappen die je huid aankan.",
    binnenBereik: true,
  },
  {
    id: "ontstoken",
    naam: "Rode, ontstoken plekjes",
    klanttaal: "Puistjes die pijn doen en rood zijn, en die blijven terugkomen",
    vakterm: "inflammatoire acne",
    zelfcheck:
      "Komen er regelmatig ontstoken plekken bij die zeer doen, en laten ze rode of donkere vlekjes achter?",
    watHetIs:
      "Dan gaat het niet meer om onzuiverheden maar om acne, en daar hoort een andere aanpak bij. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Op deze pagina beginnen we daar niet aan. De acnepagina is dan de betere ingang, met een eigen traject.",
    binnenBereik: false,
  },
];

/**
 * De korrelcheck.
 *
 * Eén simpele waarneming die het verschil maakt tussen iets dat normaal is en iets dat
 * behandeld kan worden. Bewust met zachte druk en niet met knijpen: het onderscheid is te
 * zien zonder dat je je huid beschadigt, en knijpen is precies hoe een gesloten comedo een
 * ontsteking wordt.
 */
export const KORRELCHECK_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Kijk in zijlicht",
    tekst:
      "Ga bij een raam staan en draai je hoofd zo dat het licht schuin op je neus en voorhoofd valt. Recht licht verstopt oneffenheden; zijlicht laat ze zien.",
  },
  {
    kop: "Tel de poriën",
    tekst:
      "Zit er in vrijwel elke porie een grijs stipje, gelijkmatig verdeeld? Dan zijn het talgfilamenten en is dat normale huid. Zitten ze verspreid en zijn ze duidelijk donkerder, dan zijn het mee-eters.",
  },
  {
    kop: "Voel met vlakke vingers",
    tekst:
      "Strijk zacht over je voorhoofd en kaaklijn. Voel je hobbeltjes zonder dat je iets ziet, dan zijn dat gesloten poriën. Niet knijpen: daar begint de ontsteking.",
  },
];

export const ONZUIVER_WEL_NIET = {
  wel: [
    "Eerst het onderscheid maken tussen normale talgfilamenten en echte verstopte poriën",
    "De bovenlaag geleidelijk laten vernieuwen zodat volle poriën weer opengaan",
    "Kijken wat je nu gebruikt, want een paar veelgebruikte producten houden het beeld in stand",
    "Meewegen dat een vette huid niet uitgedroogd hoort te worden; die maakt dan méér talg [MEDISCHE-CHECK-ROJDA]",
    "Doorsturen naar het acnetraject zodra er structureel ontsteking bij zit",
  ],
  niet: [
    "Poriestrips en zuigapparaten. Ze halen talgfilamenten weg die binnen weken terug zijn, en rekken intussen de porie op [MEDISCHE-CHECK-ROJDA]",
    "Dagelijks scrubben. Je haalt de barrière weg en de huid reageert met meer talg",
    "Alcoholtoners die je huid laten trekken. Een uitgedroogde huid maakt meer talg, niet minder [MEDISCHE-CHECK-ROJDA]",
    "Zelf uitknijpen. Een gesloten porie wordt zo een ontsteking, en een ontsteking wordt zo een vlek",
    "Beloven dat poriën kleiner worden. Ze kunnen leeg zijn en daardoor minder opvallen; hun formaat ligt vast [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const ONZUIVER_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling tegen talgfilamenten",
    tekst:
      "Ze horen bij een werkende porie en ze komen terug, hoe grondig je ook te werk gaat. Wij verkopen daar geen reeks voor. Wat we wel doen is uitleggen waarom je neus er over drie weken weer zo uitziet, zodat je stopt met een gevecht dat niet te winnen is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen onzuiverheidstraject bij echte acne",
    tekst:
      "Komen er regelmatig ontstoken plekken bij, dan is dit de verkeerde pagina en het verkeerde traject. Dan gaat het over acne, met een eigen aanpak en een eigen volgorde.",
  },
];

export const ONZUIVER_FAQ = [
  {
    vraag: "Waarom komen mee-eters op mijn neus altijd terug?",
    antwoord:
      "Omdat het in de meeste gevallen geen mee-eters zijn maar talgfilamenten. Die horen in een werkende porie thuis en vullen zich binnen enkele weken opnieuw. Dat is geen falen van je verzorging; het is hoe een porie werkt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Werken poriestrips?",
    antwoord:
      "Ze halen er iets uit, en dat voelt bevredigend. Wat eruit komt is meestal normale porie-inhoud, die terugkomt, en het lostrekken rekt de porie-opening op. Dus: kortstondig zichtbaar effect, op de lange duur geen winst. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is een onzuivere huid hetzelfde als acne?",
    antwoord:
      "Nee, en dat onderscheid is niet cosmetisch. Bij onzuiverheden gaat het om verstopping zonder veel ontsteking; bij acne is de ontsteking het probleem. De aanpak en de volgorde zijn anders. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Moet ik mijn huid strenger reinigen?",
    antwoord:
      "Bijna nooit. Wie een vette huid streng behandelt houdt een uitgedroogde huid over die meer talg maakt, en dan is het beeld na een maand slechter in plaats van beter. [MEDISCHE-CHECK-ROJDA]",
  },
];
