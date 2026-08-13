import type { StudioData } from "@/types/studio";
import { clampWords, plainText, sentences } from "@/lib/text";

/**
 * View-model voor template C — Cinematic Form.
 * Filmische magazine-stijl: grote serif, lowercase koppen, weinig maar
 * zwaarwegende elementen. Alleen echte studio-data, geen verzonnen claims.
 */

export interface CineImage {
  url: string;
  alt: string;
}

export interface CineNavLink {
  href: string;
  label: string;
}

export interface CineClass {
  id: string;
  name: string;
  description: string;
  duration: string | null;
  /** Ruimte-label rechtsboven in de kaart, zoals "reformer studio". */
  room: string;
  highlight: boolean;
  image: CineImage | null;
}

export interface CineSlot {
  id: string;
  time: string;
  name: string;
  duration: string | null;
  instructor: string | null;
  /** 0 betekent wachtlijst. Conceptbezetting, geen live beschikbaarheid. */
  spots: number;
}

export interface CineDay {
  id: string;
  /** Korte vorm voor de dagenrail, lowercase: "ma". */
  label: string;
  /** Volledige dag voor de kop boven de lijst: "maandag". */
  full: string;
  slots: CineSlot[];
}

export interface CineInstructor {
  id: string;
  name: string;
  first: string;
  role: string;
  bio: string;
  image: string;
}

export interface CineFact {
  value: string;
  label: string;
}

export interface CineNote {
  id: string;
  title: string;
  body: string;
}

export interface CineStudio {
  first: string;
  second: string;
  body: string;
  facts: CineFact[];
  notes: CineNote[];
  /** Groot beeld plus een kleiner beeld dat eroverheen valt. */
  main: CineImage | null;
  inset: CineImage | null;
}

export interface CinePlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
}

export interface CineQuote {
  id: string;
  text: string;
  author: string;
  meta: string | null;
}

export interface CineReviews {
  /** Cijfer met komma, zoals Nederlanders het lezen. */
  rating: string | null;
  count: number;
  quotes: CineQuote[];
}

export interface CineFaq {
  id: string;
  question: string;
  answer: string;
}

export interface CineStatement {
  first: string;
  second: string;
  body: string;
}

export interface CineBand {
  first: string;
  second: string;
  image: CineImage | null;
}

export interface CineModel {
  studioName: string;
  /** Wordmark in twee delen: tweede deel wordt cursief gezet. */
  wordmark: { head: string; tail: string };
  city: string;
  primaryService: string;
  /** Kop in twee regels, tweede regel cursief. */
  headline: { first: string; second: string };
  lead: string;
  booking: { href: string; external: boolean; label: string };
  /** Studio-typen als pills onder de kop. */
  studioTypes: { id: string; label: string }[];
  statement: CineStatement;
  band: CineBand;
  classes: CineClass[];
  schedule: CineDay[];
  instructors: CineInstructor[];
  studio: CineStudio;
  plans: CinePlan[];
  reviews: CineReviews;
  faqs: CineFaq[];
  hours: string | null;
  navLinks: CineNavLink[];
  heroImage: CineImage | null;
  /** Shots die in de opening langs elkaar schuiven, eerste is het hoofdbeeld. */
  heroShots: CineImage[];
  gallery: CineImage[];
  contact: {
    address: string | null;
    email: string | null;
    phone: string | null;
    instagram: string | null;
  };
}

const CINE_DEMO: Record<string, CineImage> = {
  hero: {
    url: "/demo/pilates-warm-hero.webp",
    alt: "Reformer les in warm studiolicht",
  },
  reformer: {
    url: "/demo/pilates-warm-reformer.webp",
    alt: "Reformer met leren bekleding",
  },
  movement: {
    url: "/demo/pilates-warm-movement.webp",
    alt: "Beweging op de reformer",
  },
  studio: {
    url: "/demo/pilates-warm-studio.webp",
    alt: "De studioruimte",
  },
  atmosphere: {
    url: "/demo/pilates-warm-atmosphere.webp",
    alt: "Sfeer in de studio",
  },
  corner: {
    url: "/demo/pilates-warm-corner.webp",
    alt: "Hoek van de studio",
  },
};

