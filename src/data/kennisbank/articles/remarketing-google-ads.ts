import type { KennisbankArticle } from "@/data/kennisbank/types";

export const REMARKETING_GOOGLE_ADS: KennisbankArticle = {
  slug: "remarketing-zonder-stalken",
  title: "Remarketing: de enige keer dat stalken legaal en winstgevend is",
  description:
    "Bezoekers terugbrengen zonder irritatie. Frequentie, segmenten en creatives die converteren in plaats van mensen naar adblocker jagen.",
  publishedAt: "2026-07-07",
  modifiedAt: "2026-08-08",
  readMinutes: 13,
  category: "campagnes",
  keywords: [
    "remarketing google ads",
    "retargeting uitleg",
    "remarketing webshop",
    "google ads remarketing tips",
  ],
  dienstSlugs: ["google-ads", "meta-ads", "cro"],
  faqs: [
    {
      question: "Wanneer mag ik remarketing aanzetten?",
      answer:
        "Als je genoeg warm verkeer hebt om een audience te vullen, je site niet lekt op conversie, en consent + tags kloppen. Anders betaal je om mensen terug te sturen naar hetzelfde lek.",
    },
    {
      question: "Hoe hoog moet mijn frequentiecap?",
      answer:
        "Begin conservatief: een paar impressies per dag per persoon, lager voor koude sitebezoekers, iets hoger voor cart. Roteer creatives. Als mensen je merk noemen als reden voor adblocker, zat je te hoog.",
    },
    {
      question: "Is dynamic remarketing altijd beter?",
      answer:
        "Voor shops met een schone feed: ja, product dat ze bekeken wint van generiek logo. Zonder kloppende feed en Merchant Center is dynamic theater. Fix de feed eerst.",
    },
    {
      question: "Moet ik converters uitsluiten?",
      answer:
        "Bijna altijd, tenzij je upsell of consumables met korte herhaal-aankoop hebt. Iemand die net een matras kocht, wil die matras niet drie weken in zijn timeline.",
    },
    {
      question: "E-mail of ads eerst bij cart abandon?",
      answer:
        "Mail eerst als je het adres hebt. Ads parallel met caps en uitsluitingen. Zelfde product, andere toon. Zie ook abandoned cart mails.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Iemand was op je site. Keek rond. Vertrok. Remarketing is de gentle tap op de schouder: hey, je vergeet iets. Of: hey, je was geïnteresseerd in dit. Als het goed is, voelt het als herinnering. Als het fout is, voelt het als die ene winkel die je overal achtervolgt terwijl je alleen even naar schoenen keek.",
    },
    {
      type: "h2",
      text: "Waarom remarketing zo goed werkt (als je het niet verpest)",
    },
    {
      type: "p",
      text: "Warm verkeer is goedkoper dan koud verkeer. Iemand die je site al zag, herkent je merk. De drempel is lager. Remarketing vangt twijfel op, niet complete onwetendheid. Daarom hoort het ná je basis acquisitie, niet ervoor. Weinig bezoekers om terug te halen als er nauwelijks bezoekers zijn.",
    },
    {
      type: "callout",
      text: "Vuistregel: remarketing fix je conversie op mensen die al geïnteresseerd waren. Het haalt geen nieuwe geïnteresseerden tevoorschijn.",
    },
    {
      type: "h2",
      text: "Segmenten die ik altijd scheid",
    },
    {
      type: "ul",
      items: [
        "Bezocht productpagina, geen cart: zachte herinnering met productfocus.",
        "Cart abandoners: vaak beter via e-mail, remarketing als tweede kanaal.",
        "Converters uitsluiten: niemand wil na aankoop nog drie weken dezelfde matras zien.",
        "Korte vs lange cyclus: B2B met lange sales vraagt langere vensters, impulse producten korter.",
      ],
    },
    {
      type: "h2",
      text: "Frequentiecaps zijn geen suggestie",
    },
    {
      type: "p",
      text: "De grootste remarketing-fout: te vaak tonen aan te weinig mensen. Je brand wordt die ene irritante banner. Stel caps in. Roteer creatives. Verander boodschap na X dagen. Niemand hoeft je logo vijftig keer te zien om te beslissen.",
    },
    {
      type: "h2",
      text: "Creatives die niet saai zijn",
    },
    {
      type: "p",
      text: "Remarketing met alleen je logo op een gekleurde achtergrond is teleurstellend. Toon het product dat ze bekeken. Toon review. Toon antwoord op bezwaar (verzending, garantie). Dynamic remarketing in ecommerce doet dit automatisch als je feed klopt. Zie het Merchant Center-artikel als je feed een ramp is.",
    },
    {
      type: "h2",
      text: "Vensters: hoe lang mag je nagaan?",
    },
    {
      type: "p",
      text: "Impulsproduct: dagen, niet weken. Matras of B2B-traject: langer, maar met frisse creatives. Een banner die drie maanden hetzelfde zegt, voelt als stalken. Een banner die na een week het bezwaar adresseert (garantie, maat, levering), voelt als service.",
    },
    {
      type: "ul",
      items: [
        "0–3 dagen: product + soft reminder.",
        "3–14 dagen: social proof of FAQ-bezwaar.",
        "Daarna: of stoppen, of andere hoek (upsell, gerelateerd), niet dezelfde push.",
      ],
    },
    {
      type: "h3",
      text: "Consent en privacy",
    },
    {
      type: "p",
      text: "Remarketing vereist correcte consent mode en beleid. Shortcuts kosten vertrouwen en kunnen tracking breken. Stalken zonder consent is ook gewoon dom risico. Zonder Consent Mode v2 blijft je audience half leeg terwijl je denkt dat ads niet werken.",
    },
    {
      type: "callout",
      text: "Heet take: remarketing op je hele sitebezoek zonder segmentatie is een megafoon in een bibliotheek.",
    },
    {
      type: "h2",
      text: "Google vs Meta remarketing",
    },
    {
      type: "p",
      text: "Google pakt intentie op zoek en display netwerk. Meta pakt social scroll en visual memory. Samen werken ze als je niet dezelfde boodschap blind kopieert. Eén strategie, twee formaten. Niet twee bureaus die elkaar tegenspreken.",
    },
    {
      type: "h2",
      text: "E-mail en ads: wie mag eerst tikken?",
    },
    {
      type: "p",
      text: "Cart abandoners reageren vaak beter op een goede mail dan op de tiende banner. Gebruik remarketing als versterking, niet als enige kanaal. Bij shops met Klaviyo of vergelijkbaar: flow eerst, ads parallel met uitsluitingen zodat je niet dubbel schreeuwt.",
    },
    {
      type: "h2",
      text: "SkinComplete en BestRest: warm verkeer verdienen",
    },
    {
      type: "p",
      text: "SkinComplete groeide eerst organisch. Remarketing had pas zin toen er genoeg warme bezoekers waren. BestRest: per productlijn andere intentie en marge. Eén generieke retargeting-campagne mengt die werelden. Segmenteren is geen luxe, het is margebescherming.",
    },
    {
      type: "h2",
      text: "Wanneer remarketing niet de prioriteit is",
    },
    {
      type: "p",
      text: "Lage site traffic? Fix eerst SEO of beperkte acquisitie. Site converteert slecht? Remarketing stuurt mensen terug naar hetzelfde probleem. Tracking kapot? Je remarketing is gokken. Eerst fundament, dan de tap op de schouder.",
    },
    {
      type: "p",
      text: "Goed remarketing voelt onzichtbaar. Het haalt mensen terug die bijna klaar waren. Slecht remarketing maakt je het merk dat mensen aan vrienden noemen als voorbeeld van waarom ik adblocker gebruik. Kies welke je wilt zijn.",
    },
  ],
};
