import type { PillarSlug } from "@/lib/navigation";

export interface PillarStat {
  label: string;
  value: string;
}

export interface PillarProcessStep {
  title: string;
  body: string;
}

export interface PillarPageData {
  slug: PillarSlug;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  headline: string;
  subheadline: string;
  stats: PillarStat[];
  introParagraphs: string[];
  angleTitle: string;
  angleBody: string;
  serviceIntro: string;
  processTitle: string;
  processSteps: PillarProcessStep[];
  proofTitle: string;
  proofBody: string;
  ctaTitle: string;
  ctaBody: string;
}

export const pillarPages: Record<PillarSlug, PillarPageData> = {
  strategie: {
    slug: "strategie",
    metaTitle: "Strategie | eerst het plan, dan pas budget | Meneer Marketing",
    metaDescription:
      "Welk kanaal, welke volgorde, welk budget? Ik reken het door vóór je euro's verbrandt. Geen PDF in een la, wel een plan dat ik ook uitvoer.",
    keywords: [
      "marketingstrategie",
      "groeiplan bedrijf",
      "online marketing plan",
      "marketing bureau strategie",
      "conversie optimalisatie",
      "leadgeneratie",
    ],
    headline: "Eerst het plan. Dan pas de euro's.",
    subheadline:
      "De meeste marketing mislukt niet door slechte uitvoering maar door een ontbrekend plan. Wij bepalen eerst waar jouw groei zit. Daarna gaan we bouwen.",
    stats: [
      { label: "Start", value: "Doelen · data · marge" },
      { label: "Output", value: "Plan · prioriteit · budget" },
      { label: "Ritme", value: "Meten · bijsturen · schalen" },
    ],
    introParagraphs: [
      "Iedereen kan een advertentie aanzetten. De vraag is of dat op dit moment de slimste euro is. Soms verdient je site eerst aandacht, soms je e-mail, soms je vindbaarheid. Wij rekenen dat door voordat je budget uitgeeft.",
      "Voor BestRest bedachten we een eigen aanpak per product in plaats van één generieke funnel. Dat is precies het punt van strategie: jouw markt, jouw marge en jouw klant bepalen de route. Niet het trucje dat bij een ander werkte.",
    ],
    angleTitle: "Strategie die ook uitgevoerd wordt",
    angleBody:
      "Een plan zonder uitvoering is een duur PDF-bestand. Omdat wij ook bouwen, adverteren en optimaliseren, blijft de strategie geen papier. Je ziet per kwartaal wat er gebeurt, wat het kost en wat het oplevert.",
    serviceIntro:
      "Van groeiplan tot conversie-optimalisatie en meetbaarheid: dit zijn de trajecten binnen strategie.",
    processTitle: "Zo komt jouw groeiplan tot stand",
    processSteps: [
      {
        title: "Cijfers boven meningen",
        body: "We duiken in je data: waar komt omzet vandaan, waar lekt het weg en wat kost een klant je nu echt?",
      },
      {
        title: "Kanalen kiezen",
        body: "Niet alles tegelijk. We kiezen de twee of drie kanalen waar jouw groei het snelst zit en leggen uit waarom.",
      },
      {
        title: "Plan met prijskaartje",
        body: "Je krijgt een concreet plan: wat we doen, in welke volgorde, wat het kost en wat je mag verwachten.",
      },
      {
        title: "Uitvoeren en bijsturen",
        body: "Elke maand kijken we wat werkt. Wat werkt krijgt meer budget, wat niet werkt gaat eruit. Zonder sentiment.",
      },
    ],
    proofTitle: "Waarom volgorde alles is",
    proofBody:
      "SkinComplete stond eerst bovenaan in Google en had mailautomatisering draaien vóór de advertenties aangingen. Daardoor kwam elke advertentie-euro binnen op een site die al converteerde. Dat is het verschil tussen budget verbranden en budget investeren.",
    ctaTitle: "Klaar om te weten waar je groei zit?",
    ctaBody:
      "Geen losse acties meer. We brengen je doelen, data en kanalen in kaart en maken er een plan van dat we ook echt uitvoeren. Start met de intake.",
  },
  bouwen: {
    slug: "bouwen",
    metaTitle: "Bouwen | websites & Shopify from scratch | Meneer Marketing",
    metaDescription:
      "Geen templates, geen page builders. Custom sites en Shopify-shops, snel genoeg voor SEO, strak genoeg voor ads. Ik bouw het fundament achter je groei.",
    keywords: [
      "website laten bouwen",
      "Shopify development",
      "webdevelopment Nederland",
      "custom website from scratch",
      "web app ontwikkeling",
      "website snelheid optimalisatie",
    ],
    headline: "Bouwen zonder plafond.",
    subheadline:
      "Van Shopify-webshops tot websites from scratch en web-apps: alles custom build, snel en klaar voor marketing, koppelingen en groei.",
    stats: [
      { label: "Focus", value: "Snelheid · SEO · veiligheid" },
      { label: "Platforms", value: "Shopify · Next.js · custom" },
      { label: "Werkwijze", value: "Stap voor stap · transparant" },
    ],
    introParagraphs: [
      "De meeste traagheid op het web komt niet van één plugin, maar van keuzes die niet passen: een template dat niet klopt, apps die botsen, content zonder structuur. Wij keren dat om: eerst een goed plan, dan pas bouwen.",
      "Of je nu een internationale webshop, een site met honderden pagina's of een klantportaal nodig hebt: het fundament moet hetzelfde doen. Snel laden, makkelijk beheren, en ruimte om te groeien zonder alles opnieuw te moeten doen.",
    ],
    angleTitle: "Waarom Meneer Marketing anders bouwt",
    angleBody:
      "We denken vanuit groei: wat gebeurt er als verkeer verdubbelt, als je nieuwe markten opent, als je marketing strakkere landingspagina's nodig heeft? Daarom combineren we strakke frontends met robuuste koppelingen, logging en documentatie. Geen black box.",
    serviceIntro:
      "Van websites en webshops tot design, merk en motion: dit zijn de bouwtrajecten.",
    processTitle: "Zo loopt een bouwtraject",
    processSteps: [
      {
        title: "Discovery & stack-match",
        body: "We brengen doelen, verkeer, integraties en team-skill in kaart. Geen scope-creep zonder rationale.",
      },
      {
        title: "Architectuur & ontwerp",
        body: "Informatiestructuur, componenten en performance-budget vóór we massaal pixels of secties bouwen.",
      },
      {
        title: "Build, test, launch",
        body: "Iteratieve oplevering, harde checks op Core Web Vitals en regressies, en een launch die marketing niet lamlegt.",
      },
      {
        title: "Overdracht & doorontwikkeling",
        body: "Je krijgt duidelijke repos, documentatie en een roadmap voor doorontwikkeling. Met of zonder ons.",
      },
    ],
    proofTitle: "Waar je direct winst pakt",
    proofBody:
      "Snelheid en stabiliteit converteren. En maken SEO en ads goedkoper. Voor SkinComplete bouwden we naast de shop ook een compleet B2B-portaal in Shopify. Wij meten voor en na, koppelen dat aan je analytics en vertalen het naar concrete volgende stappen.",
    ctaTitle: "Klaar om te bouwen zonder plafond?",
    ctaBody:
      "Van Shopify-shop tot webapp: we tekenen het fundament, kiezen de stack en leggen vast wat wanneer live gaat. Start met een intake en we maken het concreet.",
  },
  vindbaarheid: {
    slug: "vindbaarheid",
    metaTitle: "Vindbaarheid | SEO, Google én ChatGPT | Meneer Marketing",
    metaDescription:
      "Organisch verkeer is gratis verkeer. SEO, AI-antwoorden, Maps en reviews. Ik zorg dat je klopt waar mensen zoeken, ook buiten Google.",
    keywords: [
      "SEO bureau Nederland",
      "vindbaar in ChatGPT",
      "Vindbaarheid in AI-antwoorden",
      "lokale SEO",
      "contentmarketing",
      "Google reviews verbeteren",
    ],
    headline: "Gevonden worden. Overal waar je klant zoekt.",
    subheadline:
      "Google is niet meer de enige plek waar klanten zoeken. Wij maken je vindbaar in zoekmachines, AI-assistenten, Maps en op de plekken waar reviews de doorslag geven.",
    stats: [
      { label: "SEO", value: "Content · techniek" },
      { label: "AI-antwoorden", value: "ChatGPT · Gemini" },
      { label: "Lokaal", value: "Maps · reviews" },
    ],
    introParagraphs: [
      "Hier een feit dat veel ondernemers missen: een groeiend deel van je klanten vraagt eerst aan ChatGPT of Gemini welk bedrijf ze moeten kiezen. Sta jij niet in dat antwoord, dan ben je voor hen geen optie meer.",
      "Vindbaarheid is daarom breder geworden dan SEO alleen. Het is de combinatie van goede content, een technisch kloppende site, lokale aanwezigheid en reviews die vertrouwen geven. Wij pakken die keten als geheel op, want de onderdelen versterken elkaar.",
    ],
    angleTitle: "SEO die bovenaan scoort. Organisch verkeer is gratis.",
    angleBody:
      "Ik ben SEO-expert op hoog niveau: landingspagina's op wat klanten echt zoeken, techniek die Google vertrouwt, content die blijft ranken. Dat levert gratis verkeer op, maand na maand. Sterke SEO staat op zich al. Ads kunnen later en worden dan goedkoper. SkinComplete bewees het: bovenaan in Google vóór er één euro aan ads ging.",
    serviceIntro:
      "Van klassieke SEO tot AI-antwoorden en reviews: dit zijn de trajecten binnen vindbaarheid.",
    processTitle: "Zo bouwen we je vindbaarheid op",
    processSteps: [
      {
        title: "Zoekgedrag in kaart",
        body: "Wat typt en vraagt jouw klant, in Google én aan AI? Daar richten we structuur en content op in.",
      },
      {
        title: "Techniek op orde",
        body: "Snelheid, structuur en schema-markup. De onzichtbare laag die bepaalt of zoekmachines je begrijpen.",
      },
      {
        title: "Content die antwoordt",
        body: "Landingspagina's op wat klanten echt typen. Geen opgeblazen blogkalender. Wel pagina's die bovenaan scoren.",
      },
      {
        title: "Autoriteit uitbouwen",
        body: "Reviews, vermeldingen en interne structuur die je positie vasthouden als concurrenten wakker worden.",
      },
    ],
    proofTitle: "Vindbaarheid is een bezit, geen kostenpost",
    proofBody:
      "Advertenties stoppen zodra je budget stopt. Een sterke organische positie blijft klanten opleveren, maand na maand. Daarom behandelen we vindbaarheid als investering: meetbaar in posities, verkeer en omzet per pagina.",
    ctaTitle: "Klaar om overal gevonden te worden?",
    ctaBody:
      "We checken waar je nu staat in Google én in AI-antwoorden, en welke stappen het snelst traffic en vertrouwen opleveren. Start met de intake.",
  },
  campagnes: {
    slug: "campagnes",
    metaTitle: "Campagnes | Google Ads, Meta & creators | Meneer Marketing",
    metaDescription:
      "Ads die converteren omdat landingspagina en meting kloppen. Google Ads, Meta Ads, UGC en influencers. Budget naar wat rendeert, weg met wat verbrandt.",
    keywords: [
      "Google Ads specialist",
      "Meta Ads bureau",
      "social media marketing",
      "UGC content",
      "influencer marketing",
      "Bol Amazon verkopen",
    ],
    headline: "Klanten halen. Zonder budget te verbranden.",
    subheadline:
      "Google Ads, Meta Ads, social, creators en marketplaces: wij zetten de kanalen in die bij jouw marge passen en meten elke euro terug.",
    stats: [
      { label: "Ads", value: "Google · Meta" },
      { label: "Creators", value: "UGC · social" },
      { label: "Sturing", value: "ROAS · CPA" },
    ],
    introParagraphs: [
      "Adverteren is simpel te starten en makkelijk te verpesten. Het verschil zit in de voorbereiding: klopt je meting, klopt je landingspagina en klopt de belofte in je advertentie met wat de klant daarna ziet?",
      "Daarnaast verandert het speelveld: koude advertenties worden duurder, terwijl content van echte mensen (UGC en creators) juist beter presteert. Wij combineren beide werelden en verschuiven budget naar waar het rendeert.",
    ],
    angleTitle: "Ads en content uit één hand",
    angleBody:
      "De beste campagne faalt op een trage landingspagina, en de beste creator-video verzuipt zonder goede targeting. Omdat wij zowel de techniek als de campagnes doen, lossen we het probleem op waar het echt zit. Niet waar de dienstverlener toevallig verstand van heeft.",
    serviceIntro:
      "Van Google en Meta tot creators en marketplaces: dit zijn de campagnetrajecten.",
    processTitle: "Zo bouwen we je campagnes op",
    processSteps: [
      {
        title: "Meting eerst",
        body: "Conversies die kloppen, anders stuur je op ruis. We zetten tracking goed vóór er budget aangaat.",
      },
      {
        title: "Kanaal en boodschap",
        body: "Waar zit jouw klant en wat overtuigt hem? Per kanaal een eigen invalshoek, met dezelfde belofte.",
      },
      {
        title: "Testen met klein budget",
        body: "Eerst leren, dan schalen. We testen doelgroepen en creatives voordat er serieus geld op gaat.",
      },
      {
        title: "Schalen wat werkt",
        body: "Winnaars krijgen meer budget, verliezers gaan uit. Elke maand zie je wat elke euro heeft opgeleverd.",
      },
    ],
    proofTitle: "Waarom volgorde ook hier telt",
    proofBody:
      "Advertenties pas aanzetten als je site al converteert en je meting klopt. Resultaat: lagere kosten per verkoop vanaf dag één, omdat het fundament er al stond. Adverteren op een lekke site is dweilen met de kraan open.",
    ctaTitle: "Klaar om campagnes te draaien die renderen?",
    ctaBody:
      "Plan een intake. We rekenen eerst uit of ads nu de slimste stap zijn.",
  },
  behoud: {
    slug: "behoud",
    metaTitle: "Behoud | e-mail, retentie & automatisering | Meneer Marketing",
    metaDescription:
      "Nieuwe klant werven is duur. E-mail, Klaviyo, koppelingen en flows die bestaande klanten terugbrengen. E-commerce op autopilot, meetbaar in omzet.",
    keywords: [
      "e-mailmarketing bureau",
      "Klaviyo specialist",
      "klantretentie verhogen",
      "marketing automation",
      "processen automatiseren",
      "e-commerce workflows",
    ],
    headline: "Verdienen aan klanten die je al hebt.",
    subheadline:
      "Een nieuwe klant werven kost al snel vijf keer meer dan een bestaande behouden. Wij bouwen e-mail, retentie en slimme systemen die daar munt uit slaan.",
    stats: [
      { label: "E-mail", value: "Automatisering · Klaviyo" },
      { label: "Retentie", value: "Loyalty · SMS" },
      { label: "Systemen", value: "Sync · rust" },
    ],
    introParagraphs: [
      "De meeste bedrijven pompen al hun budget in nieuwe klanten en vergeten de klanten die al kochten. Zonde, want daar zit de marge: die klant kent je al, vertrouwt je al en hoeft alleen een goede reden te krijgen om terug te komen.",
      "Behoud gaat verder dan e-mail. Het zijn ook de systemen erachter: orders die automatisch worden opgevolgd, voorraad en facturen die kloppen, en een klantenservice die snel antwoordt. Alles wat ervoor zorgt dat de tweede aankoop makkelijker is dan de eerste.",
    ],
    angleTitle: "Techniek in dienst van de klantrelatie",
    angleBody:
      "Voor SkinComplete richtten we de volledige e-mailmarketing in: van welkomstmails tot opvolging na aankoop. Geen spam, wel mails die op het juiste moment aankomen. De automatisering erachter regelt het handwerk, zodat het team tijd houdt voor klanten.",
    serviceIntro:
      "Van automatische mails tot automatisering en AI-klantenservice: dit zijn de behoudtrajecten.",
    processTitle: "Zo bouwen we aan behoud",
    processSteps: [
      {
        title: "Klantreis na de koop",
        body: "Wat gebeurt er nu na een aankoop of aanvraag? We brengen de gaten in kaart waar klanten stilletjes verdwijnen.",
      },
      {
        title: "Mails die aankomen",
        body: "Welkom, opvolging, herinnering, win-back. Elke mail op het moment dat hij logisch is, niet wanneer de kalender het zegt.",
      },
      {
        title: "Handwerk eruit",
        body: "Systemen die met elkaar praten: orders, voorraad, facturen en mails in sync zonder gekopieer.",
      },
      {
        title: "Meten en verfijnen",
        body: "Herhaalaankopen, opens en omzet per mailreeks. We zien wat werkt en schroeven daar verder aan.",
      },
    ],
    proofTitle: "Stille omzet, elke maand weer",
    proofBody:
      "Goede mailautomatisering is de best renderende vierkante meters van je marketing: je bouwt het één keer en het blijft verkopen. Wij meten het effect in omzet per mailreeks, niet in vage open rates.",
    ctaTitle: "Meer halen uit bestaande klanten?",
    ctaBody:
      "Plan een intake. We kijken eerst wat er al ligt en waar de snelste winst zit.",
  },
};

export function getPillarPage(slug: string): PillarPageData | null {
  if (slug in pillarPages) {
    return pillarPages[slug as PillarSlug];
  }
  return null;
}

export function getAllPillarSlugs(): PillarSlug[] {
  return Object.keys(pillarPages) as PillarSlug[];
}