/** Splitst een naam zo dat het tweede deel cursief kan: "Studio" + "Forma". */
function splitWordmark(name: string): { head: string; tail: string } {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    const tail = words.pop() as string;
    return { head: words.join(" "), tail };
  }
  // Eén woord: knip halverwege, zoals area|form.
  const single = words[0] ?? name;
  if (single.length < 5) return { head: single, tail: "" };
  const cut = Math.ceil(single.length / 2);
  return { head: single.slice(0, cut), tail: single.slice(cut) };
}

/**
 * Zoekt de mooiste plek om af te breken: liefst vóór een klein functiewoord
 * rond het midden. Anders eindigt regel één op "met" en leest de kop krom.
 */
const BREAK_WORDS = new Set([
  "met",
  "voor",
  "in",
  "van",
  "die",
  "dat",
  "zonder",
  "op",
  "en",
  "bij",
  "tot",
]);

function findBreak(words: string[]): number {
  const middle = Math.ceil(words.length / 2);
  let best = middle;
  let bestDistance = Number.POSITIVE_INFINITY;

  words.forEach((word, index) => {
    if (index === 0 || index === words.length - 1) return;
    if (!BREAK_WORDS.has(word.toLowerCase())) return;
    const distance = Math.abs(index - middle);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });

  return best;
}

/**
 * Maakt van de tagline twee regels. De tweede regel is de cursieve helft en
 * krijgt een punt, zoals in een magazine-opening.
 */
function buildHeadline(
  tagline: string,
  service: string
): { first: string; second: string } {
  const raw = plainText(tagline).replace(/[.!]+$/, "");
  const words = raw.split(/\s+/).filter(Boolean);

  if (words.length >= 4) {
    return {
      first: words.slice(0, findBreak(words)).join(" "),
      second: `${words.slice(findBreak(words)).join(" ")}.`,
    };
  }

  if (raw) {
    return { first: raw, second: `${service || "pilates"} studio.` };
  }

  return { first: service || "pilates", second: "studio." };
}

/**
 * Bepaalt in welke ruimte een les hoort. Reformer-lessen krijgen de reformer
 * studio, matwork de mat studio, en alles wat beide raakt krijgt de combinatie.
 */
function roomForClass(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  const reformer = /reformer|toestel|machine/.test(text);
  const mat = /mat|vloer|matwork/.test(text);
  if (reformer && mat) return "mat / reformer studio";
  if (mat) return "mat studio";
  if (reformer) return "reformer studio";
  return "studio";
}

const CINE_WEEK = [
  { id: "ma", label: "ma", full: "maandag" },
  { id: "di", label: "di", full: "dinsdag" },
  { id: "wo", label: "wo", full: "woensdag" },
  { id: "do", label: "do", full: "donderdag" },
  { id: "vr", label: "vr", full: "vrijdag" },
  { id: "za", label: "za", full: "zaterdag" },
  { id: "zo", label: "zo", full: "zondag" },
] as const;

const CINE_WEEKDAY_TIMES = ["07:00", "09:15", "12:15", "18:00", "19:30"];
const CINE_SATURDAY_TIMES = ["08:30", "10:00", "11:30"];
const CINE_SUNDAY_TIMES = ["09:30", "11:00"];

/** Voornaam, want in het rooster leest een volledige naam te zwaar. */
function firstName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean)[0] ?? name;
}

/**
 * Conceptrooster: tijden en bezetting zijn een voorbeeld, lesnamen en
 * instructeurs komen uit de echte studiodata. Bewust deterministisch, zodat
 * server en client exact hetzelfde renderen.
 */
