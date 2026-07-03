export const DIENSTEN_HERO = {
  eyebrow: "Diensten & trajecten",
  title: "Vijf blokken. Eén partner. Alles wat online groei vraagt.",
  subtitle:
    "Strategie, bouwen from scratch, vindbaarheid, Google Ads, Meta Ads en behoud. Geen losse eindjes tussen bureaus. Wel één lijn die klopt.",
  stats: [
    { label: "Hoofdblokken", value: "5" },
    { label: "Concrete trajecten", value: "30+" },
    { label: "Aanpak", value: "Plan én uitvoering" },
  ],
} as const;

export const DIENSTEN_APPROACH = [
  {
    tag: "Begrijpen",
    title: "Eerst jouw context",
    body: "Doelen, data, stack en waar het nu lekt. Geen offerte voordat dat helder is.",
  },
  {
    tag: "Route",
    title: "Volgorde bepalen",
    body: "Maximaal drie focuspunten. SEO eerst, ads later, of andersom. Per klant anders.",
  },
  {
    tag: "Bouwen",
    title: "Uitvoeren & meten",
    body: "Sites, shops, campagnes en flows. Alles met meetpunten vanaf dag één.",
  },
  {
    tag: "Opschalen",
    title: "Wat werkt krijgt gas",
    body: "Budget verschuiven naar winnaars. Geen sentiment, wel resultaat.",
  },
] as const;

export const DIENSTEN_WHY = {
  title: "Waarom alles bij één bureau past",
  body: "De gemiddelde ondernemer werkt met drie tot vijf partijen voor website, ads en SEO. Dan praat niemand met elkaar en betaal je dubbel.",
  points: [
    {
      title: "Eén lijn tussen strategie en code",
      body: "Het plan en de uitvoering komen uit hetzelfde brein. Geen vertaalfouten tussen designer, developer en marketeer.",
    },
    {
      title: "Google Ads en Meta Ads expliciet",
      body: "Geen vaag 'datagedreven adverteren'. Wel campagnes die je kunt uitleggen en waar je op kunt sturen.",
    },
    {
      title: "Vindbaar in Google én in AI",
      body: "SEO, content en techniek voor Google. Plus zichtbaarheid in ChatGPT, Gemini en Claude waar je klant steeds vaker begint.",
    },
  ],
} as const;

export const DIENSTEN_FAQ = [
  {
    question: "Kan ik ook één dienst afnemen?",
    answer:
      "Ja, als het past bij je fase. Vaak hangen dingen wel samen: een site zonder meetplan of SEO maakt ads duurder. Daarom beginnen we met context en kiezen we de juiste volgorde.",
  },
  {
    question: "Bouwen jullie met templates of page builders?",
    answer:
      "Nee. Websites en Shopify-thema's bouwen we from scratch. Custom code, snel en klaar om op te schalen. Geen template dat je over een jaar tegen de plinten loopt.",
  },
  {
    question: "Doen jullie ook alleen Google Ads of alleen SEO?",
    answer:
      "Dat kan, mits de basis klopt. SkinComplete begon bijvoorbeeld met SEO en e-mail. Ads kwamen pas toen organisch verkeer al verkocht. Die volgorde bespreken we eerlijk.",
  },
  {
    question: "Wat is het verschil tussen een blokpagina en een dienstpagina?",
    answer:
      "Elk hoofdblok (strategie, bouwen, vindbaarheid, campagnes, behoud) heeft een eigen verhaal met proces en bewijs. Onder elk blok vallen concrete diensten zoals Google Ads, Shopify of e-mailflows met meer detail.",
  },
  {
    question: "Hoe start ik een traject?",
    answer:
      "Met de Groeiscan of een intake. Je krijgt scherpte op prioriteit en route. Daarna een voorstel dat past bij je fase, niet bij een standaardpakket.",
  },
] as const;

export const PILLAR_ACCENTS: Record<string, string> = {
  strategie: "#FF5722",
  bouwen: "#0284c7",
  vindbaarheid: "#00BCD4",
  campagnes: "#FF5722",
  behoud: "#8D6E63",
};
