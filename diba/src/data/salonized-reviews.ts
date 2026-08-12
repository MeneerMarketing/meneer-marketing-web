/** Onderwerp-tags voor review-mining en filters. */
export type SalonizedReviewTopic =
  "acne" | "pigment" | "rosacea" | "laser" | "huidveroudering" | "algemeen";

/** Publieke Salonized-pagina — bron voor live reviews. */
export const SALONIZED_REVIEWS_URL =
  "https://dibaclinics.salonized.com/reviews" as const;

/** Stand opgehaald op Salonized (aug 2026). */
export const SALONIZED_REVIEW_SUMMARY = {
  rating: 5.0,
  count: 3883,
  countFormatted: "3.883",
  sourceLabel: "Salonized",
} as const;

export type SalonizedReviewEntry = {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly treatment: string;
  readonly stars: 5;
  readonly relativeDate?: string;
  readonly topics: readonly SalonizedReviewTopic[];
};

/**
 * Echte quotes van dibaclinics.salonized.com/reviews (pagina 1–10).
 * Geen verzonnen teksten — alleen lichte typo-fix waar de bron onleesbaar was.
 */
export const SALONIZED_REVIEWS: readonly SalonizedReviewEntry[] = [
  {
    id: "salon-gladys",
    quote:
      "Ik heb een skin behandeling gehad, en de dame heeft me zo goed geholpen! Ze vertelde alles in stappen uit wat ze deed, en omdat ik een zeer gevoelige huid heb, was ze extra voorzichtig! Helemaal tevreden!",
    name: "Gladys",
    treatment: "Skinbehandeling",
    stars: 5,
    relativeDate: "6 dagen geleden",
    topics: ["algemeen", "huidveroudering"],
  },
  {
    id: "salon-loubna",
    quote: "Fijn geholpen en er werd tijd genomen.",
    name: "Loubna",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "10 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-diya",
    quote: "Echt een goede, professionele kliniek.",
    name: "Diya",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "11 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-edanur",
    quote:
      "Ik heb een behandeling gehad van Andres. Een aardig man die zijn werk met liefde doet en goed doet. Tussendoor ook de klant op zijn gemak laat voelen door te praten en te luisteren en vragen of alles goed gaat. Good job!!",
    name: "Edanur",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "18 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-nabila",
    quote:
      "Ik ben nu 2 keer bij Diba geweest en beide keren zeer goed geholpen. Ze nemen de tijd voor je, leggen alles goed en je kan alle vragen stellen die je hebt. Ik kom zeker terug bij Diba!",
    name: "Nabila",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "23 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-meike",
    quote:
      "Uitgebreide en eerlijke informatie gehad. Vriendelijke medewerkers.",
    name: "Meike",
    treatment: "Consult & behandeling",
    stars: 5,
    relativeDate: "23 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-kajin",
    quote:
      "Na een lange tijd heb ik weer een behandeling gehad bij Rojda. Het was weer een fijne ervaring. Samen met Rojda hebben we gekeken welke behandeling het beste bij mij past. Ik heb genoten van een heerlijke Hydrafacial in combinatie met een peeling.",
    name: "Kajin",
    treatment: "Hydrafacial & peeling",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-maroula",
    quote:
      "I had a wonderful experience with Andre. He took the time to explain everything thoroughly, answered all of my questions, and made me feel completely at ease. I felt that he performed the SkinPen treatment with great precision and care.",
    name: "Maroula",
    treatment: "SkinPen",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-duygu",
    quote:
      "Hele fijne ervaring, deskundige huidtherapeut. Het gevoel dat ik eerlijk advies heb gekregen. Fijne Hydrafacial behandeling met uitleg.",
    name: "Duygu",
    treatment: "Hydrafacial",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-dilan",
    quote:
      "Mijn 7de SkinPen-behandeling gehad en wat ben ik blij met het resultaat! Vandaag de before en after foto's bekeken en wat een verschil!!! Ik ben en blijf jullie trouwe klant!!",
    name: "Dilan",
    treatment: "SkinPen traject",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-martyna",
    quote:
      "Super fijne afspraak gehad. Andres heeft mij geholpen in het besluit door alle overwegingen mee te nemen. Super veel professionaliteit laten zien!",
    name: "Martyna",
    treatment: "Consult & behandeling",
    stars: 5,
    relativeDate: "Ongeveer 2 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-manisha",
    quote: "Zoals altijd goed geholpen met de laser!",
    name: "Manisha",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "Ongeveer 2 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-jasemine",
    quote:
      "Ik had vandaag een laserafspraak bij Demi. Het ging lekker vlot en ik voel me erg op m'n gemak bij haar. Ik ben erg tevreden met m'n resultaat tot nu toe en ik zie duidelijke vooruitgangen! Erg gastvrij, professioneel en alles ook mooi en netjes ingericht.",
    name: "Jasemine",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-darifa",
    quote:
      "Ik blijf het telkens herhalen, maar ik ben al weer zo fijn geholpen door Iris! Laserbehandeling en geëindigd met een gezichtsbehandeling. Ben zo blij dat ik terecht ben gekomen bij Diba Clinics.",
    name: "Darifa",
    treatment: "Laser & gezichtsbehandeling",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["laser", "huidveroudering"],
  },
  {
    id: "salon-shanoja",
    quote:
      "Goede instructies en uitleg van de behandelaar. Heel zorgvuldig te werk. Iom behandelaar gekeken wat handig was voor behandeling, gezien zon. Behandeling zelf was te doen, enigzins pijnlijk maar niet buiten de verwachting. Heel tevreden.",
    name: "Shanoja",
    treatment: "Laserbehandeling",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-selma",
    quote:
      "Ik ben al vaker door Demi geholpen en iedere keer merk je hoe rustig, persoonlijk en professioneel ze werkt. Je voelt je absoluut geen nummertje. Ze neemt echt de tijd voor je en straalt duidelijk passie voor haar werk uit.",
    name: "Selma",
    treatment: "Laserbehandeling bij Demi",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-tugce",
    quote:
      "Elke afspraak verloopt erg goed. Iris is heel vriendelijk en professioneel, waardoor ik me altijd op mijn gemak voel. Ze legt alles duidelijk uit, werkt zorgvuldig en neemt de tijd voor je.",
    name: "Tugce",
    treatment: "Behandeling bij Iris",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen", "laser"],
  },
  {
    id: "salon-lynnette",
    quote:
      "Warme ontvangst en goede uitleg voor en gedurende de behandeling. Aandacht voor mijn gevoel en gemak. Aanrader!",
    name: "Lynette",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "Ongeveer 2 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-aylin",
    quote:
      "Zoals altijd is de deskundigheid en klantvriendelijkheid tip top! Naast de behandeling en resultaat is de dienstverlening ook erg belangrijk, en bij Diba Clinics is dit dankzij de medewerkers heel goed geregeld!",
    name: "Aylin",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-gulcicek",
    quote:
      "Ik (en mijn huid) zijn altijd weer blij om Iris te zien! Ook heel fijn dat met deze hittegolf de kliniek heerlijk koel was!",
    name: "Gulcicek",
    treatment: "Behandeling bij Iris",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen", "rosacea"],
  },
  {
    id: "salon-danique",
    quote:
      "Fijne kliniek. Ik kom hier al jaren voor diverse behandelingen. Eerlijk advies en altijd een mooi resultaat!",
    name: "Danique",
    treatment: "Diverse behandelingen",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen", "huidveroudering"],
  },
  {
    id: "salon-alice-advies",
    quote: "Zorgvuldig en professioneel advies.",
    name: "Alice",
    treatment: "Consult Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-dunja",
    quote:
      "I removed fibromas and everything went great! I got good advice and I'm very happy with the result. Will come back!",
    name: "Dunja",
    treatment: "Fibromen verwijderen",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-mina",
    quote:
      "Tevreden met de persoonlijke service en uitleg achter de behandelingen en de producten. Thank you!",
    name: "Mina",
    treatment: "Behandeling & productadvies",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen", "huidveroudering"],
  },
  {
    id: "salon-angelique",
    quote: "Ben bijzonder vriendelijk en deskundig geholpen!",
    name: "Angelique",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-neroush",
    quote:
      "Gisteren heb ik opnieuw een SkinPen-behandeling gehad bij Melanie, en zoals altijd ging ik met een glimlach de deur uit. Ze is een oprecht professionele en betrokken huidtherapeut die duidelijk uitlegt wat ze doet en waarom. Ik kan Diba Clinics van harte aanbevelen.",
    name: "Neroush",
    treatment: "SkinPen bij Melanie",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-mine",
    quote:
      "Altijd zo zo zo een prettige ervaring! Word altijd goed meegenomen in de stappen en vertrek altijd mega tevreden.",
    name: "Mine",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-nancy",
    quote: "Fijne Fotona-behandeling gehad bij Iris.",
    name: "Nancy",
    treatment: "Fotona bij Iris",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["huidveroudering", "laser"],
  },
  {
    id: "salon-marcella",
    quote:
      "Altijd zo tevreden als ik hier ben geweest. Andres geeft fijn en duidelijk advies en denkt echt met je mee. Vanaf het moment dat je binnen stapt voelt het alsof je echt gezien wordt. Zal Diba altijd aanraden in mijn omgeving.",
    name: "Marcella",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-layla",
    quote:
      "Laserontharingsbehandeling gehad en ben erg tevreden. De medewerker was ontzettend vriendelijk en professioneel, en stelde me direct op mijn gemak. Zeker een fijne ervaring!",
    name: "Layla",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-fleur",
    quote: "Word altijd goed en lief geholpen! En krijg het beste advies.",
    name: "Fleur",
    treatment: "Advies & behandeling",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-ufuk",
    quote:
      "Fijne duidelijke uitleg over de behandeling voordat er gestart wordt. Goede tips krijg je mee voor na de behandeling.",
    name: "Ufuk",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-wendy",
    quote:
      "Vanaf het eerste moment bij de intake voelde ik mij op mijn gemak en serieus genomen, iets wat voor mij extra belangrijk was omdat dit altijd een drempel voor mij is geweest (laser). De behandelingen worden op een professionele en deskundige manier uitgevoerd, met veel aandacht voor veiligheid, hygiëne en persoonlijke begeleiding. Je voelt je hier geen nummer, maar echt gezien en gehoord.",
    name: "Wendy",
    treatment: "Lasertraject",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-loubna-laser",
    quote:
      "Zooo ontzettend goed geholpen, ze gaf met alles aan wat ze deed, super vriendelijk! Wil graag voor de volgende afspraak weer bij haar.",
    name: "Loubna",
    treatment: "Laserbehandeling",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-annika",
    quote:
      "I came for the Fotona treatment with Iris, what a wonderful experience, she is fantastic! Very well run establishment.",
    name: "Annika",
    treatment: "Fotona bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["huidveroudering", "laser"],
  },
  {
    id: "salon-esma",
    quote:
      "Word altijd fijn geholpen. Professionele medewerkers en top resultaat!",
    name: "Esma",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-rahime-iris",
    quote:
      "Ik had een behandeling op advies. Iris is super lief en heel bekwaam. Ik voelde me meteen op mijn gemak! Heel tevreden nu al.",
    name: "Rahime",
    treatment: "Behandeling bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen", "rosacea"],
  },
  {
    id: "salon-elif",
    quote: "Voor alle behandelingen zijn jullie super professioneel.",
    name: "Elif",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-yasemin",
    quote: "Mijn eerste behandeling na 3 jaar en ben er super tevreden over!",
    name: "Yasemin",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-sorbir",
    quote: "Fijne medewerkers.",
    name: "Sorbir",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "23 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-yasemin-iris",
    quote:
      "Als het om mijn huid gaat dan vertrouw ik niemand, behalve Diba! Al meer dan 7/8 jaar klant. Het voelt zo fijn om om de 2 maanden een gezichtsbehandeling te nemen. Dankjewel lieve Iris en team Diba.",
    name: "Yasemin",
    treatment: "Gezichtsbehandeling bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen", "huidveroudering", "rosacea"],
  },
  {
    id: "salon-cheline",
    quote: "Andres is the best I love him",
    name: "Cheline",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-suzan",
    quote:
      "Super geholpen weer vandaag! Inmiddels voor de vierde keer geweest, voor o.a. IPL tegen roodheid. Geholpen door lieve en kundige dames, die ervoor zorgen dat het je aan niets ontbreekt. Ik blijf hier zeker komen!",
    name: "Suzan",
    treatment: "IPL tegen roodheid",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["rosacea", "algemeen"],
  },
  {
    id: "salon-goknur",
    quote:
      "Ik word altijd super goed geholpen bij Diba Clinics, ook heel aardig personeel!",
    name: "Göknur",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-hatice",
    quote:
      "Personeel die weten waar ze over praten, fijne behandeling gehad. Mooie kliniek en vriendelijk personeel!",
    name: "Hatice",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-aydan",
    quote:
      "Voor het eerst bij Diba Clinics geweest. Andres heeft een huidscan gedaan bij mij en gekeken, en we hebben daarna gesproken over het plan van aanpak. Hij legde duidelijk uit welke behandeling ik nodig heb en de benodigde producten voor mijn huid. Bedankt Andres voor je vriendelijkheid en tot snel weer!",
    name: "Aydan",
    treatment: "Huidscan & consult bij Andres",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen", "huidveroudering"],
  },
  {
    id: "salon-sarah-grissel",
    quote:
      "Ik voelde me erg op mijn gemak en je kon merken dat Grissel heel veel kennis heeft. Ze heeft me goed geadviseerd en wat ik ook heel fijn vond, is dat ze me niet meteen allerlei producten of behandelingen opdrong, maar echt de tijd nam om naar mijn huid te kijken en te vertellen wat bij mij past.",
    name: "Sarah",
    treatment: "Consult bij Grissel",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-sarah-dermapen",
    quote:
      "Hele fijne en lieve dame die mij heeft geholpen! Geeft goed advies en geeft op tijd aan wat ze gaat doen. Dermapen was wel een beetje pijnlijk maar werd goed begeleid!",
    name: "Sarah",
    treatment: "Dermapen",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-rachel",
    quote:
      "Ben zeer tevreden met het gesprek dat plaats heeft gevonden. Ze heeft alles goed uitgelegd en ik voelde me op mijn gemak bij haar. Ik kijk uit naar mijn eerste peelingbehandeling.",
    name: "Rachel",
    treatment: "Consult peeling",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-jasmina-acne",
    quote:
      "Ik ben erg tevreden over de behandelingen en de resultaten. Mijn acne is volledig weg sinds ik hier behandeld word en we zijn nu bezig met het bestrijden van de littekens (hier begin ik ook al verschil te merken). De medewerkers zijn erg lief en professioneel!",
    name: "Jasmina",
    treatment: "Acne traject",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-doenia",
    quote:
      "Ik ben vandaag voor het eerst door Demi behandeld. Hele lieve meid, weet wat ze doet en houdt rekening met je en luistert naar je. Ik heb zelf PCOS, en ik heb nu alleen maar babyhaartjes in mijn gezicht. Ben super tevreden!",
    name: "Doenia",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-andrijana",
    quote:
      "Ik heb een hele fijne ervaring gehad bij Demi. Goed geïnformeerd over hoe het proces (laseren) in zijn werking gaat. Ik ben gerustgesteld en goed geholpen. Jullie hebben er een nieuwe klant bij!",
    name: "Andrijana",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["laser"],
  },
  {
    id: "salon-hajar",
    quote:
      "De afgelopen jaren hebben we hele mooie resultaten mogen behalen, van ernstige acne naar mijn droomhuid! Ik ben oprecht ontzettend blij met het team van Diba Clinics en in het bijzonder met Iris.",
    name: "Hajar",
    treatment: "Acne traject bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-lina",
    quote:
      "Ik ben heel erg tevreden over mijn SkinPen-behandeling bij Iris. De behandeling was professioneel, en er werd goed gekeken naar wat mijn huid nodig had.",
    name: "Lina",
    treatment: "SkinPen bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["huidveroudering", "algemeen"],
  },
  {
    id: "salon-betul",
    quote:
      "Voor het eerst bij Andres geweest voor de behandeling. Erg fijn dat er rekening werd gehouden met dat ik een hoofddoek draag door een extra kapje aan te bieden die volledig mijn haren bedekt. Top service!",
    name: "Betul",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen", "laser"],
  },
  {
    id: "salon-martyna-andres",
    quote:
      "Andres dankjewel voor jouw aandacht, professionaliteit, gezelligheid en vakkennis! Zoals gebruikelijk een hele fijne afspraak gehad bij Diba Clinics.",
    name: "Martyna",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
] as const;