function buildSchedule(
  classes: CineClass[],
  team: StudioData["team"]
): CineDay[] {
  if (classes.length === 0) return [];

  return CINE_WEEK.map((day, dayIndex) => {
    const times =
      dayIndex === 5
        ? CINE_SATURDAY_TIMES
        : dayIndex === 6
          ? CINE_SUNDAY_TIMES
          : CINE_WEEKDAY_TIMES;

    return {
      id: day.id,
      label: day.label,
      full: day.full,
      slots: times.map((time, slotIndex) => {
        const item = classes[(dayIndex + slotIndex) % classes.length]!;
        const member =
          team.length > 0 ? team[(dayIndex * 2 + slotIndex) % team.length] : undefined;

        return {
          id: `${day.id}-${slotIndex}`,
          time,
          name: item.name,
          duration: item.duration,
          instructor: member ? firstName(plainText(member.name)) : null,
          spots: (dayIndex * 3 + slotIndex * 4) % 7,
        };
      }),
    };
  });
}

/**
 * Cijfers over de studio: alleen wat in de data staat. Ontbreekt een waarde,
 * dan valt de kolom weg in plaats van dat er een schatting in komt.
 */
function buildFacts(studio: StudioData): CineFact[] {
  const facts: CineFact[] = [];

  if (studio.founded_year) {
    facts.push({ value: String(studio.founded_year), label: "sinds" });
  }
  if (studio.review_rating) {
    facts.push({
      value: studio.review_rating.toFixed(1).replace(".", ","),
      label: studio.review_count ? `${studio.review_count} reviews` : "beoordeling",
    });
  }
  if (studio.services.length > 0) {
    facts.push({ value: String(studio.services.length), label: "lestypen" });
  }

  return facts.slice(0, 3);
}

function buildNotes(studio: StudioData): CineNote[] {
  return studio.benefits
    .map((benefit) => {
      const title = plainText(benefit.title);
      if (!title) return null;
      return {
        id: benefit.id,
        title,
        body: clampWords(plainText(benefit.description), 22),
      };
    })
    .filter((note): note is CineNote => Boolean(note))
    .slice(0, 4);
}

function buildPlans(studio: StudioData): CinePlan[] {
  return studio.memberships.map((plan) => ({
    id: plan.id,
    name: plainText(plan.name),
    price: plainText(plan.price_label),
    period: plainText(plan.period),
    description: clampWords(plainText(plan.description), 20),
    features: plan.features.map((feature) => plainText(feature)).filter(Boolean),
    featured: Boolean(plan.featured),
  }));
}

/**
 * Quotes uit de echte reviews. Te korte teksten vallen weg, want een halve
 * regel in groot serif leest als een losse kreet.
 */
function buildReviews(studio: StudioData): CineReviews {
  const quotes = studio.reviews
    .map((review) => {
      const text = plainText(review.text);
      if (text.split(/\s+/).filter(Boolean).length < 8) return null;
      return {
        id: review.id,
        text: clampWords(text, 34),
        author: plainText(review.author),
        meta: plainText(review.date_label) || null,
      };
    })
    .filter((quote): quote is CineQuote => Boolean(quote));

  return {
    rating: studio.review_rating
      ? studio.review_rating.toFixed(1).replace(".", ",")
      : null,
    count: studio.review_count ?? 0,
    quotes,
  };
}

function buildFaqs(studio: StudioData): CineFaq[] {
  return studio.faqs
    .map((faq) => {
      const question = plainText(faq.question);
      const answer = plainText(faq.answer);
      if (!question || !answer) return null;
      return { id: faq.id, question, answer };
    })
    .filter((faq): faq is CineFaq => Boolean(faq));
}

function buildInstructors(team: StudioData["team"]): CineInstructor[] {
  return team
    .map((member) => {
      const name = plainText(member.name);
      if (!name) return null;
      return {
        id: member.id,
        name,
        first: firstName(name),
        role: plainText(member.role),
        bio: clampWords(plainText(member.bio), 38),
        image: member.image_url,
      };
    })
    .filter((member): member is CineInstructor => Boolean(member));
}

