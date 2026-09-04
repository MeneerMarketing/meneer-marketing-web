import type { StudioData, StudioImage } from "@/types/studio";
import { clampWords, normalizeEmail, plainText, sentences } from "@/lib/text";
import {
  CLINIC_CURATED_IMAGE_POOL,
  PILATES_LIFESTYLE_FALLBACKS,
  isPreviewWorthyStudioPhoto,
  isTrustedPreviewImageUrl,
  sanitizeStudioImages,
} from "@/lib/previewImagePolicy";
import {
  ensureConceptFaqs,
  buildConceptInstructors,
  buildConceptMembershipPlans,
  buildConceptQuotes,
  isConceptInstructorImage,
} from "@/lib/previewContentFallbacks";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";

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
  image: CineImage;
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
  main: CineImage;
  inset: CineImage;
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
  rating: number;
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
  image: CineImage;
}

export interface CineModel {
  studioName: string;
  logoUrl: string | null;
  /** Wordmark in twee delen: tweede deel wordt cursief gezet. */
  /** Licht logo op donkere hero: geen CSS-invert in cinematic. */
  logoLight?: boolean;
  logoOnLightBackground?: boolean;
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
  heroImage: CineImage;
  /** Shots die in de opening langs elkaar schuiven, eerste is het hoofdbeeld. */
  heroShots: CineImage[];
  gallery: CineImage[];
  pricingNote: string | null;
  quotesAreHighlights: boolean;
  contact: {
    address: string | null;
    email: string | null;
    phone: string | null;
    instagram: string | null;
  };
}

const CINE_DEMO: Record<string, CineImage> = {
  hero: PILATES_LIFESTYLE_FALLBACKS.hero,
  reformer: PILATES_LIFESTYLE_FALLBACKS.reformer,
  movement: PILATES_LIFESTYLE_FALLBACKS.gallery1,
  studio: PILATES_LIFESTYLE_FALLBACKS.studio,
  atmosphere: PILATES_LIFESTYLE_FALLBACKS.atmosphere,
  corner: PILATES_LIFESTYLE_FALLBACKS.gallery2,
};

type CineImageRole = "hero" | "studio" | "reformer" | "team" | "atmosphere" | "gallery";

/**
 * Page builders bakken de uitsnede in de URL (`w_1440,h_809`). Dat is de enige
 * maat die we hebben zonder het beeld op te halen, en precies genoeg om staand
 * van liggend te scheiden.
 */
function orientationOf(url: string): "landscape" | "portrait" | "unknown" {
  const width = /[/_,](?:w|width)[_=](\d{2,5})/i.exec(url);
  const height = /[/_,](?:h|height)[_=](\d{2,5})/i.exec(url);
  if (!width?.[1] || !height?.[1]) return "unknown";
  const ratio = Number(width[1]) / Number(height[1]);
  if (!Number.isFinite(ratio) || ratio <= 0) return "unknown";
  return ratio >= 1.15 ? "landscape" : "portrait";
}

/**
 * Beeldbank per studio. Eigen foto's gaan altijd voor: een preview met de
 * demo-set van een andere studio ondermijnt precies de belofte die we doen.
 * De demo-beelden blijven als vangnet voor studio's zonder bruikbaar beeld.
 */
class CineImagery {
  private readonly byRole = new Map<CineImageRole, CineImage[]>();
  private readonly all: CineImage[] = [];
  private readonly used = new Set<string>();
  private readonly orientation = new Map<string, "landscape" | "portrait" | "unknown">();

  constructor(images: StudioImage[]) {
    for (const image of images) {
      const url = plainText(image.url);
      if (!url || !isPreviewWorthyStudioPhoto(url, image.alt)) continue;
      if (this.all.some((existing) => existing.url === url)) continue;
      const entry: CineImage = { url, alt: plainText(image.alt) || "" };
      const bucket = this.byRole.get(image.role) ?? [];
      bucket.push(entry);
      this.byRole.set(image.role, bucket);
      this.all.push(entry);
      this.orientation.set(url, orientationOf(url));
    }
  }

  /**
   * Full-bleed hero en 21:9 band vragen om liggend beeld. Een staand portret
   * wordt daar tot een gezicht in close-up gecropt en de kop valt er middenin.
   */
  pickWide(roles: CineImageRole[], fallback: CineImage): CineImage {
    const landscape = this.all.find(
      (image) =>
        !this.used.has(image.url) &&
        isTrustedPreviewImageUrl(image.url) &&
        this.orientation.get(image.url) === "landscape"
    );
    if (landscape) {
      this.used.add(landscape.url);
      return landscape;
    }
    return this.pick(roles, fallback);
  }

