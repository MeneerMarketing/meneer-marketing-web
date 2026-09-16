/**
 * Onderwerp-tags voor review-mining en filters.
 *
 * De eerste acht gaan over de klacht of de behandeling en staan in de data hieronder. De
 * rest gaat over het bezoek en wordt uit de tekst afgeleid, zie `review-onderwerpen.ts`;
 * hier in de data staat voor die reviews nog "algemeen", en dat woord betekent na het
 * verfijnen: kort en goed, zonder onderwerp.
 */
export type SalonizedReviewTopic =
  | "acne"
  | "littekens"
  | "pigment"
  | "rosacea"
  | "laser"
  | "huidveroudering"
  | "gezichtsbehandeling"
  | "intake"
  | "uitleg"
  | "vriendelijk"
  | "aandacht"
  | "vakkundig"
  | "service"
  | "sfeer"
  | "resultaat"
  | "terug"
  | "aanrader"
  | "algemeen";

/** Publieke Salonized-pagina — bron voor live reviews. */
export const SALONIZED_REVIEWS_URL =
  "https://dibaclinics.salonized.com/reviews" as const;

/** Stand opgehaald op Salonized (5 september 2026). */
export const SALONIZED_REVIEW_SUMMARY = {
  rating: 5.0,
  count: 3893,
  /* De Nederlandse vorm, en alleen te gebruiken in een zin die zelf een sleutel in het
     woordenboek is. Wat op het scherm komt gaat door `getal(count, taal)`: het Engels
     schrijft 3,893 en niet 3.893. */
  countFormatted: "3.893",
  sourceLabel: "Salonized",
} as const;