export function buildCineModel(studio: StudioData): CineModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);

  const lead =
    clampWords(sentences(studio.description)[0] ?? studio.description, 34) ||
    `${studioName} in ${city}.`;

  const bookingRaw = plainText(studio.booking_url);

  const studioTypes = studio.services.slice(0, 2).map((service) => ({
    id: service.id,
    label: plainText(service.name),
  }));

  const address =
    [plainText(studio.address), city].filter(Boolean).join(", ") || null;

  const gallery = [
    CINE_DEMO.reformer,
    CINE_DEMO.movement,
    CINE_DEMO.atmosphere,
    CINE_DEMO.studio,
    CINE_DEMO.corner,
  ].filter((image): image is CineImage => Boolean(image));

  const classes: CineClass[] = studio.services.map((service, index) => {
    const name = plainText(service.name);
    const description = plainText(service.description);
    return {
      id: service.id,
      name,
      description,
      duration: service.duration_minutes
        ? `${service.duration_minutes} min`
        : null,
      room: roomForClass(name, description),
      highlight: Boolean(service.highlight),
      image: gallery.length > 0 ? gallery[index % gallery.length]! : null,
    };
  });

  const band: CineBand = {
    first: "kracht die blijft.",
    second: "ook buiten de studio.",
    // Liggend beeld: een portret wordt in een 21:9 band een abstracte uitsnede.
    // De studiofoto komt verderop nog terug, maar dan in kleur en drie secties
    // later, dus de herhaling valt niet op.
    image: CINE_DEMO.studio ?? CINE_DEMO.atmosphere ?? null,
  };

  const statement: CineStatement = {
    first: "bouw je kracht.",
    second: "vind je vorm.",
    body:
      clampWords(plainText(studio.description), 46) ||
      `${studioName} in ${city}.`,
  };

  const navLinks: CineNavLink[] = [
    { href: "#top", label: "Home" },
    { href: "#lessen", label: "Lessen" },
    { href: "#rooster", label: "Rooster" },
    { href: "#instructors", label: "Instructors" },
    { href: "#studio", label: "De studio" },
    { href: "#tarieven", label: "Tarieven" },
    { href: "#ervaringen", label: "Ervaringen" },
    { href: "#faq", label: "Vragen" },
    { href: "#contact", label: "Contact" },
  ];

  return {
    studioName,
    wordmark: splitWordmark(studioName),
    city,
    primaryService,
    headline: buildHeadline(studio.tagline, primaryService),
    lead,
    booking: {
      href: bookingRaw || "#contact",
      external: Boolean(bookingRaw),
      label: "Boek een les",
    },
    studioTypes,
    statement,
    band,
    classes,
    schedule: buildSchedule(classes, studio.team),
    instructors: buildInstructors(studio.team),
    studio: {
      first: "de ruimte",
      second: city ? `in ${city.toLowerCase()}.` : "van de studio.",
      body:
        sentences(studio.description).slice(1).join(" ") ||
        clampWords(plainText(studio.description), 40),
      facts: buildFacts(studio),
      notes: buildNotes(studio),
      main: CINE_DEMO.studio ?? null,
      inset: CINE_DEMO.corner ?? CINE_DEMO.reformer ?? null,
    },
    plans: buildPlans(studio),
    reviews: buildReviews(studio),
    faqs: buildFaqs(studio),
    hours: plainText(studio.opening_hours) || null,
    navLinks,
    heroImage: CINE_DEMO.hero ?? null,
    // Alleen shots met een rustige onderhoek: de kop staat er half over, dus
    // een close-up met lichte vlakken maakt de tekst onleesbaar.
    heroShots: [CINE_DEMO.hero, CINE_DEMO.atmosphere].filter(
      (image): image is CineImage => Boolean(image)
    ),
    gallery,
    contact: {
      address,
      email: plainText(studio.email) || null,
      phone: plainText(studio.phone) || null,
      instagram: plainText(studio.instagram_url) || null,
    },
  };
}