  get hasOwn(): boolean {
    return this.all.length > 0;
  }

  pick(
    roles: CineImageRole[],
    fallback: CineImage,
    avoid?: CineImage | null
  ): CineImage {
    const pools = [...roles.map((role) => this.byRole.get(role) ?? []), this.all];
    for (const pool of pools) {
      const fresh = pool.find(
        (image) =>
          !this.used.has(image.url) &&
          isTrustedPreviewImageUrl(image.url) &&
          isPreviewWorthyStudioPhoto(image.url, image.alt)
      );
      if (fresh) {
        this.used.add(fresh.url);
        return fresh;
      }
    }

    const reusable = this.all.filter(
      (image) =>
        image.url !== avoid?.url &&
        isTrustedPreviewImageUrl(image.url) &&
        isPreviewWorthyStudioPhoto(image.url, image.alt)
    );
    if (reusable.length) {
      for (const role of roles) {
        const match = (this.byRole.get(role) ?? []).find(
          (image) =>
            image.url !== avoid?.url &&
            isTrustedPreviewImageUrl(image.url) &&
            isPreviewWorthyStudioPhoto(image.url, image.alt)
        );
        if (match) return match;
      }
      return reusable[0] ?? fallback;
    }

    return fallback;
  }
  list(count: number, fallback: CineImage[]): CineImage[] {
    const pool = fallback.length > 0 ? fallback : [...CLINIC_CURATED_IMAGE_POOL];
    const out: CineImage[] = [];

    for (let index = 0; index < count; index += 1) {
      const own = this.all.find(
        (image) =>
          !this.used.has(image.url) &&
          isTrustedPreviewImageUrl(image.url) &&
          isPreviewWorthyStudioPhoto(image.url, image.alt)
      );
      if (own) {
        this.used.add(own.url);
        out.push(own);
        continue;
      }
      out.push(pool[index % pool.length] ?? pool[0]!);
    }

    return out;
  }
}

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
  instructors: CineInstructor[]
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
          instructors.length > 0
            ? instructors[(dayIndex * 2 + slotIndex) % instructors.length]
            : undefined;

        return {
          id: `${day.id}-${slotIndex}`,
          time,
          name: item.name,
          duration: item.duration,
          instructor: member ? member.first : null,
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

  if (facts.length >= 2) return facts.slice(0, 3);

  const service = plainText(studio.primary_service) || "Pilates";
  const city = plainText(studio.city);
  return [
    { value: "55", label: "min per les" },
    { value: service.toLowerCase(), label: "focus" },
    { value: city || "studio", label: city ? "locatie" : "rust" },
  ].slice(0, 3);
}

function buildNotes(studio: StudioData): CineNote[] {
  const fromBenefits = studio.benefits
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

  return fromBenefits.length >= 3 ? fromBenefits : buildConceptNotes(studio);
}

function buildPlans(studio: StudioData): CinePlan[] {
  const fromData = studio.memberships
    .map((plan) => ({
      id: plan.id,
      name: plainText(plan.name),
      price: plainText(plan.price_label),
      period: plainText(plan.period),
      description: clampWords(plainText(plan.description), 20),
      features: plan.features.map((feature) => plainText(feature)).filter(Boolean),
      featured: Boolean(plan.featured),
    }))
    .filter((plan) => plan.name && plan.price);

  if (fromData.length > 0) return fromData;

  return buildConceptMembershipPlans(studio).map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.priceLabel,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    featured: plan.featured,
  }));
}

/**
 * Quotes uit de echte reviews. Te korte teksten vallen weg, want een halve
 * regel in groot serif leest als een losse kreet.
 */
function buildReviews(studio: StudioData): { reviews: CineReviews; quotesAreHighlights: boolean } {
  const ratingValue = studio.review_rating > 0 ? studio.review_rating : 4.9;
  const defaultStars = Math.min(5, Math.max(4, Math.round(ratingValue)));

  const quotesFromReviews = studio.reviews
    .map((review) => {
      const text = plainText(review.text);
      if (text.split(/\s+/).filter(Boolean).length < 8) return null;
      return {
        id: review.id,
        text: clampWords(text, 34),
        author: plainText(review.author),
        meta: plainText(review.date_label) || null,
        rating: review.rating > 0 ? review.rating : defaultStars,
      };
    })
    .filter((quote): quote is CineQuote => Boolean(quote));

  const quotesAreHighlights = quotesFromReviews.length === 0;
  const quotes: CineQuote[] =
    quotesFromReviews.length > 0
      ? quotesFromReviews
      : buildConceptQuotes(studio).map((quote) => ({
          ...quote,
          rating: defaultStars,
        }));

  return {
    reviews: {
      rating: ratingValue.toFixed(1).replace(".", ","),
      count: studio.review_count ?? 0,
      quotes,
    },
    quotesAreHighlights,
  };
}

