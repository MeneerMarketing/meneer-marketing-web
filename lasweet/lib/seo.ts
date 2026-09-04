import { COOKIE_FLAVOURS, MATCHA_FLAVOURS } from "@/lib/menu-data";
import { absoluteUrl, SITE, siteUrl } from "@/lib/site";

export const HOME_TITLE =
  "Lá Sweet by Ela | Matcha en crumble cookies uit Enschede";

export const HOME_DESCRIPTION =
  "Handgemaakte crumble cookies en iced matcha, in kleine batches gemaakt door Ela in Enschede. Bekend van TikTok en Tubantia. Bestel jouw box.";

export const CONTACT_TITLE = "Contact | Lá Sweet by Ela";

export const CONTACT_DESCRIPTION =
  "Bezoek Lá Sweet in Enschede, Haaksbergerstraat 302. Walk-in op zaterdag, bestellen via Instagram DM. Volg @la.sweetbyela.";

export const ORDER_TITLE =
  "Bestellen | Cookies en matcha | Lá Sweet by Ela";

export const ORDER_DESCRIPTION =
  "Bestel crumble cookies en iced matcha bij Lá Sweet. Kies smaken en aantallen, stuur je aanvraag via Instagram DM. Afhalen in Enschede.";

export const MATCHA_LANDING_TITLE =
  "Matcha Enschede | Strawberry & iced | Lá Sweet by Ela";

export const MATCHA_LANDING_DESCRIPTION =
  "Matcha in Enschede bij Lá Sweet by Ela: iced matcha vanaf €5,50 en strawberry matcha €6,50. Vers opgeklopt aan Haaksbergerstraat 302. Walk-in zaterdag 14:00-20:00.";

export const COOKIES_LANDING_TITLE =
  "Koekjes Enschede | Crumble cookies | Lá Sweet by Ela";

export const COOKIES_LANDING_DESCRIPTION =
  "Koekjes en cookies in Enschede: handgemaakte crumble cookies van Lá Sweet by Ela. Cookie box vanaf 4 stuks, afhalen Haaksbergerstraat 302. Bekend uit Tubantia.";

export interface FaqItem {
  question: string;
  answer: string;
}

type JsonLd = Record<string, unknown>;

function postalAddress(): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE.streetAddress,
    addressLocality: SITE.addressLocality,
    addressRegion: SITE.addressRegion,
    postalCode: SITE.postalCode,
    addressCountry: SITE.addressCountry,
  };
}

/** LocalBusiness als Bakery + CafeOrCoffeeShop. Geen AggregateRating (geen echte reviews on-site). */
export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Bakery", "CafeOrCoffeeShop"],
    "@id": `${siteUrl}/#business`,
    name: SITE.name,
    alternateName: ["Lá Sweet", "La Sweet by Ela", "la.sweetbyela"],
    description: SITE.description,
    url: siteUrl,
    image: [
      absoluteUrl(SITE.ogImagePath),
      absoluteUrl("/photos/cookie-box-open.png"),
      absoluteUrl("/photos/cups-stack.png"),
    ],
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    hasMap: SITE.mapsSearch,
    sameAs: [SITE.instagram, SITE.tiktok],
    areaServed: {
      "@type": "City",
      name: "Enschede",
    },
    servesCuisine: ["Cookies", "Matcha", "Iced matcha"],
    priceRange: SITE.priceRange,
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Card",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "https://schema.org/Saturday",
      opens: SITE.walkInOpens,
      closes: SITE.walkInCloses,
    },
    subjectOf: {
      "@type": "NewsArticle",
      headline:
        "Ze zijn bijna te mooi om op te eten: de crumble cookies van Ela (19) zijn een hit in Enschede",
      url: SITE.tubantiaArticle,
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "Tubantia",
      },
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE.name,
    url: siteUrl,
    inLanguage: "nl-NL",
    description: SITE.description,
    publisher: { "@id": `${siteUrl}/#business` },
  };
}

export function webPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
}): JsonLd {
  const url = absoluteUrl(input.path === "/" ? "/" : input.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "nl-NL",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#business` },
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(isLast
          ? {}
          : { item: absoluteUrl(item.path === "/" ? "/" : item.path) }),
      };
    }),
  };
}

export function contactPageJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#contact`,
    url: absoluteUrl("/contact"),
    name: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    inLanguage: "nl-NL",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#business` },
  };
}

export function orderPageJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/bestellen")}#order`,
    url: absoluteUrl("/bestellen"),
    name: ORDER_TITLE,
    description: ORDER_DESCRIPTION,
    inLanguage: "nl-NL",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#business` },
    significantLink: SITE.instagram,
  };
}

/** FAQPage alleen gebruiken als de vragen zichtbaar op de pagina staan. */
export function faqPageJsonLdForPath(
  path: string,
  faqs: readonly FaqItem[],
): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    isPartOf: { "@id": `${url}#webpage` },
    about: { "@id": `${siteUrl}/#business` },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Menu-items met echte menukaartprijzen. Geen AggregateRating. */
