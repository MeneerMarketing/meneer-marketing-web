import type { KennisbankArticle } from "@/data/kennisbank/types";

export const CONSENT_MODE_GOOGLE_ADS_2026: KennisbankArticle = {
  slug: "consent-mode-google-ads-2026",
  title:
    "Consent Mode v2: waarom je conversies 'verdwijnen' en ads dommer worden",
  description:
    "Sinds GDPR en cookiebanners meet Google niet meer alles. Consent Mode v2 is geen marketingterm, het is de reden dat je ROAS soms liegt. Zo fix je data zonder de boete.",
  publishedAt: "2026-07-12",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "behoud",
  keywords: [
    "consent mode v2",
    "google ads conversies meten",
    "cookiebanner google analytics",
    "gdpr tracking marketing",
    "google ads smart bidding",
  ],
  dienstSlugs: ["tracking", "google-ads", "automatisering"],
  faqs: [
    {
      question: "Is Consent Mode v2 verplicht in Nederland?",
      answer:
        "Als je Google Ads, GA4 of remarketing gebruikt en bezoekers uit de EU hebt, moet consent netjes geregeld zijn. Consent Mode v2 is Google's manier om met gedeeltelijke toestemming toch te modelleren. Dit is geen juridisch advies, wel: negeren maakt je data onbetrouwbaar en kan problemen geven bij audits.",
    },
    {
      question: "Waarom zie ik minder conversies in Google Ads dan in mijn shop?",
      answer:
        "Vaak omdat een deel van bezoekers geen marketing-cookies accepteert, tags niet vuurden, of consent pas na de conversie kwam. Ook dubbele tellingen tussen platformen of verkeerde attributie spelen mee. Consent Mode modelleert ontbrekende data, maar lost kapotte implementatie niet magisch op.",
    },
    {
      question: "Kan ik Smart Bidding nog vertrouwen?",
      answer:
        "Alleen als je basistracking klopt: consent banner, GA4-events, conversie-import, enhanced conversions waar mogelijk. Smart Bidding op lege of verkeerde data is als autopilot op een kaart van 2019. Technisch rijd je. Praktisch in de sloot.",
    },
    {
      question: "Wat is het verschil tussen basic en advanced Consent Mode?",
      answer:
        "Basic: tags laden pas na toestemming. Advanced: tags laden in denied-state met cookieless pings voor modeling. Advanced helpt Smart Bidding meer, mits je banner en defaults kloppen. Verkeerd advanced is nog steeds verkeerd.",
    },
    {
      question: "Helpt Enhanced Conversions naast Consent Mode?",
      answer:
        "Ja. Gehashte e-mail of telefoon (met toestemming) geeft Google een extra match als cookies ontbreken. Samen met Consent Mode is het de hygiëne-stack voor 2026, niet een nice-to-have.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je campagnes draaien. De shop klinkt 'ping' met orders. Google Ads toont halve conversies. Of juist conversies die mysterieus stijgen terwijl je bankrekening stil blijft. Je rolt je ogen en denkt: Google liegt weer. Soms wel. Vaker is het Consent Mode v2. De technische reden dat cookies, banners en privacywetgeving je data opbreken. En dat Smart Bidding dommer lijkt, terwijl het eerlijk gezegd gewoon blind vliegt.",
    },
    {
      type: "p",
      text: "Ik leg uit wat het is, waarom het sinds 2024/2025 overal opduikt, en wat jij als ondernemer praktisch moet weten. Dit is geen juridisch college. Wel: waarom je marketing er slimmer uitziet als je dit snapt.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Tag Assistant-moment",
      title: "Blind-vlieg-meter",
      intro:
        "Vink aan wat je herkent. Hoe hoger, hoe meer Smart Bidding op giswerk vliegt terwijl jij denkt dat Google liegt.",
      storageKey: "mm-consent-blind",
      eventName: "consent_blind_complete",
      sharePath: "/kennisbank/consent-mode-google-ads-2026",
      scoreNoun: "blindheid",
      ctaHref: "/diensten/tracking",
      ctaLabel: "Tracking",
      checks: [
        {
          id: "banner",
          label: "Banner staat onderaan, grijs, of pre-checked",
          fix: "Echte keuze vóór marketing-tags. Dat is consent, geen decoratie.",
        },
        {
          id: "tag",
          label: "Nooit Tag Assistant gedraaid met accept én weiger",
          fix: "Incognito test. Geen verschil? Implementatie is kapot.",
        },
        {
          id: "cookiebot-claim",
          label: "‘We hebben Cookiebot’ zonder GA4 Consent Mode check",
          fix: "Tool ≠ setup. Check in GA4 admin of Consent Mode actief is.",
        },
        {
          id: "ads-shop",
          label: "Ads-conversies en shop wijken structureel af",
          fix: "Consent + events + enhanced conversions. Daarna pas budget.",
        },
        {
          id: "remarketing",
          label: "Remarketing-audiences blijven klein terwijl traffic groeit",
          fix: "ad_storage geweigerd of tags te laat. Fix consent vóór creatives.",
        },
        {
          id: "micro",
          label: "Twintig micro-conversies voeden Smart Bidding",
          fix: "Eén primaire conversie. Modeling vult gaten, geen rommeldoelen.",
        },
        {
          id: "scale",
          label: "Budget verdubbeld terwijl tracking ‘ongeveer’ klopt",
          fix: "Je schaalt onzekerheid. Fix input, dan volume.",
        },
        {
          id: "enhanced",
          label: "Enhanced Conversions staan uit bij checkout of leadform",
          fix: "Gehashte e-mail (met toestemming) helpt als cookies ontbreken.",
        },
      ],
      tiers: [
        {
          id: "helder",
          min: 0,
          max: 24,
          label: "Eerlijke weegschaal",
          quip: "Je meet wat je mag meten. Smart Bidding krijgt betere input.",
        },
        {
          id: "mist",
          min: 25,
          max: 49,
          label: "Mist op de baan",
          quip: "Nog te redden. Tag Assistant deze week. Accepteer én weiger.",
        },
        {
          id: "nacht",
          min: 50,
          max: 74,
          label: "Nachtbril-chauffeur",
          quip: "Campagnes draaien. Data liegt half. Klassiek 2026-lek.",
        },
        {
          id: "sloot",
          min: 75,
          max: 100,
          label: "Autopilot in de sloot",
          quip: "Stop met ‘Google liegt’. Fix consent. Dan pas oordelen over ROAS.",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat Consent Mode doet (zonder jargon-muurtje)",
    },
    {
      type: "p",
      text: "Bezoeker komt binnen. Cookiebanner. Drie smaken: alles accepteren, alleen noodzakelijk, of customize. Vroeger: geen ja = geen tracking = Google ziet niks. Consent Mode v2 zegt tegen Google: 'deze gebruiker heeft marketing geweigerd, maar je mag wél anonieme pings sturen zodat we kunnen modelleren wat er waarschijnlijk gebeurt'. Google schat ontbrekende conversies. Niet perfect. Beter dan gokken op 40 procent van je traffic.",
    },
    {
      type: "ul",
      items: [
        "Analytics storage: mag GA4 cookies zetten?",
        "Ad storage: mag remarketing en conversie-cookies?",
        "Ad user data: mag persoonsgebonden data naar Google Ads?",
        "Ad personalization: mag gepersonaliseerde ads?",
      ],
    },
    {
      type: "callout",
      text: "Analogie: je weegt een zak appels, maar 30 procent weigert op de weegschaal te staan. Consent Mode schat het gewicht van de weigeraars op basis van de rest. Handig. Geen excuus om de weegschaal kapot te laten.",
    },
    {
      type: "h2",
      text: "Symptomen dat het bij jou misgaat",
    },
    {
      type: "ul",
      items: [
        "Conversies in Ads en GA4 wijken structureel af van je backend/shop.",
        "Remarketing-audiences blijven klein terwijl traffic groeit.",
        "Smart Bidding schiet omhoog of omlaag zonder dat het businessgevoel klopt.",
        "Tag Assistant toont tags die pas vuren na tweede pageview.",
        "Je banner staat onderaan, grijs, pre-checked. Dat is geen consent. Dat is een proces-verbaal wachten.",
      ],
    },
    {
      type: "p",
      text: "Zonder correcte consent + events is elke ROAS-discussie theater. Je optimaliseert op noise.",
    },
    {
      type: "h2",
      text: "Wat je technisch nodig hebt",
    },
    {
      type: "h3",
      text: "Een banner die juridisch én technisch klopt",
    },
    {
      type: "p",
      text: "Cookiebot, Complianz, of custom via Google Consent Mode v2 default. Belangrijk: tags laden in de juiste volgorde. GA4 en Google Ads pas na consent-update, met modeling ingeschakeld. Op meneermarketing.nl gebruik ik zelf een simpele banner met echte keuze. GA4 laadt pas na ja. Bij weigeren blijft marketing-tracking uit. Dat voelt als omzet laten liggen. Het is vertrouwen + wet + betere data op lange termijn.",
    },
    {
      type: "h3",
      text: "GA4-events die ertoe doen",
    },
    {
      type: "p",
      text: "Skip de 47 custom events waar niemand naar kijkt. Wel: purchase, generate_lead, begin_checkout, add_to_cart waar relevant. Zelfde definities in GA4 en Google Ads conversie-import. Eén waarheid. Anders vergelijk je appels met koekjes die misschien cookies waren.",
    },
    {
      type: "h3",
      text: "Enhanced Conversions (hashed email)",
    },
    {
      type: "p",
      text: "Bij checkout of leadform stuur je gehashte e-mail mee (met toestemming). Google matcht beter, vooral als cookies ontbreken. Privacy-proof als je het netjes implementeert. Extra moeite. Extra signaal voor Smart Bidding.",
    },
    {
      type: "h2",
      text: "Impact op Google Ads in 2026",
    },
    {
      type: "p",
      text: "Smart Bidding leeft op data. Minder data = trager leren = hogere CPA in de eerste weken na wijzigingen. Consent Mode v2 vult gaten, maar vervangt geen solide setup. Performance Max en broad match worden extra gevoelig: die sturen op signalen die je misschien niet ziet in je dashboard.",
    },
    {
      type: "p",
      text: "Praktisch advies: fix tracking vóór je budget verdubbelt. Anders schaal je onzekerheid. Ik zie accounts waar 'meer budget' het enige was wat ontbrak. Zeldzaam. Meestal ontbrak consent.",
    },
    {
      type: "h2",
      text: "Remarketing en audiences onder consent",
    },
    {
      type: "p",
      text: "Zonder ad_storage blijven remarketinglijsten klein. Dan lijkt retargeting 'niet te werken' terwijl je eigenlijk te weinig consented users hebt. Fix consent vóór je creatives en caps finetunet. Anders optimaliseer je een lekkende emmer.",
    },
    {
      type: "callout",
      text: "Heet take: een bureau dat campagnes draait zonder ooit Tag Assistant te openen, is een chauffeur met zonnebril 's nachts. Lekker stoer. Gevaarlijk.",
    },
    {
      type: "h2",
      text: "Checklist voor deze week",
    },
    {
      type: "ul",
      items: [
        "Open Tag Assistant op je site in incognito. Accepteer en weiger cookies. Zie je verschil?",
        "Check Search Console vs GA4 vs shop-backend op één week. Waar wijkt het?",
        "Controleer of Consent Mode v2 active is in GA4 admin (niet alleen 'we hebben Cookiebot').",
        "Zet één primaire conversie in Ads. Geen twintig micro-conversies die Smart Bidding verwarren.",
        "Documenteer wat 'conversie' voor jou betekent. Lead? Sale? Afspraak? Iedereen in het team hetzelfde antwoord.",
      ],
    },
    {
      type: "h2",
      text: "Meten vóór schalen",
    },
    {
      type: "p",
      text: "Eerst organisch en shop-fundament, daarna ads. Die volgorde geldt ook voor consent: eerst tags en banner, dan budget. Schalen zonder betrouwbare purchase-events is een no-go. Marge per SKU vraagt waarde in de hit, niet alleen een bedanktpagina-view.",
    },
    {
      type: "h2",
      text: "Conclusie",
    },
    {
      type: "p",
      text: "Consent Mode v2 is geen vijand. Het is de realiteit na jaren van 'gratis' third-party tracking. Wie het netjes doet, meet betrouwbaarder dan wie alles forceert en later alsnog moet migreren onder tijdsdruk. Je ads worden niet dom. Ze worden eerlijk over hoeveel ze weten. Geef ze betere input. Dan wordt Smart Bidding weer een tool in plaats van een gokautomaat met een Google-logo.",
    },
  ],
};