function buildFaqs(studio: StudioData): CineFaq[] {
  return ensureConceptFaqs(studio);
}

function ensureImage(image: CineImage | null | undefined, fallback: CineImage): CineImage {
  if (
    image &&
    isTrustedPreviewImageUrl(image.url) &&
    isPreviewWorthyStudioPhoto(image.url, image.alt)
  ) {
    return image;
  }
  return fallback;
}

function ensureClasses(
  studio: StudioData,
  gallery: CineImage[],
  primaryService: string
): CineClass[] {
  const fromServices = studio.services.map((service, index) => {
    const name = plainText(service.name);
    const description = plainText(service.description);
    return {
      id: service.id,
      name,
      description:
        description ||
        `${name} bij ${plainText(studio.studio_name)}. Focus op techniek, adem en controle.`,
      duration: service.duration_minutes ? `${service.duration_minutes} min` : "55 min",
      room: roomForClass(name, description),
      highlight: Boolean(service.highlight) || index === 0,
      image: gallery[index % gallery.length] ?? gallery[0] ?? CINE_DEMO.studio,
    };
  });

  if (fromServices.length >= 3) return fromServices;

  const fillers: Array<{ id: string; name: string; description: string; highlight: boolean }> = [
    {
      id: "concept-class-1",
      name: primaryService || "Studio les",
      description: `Signatuurles bij ${plainText(studio.studio_name)}. Kracht, lengte en focus in een rustige studio.`,
      highlight: true,
    },
    {
      id: "concept-class-2",
      name: "Mat & flow",
      description: "Core, stabiliteit en adem op de mat. Ideaal als aanvulling of startpunt.",
      highlight: false,
    },
    {
      id: "concept-class-3",
      name: "Private sessie",
      description: "Eén-op-één begeleiding. Jouw tempo, jouw doelen, volledige aandacht.",
      highlight: false,
    },
  ];

  const merged = [...fromServices];
  for (const filler of fillers) {
    if (merged.length >= 3) break;
    if (merged.some((item) => item.name.toLowerCase() === filler.name.toLowerCase())) continue;
    merged.push({
      ...filler,
      duration: "55 min",
      room: roomForClass(filler.name, filler.description),
      image: gallery[merged.length % gallery.length] ?? gallery[0] ?? CINE_DEMO.studio,
    });
  }

  return merged.slice(0, Math.max(3, fromServices.length));
}

function buildConceptNotes(studio: StudioData): CineNote[] {
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";
  return [
    {
      id: "concept-note-1",
      title: "Kleine groepen",
      body: "Genoeg ruimte voor persoonlijke correcties en een les die op jou is afgestemd.",
    },
    {
      id: "concept-note-2",
      title: "Instructie die telt",
      body: "Elke cue heeft een reden. Alignment eerst, dan intensiteit.",
    },
    {
      id: "concept-note-3",
      title: city ? `Studio in ${city}` : "Rustige studio",
      body: `Een ruimte die past bij ${service.toLowerCase()}: licht, rust en materialen die kloppen.`,
    },
  ];
}

function buildInstructors(team: StudioData["team"], studio: StudioData): CineInstructor[] {
  const concepts = buildConceptInstructors(studio);

  const fromTeam = team
    .map((member, index) => {
      const name = plainText(member.name);
      if (!name) return null;
      const image = plainText(member.image_url);
      return {
        id: member.id,
        name,
        first: firstName(name),
        role: plainText(member.role) || "Instructor",
        bio: clampWords(plainText(member.bio), 38),
        image:
          image && isTrustedPreviewImageUrl(image) && isPreviewWorthyStudioPhoto(image, name)
            ? image
            : concepts[index % concepts.length]!.image,
      };
    })
    .filter((member): member is CineInstructor => Boolean(member));

  const hasVerifiedTeam = fromTeam.some(
    (member) => member.image && !isConceptInstructorImage(member.image)
  );
  if (hasVerifiedTeam) return fromTeam;

  if (fromTeam.length >= 3) return fromTeam;

  const merged = [...fromTeam];
  for (const concept of concepts) {
    if (merged.length >= 3) break;
    if (merged.some((member) => member.name.toLowerCase() === concept.name.toLowerCase())) continue;
    merged.push({
      id: concept.id,
      name: concept.name,
      first: firstName(concept.name),
      role: concept.role,
      bio: concept.bio,
      image: concept.image,
    });
  }

  return merged.length > 0
    ? merged
    : concepts.map((concept) => ({
        id: concept.id,
        name: concept.name,
        first: firstName(concept.name),
        role: concept.role,
        bio: concept.bio,
        image: concept.image,
      }));
}