export function matchaOfferListJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/matcha-enschede")}#matcha-menu`,
    name: "Iced matcha smaken bij Lá Sweet Enschede",
    numberOfItems: MATCHA_FLAVOURS.length,
    itemListElement: MATCHA_FLAVOURS.map((flavour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${absoluteUrl("/matcha-enschede")}#${flavour.id}`,
        name: flavour.name,
        description: flavour.blurb,
        brand: { "@id": `${siteUrl}/#business` },
        offers: {
          "@type": "Offer",
          price: flavour.price.replace(",", "."),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/matcha-enschede"),
          seller: { "@id": `${siteUrl}/#business` },
        },
      },
    })),
  };
}

/** Smakenlijst zonder nep-prijzen (cookies wisselen per batch). */
export function cookieFlavourListJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/koekjes-enschede")}#cookie-flavours`,
    name: "Crumble cookie smaken bij Lá Sweet Enschede",
    numberOfItems: COOKIE_FLAVOURS.length,
    itemListElement: COOKIE_FLAVOURS.map((flavour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${absoluteUrl("/koekjes-enschede")}#${flavour.id}`,
        name: `${flavour.name} crumble cookie`,
        description: flavour.blurb,
        brand: { "@id": `${siteUrl}/#business` },
      },
    })),
  };
}

export const MATCHA_FAQS: readonly FaqItem[] = [
  {
    question: "Waar drink ik de beste matcha in Enschede?",
    answer:
      "Bij Lá Sweet by Ela aan de Haaksbergerstraat 302 in Enschede. Ela klopt iced matcha en strawberry matcha vers op, in kleine batches. Walk-in op zaterdag van 14:00 tot 20:00, of bestel via Instagram DM.",
  },
  {
    question: "Wat kost iced matcha bij Lá Sweet?",
    answer:
      "Classic iced matcha kost €5,50. Flavored iced matcha zoals strawberry, blue, cherry, mango, vanilla en white chocolate kost €6,50. Melk kies je zelf: koemelk, haver, kokos of amandel.",
  },
  {
    question: "Is de strawberry matcha echt die van TikTok?",
    answer:
      "Ja. De layered strawberry matcha van Lá Sweet ging viral op TikTok. Dezelfde cup, dezelfde laagjes, gemaakt door Ela in Enschede. Kom kijken of stuur een DM voor je bestelling.",
  },
  {
    question: "Kan ik matcha meenemen zonder cookie box?",
    answer:
      "Zeker. Op zaterdag kun je walk-in binnenlopen voor alleen matcha. Pre-order via Instagram werkt ook als je zeker wilt zijn van jouw smaak.",
  },
  {
    question: "Welke melk kan ik kiezen bij mijn matcha?",
    answer:
      "Koemelk, havermelk, kokosmelk of amandelmelk. Elke iced matcha wordt per laagje opgebouwd, dus jouw melkkeuze zit er vanaf het begin in.",
  },
  {
    question: "Hoe bestel ik matcha vooraf?",
    answer:
      "Ga naar de bestelpagina, kies je smaken en stuur de aanvraag via Instagram DM naar @la.sweetbyela. Afhalen aan de Haaksbergerstraat 302 in Enschede.",
  },
];

export const COOKIES_FAQS: readonly FaqItem[] = [
  {
    question: "Waar koop ik de lekkerste koekjes in Enschede?",
    answer:
      "Bij Lá Sweet by Ela. Handgemaakte crumble cookies in kleine batches, bekend uit Tubantia en TikTok. Afhalen aan Haaksbergerstraat 302, of walk-in op zaterdag van 14:00 tot 20:00.",
  },
  {
    question: "Wat zijn crumble cookies?",
    answer:
      "Crumble cookies zijn zachte cookies met een dikke topping van crumble, crème of fruit. Bij Lá Sweet bak je smaken als Red velvet aardbei, Tiramisu, Brownie Kinder Bueno, Witte Kinder Bueno, Appel crumble, Lotus en Matcha.",
  },
  {
    question: "Hoe groot is een cookie box?",
    answer:
      "Je bestelt vanaf 4 cookies. Populair zijn boxes van 4, 8 of 12. Smaken mixen mag, handig voor verjaardagen of om te delen.",
  },
  {
    question: "Kan ik cookies bestellen zonder walk-in?",
    answer:
      "Ja. Stuur je bestelling via Instagram DM. Doordeweeks is pre-order de slimste route, dan staat jouw box klaar bij afhalen in Enschede.",
  },
  {
    question: "Staan de cookies van Ela in de krant?",
    answer:
      "Tubantia schreef over de crumble cookies van Ela: bijna te mooi om op te eten, en een hit in Enschede. Kleine batches, elke koek zelf gecheckt.",
  },
  {
    question: "Wat is het verschil tussen koekjes en cookies hier?",
    answer:
      "Zelfde snack, twee zoektermen. Of je nu koekjes Enschede of cookies Enschede googelt, bij Lá Sweet krijg je handgemaakte crumble cookies uit de oven van Ela.",
  },
];
