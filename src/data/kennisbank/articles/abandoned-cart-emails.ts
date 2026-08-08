import type { KennisbankArticle } from "@/data/kennisbank/types";

export const ABANDONED_CART_EMAILS: KennisbankArticle = {
  slug: "abandoned-cart-emails-die-converteren",
  title: "Abandoned cart mails die niet irritant zijn (en wél verkopen)",
  description:
    "Je winkelwagen lekt geld. Niet met schreeuwerige mails, maar met timing, tone of voice en een flow die aanvoelt als een herinnering, geen stalker.",
  publishedAt: "2026-07-12",
  modifiedAt: "2026-08-08",
  readMinutes: 10,
  category: "behoud",
  keywords: [
    "abandoned cart email",
    "winkelwagen email shopify",
    "verlaten winkelwagen mail",
    "e-mailmarketing webshop",
  ],
  dienstSlugs: ["email", "retentie", "shopify-enterprise"],
  faqs: [
    {
      question: "Hoeveel abandoned cart mails moet ik sturen?",
      answer:
        "Vaak drie: na ongeveer een uur, na een dag, na twee tot drie dagen. Incentive alleen in de laatste als marge het toelaat. Te snel te veel voelt als spam.",
    },
    {
      question: "Moet ik altijd korting geven?",
      answer:
        "Nee. Eerst helpen en bewijs. Korting trainen klanten om te wachten. Gratis verzending of social proof werkt soms beter.",
    },
    {
      question: "Wat als mijn checkout zelf faalt?",
      answer:
        "Fix eerst snelheid, betaalmethodes en duidelijke kosten. Mail vangt twijfel op. Het repareert geen kapotte shop.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Iemand vult een winkelwagen, kijkt nog even naar de verzendkosten, twijfelt, sluit het tabblad. Dat is geen afwijzing van je merk. Dat is vrijwel iedereen op een dinsdagavond. De vraag is niet of je een abandoned cart mail stuurt. De vraag is of je mail voelt als een behulpzame herinnering of als een wanhopige verkoper die door je raam roept.",
    },
    {
      type: "callout",
      text: "Kort antwoord: drie mails, menselijke toon, checkout-herstel, exclude recente kopers. Meet omzet per flow. Korting alleen als je marge het verdraagt.",
    },
    {
      type: "h2",
      text: "Waarom mensen afhaken",
    },
    {
      type: "p",
      text: "Ja, soms is het te duur. Maar vaker is het: onduidelijke verzendkosten, geen vertrouwen, afleiding, of gewoon ik doe het straks en straks bestaat niet. Je mail moet het echte bezwaar raken, niet alleen je vergeet iets schreeuwen in de onderwerpregel.",
    },
    {
      type: "ul",
      items: [
        "Verzendkosten pas laat in checkout: herinner aan totaal inclusief verzending.",
        "Geen social proof: een review of garantie in mail twee kan twijfel breken.",
        "Te veel mails te snel: drie mails in vier uur voelt als spam.",
        "Generieke copy: Beste klant met een stockfoto. Niemand gelooft dat.",
      ],
    },
    {
      type: "callout",
      text: "Gemiddeld haakt zo'n 70 procent van de winkelwagens af vóór betaling. Dat is geen schande. Het is een goudmijn als je het slim opvangt.",
    },
    {
      type: "h2",
      text: "De flow die ik bij shops opzet",
    },
    {
      type: "p",
      text: "Geen rocket science. Wel discipline. Dit is het skelet dat bij de meeste Shopify-shops werkt, mits je product en marge het toelaten.",
    },
    {
      type: "h3",
      text: "Eerste mail: na ongeveer een uur",
    },
    {
      type: "p",
      text: "Kort, vriendelijk, geen korting. Je mand staat nog klaar. Toon productafbeelding, prijs, link direct naar checkout. Menselijke toon. Geen CAPS LOCK.",
    },
    {
      type: "h3",
      text: "Tweede mail: na een dag",
    },
    {
      type: "p",
      text: "Bezwaar wegnemen: verzending, retour, waarom dit product. Bij SkinComplete-style shops: waarom professionals dit gebruiken, niet waarom jij wanhopig omzet nodig hebt.",
    },
    {
      type: "h3",
      text: "Derde mail: na twee tot drie dagen",
    },
    {
      type: "p",
      text: "Alleen als het past bij je marge: een incentive. Geen standaard tien procent voor iedereen. Soms werkt gratis verzending beter. Liegen over voorraad is een slecht idee.",
    },
    {
      type: "h2",
      text: "Tone of voice: jij, niet een robot",
    },
    {
      type: "p",
      text: "Schrijf alsof je tegen iemand praat die je product al leuk vond. BestRest klinkt anders dan SkinComplete. Dat hoort zo. Hey, je liet dit nog liggen werkt beter dan ACTIE VEREIST.",
    },
    {
      type: "callout",
      text: "Heet take: een abandoned cart mail met alleen een kortingscode is geen strategie. Het is een reflex die je marge uitkleedt.",
    },
    {
      type: "h2",
      text: "Techniek die je niet mag vergeten",
    },
    {
      type: "p",
      text: "Checkout-link moet de mand herstellen. Mobiel moet lekker lezen. Afmeldlink moet werken. GDPR: alleen mailen met consent. Meet omzet per flow. Open rate is leuk. Revenue is waarom je dit doet.",
    },
    {
      type: "h2",
      text: "Wanneer je dit niet prioriteit geeft",
    },
    {
      type: "p",
      text: "Als je checkout al lekt door trage site, kapotte betaalmethodes of onduidelijke kosten, fix dat eerst. Mail is het vangnet, niet de koord. Op mijn hubs over e-mailmarketing en Klaviyo specialist zet ik cart-flows in het grotere retentieplan.",
    },
  ],
};
