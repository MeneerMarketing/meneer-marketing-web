import type { KennisbankArticle } from "@/data/kennisbank/types";

export const LEADS_GMAIL_OPVOLGING: KennisbankArticle = {
  slug: "leads-gmail-opvolging",
  title: "De lead in Gmail die na vier dagen sterft",
  description:
    "Leads verdwijnen in je inbox tussen facturen en nieuwsbrieven. Zo zet je opvolging op rails zonder direct een zware CRM.",
  publishedAt: "2026-07-06",
  readMinutes: 8,
  category: "behoud",
  keywords: [
    "leads opvolgen",
    "marketing automatisering mkb",
    "crm kleine onderneming",
    "lead nurturing",
  ],
  dienstSlugs: ["automatisering", "workflows", "email"],
  sections: [
    {
      type: "p",
      text: "Zaterdag 14:00. Iemand vult je contactformulier in. Enthousiast, concrete vraag, telefoonnummer erbij. Maandag 09:00 belt hij je concurrent terug. Jouw mail zit nog in 'ongelezen' tussen de nieuwsbrief, de factuur en 'Re: Re: Re: even sparren'. Gmail is geen CRM. Het is een vergiet met een @-teken.",
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
      type: "h2",
      text: "Het minimale systeem dat wél werkt",
    },
    {
      type: "ul",
      items: [
        "Formulier-submit triggert direct bevestigingsmail: 'we hebben het, dit gebeurt er nu'.",
        "Notificatie naar juiste persoon (Slack, mail met label, geen info@ black hole).",
        "Taak in je CRM of zelfs Trello: bel binnen X uur.",
        "Geen lead zonder status: nieuw, contact, offerte, gewonnen, verloren.",
        "Automatische reminder als status te lang 'nieuw' blijft.",
      ],
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
      text: "SkinComplete salons bestelden via portaal. Minder mail-heen-en-weer. Jij hoeft geen B2B-portaal te bouwen voor elke lead, maar je proces mag ook geen bingo zijn.",
    },
    {
      type: "h2",
      text: "B2B vs B2C",
    },
    {
      type: "p",
      text: "Consument wil snel bevestiging en duidelijkheid. B2B wil soms bellen, soms offerte, soms portal. Geef keuze. Zelfs B2B-klanten haten wachten op 'we sturen morgen de prijs'.",
    },
    {
      type: "callout",
      text: "Automatisering is saai tot je telt hoeveel uur per week je team aan copy-paste kwijt is.",
    },
    {
      type: "p",
      text: "Begin klein. Eén flow: formulier naar bevestiging plus notificatie. Dat alles levert al orders redden op. Daarna pas uitbreiden. Perfectie is de vijand van live.",
    },
  ],
};
