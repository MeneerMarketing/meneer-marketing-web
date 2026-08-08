import type { KennisbankArticle } from "@/data/kennisbank/types";

export const LEADS_GMAIL_OPVOLGING: KennisbankArticle = {
  slug: "leads-gmail-opvolging",
  title: "De lead in Gmail die na vier dagen sterft",
  description:
    "Leads verdwijnen in je inbox tussen facturen en nieuwsbrieven. Zo zet je opvolging op rails zonder direct een zware CRM.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 13,
  category: "behoud",
  keywords: [
    "leads opvolgen",
    "marketing automatisering mkb",
    "crm kleine onderneming",
    "lead nurturing",
  ],
  dienstSlugs: ["automatisering", "workflows", "email"],
  faqs: [
    {
      question: "Hoe snel moet ik een lead opvolgen?",
      answer:
        "Bevestiging binnen minuten. Menselijk contact binnen dezelfde werkdag, liefst binnen een paar uur. Na 24 uur voelt het al koud. Na vier dagen is de concurrent vaak al aan de lijn.",
    },
    {
      question: "Heb ik meteen een dure CRM nodig?",
      answer:
        "Nee. Begin met bevestigingsmail, notificatie naar de juiste persoon en een statuslijst (nieuw → contact → offerte → gewonnen/verloren). Tool later. Proces nu.",
    },
    {
      question: "Wat als ik alleen in het weekend leads krijg?",
      answer:
        "Automatische bevestiging met verwachting ('maandag bel ik tussen 9 en 11'). Stilte in het weekend voelt als verdwijnen. Een eerlijke timeline houdt de lead warm.",
    },
    {
      question: "Welke tools gebruik je voor MKB?",
      answer:
        "Afhankelijk van stack: n8n of Make voor de glue, HubSpot/Pipedrive als volume groeit, Slack of gelabelde mail voor alerts. De flow telt harder dan het logo op de factuur.",
    },
    {
      question: "Hoe meet ik of opvolging werkt?",
      answer:
        "Tijd tot eerste reactie, percentage 'nieuw' langer dan 48 uur, win-rate per bron. Als leads sterven zonder ooit gebeld te zijn, is ads niet het probleem. Opvolging wel.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Zaterdag 14:00. Iemand vult je contactformulier in. Enthousiast, concrete vraag, telefoonnummer erbij. Maandag 09:00 belt hij je concurrent terug. Jouw mail zit nog in ongelezen tussen de nieuwsbrief, de factuur en Re: Re: Re: even sparren. Gmail is geen CRM. Het is een vergiet met een @-teken.",
    },
    {
      type: "callout",
      text: "Kort antwoord: elke lead binnen 5 minuten een bevestiging, binnen 24 uur menselijk contact of duidelijke vervolgstap. Automatiseer het saaie, houd het menselijke menselijk.",
    },
    {
      type: "h2",
      text: "Waarom snelheid alles is",
    },
    {
      type: "p",
      text: "Studies variëren, maar de richting is overal hetzelfde: hoe langer je wacht, hoe kouder de lead. B2B niet minder. Ze hebben drie tabs open met concurrenten. Jij bent tab vier als je maandag pas reageert.",
    },
    {
      type: "p",
      text: "Snelheid is ook merk. Wie binnen een uur belt, voelt als iemand die het serieus neemt. Wie na vier dagen mailt met excuses, voelt als een bedrijf met te volle agenda. Dat is al een verkoopgesprek, alleen verlies je het stil.",
    },
    {
      type: "h2",
      text: "Het minimale systeem dat wél werkt",
    },
    {
      type: "ul",
      items: [
        "Formulier-submit triggert direct bevestigingsmail: we hebben het, dit gebeurt er nu.",
        "Notificatie naar juiste persoon (Slack, mail met label, geen info@ black hole).",
        "Taak in je CRM of zelfs Trello: bel binnen X uur.",
        "Elke lead heeft een status: nieuw, contact, offerte, gewonnen, verloren.",
        "Automatische reminder als status te lang nieuw blijft.",
      ],
    },
    {
      type: "h2",
      text: "Wat er in die eerste bevestiging moet staan",
    },
    {
      type: "p",
      text: "Niet alleen bedankt voor je bericht. Zeg wat de volgende stap is en wanneer. Bijvoorbeeld: ik bel je vandaag nog tussen 14 en 16 uur, of: binnen één werkdag stuur ik een korte intake. Mensen vergeven wachten als ze weten dat er een plan is. Stilte voelt als verwaarlozing.",
    },
    {
      type: "h2",
      text: "Van Gmail naar iets dat schaalt",
    },
    {
      type: "p",
      text: "n8n, Make, HubSpot light, Pipedrive, zelfs Notion met discipline. Het maakt niet uit welke tool. Het maakt uit dat leads niet afhankelijk zijn van wie toevallig inbox checkt.",
    },
    {
      type: "p",
      text: "SkinComplete-salons bestelden via portaal. Minder mail-heen-en-weer. Jij hoeft geen B2B-portaal te bouwen voor elke lead, maar je proces mag ook geen bingo zijn.",
    },
    {
      type: "h2",
      text: "Ads zonder opvolging is weggegooid budget",
    },
    {
      type: "p",
      text: "Je kunt CPA groen houden in Google Ads en toch omzet missen als leads in Gmail sterven. Meet tijd tot eerste reactie naast CPA. Als half je formulieren nooit gebeld worden, fix opvolging vóór je budget verhoogt. Anders schaal je een vergiet.",
    },
    {
      type: "h2",
      text: "B2B vs B2C",
    },
    {
      type: "p",
      text: "Consument wil snel bevestiging en duidelijkheid. B2B wil soms bellen, soms offerte, soms portal. Geef keuze. Zelfs B2B-klanten haten wachten op we sturen morgen de prijs.",
    },
    {
      type: "h2",
      text: "Meet of je opvolging werkt",
    },
    {
      type: "ul",
      items: [
        "Tijd tot eerste reactie (doel: uren, niet dagen).",
        "Percentage leads met status langer dan 48 uur op nieuw.",
        "Win-rate per bron: formulier, ads, telefoon.",
        "Hoeveel leads sterven zonder ooit gebeld te zijn.",
      ],
    },
    {
      type: "callout",
      text: "Automatisering is saai tot je telt hoeveel uur per week je team aan copy-paste kwijt is.",
    },
    {
      type: "p",
      text: "Begin klein. Eén flow: formulier naar bevestiging plus notificatie. Dat alleen redt al orders. Daarna pas uitbreiden. Perfectie is de vijand van live.",
    },
  ],
};