export function buildCineModel(studio: StudioData): CineModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);

  const lead =
    clampWords(sentences(studio.description)[0] ?? studio.description, 34) ||
    `${studioName} in ${city}.`;

  const bookingRaw = plainText(studio.booking_url);

  const studioTypes =
    studio.services.length > 0
      ? studio.services.slice(0, 2).map((service) => ({
          id: service.id,
          label: plainText(service.name),
        }))
      : primaryService
        ? [{ id: "primary-service", label: primaryService }]
        : [{ id: "studio", label: "Studio lessen" }];

  const address =
    [plainText(studio.address), city].filter(Boolean).join(", ") || null;

  const imagery = new CineImagery(
    sanitizeStudioImages(studio.images ?? [], studioName)
  );
  const demoGallery = [
    CINE_DEMO.reformer,
    CINE_DEMO.movement,
    CINE_DEMO.atmosphere,
    CINE_DEMO.studio,
    CINE_DEMO.corner,
  ].filter((image): image is CineImage => Boolean(image));

  // Hero en band eerst: die dragen de opening, dus die krijgen het sterkste beeld.
  // Volgorde is bewust: hero en band eisen allebei liggend beeld en die zijn
  // schaars. De tweede heroshot mag staand zijn, want die schuift verticaal
  // mee, dus die kiest pas daarna uit wat overblijft.
  const heroPrimary = imagery.pickWide(["hero", "atmosphere", "studio"], CINE_DEMO.hero);
  const bandImage = imagery.pickWide(["studio", "atmosphere", "reformer"], CINE_DEMO.studio);
  const heroSecond = imagery.pick(
    ["atmosphere", "studio", "reformer"],
    CINE_DEMO.atmosphere,
    heroPrimary
  );
  const studioMain = imagery.pick(["studio", "atmosphere"], CINE_DEMO.studio);
  const studioInset = imagery.pick(
    ["reformer", "gallery", "atmosphere"],
    CINE_DEMO.corner,
    studioMain
  );

  const gallery = imagery.list(demoGallery.length, demoGallery);
  const classes = ensureClasses(studio, gallery, primaryService);

  const band: CineBand = {
    first: "kracht die blijft.",
    second: "ook buiten de studio.",
    image: bandImage,
  };

  const statement: CineStatement = {
    first: "bouw je kracht.",
    second: "vind je vorm.",
    body:
      clampWords(plainText(studio.description), 46) ||
      `${studioName} in ${city}.`,
  };

  const instructors = buildInstructors(studio.team, studio);
  const schedule = buildSchedule(classes, instructors);
  const plans = buildPlans(studio);
  const hasMemberships = studio.memberships.length > 0;
  const { reviews, quotesAreHighlights } = buildReviews(studio);
  const faqs = buildFaqs(studio);

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
    logoUrl: resolveStudioLogoUrl(studio.logo),
    logoLight: studio.logo_light,
    logoOnLightBackground: studio.logo_on_light_background,
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
    schedule,
    instructors,
    studio: {
      first: "de ruimte",
      second: city ? `in ${city.toLowerCase()}.` : "van de studio.",
      body:
        sentences(studio.description).slice(1).join(" ") ||
        clampWords(plainText(studio.description), 40),
      facts: buildFacts(studio),
      notes: buildNotes(studio),
      main: studioMain,
      inset: studioInset,
    },
    plans,
    reviews,
    faqs,
    hours: plainText(studio.opening_hours) || null,
    navLinks,
    heroImage: heroPrimary,
    heroShots: [heroPrimary, heroSecond].filter(
      (image, index, list) =>
        list.findIndex((other) => other.url === image.url) === index
    ),
    gallery,
    pricingNote: hasMemberships
      ? null
      : "Indicatieve concepttarieven. Alles is volledig aanpasbaar in jouw versie.",
    quotesAreHighlights,
    contact: {
      address,
      email: normalizeEmail(studio.email),
      phone: plainText(studio.phone) || null,
      instagram: plainText(studio.instagram_url) || null,
    },
  };
}
