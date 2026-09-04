/** Canonieke menudata voor landings, pickers en JSON-LD (prijzen = menukaart). */

export interface MatchaFlavour {
  id: string;
  name: string;
  shortName: string;
  price: string;
  blurb: string;
  highlight?: boolean;
  vibe: string;
}

export interface MilkOption {
  id: string;
  label: string;
}

export interface CookieFlavour {
  id: string;
  name: string;
  tag: string;
  blurb: string;
}

export const MATCHA_FLAVOURS: readonly MatchaFlavour[] = [
  {
    id: "classic",
    name: "Iced matcha",
    shortName: "Classic",
    price: "5,50",
    blurb:
      "De basis. Ceremonial vibes, ijs, melk naar keuze. Heldere matcha die nog steeds fris blijft als je door Enschede loopt.",
    vibe: "puur & groen",
  },
  {
    id: "blue",
    name: "Iced blue matcha",
    shortName: "Blue",
    price: "6,50",
    blurb:
      "Met smaak naar keuze. Zacht zoet, Instagram-vriendelijk, nog steeds echt matcha.",
    vibe: "dreamy blue",
  },
  {
    id: "cherry",
    name: "Iced cherry matcha",
    shortName: "Cherry",
    price: "6,50",
    blurb:
      "Kers bovenop die groene kick. Zoet, een beetje speels, perfect bij een cookie.",
    vibe: "rood & groen",
  },
  {
    id: "mango",
    name: "Iced mango matcha",
    shortName: "Mango",
    price: "6,50",
    blurb:
      "Tropisch laagje, koude matcha eronder. Alsof je even weg bent van de Haaksbergerstraat.",
    vibe: "zomers",
  },
  {
    id: "vanilla",
    name: "Iced vanilla matcha",
    shortName: "Vanilla",
    price: "6,50",
    blurb:
      "Vanille maakt de matcha romiger. De safe pick als je twijfelt, maar nog steeds bijzonder.",
    vibe: "soft classic",
  },
  {
    id: "strawberry",
    name: "Iced strawberry matcha",
    shortName: "Strawberry",
    price: "6,50",
    blurb:
      "De viral. Roze laagjes, aardbei, matcha. TikTok kent hem, Enschede drinkt hem bij Lá Sweet.",
    highlight: true,
    vibe: "the viral",
  },
  {
    id: "white-chocolate",
    name: "Iced white chocolate matcha",
    shortName: "White choco",
    price: "6,50",
    blurb:
      "Witte chocolade en matcha in één cup. Zoet, zacht, gevaarlijk makkelijk leeg.",
    vibe: "dessert drink",
  },
] as const;

export const MILK_OPTIONS: readonly MilkOption[] = [
  { id: "koe", label: "Koemelk" },
  { id: "haver", label: "Haver" },
  { id: "kokos", label: "Kokos" },
  { id: "amandel", label: "Amandel" },
] as const;

export const COOKIE_FLAVOURS: readonly CookieFlavour[] = [
  {
    id: "red-velvet-aardbei",
    name: "Red velvet aardbei",
    tag: "aardbei",
    blurb:
      "Fluweelrood met witte chocolade, slagroomswirl en verse aardbei. Bijna te mooi om op te eten.",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    tag: "koffie",
    blurb:
      "Zacht koekje met mascarpone-vibes, cacao en een hint koffie. Dessert in cookie-vorm.",
  },
  {
    id: "brownie-kinder-bueno",
    name: "Brownie Kinder Bueno",
    tag: "chocolade",
    blurb:
      "Brownie-basis met Kinder Bueno erop. Dik, zoet, gevaarlijk makkelijk leeg.",
  },
  {
    id: "witte-kinder-bueno",
    name: "Witte Kinder Bueno",
    tag: "witte chocolade",
    blurb:
      "Witte chocolade en Bueno in één hap. Luchtig, zoet, Instagram-waardig.",
  },
  {
    id: "appel-crumble",
    name: "Appel crumble",
    tag: "kaneel",
    blurb:
      "Warme kaneelappel met krokante crumble op een boterig koekje. Appeltaart, maar dan cookie.",
  },
  {
    id: "lotus",
    name: "Lotus",
    tag: "karamel",
    blurb:
      "Lotus Speculoos-vibes: karamel, krokant, zacht vanbinnen. De comfort pick.",
  },
  {
    id: "matcha-cookie",
    name: "Matcha",
    tag: "matcha",
    blurb:
      "Groene matcha in cookie-vorm. Niet te zoet, wel bijzonder. Voor de matcha-fans.",
  },
] as const;

export const BOX_SIZES = [4, 8, 12] as const;
