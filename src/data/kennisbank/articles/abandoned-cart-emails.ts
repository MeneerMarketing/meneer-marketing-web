import type { KennisbankArticle } from "@/data/kennisbank/types";

export const ABANDONED_CART_EMAILS: KennisbankArticle = {
  slug: "abandoned-cart-emails-die-converteren",
  title: "Abandoned cart mails die niet irritant zijn (en wél verkopen)",
  description:
    "Je winkelwagen lekt geld. Niet met schreeuwerige mails, maar met timing, tone of voice en een flow die aanvoelt als een herinnering, geen stalker.",
  publishedAt: "2026-07-12",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
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
    {
      question: "Welke tool gebruik je voor cart-flows op Shopify?",
      answer:
        "Vaak Klaviyo of de native Shopify-flows, afhankelijk van volume en stack. Belangrijker dan de tool: timing, segmentatie, tone of voice en een productblok dat klopt. Flow zonder data is theater.",
    },
    {
      question: "Hoe meet ik of cart-mails écht werken?",
      answer:
        "Herstel-omzet, open rate is vanity. Kijk naar attributed revenue, unsubscribe-rate en of converters uit remarketing én mail dubbel getikt worden. Eén dashboard, één waarheid.",
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
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Cart-flow-check",
      title: "Stalker-mail-meter",
      intro:
        "Vink aan wat je herkent in jouw abandoned-cart flow. Hoe hoger, hoe meer irritatie en hoe minder herstel-omzet.",
      storageKey: "mm-cart-stalker",
      eventName: "cart_stalker_complete",
      sharePath: "/kennisbank/abandoned-cart-emails-die-converteren",
      scoreNoun: "stalkscore",
      ctaHref: "/diensten/email",
      ctaLabel: "E-mailflows",
      checks: [
        {
          id: "spam",
          label: "Drie of meer mails binnen een paar uur",
          fix: "Spreid: ~1 uur, ~1 dag, ~2–3 dagen. Ademruimte verkoopt.",
        },
        {
          id: "korting",
          label: "Eerste mail is meteen korting",
          fix: "Eerst helpen en bewijs. Korting trainen klanten om te wachten.",
        },
        {
          id: "generiek",
          label: "Beste klant + stockfoto, productblok ontbreekt of klopt niet",
          fix: "Product, prijs, checkout-link. Menselijke zin, geen brochure.",
        },
        {
          id: "exclude",
          label: "Recente kopers of al-betaald krijgen alsnog cart-mails",
          fix: "Exclude. Dubbel tikken voelt als stalken.",
        },
        {
          id: "checkout",
          label: "Checkout is traag of kosten verrassen, mail negeert dat",
          fix: "Fix shop eerst. Mail vangt twijfel, niet een kapotte funnel.",
        },
        {
          id: "tone",
          label: "Onderwerp schreeuwt JE BENT VERGETEN!!!!",
          fix: "Herinnering, geen paniek. Toon alsof je naast ze zit.",
        },
        {
          id: "meet",
          label: "Je stuurt op open rate, niet op herstel-omzet",
          fix: "Attributed revenue + unsubscribes. Open is vanity.",
        },
        {
          id: "proof",
          label: "Mail twee mist review, garantie of verzendclarity",
          fix: "Raak het echte bezwaar. Vergeet iets is zelden genoeg.",
        },
      ],
      tiers: [
        {
          id: "helper",
          min: 0,
          max: 24,
          label: "Behulpzame herinnering",
          quip: "Timing en toon kloppen. Houd marge en exclude heilig.",
        },
        {
          id: "ruw",
          min: 25,
          max: 49,
          label: "Ruw maar herstelbaar",
          quip: "Eén irritatie eruit deze sprint. Meet omzet, niet opens.",
        },
        {
          id: "stalk",
          min: 50,
          max: 74,
          label: "Raamklopper",
          quip: "Te snel, te luid, te generiek. Flow herschrijven vóór je volume jaagt.",
        },
        {
          id: "spam",
          min: 75,
          max: 100,
          label: "Spam met winkelwagen",
          quip: "Stop de cascade. Drie mails, menselijk, exclude. Dan pas opschalen.",
        },
      ],
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
        "Social proof ontbreekt: een review of garantie in mail twee kan twijfel breken.",
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
      text: "Bezwaar wegnemen: verzending, retour, waarom dit product. Bij professionele shops: waarom vakmensen dit gebruiken, niet waarom jij wanhopig omzet nodig hebt.",
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
      text: "Schrijf alsof je tegen iemand praat die je product al leuk vond. Een matraswinkel klinkt anders dan een beauty-brand. Dat hoort zo. Hey, je liet dit nog liggen werkt beter dan ACTIE VEREIST.",
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
      text: "Remarketing naast je cart-mail",
    },
    {
      type: "p",
      text: "Mail eerst, ads als tweede tap. Zelfde product, andere toon. Caps aan zodat je niet overal tegelijk schreeuwt. Converters uitsluiten. Cart-flow en remarketing horen bij één retentieplan, niet bij twee bureaus die elkaar niet kennen.",
    },
    {
      type: "ul",
      items: [
        "Mail: persoonlijk, product in beeld, bezwaren wegnemen.",
        "Ads: korte reminder, social proof, frequency cap.",
        "Uitsluitingen: gekocht, al in late flow, of te recent geopend zonder klik.",
        "Test: incentive alleen in mail 3 of alleen in ads, niet overal tegelijk.",
      ],
    },
    {
      type: "h2",
      text: "Tone of voice die niet schreeuwt",
    },
    {
      type: "p",
      text: "Schrijf alsof je een klant helpt die even afgeleid was. 'Je mand staat nog klaar' slaat harder aan dan 'Laatste kans!!!'. Rust en expertise passen bij een duur product. Professioneel en warm past bij B2B. De flow is techniek. De zin is merk.",
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
