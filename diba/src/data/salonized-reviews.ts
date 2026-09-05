/** Onderwerp-tags voor review-mining en filters. */
export type SalonizedReviewTopic =
  | "acne"
  | "littekens"
  | "pigment"
  | "rosacea"
  | "laser"
  | "huidveroudering"
  | "gezichtsbehandeling"
  | "intake"
  | "algemeen";

/** Publieke Salonized-pagina — bron voor live reviews. */
export const SALONIZED_REVIEWS_URL =
  "https://dibaclinics.salonized.com/reviews" as const;

/** Stand opgehaald op Salonized (5 september 2026). */
export const SALONIZED_REVIEW_SUMMARY = {
  rating: 5.0,
  count: 3893,
  countFormatted: "3.893",
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
 * Echte quotes van dibaclinics.salonized.com/reviews. Geen verzonnen teksten; emoji zijn
 * eruit gehaald en verder staat er wat er staat.
 *
 * DE TAGS ZIJN GEEN SMAAK. Elke tag hangt aan een woord in de review zelf: "acne" alleen als
 * er acne, puistjes of onzuiverheden staat, "littekens" alleen bij littekens. Dat is te
 * controleren; "past er wel bij" niet.
 *
 * WAAROM DAT UITMAAKT. Hiervoor stonden er vier reviews onder de tag rosacea waarvan er drie
 * niets over roodheid zeggen; een ervan gaat over de airconditioning. Die stonden op
 * /rosacea en /couperose onder de kop "Wat anderen erover zeggen".
 *
 * WAT ER NIET IS. Over het hele archief van 2.467 reviews met tekst schrijft niemand over
 * rimpels, verslapping of pigment, en één iemand over roodheid als klacht. Mensen beoordelen
 * hier het bezoek, niet het resultaat van maanden. Voor die onderwerpen staat er dus geen
 * blok op de pagina, en dat blijft zo tot de reviews er wel zijn.
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
    topics: ["algemeen"],
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
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-maroula",
    quote:
      "I had a wonderful experience with Andre. He took the time to explain everything thoroughly, answered all of my questions, and made me feel completely at ease. I felt that he performed the SkinPen treatment with great precision and care.",
    name: "Maroula",
    treatment: "SkinPen",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-duygu",
    quote:
      "Hele fijne ervaring, deskundige huidtherapeut. Het gevoel dat ik eerlijk advies heb gekregen. Fijne Hydrafacial behandeling met uitleg.",
    name: "Duygu",
    treatment: "Hydrafacial",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-dilan",
    quote:
      "Mijn 7de SkinPen-behandeling gehad en wat ben ik blij met het resultaat! Vandaag de before en after foto's bekeken en wat een verschil!!! Ik ben en blijf jullie trouwe klant!!",
    name: "Dilan",
    treatment: "SkinPen traject",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen"],
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
    topics: ["algemeen"],
  },
  {
    id: "salon-jasemine",
    quote:
      "Ik had vandaag een laserafspraak bij Demi. Het ging lekker vlot en ik voel me erg op m'n gemak bij haar. Ik ben erg tevreden met m'n resultaat tot nu toe en ik zie duidelijke vooruitgangen! Erg gastvrij, professioneel en alles ook mooi en netjes ingericht.",
    name: "Jasemine",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-darifa",
    quote:
      "Ik blijf het telkens herhalen, maar ik ben al weer zo fijn geholpen door Iris! Laserbehandeling en geëindigd met een gezichtsbehandeling. Ben zo blij dat ik terecht ben gekomen bij Diba Clinics.",
    name: "Darifa",
    treatment: "Laser & gezichtsbehandeling",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-shanoja",
    quote:
      "Goede instructies en uitleg van de behandelaar. Heel zorgvuldig te werk. Iom behandelaar gekeken wat handig was voor behandeling, gezien zon. Behandeling zelf was te doen, enigzins pijnlijk maar niet buiten de verwachting. Heel tevreden.",
    name: "Shanoja",
    treatment: "Laserbehandeling",
    stars: 5,
    relativeDate: "2 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-selma",
    quote:
      "Ik ben al vaker door Demi geholpen en iedere keer merk je hoe rustig, persoonlijk en professioneel ze werkt. Je voelt je absoluut geen nummertje. Ze neemt echt de tijd voor je en straalt duidelijk passie voor haar werk uit.",
    name: "Selma",
    treatment: "Laserbehandeling bij Demi",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-tugce",
    quote:
      "Elke afspraak verloopt erg goed. Iris is heel vriendelijk en professioneel, waardoor ik me altijd op mijn gemak voel. Ze legt alles duidelijk uit, werkt zorgvuldig en neemt de tijd voor je.",
    name: "Tugce",
    treatment: "Behandeling bij Iris",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
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
    topics: ["algemeen"],
  },
  {
    id: "salon-danique",
    quote:
      "Fijne kliniek. Ik kom hier al jaren voor diverse behandelingen. Eerlijk advies en altijd een mooi resultaat!",
    name: "Danique",
    treatment: "Diverse behandelingen",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
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
    topics: ["algemeen"],
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
    topics: ["algemeen"],
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
    topics: ["algemeen"],
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
    topics: ["laser", "algemeen"],
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
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-loubna-laser",
    quote:
      "Zooo ontzettend goed geholpen, ze gaf met alles aan wat ze deed, super vriendelijk! Wil graag voor de volgende afspraak weer bij haar.",
    name: "Loubna",
    treatment: "Laserbehandeling",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-annika",
    quote:
      "I came for the Fotona treatment with Iris, what a wonderful experience, she is fantastic! Very well run establishment.",
    name: "Annika",
    treatment: "Fotona bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
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
    topics: ["algemeen"],
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
    topics: ["gezichtsbehandeling", "algemeen"],
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
    topics: ["intake", "algemeen"],
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
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-rachel",
    quote:
      "Ben zeer tevreden met het gesprek dat plaats heeft gevonden. Ze heeft alles goed uitgelegd en ik voelde me op mijn gemak bij haar. Ik kijk uit naar mijn eerste peelingbehandeling.",
    name: "Rachel",
    treatment: "Consult peeling",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-jasmina-acne",
    quote:
      "Ik ben erg tevreden over de behandelingen en de resultaten. Mijn acne is volledig weg sinds ik hier behandeld word en we zijn nu bezig met het bestrijden van de littekens (hier begin ik ook al verschil te merken). De medewerkers zijn erg lief en professioneel!",
    name: "Jasmina",
    treatment: "Acne traject",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["acne", "littekens", "algemeen"],
  },
  {
    id: "salon-doenia",
    quote:
      "Ik ben vandaag voor het eerst door Demi behandeld. Hele lieve meid, weet wat ze doet en houdt rekening met je en luistert naar je. Ik heb zelf PCOS, en ik heb nu alleen maar babyhaartjes in mijn gezicht. Ben super tevreden!",
    name: "Doenia",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-andrijana",
    quote:
      "Ik heb een hele fijne ervaring gehad bij Demi. Goed geïnformeerd over hoe het proces (laseren) in zijn werking gaat. Ik ben gerustgesteld en goed geholpen. Jullie hebben er een nieuwe klant bij!",
    name: "Andrijana",
    treatment: "Laserontharing bij Demi",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["laser", "algemeen"],
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
    topics: ["algemeen"],
  },
  {
    id: "salon-betul",
    quote:
      "Voor het eerst bij Andres geweest voor de behandeling. Erg fijn dat er rekening werd gehouden met dat ik een hoofddoek draag door een extra kapje aan te bieden die volledig mijn haren bedekt. Top service!",
    name: "Betul",
    treatment: "Behandeling bij Andres",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
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

  /* -- Aanvulling uit het volledige archief, 5 september 2026 ------------------
     Alle 390 pagina's van dibaclinics.salonized.com/reviews zijn opgehaald: 2.467 van
     de 3.893 beoordelingen hebben tekst, de rest is alleen sterren. Ze zijn getagd op
     wat er letterlijk staat en niet op wat er zou passen. Teksten zijn onveranderd op
     emoji na, zoals hierboven ook al gebeurde. */
  {
    id: "salon-busra",
    quote:
      "De toppers van Diba zijn super vriendelijk! Ik laat mijn huid nooit ergens anders dan Diba behandelen, ben van mijn langdurige acne af.",
    name: "Busra",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "meer dan 4 jaar geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-gina",
    quote:
      "Nu 2x een dermapen behandeling gehad (daarvoor 2x een acne behandeling). Het resultaat is echt mooi. Minder litteken vlekken in mijn gezicht en al 4 maanden geen acne meer. Dit komt ook door mijn voeding. Durf nu eindelijk zonder make-up de deur uit :).",
    name: "Gina",
    treatment: "Microneedling",
    stars: 5,
    relativeDate: "ongeveer 6 jaar geleden",
    topics: ["acne", "littekens", "gezichtsbehandeling"],
  },
  {
    id: "salon-brayson",
    quote:
      "In het algemeen heel tevreden. Kwam de eerste keer binnen met veel Onzuiverheden en littekens en ik kan met positiviteit zeggen dat mijn gezicht er heel egaal uitziet en mooi eruit ziet.",
    name: "Brayson",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer 6 jaar geleden",
    topics: ["acne", "littekens", "algemeen"],
  },
  {
    id: "salon-malika",
    quote:
      "Ik vind dat de therapeut de tijd had genomen om de onzuiverheden te verwijderen. En ze betrok mij bij het proces van wat de stappen waren.",
    name: "Malika",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer 6 jaar geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-jenna",
    quote:
      "Had gisteren een dermapen en carbonlaser afspraak. Mijn huid voelt meteen al glad aan en de puistjes verminderen nu al. Daarnaast ook hele lieve dames!",
    name: "Jenna",
    treatment: "Microneedling",
    stars: 5,
    relativeDate: "ongeveer 7 jaar geleden",
    topics: ["acne", "gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-sadaf",
    quote:
      "Ik ben gisteren geweest voor een gezichtsbehandeling. Mijn gezicht is na 1 behandeling weer helemaal in balans! Puisten weg en weer helemaal normaal. Dankjewel xx.",
    name: "Sadaf",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "meer dan 7 jaar geleden",
    topics: ["acne", "gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-yousra",
    quote:
      "Ik ben altijd onder de indruk geweest van Rojda. Mijn huid was er zo slecht aan toe. Nu niet meer. Op wat littekens na heb ik geen last meer van acne. Ben zo blij met haar.",
    name: "Yousra",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer 8 jaar geleden",
    topics: ["acne", "littekens", "algemeen"],
  },
  {
    id: "salon-suzanne",
    quote:
      "Ik wil je nogmaals heel erg bedanken. Dit is mijn 7e afspraak en mijn huid is nog nooit zo stralend geweest. Dit is de eerste zomer in 5 jaar tijd dat mijn huid helemaal glad is en ik geen acné meer heb.",
    name: "Suzanne",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer 8 jaar geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-fabienne",
    quote:
      "Ik heb een acne behandeling gehad van Rojda. Ze legde alles super fijn en gedetailleerd uit.",
    name: "Fabienne",
    treatment: "Acnetraject",
    stars: 5,
    relativeDate: "bijna 8 jaar geleden",
    topics: ["acne", "algemeen"],
  },
  {
    id: "salon-elif-b",
    quote:
      "Super fijne Hydrafacial behandeling gehad. Heb een hele mooie glow! Ook mijn littekens zijn voor het eerst behandeld dus ik verheug me op de voortgang van dit proces :) Dankjewel lieve Rojda.",
    name: "Elif",
    treatment: "HydraFacial",
    stars: 5,
    relativeDate: "bijna 4 jaar geleden",
    topics: ["littekens", "gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-devi",
    quote:
      "Mijn 2e behandeling gehad, dit keer een dermapen behandeling! Ik hoopte het stiekem al en had maar 2 kleine onstekingtjes dus het kon gelukkig! Hopen dat m’n littekens / vlekjes steeds minder worden. Tot over 3 weken!! X.",
    name: "Devi",
    treatment: "Microneedling",
    stars: 5,
    relativeDate: "meer dan 7 jaar geleden",
    topics: ["littekens", "gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-sara",
    quote:
      "Inmiddels 3 keer langs geweest voor de diodelaser en ik zie echt 80% verschil! Ook de littekens en vlekjes van mijn huid zijn zwaar verbeterd dankzij de dermapen. Sowieso forever vaste klant!!",
    name: "Sara",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 7 jaar geleden",
    topics: ["littekens", "laser", "gezichtsbehandeling"],
  },
  {
    id: "salon-andrijana-b",
    quote:
      "Ik heb een hele fijne ervaring gehad bij Demy. Goed geïnformeerd over hoe het proces (laseren) in zijn werking gaat. Ik ben gerustgesteld en goed geholpen. Jullie hebben er een nieuwe klant bij!",
    name: "Andrijana",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "5 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-amal",
    quote:
      "Zoals altijd weer top ervaring. Super vriendelijk en super tevreden met het laser(ontharing) resultaat.",
    name: "Amal",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "10 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-doenia-b",
    quote:
      "Weer super fijn en goed geholpen! Iris is een schat van een meid. Ik zie nauwelijks meer haar in mijn gezicht, en het groeit heel langzaam terug. Ik raad het zeker aan om te laseren bij Diba Clinics als je last hebt van PCOS en over beharing.",
    name: "Doenia",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "ongeveer een jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-janita",
    quote:
      "Gisteren was het laser ontharing, peeling gezicht en rug oftewel een grote beurt! Maar Andres zoals altijd ging overal kundig mee om en de gezelligheid ondanks de gevoelige behandelingen maakte het weer een top ervaring.",
    name: "Janita",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["laser", "gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-ecem",
    quote:
      "Het is altijd onwijs fijn om gelaserd te worden. Er word duidelijk gecommuniceerd en meegekeken met de haargroei. Indien nodig worden er dingen aangepast. Superfijn!",
    name: "Ecem",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-yousra-2",
    quote:
      "Heel fijn geholpen! Was mn eerste keer laseren, gerustgesteld en bijna als pijnloos ervaren ondanks dat ik super bang was!",
    name: "Yousra",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-dilan-b",
    quote:
      "Vandaag mijn gezicht wezen laseren bij Demi. Zoals altijd ging mevrouw vakkundig te werk. Het maakt dus niet uit wat voor behandeling je neemt. Bij Demi zit je in goede handen. Hou er van! Dankjewel weer en tot snel! :-).",
    name: "Dilan",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "ongeveer 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-sanae",
    quote:
      "Dit was mij eerste keer laseren, ik werd supper supperr goed ontvangen door de werknemers. Voelde me gelijk thuis!. Zaak was ook schoon en mooi. Tijdens de behandeling gaf de medewerker alles aan wat ze ging doen enzovoort. Ik voelde me op me gemak.",
    name: "Sanae",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "ongeveer 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-sherrise",
    quote:
      "Ik heb gisteren mijn 3e laserontharing behandeling gehad voor het gezicht en ik merk zoveel vooruitgang. Nu al super blij met de resultaten.",
    name: "Sherrise",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-natasja",
    quote:
      "Erg op mijn gemak gesteld tijdens een bikini laser ontharing. Ik had ook een verkeerde behandeling gekozen tijdens het online boeken, maar gelukkig kon het fijn opgelost worden in de kliniek!",
    name: "Natasja",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-erren",
    quote:
      "Behandeling bij Bahar gehad. Kom al een tijdje bij Diba om te laseren en ben tot nu toe bij iedereen tevreden die mij heeft behandeld!",
    name: "Erren",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-sherrise-2",
    quote:
      "Ik voel mij erg op mijn gemak bij het team van Diba clinics. Heldere uitleg, vriendelijke mensen en ik merk na 2 laserontharing behandelingen in mijn gezicht al zoveel verschil.",
    name: "Sherrise",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-michelle",
    quote:
      "Altijd fijn dat pijnloos laseren, super tevreden. Bijna haarvrij! Demi is ook gewoon top. Alles is top, niks op aan te merken.",
    name: "Michelle",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "ongeveer 3 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-monique",
    quote:
      "Ik vond de afspraak super! Alles is goed verlopen en bijna uitbehandeld met laseren! Demi is echt een zeer professionele huidspecialist zo dankbaar met haar! Voert haar werk heel nauwkeurig uit.",
    name: "Monique",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "meer dan 3 jaar geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-imane",
    quote:
      "Ik werd enorm goed geholpen. Ik voelde mij gehoord en er werd rekening gehouden met mijn behoeften. Ik werd na het consult meteen enthousiast en heb daarna een afspraak gemaakt voor een behandeling op advies. Ook de medewerkers zijn enorm klantvriendelijk.",
    name: "Imane",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "ongeveer een jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-astrid",
    quote:
      "Tijdens de intake duidelijke uitleg gehad over de scan/huidanalyse. Vervolgens uitleg gekregen over de aangeraden behandeling, alvorens er met de eerste behandeling werd begonnen. Fijne behandelaar en zeer vriendelijk!",
    name: "Astrid",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-robin",
    quote:
      "Heb de behandeling als zeer professioneel en plezierig ervaren. Vanaf het maken van de afspraak, de heldere intake over wat wel en niet mogelijk is en wat het kost, ben stipt op tijd geholpen en alles in een aangename sfeer.",
    name: "Robin",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "bijna 4 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-robin-2",
    quote:
      "Afspraak voor een intake was snel gemaakt omdat ik de kans kreeg een vrijgevallen afspraak over te nemen. Mooie cleane huidkliniek. Professioneel en plezierig geholpen door Andres en op basis van zijn advies vervolgafspraak gemaakt voor behandeling.",
    name: "Robin",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "ongeveer 4 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-maryam",
    quote:
      "Vanaf het moment dat ik binnen kwam ben ik goed geinformeerd. Ook tijdens de consult heb ik veel vragen kunnen stellen en is er goed meegedacht. Ik ben blij met het oprechte advies en de behandelkeuze en mogelijkheden daarin.",
    name: "Maryam",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan 4 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-oscaly",
    quote:
      "Mijn allereerste ervaring bij een huidtherapeut én met Andres was uitstekend! Hele informatieve en fijne intake. Direct een vervolg afspraak geboekt!",
    name: "Oscaly",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan 4 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-linda",
    quote:
      "Adviesgesprek gehad met een super lieve dame die je voorziet van volledige informatie en echt naar je luistert. Ik heb er vertrouwen in en kijk uit naar mijn eerste behandeling!",
    name: "Linda",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan 4 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-berivan",
    quote:
      "Fijne consult, er wordt echt tijd voor je gemaakt en gevraagd naar wat je fijn vindt. Wederom een hele fijne ervaring.",
    name: "Berivan",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan 5 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-hanane",
    quote:
      "Ik heb eerst een huidanalyse gekregen en daarna met de huidspecialiste doorgenomen welke treatment passend zou zijn. Hele fijne medewerkster die me ook gerust stelde en alles aangaf wat ze deed. Goede en fijne behandeling gehad. Zeker voor herhaling vatbaar.",
    name: "Hanane",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "bijna 6 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-siham",
    quote:
      "Na alle behandelingen die ik heb gehad ben ik zeer tevreden over jullie. Voornamelijk ook de behandelplan die jullie hebben opgesteld van producten die bij mijn huid passen.",
    name: "Siham",
    treatment: "Huidconsult",
    stars: 5,
    relativeDate: "meer dan 6 jaar geleden",
    topics: ["intake", "algemeen"],
  },
  {
    id: "salon-darifa-b",
    quote:
      "Ik blijf het telkens herhalen, maar ik ben al weer zo zo zo fijn geholpen door Iris! laserbehandeling en geëindigd met een gezichtsbehandeling was heel intens was. Ben zo blij dat ik terecht ben gekomen bij Diba clinic.",
    name: "Darifa",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-rachel-b",
    quote:
      "Ben zeer tevreden met het Gesprek wat plaats heeft Gevonden ze heeft ook alles goed uitgelegd ik voelde mij ook mijn gemak bij haar Ik kijk nu al uit op mijn eerste Peeling behandeling Met vriendelijke groet. Rachel Everaert.",
    name: "Rachel",
    treatment: "Peeling",
    stars: 5,
    relativeDate: "5 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-mienta",
    quote:
      "Op mijn 75e ben ik, via mijn dochter die hier al jaren klant is, terechtgekomen bij Diba Clinics. Het resultaat van mijn TCA-peelings is werkelijk iets wat ik nog nooit eerder heb ervaren. Daarnaast is de begeleiding en nazorg zeer professioneel en prettig.",
    name: "Mienta",
    treatment: "Peeling",
    stars: 5,
    relativeDate: "6 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-ouarda",
    quote:
      "Ik heb een fijne gezichtsbehandeling gehad bij Andres. Hij werkte professioneel en nam echt de tijd. Mijn huid voelde na afloop fris en verzorgd aan.",
    name: "Ouarda",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "8 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-yasemin-b",
    quote:
      "Weer een fijne behandeling gehad bij Diba door Iris. De Hydrafacial in combinatie met een peeling is echt een aanrader, mijn huid voelt fris en verzorgd aan. En die glow maakt het helemaal af!",
    name: "Yasemin",
    treatment: "HydraFacial",
    stars: 5,
    relativeDate: "8 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-maria",
    quote:
      "Anders heeft mij wederom heel fijn behandeld. Fijne peeling en masker. Mijn gezicht gaat super vooruit, zo fijn om tr zien. Ben super blij met Anders.",
    name: "Maria",
    treatment: "Peeling",
    stars: 5,
    relativeDate: "ongeveer een jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-hajar-b",
    quote:
      "Super fijne gezichtsbehandeling gehad! De producten die me zijn geadviseerd, vind ik ook heel erg fijn.",
    name: "Hajar",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "ongeveer een jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-yasemin-2",
    quote:
      "Heerlijk genoten van een Hydrafacial behandeling bij Iris! Mijn huid straalt weer en heeft die mooie glow terug. Bedankt team Diba, zoals altijd GLOW SKIN bij jullie!",
    name: "Yasemin",
    treatment: "HydraFacial",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-indy",
    quote:
      "Ik ben hier al een paar keer geweest voor de behandeling microneedling. En het is echt een top behandeling. Je krijgt er mooi resultaat mee. Het personeel is ook heel vriendelijk en denken heel erg met je mee en luisterd naar je wensen.",
    name: "Indy",
    treatment: "Microneedling",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-ezgi",
    quote:
      "Vandaag behandeld door de lieve en kundige Iris voor de skinpen/dermapen. Altijd blij met Diba clinics!",
    name: "Ezgi",
    treatment: "Microneedling",
    stars: 5,
    relativeDate: "meer dan een jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-darifa-2",
    quote:
      "Zo goed geholpen door Ires. G E W E L D I G. Nog nooit zo tevreden geweest gezichtsbehandeling & leaser behandeling gedaan.",
    name: "Darifa",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "bijna 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-selma-b",
    quote:
      "Een top gezichtsbehandeling gehad van Iris! Ze legde bij elke stap uit wat ze ging doen en waarvoor het dient. Ze nam echt de tijd voor me. Dat was heel fijn!",
    name: "Selma",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "bijna 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-yasemin-3",
    quote:
      "Heerlijke hydrafacial behandeling gehad door Iris. Super blij ermee en tevreden met team Diba! Dankjewel dames en heren.",
    name: "Yasemin",
    treatment: "HydraFacial",
    stars: 5,
    relativeDate: "ongeveer 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-rojda",
    quote:
      "Hele fijne Hydrafacial behandeling gehad door Iris. Wat een lieve meid! Bedankt en tot de volgende keer!",
    name: "Rojda",
    treatment: "HydraFacial",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-aleyna",
    quote:
      "Super fijn geholpen, er wordt echt aandachtig alles verteld en naar je wensen geluisterd. Zeker een aanrader. Los van alles als het je 1e keer gaat zijn dat je een gezichtsbehandeling wil nemen zou ik zeker hier willen aanraden!",
    name: "Aleyna",
    treatment: "Gezichtsbehandeling",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-liesbeth",
    quote:
      "Lief en kundig personeel. Ben goed geïnformeerd en ze hebben een plan gericht op mijn dunne huid gemaakt. Na 1 peeling zie ik al verschil in mijn huid. Zooo blij mee!",
    name: "Liesbeth",
    treatment: "Peeling",
    stars: 5,
    relativeDate: "meer dan 2 jaar geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-suheda",
    quote:
      "Ik voelde me heel erg gehoord, begrepen en werd op mijn gemak gesteld. Ik kijk uit naar de behandelingen en heb alvast productadvies en samples ontvangen om thuis mee aan de slag te gaan!",
    name: "Suheda",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer 12 uur geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-merve",
    quote:
      "Heerlijke behandeling bij Demi gehad. Altijd leuk om weer even bij te kletsen en hoe deskundig Demi met mijn huid omgaat.",
    name: "Merve",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "16 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-liesbeth-2",
    quote:
      "Super lieve behandelaar. Ze was heel lief en rustig en heeft alles duidelijk uitgelegd. Tot snel weer :).",
    name: "Liesbeth",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "23 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-maaike",
    quote:
      "Ik word altijd super fijn geholpen door Iris maar het zijn allemaal toppers! Ze hebben veel kennis en zijn op de hoogte van de nieuwste ontwikkelingen. Ik kom er nu al jaren en ga altijd zeer tevreden weg!",
    name: "Maaike",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "ongeveer een maand geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-lynette",
    quote:
      "Warme ontvangst en goede uitleg voor en gedurende het behandeling. Aandacht voor mijn gevoel en gemak. Aanrader!",
    name: "Lynette",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-seyma",
    quote:
      "Ik vond de behandeling weer zeer effectief en rustgevend. Altijd blij na een bezoek aan Diba en behandeling van Demi!",
    name: "Seyma",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-karen",
    quote:
      "Samen met Andrès mijn behandeling bespreken. Altijd goede advies, en goede behandeling. Naast goede behandeling ook fijne sfeer bij Dibaclinics.",
    name: "Karen",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-selma-2",
    quote:
      "Ik heb een hele fijne behandeling gehad bij Demi. Tijdens de hele behandeling legde ze rustig uit wat ze op dat moment deed, wat de volgende stap zou zijn en wat ik eventueel qua ongemak kon verwachten. Dat stelde mij erg gerust en vond ik ontzettend prettig.",
    name: "Selma",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-aylin-b",
    quote:
      "Kort samengevat is het team heel profesioneel en vriendelijk. Al mijn afspraken verlopen naar wens en ze jullie zijn heel deskundig in jullie vak!",
    name: "Aylin",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-rachel-2",
    quote:
      "Vriendelijk personeel ze geven ook een goede uitleg over je behandeling op 14,mei ga ik voor mijn tweede behandeling kijk er nu al naar uit.",
    name: "Rachel",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-gul",
    quote:
      "Ik word behulpzaam en netjes ontvangen en ben tevreden over de behandeling. Lieve medewerkers zoals Iris, Mellany, Demi, India en de anderen.",
    name: "Gul",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "5 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-mina-b",
    quote:
      "Tevreden met de tijd en aandacht die word genomen, de transparantie en het aanbod aan behandelingen en producten.",
    name: "Mina",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "5 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-dilan-2",
    quote:
      "Super tevreden mee! Elke keer weer goed geholpen en de behandeling verliep heel goed. Top medewerker!",
    name: "Dilan",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "5 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-saloua",
    quote:
      "Melanie is fantastisch. Zonder haar had ik de behandeling niet overleefd. Heb een zeer pijnlijke, maar super fijne/gezellige behandeling gehad.",
    name: "Saloua",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "6 maanden geleden",
    topics: ["algemeen"],
  },
] as const;
