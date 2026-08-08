import type { KennisbankArticle } from "@/data/kennisbank/types";

export const GOOGLE_BUSINESS_PROFILE_LOKAAL: KennisbankArticle = {
  slug: "google-business-profile-spookhuis",
  title: "Lokale SEO: waarom je Google Business Profile een spookhuis is",
  description:
    "Je profiel bestaat, maar Google doet alsof je dicht bent. Zo fix je Maps, reviews en regio-pagina's zonder keyword-spam.",
  publishedAt: "2026-07-03",
  modifiedAt: "2026-08-08",
  readMinutes: 15,
  category: "vindbaarheid",
  keywords: [
    "google business profile optimaliseren",
    "lokale seo tips",
    "google maps vindbaarheid",
    "lokale seo nederland",
  ],
  dienstSlugs: ["local-seo", "seo", "content-marketing"],
  faqs: [
    {
      question: "Waarom sta ik niet in de Google Maps pack?",
      answer:
        "Vaak is je Google Business Profile incompleet, stil of inconsistent met je site. Reviews, categorie, foto's en NAP wegen zwaar. Vergelijk je profiel met de top drie in je stad.",
    },
    {
      question: "Helpen nep-reviews voor lokale SEO?",
      answer:
        "Nee. Riskant en dom. Bouw een flow om echte reviews te vragen na tevreden werk. Recent en echt wint van oud en gekocht.",
    },
    {
      question: "Zijn regio-pagina's nodig naast GBP?",
      answer:
        "Vaak wel als je meerdere gebieden bedient of je site alleen landelijk praat. Elke pagina moet unieke hulp geven. Dunne stadskopietjes werken averechts.",
    },
    {
      question: "Hoe vaak moet ik GBP updaten?",
      answer:
        "Wekelijks iets kleins: foto, post of review-antwoord. Maandelijks openingstijden en diensten checken. Stilte voelt als gesloten, ook als je open bent.",
    },
    {
      question: "Helpt lokale ads als mijn GBP slapend is?",
      answer:
        "Je koopt dan klikken naar een spookhuis. Fix eerst profiel, reviews en regio-pagina's. Daarna werkt elke euro in Maps of Search harder.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je hebt een Google Business Profile. Je hebt een adres ingevuld. Misschien zelfs een foto van je gevel waar het nog scheel naar regent. En toch verschijn je niet als iemand in je regio zoekt op wat je doet. Alsof je een winkel hebt met licht aan, maar het bord buiten zegt gesloten en de deur zit op slot. Welkom in lokale SEO, waar het meeste geld ligt voor MKB en waar het meeste wordt verwaarloosd.",
    },
    {
      type: "callout",
      text: "Kort antwoord: maak GBP compleet en levend, trek NAP recht, vraag echte reviews, bouw regio-pagina's die echt helpen. Maps beloont bewijs dat je bestaat, niet alleen een adresregel.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Maps-check",
      title: "Spookhuis-meter",
      intro:
        "Vink aan wat klopt voor jouw Google Business Profile. Hoe hoger, hoe meer Maps denkt dat je dicht bent.",
      storageKey: "mm-gbp-spookhuis",
      eventName: "gbp_spookhuis_complete",
      sharePath: "/kennisbank/google-business-profile-lokaal",
      scoreNoun: "spookscore",
      ctaHref: "/diensten/local-seo",
      ctaLabel: "Lokale SEO",
      checks: [
        {
          id: "nap",
          label: "Naam, adres of telefoon wijkt af tussen site, GBP en socials",
          fix: "NAP overal identiek. Google vergelijkt bronnen.",
        },
        {
          id: "stil",
          label: "Posts, foto's of review-antwoorden ontbreken al maanden",
          fix: "Wekelijks iets kleins. Stilte voelt als gesloten.",
        },
        {
          id: "categorie",
          label: "Primaire categorie is breed of vaag (consultant i.p.v. je omzet)",
          fix: "Kies de categorie die het dichtst bij je geld ligt.",
        },
        {
          id: "reviews",
          label: "Reviews zijn oud, weinig, of alleen van familie",
          fix: "Flow na tevreden werk: één link, mail of SMS.",
        },
        {
          id: "stock",
          label: "Alleen stockfoto's of één blurry gevel uit 2019",
          fix: "Echte werkplek, team, resultaat. Etalage in drie seconden.",
        },
        {
          id: "regio",
          label: "Site zegt landelijk, GBP en regio-pagina's zijn leeg of copy-paste",
          fix: "Echte regio-pagina's voor gebieden die je bedient.",
        },
        {
          id: "ads",
          label: "Je koopt lokale ads terwijl het profiel slapend is",
          fix: "Spookhuis eerst. Daarna werkt elke euro harder.",
        },
        {
          id: "uren",
          label: "Openingstijden of diensten kloppen niet meer",
          fix: "Maandelijks checken. Verkeerde uren = gemiste bel.",
        },
      ],
      tiers: [
        {
          id: "open",
          min: 0,
          max: 24,
          label: "Licht aan, deur open",
          quip: "Je bestaat zichtbaar. Blijf wekelijks iets posten of beantwoorden.",
        },
        {
          id: "schemer",
          min: 25,
          max: 49,
          label: "Schemerzone",
          quip: "Nog te redden. NAP + reviews + één verse foto deze week.",
        },
        {
          id: "spook",
          min: 50,
          max: 74,
          label: "Spookhuis met wifi",
          quip: "Profiel bestaat. Maps twijfelt. Concurrent met leven wint.",
        },
        {
          id: "dicht",
          min: 75,
          max: 100,
          label: "Gesloten bord",
          quip: "Stop lokale ads. Maak het profiel levend. Dan pas budget.",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat Google Maps echt wil zien",
    },
    {
      type: "p",
      text: "Google wil drie dingen weten: wie ben je, waar ben je, doe je wat je zegt dat je doet. Klinkt simpel. Toch zie ik profielen met een telefoonnummer dat niet meer werkt, openingstijden van 2019 en een categorie die consultant heet terwijl je loodgieter bent. Dan is het geen wonder dat je concurrent met 180 reviews en wekelijkse posts wél in de map pack staat.",
    },
    {
      type: "ul",
      items: [
        "NAP-consistentie: naam, adres, telefoon overal identiek. Website, profiel, socials. Google vergelijkt bronnen.",
        "Primaire categorie: kies wat het dichtst bij je omzet ligt, niet de breedste label die je vindt.",
        "Servicegebied vs fysiek adres: als je op locatie werkt, zet dat helder. Anders verwacht Google bezoekers voor een dichte deur.",
      ],
    },
    {
      type: "callout",
      text: "Ongeveer 46 procent van alle Google-zoekopdrachten heeft een lokale intentie. Bij mij in de buurt is hoe mensen een loodgieter, kapper of marketingbureau zoeken.",
    },
    {
      type: "h2",
      text: "Het spookhuis-syndroom",
    },
    {
      type: "p",
      text: "Een spookhuis-profiel heeft alle minimale velden ingevuld en verder niets. Geen posts, geen nieuwe foto's, geen antwoorden op reviews. Google ziet dat als: dit bedrijf is misschien nog wel open, misschien niet. Bij gelijke concurrentie wint degene die leeft.",
    },
    {
      type: "h3",
      text: "Reviews: niet kopen, wel verdienen",
    },
    {
      type: "p",
      text: "Nep-reviews kopen is dom. Google ruikt dat. Bovendien krijg je reviews van mensen die je dienst nooit gebruikten. Beter: een simpel systeem na afgerond werk. Mail of SMS, één link, geen roman. Vraag op het moment dat de klant tevreden is, niet drie maanden later.",
    },
    {
      type: "h3",
      text: "Foto's die vertrouwen geven",
    },
    {
      type: "p",
      text: "Stockfoto van een handdruk? Liever niet. Echte werkplek, echt team, echt resultaat waar mag. Mensen kiezen in Maps op vertrouwen in drie seconden. Je gevelfoto is je etalage.",
    },
    {
      type: "h2",
      text: "Je website moet ook lokaal ademen",
    },
    {
      type: "p",
      text: "Lokale SEO stopt niet bij je profiel. Als je site alleen zegt dat je de beste in Nederland bent, weet Google niet waar je hangt. Regio-pagina's helpen, mits ze echt zijn. Geen copy-paste van Eindhoven naar Helmond met alleen de stadswissel. Schrijf wat je in die regio doet, welke klanten, welk verschil.",
    },
    {
      type: "p",
      text: "Ik werk vanuit Apeldoorn en help landelijk. Lokale vermeldingen en pagina's moeten kloppen met de realiteit. Google merkt wollige regio-pagina's die alleen voor SEO bestaan. Liever drie goede gebieden dan vijftien lege.",
    },
    {
      type: "ul",
      items: [
        "Eén sterke regio-pagina per gebied dat je echt bedient.",
        "Interne links vanuit je diensten naar relevante regio's.",
        "Schema markup met adres en areaServed waar het klopt.",
        "Vermeldingen op betrouwbare bronnen, geen link-farmen.",
      ],
    },
    {
      type: "h2",
      text: "Posts, Q&A en attributen die je vergeet",
    },
    {
      type: "p",
      text: "Wekelijkse of maandelijkse posts over aanbod of tip. Q&A zelf invullen voordat rare antwoorden verschijnen. Attributen (parking, afspraak, talen) die kloppen. Dit is geen contentkalender-theater. Het is bewijs dat iemand de zaak runt.",
    },
    {
      type: "h2",
      text: "Lokaal adverteren vs lokaal ranken",
    },
    {
      type: "p",
      text: "Je kunt in Maps of Search adverteren voor snelle zichtbaarheid. Maar als je profiel en site zwak zijn, betaal je voor klikken naar een spookhuis. Fix eerst de basis: profiel compleet, reviews lopen, pagina's kloppen. Dan wordt elke euro in ads harder werken.",
    },
    {
      type: "p",
      text: "Google Maps marketing is geen aparte truc naast lokale SEO. Het is dezelfde etalage, scherper bekeken. Wie alleen adverteert om een slapend profiel te compenseren, huurt zichtbaarheid die organisch gratis had kunnen zijn.",
    },
    {
      type: "h2",
      text: "AI Overviews en lokale intentie",
    },
    {
      type: "p",
      text: "Informatieve queries raken AI-samenvattingen. Lokale 'bij mij in de buurt'-intentie blijft vaak Maps-first. Sterke GBP en lokale landings blijven dus geld waard, ook als blogs minder klikken opleveren. Reviews en NAP zijn geen bijzaak.",
    },
    {
      type: "callout",
      text: "Heet take: lokale SEO die alleen je Google-profiel invult en geen website aanraakt, hangt behang in een huis met een lekkend dak.",
    },
    {
      type: "h2",
      text: "De test in vijf minuten",
    },
    {
      type: "p",
      text: "Zoek op je telefoon, incognito, naar je hoofddienst plus je stad. Sta je in de map pack? Zo niet, open de top drie profielen en vergelijk: categorie, reviews, foto's, beschrijving. Het verschil is zelden geheim. Het is consistentie en bewijs dat je bestaat.",
    },
    {
      type: "p",
      text: "Lokale SEO is geen truc. Het is goed ondernemen, zichtbaar gemaakt voor machines die beslissen of je in beeld komt. Wil je dit laten aanpakken? Op mijn hub over lokale SEO leg ik Maps, reviews en regio-pagina's in één plan. Doe het beter dan je concurrent, en Maps wordt een gratis etalage in plaats van een spookhuis.",
    },
  ],
};