export type SalonizedReviewEntry = {
  readonly id: string;
  readonly quote: string;
  /** Dezelfde review in het Engels. Zie `lib/reviewtaal.ts` voor waarom hij hier staat. */
  readonly quoteEn?: string;
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
const UITGELICHT: readonly SalonizedReviewEntry[] = [
  {
    id: "salon-gladys",
    quote:
      "Ik heb een skin behandeling gehad, en de dame heeft me zo goed geholpen! Ze vertelde alles in stappen uit wat ze deed, en omdat ik een zeer gevoelige huid heb, was ze extra voorzichtig! Helemaal tevreden!",
    quoteEn:
      "I had a skin treatment, and the lady helped me so well! She explained everything she did in steps, and because I have very sensitive skin she was extra careful! Completely happy!",
    name: "Gladys",
    treatment: "Skinbehandeling",
    stars: 5,
    relativeDate: "6 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-loubna",
    quote: "Fijn geholpen en er werd tijd genomen.",
    quoteEn: "Helped nicely and they took their time.",
    name: "Loubna",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "10 dagen geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-diya",
    quote: "Echt een goede, professionele kliniek.",
    quoteEn: "A genuinely good, professional clinic.",
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
    quoteEn:
      "I had a treatment from Andres. A kind man who does his job with love and does it well. Along the way he also puts the client at ease by talking and listening and asking whether everything is okay. Good job!!",
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
    quoteEn:
      "I've now been to Diba twice and was helped very well both times. They take their time for you, explain everything well and you can ask any questions you have. I'll definitely be back at Diba!",
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
    quoteEn: "Got detailed and honest information. Friendly staff.",
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
    quoteEn:
      "After a long time I had a treatment with Rojda again. It was a lovely experience again. Together with Rojda we looked at which treatment suits me best. I enjoyed a wonderful Hydrafacial combined with a peel.",
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
    quoteEn:
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
    quoteEn:
      "A really lovely experience, an expert skin therapist. The feeling that I got honest advice. A lovely Hydrafacial treatment with explanation.",
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
    quoteEn:
      "Had my 7th SkinPen treatment and how happy I am with the result! Looked at the before and after photos today and what a difference!!! I am and will remain your loyal client!!",
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
    quoteEn:
      "Had a really lovely appointment. Andres helped me decide by taking all the considerations into account. Showed so much professionalism!",
    name: "Martyna",
    treatment: "Consult & behandeling",
    stars: 5,
    relativeDate: "Ongeveer 2 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-manisha",
    quote: "Zoals altijd goed geholpen met de laser!",
    quoteEn: "Helped well with the laser as always!",
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
    quoteEn:
      "I had a laser appointment with Demi today. It went nice and quickly and I feel very at ease with her. I'm very happy with my result so far and I can see clear progress! Very welcoming, professional and everything beautifully and neatly furnished too.",
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
    quoteEn:
      "I keep repeating it, but I was helped so nicely by Iris again! A laser treatment finished with a facial. I'm so glad I ended up at Diba Clinics.",
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
    quoteEn:
      "Good instructions and explanation from the therapist. Works very carefully. Discussed with the therapist what made sense for the treatment, given the sun. The treatment itself was manageable, somewhat painful but not beyond expectations. Very happy.",
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
    quoteEn:
      "Demi has helped me several times now and every time you notice how calmly, personally and professionally she works. You absolutely don't feel like a number. She really takes her time for you and clearly radiates a passion for her work.",
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
    quoteEn:
      "Every appointment goes really well. Iris is very friendly and professional, which always puts me at ease. She explains everything clearly, works carefully and takes her time for you.",
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
    quoteEn:
      "A warm welcome and a good explanation before and during the treatment. Attention for how I felt and my comfort. Recommend it!",
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
    quoteEn:
      "As always the expertise and client-friendliness are tip-top! Besides the treatment and the result, the service is very important too, and at Diba Clinics that's very well arranged thanks to the staff!",
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
    quoteEn:
      "My skin and I are always happy to see Iris! It was also really good that the clinic was wonderfully cool in this heatwave!",
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
    quoteEn:
      "Lovely clinic. I've been coming here for years for various treatments. Honest advice and always a lovely result!",
    name: "Danique",
    treatment: "Diverse behandelingen",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-alice-advies",
    quote: "Zorgvuldig en professioneel advies.",
    quoteEn: "Careful and professional advice.",
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
    quoteEn:
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
    quoteEn:
      "Happy with the personal service and the explanation behind the treatments and the products. Thank you!",
    name: "Mina",
    treatment: "Behandeling & productadvies",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-angelique",
    quote: "Ben bijzonder vriendelijk en deskundig geholpen!",
    quoteEn: "I was helped in a particularly friendly and expert way!",
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
    quoteEn:
      "Yesterday I had another SkinPen treatment with Melanie, and as always I walked out with a smile. She's a genuinely professional and engaged skin therapist who explains clearly what she's doing and why. I warmly recommend Diba Clinics.",
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
    quoteEn:
      "Always such a pleasant experience! I'm always taken through the steps properly and I leave mega happy.",
    name: "Mine",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-nancy",
    quote: "Fijne Fotona-behandeling gehad bij Iris.",
    quoteEn: "Had a lovely Fotona treatment with Iris.",
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
    quoteEn:
      "Always so happy when I've been here. Andres gives lovely, clear advice and really thinks along with you. From the moment you step inside it feels like you're truly seen. I'll always recommend Diba to people around me.",
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
    quoteEn:
      "Had a laser hair removal treatment and I'm very happy. The member of staff was incredibly friendly and professional, and put me at ease straight away. Definitely a lovely experience!",
    name: "Layla",
    treatment: "Laserontharing",
    stars: 5,
    relativeDate: "3 maanden geleden",
    topics: ["laser", "algemeen"],
  },
  {
    id: "salon-fleur",
    quote: "Word altijd goed en lief geholpen! En krijg het beste advies.",
    quoteEn: "Always helped well and kindly! And I get the best advice.",
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
    quoteEn:
      "Lovely clear explanation about the treatment before it starts. You're given good tips for after the treatment.",
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
    quoteEn:
      "From the very first moment at the intake I felt at ease and taken seriously, which was extra important to me because this has always been a barrier for me (laser). The treatments are carried out in a professional and expert way, with a lot of attention for safety, hygiene and personal guidance. You don't feel like a number here, but genuinely seen and heard.",
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
    quoteEn:
      "Helped sooo incredibly well, she told me everything she was doing, so friendly! I'd love to be with her again for my next appointment.",
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
    quoteEn:
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
    quoteEn: "Always helped nicely. Professional staff and a great result!",
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
    quoteEn:
      "I had a treatment based on advice. Iris is so kind and very competent. I felt at ease straight away! Very happy already.",
    name: "Rahime",
    treatment: "Behandeling bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-elif",
    quote: "Voor alle behandelingen zijn jullie super professioneel.",
    quoteEn: "You're so professional for all the treatments.",
    name: "Elif",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-yasemin",
    quote: "Mijn eerste behandeling na 3 jaar en ben er super tevreden over!",
    quoteEn: "My first treatment in 3 years and I'm so happy with it!",
    name: "Yasemin",
    treatment: "Behandeling Diba Clinics",
    stars: 5,
    relativeDate: "Ongeveer een maand geleden",
    topics: ["algemeen"],
  },
  {
    id: "salon-sorbir",
    quote: "Fijne medewerkers.",
    quoteEn: "Lovely staff.",
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
    quoteEn:
      "When it comes to my skin I trust no one but Diba! A client for over 7/8 years. It feels so good to have a facial every 2 months. Thank you dear Iris and team Diba.",
    name: "Yasemin",
    treatment: "Gezichtsbehandeling bij Iris",
    stars: 5,
    relativeDate: "4 maanden geleden",
    topics: ["gezichtsbehandeling", "algemeen"],
  },
  {
    id: "salon-cheline",
    quote: "Andres is the best I love him",
    quoteEn: "Andres is the best I love him",
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
    quoteEn:
      "Helped brilliantly again today! I've now been four times, for IPL against redness among other things. Helped by lovely and skilled ladies, who make sure you want for nothing. I'll definitely keep coming here!",
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
    quoteEn:
      "I'm always helped really well at Diba Clinics, and very kind staff too!",
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
    quoteEn:
      "Staff who know what they're talking about, had a lovely treatment. A beautiful clinic and friendly staff!",
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
    quoteEn:
      "Went to Diba Clinics for the first time. Andres did a skin scan on me and had a look, and then we talked about the plan. He clearly explained which treatment I need and the products my skin needs. Thank you Andres for your friendliness and see you again soon!",
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
    quoteEn:
      "I felt very at ease and you could tell that Grissel has a lot of knowledge. She advised me well and what I also really liked is that she didn't immediately push all kinds of products or treatments on me, but genuinely took the time to look at my skin and tell me what suits me.",
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
    quoteEn:
      "A really lovely, kind lady helped me! Gives good advice and says in good time what she's going to do. The dermapen was a bit painful but I was guided through it well!",
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
    quoteEn:
      "I'm very happy with the consultation that took place. She explained everything well and I felt at ease with her. I'm looking forward to my first peel treatment.",
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
    quoteEn:
      "I'm very happy with the treatments and the results. My acne has completely gone since I've been treated here and now we're working on the scars (I'm starting to notice a difference there too). The staff are very kind and professional!",
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
    quoteEn:
      "I was treated by Demi for the first time today. A really lovely girl, knows what she's doing and takes you into account and listens to you. I have PCOS myself, and now I only have baby hairs on my face. I'm so happy!",
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
    quoteEn:
      "I had a really lovely experience with Demi. Well informed about how the process (lasering) works. I was put at ease and helped well. You've got a new client!",
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
    quoteEn:
      "Over the past few years we've achieved wonderful results, from severe acne to my dream skin! I'm genuinely incredibly happy with the Diba Clinics team and with Iris in particular.",
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
    quoteEn:
      "I'm really happy with my SkinPen treatment with Iris. The treatment was professional, and they looked carefully at what my skin needed.",
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
    quoteEn:
      "Went to Andres for the treatment for the first time. Really lovely that they took into account that I wear a headscarf by offering an extra cap that completely covers my hair. Top service!",
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
    quoteEn:
      "Andres, thank you for your attention, professionalism, good company and expertise! Had a really lovely appointment at Diba Clinics, as usual.",
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
    quoteEn:
      "The stars at Diba are so friendly! I never let anyone but Diba treat my skin, and I'm rid of my long-term acne.",
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
    quoteEn:
      "I've now had 2 dermapen treatments (2 acne treatments before that). The result is genuinely lovely. Fewer scar marks on my face and no acne for 4 months now. That's partly down to my diet too. I finally dare to leave the house without make-up :).",
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
    quoteEn:
      "Very happy overall. I came in the first time with a lot of blemishes and scars and I can say with positivity that my face looks very even and lovely.",
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
    quoteEn:
      "I felt the therapist had taken the time to remove the blemishes. And she involved me in the process of what the steps were.",
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
    quoteEn:
      "Had a dermapen and carbon laser appointment yesterday. My skin already feels smooth and the spots are reducing already. Really lovely ladies too!",
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
    quoteEn:
      "I came in yesterday for a facial. My face is completely back in balance after 1 treatment! Spots gone and completely normal again. Thank you xx.",
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
    quoteEn:
      "I've always been impressed by Rojda. My skin was in such a bad state. Not any more. Apart from a few scars I no longer have any trouble with acne. I'm so happy with her.",
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
    quoteEn:
      "I want to thank you so much again. This is my 7th appointment and my skin has never been this radiant. This is the first summer in 5 years that my skin is completely smooth and I no longer have acne.",
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
    quoteEn:
      "I had an acne treatment from Rojda. She explained everything really nicely and in detail.",
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
    quoteEn:
      "Had a really lovely Hydrafacial treatment. I have such a lovely glow! My scars have been treated for the first time too so I'm looking forward to the progress of this process :) Thank you dear Rojda.",
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
    quoteEn:
      "Had my 2nd treatment, a dermapen treatment this time! I was secretly hoping for it and only had 2 small inflammations so luckily it was possible! Hoping my scars / spots keep getting less. See you in 3 weeks!! X.",
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
    quoteEn:
      "I've been by 3 times now for the diode laser and I genuinely see an 80% difference! The scars and spots on my skin have hugely improved too thanks to the dermapen. A forever regular anyway!!",
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
    quoteEn:
      "I had a really lovely experience with Demy. Well informed about how the process (lasering) works. I was put at ease and helped well. You've got a new client!",
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
    quoteEn:
      "Another great experience as always. So friendly and so happy with the laser (hair removal) result.",
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
    quoteEn:
      "Helped really nicely and well again! Iris is a sweetheart of a girl. I hardly see any hair on my face any more, and it grows back very slowly. I'd definitely recommend lasering at Diba Clinics if you have PCOS and excess hair.",
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
    quoteEn:
      "Yesterday it was laser hair removal, a face and back peel, in other words the full works! But Andres handled it all skilfully as always and the good company despite the sensitive treatments made it a great experience again.",
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
    quoteEn:
      "It's always incredibly nice to be lasered. They communicate clearly and keep an eye on the hair growth. Things are adjusted if needed. Really lovely!",
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
    quoteEn:
      "Helped really nicely! It was my first time lasering, I was put at ease and it felt almost painless even though I was really scared!",
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
    quoteEn:
      "Had my face lasered by Demi today. As always she worked expertly. So it doesn't matter which treatment you have. With Demi you're in good hands. Love it! Thank you again and see you soon! :-).",
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
    quoteEn:
      "This was my first time lasering, and I was welcomed reallyyy well by the staff. I felt at home straight away!. The place was clean and beautiful too. During the treatment the staff member told me everything she was going to do and so on. I felt at ease.",
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
    quoteEn:
      "I had my 3rd laser hair removal treatment for my face yesterday and I notice so much progress. Already so happy with the results.",
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
    quoteEn:
      "Really put at ease during a bikini laser hair removal. I'd also chosen the wrong treatment when booking online, but luckily it could be sorted out nicely at the clinic!",
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
    quoteEn:
      "Had a treatment with Bahar. I've been coming to Diba for laser for a while now and so far I've been happy with everyone who has treated me!",
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
    quoteEn:
      "I feel very at ease with the Diba clinics team. Clear explanation, friendly people and after 2 laser hair removal treatments on my face I already notice such a difference.",
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
    quoteEn:
      "That painless lasering is always lovely, very happy. Almost hair-free! Demi is just brilliant too. Everything is great, nothing to fault.",
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
    quoteEn:
      "I thought the appointment was great! Everything went well and I'm nearly finished with the lasering! Demi is genuinely a very professional skin specialist, so grateful for her! She does her work very precisely.",
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
    quoteEn:
      "I was helped enormously well. I felt heard and my needs were taken into account. After the consultation I was immediately enthusiastic and then booked an appointment for a treatment based on advice. The staff are enormously client-friendly too.",
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
    quoteEn:
      "During the intake I got a clear explanation about the scan/skin analysis. Then I got an explanation about the recommended treatment, before the first treatment was started. A lovely therapist and very friendly!",
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
    quoteEn:
      "I found the treatment very professional and pleasant. From booking the appointment to the clear intake about what is and isn't possible and what it costs, I was seen right on time and everything in a pleasant atmosphere.",
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
    quoteEn:
      "The intake appointment was made quickly because I got the chance to take over a cancellation. Lovely clean skin clinic. Professionally and pleasantly helped by Andres and booked a follow-up treatment based on his advice.",
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
    quoteEn:
      "From the moment I came in I was well informed. During the consultation I could ask a lot of questions too and they thought along with me well. I'm happy with the genuine advice and the choice of treatment and the options within it.",
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
    quoteEn:
      "My very first experience at a skin therapist and with Andres was excellent! A very informative and lovely intake. Booked a follow-up appointment straight away!",
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
    quoteEn:
      "Had a consultation with a really lovely lady who gives you complete information and truly listens to you. I have confidence in it and I'm looking forward to my first treatment!",
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
    quoteEn:
      "Lovely consultation, they really make time for you and ask what you like. Another really lovely experience.",
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
    quoteEn:
      "First I had a skin analysis and then went through with the skin specialist which treatment would be suitable. A really lovely member of staff who also put me at ease and told me everything she was doing. Had a good and lovely treatment. Definitely worth repeating.",
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
    quoteEn:
      "After all the treatments I've had I'm very happy with you. Especially the treatment plan you put together of products that suit my skin.",
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
    quoteEn:
      "I keep repeating it, but I was helped so so so nicely by Iris again! A laser treatment finished with a facial, which was very intense. I'm so glad I ended up at Diba clinic.",
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
    quoteEn:
      "I'm very happy with the consultation that took place, she also explained everything well and I felt at ease with her. I'm already looking forward to my first Peel treatment. Kind regards. Rachel Everaert.",
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
    quoteEn:
      "At 75, through my daughter who has been a client here for years, I ended up at Diba Clinics. The result of my TCA peels is truly something I've never experienced before. On top of that the guidance and aftercare are very professional and pleasant.",
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
    quoteEn:
      "I had a lovely facial with Andres. He worked professionally and really took his time. My skin felt fresh and cared for afterwards.",
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
    quoteEn:
      "Had another lovely treatment at Diba from Iris. The Hydrafacial combined with a peel is genuinely worth recommending, my skin feels fresh and cared for. And that glow finishes it off completely!",
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
    quoteEn:
      "Andres treated me really nicely again. Lovely peel and mask. My face is improving so much, so good to see. I'm really happy with Andres.",
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
    quoteEn:
      "Had a really lovely facial! I also really like the products that were recommended to me.",
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
    quoteEn:
      "Thoroughly enjoyed a Hydrafacial treatment with Iris! My skin is glowing again and has that lovely glow back. Thank you team Diba, GLOW SKIN at yours as always!",
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
    quoteEn:
      "I've been here a few times now for microneedling. And it's genuinely a great treatment. You get a lovely result from it. The staff are very friendly too and really think along with you and listen to what you want.",
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
    quoteEn:
      "Treated today by the lovely and skilled Iris for the skinpen/dermapen. Always happy with Diba clinics!",
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
    quoteEn:
      "Helped so well by Iris. W O N D E R F U L. I've never been so happy, had a facial & laser treatment.",
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
    quoteEn:
      "Had a great facial from Iris! At every step she explained what she was going to do and what it's for. She really took her time for me. That was lovely!",
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
    quoteEn:
      "Had a wonderful hydrafacial treatment from Iris. So happy with it and happy with team Diba! Thank you ladies and gentlemen.",
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
    quoteEn:
      "Had a really lovely Hydrafacial treatment from Iris. What a lovely girl! Thank you and see you next time!",
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
    quoteEn:
      "Helped really nicely, everything is explained attentively and they listen to what you want. Definitely recommend it. Apart from anything else, if it's going to be your first time having a facial I'd definitely recommend here!",
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
    quoteEn:
      "Kind and skilled staff. I was well informed and they made a plan aimed at my thin skin. After 1 peel I can already see a difference in my skin. Sooo happy with it!",
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
    quoteEn:
      "I felt really heard, understood and put at ease. I'm looking forward to the treatments and I've already received product advice and samples to get started with at home!",
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
    quoteEn:
      "Had a wonderful treatment with Demi. Always nice to catch up and to see how expertly Demi handles my skin.",
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
    quoteEn:
      "A really lovely therapist. She was very kind and calm and explained everything clearly. See you again soon :).",
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
    quoteEn:
      "I'm always helped really nicely by Iris but they're all stars! They have a lot of knowledge and are up to date with the newest developments. I've been coming for years now and I always leave very happy!",
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
    quoteEn:
      "A warm welcome and a good explanation before and during the treatment. Attention for how I felt and my comfort. Recommend it!",
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
    quoteEn:
      "I found the treatment very effective and calming again. Always happy after a visit to Diba and a treatment from Demi!",
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
    quoteEn:
      "Discussing my treatment together with AndrÃ¨s. Always good advice, and a good treatment. Besides a good treatment there's a lovely atmosphere at Dibaclinics too.",
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
    quoteEn:
      "I had a really lovely treatment with Demi. Throughout the whole treatment she calmly explained what she was doing at that moment, what the next step would be and what discomfort I might expect. That put me really at ease and I found it incredibly pleasant.",
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
    quoteEn:
      "In short, the team is very professional and friendly. All my appointments go just as I'd want and you're all very expert at your craft!",
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
    quoteEn:
      "Friendly staff, they also give a good explanation about your treatment. On 14 May I'm going for my second treatment, already looking forward to it.",
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
    quoteEn:
      "I'm welcomed helpfully and nicely and I'm happy with the treatment. Lovely staff like Iris, Mellany, Demi, India and the others.",
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
    quoteEn:
      "Happy with the time and attention that's taken, the transparency and the range of treatments and products.",
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
    quoteEn:
      "So happy with it! Helped well every time and the treatment went really well. Top member of staff!",
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
    quoteEn:
      "Melanie is fantastic. I wouldn't have survived the treatment without her. Had a very painful but really lovely/enjoyable treatment.",
    name: "Saloua",
    treatment: "Bezoek Diba Clinics",
    stars: 5,
    relativeDate: "6 maanden geleden",
    topics: ["algemeen"],
  },
] as const;

/**
 * Dezelfde review, twee keer.
 *
 * WAT YASIN ZAG. Op /laserontharing stonden twee van de drie kaarten met dezelfde tekst:
 * "Ik heb een hele fijne ervaring gehad bij Demi" naast "... bij Demy", allebei van
 * Andrijana. 15 september 2026: "ik zie hier 2 x dezelfde review waarom gebeurd dat."
 *
 * WAAR HET VANDAAN KOMT. Niet uit de opmaak. Het staat zo op Salonized: een klant die vaker
 * komt schrijft na elk bezoek ongeveer hetzelfde, en dan staat dat er twee keer, maanden uit
 * elkaar en met een woord verschil. Vier van zulke stellen zitten in deze lijst. Dat het
 * juist die twee op het scherm haalde is geen toeval: de keuze in `ReviewsBijOnderwerp`
 * zoekt drie reviews van gelijke lengte, en twee bijna gelijke teksten zijn bijna even lang.
 *
 * WAAROM ER NIETS UIT DE DATA GAAT. Het zijn allebei echte reviews van een echt bezoek, en
 * het archief op /reviews hoort alles te tonen wat Salonized heeft (zie
 * `reviews-archief.ts`). Deze lijst is iets anders: een uitgelichte set, en daarin hoort een
 * verhaal één keer. De ruwe lijst blijft dus zoals hij is opgehaald en de export eroverheen
 * laat per verhaal de nieuwste staan.
 *
 * WAAROM 0,80. Gemeten over alle 7.381 stellen in deze lijst (scratch/gelijkenis-reviews.mjs):
 * de vier dubbele zitten op 0,99, 0,97, 0,93 en 0,84, en het hoogste stel dat écht twee
 * verschillende reviews is zit op 0,67. Daartussen is niets. De grens ligt in dat gat, met
 * ruimte aan beide kanten.
 */

/** Alleen de letters: hoofdletters, leestekens en accenten zeggen hier niets. */
function kaal(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Hoeveel lijken twee teksten op elkaar, van 0 tot 1.
 *
 * Dice over letterparen. Dat telt niet hoeveel woorden er gelijk zijn maar hoeveel
 * opeenvolgende lettertweetallen, en daardoor haalt "Demi" tegen "Demy" de gelijkenis
 * nauwelijks omlaag terwijl twee losse reviews over hetzelfde onderwerp er niet in de buurt
 * komen.
 */
function gelijkenis(a: string, b: string): number {
  const paren = (t: string) => {
    const uit = new Map<string, number>();
    for (let i = 0; i < t.length - 1; i++) {
      const p = t.slice(i, i + 2);
      uit.set(p, (uit.get(p) ?? 0) + 1);
    }
    return uit;
  };
  const pa = paren(a);
  const pb = paren(b);
  let gedeeld = 0;
  for (const [p, n] of pa) gedeeld += Math.min(n, pb.get(p) ?? 0);
  const totaal = a.length - 1 + (b.length - 1);
  return totaal > 0 ? (2 * gedeeld) / totaal : 0;
}

const ZELFDE_VERHAAL = 0.8;

/** Hoe lang geleden, in dagen. Alleen om te bepalen welke van twee de nieuwste is. */
function dagenGeleden(datum: string | undefined): number {
  if (!datum) return Number.MAX_SAFE_INTEGER;
  const tekst = datum.toLowerCase();
  const aantal = Number(tekst.match(/\d+/)?.[0] ?? 1);
  if (/\buur\b/.test(tekst)) return aantal / 24;
  if (/\bdag(en)?\b/.test(tekst)) return aantal;
  if (/\bweken?\b/.test(tekst)) return aantal * 7;
  if (/\bmaand(en)?\b/.test(tekst)) return aantal * 30;
  if (/\bjaar|jaren\b/.test(tekst)) return aantal * 365;
  return Number.MAX_SAFE_INTEGER;
}

function ontdubbeld(
  lijst: readonly SalonizedReviewEntry[],
): readonly SalonizedReviewEntry[] {
  const teksten = lijst.map((r) => kaal(r.quote));
  const weg = new Set<string>();

  for (let i = 0; i < lijst.length; i++) {
    if (weg.has(lijst[i].id)) continue;
    for (let j = i + 1; j < lijst.length; j++) {
      if (weg.has(lijst[j].id)) continue;
      /* Onder de vijfentwintig letters is gelijkenis niets waard: "Fijn geholpen" lijkt
         dan op elke andere korte review, en dat zijn wel degelijk losse reviews. */
      if (teksten[i].length < 25 || teksten[j].length < 25) continue;
      if (gelijkenis(teksten[i], teksten[j]) < ZELFDE_VERHAAL) continue;
      const ouder =
        dagenGeleden(lijst[i].relativeDate) >=
        dagenGeleden(lijst[j].relativeDate)
          ? lijst[i]
          : lijst[j];
      weg.add(ouder.id);
    }
  }

  return lijst.filter((r) => !weg.has(r.id));
}

/**
 * De uitgelichte reviews, met elk verhaal één keer.
 *
 * Wat eruit valt staat nog gewoon op /reviews: dat toont het hele archief.
 */
export const SALONIZED_REVIEWS: readonly SalonizedReviewEntry[] =
  ontdubbeld(UITGELICHT);
